// Groq integration — the second free-tier LLM tier. Tried after Gemini
// (independent quota, so if Gemini's daily free allowance is exhausted this
// can often still serve the request) and before the deterministic
// rule-based fallback. Same two-pass shape as gemini.ts, translated to
// Groq's OpenAI-compatible chat-completions API.

import Groq from 'groq-sdk'
import { CHAT_TOOLS, executeTool, type ToolDef } from '@/lib/chat/tools'
import { vehicleLabelList } from '@/lib/chat/knowledge'
import { buildSystemPrompt } from '@/lib/chat/prompt'
import type { ChatTurn, ConversationState, ChatAction, ChatIntent } from '@/lib/chat/types'

// Groq decommissioned llama-3.1-8b-instant and llama-3.3-70b-versatile on
// 2026-08-16; these are its recommended replacements. Overridable from the
// environment so the next retirement is a settings change, not a code change.
const EXTRACTION_MODEL = process.env.GROQ_EXTRACTION_MODEL || 'openai/gpt-oss-20b'
const RESPONSE_MODEL = process.env.GROQ_RESPONSE_MODEL || 'openai/gpt-oss-120b'

// gpt-oss models reason before answering; keep that short so it can't eat the
// token budget and leave an empty reply. Other models reject this parameter.
function reasoningParams(model: string): { reasoning_effort?: 'low' } {
  return model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}
}
const MAX_TOOL_ITERATIONS = 4
const REQUEST_TIMEOUT_MS = 10_000

export class GroqUnavailableError extends Error {
  quotaExceeded: boolean
  constructor(message: string, quotaExceeded: boolean) {
    super(message)
    this.name = 'GroqUnavailableError'
    this.quotaExceeded = quotaExceeded
  }
}

function isQuotaError(err: unknown): boolean {
  const anyErr = err as { status?: number; message?: string } | undefined
  const msg = String(anyErr?.message ?? err ?? '').toLowerCase()
  return anyErr?.status === 429 || msg.includes('rate_limit') || msg.includes('rate limit') || msg.includes('quota')
}

function toGroqTools(tools: ToolDef[]): Groq.Chat.Completions.ChatCompletionTool[] {
  return tools.map(t => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.input_schema },
  }))
}

function toGroqMessages(turns: ChatTurn[]): Groq.Chat.Completions.ChatCompletionMessageParam[] {
  return turns.map(t => ({ role: t.role, content: t.content }))
}

function getClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new GroqUnavailableError('GROQ_API_KEY not set', false)
  // The SDK retries twice by default and honours long retry-after headers on
  // 429s. The rules engine is the fallback here, so fail fast instead.
  return new Groq({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 })
}

const INTENTS: ChatIntent[] = [
  'new_booking_enquiry', 'pricing_enquiry', 'availability_enquiry', 'vehicle_or_service_question',
  'existing_booking', 'rescheduling_or_cancellation', 'complaint', 'aftercare_question',
  'package_recommendation', 'coverage_enquiry', 'general_business_question', 'human_assistance_request', 'other',
]

export async function extractEntitiesGroq(
  state: ConversationState,
  recentTurns: ChatTurn[],
  latestMessage: string,
): Promise<Record<string, unknown>> {
  const client = getClient()
  const extractFn: Groq.Chat.Completions.ChatCompletionTool = {
    type: 'function',
    function: {
      name: 'extract_state',
      description: 'Record any customer facts newly given or changed in the latest message. Use null / empty arrays for anything not mentioned.',
      parameters: {
        type: 'object',
        properties: {
          customerName: { type: ['string', 'null'] },
          phone: { type: ['string', 'null'] },
          email: { type: ['string', 'null'] },
          postcode: { type: ['string', 'null'] },
          vehicleRegistration: { type: ['string', 'null'] },
          vehicleMake: { type: ['string', 'null'] },
          vehicleModel: { type: ['string', 'null'] },
          vehicleYear: { type: ['string', 'null'] },
          intent: { type: ['string', 'null'], enum: [...INTENTS, null] },
          service: { type: ['string', 'null'] },
          package: { type: ['string', 'null'] },
          requestedDate: { type: ['string', 'null'] },
          requestedTime: { type: ['string', 'null'] },
          newExtras: { type: 'array', items: { type: 'string' } },
          newCollectedFacts: { type: 'array', items: { type: 'string' } },
          newUnresolvedQuestions: { type: 'array', items: { type: 'string' } },
        },
        required: ['intent'],
      },
    },
  }

  try {
    const completion = await client.chat.completions.create({
      model: EXTRACTION_MODEL,
      ...reasoningParams(EXTRACTION_MODEL),
      temperature: 0.1,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: `Extract new customer facts from a car-detailing chat. Current known state (don't repeat what's already known unless it changed): ${JSON.stringify(state)}. Vehicle size categories in use: ${vehicleLabelList()}. Always call extract_state.` },
        ...toGroqMessages(recentTurns.slice(-6)),
        { role: 'user', content: latestMessage },
      ],
      tools: [extractFn],
      tool_choice: { type: 'function', function: { name: 'extract_state' } },
    })
    const call = completion.choices[0]?.message?.tool_calls?.[0]
    if (!call) return {}
    return JSON.parse(call.function.arguments)
  } catch (err) {
    if (isQuotaError(err)) throw new GroqUnavailableError('Groq quota exceeded during extraction', true)
    console.error('[groq] extraction pass failed:', err)
    return {}
  }
}

export async function updateSummaryGroq(previousSummary: string, overflow: ChatTurn[]): Promise<string> {
  const client = getClient()
  try {
    const completion = await client.chat.completions.create({
      model: EXTRACTION_MODEL,
      ...reasoningParams(EXTRACTION_MODEL),
      temperature: 0.2,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: 'Update the running summary of a customer-service chat so far. Keep it short (max ~120 words) but preserve every concrete fact (names, vehicle, postcode, prices discussed, decisions made, concerns raised). Do not lose facts from the previous summary.' },
        { role: 'user', content: `Previous summary: ${previousSummary || '(none yet)'}\n\nEarlier messages to fold in:\n${overflow.map(t => `${t.role}: ${t.content}`).join('\n')}\n\nWrite the updated summary.` },
      ],
    })
    return completion.choices[0]?.message?.content?.trim() || previousSummary
  } catch (err) {
    if (isQuotaError(err)) throw new GroqUnavailableError('Groq quota exceeded during summarization', true)
    console.error('[groq] summarization failed:', err)
    return previousSummary
  }
}


export interface GroqResponseResult {
  text: string
  action: ChatAction
  escalationReason?: string
  bookingSummary?: string
}

export async function generateResponseGroq(
  state: ConversationState,
  recentTurns: ChatTurn[],
  latestMessage: string,
): Promise<GroqResponseResult> {
  const client = getClient()
  const tools = toGroqTools(CHAT_TOOLS)
  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt(state) },
    ...toGroqMessages(recentTurns),
    { role: 'user', content: latestMessage },
  ]
  const baseMessages = [...messages]

  let action: ChatAction = null
  let escalationReason: string | undefined
  let bookingSummary: string | undefined

  try {
    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const completion = await client.chat.completions.create({
        model: RESPONSE_MODEL,
        ...reasoningParams(RESPONSE_MODEL),
        temperature: 0.4,
        max_tokens: 2048,
        messages,
        tools,
      })

      const choice = completion.choices[0]
      const calls = choice?.message?.tool_calls ?? []
      if (calls.length === 0) {
        return { text: choice?.message?.content?.trim() || '', action, escalationReason, bookingSummary }
      }

      messages.push({ role: 'assistant', content: choice.message.content ?? null, tool_calls: calls })

      for (const call of calls) {
        let args: Record<string, unknown> = {}
        try { args = JSON.parse(call.function.arguments) } catch { /* leave empty on malformed args */ }
        const result = executeTool(call.function.name, args)
        if (result.action === 'human_escalated') {
          action = { type: 'human_escalated' }
          escalationReason = result.escalationReason
        } else if (result.action === 'open_booking') {
          action = { type: 'open_booking' }
          bookingSummary = JSON.stringify(result.output)
        }
        messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result.output) })
      }
    }

    return { text: '', action, escalationReason, bookingSummary }
  } catch (err) {
    if (isQuotaError(err)) throw new GroqUnavailableError('Groq quota exceeded during response generation', true)
    // A rejected tool call shouldn't cost the customer a real answer: retry
    // once without tools, answering from the knowledge in the system prompt.
    try {
      const plain = await client.chat.completions.create({
        model: RESPONSE_MODEL,
        ...reasoningParams(RESPONSE_MODEL),
        temperature: 0.4,
        max_tokens: 2048,
        messages: baseMessages,
      })
      const text = plain.choices[0]?.message?.content?.trim()
      if (text) return { text, action, escalationReason, bookingSummary }
    } catch (retryErr) {
      if (isQuotaError(retryErr)) throw new GroqUnavailableError('Groq quota exceeded during response generation', true)
    }
    throw new GroqUnavailableError(`Groq call failed: ${err}`, false)
  }
}

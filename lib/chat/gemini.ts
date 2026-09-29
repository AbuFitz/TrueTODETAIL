// Gemini integration for the chat assistant — the free-tier primary path.
// Mirrors the same two-pass architecture (cheap extraction + tool-using
// response generation) as the rest of lib/chat/, translated to Gemini's
// SDK shapes. Any failure here (quota exhausted, auth, network, unexpected
// response shape) should be caught by the caller and treated as "fall back
// to the rule-based assistant" — this module never silently invents a reply.

import { GoogleGenAI, FunctionCallingConfigMode, type Content } from '@google/genai'
import { CHAT_TOOLS, executeTool, type ToolDef } from '@/lib/chat/tools'
import { vehicleLabelList } from '@/lib/chat/knowledge'
import { buildSystemPrompt } from '@/lib/chat/prompt'
import type { ChatTurn, ConversationState, ChatAction, ChatIntent } from '@/lib/chat/types'

// Free-tier Gemini models (Google AI Studio, no billing required within quota).
// Overridable from the environment so a model retirement is a settings change,
// not a code change. Defaults are Google's current stable free-tier models.
const EXTRACTION_MODEL = process.env.GEMINI_EXTRACTION_MODEL || 'gemini-3.5-flash-lite'
const RESPONSE_MODEL = process.env.GEMINI_RESPONSE_MODEL || 'gemini-3.8-flash'
const MAX_TOOL_ITERATIONS = 4
const REQUEST_TIMEOUT_MS = 10_000

export class GeminiUnavailableError extends Error {
  quotaExceeded: boolean
  constructor(message: string, quotaExceeded: boolean) {
    super(message)
    this.name = 'GeminiUnavailableError'
    this.quotaExceeded = quotaExceeded
  }
}

function isQuotaError(err: unknown): boolean {
  const anyErr = err as { status?: number; code?: number; message?: string } | undefined
  const status = anyErr?.status ?? anyErr?.code
  const msg = String(anyErr?.message ?? err ?? '')
  return status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.toLowerCase().includes('quota')
}

function toGeminiFunctionDeclarations(tools: ToolDef[]) {
  return tools.map(t => ({
    name: t.name,
    description: t.description,
    parametersJsonSchema: t.input_schema,
  }))
}

function toGeminiContents(turns: ChatTurn[]): Content[] {
  return turns.map(t => ({
    role: t.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: t.content }],
  }))
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new GeminiUnavailableError('GEMINI_API_KEY not set', false)
  // No retries (the SDK only retries when asked) and a per-request timeout,
  // so a slow call hands over to Groq instead of stalling the customer.
  return new GoogleGenAI({ apiKey, httpOptions: { timeout: REQUEST_TIMEOUT_MS } })
}

const INTENTS: ChatIntent[] = [
  'new_booking_enquiry', 'pricing_enquiry', 'availability_enquiry', 'vehicle_or_service_question',
  'existing_booking', 'rescheduling_or_cancellation', 'complaint', 'aftercare_question',
  'package_recommendation', 'coverage_enquiry', 'general_business_question', 'human_assistance_request', 'other',
]

// Pass 1 — cheap structured extraction, forced to call the single tool so the
// output is always well-formed JSON rather than free text we'd have to parse.
export async function extractEntitiesGemini(
  state: ConversationState,
  recentTurns: ChatTurn[],
  latestMessage: string,
): Promise<Record<string, unknown>> {
  const ai = getClient()
  const extractFn = {
    name: 'extract_state',
    description: 'Record any customer facts newly given or changed in the latest message. Use null / empty arrays for anything not mentioned.',
    parametersJsonSchema: {
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
      required: [
        'customerName', 'phone', 'email', 'postcode', 'vehicleRegistration', 'vehicleMake', 'vehicleModel', 'vehicleYear',
        'intent', 'service', 'package', 'requestedDate', 'requestedTime', 'newExtras', 'newCollectedFacts', 'newUnresolvedQuestions',
      ],
    },
  }

  try {
    const response = await ai.models.generateContent({
      model: EXTRACTION_MODEL,
      contents: [
        ...toGeminiContents(recentTurns.slice(-6)),
        { role: 'user', parts: [{ text: latestMessage }] },
      ],
      config: {
        systemInstruction: `Extract new customer facts from a car-detailing chat. Current known state (don't repeat what's already known unless it changed): ${JSON.stringify(state)}. Vehicle size categories in use: ${vehicleLabelList()}.`,
        tools: [{ functionDeclarations: [extractFn] }],
        toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.ANY, allowedFunctionNames: ['extract_state'] } },
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    })
    const call = response.functionCalls?.[0]
    return (call?.args as Record<string, unknown>) ?? {}
  } catch (err) {
    if (isQuotaError(err)) throw new GeminiUnavailableError('Gemini quota exceeded during extraction', true)
    console.error('[gemini] extraction pass failed:', err)
    return {}
  }
}

export async function updateSummaryGemini(previousSummary: string, overflow: ChatTurn[]): Promise<string> {
  const ai = getClient()
  try {
    const response = await ai.models.generateContent({
      model: EXTRACTION_MODEL,
      contents: [{
        role: 'user',
        parts: [{ text: `Previous summary: ${previousSummary || '(none yet)'}\n\nEarlier messages to fold in:\n${overflow.map(t => `${t.role}: ${t.content}`).join('\n')}\n\nWrite the updated summary.` }],
      }],
      config: {
        systemInstruction: 'Update the running summary of a customer-service chat so far. Keep it short (max ~120 words) but preserve every concrete fact (names, vehicle, postcode, prices discussed, decisions made, concerns raised). Do not lose facts from the previous summary.',
        temperature: 0.2,
        maxOutputTokens: 512,
      },
    })
    return response.text?.trim() || previousSummary
  } catch (err) {
    if (isQuotaError(err)) throw new GeminiUnavailableError('Gemini quota exceeded during summarization', true)
    console.error('[gemini] summarization failed:', err)
    return previousSummary
  }
}


export interface GeminiResponseResult {
  text: string
  action: ChatAction
  escalationReason?: string
  bookingSummary?: string
}

// Pass 2 — response generation with tool access, looping on function calls.
export async function generateResponseGemini(
  state: ConversationState,
  recentTurns: ChatTurn[],
  latestMessage: string,
): Promise<GeminiResponseResult> {
  const ai = getClient()
  const functionDeclarations = toGeminiFunctionDeclarations(CHAT_TOOLS)
  const contents: Content[] = [
    ...toGeminiContents(recentTurns),
    { role: 'user', parts: [{ text: latestMessage }] },
  ]
  const baseContents = [...contents]

  let action: ChatAction = null
  let escalationReason: string | undefined
  let bookingSummary: string | undefined

  try {
    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await ai.models.generateContent({
        model: RESPONSE_MODEL,
        contents,
        config: {
          systemInstruction: buildSystemPrompt(state),
          tools: [{ functionDeclarations }],
          toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO } },
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      })

      const calls = response.functionCalls ?? []
      if (calls.length === 0) {
        return { text: response.text?.trim() || '', action, escalationReason, bookingSummary }
      }

      // Echo the model's own turn (including its function call parts) back into history.
      const modelContent = response.candidates?.[0]?.content
      contents.push(modelContent ? { role: 'model', parts: modelContent.parts ?? [] } : { role: 'model', parts: [] })

      const responseParts: NonNullable<Content['parts']> = []
      for (const call of calls) {
        const result = executeTool(call.name ?? '', (call.args as Record<string, unknown>) ?? {})
        if (result.action === 'human_escalated') {
          action = { type: 'human_escalated' }
          escalationReason = result.escalationReason
        } else if (result.action === 'open_booking') {
          action = { type: 'open_booking' }
          bookingSummary = JSON.stringify(result.output)
        }
        responseParts.push({
          functionResponse: { name: call.name, response: { result: result.output } },
        })
      }
      contents.push({ role: 'user', parts: responseParts })
    }

    return { text: '', action, escalationReason, bookingSummary }
  } catch (err) {
    if (isQuotaError(err)) throw new GeminiUnavailableError('Gemini quota exceeded during response generation', true)
    // A rejected tool schema shouldn't cost the customer a real answer: retry
    // once without tools, answering from the knowledge in the system prompt.
    try {
      const plain = await ai.models.generateContent({
        model: RESPONSE_MODEL,
        contents: baseContents,
        config: { systemInstruction: buildSystemPrompt(state), temperature: 0.4, maxOutputTokens: 1024 },
      })
      const text = plain.text?.trim()
      if (text) return { text, action, escalationReason, bookingSummary }
    } catch (retryErr) {
      if (isQuotaError(retryErr)) throw new GeminiUnavailableError('Gemini quota exceeded during response generation', true)
    }
    throw new GeminiUnavailableError(`Gemini call failed: ${err}`, false)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { extractEntitiesGemini, generateResponseGemini, updateSummaryGemini, GeminiUnavailableError } from '@/lib/chat/gemini'
import { extractEntitiesGroq, generateResponseGroq, updateSummaryGroq, GroqUnavailableError } from '@/lib/chat/groq'
import { runRuleBasedTurn } from '@/lib/chat/rule-based'
import { mergeState } from '@/lib/chat/state'
import { allowRequest, clientIp } from '@/lib/rateLimit'
import { emptyConversationState, type ChatTurn, type ConversationState, type ChatAction } from '@/lib/chat/types'

const MAX_MESSAGE_LENGTH = 1000

type Engine = 'gemini' | 'groq' | 'rules'

// House style is no em dashes in anything a customer reads. The prompts ask
// for this, but models slip, so every reply gets a final pass. En dashes in
// ranges like "2–3 hours" are left alone.
function withoutEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ', ').replace(/, ([.!?])/g, '$1')
}

// Short, key-free description of why a provider failed, returned alongside a
// rules-engine reply so a silent fallback is visible from the browser's
// network tab instead of looking like "the AI just isn't there".
function failureReason(provider: string, err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  const redacted = raw
    .replace(/AIza[0-9A-Za-z_-]{10,}/g, '[key]')
    .replace(/gsk_[0-9A-Za-z]{10,}/g, '[key]')
    .replace(/\s+/g, ' ')
  return `${provider}: ${redacted.slice(0, 180)}`
}

// Zero-cost health check: which provider keys this deployment can actually
// see. Never calls a provider and never returns the keys themselves.
export async function GET() {
  return NextResponse.json({
    geminiKeyPresent: Boolean(process.env.GEMINI_API_KEY),
    groqKeyPresent: Boolean(process.env.GROQ_API_KEY),
  })
}
const RECENT_MESSAGES_LIMIT = 20 // verbatim messages kept; older ones get folded into conversationSummary

function isValidHistory(history: unknown): history is ChatTurn[] {
  if (!Array.isArray(history)) return false
  return history.every(
    (turn) =>
      turn && typeof turn === 'object' &&
      (turn.role === 'user' || turn.role === 'assistant') &&
      typeof turn.content === 'string' &&
      turn.content.length <= MAX_MESSAGE_LENGTH,
  )
}

interface TurnResult {
  reply: string
  state: ConversationState
  action: ChatAction
  escalationReason?: string
}

interface LlmProvider {
  extract: (state: ConversationState, recentTurns: ChatTurn[], message: string) => Promise<Record<string, unknown>>
  summarize: (previousSummary: string, overflow: ChatTurn[]) => Promise<string>
  respond: (state: ConversationState, recentTurns: ChatTurn[], message: string) => Promise<{ text: string; action: ChatAction; escalationReason?: string; bookingSummary?: string }>
}

const GEMINI_PROVIDER: LlmProvider = { extract: extractEntitiesGemini, summarize: updateSummaryGemini, respond: generateResponseGemini }
const GROQ_PROVIDER: LlmProvider = { extract: extractEntitiesGroq, summarize: updateSummaryGroq, respond: generateResponseGroq }

async function runLlmTurn(provider: LlmProvider, incomingState: ConversationState, history: ChatTurn[], message: string): Promise<TurnResult> {
  let summary = incomingState.conversationSummary
  let recentTurns = history
  if (history.length > RECENT_MESSAGES_LIMIT) {
    const overflow = history.slice(0, history.length - RECENT_MESSAGES_LIMIT)
    recentTurns = history.slice(history.length - RECENT_MESSAGES_LIMIT)
    summary = await provider.summarize(summary, overflow)
  }

  let state: ConversationState = { ...incomingState, conversationSummary: summary }
  const extracted = await provider.extract(state, recentTurns, message)
  state = mergeState(state, extracted)

  const result = await provider.respond(state, recentTurns, message)

  if (result.action?.type === 'open_booking' && result.bookingSummary) {
    state.booking = { ready: true, summary: result.bookingSummary }
  }

  return {
    reply: result.text || "Sorry, I got a bit stuck there. Could you rephrase that, or would you rather WhatsApp/call us on 07359 591800?",
    state,
    action: result.action,
    escalationReason: result.escalationReason,
  }
}

export async function POST(req: NextRequest) {
  if (!allowRequest(`chat:${clientIp(req)}`, 40, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many messages', reply: "You're sending messages faster than I can keep up. Give it a few minutes, or WhatsApp/call us on 07359 591800." },
      { status: 429 },
    )
  }

  let body: { message?: unknown; history?: unknown; conversationState?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const message = body.message
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 })
  }

  const history = body.history ?? []
  if (!isValidHistory(history)) {
    return NextResponse.json({ error: 'Invalid history format' }, { status: 400 })
  }

  const incomingState = (body.conversationState && typeof body.conversationState === 'object')
    ? (body.conversationState as ConversationState)
    : emptyConversationState()

  const trimmedMessage = message.trim()
  let result: TurnResult | null = null
  let engine: Engine = 'rules'
  const failures: string[] = []
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) failures.push('no GEMINI_API_KEY or GROQ_API_KEY in this deployment')

  // Free-tier LLMs first, each with an independent quota — Gemini, then Groq
  // if Gemini's is exhausted (or erroring) — before dropping to the
  // deterministic rule-based assistant as the final, always-available layer.
  if (process.env.GEMINI_API_KEY) {
    try {
      result = await runLlmTurn(GEMINI_PROVIDER, incomingState, history, trimmedMessage)
      engine = 'gemini'
    } catch (err) {
      failures.push(failureReason('gemini', err))
      if (err instanceof GeminiUnavailableError) {
        console.warn(`[support-chat] Gemini unavailable (quotaExceeded=${err.quotaExceeded}), trying Groq:`, err.message)
      } else {
        console.error('[support-chat] Unexpected error in Gemini pipeline, trying Groq:', err)
      }
    }
  }

  if (!result && process.env.GROQ_API_KEY) {
    try {
      result = await runLlmTurn(GROQ_PROVIDER, incomingState, history, trimmedMessage)
      engine = 'groq'
    } catch (err) {
      failures.push(failureReason('groq', err))
      if (err instanceof GroqUnavailableError) {
        console.warn(`[support-chat] Groq unavailable (quotaExceeded=${err.quotaExceeded}), falling back to rule-based:`, err.message)
      } else {
        console.error('[support-chat] Unexpected error in Groq pipeline, falling back to rule-based:', err)
      }
    }
  }

  if (!result) {
    const ruleResult = runRuleBasedTurn(incomingState, trimmedMessage, history.length === 0)
    result = { reply: ruleResult.text, state: ruleResult.state, action: ruleResult.action, escalationReason: ruleResult.escalationReason }
  }

  return NextResponse.json({
    reply: withoutEmDashes(result.reply),
    conversationState: result.state,
    action: result.action,
    engine,
    ...(engine === 'rules' && failures.length ? { fallbackReason: failures } : {}),
  })
}

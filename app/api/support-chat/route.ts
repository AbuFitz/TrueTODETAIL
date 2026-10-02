import { NextRequest, NextResponse } from 'next/server'
import { extractEntitiesGemini, generateResponseGemini, updateSummaryGemini, GeminiUnavailableError } from '@/lib/chat/gemini'
import { extractEntitiesGroq, generateResponseGroq, updateSummaryGroq, GroqUnavailableError } from '@/lib/chat/groq'
import { extractEntitiesRuleBased, runRuleBasedTurn } from '@/lib/chat/rule-based'
import { mergeState, normaliseMessage, sanitizeState } from '@/lib/chat/state'
import { INJECTION_REPLY, isPromptInjection, replyProblems } from '@/lib/chat/guard'
import { withUkWording } from '@/lib/chat/uk'
import { allowRequest, clientIp } from '@/lib/rateLimit'
import type { ChatTurn, ConversationState, ChatAction } from '@/lib/chat/types'

const MAX_MESSAGE_LENGTH = 1000
// Longest history accepted in one request. The widget resends the whole
// conversation each turn; anything past this is refused rather than fed to
// a model, since no real chat gets near it under the rate limit.
const MAX_HISTORY_TURNS = 200
// Each provider gets this long for a whole turn before we move on to the
// next tier, so a slow or hung API never leaves the customer waiting.
const PROVIDER_TURN_TIMEOUT_MS = 15_000

// Gemini then Groq can each take up to the timeout above before the rules
// engine answers, so allow the function enough time to get there.
export const maxDuration = 60

type Engine = 'gemini' | 'groq' | 'rules'

function withTimeout<T>(work: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} took longer than ${ms / 1000}s`)), ms)
  })
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer))
}

// House style is no em dashes in anything a customer reads. The prompts ask
// for this, but models slip, so every reply gets a final pass. En dashes in
// ranges like "2–3 hours" are left alone.
function withoutEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ', ').replace(/, ([.!?])/g, '$1')
}

// The widget shows replies as plain text, so markdown a model slips in
// would appear as literal asterisks and hashes.
function withoutMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/`+([^`]*)`+/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[*]\s+/gm, '- ')
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
  let summarizedTurns = incomingState.summarizedTurns
  let recentTurns = history
  if (history.length > RECENT_MESSAGES_LIMIT) {
    const foldUpTo = history.length - RECENT_MESSAGES_LIMIT
    recentTurns = history.slice(foldUpTo)
    // Only fold turns that are new since the last summary. Re-summarising
    // the whole backlog every turn cost a model call each time and slowly
    // blurred facts that were already captured.
    const overflow = history.slice(Math.min(summarizedTurns, foldUpTo), foldUpTo)
    if (overflow.length) summary = await provider.summarize(summary, overflow)
    summarizedTurns = foldUpTo
  }

  let state: ConversationState = { ...incomingState, conversationSummary: summary, summarizedTurns }
  // The separate model pass for entities is only worth a call for longer messages
  // or ones with numbers or dates in them. Short messages are covered by the rules,
  // which halves how many calls each turn costs on the free tiers.
  const worthAModelPass = message.trim().split(/\s+/).length > 8 || /\d/.test(message)
  const extracted = worthAModelPass ? await provider.extract(state, recentTurns, message) : extractEntitiesRuleBased(message)
  state = mergeState(state, extracted)

  const result = await provider.respond(state, recentTurns, message)

  if (result.action?.type === 'open_booking' && result.bookingSummary) {
    state.booking = { ready: true, summary: result.bookingSummary }
  }

  // An empty answer with nothing to show for it is a failed turn, so the
  // next tier gets a go instead of the customer getting a canned apology.
  if (!result.text?.trim() && !result.action) throw new Error('model returned an empty reply')

  // Nothing a model says reaches a customer without passing the reply checks;
  // a failed one is treated like any other failed turn and the next tier answers.
  if (result.text?.trim()) {
    const problems = replyProblems(result.text)
    if (problems.length) throw new Error(`reply failed the checks: ${problems.join('; ')}`)
  }

  return {
    reply: result.text?.trim() || (result.action?.type === 'open_booking'
      ? "I've put that together for you. Hit Book Now to pick your date and send the request."
      : `The quickest way to sort this is to call or WhatsApp the team on 07359 591800.`),
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
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
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
  if (history.length > MAX_HISTORY_TURNS) {
    return NextResponse.json(
      { error: 'Conversation too long', reply: "This chat has got pretty long! Refresh the page to start a fresh one, or WhatsApp/call us on 07359 591800." },
      { status: 400 },
    )
  }

  const incomingState = sanitizeState(body.conversationState)

  const trimmedMessage = normaliseMessage(message)
  if (!trimmedMessage) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 })
  }
  // Attempts to change the rules or pull out the instructions are answered here, without a model.
  if (isPromptInjection(trimmedMessage)) {
    return NextResponse.json({
      reply: INJECTION_REPLY,
      conversationState: incomingState,
      engine: 'rules' as Engine,
    })
  }
  let result: TurnResult | null = null
  let engine: Engine = 'rules'
  const failures: string[] = []
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) failures.push('no GEMINI_API_KEY or GROQ_API_KEY in this deployment')

  // Free-tier LLMs first, each with an independent quota — Gemini, then Groq
  // if Gemini's is exhausted (or erroring) — before dropping to the
  // deterministic rule-based assistant as the final, always-available layer.
  if (process.env.GEMINI_API_KEY) {
    try {
      result = await withTimeout(runLlmTurn(GEMINI_PROVIDER, incomingState, history, trimmedMessage), PROVIDER_TURN_TIMEOUT_MS, 'gemini')
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
      result = await withTimeout(runLlmTurn(GROQ_PROVIDER, incomingState, history, trimmedMessage), PROVIDER_TURN_TIMEOUT_MS, 'groq')
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
    reply: withUkWording(withoutEmDashes(withoutMarkdown(result.reply))).trim(),
    conversationState: result.state,
    action: result.action,
    engine,
    ...(engine === 'rules' && failures.length ? { fallbackReason: failures } : {}),
  })
}

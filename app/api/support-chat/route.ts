import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { chatEscalationEmail } from '@/lib/emails/templates'
import { extractEntitiesGemini, generateResponseGemini, updateSummaryGemini, GeminiUnavailableError } from '@/lib/chat/gemini'
import { extractEntitiesGroq, generateResponseGroq, updateSummaryGroq, GroqUnavailableError } from '@/lib/chat/groq'
import { runRuleBasedTurn } from '@/lib/chat/rule-based'
import { mergeState } from '@/lib/chat/state'
import { emptyConversationState, type ChatTurn, type ConversationState, type ChatAction } from '@/lib/chat/types'

const MAX_MESSAGE_LENGTH = 1000
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

async function sendEscalationEmail(state: ConversationState, reason: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('[support-chat] RESEND_API_KEY not set — escalation email skipped')
    return
  }
  try {
    const resend = new Resend(resendKey)
    const fromEmail = process.env.BOOKING_FROM_EMAIL ?? 'noreply@truetodetail.co.uk'
    await resend.emails.send({
      from: fromEmail,
      to: 'info@truetodetail.co.uk',
      replyTo: state.email || 'info@truetodetail.co.uk',
      subject: `Chat Escalation: ${reason}`,
      html: chatEscalationEmail({
        reason,
        conversationSummary: state.conversationSummary,
        customerName: state.customerName,
        phone: state.phone,
        email: state.email,
        postcode: state.postcode,
        createdAt: new Date().toISOString(),
      }),
    })
  } catch (err) {
    console.error('[support-chat] escalation email failed:', err)
  }
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

  if (result.action?.type === 'human_escalated') state.escalated = true
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

  // Free-tier LLMs first, each with an independent quota — Gemini, then Groq
  // if Gemini's is exhausted (or erroring) — before dropping to the
  // deterministic rule-based assistant as the final, always-available layer.
  if (process.env.GEMINI_API_KEY) {
    try {
      result = await runLlmTurn(GEMINI_PROVIDER, incomingState, history, trimmedMessage)
    } catch (err) {
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
    } catch (err) {
      if (err instanceof GroqUnavailableError) {
        console.warn(`[support-chat] Groq unavailable (quotaExceeded=${err.quotaExceeded}), falling back to rule-based:`, err.message)
      } else {
        console.error('[support-chat] Unexpected error in Groq pipeline, falling back to rule-based:', err)
      }
    }
  }

  if (!result) {
    const ruleResult = runRuleBasedTurn(incomingState, trimmedMessage, history.length === 0)
    if (ruleResult.action?.type === 'human_escalated') ruleResult.state.escalated = true
    result = { reply: ruleResult.text, state: ruleResult.state, action: ruleResult.action, escalationReason: ruleResult.escalationReason }
  }

  if (result.action?.type === 'human_escalated') {
    await sendEscalationEmail(result.state, result.escalationReason ?? 'Customer needs assistance.')
  }

  return NextResponse.json({ reply: result.reply, conversationState: result.state, action: result.action })
}

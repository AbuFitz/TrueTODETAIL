import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'
import { chatEscalationEmail } from '@/lib/emails/templates'
import { businessFactsText, pricingSummaryText, coverageSummaryText, vehicleLabelList } from '@/lib/chat/knowledge'
import { CHAT_TOOLS, executeTool } from '@/lib/chat/tools'
import { emptyConversationState, type ChatTurn, type ConversationState, type ChatAction, type ChatIntent } from '@/lib/chat/types'

const MAX_MESSAGE_LENGTH = 1000
const RECENT_MESSAGES_LIMIT = 20 // verbatim messages kept; older ones get folded into conversationSummary
const MAX_TOOL_ITERATIONS = 4

const INTENTS: ChatIntent[] = [
  'new_booking_enquiry', 'pricing_enquiry', 'availability_enquiry', 'vehicle_or_service_question',
  'existing_booking', 'rescheduling_or_cancellation', 'complaint', 'aftercare_question',
  'package_recommendation', 'coverage_enquiry', 'general_business_question', 'human_assistance_request', 'other',
]

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

function mergeState(state: ConversationState, extracted: Record<string, unknown>): ConversationState {
  const next: ConversationState = structuredClone(state)
  const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null)

  next.customerName = str(extracted.customerName) ?? next.customerName
  next.phone = str(extracted.phone) ?? next.phone
  next.email = str(extracted.email) ?? next.email
  next.postcode = str(extracted.postcode) ?? next.postcode

  next.vehicle.registration = str(extracted.vehicleRegistration) ?? next.vehicle.registration
  next.vehicle.make = str(extracted.vehicleMake) ?? next.vehicle.make
  next.vehicle.model = str(extracted.vehicleModel) ?? next.vehicle.model
  next.vehicle.year = str(extracted.vehicleYear) ?? next.vehicle.year

  const intent = str(extracted.intent)
  if (intent && (INTENTS as string[]).includes(intent)) next.enquiry.intent = intent as ChatIntent
  next.enquiry.service = str(extracted.service) ?? next.enquiry.service
  next.enquiry.package = str(extracted.package) ?? next.enquiry.package
  next.enquiry.requestedDate = str(extracted.requestedDate) ?? next.enquiry.requestedDate
  next.enquiry.requestedTime = str(extracted.requestedTime) ?? next.enquiry.requestedTime

  if (Array.isArray(extracted.newExtras)) {
    for (const e of extracted.newExtras) {
      const v = str(e)
      if (v && !next.enquiry.extras.includes(v)) next.enquiry.extras.push(v)
    }
  }
  if (Array.isArray(extracted.newCollectedFacts)) {
    for (const f of extracted.newCollectedFacts) {
      const v = str(f)
      if (v && !next.collectedInformation.includes(v)) next.collectedInformation.push(v)
    }
  }
  if (Array.isArray(extracted.newUnresolvedQuestions)) {
    for (const q of extracted.newUnresolvedQuestions) {
      const v = str(q)
      if (v && !next.unresolvedQuestions.includes(v)) next.unresolvedQuestions.push(v)
    }
  }
  return next
}

// Pass 1 — cheap structured extraction of anything new in the latest message.
async function extractEntities(
  client: Anthropic,
  state: ConversationState,
  recentTurns: ChatTurn[],
  latestMessage: string,
): Promise<Record<string, unknown>> {
  const tool: Anthropic.Tool = {
    name: 'extract_state',
    description: 'Record any customer facts newly given or changed in the latest message. Use null / empty arrays for anything not mentioned.',
    input_schema: {
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
        intent: { type: ['string', 'null'], enum: [...INTENTS, null], description: 'The customer\'s CURRENT intent, reassessed fresh — it can change mid-conversation.' },
        service: { type: ['string', 'null'] },
        package: { type: ['string', 'null'], description: 'Essential, Full Valet, or Premium Detail if mentioned/implied.' },
        requestedDate: { type: ['string', 'null'] },
        requestedTime: { type: ['string', 'null'] },
        newExtras: { type: 'array', items: { type: 'string' } },
        newCollectedFacts: { type: 'array', items: { type: 'string' }, description: 'Short factual notes worth remembering, e.g. "seats are heavily stained", "car hasn\'t been cleaned in months".' },
        newUnresolvedQuestions: { type: 'array', items: { type: 'string' }, description: 'Questions the customer asked that are not yet answered.' },
      },
      required: [
        'customerName', 'phone', 'email', 'postcode', 'vehicleRegistration', 'vehicleMake', 'vehicleModel', 'vehicleYear',
        'intent', 'service', 'package', 'requestedDate', 'requestedTime', 'newExtras', 'newCollectedFacts', 'newUnresolvedQuestions',
      ],
      additionalProperties: false,
    },
    strict: true,
  }

  const stateJson = JSON.stringify(state)
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: `Extract new customer facts from a car-detailing chat. Current known state (don't repeat what's already known unless it changed): ${stateJson}. Vehicle size categories in use: ${vehicleLabelList()}.`,
      tools: [tool],
      tool_choice: { type: 'tool', name: 'extract_state' },
      messages: [
        ...recentTurns.slice(-6).map(t => ({ role: t.role, content: t.content })),
        { role: 'user' as const, content: latestMessage },
      ],
    })
    const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
    return (toolUse?.input as Record<string, unknown>) ?? {}
  } catch (err) {
    console.error('[support-chat] extraction pass failed:', err)
    return {}
  }
}

// Fold older messages into the rolling summary when history grows past the
// verbatim window, so long conversations don't lose earlier facts/decisions.
async function updateSummaryIfNeeded(
  client: Anthropic,
  state: ConversationState,
  fullHistory: ChatTurn[],
): Promise<{ summary: string; recentTurns: ChatTurn[] }> {
  if (fullHistory.length <= RECENT_MESSAGES_LIMIT) {
    return { summary: state.conversationSummary, recentTurns: fullHistory }
  }
  const overflow = fullHistory.slice(0, fullHistory.length - RECENT_MESSAGES_LIMIT)
  const recentTurns = fullHistory.slice(fullHistory.length - RECENT_MESSAGES_LIMIT)
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: 'Update the running summary of a customer-service chat so far. Keep it short (max ~120 words) but preserve every concrete fact (names, vehicle, postcode, prices discussed, decisions made, concerns raised). Do not lose facts from the previous summary.',
      messages: [
        { role: 'user', content: `Previous summary: ${state.conversationSummary || '(none yet)'}\n\nEarlier messages to fold in:\n${overflow.map(t => `${t.role}: ${t.content}`).join('\n')}\n\nWrite the updated summary.` },
      ],
    })
    const textBlock = response.content.find((b) => b.type === 'text')
    const summary = textBlock && 'text' in textBlock ? textBlock.text.trim() : state.conversationSummary
    return { summary, recentTurns }
  } catch (err) {
    console.error('[support-chat] summarization failed:', err)
    return { summary: state.conversationSummary, recentTurns }
  }
}

function buildSystemPrompt(state: ConversationState): string {
  return `You are Ava, the support and sales assistant embedded on the True To Detail website, a professional mobile car detailing and valeting business.

You are a real conversational assistant, not a form. Read the full conversation state below before replying — if something is already known, never ask for it again. Reassess the customer's intent fresh each turn; it can change mid-conversation (e.g. a pricing question can turn into a booking).

Behaviour rules:
- Acknowledge what the customer just said before moving the conversation forward. Don't open every reply with a greeting or "How can I help?" — only greet once, at the very start.
- Ask for at most one or two missing pieces of information at a time, choosing whatever is most useful to ask next given what's already known. Never re-ask for something already in the conversation state below.
- Keep replies short and conversational (2-4 sentences) unless the customer asks for a detailed comparison. No em dashes (use commas, periods or colons instead). No corporate fluff, no excessive exclamation marks.
- Never state a price, coverage answer, availability, or booking-lookup result from memory — always call the matching tool and use its returned result. If a tool says something is unknown/unconfirmed, say so honestly rather than guessing.
- Recommend packages based on what the customer describes (stains, neglect, pet hair, wanting it "like new", selling the car, etc.) without aggressive upselling — one relevant suggestion, not a hard sell.
- If the request is a bespoke/commercial job (ceramic coating, paint correction, fleet), or the customer asks for a person, seems upset, or says you've got something wrong more than once, call request_human_support rather than continuing to guess.
- When you have enough to describe a concrete booking (package, vehicle, ideally postcode and a date/time preference), call prepare_booking_summary and then tell the customer to confirm it via the Book Now button.

## Business facts
${businessFactsText()}

## Pricing
${pricingSummaryText()}

## Coverage
${coverageSummaryText()}

## Conversation state (what's already known — do not re-ask for any of this)
${JSON.stringify(state, null, 0)}

## Conversation summary so far
${state.conversationSummary || '(conversation just started)'}`
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

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[support-chat] ANTHROPIC_API_KEY not set — chat is unavailable')
    return NextResponse.json({
      reply: "I'm not able to chat properly right now — please call or WhatsApp us on 07359 591800 and we'll help you directly.",
      conversationState: incomingState,
      action: null,
    })
  }

  const client = new Anthropic({ apiKey })
  const trimmedMessage = message.trim()

  try {
    // 1. Fold overflow history into the rolling summary if the conversation has grown long.
    const { summary, recentTurns } = await updateSummaryIfNeeded(client, incomingState, history)
    let state: ConversationState = { ...incomingState, conversationSummary: summary }

    // 2. Cheap entity/intent extraction from the latest message.
    const extracted = await extractEntities(client, state, recentTurns, trimmedMessage)
    state = mergeState(state, extracted)

    // 3. Response generation, with tool access, using the updated state.
    const messages: Anthropic.MessageParam[] = [
      ...recentTurns.map((t) => ({ role: t.role, content: t.content })),
      { role: 'user' as const, content: trimmedMessage },
    ]

    let action: ChatAction = null
    let finalText = ''

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await client.messages.create({
        model: 'claude-opus-5',
        max_tokens: 2048,
        system: buildSystemPrompt(state),
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium' },
        tools: CHAT_TOOLS,
        messages,
      })

      messages.push({ role: 'assistant', content: response.content })

      if (response.stop_reason !== 'tool_use') {
        const textBlock = response.content.find((b) => b.type === 'text')
        finalText = textBlock && 'text' in textBlock ? textBlock.text : ''
        break
      }

      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue
        const result = executeTool(block.name, block.input as Record<string, unknown>)
        if (result.action === 'human_escalated') {
          action = { type: 'human_escalated' }
          state.escalated = true
          await sendEscalationEmail(state, result.escalationReason ?? 'Customer requested help.')
        } else if (result.action === 'open_booking') {
          action = { type: 'open_booking' }
          const out = result.output as { ready?: boolean; instruction?: string }
          state.booking = { ready: Boolean(out.ready), summary: JSON.stringify(result.output) }
        }
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result.output) })
      }
      messages.push({ role: 'user', content: toolResults })
    }

    if (!finalText) {
      finalText = "Sorry, I got a bit stuck there. Could you rephrase that, or would you rather WhatsApp/call us on 07359 591800?"
    }

    return NextResponse.json({ reply: finalText, conversationState: state, action })
  } catch (err) {
    console.error('[support-chat] Anthropic API error:', err)
    return NextResponse.json({
      reply: "Sorry, something went wrong on my end. Please try again, or WhatsApp/call us on 07359 591800.",
      conversationState: incomingState,
      action: null,
    })
  }
}

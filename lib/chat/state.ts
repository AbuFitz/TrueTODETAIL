// Shared conversation-state helpers used by every response path (Gemini,
// rule-based fallback) so state updates behave identically regardless of
// which one produced a given turn.

import type { ConversationState, ChatIntent } from '@/lib/chat/types'

export const INTENTS: ChatIntent[] = [
  'new_booking_enquiry', 'pricing_enquiry', 'availability_enquiry', 'vehicle_or_service_question',
  'existing_booking', 'rescheduling_or_cancellation', 'complaint', 'aftercare_question',
  'package_recommendation', 'coverage_enquiry', 'general_business_question', 'human_assistance_request', 'other',
]

export function mergeState(state: ConversationState, rawExtracted: unknown): ConversationState {
  const next: ConversationState = structuredClone(state)
  // Model output is parsed JSON and may not be an object at all.
  const extracted = obj(rawExtracted)
  const str = (v: unknown): string | null => cleanString(v, MAX_LIST_ITEM)

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
  const size = str(extracted.vehicleSize)
  if (size && ['small', 'midsize', 'largesuv'].includes(size)) next.enquiry.vehicleSize = size

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
  next.enquiry.extras = next.enquiry.extras.slice(-MAX_LIST_ITEMS)
  next.collectedInformation = next.collectedInformation.slice(-MAX_LIST_ITEMS)
  next.unresolvedQuestions = next.unresolvedQuestions.slice(-MAX_LIST_ITEMS)
  return next
}

// The browser holds the conversation state and sends it back each turn, so
// it arrives as untrusted JSON. Rebuild it field by field from a clean empty
// state: anything missing, mistyped or oversized is dropped rather than
// crashing the handler or ballooning the prompt sent to the model.
const MAX_FIELD = 200
const MAX_LIST_ITEMS = 20
const MAX_LIST_ITEM = 300
const MAX_SUMMARY = 2000

function cleanString(v: unknown, max = MAX_FIELD): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null
}

function cleanList(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v
    .map((x) => cleanString(x, MAX_LIST_ITEM))
    .filter((x): x is string => x !== null)
    .slice(-MAX_LIST_ITEMS)
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

export function sanitizeState(raw: unknown): ConversationState {
  const s = obj(raw)
  const vehicle = obj(s.vehicle)
  const enquiry = obj(s.enquiry)
  const booking = obj(s.booking)
  const intent = cleanString(enquiry.intent)
  const summarized = Number(s.summarizedTurns)
  return {
    customerName: cleanString(s.customerName),
    phone: cleanString(s.phone),
    email: cleanString(s.email),
    postcode: cleanString(s.postcode),
    vehicle: {
      registration: cleanString(vehicle.registration),
      make: cleanString(vehicle.make),
      model: cleanString(vehicle.model),
      year: cleanString(vehicle.year),
    },
    enquiry: {
      intent: intent && (INTENTS as string[]).includes(intent) ? (intent as ChatIntent) : null,
      service: cleanString(enquiry.service),
      package: cleanString(enquiry.package),
      requestedDate: cleanString(enquiry.requestedDate),
      requestedTime: cleanString(enquiry.requestedTime),
      vehicleSize: ['small', 'midsize', 'largesuv'].includes(String(enquiry.vehicleSize)) ? String(enquiry.vehicleSize) : null,
      extras: cleanList(enquiry.extras),
    },
    booking: booking.ready === true ? { ready: true, summary: cleanString(booking.summary, 2000) } : null,
    collectedInformation: cleanList(s.collectedInformation),
    unresolvedQuestions: cleanList(s.unresolvedQuestions),
    conversationSummary: cleanString(s.conversationSummary, MAX_SUMMARY) ?? '',
    summarizedTurns: Number.isInteger(summarized) && summarized > 0 ? Math.min(summarized, 10_000) : 0,
    escalated: s.escalated === true,
  }
}

// Unicode NFKC folds lookalike forms (fullwidth letters, ligatures) into
// plain text so "ｆｕｌｌ ｖａｌｅｔ" reads as "full valet". Control and
// bidi-override characters are dropped; newlines and tabs become spaces.
export function normaliseMessage(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

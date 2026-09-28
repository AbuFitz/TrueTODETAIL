// Shared conversation-state helpers used by every response path (Gemini,
// rule-based fallback) so state updates behave identically regardless of
// which one produced a given turn.

import type { ConversationState, ChatIntent } from '@/lib/chat/types'

export const INTENTS: ChatIntent[] = [
  'new_booking_enquiry', 'pricing_enquiry', 'availability_enquiry', 'vehicle_or_service_question',
  'existing_booking', 'rescheduling_or_cancellation', 'complaint', 'aftercare_question',
  'package_recommendation', 'coverage_enquiry', 'general_business_question', 'human_assistance_request', 'other',
]

export function mergeState(state: ConversationState, extracted: Record<string, unknown>): ConversationState {
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

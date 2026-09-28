// Structured conversation state for the support chat assistant. Sent by the
// client alongside the message history each turn, updated server-side after
// every response, and returned so the client can persist and resend it.
// There's no database backing the chat widget, so the client (SupportWidget)
// is the state's only durable store for the life of that browser session —
// consistent with how it already re-sends full message history each turn.

export type ChatIntent =
  | 'new_booking_enquiry'
  | 'pricing_enquiry'
  | 'availability_enquiry'
  | 'vehicle_or_service_question'
  | 'existing_booking'
  | 'rescheduling_or_cancellation'
  | 'complaint'
  | 'aftercare_question'
  | 'package_recommendation'
  | 'coverage_enquiry'
  | 'general_business_question'
  | 'human_assistance_request'
  | 'other'

export interface VehicleInfo {
  registration: string | null
  make: string | null
  model: string | null
  year: string | null
}

export interface EnquiryInfo {
  intent: ChatIntent | null
  service: string | null
  package: string | null
  requestedDate: string | null
  requestedTime: string | null
  extras: string[]
}

export interface ConversationState {
  customerName: string | null
  phone: string | null
  email: string | null
  postcode: string | null
  vehicle: VehicleInfo
  enquiry: EnquiryInfo
  booking: { ready: boolean; summary: string | null } | null
  collectedInformation: string[]
  unresolvedQuestions: string[]
  conversationSummary: string
  escalated: boolean
}

export function emptyConversationState(): ConversationState {
  return {
    customerName: null,
    phone: null,
    email: null,
    postcode: null,
    vehicle: { registration: null, make: null, model: null, year: null },
    enquiry: { intent: null, service: null, package: null, requestedDate: null, requestedTime: null, extras: [] },
    booking: null,
    collectedInformation: [],
    unresolvedQuestions: [],
    conversationSummary: '',
    escalated: false,
  }
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

// What the frontend renders as a follow-up action alongside a given reply.
export type ChatAction =
  | { type: 'open_booking' }
  | { type: 'human_escalated' }
  | null

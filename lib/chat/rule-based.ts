// Deterministic fallback assistant — used when Gemini is unavailable
// (quota exhausted, no key configured, or erroring) so the chat widget is
// never fully broken and never costs anything. It's not free-form natural
// language, but it shares everything else with the LLM path: the same
// structured ConversationState, the same tool executors (so pricing and
// coverage answers are always accurate, never invented), and the same
// escalation email. Its "improves over time" mechanism is honest rather
// than a fake ML claim: when it can't confidently classify a message twice
// in one conversation, it emails the business the exact questions it
// couldn't handle, so the keyword patterns below can be extended based on
// real gaps instead of guessing upfront.

import { executeTool } from '@/lib/chat/tools'
import { findAreaByPostcode } from '@/lib/chat/knowledge'
import { BUSINESS_INFO, PACKAGES, TIME_SLOTS, type VehicleType } from '@/lib/pricing'
import { mergeState } from '@/lib/chat/state'
import type { ConversationState, ChatAction, ChatIntent } from '@/lib/chat/types'

const GREETING_RE = /^(hi+|hey+|hello+|yo+|sup|howdy|good\s?(morning|afternoon|evening)|whats?\s?up|greetings)\b[!.? ]*$/i

// Conversational filler — not a question at all, so it shouldn't count as a
// failed answer (and shouldn't push the "escalate to the team" counter).
const FILLER_RE = /^(nothing|nah+|no+p?e?|not\s?(really|much)|meh|idk|i\s?dunno|dunno|just\s?(looking|browsing)|no\s?worries|nvm|never\s?mind|ok(ay)?|cool|cheers|thanks?|ta)[!.? ]*$/i

// Well-known major UK cities/towns far outside Hertfordshire that customers
// occasionally ask about — enough to give a real "that's outside our area"
// answer instead of looping the generic coverage blurb forever. Not
// exhaustive; a genuine postcode check (findAreaByPostcode) is still the
// authoritative source whenever a real postcode is given.
const OUT_OF_AREA_PLACES = [
  'manchester', 'birmingham', 'leeds', 'liverpool', 'glasgow', 'edinburgh',
  'sheffield', 'bristol', 'newcastle', 'nottingham', 'leicester', 'cardiff',
  'belfast', 'brighton', 'southampton', 'portsmouth', 'plymouth', 'york',
  'cambridge', 'oxford', 'norwich', 'exeter', 'bath',
]
const OUT_OF_AREA_RE = new RegExp(`\\b(${OUT_OF_AREA_PLACES.join('|')})\\b`, 'i')

// Weighted keyword phrases per intent — scored by summed weight of matching
// phrases, not a single anchored pattern, so varied phrasing still
// classifies correctly. Weights matter: a specific need signal ("seats are
// stained") should outrank an incidental context mention ("my postcode is
// ...") when both appear in the same message, so generic/incidental phrases
// (postcode, area, cover) are weighted lower than concrete need phrases.
const INTENT_PATTERNS: Partial<Record<ChatIntent, Array<[RegExp, number]>>> = {
  pricing_enquiry: [[/\bprice/i, 1], [/\bcost/i, 1], [/how much/i, 1.5], [/\bcheap/i, 1], [/\bexpensive/i, 1], [/\bfee/i, 1], [/\bquote/i, 1]],
  coverage_enquiry: [[/\bcover/i, 0.7], [/\barea/i, 0.5], [/postcode/i, 0.5], [/post code/i, 0.5], [/\blocation/i, 0.7], [/near me/i, 1], [/\btravel/i, 0.7], [/\breach/i, 0.7], [/come to/i, 0.7], [/\bradius/i, 1]],
  availability_enquiry: [[/\bavailab/i, 1], [/\bslot/i, 1], [/when can/i, 1.5], [/what time/i, 1], [/\bfree\b.*\b(day|time|slot)/i, 1.5]],
  new_booking_enquiry: [[/\bbook/i, 1], [/\bappointment/i, 1], [/\bschedule/i, 1], [/want.*(clean|detail|valet)/i, 1.5], [/need.*(clean|detail|valet)/i, 1.5], [/like.*(clean|detail|valet)/i, 1.5]],
  rescheduling_or_cancellation: [[/\breschedul/i, 1.5], [/\bcancel/i, 1.5], [/change.*(date|time|booking)/i, 1.5], [/move.*(booking|appointment)/i, 1.5]],
  existing_booking: [[/my booking/i, 1.5], [/already booked/i, 1.5], [/booking (reference|ref|number|id)/i, 1.5], [/confirm.*booking/i, 1.5], [/status of my/i, 1.5]],
  complaint: [[/not happy/i, 1.5], [/unhappy/i, 1.5], [/disappointed/i, 1.5], [/poor (job|service)/i, 1.5], [/bad (job|service)/i, 1.5], [/missed a spot/i, 1.5], [/still dirty/i, 1.5], [/refund/i, 1.5], [/complain/i, 1.5], [/terrible/i, 1.5], [/awful/i, 1.5]],
  human_assistance_request: [[/speak to (a )?(human|person|someone|agent|staff)/i, 2], [/real person/i, 2], [/talk to (a )?(human|person|someone)/i, 2], [/human assistance/i, 2], [/customer service/i, 1.5]],
  aftercare_question: [[/after ?care/i, 1.5], [/how (do|should) i (maintain|look after|keep)/i, 1.5], [/how long (does|will).*(last|dry)/i, 1.5], [/can i wash/i, 1.5], [/rain.*(after|today|tomorrow)/i, 1.5]],
  package_recommendation: [[/which (pack|package)/i, 1.5], [/what.*(pack|package).*(recommend|suggest|best)/i, 1.5], [/recommend/i, 1], [/stained/i, 1.5], [/pet hair/i, 1.5], [/hasn.t been cleaned/i, 1.5], [/neglected/i, 1.5], [/like new/i, 1.5], [/selling (my|the) car/i, 1.5]],
  vehicle_or_service_question: [[/what.*(include|come with)/i, 1.5], [/what.*(is|are).*(essential|full valet|premium)/i, 1.5], [/difference between/i, 1.5], [/how long (does|will) it take/i, 1]],
  general_business_question: [[/\bhours\b/i, 1], [/\bopen\b/i, 1], [/opening/i, 1], [/\bclosed\b/i, 1], [/\bcontact\b/i, 1], [/phone number/i, 1], [/\bemail\b/i, 0.7], [/\bwhatsapp\b/i, 0.7], [/payment/i, 1], [/\bcash\b/i, 1], [/\bcard\b/i, 0.7], [/deposit/i, 1]],
}

const POSTCODE_SEARCH_RE = /\b([A-Z]{1,2}[0-9][0-9A-Z]?)\s?([0-9][A-Z]{2})\b/i
const CAR_REG_SEARCH_RE = /\b([A-Z]{2}[0-9]{2}\s?[A-Z]{3})\b/i
const PACKAGE_NAME_RE = /\b(essential|full valet|premium detail)\b/i
const VEHICLE_SIZE_RE: [RegExp, VehicleType][] = [
  [/\b(large|big)\s*(suv|4x4|4wd)/i, 'largesuv'],
  [/\bsuv\b|\b4x4\b/i, 'largesuv'],
  [/\bmid[\s-]?size|estate|saloon\b/i, 'midsize'],
  [/\bsmall\s*(car)?\b|hatchback|supermini/i, 'small'],
]

function classifyIntent(message: string): ChatIntent | null {
  let best: { intent: ChatIntent; score: number } | null = null
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as [ChatIntent, Array<[RegExp, number]>][]) {
    const score = patterns.reduce((sum, [re, weight]) => sum + (re.test(message) ? weight : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { intent, score }
  }
  return best?.intent ?? null
}

function extractEntitiesRuleBased(message: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const pc = message.match(POSTCODE_SEARCH_RE)
  if (pc) out.postcode = `${pc[1]} ${pc[2]}`.toUpperCase()

  const reg = message.match(CAR_REG_SEARCH_RE)
  if (reg) out.vehicleRegistration = reg[1].toUpperCase().replace(/\s+/g, '')

  const pkg = message.match(PACKAGE_NAME_RE)
  if (pkg) {
    const found = PACKAGES.find(p => p.id.toLowerCase() === pkg[1].toLowerCase())
    if (found) out.package = found.id
  }

  for (const [re, vehicle] of VEHICLE_SIZE_RE) {
    if (re.test(message)) { out.__vehicle = vehicle; break }
  }

  const intent = classifyIntent(message)
  if (intent) out.intent = intent

  return out
}

export interface RuleBasedResult {
  text: string
  state: ConversationState
  action: ChatAction
  escalationReason?: string
}

function phoneAndHours(): string {
  return `${BUSINESS_INFO.phone} (${BUSINESS_INFO.hours})`
}

export function runRuleBasedTurn(state: ConversationState, message: string, isFirstMessage: boolean): RuleBasedResult {
  const extracted = extractEntitiesRuleBased(message)
  const vehicleGuess = extracted.__vehicle as VehicleType | undefined
  delete extracted.__vehicle
  let next = mergeState(state, extracted)

  let action: ChatAction = null
  let escalationReason: string | undefined
  let text: string

  if (GREETING_RE.test(message.trim()) && isFirstMessage) {
    text = "Hey, welcome to True To Detail! I can help with pricing, coverage, or getting you booked in. What's on your mind?"
    return { text, state: next, action, escalationReason }
  }

  // Conversational filler isn't a failed answer — respond lightly and don't
  // let it count toward "couldn't handle this twice" escalation below.
  if (FILLER_RE.test(message.trim())) {
    text = "No worries, I'm here if pricing, coverage or booking comes to mind!"
    return { text, state: next, action, escalationReason }
  }

  // A clearly-named major city/town well outside Hertfordshire deserves a
  // real "that's too far" answer, not the generic coverage blurb repeated
  // forever — this can't be confirmed from a postcode (none was given), so
  // it's a judgement call flagged as such rather than a hard no.
  if (OUT_OF_AREA_RE.test(message) && !next.postcode) {
    const place = message.match(OUT_OF_AREA_RE)?.[0] ?? 'that area'
    text = `${place[0].toUpperCase()}${place.slice(1)} is a fair way outside our usual patch. We're based in ${BUSINESS_INFO.baseLocation} and cover roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius, so that's likely too far for us. Best to double check via WhatsApp/call on ${BUSINESS_INFO.phone} if you're close to the boundary.`
    return { text, state: next, action, escalationReason }
  }

  // Branch on THIS message's own classification, not the merged/persisted
  // state.enquiry.intent — that field is meant to carry context forward
  // (e.g. for the LLM path), but using it here meant an intent set several
  // turns ago (e.g. "what areas do you cover?") kept re-triggering its
  // canned response for every later, unrelated, unclassifiable message
  // ("what cities", "manchester?") instead of falling through to a
  // genuine "I don't understand" reply.
  const intent = (extracted.intent as ChatIntent | undefined) ?? null

  if (intent === 'human_assistance_request' || intent === 'complaint') {
    const result = executeTool('request_human_support', { reason: intent === 'complaint' ? `Complaint: "${message}"` : 'Customer asked to speak to a person.' })
    escalationReason = result.escalationReason
    action = { type: 'human_escalated' }
    text = "I've flagged this for our team with everything we've discussed so far, and they'll follow up directly. You're also welcome to call or WhatsApp us right now on " + BUSINESS_INFO.phone + "."
    return { text, state: next, action, escalationReason }
  }

  // A postcode mention is a strong fact worth acknowledging, but it shouldn't
  // hijack a message whose main point is a specific need (stained seats,
  // wanting a package, etc.) — compute it once and weave it in as a prefix
  // wherever it's relevant, rather than always taking over the whole reply.
  let coveragePrefix = ''
  if (next.postcode) {
    const covResult = executeTool('check_coverage', { postcode: next.postcode })
    const covOut = covResult.output as { covered: boolean | 'unknown'; area?: string }
    coveragePrefix = covOut.covered === true ? `${covOut.area} is well within our coverage area. ` : ''
  }

  if (intent === 'pricing_enquiry' || intent === 'package_recommendation' || intent === 'new_booking_enquiry') {
    const pkg = next.enquiry.package
    if (pkg && vehicleGuess) {
      const result = executeTool('calculate_price', { packageName: pkg, vehicle: vehicleGuess })
      const out = result.output as { total?: number; error?: string }
      if (out.total) {
        text = `${coveragePrefix}${pkg} for your vehicle comes to £${out.total}, fixed with no surprises on the day. Want me to point you to the Book Now button, or do you have a preferred date?`
        return { text, state: next, action, escalationReason }
      }
    }
    if (pkg && !vehicleGuess) {
      text = `${coveragePrefix}For ${pkg}, what size is your vehicle: small car, mid-size, or a large SUV/4x4? Prices vary a bit by size.`
      return { text, state: next, action, escalationReason }
    }
    const needsRecommendation = /stained|pet hair|hasn.t been cleaned|neglected|like new|selling (my|the) car|which (pack|package)|recommend/i.test(message)
    if (intent === 'package_recommendation' || needsRecommendation) {
      text = `${coveragePrefix}If it's had a while since a proper clean, or has stains/pet hair, Full Valet is usually the right call: deep interior clean, seat shampoo and carpet extraction. For something needing real correction (swirl marks, dull paint, before a sale), Premium Detail goes further with clay bar decon and machine polish. Which sounds closer to what you need?`
      return { text, state: next, action, escalationReason }
    }
    text = `${coveragePrefix}Our packages: Essential from £80, Full Valet (most popular) from £140, Premium Detail from £220. The exact price depends on vehicle size. Which one sounds right, and what's your vehicle?`
    return { text, state: next, action, escalationReason }
  }

  if (intent === 'coverage_enquiry' || next.postcode) {
    if (next.postcode) {
      const result = executeTool('check_coverage', { postcode: next.postcode })
      const out = result.output as { covered: boolean | 'unknown'; area?: string }
      text = out.covered === true
        ? `Good news, ${out.area} is well within our coverage area. Are you looking to get something booked in?`
        : `I can't confirm that exact postcode from here, but we cover roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius from ${BUSINESS_INFO.baseLocation}, so it's very likely covered. Best to confirm via WhatsApp/call on ${BUSINESS_INFO.phone}.`
      return { text, state: next, action, escalationReason }
    }
    text = "We cover roughly a 25-mile radius around Hemel Hempstead, including Watford, St Albans, Berkhamsted, Harpenden and more. What's your postcode? I can check straight away."
    return { text, state: next, action, escalationReason }
  }

  if (intent === 'availability_enquiry') {
    const result = executeTool('check_availability', {})
    const out = result.output as { timeSlots: string[] }
    text = `We run ${BUSINESS_INFO.hours}, with slots at ${out.timeSlots.join(', ')}. There's no live calendar here, so a preferred slot gets confirmed ${BUSINESS_INFO.bookingConfirmationWindow}. What day were you thinking?`
    return { text, state: next, action, escalationReason }
  }

  if (intent === 'existing_booking' || intent === 'rescheduling_or_cancellation') {
    executeTool('lookup_booking', {})
    text = intent === 'rescheduling_or_cancellation'
      ? `I can't pull up bookings from here, but rescheduling or cancelling is easy. Call or WhatsApp us on ${BUSINESS_INFO.phone} (at least 24 hours notice avoids a late-cancellation fee).`
      : `I don't have access to booking records from here. Call or WhatsApp us on ${BUSINESS_INFO.phone} with your name or reference and we'll pull it up straight away.`
    return { text, state: next, action, escalationReason }
  }

  if (intent === 'aftercare_question') {
    text = `That's the kind of thing our team can give you a precise answer on for your specific job. WhatsApp or call ${BUSINESS_INFO.phone}. In general: ${BUSINESS_INFO.satisfactionPromise}`
    return { text, state: next, action, escalationReason }
  }

  if (intent === 'vehicle_or_service_question') {
    const pkgMatch = next.enquiry.package ? PACKAGES.find(p => p.id === next.enquiry.package) : null
    if (pkgMatch) {
      text = `${pkgMatch.id} (${pkgMatch.duration}) includes: ${pkgMatch.includes.join(', ')}. Anything else you'd like to know?`
    } else {
      text = "Essential is a quick refresh, Full Valet adds a deep interior clean and seat shampoo, Premium Detail adds clay bar decon and machine polish. Want details on a specific one?"
    }
    return { text, state: next, action, escalationReason }
  }

  if (intent === 'general_business_question') {
    text = `We're open ${BUSINESS_INFO.hours}. You can reach us on ${phoneAndHours()} or ${BUSINESS_INFO.email}. Payment's on the day (card, bank transfer or cash), no deposit needed.`
    return { text, state: next, action, escalationReason }
  }

  // Unmatched — track it, and escalate once this happens repeatedly in the
  // conversation. Threshold is 3, not 2: a single stray typo or one-off
  // unclear message shouldn't trigger a fake "escalated to our team" reply.
  next.unresolvedQuestions = [...next.unresolvedQuestions, message].slice(-10)
  const repeatedConfusion = next.unresolvedQuestions.length >= 3
  if (repeatedConfusion) {
    const result = executeTool('request_human_support', { reason: `Rule-based assistant couldn't confidently handle: ${next.unresolvedQuestions.join(' | ')}` })
    escalationReason = result.escalationReason
    action = { type: 'human_escalated' }
    text = `I want to make sure you get a proper answer here, so I've passed this on to our team with what we've discussed, they'll follow up directly. Or WhatsApp/call ${BUSINESS_INFO.phone} right now.`
  } else {
    text = `I can help with pricing, coverage, or getting you booked in. What would be most useful? Or WhatsApp/call us on ${BUSINESS_INFO.phone}.`
  }
  return { text, state: next, action, escalationReason }
}

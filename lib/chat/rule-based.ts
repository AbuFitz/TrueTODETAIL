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
import { BUSINESS_INFO, PACKAGES, VEHICLE_LABELS, type VehicleType } from '@/lib/pricing'
import { AREAS, type Area } from '@/lib/areas'
import { mergeState } from '@/lib/chat/state'
import { resolveVehicleSize, SIZE_HELP_RE, sizeGuideText } from '@/lib/chat/vehicle-size'
import type { ConversationState, ChatAction, ChatIntent } from '@/lib/chat/types'

const GREETING_RE = /^(hi+|hey+|hello+|hiya|yo+|sup|howdy|good\s?(morning|afternoon|evening)|whats?\s?up|greetings)(\s+(there|again|all|everyone|guys|team|ava|mate))?[!.?, ]*$/i

// Conversational filler — not a question at all, so it shouldn't count as a
// failed answer (and shouldn't push the "escalate to the team" counter).
const FILLER_WORDS = new Set([
  'nothing', 'nah', 'no', 'nope', 'not', 'really', 'much', 'meh', 'idk', 'i', 'dunno', 'just', 'looking',
  'browsing', 'worries', 'nvm', 'never', 'mind', 'ok', 'okay', 'k', 'cool', 'cheers', 'thanks', 'thank',
  'you', 'thx', 'ta', 'great', 'nice', 'lovely', 'perfect', 'hmm', 'hm', 'um', 'umm', 'lol', 'haha', 'ah',
  'oh', 'right', 'alright', 'fine', 'sure', 'yeah', 'yes', 'yep', 'ty', 'bye', 'for', 'now', 'all', 'good',
])
function isFiller(message: string): boolean {
  const words = message.toLowerCase().replace(/[^a-z\s']/g, ' ').split(/\s+/).filter(Boolean)
  return words.length > 0 && words.length <= 6 && words.every(w => FILLER_WORDS.has(w.replace(/'/g, '')))
}

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
  availability_enquiry: [[/\bavailab/i, 1], [/\bslot/i, 1], [/when can/i, 1.5], [/what time/i, 1], [/\bfree\b.*\b(day|time|slot)/i, 1.5], [/when (are|r) (you|u) (free|about|around|open)/i, 1.5], [/(any|next|earliest) (availability|opening|space|gap)/i, 1.5], [/\b(this|next) week(end)?\b|\btomorrow\b/i, 0.7]],
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
const PACKAGE_NAME_RE = /\b(essential|full valet|premium(?: detail)?)\b/i

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
    const name = pkg[1].toLowerCase().startsWith('premium') ? 'premium detail' : pkg[1].toLowerCase()
    const found = PACKAGES.find(p => p.id.toLowerCase() === name)
    if (found) out.package = found.id
  }

  const sizeRead = resolveVehicleSize(message)
  if (sizeRead.size) out.vehicleSize = sizeRead.size
  if (sizeRead.ambiguous) out.vehicleSizeAmbiguous = true

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
  const next = mergeState(state, extracted)
  const answer = answerTurn(next, extracted, message.trim(), isFirstMessage)

  if (answer) {
    // A real answer breaks any run of messages we couldn't follow.
    if (answer.counts) next.unresolvedQuestions = []
    return { text: answer.text, state: next, action: answer.action ?? null }
  }

  // Unmatched. Three in a row means the customer is better off talking to
  // the team; nothing is sent automatically, so point them there honestly
  // and start counting again rather than repeating this every turn.
  next.unresolvedQuestions = [...next.unresolvedQuestions, message].slice(-10)
  if (next.unresolvedQuestions.length >= 3) {
    next.unresolvedQuestions = []
    return {
      text: `Sorry, I'm not quite following. You'll get the quickest answer from the team on ${BUSINESS_INFO.phone} by call or WhatsApp (${BUSINESS_INFO.hours}), or email ${BUSINESS_INFO.email}.`,
      state: next,
      action: { type: 'human_escalated' },
    }
  }
  return {
    text: `I can help with pricing, coverage, or getting you booked in. What would be most useful? Or WhatsApp/call us on ${BUSINESS_INFO.phone}.`,
    state: next,
    action: null,
  }
}

// Place names that are also everyday phrases, so they never count as a town mention.
const AMBIGUOUS_PLACES = new Set(['park street', 'waterside', 'mill end', 'well end'])

/** A covered town or neighbourhood named in the message, if any. */
function mentionedArea(message: string): { area: Area; place: string } | null {
  const lower = message.toLowerCase()
  for (const area of AREAS) {
    for (const place of [area.name, ...area.neighbourhoods]) {
      const p = place.toLowerCase()
      if (AMBIGUOUS_PLACES.has(p)) continue
      const re = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
      if (re.test(lower)) return { area, place }
    }
  }
  return null
}

const BESPOKE_RE = /\bceramic|paint correction|\bppf\b|paint protection film|\bwrap(ping)?\b/i
const FLEET_RE = /\bfleet|\bvans\b|company (cars|vehicles)|business (cars|vehicles)|commercial vehicle/i
const OTHER_VEHICLE_RE = /\b(motor ?bikes?|motorcycles?|scooters?|boats?|caravans?|motorhomes?|camper ?vans?|lorr(y|ies)|hgvs?|buses|coaches|tractors?|jet ?skis?)\b/i

interface Answer { text: string; action?: ChatAction; counts: boolean }

// How each size reads mid-sentence ("a Full Valet for a mid-size car").
const SIZE_PROSE: Record<VehicleType, string> = { small: 'small car (hatchback or coupe)', midsize: 'mid-size car (saloon or estate)', largesuv: 'large SUV, 4x4 or people carrier' }

function sizePrices(pkgId: string): string {
  const p = PACKAGES.find(x => x.id === pkgId)
  if (!p) return ''
  return (Object.keys(VEHICLE_LABELS) as VehicleType[]).map(v => `${VEHICLE_LABELS[v]} £${p.price[v]}`).join(', ')
}

function answerTurn(next: ConversationState, extracted: Record<string, unknown>, message: string, isFirstMessage: boolean): Answer | null {
  if (GREETING_RE.test(message)) {
    return {
      text: isFirstMessage
        ? "Hey, welcome to True To Detail! I can help with pricing, coverage, or getting you booked in. What's on your mind?"
        : 'Hi again! What can I help with: pricing, checking we cover you, or getting booked in?',
      counts: false,
    }
  }

  // Conversational filler isn't a failed answer, so respond lightly and
  // leave the "couldn't follow" count alone.
  if (isFiller(message)) {
    return { text: "No worries, I'm here if pricing, coverage or booking comes to mind!", counts: false }
  }

  // A clearly-named major city/town well outside Hertfordshire deserves a
  // real "that's too far" answer, not the generic coverage blurb.
  if (OUT_OF_AREA_RE.test(message) && !extracted.postcode) {
    const place = message.match(OUT_OF_AREA_RE)?.[0] ?? 'that area'
    return {
      text: `${place[0].toUpperCase()}${place.slice(1).toLowerCase()} is a fair way outside our usual patch. We're based in ${BUSINESS_INFO.baseLocation} and cover roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius, so that's likely too far for us. Best to double check via WhatsApp/call on ${BUSINESS_INFO.phone} if you're close to the boundary.`,
      counts: true,
    }
  }

  // Branch on THIS message's own classification, not the persisted intent,
  // so an old question doesn't keep re-triggering its canned reply.
  let intent = (extracted.intent as ChatIntent | undefined) ?? null
  // A bare package or size ("essential", "small car") moves a quote forward.
  if (!intent && (extracted.package || extracted.vehicleSize)) intent = 'pricing_enquiry'

  if (intent === 'complaint') {
    return {
      text: `I'm really sorry to hear that. Please call or WhatsApp us on ${BUSINESS_INFO.phone} so the team can put it right. ${BUSINESS_INFO.satisfactionPromise}`,
      action: { type: 'human_escalated' },
      counts: true,
    }
  }
  if (intent === 'human_assistance_request') {
    return {
      text: `Of course. You can reach the team directly on ${BUSINESS_INFO.phone} by call or WhatsApp (${BUSINESS_INFO.hours}), or email ${BUSINESS_INFO.email}.`,
      action: { type: 'human_escalated' },
      counts: true,
    }
  }

  if (BESPOKE_RE.test(message)) {
    return {
      text: `Ceramic coating and full paint correction are quoted individually, since the price depends on the paint's condition. WhatsApp a few photos to ${BUSINESS_INFO.phone} and we'll come back with a proper quote.`,
      counts: true,
    }
  }
  if (FLEET_RE.test(message)) {
    return {
      text: `We do look after vans and fleets. ${BUSINESS_INFO.fleetDiscount} Pop your details into the enquiry form on our Van & Fleet page (/van-fleet) or call ${BUSINESS_INFO.phone} for a quote.`,
      counts: true,
    }
  }
  if (OTHER_VEHICLE_RE.test(message)) {
    const what = message.match(OTHER_VEHICLE_RE)?.[0]?.toLowerCase() ?? 'that'
    return {
      text: `Our packages are built for cars and vans. For ${what}, WhatsApp us a photo on ${BUSINESS_INFO.phone} and we'll let you know if we can help.`,
      counts: true,
    }
  }

  if (SIZE_HELP_RE.test(message) || extracted.vehicleSizeAmbiguous) {
    return {
      text: extracted.vehicleSizeAmbiguous
        ? `That could fit more than one size. ${sizeGuideText()}`
        : sizeGuideText(),
      counts: true,
    }
  }

  if (/\bsundays?\b/i.test(message) && /\b(open|work|come|available|book|slot)/i.test(message)) {
    return { text: `We're closed on Sundays. We run ${BUSINESS_INFO.hours}, so Saturday is the closest weekend option.`, counts: true }
  }

  // Coverage facts from this message, woven into other answers as a prefix.
  const town = mentionedArea(message)
  let coveragePrefix = ''
  if (extracted.postcode) {
    const cov = executeTool('check_coverage', { postcode: extracted.postcode }).output as { covered: boolean | 'unknown'; area?: string }
    if (cov.covered === true) coveragePrefix = `${cov.area} is well within our coverage area. `
  } else if (town) {
    coveragePrefix = `We cover ${town.place}. `
  }

  if (intent === 'pricing_enquiry' || intent === 'package_recommendation' || intent === 'new_booking_enquiry') {
    const pkg = next.enquiry.package
    const size = next.enquiry.vehicleSize as VehicleType | null
    if (pkg && size) {
      const out = executeTool('calculate_price', { packageName: pkg, vehicle: size }).output as { total?: number }
      if (out.total) {
        return {
          text: `${coveragePrefix}${pkg} for a ${SIZE_PROSE[size]} is £${out.total}, fixed with no surprises on the day. Hit Book Now whenever you're ready, or tell me a preferred day.`,
          counts: true,
        }
      }
    }
    if (pkg) {
      return { text: `${coveragePrefix}${pkg} is ${sizePrices(pkg)}. What size is your vehicle?`, counts: true }
    }
    if (size && extracted.vehicleSize) {
      const list = PACKAGES.map(p => `${p.id} £${p.price[size]}`).join(', ')
      return { text: `${coveragePrefix}For a ${SIZE_PROSE[size]}: ${list}. Which one sounds right?`, counts: true }
    }
    const needsRecommendation = /stained|pet hair|hasn.t been cleaned|neglected|like new|selling (my|the) car|which (pack|package)|recommend/i.test(message)
    if (intent === 'package_recommendation' || needsRecommendation) {
      return {
        text: `${coveragePrefix}If it's been a while since a proper clean, or has stains/pet hair, Full Valet is usually the right call: deep interior clean, seat shampoo and carpet extraction. For something needing real correction (swirl marks, dull paint, before a sale), Premium Detail goes further with clay bar decon and machine polish. Which sounds closer to what you need?`,
        counts: true,
      }
    }
    if (intent === 'new_booking_enquiry') {
      return {
        text: `${coveragePrefix}Happy to get you booked in! The Book Now button lets you pick a package, date and time in about a minute. Essential starts at £80, Full Valet at £140 and Premium Detail at £220. Want a hand choosing?`,
        counts: true,
      }
    }
    return {
      text: `${coveragePrefix}Our packages: Essential from £80, Full Valet (most popular) from £140, Premium Detail from £220. The exact price depends on vehicle size. Which one sounds right, and what's your vehicle?`,
      counts: true,
    }
  }

  if (intent === 'coverage_enquiry' || extracted.postcode || (town && !intent)) {
    const postcode = (extracted.postcode as string | undefined) ?? (intent === 'coverage_enquiry' ? next.postcode : null)
    if (postcode) {
      const out = executeTool('check_coverage', { postcode }).output as { covered: boolean | 'unknown'; area?: string }
      return {
        text: out.covered === true
          ? `Good news, ${out.area} is well within our coverage area. Are you looking to get something booked in?`
          : `I can't confirm that exact postcode from here, but we cover roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius from ${BUSINESS_INFO.baseLocation}, so it's worth a quick check via WhatsApp/call on ${BUSINESS_INFO.phone}.`,
        counts: true,
      }
    }
    if (town) {
      return { text: `Yes, we cover ${town.place} regularly. Are you looking to get something booked in?`, counts: true }
    }
    return {
      text: `We cover roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius around Hemel Hempstead, including Watford, St Albans, Berkhamsted, Harpenden and more. What's your postcode? I can check straight away.`,
      counts: true,
    }
  }

  if (intent === 'availability_enquiry') {
    const out = executeTool('check_availability', {}).output as { timeSlots: string[] }
    return {
      text: `We run ${BUSINESS_INFO.hours}, with slots at ${out.timeSlots.join(', ')}. There's no live calendar here, so a preferred slot gets confirmed ${BUSINESS_INFO.bookingConfirmationWindow}. What day were you thinking?`,
      counts: true,
    }
  }

  if (intent === 'existing_booking' || intent === 'rescheduling_or_cancellation') {
    return {
      text: intent === 'rescheduling_or_cancellation'
        ? `I can't pull up bookings from here, but rescheduling or cancelling is easy. Call or WhatsApp us on ${BUSINESS_INFO.phone} (at least 24 hours notice avoids a late-cancellation fee).`
        : `I don't have access to booking records from here. Call or WhatsApp us on ${BUSINESS_INFO.phone} with your name or reference and we'll pull it up straight away.`,
      counts: true,
    }
  }

  if (intent === 'aftercare_question') {
    return {
      text: `That's the kind of thing our team can give you a precise answer on for your specific job. WhatsApp or call ${BUSINESS_INFO.phone}. In general: ${BUSINESS_INFO.satisfactionPromise}`,
      counts: true,
    }
  }

  if (intent === 'vehicle_or_service_question') {
    if (/difference|compare|\bvs\b|versus/i.test(message)) {
      return {
        text: PACKAGES.map(p => `${p.id} (${p.duration}, from £${p.price.small}): ${p.includes.slice(0, 3).join(', ')}`).join('. ') + '. Want the full list for one of them?',
        counts: true,
      }
    }
    if (/how long/i.test(message) && !extracted.package) {
      return {
        text: `Essential takes ${PACKAGES[0].duration}, Full Valet ${PACKAGES[1].duration} and Premium Detail ${PACKAGES[2].duration}. We work on your drive, so you can get on with your day.`,
        counts: true,
      }
    }
    const pkgMatch = next.enquiry.package ? PACKAGES.find(p => p.id === next.enquiry.package) : null
    return {
      text: pkgMatch
        ? `${pkgMatch.id} (${pkgMatch.duration}) includes: ${pkgMatch.includes.join(', ')}. Anything else you'd like to know?`
        : 'Essential is a quick refresh, Full Valet adds a deep interior clean and seat shampoo, Premium Detail adds clay bar decon and machine polish. Want details on a specific one?',
      counts: true,
    }
  }

  if (intent === 'general_business_question') {
    return {
      text: `We're open ${BUSINESS_INFO.hours}. You can reach us on ${phoneAndHours()} or ${BUSINESS_INFO.email}. Payment's on the day (card, bank transfer or cash), no deposit needed.`,
      counts: true,
    }
  }

  if (extracted.vehicleRegistration) {
    return {
      text: `Thanks, I've noted your reg as ${extracted.vehicleRegistration}. What can I help with: a price, checking we cover your area, or getting booked in?`,
      counts: true,
    }
  }

  return null
}

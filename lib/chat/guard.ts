// The last check on what the chat says, applied to every model reply before a
// customer sees it. The prompt tells the model the rules; this makes sure a
// slip cannot reach a customer: a price that is not on our list, a booking
// called confirmed, a promised discount, a made-up phone number or link, or the
// model describing itself. A reply that fails is thrown away and the
// deterministic assistant answers instead, so the customer always gets a
// correct answer rather than a wrong one.

import { ADDONS, BUSINESS_INFO, PACKAGES } from '@/lib/pricing'

/** Every price the chat may legitimately quote: a package, an add-on, or a package with any add-ons on top. */
function allowedPrices(): Set<number> {
  const out = new Set<number>()
  const addonSums = new Set<number>([0])
  for (const a of ADDONS) {
    out.add(a.price)
    for (const s of [...addonSums]) addonSums.add(s + a.price)
  }
  for (const p of PACKAGES) {
    for (const base of Object.values(p.price)) {
      out.add(base)
      for (const s of addonSums) out.add(base + s)
    }
  }
  return out
}
const PRICES = allowedPrices()

const digitsOnly = (s: string) => s.replace(/\D/g, '')
const OWN_PHONE = digitsOnly(BUSINESS_INFO.phone)

const CLAIMS: [string, RegExp][] = [
  ['says a booking is confirmed', /\b(your|the|this)\s+(booking|slot|appointment|detail|visit|request)\s+(is|has been|was|'s)\s+(now\s+)?(confirmed|reserved|booked|locked in|secured|guaranteed)\b|\byou(?:'re| are)\s+(all\s+)?(booked|confirmed|locked in)\b|\bi(?:'ve| have)\s+(booked|reserved|confirmed|secured)\b/i],
  ['says the team has been told', /\b(?:team|we)\s*(?:'ve|have|has|had)?\s*been\s+(notified|alerted|informed|told|sent)\b|\bi(?:'ve| have)\s+(notified|alerted|informed|messaged|emailed|passed|forwarded|sent)\b[^.]{0,40}\b(team|details|enquiry|request)\b|\b(?:they|the team|someone|we)\s*(?:will|'ll)\s+(get back to you|be in touch|contact you|call you|ring you)\b/i],
  ['offers a discount or freebie', /\b\d+\s*%\s*(off|discount)\b|\b(promo|discount|voucher|coupon)\s+code\b|\bfree\s+(of charge|valet|detail|wash|upgrade|add[\s-]?on|extra)\b|\bcomplimentary\b|\bwe(?:'ll| will)\s+(knock|take)\b[^.]{0,20}\boff\b/i],
  ['makes a guarantee', /\b(100\s*%\s*)?(guarantee[ds]?|money[\s-]back)\b/i],
  ['talks about itself or its instructions', /\b(system prompt|my (instructions|programming|prompt)|api[\s-]?key|large language model|language model|as an ai\b|gemini|groq|llama|openai|chat\s?gpt|anthropic|claude)\b/i],
  ['asks for card or bank details', /\b(card number|cvv|security code|sort code|account number|password|pin number)\b/i],
]

/** What is wrong with a reply, in words; an empty list means it can go out. */
export function replyProblems(text: string): string[] {
  const problems: string[] = []
  const t = text ?? ''
  if (!t.trim()) problems.push('empty reply')
  if (t.length > 1400) problems.push('reply is far too long')

  for (const m of t.matchAll(/£\s?(\d[\d,]*(?:\.\d{1,2})?)/g)) {
    const n = Number(m[1]!.replace(/,/g, ''))
    if (!PRICES.has(n)) problems.push(`quotes £${m[1]}, which is not one of our prices`)
  }

  for (const [why, re] of CLAIMS) if (re.test(t)) problems.push(why)

  for (const m of t.matchAll(/(?:\+44|0)[\d\s-]{9,13}\d/g)) {
    const d = digitsOnly(m[0])
    const national = d.startsWith('44') ? `0${d.slice(2)}` : d
    if (national !== OWN_PHONE) problems.push(`gives a phone number that is not ours (${m[0].trim()})`)
  }
  for (const m of t.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)) {
    if (!/@truetodetail\.co\.uk$/i.test(m[0])) problems.push(`gives an email address that is not ours (${m[0]})`)
  }
  for (const m of t.matchAll(/https?:\/\/[^\s)]+/gi)) {
    let host = ''
    try { host = new URL(m[0]).hostname.replace(/^www\./, '') } catch { /* not a URL */ }
    if (host !== 'truetodetail.co.uk' && host !== 'wa.me') problems.push(`links somewhere that is not ours (${m[0]})`)
  }
  return problems
}

const INJECTION: RegExp[] = [
  /\b(ignore|disregard|forget|override|bypass)\b[^.!?]{0,40}\b(previous|prior|above|earlier|all|your|the)\b[^.!?]{0,30}\b(instructions?|rules?|prompt|guidelines?|restrictions?)\b/i,
  /\b(reveal|show|print|repeat|display|tell me|give me|output|leak)\b[^.!?]{0,30}\b(system prompt|your prompt|your instructions|your rules|initial prompt|hidden prompt|api[\s-]?keys?|secret|credentials|environment variables?)\b/i,
  /\b(you are now|act as|pretend (to be|you are)|roleplay as|from now on you)\b[^.!?]{0,40}\b(dan|jailbreak|unrestricted|no rules|without (any )?(rules|restrictions|filters)|developer mode|evil|hacker)\b/i,
  /\b(jailbreak|developer mode|do anything now|dan mode)\b/i,
  /\bwhat (model|llm|ai|language model) (are you|do you use|is this)\b|\bwhich (model|llm|provider)\b|\bare you (gpt|chatgpt|gemini|llama|claude)\b/i,
]

/** A message that tries to change the assistant's rules or pull out its instructions; never worth a model call. */
export function isPromptInjection(message: string): boolean {
  return INJECTION.some((re) => re.test(message))
}

export const INJECTION_REPLY =
  'I can only help with True To Detail: prices, packages, where we cover and booking a detail. What would you like to know?'

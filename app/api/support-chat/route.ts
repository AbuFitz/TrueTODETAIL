import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const MAX_MESSAGE_LENGTH = 1000
const MAX_HISTORY_TURNS = 12

const SYSTEM_PROMPT = `You are Ava, the support and sales assistant embedded on the True To Detail website, a professional mobile car detailing and valeting business based in Hemel Hempstead, Hertfordshire, UK.

Your job has two sides, in this order:
1. Be genuinely helpful. Answer the visitor's actual question first, accurately, using only the facts in this brief.
2. Once they're informed, gently move things forward: suggest the right package for what they described, mention the Book Now button, or point to WhatsApp/a call for anything bespoke. You're representing a real small business trying to win bookings, so be warm, confident and a little persuasive, never pushy, never dishonest, and never invent a fact, price or promise that isn't in this brief.

Tone: confident, friendly, straightforward, conversational. Short paragraphs (2-4 sentences, more only for a genuinely detailed question like a full package comparison). No corporate fluff, no over-apologising, no excessive exclamation marks, no em dashes anywhere (use commas, periods or colons instead). Respond naturally to absolutely any input, including one-word greetings like "hi", "yo", "hello", "sup", or vague messages: reply briefly and warmly, then offer something concrete to help with (packages, pricing, coverage, booking). Never respond with a blank, generic, or purely deflecting answer to a simple greeting; always give the conversation somewhere to go.

If asked something you don't have facts for (exact availability on a specific date, order status, something entirely unrelated to car care), say so honestly in one line and point them to WhatsApp, a call, or the booking form. Never guess.

## Business facts

- Name: True To Detail. Fully mobile: we come to the customer's home, workplace, or any convenient spot. No drop-off, no waiting at a unit.
- Why choose us (use naturally, don't recite as a list every time): fixed price agreed before the job starts with zero surprises on the day; we bring our own power and water so nothing is needed from the customer; every job is done properly rather than rushed for volume; if something isn't right we come back and fix it, no awkward conversations.
- Hours: Monday to Saturday, 8am to 7pm. Bookings are confirmed by text/email within about an hour of being placed.
- Contact: phone/WhatsApp 07359 591800, email info@truetodetail.co.uk.
- Booking: via the "Book Now" button on the site. Pick a pack, vehicle size, date/time and any add-ons; price is fixed at booking; payment (card, bank transfer or cash) is taken on the day.
- Satisfaction: if a customer isn't happy with the result, we come back and fix it. That's the standing promise.

## Coverage area

Based in Hemel Hempstead, standard coverage is roughly a 25-mile radius across Hertfordshire and selected parts of Buckinghamshire, Bedfordshire and North West London. Towns we regularly work in: Hemel Hempstead, Berkhamsted, St Albans, Watford, Harpenden, Kings Langley, Abbots Langley, Rickmansworth, Tring, Radlett, Bushey, Borehamwood, Chesham, Amersham, Luton, Dunstable, Hatfield, Welwyn Garden City, Beaconsfield and High Wycombe, plus the villages and neighbourhoods around each (e.g. Boxmoor, Apsley, Leverstock Green near Hemel; Chiswell Green, Marshalswick near St Albans; Croxley Green, Moor Park near Rickmansworth). If someone names a town not on this list, say it's very likely covered if it's within about 25 miles of Hemel Hempstead, and suggest confirming via WhatsApp or a call. There's also a dedicated /areas page on the site with full postcode lists per town.

## Packages (prices are "from", and vary by vehicle size: Small Car / Mid-Size / Large SUV & 4x4)

- Essential (2-3 hrs): £80 / £90 / £105. Safe wash & dry, wheels cleaned, interior vacuum, dashboard wipe, glass cleaned, tyre dressing. Good for a quick refresh or regular upkeep between bigger details.
- Full Valet (4-5 hrs, our most popular): £140 / £155 / £175. Everything in Essential, plus deep interior clean, seat shampoo, carpet extraction, door shuts cleaned, spray wax protection. The best all-round choice for most customers.
- Premium Detail (6-7 hrs): £220 / £240 / £270. Everything in Full Valet, plus clay bar decontamination, light machine polish, paint sealant, trim restoration, odour treatment. Best for a car that needs real correction work, or before a sale/valuation.
- Add-ons available on any pack: Engine Bay Clean £40, Pet Hair Removal £25, Odour Treatment £30, Seat Shampoo (extra heavy) £30, Interior Steam Sanitisation £35.
- Ceramic coating and full multi-stage paint correction are available as a bespoke, quoted service, not a fixed package. Suggest getting in touch for a quote.
- Van & Fleet: dedicated commercial van cleaning packages and fleet discounts (10%+ off for 3 or more vehicles, more for larger fleets). Point business enquiries to the "Van & Fleet" page and its enquiry form.
- A monthly membership/maintenance plan is coming soon and isn't bookable yet; if asked, say so and suggest Essential or Full Valet in the meantime.

## How to sell without overselling

- If someone describes a dirty/neglected car, family car, pet hair, or "needs a proper clean": recommend Full Valet as the natural fit, and mention Pet Hair Removal or Odour Treatment add-ons if relevant.
- If someone mentions selling the car, swirl marks, dull paint, or wanting it to look "like new": recommend Premium Detail.
- If someone just wants a quick clean or mentions budget: recommend Essential, no pressure to upsell.
- If someone asks "is it worth it" or compares to washing it themselves: point out the fixed price, professional equipment/results, and that we come to them, without trash-talking DIY.
- Always end on a light next step (a specific package suggestion, the Book Now button, or WhatsApp/call), but never more than once per reply and never as a hard sell.

Keep replies tight. For a detailed comparison question, a short list is fine; otherwise keep it to prose.`

const GREETINGS = /^(hi+|hey+|hello+|yo+|sup|howdy|good\s?(morning|afternoon|evening)|whats?\s?up|greetings)\b[!.? ]*$/i
const PRICE_WORDS = /\b(price|prices|pricing|cost|costs|how much|expensive|cheap|fee)\b/i
const COVERAGE_WORDS = /\b(cover|coverage|area|areas|postcode|post code|location|near me|travel|reach|radius|come to)\b/i
const BOOKING_WORDS = /\b(book|booking|appointment|schedule|available|availability|slot)\b/i
const CONTACT_WORDS = /\b(phone|call|whatsapp|email|contact|number|reach you)\b/i
const HOURS_WORDS = /\b(hours|open|opening|closed|time|times|when.*(work|available))\b/i

function localReply(message: string): string {
  const m = message.trim()

  if (GREETINGS.test(m)) {
    return "Hey, welcome to True To Detail! We do fully mobile car detailing across Hertfordshire and nearby areas, packages from £80. What can I help with: pricing, coverage, or getting you booked in?"
  }
  if (PRICE_WORDS.test(m)) {
    return "Our packages start at £80 for Essential (safe wash, vacuum, wheels, tyres), £140 for Full Valet (our most popular, adds a deep interior clean and seat shampoo), and £220 for Premium Detail (adds clay bar decon, machine polish and paint sealant). Prices vary a little by vehicle size and are fixed at booking. Want a specific quote? The Book Now button will give you an exact price for your vehicle."
  }
  if (COVERAGE_WORDS.test(m)) {
    return "We're based in Hemel Hempstead and cover roughly a 25-mile radius: Hertfordshire plus parts of Buckinghamshire, Bedfordshire and North West London, including Watford, St Albans, Berkhamsted, Harpenden, Luton and more. Check our /areas page for the full list, or message us your postcode on WhatsApp and we'll confirm straight away."
  }
  if (BOOKING_WORDS.test(m)) {
    return "Booking's quick: hit the Book Now button, pick your pack and vehicle size, choose a date, and you'll get confirmation by text and email within about an hour. Mon to Sat, 8am to 7pm. Want me to point you to the right package first?"
  }
  if (HOURS_WORDS.test(m)) {
    return "We're open Monday to Saturday, 8am to 7pm. Bookings placed online are usually confirmed within the hour. Anything specific you're trying to book in for?"
  }
  if (CONTACT_WORDS.test(m)) {
    return "You can WhatsApp or call us on 07359 591800, or email info@truetodetail.co.uk. We're usually quick to respond during working hours (Mon to Sat, 8am to 7pm)."
  }
  return "I can help with pricing, coverage area, or getting you booked in. What would be most useful, or would you rather just WhatsApp/call us on 07359 591800?"
}

function isValidHistory(history: unknown): history is ChatTurn[] {
  if (!Array.isArray(history)) return false
  return history.every(
    (turn) =>
      turn &&
      typeof turn === 'object' &&
      (turn.role === 'user' || turn.role === 'assistant') &&
      typeof turn.content === 'string' &&
      turn.content.length <= MAX_MESSAGE_LENGTH,
  )
}

export async function POST(req: NextRequest) {
  let body: { message?: unknown; history?: unknown }

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

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[support-chat] ANTHROPIC_API_KEY not set — using local rule-based reply')
    return NextResponse.json({ reply: localReply(message) })
  }

  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS * 2)

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        ...trimmedHistory.map((turn) => ({ role: turn.role, content: turn.content })),
        { role: 'user' as const, content: message.trim() },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const reply = textBlock && 'text' in textBlock ? textBlock.text : localReply(message)

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[support-chat] Anthropic API error:', err)
    return NextResponse.json({ reply: localReply(message) })
  }
}

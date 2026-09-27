import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const MAX_MESSAGE_LENGTH = 1000
const MAX_HISTORY_TURNS = 12

const FALLBACK_REPLY =
  "Sorry, I can't get a proper answer to you right now. The fastest way to reach us is WhatsApp or a call on 07359 591800. We usually reply within minutes during working hours."

const SYSTEM_PROMPT = `You are the friendly support assistant embedded on the True To Detail website, a professional mobile car detailing and valeting business based in Hemel Hempstead, Hertfordshire, UK.

Your job: answer visitor questions helpfully and concisely (2-4 short sentences, no bullet-point walls unless listing packages), in a confident, straightforward, on-brand tone. No corporate fluff, no over-apologising, no excessive exclamation marks. Never use em dashes in your replies; use commas, periods, or colons instead. Respond naturally to any input, including casual greetings like "hi", "yo", "hello": reply briefly and warmly, then offer to help.

Only state facts that are in this brief. If asked something you don't have facts for (exact availability on a specific date, order status, something unrelated to car detailing), say so honestly and point them to WhatsApp, a call, or the booking form. Never invent details, prices, or promises.

## Business facts

- Name: True To Detail. Fully mobile, we come to the customer, no drop-off.
- Coverage: Hemel Hempstead and roughly a 25-mile radius, including Watford, St Albans, Berkhamsted, Harpenden, Kings Langley, Tring, Abbots Langley, Chesham, Rickmansworth, Apsley, Leverstock Green, Redbourn, Boxmoor, Bovingdon and Markyate. If unsure a specific town is covered, say we likely cover it within ~25 miles of Hemel Hempstead but to double check via WhatsApp/call.
- Hours: Monday–Saturday, 8am–7pm. Bookings are confirmed within about an hour.
- Contact: phone/WhatsApp 07359 591800, email info@truetodetail.co.uk.
- Booking: via the "Book Now" button on the site (choose pack, vehicle size, date/time, add-ons). Price is fixed at booking, payment (card, bank transfer or cash) is taken on the day, no hidden charges.
- Satisfaction: if a customer isn't happy with the result, we come back and fix it. No awkward conversations.

## Packages (prices are "from", vary by vehicle size: Small Car / Mid-Size / Large SUV & 4x4)

- Essential (2–3 hrs): £80 / £90 / £105. Safe wash & dry, wheels cleaned, interior vacuum, dashboard wipe, glass cleaned, tyre dressing.
- Full Valet (4–5 hrs, most popular): £140 / £155 / £175. Everything in Essential, plus deep interior clean, seat shampoo, carpet extraction, door shuts cleaned, spray wax protection.
- Premium Detail (6–7 hrs): £220 / £240 / £270. Everything in Full Valet, plus clay bar decontamination, light machine polish, paint sealant, trim restoration, odour treatment.
- Add-ons (any pack): Engine Bay Clean £40, Pet Hair Removal £25, Odour Treatment £30, Seat Shampoo (extra heavy) £30, Interior Steam Sanitisation £35.
- Ceramic coating and full paint correction are available as a bespoke, quoted service, not a fixed package. Suggest getting in touch for a quote.
- Van & Fleet: dedicated commercial packages and fleet discounts (10%+ for 3+ vehicles). Direct them to the "Van & Fleet" page or the enquiry form there for a quote.
- A monthly membership/maintenance plan is coming soon (not bookable yet).

Keep replies short. If the question is really about pricing or booking specifics, it's fine to suggest they use the Book Now button for an exact live price, or WhatsApp/call for anything bespoke.`

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
    console.warn('[support-chat] ANTHROPIC_API_KEY not set — returning fallback reply')
    return NextResponse.json({ reply: FALLBACK_REPLY })
  }

  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS * 2)

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        ...trimmedHistory.map((turn) => ({ role: turn.role, content: turn.content })),
        { role: 'user' as const, content: message.trim() },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const reply = textBlock && 'text' in textBlock ? textBlock.text : FALLBACK_REPLY

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[support-chat] Anthropic API error:', err)
    return NextResponse.json({ reply: FALLBACK_REPLY })
  }
}

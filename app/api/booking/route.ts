import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { notificationEmail, confirmationEmail, notificationText, confirmationText, EmailData } from '@/lib/emails/templates'
import { PACKAGES, ADDONS, VEHICLE_LABELS, TIME_SLOTS, calculatePrice, type VehicleType } from '@/lib/pricing'
import { allowRequest, clientIp } from '@/lib/rateLimit'
import { formatBookingDate, isSlotAvailable, isValidBookingDate } from '@/lib/slots'

// Allows the job system's account.truetodetail.co.uk app (a separate origin
// from this Next.js app) to post a booking from its own login page's quick
// booking popup, through the exact same lead capture flow as this site's
// own booking modal.
const ALLOWED_ORIGINS = new Set([
  'https://app.truetodetail.co.uk',
  'https://www.truetodetail.co.uk',
  'https://truetodetail.co.uk',
])

function corsHeaders(origin: string | null): HeadersInit {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  }
  return {}
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) })
}

export interface BookingPayload {
  pack: string
  vehicle: string
  date: string
  time: string
  name: string
  phone: string
  email: string
  address: string
  carReg: string
  addons: string[]
  notes?: string
}

export interface BookingRecord extends BookingPayload {
  id: string
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/
const CAR_REG_RE = /^[A-Z0-9]{2,8}$/
const POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/

// Packages, vehicle types, time slots and add-ons all come from lib/pricing.ts
// — the single source of truth shared with the booking modal and chat assistant.
const VALID_PACKS = PACKAGES.map(p => p.id)
const VALID_VEHICLES: string[] = ['small', 'midsize', 'largesuv']
const VALID_TIMES = TIME_SLOTS
const VALID_ADDONS = ADDONS.map(a => a.id)

const ADDON_LABELS: Record<string, string> = Object.fromEntries(ADDONS.map(a => [a.id, a.label]))

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')

  if (!allowRequest(`booking:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many booking requests. Please call or WhatsApp us on 07359 591800.' },
      { status: 429, headers: corsHeaders(origin) },
    )
  }
  let body: Partial<BookingPayload>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400, headers: corsHeaders(origin) })
  }

  // ── Required field presence — name is optional, everything else isn't ──
  const required: (keyof BookingPayload)[] = [
    'pack', 'vehicle', 'date', 'time', 'phone', 'email', 'address', 'carReg',
  ]
  for (const field of required) {
    if (body[field] == null || body[field] === '') {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400, headers: corsHeaders(origin) })
    }
  }

  // ── Every text field must really be text, or .trim() below would throw ──
  const textFields: (keyof BookingPayload)[] = [...required, 'name', 'notes']
  for (const field of textFields) {
    if (body[field] !== undefined && body[field] !== null && typeof body[field] !== 'string') {
      return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400, headers: corsHeaders(origin) })
    }
  }
  if (body.addons !== undefined && (!Array.isArray(body.addons) || body.addons.some(a => typeof a !== 'string'))) {
    return NextResponse.json({ error: 'Invalid addons format' }, { status: 400, headers: corsHeaders(origin) })
  }

  const data = { ...body, addons: body.addons ?? [] } as BookingPayload

  // ── Field validation ──
  if (!VALID_PACKS.includes(data.pack)) {
    return NextResponse.json({ error: 'Invalid pack selection' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!VALID_VEHICLES.includes(data.vehicle)) {
    return NextResponse.json({ error: 'Invalid vehicle type' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!PHONE_RE.test(data.phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400, headers: corsHeaders(origin) })
  }
  // Date must be today or later in UK time (ISO yyyy-mm-dd)
  if (!isValidBookingDate(data.date)) {
    return NextResponse.json({ error: 'Invalid or past date' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!VALID_TIMES.includes(data.time)) {
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!isSlotAvailable(data.date, data.time)) {
    return NextResponse.json(
      { error: 'That time has already passed today. Please pick a later slot or another day.' },
      { status: 400, headers: corsHeaders(origin) },
    )
  }
  // Name is optional, but cap length to keep it sane if provided.
  if (data.name && data.name.trim().length > 100) {
    return NextResponse.json({ error: 'Name is too long' }, { status: 400, headers: corsHeaders(origin) })
  }
  const normalizedPostcode = data.address.trim().toUpperCase()
  if (!POSTCODE_RE.test(normalizedPostcode)) {
    return NextResponse.json({ error: 'Please enter a valid UK postcode' }, { status: 400, headers: corsHeaders(origin) })
  }
  const normalizedReg = data.carReg.trim().toUpperCase().replace(/\s+/g, '')
  if (!CAR_REG_RE.test(normalizedReg)) {
    return NextResponse.json({ error: 'Invalid vehicle registration' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!Array.isArray(data.addons)) {
    return NextResponse.json({ error: 'Invalid addons format' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (data.addons.some(a => !VALID_ADDONS.includes(a))) {
    return NextResponse.json({ error: 'Invalid add-on selection' }, { status: 400, headers: corsHeaders(origin) })
  }
  if (data.notes && data.notes.length > 1000) {
    return NextResponse.json({ error: 'Notes too long (max 1000 characters)' }, { status: 400, headers: corsHeaders(origin) })
  }

  // ── Price is always computed server-side — never trust a client-supplied price ──
  const priced = calculatePrice(data.pack, data.vehicle as VehicleType, data.addons)
  const price = priced?.total ?? 0

  // ── Build booking record ──
  // Short, human-readable reference: TTD-YYMMDD-XXXX
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const refPart = Math.random().toString(36).slice(2, 6).toUpperCase()
  const id = `TTD-${datePart}-${refPart}`
  const createdAt = new Date().toISOString()

  const booking: BookingRecord = {
    id,
    pack: data.pack,
    vehicle: data.vehicle,
    price,
    date: data.date,
    time: data.time,
    name: (data.name ?? '').trim(),
    phone: data.phone.trim(),
    email: data.email.toLowerCase().trim(),
    address: normalizedPostcode,
    carReg: normalizedReg,
    addons: data.addons,
    notes: data.notes?.trim() || '',
    status: 'pending',
    createdAt,
  }

  // ── Email via Resend ──
  // Sent from a no-reply address; replies are routed to the monitored inbox instead.
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.BOOKING_FROM_EMAIL ?? 'noreply@truetodetail.co.uk'
  const replyToEmail = 'bookings@truetodetail.co.uk'

  // The staff email (and the webhook, if set) is the only record of a
  // booking, so track whether either actually got through.
  let staffNotified = false
  let webhookDelivered = false

  if (resendKey) {
    const resend = new Resend(resendKey)

    const emailData: EmailData = {
      id: booking.id,
      pack: booking.pack,
      vehicle: VEHICLE_LABELS[booking.vehicle as VehicleType] ?? booking.vehicle,
      price: booking.price,
      date: formatBookingDate(booking.date),
      time: booking.time,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      address: booking.address,
      carReg: booking.carReg,
      addons: booking.addons.map(a => ADDON_LABELS[a] ?? a),
      notes: booking.notes,
      createdAt: booking.createdAt,
    }

    const [staff] = await Promise.allSettled([
      // Staff notification — flagged high-importance so it stands out in the
      // inbox (Gmail/Outlook show a priority marker on these headers), since
      // every new booking needs a same-day response.
      resend.emails.send({
        from: fromEmail,
        to: 'bookings@truetodetail.co.uk',
        replyTo: replyToEmail,
        subject: `New Booking: ${booking.pack} · ${formatBookingDate(booking.date)} · Ref ${booking.id}`,
        html: notificationEmail(emailData),
        text: notificationText(emailData),
        headers: {
          Importance: 'high',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
        },
      }),
      // Customer confirmation
      resend.emails.send({
        from: fromEmail,
        to: booking.email,
        replyTo: replyToEmail,
        subject: `Booking request received: ${formatBookingDate(booking.date)}`,
        html: confirmationEmail(emailData),
        text: confirmationText(emailData),
      }),
    ])
    // Resend reports most failures in the result rather than by throwing.
    staffNotified = staff.status === 'fulfilled' && !staff.value.error
    if (!staffNotified) {
      console.error('[booking] staff notification failed:', staff.status === 'fulfilled' ? staff.value.error : staff.reason)
    }
  } else {
    console.warn('[booking] RESEND_API_KEY not set, emails skipped')
  }

  // ── Forward to webhook (e.g. Zapier / Make / n8n) ──
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
        signal: AbortSignal.timeout(8000),
      })
      webhookDelivered = res.ok
      if (!res.ok) {
        console.error('[booking] Webhook responded with', res.status)
      }
    } catch (err) {
      // Non-fatal — log and continue
      console.error('[booking] Webhook delivery failed:', err)
    }
  }

  // If delivery is configured but nothing got through, the request would be
  // lost while the customer thinks it was sent. Say so instead.
  if ((resendKey || webhookUrl) && !staffNotified && !webhookDelivered) {
    console.error(`[booking] ${booking.id} not delivered anywhere`, JSON.stringify(booking))
    return NextResponse.json(
      { error: "Sorry, we couldn't send your request just now. Please call or WhatsApp us on 07359 591800 and we'll book you in." },
      { status: 502, headers: corsHeaders(origin) },
    )
  }

  return NextResponse.json(
    {
      success: true,
      booking: {
        id: booking.id,
        pack: booking.pack,
        vehicle: booking.vehicle,
        price: booking.price,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    },
    { status: 201, headers: corsHeaders(origin) },
  )
}

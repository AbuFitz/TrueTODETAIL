import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { notificationEmail, confirmationEmail, EmailData } from '@/lib/emails/templates'

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

const VALID_PACKS = ['Essential', 'Full Valet', 'Premium Detail']
const VALID_VEHICLES = ['small', 'midsize', 'largesuv']
const VALID_TIMES = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']
const VALID_ADDONS = ['engine-bay', 'pet-hair', 'odour', 'seat-shampoo', 'steam']

const ADDON_LABELS: Record<string, string> = {
  'engine-bay':   'Engine Bay Clean',
  'pet-hair':     'Pet Hair Removal',
  'odour':        'Odour Treatment',
  'seat-shampoo': 'Seat Shampoo (Extra Heavy)',
  'steam':        'Interior Steam Sanitisation',
}

const VEHICLE_LABELS: Record<string, string> = {
  small:    'Small Car',
  midsize:  'Mid-Size',
  largesuv: 'Large SUV / 4×4',
}

// Source of truth for pricing — kept in sync with components/Packages.tsx and BookingModal.tsx.
// The API computes price itself rather than trusting whatever the client submits.
const PRICE_MAP: Record<string, Record<string, number>> = {
  'Essential':      { small: 80,  midsize: 90,  largesuv: 105 },
  'Full Valet':     { small: 140, midsize: 155, largesuv: 175 },
  'Premium Detail': { small: 220, midsize: 240, largesuv: 270 },
}

const ADDON_PRICES: Record<string, number> = {
  'engine-bay':   40,
  'pet-hair':     25,
  'odour':        30,
  'seat-shampoo': 30,
  'steam':        35,
}

export async function POST(req: NextRequest) {
  let body: Partial<BookingPayload>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // ── Required field presence — name is optional, everything else isn't ──
  const required: (keyof BookingPayload)[] = [
    'pack', 'vehicle', 'date', 'time', 'phone', 'email', 'address', 'carReg',
  ]
  for (const field of required) {
    if (body[field] === undefined || body[field] === '') {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  // ── Type-safe cast after presence check ──
  const data = body as BookingPayload

  // ── Field validation ──
  if (!VALID_PACKS.includes(data.pack)) {
    return NextResponse.json({ error: 'Invalid pack selection' }, { status: 400 })
  }
  if (!VALID_VEHICLES.includes(data.vehicle)) {
    return NextResponse.json({ error: 'Invalid vehicle type' }, { status: 400 })
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  if (!PHONE_RE.test(data.phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }
  // Date must be today or future (ISO yyyy-mm-dd)
  const bookingDate = new Date(data.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (isNaN(bookingDate.getTime()) || bookingDate < today) {
    return NextResponse.json({ error: 'Invalid or past date' }, { status: 400 })
  }
  if (!VALID_TIMES.includes(data.time)) {
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })
  }
  // Name is optional, but cap length to keep it sane if provided.
  if (data.name && data.name.trim().length > 100) {
    return NextResponse.json({ error: 'Name is too long' }, { status: 400 })
  }
  const normalizedPostcode = data.address.trim().toUpperCase()
  if (!POSTCODE_RE.test(normalizedPostcode)) {
    return NextResponse.json({ error: 'Please enter a valid UK postcode' }, { status: 400 })
  }
  const normalizedReg = data.carReg.trim().toUpperCase().replace(/\s+/g, '')
  if (!CAR_REG_RE.test(normalizedReg)) {
    return NextResponse.json({ error: 'Invalid vehicle registration' }, { status: 400 })
  }
  if (!Array.isArray(data.addons)) {
    return NextResponse.json({ error: 'Invalid addons format' }, { status: 400 })
  }
  if (data.addons.some(a => !VALID_ADDONS.includes(a))) {
    return NextResponse.json({ error: 'Invalid add-on selection' }, { status: 400 })
  }
  if (data.notes && data.notes.length > 1000) {
    return NextResponse.json({ error: 'Notes too long (max 1000 characters)' }, { status: 400 })
  }

  // ── Price is always computed server-side — never trust a client-supplied price ──
  const basePrice = PRICE_MAP[data.pack][data.vehicle]
  const addonTotal = data.addons.reduce((sum, a) => sum + (ADDON_PRICES[a] ?? 0), 0)
  const price = basePrice + addonTotal

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

  if (resendKey) {
    const resend = new Resend(resendKey)

    const emailData: EmailData = {
      id: booking.id,
      pack: booking.pack,
      vehicle: VEHICLE_LABELS[booking.vehicle] ?? booking.vehicle,
      price: booking.price,
      date: booking.date,
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

    await Promise.allSettled([
      // Staff notification
      resend.emails.send({
        from: fromEmail,
        to: 'bookings@truetodetail.co.uk',
        replyTo: replyToEmail,
        subject: `New Booking: ${booking.pack} · ${booking.date} · Ref ${booking.id}`,
        html: notificationEmail(emailData),
      }),
      // Customer confirmation
      resend.emails.send({
        from: fromEmail,
        to: booking.email,
        replyTo: replyToEmail,
        subject: `Your Detail is Confirmed: ${booking.date}`,
        html: confirmationEmail(emailData),
      }),
    ])
  } else {
    console.warn('[booking] RESEND_API_KEY not set — emails skipped')
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
      if (!res.ok) {
        console.error('[booking] Webhook responded with', res.status)
      }
    } catch (err) {
      // Non-fatal — log and continue
      console.error('[booking] Webhook delivery failed:', err)
    }
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
    { status: 201 },
  )
}

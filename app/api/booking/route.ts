import { NextRequest, NextResponse } from 'next/server'

export interface BookingPayload {
  pack: string
  vehicle: string
  price: number
  date: string
  time: string
  name: string
  phone: string
  email: string
  address: string
  notes?: string
}

export interface BookingRecord extends BookingPayload {
  id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/

const VALID_PACKS = ['Essential', 'Deep Clean', 'Premium', 'Elite Ceramic']
const VALID_VEHICLES = ['sedan', 'suv', 'exotic']
const VALID_TIMES = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']

export async function POST(req: NextRequest) {
  let body: Partial<BookingPayload>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // ── Required field presence ──
  const required: (keyof BookingPayload)[] = [
    'pack', 'vehicle', 'price', 'date', 'time', 'name', 'phone', 'email', 'address',
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
  if (typeof data.price !== 'number' || data.price <= 0 || data.price > 10000) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
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
  if (data.name.trim().length < 2 || data.name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (data.address.trim().length < 5 || data.address.trim().length > 300) {
    return NextResponse.json({ error: 'Please provide a valid service address' }, { status: 400 })
  }
  if (data.notes && data.notes.length > 1000) {
    return NextResponse.json({ error: 'Notes too long (max 1000 characters)' }, { status: 400 })
  }

  // ── Build booking record ──
  const booking: BookingRecord = {
    id: `TTD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    pack: data.pack,
    vehicle: data.vehicle,
    price: data.price,
    date: data.date,
    time: data.time,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.toLowerCase().trim(),
    address: data.address.trim(),
    notes: data.notes?.trim() || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
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
      // Non-fatal — log and continue so the customer still gets confirmation
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

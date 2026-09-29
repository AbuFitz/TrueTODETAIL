import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { fleetEnquiryEmail, fleetEnquiryText, FleetEnquiryData } from '@/lib/emails/templates'
import { allowRequest, clientIp } from '@/lib/rateLimit'

export interface FleetEnquiryPayload {
  name: string
  business?: string
  phone: string
  fleet?: string
  message?: string
}

const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/
const VALID_FLEET_SIZES = ['1', '2', '3-4', '5-9', '10+', '']

export async function POST(req: NextRequest) {
  if (!allowRequest(`fleet:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many enquiries. Please call us on 07359 591800.' }, { status: 429 })
  }

  let body: Partial<FleetEnquiryPayload>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
  }
  if (!body.phone || !body.phone.trim()) {
    return NextResponse.json({ error: 'Missing required field: phone' }, { status: 400 })
  }
  if (body.name.trim().length < 2 || body.name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (!PHONE_RE.test(body.phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }
  if (body.fleet !== undefined && !VALID_FLEET_SIZES.includes(body.fleet)) {
    return NextResponse.json({ error: 'Invalid fleet size' }, { status: 400 })
  }
  if (body.message && body.message.length > 1000) {
    return NextResponse.json({ error: 'Message too long (max 1000 characters)' }, { status: 400 })
  }
  if (body.business && body.business.length > 100) {
    return NextResponse.json({ error: 'Business name too long' }, { status: 400 })
  }

  const enquiry: FleetEnquiryData = {
    name: body.name.trim(),
    business: body.business?.trim() || '',
    phone: body.phone.trim(),
    fleetSize: body.fleet?.trim() || '',
    message: body.message?.trim() || '',
    createdAt: new Date().toISOString(),
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.BOOKING_FROM_EMAIL ?? 'noreply@truetodetail.co.uk'

  if (resendKey) {
    const resend = new Resend(resendKey)
    const result = await resend.emails.send({
      from: fromEmail,
      to: 'info@truetodetail.co.uk',
      replyTo: 'info@truetodetail.co.uk',
      subject: `New Van & Fleet Enquiry: ${enquiry.business || enquiry.name}`,
      html: fleetEnquiryEmail(enquiry),
      text: fleetEnquiryText(enquiry),
    })
    if (result.error) {
      console.error('[fleet-enquiry] Resend error:', result.error)
      return NextResponse.json({ error: 'Failed to send enquiry. Please call or email us directly.' }, { status: 502 })
    }
  } else {
    console.warn('[fleet-enquiry] RESEND_API_KEY not set — email skipped')
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

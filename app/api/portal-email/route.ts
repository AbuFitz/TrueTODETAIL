import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { allowRequest, clientIp } from '@/lib/rateLimit'
import { callRpc, portalDbConfigured, PortalDbError } from '@/lib/portalDb'
import { renderCustomerEmail, ukWhen, type CustomerEmailKind } from '@/lib/emails/customer'

// The portal (app.truetodetail.co.uk) asks this endpoint to send the emails
// for bookings made or handled there. Who may trigger which email is decided
// inside the database (claim_booking_email), using the caller's own sign-in or
// detailer link, and each email is recorded so it can only go out once.

const ALLOWED_ORIGINS = new Set([
  'https://app.truetodetail.co.uk',
  'https://www.truetodetail.co.uk',
  'https://truetodetail.co.uk',
])

function cors(origin: string | null): HeadersInit {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      Vary: 'Origin',
    }
  }
  return {}
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get('origin')) })
}

const KINDS = ['booked_in', 'assigned', 'on_the_way', 'completed', 'cancelled'] as const
type Kind = (typeof KINDS)[number]
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Claim {
  kind: Kind
  reference: string
  source: 'portal' | 'staff' | 'website'
  customer_email: string | null
  customer_first_name: string | null
  customer_has_account: boolean
  package_name: string
  addon_labels: string[] | null
  price: number | null
  vehicle_description: string | null
  vehicle_registration: string | null
  scheduled_start: string
  postcode: string | null
  cancellation_reason: string | null
  tracking_token: string
  detailer_first_name: string | null
  detailer_vehicle: string | null
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = cors(origin)
  const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers })

  if (!allowRequest(`portal-email:${clientIp(req)}`, 40, 10 * 60 * 1000)) {
    return reply({ error: 'Too many requests' }, 429)
  }

  let body: { bookingId?: unknown; kind?: unknown; detailerToken?: unknown; force?: unknown }
  try { body = await req.json() } catch { return reply({ error: 'Invalid JSON payload' }, 400) }
  if (!body || typeof body !== 'object') return reply({ error: 'Invalid JSON payload' }, 400)

  const { bookingId, kind, detailerToken, force } = body
  if (typeof bookingId !== 'string' || !UUID_RE.test(bookingId)) return reply({ error: 'Invalid booking' }, 400)
  if (typeof kind !== 'string' || !(KINDS as readonly string[]).includes(kind)) return reply({ error: 'Invalid email type' }, 400)
  if (detailerToken !== undefined && detailerToken !== null && (typeof detailerToken !== 'string' || detailerToken.length > 200)) {
    return reply({ error: 'Invalid link' }, 400)
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!portalDbConfigured() || !resendKey) {
    console.warn('[portal-email] not configured (Supabase URL/key or RESEND_API_KEY missing)')
    return reply({ error: 'Email is not set up yet', sent: false }, 503)
  }

  const auth = req.headers.get('authorization')
  const jwt = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : null

  let claim: Claim | null
  try {
    claim = await callRpc<Claim | null>('claim_booking_email', {
      p_booking_id: bookingId,
      p_kind: kind,
      p_detailer_token: (detailerToken as string | null | undefined) ?? null,
      p_force: force === true,
    }, jwt)
  } catch (err) {
    if (err instanceof PortalDbError && (err.code === '42501' || err.status === 401 || err.status === 403)) {
      return reply({ error: 'Not allowed' }, 403)
    }
    console.error('[portal-email] claim failed:', err instanceof Error ? err.message : err)
    return reply({ error: 'Could not check this booking', sent: false }, 502)
  }
  if (!claim) return reply({ sent: false, reason: 'Nothing to send, or already sent' })

  const release = () =>
    callRpc('release_booking_email', { p_booking_id: bookingId, p_kind: kind, p_detailer_token: (detailerToken as string | null | undefined) ?? null }, jwt)
      .catch(e => console.error('[portal-email] release failed:', e instanceof Error ? e.message : e))

  if (!claim.customer_email) {
    await release()
    return reply({ sent: false, reason: 'This customer has no email address' })
  }

  const fromEmail = process.env.BOOKING_FROM_EMAIL ?? 'noreply@truetodetail.co.uk'
  const replyTo = 'bookings@truetodetail.co.uk'
  const resend = new Resend(resendKey)

  const rendered = renderCustomerEmail({
    kind: claim.kind as CustomerEmailKind,
    reference: claim.reference,
    firstName: claim.customer_first_name,
    packageName: claim.package_name,
    addons: claim.addon_labels ?? [],
    price: claim.price,
    vehicle: claim.vehicle_description,
    registration: claim.vehicle_registration,
    scheduledStart: claim.scheduled_start,
    postcode: claim.postcode,
    trackingToken: claim.tracking_token,
    hasAccount: claim.customer_has_account,
    email: claim.customer_email,
    detailerFirstName: claim.detailer_first_name,
    detailerVehicle: claim.detailer_vehicle,
    cancellationReason: claim.cancellation_reason,
  })

  const sent = await resend.emails.send({
    from: fromEmail,
    to: claim.customer_email,
    replyTo,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  }).catch(err => ({ error: err as Error }))

  if ('error' in sent && sent.error) {
    console.error('[portal-email] send failed:', sent.error)
    await release()
    return reply({ error: 'The email could not be sent', sent: false }, 502)
  }

  // A booking a customer makes themselves in the portal is confirmed at once,
  // so tell the team as well.
  if (claim.kind === 'booked_in' && claim.source === 'portal') {
    resend.emails.send({
      from: fromEmail,
      to: 'bookings@truetodetail.co.uk',
      subject: `New portal booking: ${claim.package_name} · ${ukWhen(claim.scheduled_start)} · ${claim.reference}`,
      text: `${claim.customer_first_name ?? 'A customer'} booked ${claim.package_name} for ${ukWhen(claim.scheduled_start)} in the portal (${claim.postcode ?? ''}). It is already confirmed; assign a detailer in the admin console.`,
    }).catch(e => console.error('[portal-email] staff note failed:', e))
  }

  return reply({ sent: true })
}

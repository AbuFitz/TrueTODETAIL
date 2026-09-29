/*
  Customer emails: one small, single-column layout used for every message a
  customer gets about a booking. Nothing sits side by side, so nothing gets
  squeezed on a phone: labels stack above their values, the buttons are full
  width, and the card is a fluid 520px maximum with 20px of padding.
*/

export type CustomerEmailKind = 'received' | 'booked_in' | 'assigned' | 'on_the_way' | 'completed' | 'cancelled'

export interface CustomerEmailData {
  kind: CustomerEmailKind
  reference: string
  firstName: string | null
  packageName: string
  addons: string[]
  price: number | null
  vehicle: string | null
  registration: string | null
  scheduledStart: string
  postcode: string | null
  trackingToken: string
  hasAccount: boolean
  email: string
  detailerFirstName?: string | null
  detailerVehicle?: string | null
  cancellationReason?: string | null
}

export interface RenderedEmail { subject: string; html: string; text: string }

const SITE = 'https://www.truetodetail.co.uk'
const PHONE = '07359\u00a0591800'

const c = {
  orange: '#E84A0C',
  dark: '#0C0C0C',
  page: '#F5F4F1',
  muted: '#6B6B6B',
  line: '#E9E7E2',
}

function esc(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function ukWhen(iso: string): string {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: '2-digit', hour12: true })
    .format(d).replace(/\s/g, '').toLowerCase()
  return `${day} at ${time}`
}

export const trackUrl = (token: string) => `${SITE}/account/track/${encodeURIComponent(token)}`
export const createAccountUrl = (email: string, token: string) =>
  `${SITE}/account/create?email=${encodeURIComponent(email)}&from=${encodeURIComponent(token)}`

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:block;background:${c.orange};color:#ffffff;text-decoration:none;text-align:center;font-family:${FONT};font-size:16px;font-weight:600;line-height:20px;padding:16px 20px;border-radius:6px;">${esc(label)}</a>`
}

function detail(label: string, value: string): string {
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:12px;line-height:16px;letter-spacing:0.08em;text-transform:uppercase;color:${c.muted};">${esc(label)}<br><span style="font-size:16px;line-height:22px;letter-spacing:0;text-transform:none;color:${c.dark};font-weight:600;">${esc(value)}</span></p>`
}

function accountCard(d: CustomerEmailData): string {
  if (d.hasAccount) return ''
  return `
    <tr><td style="padding:8px 20px 4px;">
      <div style="border:1px solid ${c.line};border-radius:8px;padding:20px;">
        <p style="margin:0 0 6px;font-family:${FONT};font-size:17px;line-height:23px;font-weight:700;color:${c.dark};">Make it easier next time</p>
        <p style="margin:0 0 14px;font-family:${FONT};font-size:14px;line-height:21px;color:${c.muted};">A free account keeps your cars and addresses, lets you rebook in two taps and track every visit in one place.</p>
        <a href="${createAccountUrl(d.email, d.trackingToken)}" style="font-family:${FONT};font-size:15px;font-weight:600;color:${c.orange};text-decoration:none;">Create your account &rarr;</a>
      </div>
    </td></tr>`
}

interface Copy { subject: string; heading: string; intro: string; cta: string; footnote?: string }

function copyFor(d: CustomerEmailData): Copy {
  const hi = d.firstName ? `Hi ${d.firstName}, ` : ''
  const when = ukWhen(d.scheduledStart)
  switch (d.kind) {
    case 'received':
      return {
        subject: `We have your request for ${when}`,
        heading: 'Request received',
        intro: `${hi}thanks for choosing True To Detail. We are checking your slot and will confirm it shortly. You do not need to do anything else.`,
        cta: 'Follow your request',
        footnote: 'This is not a confirmed booking until we confirm it. Payment is on the day.',
      }
    case 'booked_in':
      return {
        subject: `You are booked in for ${when}`,
        heading: 'You are booked in',
        intro: `${hi}your detail is confirmed. We come to you and bring everything we need, so there is nothing to prepare. Payment is on the day.`,
        cta: 'Track your booking',
      }
    case 'assigned':
      return {
        subject: `${d.detailerFirstName ?? 'Your detailer'} will look after your car`,
        heading: `${d.detailerFirstName ?? 'Your detailer'} is your detailer`,
        intro: `${hi}${d.detailerFirstName ?? 'your detailer'}${d.detailerVehicle ? ` (${d.detailerVehicle})` : ''} will be with you on ${when}. You will get another message when they set off.`,
        cta: 'See your booking',
      }
    case 'on_the_way':
      return {
        subject: `${d.detailerFirstName ?? 'Your detailer'} is on the way`,
        heading: 'On the way to you',
        intro: `${hi}${d.detailerFirstName ?? 'your detailer'} has set off. Open the live map to see exactly where they are and when they will arrive.`,
        cta: 'Watch live',
      }
    case 'completed':
      return {
        subject: 'Your car is done',
        heading: 'All finished',
        intro: `${hi}thank you for booking with us. We hope you love the finish. If anything is not right, reply to this email or call us and we will put it right.`,
        cta: 'View your visit',
      }
    case 'cancelled':
      return {
        subject: 'Your booking has been cancelled',
        heading: 'Booking cancelled',
        intro: `${hi}your booking for ${when} has been cancelled${d.cancellationReason ? `: ${d.cancellationReason}` : '.'} If that is a surprise, or you would like another slot, call or WhatsApp us on ${PHONE} and we will sort it.`,
        cta: 'View details',
      }
  }
}

export function renderCustomerEmail(d: CustomerEmailData): RenderedEmail {
  const copy = copyFor(d)
  const when = ukWhen(d.scheduledStart)
  const link = trackUrl(d.trackingToken)
  const showDetails = d.kind !== 'cancelled'

  const lines: [string, string][] = [
    ['When', when],
    ['Package', d.packageName + (d.addons.length ? ` + ${d.addons.join(', ')}` : '')],
  ]
  if (d.vehicle || d.registration) lines.push(['Vehicle', [d.vehicle, d.registration].filter(Boolean).join(' · ')])
  if (d.postcode) lines.push(['Where', d.postcode])
  if (d.price != null) lines.push(['Price', `£${Number(d.price).toFixed(Number(d.price) % 1 ? 2 : 0)}`])

  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<title>${esc(copy.subject)}</title>
<style>
  @media only screen and (max-width:480px) {
    .shell { padding:0 !important; }
    .card { border-radius:0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${c.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(copy.intro.slice(0, 110))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.page};">
<tr><td class="shell" align="center" style="padding:24px 12px;">
  <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:10px;">
    <tr><td style="padding:24px 20px 4px;">
      <a href="${SITE}" style="font-family:${FONT};font-size:13px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${c.dark};text-decoration:none;">True <span style="color:${c.orange};">To</span> Detail</a>
    </td></tr>
    <tr><td style="padding:20px 20px 4px;">
      <h1 style="margin:0 0 12px;font-family:${FONT};font-size:26px;line-height:32px;font-weight:800;color:${c.dark};">${esc(copy.heading)}</h1>
      <p style="margin:0;font-family:${FONT};font-size:16px;line-height:24px;color:#3A3A3A;">${esc(copy.intro)}</p>
    </td></tr>
    ${showDetails ? `<tr><td style="padding:20px 20px 4px;">
      <div style="border-top:1px solid ${c.line};padding-top:18px;">
        ${lines.map(([l, v]) => detail(l, v)).join('')}
        <p style="margin:0;font-family:${FONT};font-size:12px;line-height:16px;color:${c.muted};">Reference ${esc(d.reference)}</p>
      </div>
    </td></tr>` : ''}
    <tr><td style="padding:16px 20px 20px;">
      ${button(link, copy.cta)}
      ${copy.footnote ? `<p style="margin:14px 0 0;font-family:${FONT};font-size:13px;line-height:19px;color:${c.muted};">${esc(copy.footnote)}</p>` : ''}
    </td></tr>
    ${d.kind === 'cancelled' ? '' : accountCard(d)}
    <tr><td style="padding:20px 20px 24px;">
      <p style="margin:0;font-family:${FONT};font-size:13px;line-height:20px;color:${c.muted};border-top:1px solid ${c.line};padding-top:16px;">Questions? Reply to this email or call or WhatsApp <a href="tel:+447359591800" style="color:${c.dark};text-decoration:none;font-weight:600;">${PHONE}</a>.<br>True To Detail, mobile car detailing in Hertfordshire.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`

  const text = [
    copy.heading.toUpperCase(),
    '',
    copy.intro,
    '',
    ...(showDetails ? [...lines.map(([l, v]) => `${l}: ${v}`), `Reference: ${d.reference}`, ''] : []),
    `${copy.cta}: ${link}`,
    ...(copy.footnote ? ['', copy.footnote] : []),
    ...(!d.hasAccount && d.kind !== 'cancelled' ? ['', `Create a free account to keep your cars and rebook in two taps: ${createAccountUrl(d.email, d.trackingToken)}`] : []),
    '',
    `Questions? Reply to this email or call or WhatsApp ${PHONE}.`,
    'True To Detail',
  ].join('\n')

  return { subject: copy.subject, html, text }
}

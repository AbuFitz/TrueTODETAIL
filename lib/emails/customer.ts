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

import { SITE, PHONE, colour as c, FONT, esc, detail, renderEmail, orangeLink, paragraph } from './layout'

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

export const loginUrl = () => `${SITE}/account/login`

/**
 * What sits under the tracking button, by who the customer is. Someone without
 * an account gets an invite that also attaches this booking to it; someone with
 * an account is told they can sign in to see it with the rest of their visits.
 * The tracking link itself works for both, with no sign-in.
 */
function accountBlock(d: CustomerEmailData): string {
  if (d.kind === 'cancelled') return ''
  if (!d.hasAccount) {
    return `<p style="margin:0 0 6px;font-family:${FONT};font-size:17px;line-height:23px;font-weight:700;color:${c.dark};">Make it easier next time</p>${paragraph('A free account keeps your cars and addresses, lets you rebook in two taps and track every visit in one place.', { small: true })}<p style="margin:12px 0 0;">${orangeLink(createAccountUrl(d.email, d.trackingToken), 'Create your account &rarr;')}</p>`
  }
  if (d.kind !== 'received' && d.kind !== 'booked_in') return ''
  return `<p style="margin:0 0 6px;font-family:${FONT};font-size:17px;line-height:23px;font-weight:700;color:${c.dark};">It is in your account too</p>${paragraph('Sign in to see this booking with the rest of your visits, rebook in two taps or manage it.', { small: true })}<p style="margin:12px 0 0;">${orangeLink(loginUrl(), 'Sign in &rarr;')}</p>`
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
        intro: `${hi}thanks for choosing True To Detail. We have your request and we will check the slot and confirm it with you. If anything needs changing we will call or text you first. You do not need to do anything else.`,
        cta: 'Follow your request',
        footnote: 'This is not a confirmed booking until we confirm it. Your link below updates the moment we do. Payment is on the day.',
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

  const html = renderEmail({
    title: copy.subject,
    preheader: copy.intro,
    heading: esc(copy.heading),
    intro: esc(copy.intro),
    details: showDetails
      ? [...lines.map(([l, v]) => detail(esc(l), esc(v))), paragraph(`Reference ${esc(d.reference)}`, { small: true })]
      : [],
    cta: { href: link, label: esc(copy.cta) },
    ...(copy.footnote ? { footnote: copy.footnote } : {}),
    ...(accountBlock(d) ? { aside: accountBlock(d) } : {}),
    footer: 'customer',
  })

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

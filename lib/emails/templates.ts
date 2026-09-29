/*
  Email templates for True To Detail bookings.

  ─── RESEND SETUP (5 steps) ───────────────────────────────────────────────────
  1. Sign up at https://resend.com
  2. Add & verify your domain:
       resend.com → Domains → Add Domain → truetodetail.co.uk
       Add the DNS records shown (SPF, DKIM, DMARC) via your domain registrar.
  3. Create an API key: resend.com → API Keys → Create API Key
  4. Add to your environment variables:
       RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
       BOOKING_FROM_EMAIL=noreply@truetodetail.co.uk
     For local dev, add to .env.local (never commit this file).
     For production (e.g. Vercel): add via Settings → Environment Variables.
  5. Deploy and test with a real booking — you'll see it in Resend's dashboard.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface EmailData {
  id:        string
  pack:      string
  vehicle:   string
  price:     number
  date:      string
  time:      string
  name:      string
  phone:     string
  email:     string
  address:   string
  carReg:    string
  addons:    string[]
  notes?:    string
  createdAt: string
}

export interface FleetEnquiryData {
  name:      string
  business:  string
  phone:     string
  fleetSize: string
  message:   string
  createdAt: string
}

export interface ChatEscalationData {
  reason:             string
  conversationSummary: string
  customerName:       string | null
  phone:              string | null
  email:              string | null
  postcode:           string | null
  createdAt:          string
}

// Every value that came from a visitor (name, notes, phone, email, fleet
// message) is escaped before it touches the email HTML. Without this, anyone
// could put links or markup in the booking form and have them sent, on our
// letterhead, to any address they typed in.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeFields<T extends object>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      typeof v === 'string' ? esc(v) : Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? esc(x) : x)) : v,
    ]),
  ) as T
}

import { renderEmail, detail, groupTitle, paragraph, link, colour, FONT } from './layout'

/** Rows for a group of details; the values are already escaped by escapeFields. */
const rows = (items: [string, string][]) => items.map(([l, v]) => detail(l, v)).join('')
const tel = (n: string) => link(`tel:${n}`, n)
const mail = (e: string) => link(`mailto:${e}`, e)
const labelled = (label: string, html: string) =>
  `<p style="margin:0;font-family:${FONT};font-size:12px;line-height:16px;letter-spacing:0.08em;text-transform:uppercase;color:${colour.muted};">${label}</p>` +
  `<p style="margin:4px 0 0;font-family:${FONT};font-size:15px;line-height:23px;color:${colour.dark};white-space:pre-line;">${html}</p>`

/* Staff notification (to the bookings inbox). */
export function notificationEmail(raw: EmailData): string {
  const d = escapeFields(raw)
  const addonsLine = d.addons.length > 0 ? d.addons.join(', ') : 'None'
  return renderEmail({
    title: `New Booking Request: ${d.pack} · ${d.date}`,
    preheader: `${d.pack}, ${d.date} at ${d.time}, ${d.address}`,
    eyebrow: `New booking request · Ref ${d.id}`,
    heading: d.pack,
    intro: `Preferred: ${d.date} at ${d.time}, ${d.address}. Please confirm with the customer as soon as possible.`,
    details: [
      groupTitle('Customer'),
      rows([
        ['Name', d.name.trim() || 'Not provided'],
        ['Phone', tel(d.phone)],
        ['Email', mail(d.email)],
      ]),
      groupTitle('Booking'),
      rows([
        ['Package', d.pack],
        ['Vehicle', `${d.vehicle} · ${d.carReg}`],
        ['Date and time', `${d.date} at ${d.time}`],
        ['Postcode', d.address],
        ['Add-ons', addonsLine],
        ['Total', `£${d.price}`],
      ]),
    ],
    after: d.notes ? [labelled('Customer notes', d.notes)] : [],
    cta: { href: `tel:${d.phone.replace(/[^\d+]/g, '')}`, label: `Call ${d.name.trim().split(' ')[0] || 'the customer'}` },
    footer: 'staff',
  })
}

/* Customer: booking request received (used when the portal is not connected). */
export function confirmationEmail(raw: EmailData): string {
  const d = escapeFields(raw)
  const first = d.name.trim() ? d.name.trim().split(' ')[0] : 'there'
  return renderEmail({
    title: `Booking Request Received: ${d.date}`,
    preheader: `We have your preferred slot for ${d.date} at ${d.time}.`,
    eyebrow: `Ref ${d.id}`,
    heading: 'Request received',
    intro: `Hi ${first}, we've got your preferred slot. We'll be in touch as soon as possible to confirm it. This is not a confirmed booking yet. No prep needed, we bring everything, and payment is on the day.`,
    details: [
      rows([
        ['Preferred slot', `${d.date} at ${d.time}`],
        ['Postcode', d.address],
        ['Package', d.pack + (d.addons.length ? ` + ${d.addons.join(', ')}` : '')],
        ['Vehicle', `${d.vehicle} · ${d.carReg}`],
        ['Total', `£${d.price}`],
      ]),
    ],
    footer: 'customer',
  })
}

/* Staff: van & fleet enquiry. */
export function fleetEnquiryEmail(raw: FleetEnquiryData): string {
  const d = escapeFields(raw)
  return renderEmail({
    title: `Van & Fleet Interest (Coming Soon): ${d.name}`,
    preheader: `${d.business || d.name}, fleet size ${d.fleetSize || 'not given'}`,
    eyebrow: 'Van and fleet interest · coming soon',
    heading: d.business || d.name,
    intro: `Someone registered interest in the coming soon van and fleet service. Keep their details for launch, and a quick reply to ${d.phone} lets them know we have it.`,
    details: [
      rows([
        ['Name', d.name],
        ['Business', d.business || 'Not given'],
        ['Phone', tel(d.phone)],
        ['Fleet size', d.fleetSize || 'Not given'],
      ]),
    ],
    after: d.message ? [labelled('Message', d.message)] : [],
    cta: { href: `tel:${d.phone.replace(/[^\d+]/g, '')}`, label: `Call ${d.name.trim().split(' ')[0] || 'them'}` },
    footer: 'staff',
  })
}

/* Staff: chat assistant handed a customer over. */
export function chatEscalationEmail(raw: ChatEscalationData): string {
  const d = escapeFields(raw)
  return renderEmail({
    title: `Chat Escalation: ${d.reason}`,
    preheader: d.reason,
    eyebrow: 'Chat assistant escalation',
    heading: 'A customer needs a human',
    intro: 'The customer was told a team member will follow up. Reply using the details below if given, or via WhatsApp or call if not.',
    details: [
      groupTitle('Why'),
      paragraph(d.reason),
      `<div style="height:18px;line-height:18px;">&nbsp;</div>`,
      groupTitle('What we know so far'),
      rows([
        ['Name', d.customerName || 'Not given'],
        ['Phone', d.phone ? tel(d.phone) : 'Not given'],
        ['Email', d.email ? mail(d.email) : 'Not given'],
        ['Postcode', d.postcode || 'Not given'],
      ]),
    ],
    after: [labelled('Conversation summary', d.conversationSummary || 'No summary available yet. Early in the conversation.')],
    footer: 'staff',
  })
}

/* Plain-text versions, sent alongside the HTML. Spam filters score
   HTML-only mail worse, and some clients show only the text part. */

const TEXT_FOOTER = 'True To Detail · Hertfordshire\n07359 591800 · info@truetodetail.co.uk\nhttps://www.truetodetail.co.uk'

export function confirmationText(d: EmailData): string {
  const first = d.name.trim() ? d.name.trim().split(' ')[0] : 'there'
  return [
    `Hi ${first},`,
    '',
    "We've got your booking request. We'll be in touch as soon as possible to confirm it.",
    '',
    `Preferred slot: ${d.date} at ${d.time}`,
    `Postcode: ${d.address}`,
    `Package: ${d.pack}`,
    `Vehicle: ${d.vehicle} (${d.carReg})`,
    ...(d.addons.length ? [`Add-ons: ${d.addons.join(', ')}`] : []),
    `Total: £${d.price}`,
    `Reference: ${d.id}`,
    '',
    'This is a request, not a confirmed booking yet. No prep needed, we bring everything, and payment is on the day.',
    '',
    'Any questions? Reply to this email, call 07359 591800, or WhatsApp us.',
    '',
    TEXT_FOOTER,
  ].join('\n')
}

export function notificationText(d: EmailData): string {
  return [
    'HIGH PRIORITY: new booking request, respond as soon as possible.',
    '',
    `Ref: ${d.id}`,
    `Package: ${d.pack}`,
    `Preferred: ${d.date} at ${d.time}, ${d.address}`,
    '',
    `Name: ${d.name.trim() || 'Not provided'}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    '',
    `Vehicle: ${d.vehicle}, reg ${d.carReg}`,
    `Add-ons: ${d.addons.length ? d.addons.join(', ') : 'None'}`,
    ...(d.notes ? [`Notes: ${d.notes}`] : []),
    `Total: £${d.price}`,
  ].join('\n')
}

export function fleetEnquiryText(d: FleetEnquiryData): string {
  return [
    'New van & fleet enquiry',
    '',
    `Name: ${d.name}`,
    `Business: ${d.business || 'Not given'}`,
    `Phone: ${d.phone}`,
    `Fleet size: ${d.fleetSize || 'Not given'}`,
    ...(d.message ? ['', `Message: ${d.message}`] : []),
  ].join('\n')
}

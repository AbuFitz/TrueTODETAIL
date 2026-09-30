import { test } from 'node:test'
import assert from 'node:assert/strict'
import { confirmationEmail, notificationEmail, fleetEnquiryEmail, confirmationText, notificationText } from '@/lib/emails/templates'

const EVIL = '<a href="https://evil.example/pay">Pay your deposit</a>'
const booking = {
  id: 'TTD-1', pack: 'Full Valet', vehicle: 'Mid-Size', price: 155, date: '2026-10-10', time: '10:00 AM',
  name: EVIL, phone: '07700 900123', email: 'x@example.com"><img src=x>', address: 'HP1 3PT',
  carReg: 'AB21CDE', addons: [], notes: '<script>alert(1)</script>', createdAt: '',
}

test('visitor input is escaped in every booking email', () => {
  for (const html of [confirmationEmail(booking), notificationEmail(booking)]) {
    assert.ok(!html.includes('<a href="https://evil'), 'raw link must not survive')
    assert.ok(!html.includes('<script>'), 'script tag must not survive')
    assert.ok(!html.includes('<img src=x>'), 'attribute breakout must not survive')
  }
})

test('the customer greeting cannot carry markup', () => {
  // Only the first word of the name reaches the greeting, so the payload has no spaces.
  const html = confirmationEmail({ ...booking, name: '<img/src=x/onerror=alert(1)>' })
  assert.ok(!html.includes('<img/src=x'), 'markup in the first name must be escaped')
  assert.ok(html.includes('Hi &lt;img/src=x/onerror=alert(1)&gt;,'))
})

test('visitor input is escaped in the fleet enquiry email', () => {
  const html = fleetEnquiryEmail({ name: EVIL, business: '<b>Biz</b>', phone: '07700 900123', fleetSize: '5-9', message: EVIL, createdAt: '' })
  assert.ok(!html.includes('<a href="https://evil'))
  assert.ok(html.includes('&lt;b&gt;Biz&lt;/b&gt;'))
})

test('customer email never promises a one hour turnaround', () => {
  const html = confirmationEmail({ ...booking, name: 'Sarah', notes: '' })
  assert.ok(!/within (the|an|1) hour/i.test(html))
  assert.ok(html.includes('as soon as possible'))
})

test('plain-text versions carry the key booking details', () => {
  const text = confirmationText({ ...booking, name: 'Sarah Mitchell', notes: '' })
  assert.match(text, /^Hi Sarah,/)
  assert.match(text, /Total: £155/)
  assert.match(text, /not a confirmed booking yet/)
  assert.ok(!text.includes('—'))
  assert.match(notificationText(booking), /HIGH PRIORITY/)
})

import { chatEscalationEmail } from '@/lib/emails/templates'
import { renderCustomerEmail } from '@/lib/emails/customer'

const allEmails = (): Record<string, string> => ({
  staffBooking: notificationEmail(booking),
  customerRequest: confirmationEmail({ ...booking, name: 'Sarah', notes: '' }),
  fleet: fleetEnquiryEmail({ name: 'Sam', business: 'Sam Vans', phone: '07700 900123', fleetSize: '5-9', message: 'Hello', createdAt: '' }),
  chat: chatEscalationEmail({ reason: 'Wants a quote', conversationSummary: 'Asked about vans', customerName: 'Sam', phone: '07700 900123', email: 'a@b.co', postcode: 'HP1 3PT', createdAt: '' }),
  ...Object.fromEntries((['received', 'booked_in', 'assigned', 'on_the_way', 'completed', 'cancelled'] as const).map((kind) => [
    `customer_${kind}`,
    renderCustomerEmail({
      kind, reference: 'TTD-1', firstName: 'Sam', packageName: 'Full Valet', addons: [], price: 155, vehicle: 'Focus', registration: 'AB12CDE',
      scheduledStart: '2030-06-12T09:00:00Z', postcode: 'HP2 6EL', trackingToken: 'tok_abcdef123456', hasAccount: false, email: 'sam@example.com',
    }).html,
  ])),
})

test('every email uses the same single-column layout with no boxes inside boxes', () => {
  for (const [name, html] of Object.entries(allEmails())) {
    assert.match(html, /name="viewport"/, name)
    assert.match(html, /max-width:520px/, name)
    // one wordmark, one button at most, same closing footer
    assert.equal((html.match(/letter-spacing:0\.14em;text-transform:uppercase;color:#0C0C0C/g) ?? []).length, 1, `${name}: one wordmark`)
    assert.match(html, /mobile car detailing in Hertfordshire/, name)
    // nothing side by side and no fixed widths that could squeeze text on a phone
    assert.doesNotMatch(html, /width="(?!100%)\d+"/, name)
    assert.equal((html.match(/<td[^>]*width:\d+%/g) ?? []).length, 0, `${name}: no side-by-side cells`)
    // no bordered or shaded panels inside the card
    assert.equal((html.match(/border:1px solid/g) ?? []).length, 0, `${name}: no bordered boxes`)
    assert.equal((html.match(/background:#(?!ffffff|F5F4F1|E84A0C)/gi) ?? []).length, 0, `${name}: no shaded panels`)
    assert.doesNotMatch(html, /—/, name)
    // phones get the full width: the outer padding and rounded card drop away
    assert.match(html, /\.shell \{ padding:0 !important; \}/, name)
  }
})

test('the call button dials only the digits the visitor typed, never characters from escaping', () => {
  const html = notificationEmail({ ...booking, name: 'Sam', phone: "07700 900'123", notes: '' })
  assert.match(html, /href="tel:07700900123"/)
  const fleet = fleetEnquiryEmail({ name: 'Sam', business: '', phone: '+44 7700 <900123>', fleetSize: '', message: '', createdAt: '' })
  assert.match(fleet, /href="tel:\+447700900123"/)
})

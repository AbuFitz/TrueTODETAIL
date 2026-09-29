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

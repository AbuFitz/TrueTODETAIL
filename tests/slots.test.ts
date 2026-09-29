import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatBookingDate, formatShortDate, isSlotAvailable, isValidBookingDate, slotMinutes, ukNow } from '@/lib/slots'

test('slot labels convert to minutes past midnight', () => {
  assert.equal(slotMinutes('8:00 AM'), 480)
  assert.equal(slotMinutes('12:00 PM'), 720)
  assert.equal(slotMinutes('2:00 PM'), 840)
  assert.equal(slotMinutes('6:00 PM'), 1080)
})

test('same-day slots need an hour of notice (UK summer time)', () => {
  const now = new Date('2026-10-06T13:30:00Z') // 14:30 BST
  assert.equal(isSlotAvailable('2026-10-06', '2:00 PM', now), false)
  assert.equal(isSlotAvailable('2026-10-06', '4:00 PM', now), true)
  assert.equal(isSlotAvailable('2026-10-07', '8:00 AM', now), true)
})

test('same-day slots in winter use GMT', () => {
  const now = new Date('2026-12-01T09:30:00Z') // 09:30 GMT
  assert.equal(isSlotAvailable('2026-12-01', '10:00 AM', now), false)
  assert.equal(isSlotAvailable('2026-12-01', '12:00 PM', now), true)
})

test('just after midnight UK time, yesterday is no longer bookable', () => {
  const now = new Date('2026-10-05T23:30:00Z') // 00:30 BST on 6 Oct
  assert.equal(ukNow(now).date, '2026-10-06')
  assert.equal(isValidBookingDate('2026-10-05', now), false)
  assert.equal(isValidBookingDate('2026-10-06', now), true)
})

test('malformed dates are rejected', () => {
  const now = new Date('2026-10-06T09:00:00Z')
  for (const d of ['2026-10-6', 'tomorrow', '', '2026-13-40']) assert.equal(isValidBookingDate(d, now), false, d)
})

test('booking dates read naturally in emails', () => {
  assert.equal(formatBookingDate('2026-10-10'), 'Saturday 10 October 2026')
  assert.equal(formatShortDate('2026-10-10'), 'Sat 10 Oct')
})

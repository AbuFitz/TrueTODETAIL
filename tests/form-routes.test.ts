import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { POST as bookingPOST } from '@/app/api/booking/route'
import { POST as fleetPOST } from '@/app/api/fleet-enquiry/route'

delete process.env.RESEND_API_KEY
delete process.env.BOOKING_WEBHOOK_URL

let ip = 0
async function post(handler: (req: NextRequest) => Promise<Response>, body: unknown, raw?: string) {
  const req = new NextRequest('http://localhost/api/x', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.40.${Math.floor(++ip / 200)}.${ip % 200}` },
    body: raw ?? JSON.stringify(body),
  })
  const res = await handler(req)
  return { status: res.status, body: (await res.json()) as Record<string, any> }
}

// A date well in the future so the slot rules never interfere.
const GOOD_BOOKING = {
  pack: 'Full Valet', vehicle: 'midsize', date: '2030-06-12', time: '10:00 AM', name: 'Sam Lee',
  phone: '07700 900123', email: 'sam@example.com', address: 'HP2 6EL', carReg: 'AB12 CDE', addons: [], notes: '',
}
const GOOD_FLEET = { name: 'Sam Lee', business: 'Lee Plumbing', phone: '07700 900123', fleet: '3-4', message: 'Four vans' }
const WEIRD_VALUES: unknown[] = [null, 0, 12345, true, [], ['x'], {}, { a: 1 }, '', '   ', 'x'.repeat(5000)]

test('booking: a valid request is accepted and priced server-side', async () => {
  const r = await post(bookingPOST, { ...GOOD_BOOKING, price: 1 })
  assert.equal(r.status, 201)
  assert.equal(r.body.booking.price, 155)
})

test('booking: any field of the wrong type is a 400, never a crash', async () => {
  for (const body of [null, [], 'x', 5]) assert.equal((await post(bookingPOST, body)).status, 400, JSON.stringify(body))
  assert.equal((await post(bookingPOST, undefined, '{nope')).status, 400)
  for (const field of Object.keys(GOOD_BOOKING)) {
    for (const value of WEIRD_VALUES) {
      const r = await post(bookingPOST, { ...GOOD_BOOKING, [field]: value })
      assert.ok(r.status < 500, `${field}=${JSON.stringify(value)?.slice(0, 30)} gave ${r.status}`)
    }
  }
})

test('fleet: a valid enquiry is accepted', async () => {
  const r = await post(fleetPOST, GOOD_FLEET)
  assert.equal(r.status, 201)
})

test('fleet: any field of the wrong type is a 400, never a crash', async () => {
  for (const body of [null, [], 'x', 5]) assert.equal((await post(fleetPOST, body)).status, 400, JSON.stringify(body))
  for (const field of Object.keys(GOOD_FLEET)) {
    for (const value of WEIRD_VALUES) {
      const r = await post(fleetPOST, { ...GOOD_FLEET, [field]: value })
      assert.ok(r.status < 500, `${field}=${JSON.stringify(value)?.slice(0, 30)} gave ${r.status}`)
    }
  }
})

async function withFakeDelivery(resendStatus: number, webhookStatus: number | null, run: () => Promise<void>) {
  const realFetch = globalThis.fetch
  process.env.RESEND_API_KEY = 're_test_fake'
  if (webhookStatus !== null) process.env.BOOKING_WEBHOOK_URL = 'https://hooks.example.com/booking'
  globalThis.fetch = (async (input: any) => {
    const url = typeof input === 'string' ? input : input.url
    if (url.includes('api.resend.com')) {
      return resendStatus === 200
        ? new Response(JSON.stringify({ id: 'email_1' }), { status: 200, headers: { 'content-type': 'application/json' } })
        : new Response(JSON.stringify({ name: 'daily_quota_exceeded', message: 'quota', statusCode: resendStatus }), { status: resendStatus, headers: { 'content-type': 'application/json' } })
    }
    if (url.startsWith('https://hooks.example.com')) return new Response('ok', { status: webhookStatus ?? 500 })
    return realFetch(input)
  }) as typeof fetch
  try {
    await run()
  } finally {
    globalThis.fetch = realFetch
    delete process.env.RESEND_API_KEY
    delete process.env.BOOKING_WEBHOOK_URL
  }
}

test('booking: if the staff email fails and nothing else got it, the customer is told to call', async () => {
  await withFakeDelivery(429, null, async () => {
    const r = await post(bookingPOST, GOOD_BOOKING)
    assert.equal(r.status, 502)
    assert.match(r.body.error, /07359 591800/)
  })
})

test('booking: a working staff email or webhook means success', async () => {
  await withFakeDelivery(200, null, async () => {
    assert.equal((await post(bookingPOST, GOOD_BOOKING)).status, 201)
  })
  await withFakeDelivery(500, 200, async () => {
    assert.equal((await post(bookingPOST, GOOD_BOOKING)).status, 201)
  })
  await withFakeDelivery(500, 503, async () => {
    assert.equal((await post(bookingPOST, GOOD_BOOKING)).status, 502)
  })
})

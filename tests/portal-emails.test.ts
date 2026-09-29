import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { renderCustomerEmail, ukWhen, type CustomerEmailData, type CustomerEmailKind } from '@/lib/emails/customer'
import { POST as portalEmailPOST, OPTIONS as portalEmailOPTIONS } from '@/app/api/portal-email/route'

const base: CustomerEmailData = {
  kind: 'booked_in', reference: 'TTD-ABC12345', firstName: 'Sam', packageName: 'Full Valet Car Detail', addons: ['Steam Clean'],
  price: 190, vehicle: 'Ford Focus', registration: 'AB12CDE', scheduledStart: '2030-06-12T09:00:00Z', postcode: 'HP2 6EL',
  trackingToken: 'tok_abcdef123456', hasAccount: false, email: 'sam@example.com', detailerFirstName: 'Jamie',
}
const KINDS: CustomerEmailKind[] = ['received', 'booked_in', 'assigned', 'on_the_way', 'completed', 'cancelled']

test('dates are written in UK time, in words', () => {
  assert.equal(ukWhen('2030-06-12T09:00:00Z'), 'Wednesday 12 June at 10:00am')
  assert.equal(ukWhen('2030-01-15T14:00:00Z'), 'Tuesday 15 January at 2:00pm')
})

test('every customer email is single column, fluid and short of double hyphens', () => {
  for (const kind of KINDS) {
    const { html, text, subject } = renderCustomerEmail({ ...base, kind })
    assert.ok(subject.length > 5 && subject.length < 80, subject)
    assert.doesNotMatch(html + text + subject, /—|--/)
    assert.match(html, /max-width:520px/)
    assert.match(html, /name="viewport"/)
    // nothing that can squeeze on a phone: no fixed pixel widths on tables or side by side cells
    assert.doesNotMatch(html, /width="(?!100%)\d+"/)
    assert.equal((html.match(/<td[^>]*width:\d+%/g) ?? []).length, 0)
    assert.match(text, /account\/track\/tok_abcdef123456/)
  }
})

test('the account invite shows only for people without an account, and never on a cancellation', () => {
  assert.match(renderCustomerEmail({ ...base, hasAccount: false }).html, /Create your account/)
  assert.doesNotMatch(renderCustomerEmail({ ...base, hasAccount: true }).html, /Create your account/)
  assert.doesNotMatch(renderCustomerEmail({ ...base, kind: 'cancelled' }).html, /Create your account/)
  assert.match(renderCustomerEmail(base).html, /account\/create\?email=sam%40example\.com/)
})

test('customer supplied text cannot inject markup', () => {
  const { html } = renderCustomerEmail({ ...base, firstName: '<img src=x onerror=alert(1)>', packageName: '<b>x</b>', registration: '"><script>' })
  assert.doesNotMatch(html, /<img src=x|<script>|<b>x/)
})

test('the on the way email names the detailer and points at the live map', () => {
  const r = renderCustomerEmail({ ...base, kind: 'on_the_way' })
  assert.match(r.subject, /Jamie is on the way/)
  assert.match(r.html, /Watch live/)
})

let ip = 0
async function portal(body: unknown, headers: Record<string, string> = {}) {
  const req = new NextRequest('http://localhost/api/portal-email', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.60.0.${++ip % 250}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  const res = await portalEmailPOST(req)
  return { status: res.status, body: (await res.json()) as Record<string, any> }
}

test('portal email: bad input is a 400, and an unconfigured server sends nothing', async () => {
  delete process.env.RESEND_API_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  assert.equal((await portal('{nope')).status, 400)
  assert.equal((await portal({ bookingId: 'x', kind: 'booked_in' })).status, 400)
  assert.equal((await portal({ bookingId: '11111111-1111-4111-8111-111111111111', kind: 'marketing' })).status, 400)
  const r = await portal({ bookingId: '11111111-1111-4111-8111-111111111111', kind: 'booked_in' })
  assert.equal(r.status, 503)
  assert.equal(r.body.sent, false)
})

test('portal email: the database decides who may send, and a refusal is a 403', async () => {
  process.env.RESEND_API_KEY = 're_test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://db.example'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
  const realFetch = globalThis.fetch
  const calls: { url: string; auth: string | null }[] = []
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), auth: new Headers(init?.headers).get('authorization') })
    return new Response(JSON.stringify({ code: '42501', message: 'Not allowed' }), { status: 403 })
  }) as typeof fetch
  try {
    const r = await portal({ bookingId: '11111111-1111-4111-8111-111111111111', kind: 'booked_in' }, { authorization: 'Bearer user-jwt' })
    assert.equal(r.status, 403)
    assert.match(calls[0].url, /rpc\/claim_booking_email$/)
    assert.equal(calls[0].auth, 'Bearer user-jwt')
  } finally {
    globalThis.fetch = realFetch
    delete process.env.RESEND_API_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
})

test('portal email: only the portal and the site may call it from a browser', async () => {
  const ok = await portalEmailOPTIONS(new NextRequest('http://localhost/api/portal-email', { method: 'OPTIONS', headers: { origin: 'https://app.truetodetail.co.uk' } }))
  assert.equal(ok.headers.get('access-control-allow-origin'), 'https://app.truetodetail.co.uk')
  assert.match(ok.headers.get('access-control-allow-headers') ?? '', /Authorization/)
  const bad = await portalEmailOPTIONS(new NextRequest('http://localhost/api/portal-email', { method: 'OPTIONS', headers: { origin: 'https://evil.example' } }))
  assert.equal(bad.headers.get('access-control-allow-origin'), null)
})

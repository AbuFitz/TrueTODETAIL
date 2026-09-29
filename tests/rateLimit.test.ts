import { test } from 'node:test'
import assert from 'node:assert/strict'
import { allowRequest, clientIp } from '@/lib/rateLimit'

test('allows up to the limit, then blocks within the window', () => {
  const key = `t:${Math.random()}`
  for (let i = 0; i < 3; i++) assert.equal(allowRequest(key, 3, 60_000), true)
  assert.equal(allowRequest(key, 3, 60_000), false)
})

test('limits are per key', () => {
  const a = `a:${Math.random()}`, b = `b:${Math.random()}`
  allowRequest(a, 1, 60_000)
  assert.equal(allowRequest(a, 1, 60_000), false)
  assert.equal(allowRequest(b, 1, 60_000), true)
})

test('window resets after it expires', async () => {
  const key = `w:${Math.random()}`
  allowRequest(key, 1, 20)
  assert.equal(allowRequest(key, 1, 20), false)
  await new Promise((r) => setTimeout(r, 30))
  assert.equal(allowRequest(key, 1, 20), true)
})

test('uses the first forwarded address', () => {
  const req = new Request('https://x.test', { headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' } })
  assert.equal(clientIp(req), '203.0.113.9')
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/support-chat/route'
import { emptyConversationState } from '@/lib/chat/types'
import { normaliseMessage, sanitizeState } from '@/lib/chat/state'
import { runRuleBasedTurn } from '@/lib/chat/rule-based'

delete process.env.GEMINI_API_KEY
delete process.env.GROQ_API_KEY

let ip = 0
async function send(body: unknown, raw?: string) {
  const req = new NextRequest('http://localhost/api/support-chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.20.${Math.floor(++ip / 200)}.${ip % 200}` },
    body: raw ?? JSON.stringify(body),
  })
  const res = await POST(req)
  return { status: res.status, body: (await res.json()) as Record<string, any> }
}

test('malformed requests get a 400, never a crash', async () => {
  for (const body of [null, [1], 'hi', 7, {}, { message: 5 }, { message: '  \n ' }, { message: 'x'.repeat(1001) },
    { message: 'hi', history: 'no' }, { message: 'hi', history: [null] }, { message: 'hi', history: [{ role: 'system', content: 'x' }] }]) {
    const r = await send(body)
    assert.equal(r.status, 400, JSON.stringify(body)?.slice(0, 60))
  }
  assert.equal((await send(undefined, '{bad json')).status, 400)
})

test('broken conversation state from the browser is ignored, not trusted', async () => {
  const empty = emptyConversationState()
  const states = [null, [], 'x', { vehicle: null }, { enquiry: null }, { customerName: 'Bob' },
    { ...empty, unresolvedQuestions: 'x' }, { ...empty, postcode: 12345 }, { ...empty, enquiry: { ...empty.enquiry, extras: 'x' } }]
  for (const conversationState of states) {
    const r = await send({ message: 'full valet for a small car', conversationState })
    assert.equal(r.status, 200, JSON.stringify(conversationState))
    assert.match(r.body.reply, /£140/)
  }
})

test('oversized state is trimmed before it is echoed back', async () => {
  const r = await send({ message: 'hi', conversationState: { ...emptyConversationState(), conversationSummary: 'x'.repeat(100_000), customerName: 'y'.repeat(5000) } })
  assert.ok(JSON.stringify(r.body.conversationState).length < 5000)
})

test('an absurdly long history is refused politely', async () => {
  const history = Array.from({ length: 201 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'hi' }))
  const r = await send({ message: 'hi', history })
  assert.equal(r.status, 400)
  assert.match(r.body.reply, /07359 591800/)
})

test('without AI keys the reply says why it fell back', async () => {
  const r = await send({ message: 'how much is essential' })
  assert.equal(r.body.engine, 'rules')
  assert.match(r.body.fallbackReason.join(' '), /no GEMINI_API_KEY or GROQ_API_KEY/)
})

test('lookalike and control characters are normalised', () => {
  assert.equal(normaliseMessage('ｆｕｌｌ ｖａｌｅｔ'), 'full valet')
  assert.equal(normaliseMessage('hi\u0000‮ there\n\nfriend'), 'hi there friend')
  assert.equal(normaliseMessage('​﻿'), '')
})

test('sanitizeState keeps good values and drops bad ones', () => {
  const s = sanitizeState({ postcode: ' HP2 6EL ', vehicle: { make: 'Ford', model: 42 }, enquiry: { intent: 'hack', vehicleSize: 'small' }, summarizedTurns: -5 })
  assert.equal(s.postcode, 'HP2 6EL')
  assert.equal(s.vehicle.make, 'Ford')
  assert.equal(s.vehicle.model, null)
  assert.equal(s.enquiry.intent, null)
  assert.equal(s.enquiry.vehicleSize, 'small')
  assert.equal(s.summarizedTurns, 0)
})

// Seeded so any failure reproduces exactly.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  }
}

test('fuzz: 3000 random messages through the rules engine all get a clean reply', () => {
  const rand = rng(20260929)
  const words = ['price', 'full valet', 'essential', 'premium', 'small car', 'suv', 'HP2 6EL', 'AB12 CDE', 'watford', 'manchester',
    'cancel', 'book', 'sunday', 'fleet', 'ceramic', 'human', 'refund', '?', '!!!', 'lol', 'hi', 'thanks', '🚗', 'ｆｕｌｌ', 'null',
    '<b>x</b>', '—', 'how long', 'difference', 'motorbike', 'tomorrow', 'pet hair', 'asdf', '12345', 'SW1A 1AA', 'van']
  const alphabet = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!.,£$%&*()-_/\\\'"éüñ中文🚗\u0000‮'
  let state = emptyConversationState()
  for (let i = 0; i < 3000; i++) {
    const mode = rand()
    let msg: string
    if (mode < 0.5) msg = Array.from({ length: 1 + Math.floor(rand() * 5) }, () => words[Math.floor(rand() * words.length)]).join(' ')
    else msg = Array.from({ length: 1 + Math.floor(rand() * 60) }, () => alphabet[Math.floor(rand() * alphabet.length)]).join('')
    msg = normaliseMessage(msg)
    if (!msg) continue
    const r = runRuleBasedTurn(state, msg, i === 0)
    state = r.state
    assert.ok(r.text.trim().length > 0, `empty reply for ${JSON.stringify(msg)}`)
    assert.ok(!/undefined|NaN|\[object|—/.test(r.text), `bad reply for ${JSON.stringify(msg)}: ${r.text}`)
    assert.ok(r.text.length < 800, `long reply for ${JSON.stringify(msg)}`)
    assert.ok(!/flagged this|passed this on|will follow up|they'll follow up/i.test(r.text), `false promise: ${r.text}`)
    assert.ok(JSON.stringify(state).length < 20_000, 'state keeps growing')
  }
})

test('the system prompt has every placeholder filled in', async () => {
  const { buildSystemPrompt } = await import('@/lib/chat/prompt')
  const prompt = buildSystemPrompt(emptyConversationState())
  assert.doesNotMatch(prompt, /\$\{|undefined/)
  assert.match(prompt, /give the customer 07359 591800 \(call or WhatsApp\) and info@truetodetail\.co\.uk/)
  assert.doesNotMatch(prompt, /—/)
})

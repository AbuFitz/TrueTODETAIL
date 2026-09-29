import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveVehicleSize, sizeGuideText, SIZE_HELP_RE } from '@/lib/chat/vehicle-size'
import { VEHICLE_GUIDE } from '@/lib/pricing'

test('hatchbacks and coupes are small', () => {
  for (const m of ['I have a hatchback', 'its a coupe', 'Ford Fiesta', 'VW Golf please', 'small car', 'small']) {
    assert.equal(resolveVehicleSize(m).size, 'small', m)
  }
})

test('saloons and estates are mid-size', () => {
  for (const m of ['a saloon', 'Skoda Octavia estate', 'BMW 3 Series', 'mid-size', 'medium car', 'medium']) {
    assert.equal(resolveVehicleSize(m).size, 'midsize', m)
  }
})

test('SUVs, 4x4s and people carriers are large', () => {
  for (const m of ['SUV', 'a 4x4', 'people carrier', 'Range Rover', 'Nissan Qashqai', 'big car', 'seven seater']) {
    assert.equal(resolveVehicleSize(m).size, 'largesuv', m)
  }
})

test('American words are understood', () => {
  assert.equal(resolveVehicleSize('I drive a sedan').size, 'midsize')
})

test('everyday words are not mistaken for a size', () => {
  for (const m of ['there is a small stain on the seat', "what's up", 'pick up time', 'I need to clean up', 'real estate agent']) {
    const r = resolveVehicleSize(m)
    assert.notEqual(r.size, 'small', m)
  }
})

test('two different body types are ambiguous, not guessed', () => {
  const r = resolveVehicleSize('I have a hatchback and a saloon')
  assert.equal(r.size, null)
  assert.equal(r.ambiguous, true)
})

test('guide text uses UK terms only and covers every size', () => {
  const t = sizeGuideText()
  assert.doesNotMatch(t, /sedan|wagon|minivan/i)
  for (const g of Object.values(VEHICLE_GUIDE)) assert.ok(t.includes(g.body.toLowerCase()))
  assert.ok(SIZE_HELP_RE.test('what size is my car'))
  assert.ok(SIZE_HELP_RE.test('how do I know which size'))
})

import { runRuleBasedTurn } from '@/lib/chat/rule-based'
import { emptyConversationState } from '@/lib/chat/types'

function talk(messages: string[]) {
  let state = emptyConversationState()
  return messages.map((m, i) => {
    const r = runRuleBasedTurn(state, m, i === 0)
    state = r.state
    return r
  })
}

test('chat: an unsure customer gets the size guide, not a guessed price', () => {
  const [r] = talk(['what size is my car'])
  assert.match(r.text, /hatchbacks and coupes/i)
  assert.match(r.text, /saloons and estates/i)
  assert.doesNotMatch(r.text, /£\d/)
})

test('chat: a saloon is priced as mid-size', () => {
  const turns = talk(['full valet for my saloon'])
  assert.match(turns[0].text, /mid-size/)
  assert.match(turns[0].text, /£155/)
})

test('chat: a hatchback is priced as small', () => {
  const [r] = talk(['how much is a full valet on my hatchback'])
  assert.match(r.text, /small car/)
  assert.match(r.text, /£140/)
})

test('chat: an American word is understood but never repeated', () => {
  const [r] = talk(['premium detail for my sedan'])
  assert.match(r.text, /£240/)
  assert.doesNotMatch(r.text, /sedan/i)
})

test('chat: two body types ask instead of guessing', () => {
  const [r] = talk(['full valet for my hatchback or saloon'])
  assert.match(r.text, /more than one size/i)
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveVehicleSize, sizeGuideText, SIZE_HELP_RE } from '@/lib/chat/vehicle-size'
import { VEHICLE_GUIDE } from '@/lib/pricing'

test('hatchbacks, coupes and small crossovers are small', () => {
  for (const m of ['I have a hatchback', 'its a coupe', 'Ford Fiesta', 'VW Golf please', 'small car', 'small', 'Vauxhall Mokka', 'Nissan Juke', 'Renault Captur']) {
    assert.equal(resolveVehicleSize(m).size, 'small', m)
  }
})

test('saloons and estates are mid-size', () => {
  for (const m of ['a saloon', 'Skoda Octavia estate', 'BMW 3 Series', 'mid-size', 'medium car', 'medium', 'Range Rover Evoque', 'Nissan Qashqai', 'a Kia Sportage']) {
    assert.equal(resolveVehicleSize(m).size, 'midsize', m)
  }
})

test('SUVs, 4x4s and people carriers are large', () => {
  for (const m of ['SUV', 'a 4x4', 'people carrier', 'Range Rover', 'Range Rover Sport', 'Land Rover Discovery', 'BMW X5', 'big car', 'seven seater']) {
    assert.equal(resolveVehicleSize(m).size, 'largesuv', m)
  }
})

test('small and compact crossovers are not guessed, we ask for the make and model', () => {
  for (const m of ['a small SUV', 'compact SUV', 'a crossover', 'baby crossover']) {
    const r = resolveVehicleSize(m)
    assert.equal(r.size, null, m)
    assert.equal(r.ambiguous, true, m)
  }
  assert.equal(resolveVehicleSize('Nissan Juke crossover').size, 'small')
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
  for (const g of Object.values(VEHICLE_GUIDE)) assert.ok(t.toLowerCase().includes(g.body.toLowerCase()))
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
  assert.match(r.text, /hatchbacks, coupes and small crossovers/i)
  assert.match(r.text, /saloons, estates and compact SUVs/i)
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

test('chat: common questions get the real answers, not the stock reply', () => {
  const asks: [string, RegExp][] = [
    ['do i need to be there', /carry on with your day/i],
    ['do you bring water and electric', /bring our own power, water/i],
    ['how long does an essential take', /Essential takes 2.3 hrs/i],
    ['can you do sundays', /closed on Sundays/i],
    ['what about saturday morning', /Monday to Saturday/i],
    ['its a ford transit', /Van & Fleet/i],
    ['ref TTD-260929-5WBO', /can't look up bookings/i],
  ]
  for (const [ask, expected] of asks) {
    const [r] = talk([ask])
    assert.match(r.text, expected, ask)
  }
})

test('chat: "ok book it" moves on instead of repeating the price', () => {
  const t = talk(['how much for a full valet on my golf', 'ok book it'])
  assert.notEqual(t[1].text, t[0].text)
  assert.match(t[1].text, /Book Now/)
  assert.equal(t[1].action?.type, 'open_booking')
})

test('chat: body type beats model name, and models map to the owner rule', () => {
  assert.equal(resolveVehicleSize('mercedes c class coupe').size, 'small')
  assert.equal(resolveVehicleSize('my 2008 ford focus').size, 'small')
  assert.equal(resolveVehicleSize('a nissan juke').size, 'small')
  assert.equal(resolveVehicleSize('mini cooper').size, 'small')
  assert.equal(resolveVehicleSize('what is up with the mini valet').size, null)
})

import { withUkWording } from '@/lib/chat/uk'

test('UK wording is applied to whatever a model writes', () => {
  assert.equal(withUkWording('A Sedan or a wagon, colors and tires included.'), 'A Saloon or an estate, colours and tyres included.')
  assert.equal(withUkWording('minivans are large'), 'people carriers are large')
  assert.doesNotMatch(withUkWording('Your sedan, SEDAN, Sedans'), /sedan/i)
})

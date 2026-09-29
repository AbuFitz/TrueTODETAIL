import { test } from 'node:test'
import assert from 'node:assert/strict'
import { runRuleBasedTurn } from '@/lib/chat/rule-based'
import { emptyConversationState } from '@/lib/chat/types'

function conversation(messages: string[]) {
  let state = emptyConversationState()
  return messages.map((m, i) => {
    const r = runRuleBasedTurn(state, m, i === 0)
    state = r.state
    return r
  })
}

test('filler replies do not escalate to a human', () => {
  const turns = conversation(['yoo', 'nothing', 'nah'])
  for (const t of turns) assert.notEqual(t.action?.type, 'human_escalated')
})

test('a far away city gets a clear out-of-area answer', () => {
  const [, city] = conversation(['what areas do you cover?', 'manchester?'])
  assert.match(city.text, /Manchester/)
  assert.match(city.text, /too far|outside/i)
})

test('follow-up questions are not answered with the previous stock reply', () => {
  const [areas, cities] = conversation(['what areas?', 'what cities'])
  assert.notEqual(cities.text, areas.text)
})

test('no chat reply contains an em dash', () => {
  const turns = conversation([
    'hi', 'nah', 'how much is a full valet?', 'small car', 'what areas do you cover?',
    'manchester?', 'can I reschedule my booking?', 'what if I am not happy?', 'asdfgh', 'qwerty', 'zxcvb',
  ])
  for (const t of turns) assert.ok(!t.text.includes('—'), `em dash in: ${t.text}`)
})

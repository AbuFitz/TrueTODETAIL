// Slow check kept out of `npm test`: a provider that never answers must hand
// over to the next tier within the timeout. The fast AI-path scenarios live
// in tests/chat-llm.test.ts. Run: npx tsx scripts/chat-llm-sim.mts
import { installProviderStub, isExtract, providers, qCall, qText } from '../tests/helpers/llm-stub'

installProviderStub()
const { NextRequest } = await import('next/server')
const { POST } = await import('../app/api/support-chat/route')

async function chat(message: string) {
  const req = new NextRequest('http://localhost/api/support-chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, history: [] }),
  })
  const started = Date.now()
  const body = (await (await POST(req)).json()) as Record<string, any>
  return { body, ms: Date.now() - started }
}

let failed = 0
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} (${detail})`)
  if (!ok) failed++
}

providers.gemini = () => new Promise<Response>(() => {})
providers.groq = (_u, b) => (isExtract(b) ? qCall('extract_state', {}) : qText('Here now.'))
{
  const r = await chat('hello there')
  check('hung Gemini hands over to Groq', r.body.engine === 'groq' && r.ms < 17_000, `${r.body.engine} after ${r.ms}ms`)
}

providers.gemini = () => new Promise<Response>(() => {})
providers.groq = () => new Promise<Response>(() => {})
{
  const r = await chat('how much is essential for a small car')
  check('both hung still get a rules answer', r.body.engine === 'rules' && /£80/.test(r.body.reply) && r.ms < 32_000, `${r.body.engine} after ${r.ms}ms`)
}

process.exit(failed ? 1 : 0)

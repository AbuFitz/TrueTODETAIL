// Stand-ins for the Gemini and Groq HTTP APIs. Replaces global fetch so the
// real SDKs and chat code run end to end against scripted responses,
// without keys or quota.

export type Handler = (url: string, body: any) => Response | Promise<Response>

export const providers: { gemini: Handler; groq: Handler } = {
  gemini: () => new Response('{}', { status: 500 }),
  groq: () => new Response('{}', { status: 500 }),
}
export const seen: { gemini: any[]; groq: any[] } = { gemini: [], groq: [] }

const realFetch = globalThis.fetch

export function installProviderStub() {
  process.env.GEMINI_API_KEY = 'AIzaFAKEFAKEFAKEFAKEFAKE'
  process.env.GROQ_API_KEY = 'gsk_FAKEFAKEFAKEFAKEFAKE'
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = typeof input === 'string' ? input : input.url ?? String(input)
    const raw = init?.body ?? (input instanceof Request ? await input.clone().text() : undefined)
    const body = raw ? JSON.parse(typeof raw === 'string' ? raw : new TextDecoder().decode(raw)) : null
    const signal: AbortSignal | undefined = init?.signal ?? (input instanceof Request ? input.signal : undefined)
    const pending = url.includes('generativelanguage.googleapis.com')
      ? (seen.gemini.push({ url, body }), providers.gemini(url, body))
      : url.includes('api.groq.com')
        ? (seen.groq.push({ url, body }), providers.groq(url, body))
        : realFetch(input, init)
    if (!signal) return pending
    return Promise.race([
      pending,
      new Promise<Response>((_, reject) => signal.addEventListener('abort', () => reject(signal.reason ?? new Error('aborted')))),
    ])
  }) as typeof fetch
}

export const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } })
export const gText = (text: string) =>
  json({ candidates: [{ content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP' }] })
export const gCall = (name: string, args: object) =>
  json({ candidates: [{ content: { role: 'model', parts: [{ functionCall: { name, args } }] }, finishReason: 'STOP' }] })
export const qText = (content: string) =>
  json({ id: 'x', object: 'chat.completion', created: 1, model: 'm', choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content } }] })
export const qCall = (name: string, args: object) =>
  json({ id: 'x', object: 'chat.completion', created: 1, model: 'm', choices: [{ index: 0, finish_reason: 'tool_calls', message: { role: 'assistant', content: null, tool_calls: [{ id: 'c1', type: 'function', function: { name, arguments: JSON.stringify(args) } }] } }] })

export const isExtract = (body: any) => JSON.stringify(body).includes('extract_state')
export const isSummary = (body: any) => JSON.stringify(body).includes('Write the updated summary')
export const hasToolResult = (body: any) => {
  const s = JSON.stringify(body)
  return s.includes('functionResponse') || s.includes('"role":"tool"')
}

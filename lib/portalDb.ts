// Tiny server-side client for the portal's Supabase functions. Uses only the
// public (anon) key plus, when given, the signed-in person's own token, so
// every call is checked by the database exactly as it would be in the browser.
// The service role key is never used.

const url = () => (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')
const anon = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const portalDbConfigured = () => Boolean(url() && anon())

export class PortalDbError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message)
  }
}

export async function callRpc<T>(fn: string, args: Record<string, unknown>, userJwt?: string | null, timeoutMs = 8000): Promise<T> {
  const res = await fetch(`${url()}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: anon(),
      Authorization: `Bearer ${userJwt || anon()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(timeoutMs),
  })
  const text = await res.text()
  let json: unknown = null
  try { json = text ? JSON.parse(text) : null } catch { /* not JSON */ }
  if (!res.ok) {
    const j = json as { message?: string; code?: string } | null
    throw new PortalDbError(j?.message ?? `Database error ${res.status}`, res.status, j?.code)
  }
  return json as T
}

// Best-effort per-visitor limits for the public form and chat endpoints, so
// a script can't use them to mass-send branded emails to arbitrary addresses
// or burn through the email and AI quotas. Counts live in the memory of each
// serverless instance, so this stops cheap abuse rather than a determined
// distributed attack.

const buckets = new Map<string, { count: number; resetAt: number }>()

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/** True if this request is allowed; false once `limit` is reached within `windowMs`. */
export function allowRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
  }
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count++
  return true
}

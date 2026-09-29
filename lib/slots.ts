// Which appointment slots can still be requested, judged on UK wall-clock
// time whatever timezone the server or browser runs in. Shared by the
// booking popup (to grey out slots) and the booking API (to reject them).

/** Minimum notice for a same-day slot, so a request never lands after the slot has started. */
export const SAME_DAY_NOTICE_MINUTES = 60

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Today's date (YYYY-MM-DD) and minutes past midnight, in UK time. */
export function ukNow(now: Date = new Date()): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/** "2:00 PM" -> 840 (minutes past midnight). */
export function slotMinutes(slot: string): number {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim())
  if (!m) return NaN
  const hour = (Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0)
  return hour * 60 + Number(m[2])
}

export function isValidBookingDate(date: string, now: Date = new Date()): boolean {
  return DATE_RE.test(date) && !Number.isNaN(Date.parse(date)) && date >= ukNow(now).date
}

/** True if this date and slot can still be requested right now. */
export function isSlotAvailable(date: string, slot: string, now: Date = new Date()): boolean {
  if (!isValidBookingDate(date, now)) return false
  const today = ukNow(now)
  if (date > today.date) return true
  return slotMinutes(slot) >= today.minutes + SAME_DAY_NOTICE_MINUTES
}

/** "2026-10-10" -> "Saturday 10 October 2026", for emails and summaries. */
export function formatBookingDate(date: string): string {
  if (!DATE_RE.test(date)) return date
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).formatToParts(new Date(`${date}T00:00:00Z`))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('weekday')} ${get('day')} ${get('month')} ${get('year')}`
}

/** "2026-10-10" -> "Sat 10 Oct", for tight summary rows. */
export function formatShortDate(date: string): string {
  if (!DATE_RE.test(date)) return date
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short',
  }).formatToParts(new Date(`${date}T00:00:00Z`))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('weekday')} ${get('day')} ${get('month')}`
}

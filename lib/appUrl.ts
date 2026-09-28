/**
 * The True To Detail Job System's base URL — the separate app (customer
 * accounts, booking, live tracking, staff console) this marketing site links
 * out to for "My Account" / "Book Now" style sign-in. Set NEXT_PUBLIC_APP_URL
 * once the job system is deployed to its real domain (e.g.
 * https://app.truetodetail.co.uk); this fallback is a placeholder so local
 * dev/builds don't break before that's configured.
 */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://app.truetodetail.co.uk").replace(
  /\/$/,
  "",
)

export const appAccountLoginUrl = (nextPath?: string) =>
  nextPath ? `${APP_URL}/account/login?next=${encodeURIComponent(nextPath)}` : `${APP_URL}/account/login`

export const appAccountUrl = () => `${APP_URL}/account`
export const appBookUrl = () => `${APP_URL}/book`
export const appAdminLoginUrl = () => `${APP_URL}/admin/login`

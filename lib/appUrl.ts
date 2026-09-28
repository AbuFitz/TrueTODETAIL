/**
 * The True To Detail Job System's base URL. Customer account pages are
 * proxied in under this site's own /account path (see next.config.ts), so
 * they no longer link out here — this is only for what's still deliberately
 * kept on the app's own subdomain: staff/admin sign-in. Set
 * NEXT_PUBLIC_APP_URL once the job system is deployed to its real domain
 * (e.g. https://app.truetodetail.co.uk); this fallback is a placeholder so
 * local dev/builds don't break before that's configured.
 */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://app.truetodetail.co.uk").replace(
  /\/$/,
  "",
)

export const appAdminLoginUrl = () => `${APP_URL}/admin/login`

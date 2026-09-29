# TrueTODETAIL

The truetodetail.co.uk marketing site (Next.js). Booking, quotes, and area pages live here;
customer accounts, live detailer tracking, and the staff console live in the separate **Job
System** app (`app.truetodetail.co.uk`).

## Customer accounts / "My Account"

This site never signs anyone in itself — there's no login form here. The Navbar's "My Account"
link sends people to the Job System app's sign-in page, and once someone's signed in (on either
app), the Navbar reflects it ("Hi, `<name>`" + Sign out) via a session cookie shared across both
apps' subdomains. See `lib/appUrl.ts`, `lib/supabaseBrowser.ts`, and the Job System repo's
README → "Cross-site login (SSO)" for the full explanation and setup steps.

Relevant env vars (see `.env.example`): `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_AUTH_COOKIE_DOMAIN`.

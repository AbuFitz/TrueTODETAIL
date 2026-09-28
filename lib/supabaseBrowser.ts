'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Cross-subdomain single sign-on with the Job System app
 * (app.truetodetail.co.uk): both apps point at the SAME Supabase project and
 * read/write the SAME session cookie, scoped to the parent domain via
 * NEXT_PUBLIC_AUTH_COOKIE_DOMAIN. Signing in here (via components/LoginModal)
 * sets that cookie directly — no redirect needed — and the Job System app
 * picks it up automatically since it's the same cookie. See the Job System
 * repo's src/lib/supabase.ts for the other half of this pair, and this
 * repo's README → "Cross-site login (SSO)".
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const authCookieDomain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseBrowser = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key',
  {
    cookieOptions: {
      ...(authCookieDomain ? { domain: authCookieDomain } : {}),
      path: '/',
      sameSite: 'lax',
      secure: true,
    },
  },
)

/*
  Builds the two sign-in emails Supabase sends (confirm signup and reset
  password) from the same layout as every other True To Detail email, so they
  carry the same logo header, type and footer. Supabase keeps the templates
  itself, so paste the output into Authentication > Email Templates.

    npx tsx scripts/build-auth-email-templates.mts <output folder>
*/
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderEmail, esc, paragraph } from '../lib/emails/layout'

const out = process.argv[2]
if (!out) throw new Error('Give the folder to write the two templates into')
mkdirSync(out, { recursive: true })

const fallback = (url: string) =>
  paragraph(`Button not working? Copy this link into your browser:<br><span style="word-break:break-all;color:#0C0C0C;">${url}</span>`, { small: true })

const confirmUrl = '{{ .ConfirmationURL }}'
writeFileSync(join(out, 'confirm-signup.html'), renderEmail({
  title: 'Confirm your email',
  preheader: 'Tap the button to confirm your email address.',
  heading: 'Confirm your email',
  intro: esc('Thanks for creating your True To Detail account. Tap the button to confirm your email address and finish setting up.'),
  cta: { href: confirmUrl, label: 'Confirm my email' },
  footnote: 'If you did not create an account, you can ignore this email.',
  aside: fallback(confirmUrl),
  footer: 'auth',
}) + '\n')

const resetUrl = '{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=recovery'
writeFileSync(join(out, 'reset-password.html'), renderEmail({
  title: 'Reset your password',
  preheader: 'Tap the button to choose a new password.',
  heading: 'Reset your password',
  intro: esc('We got a request to reset the password on your True To Detail account. Tap the button to choose a new one.'),
  cta: { href: resetUrl, label: 'Choose a new password' },
  footnote: 'If you did not ask for this, you can ignore this email. Your password stays the same.',
  aside: fallback(resetUrl),
  footer: 'auth',
}) + '\n')

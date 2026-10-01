/*
  One layout for every email True To Detail sends, to customers and to staff:
  a single column with the wordmark, a small label, a heading, a short
  paragraph, a plain list of details, one full-width button and a contact
  footer. Nothing sits side by side and there are no boxes inside boxes, so
  on a phone the text gets the whole width of the screen: the page padding
  and the rounded card both drop away below 480px and only a 20px gutter is
  left. The sign-in emails Supabase sends (supabase/email-templates in the
  portal repo) are built from these same pieces.
*/

export const SITE = 'https://www.truetodetail.co.uk'
export const PHONE = '07359 591800'
export const PHONE_TEL = '+447359591800'
export const CONTACT_EMAIL = 'info@truetodetail.co.uk'

export const colour = {
  orange: '#E84A0C',
  dark: '#0C0C0C',
  page: '#F5F4F1',
  body: '#3A3A3A',
  muted: '#6B6B6B',
  line: '#E9E7E2',
}

export const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export function esc(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/** A row of the email: one full-width cell with the same 20px gutter every time. */
function section(inner: string, top = 20): string {
  return `<tr><td class="pad" style="padding:${top}px 20px 0;">${inner}</td></tr>`
}

export function eyebrow(text: string): string {
  return `<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;line-height:16px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${colour.orange};">${text}</p>`
}

export function heading(text: string): string {
  return `<h1 style="margin:0;font-family:${FONT};font-size:26px;line-height:32px;font-weight:800;color:${colour.dark};">${text}</h1>`
}

export function paragraph(html: string, opts: { small?: boolean; top?: number } = {}): string {
  const size = opts.small ? 'font-size:13px;line-height:19px;color:' + colour.muted : 'font-size:16px;line-height:24px;color:' + colour.body
  return `<p style="margin:${opts.top ?? 0}px 0 0;font-family:${FONT};${size};">${html}</p>`
}

/** A small heading over a group of details, e.g. "Customer". */
export function groupTitle(text: string): string {
  return `<p style="margin:0 0 4px;padding-top:2px;font-family:${FONT};font-size:12px;line-height:16px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${colour.dark};">${text}</p>`
}

/** Label above value, stacked, one per line. Values may carry links; callers escape what they pass. */
export function detail(label: string, valueHtml: string): string {
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:12px;line-height:16px;letter-spacing:0.08em;text-transform:uppercase;color:${colour.muted};">${label}<br><span style="font-size:16px;line-height:22px;letter-spacing:0;text-transform:none;color:${colour.dark};font-weight:600;">${valueHtml}</span></p>`
}

export function button(href: string, label: string): string {
  return `<a href="${href}" style="display:block;background:${colour.orange};color:#ffffff;text-decoration:none;text-align:center;font-family:${FONT};font-size:16px;font-weight:600;line-height:20px;padding:16px 20px;border-radius:6px;">${label}</a>`
}

export function link(href: string, label: string): string {
  return `<a href="${href}" style="color:${colour.dark};text-decoration:none;font-weight:600;">${label}</a>`
}

export function orangeLink(href: string, label: string): string {
  return `<a href="${href}" style="font-family:${FONT};font-size:15px;font-weight:600;color:${colour.orange};text-decoration:none;">${label}</a>`
}

/** The brand logo, hosted on the website (public/brand), on a dark band across the top of the card. */
export function logoBand(): string {
  return `<tr><td style="background:${colour.dark};padding:18px 20px;border-radius:10px 10px 0 0;line-height:0;"><a href="${SITE}" style="text-decoration:none;"><img src="${SITE}/brand/logo-email.png" width="86" height="27" alt="True To Detail" style="display:block;border:0;outline:none;text-decoration:none;width:86px;height:27px;font-family:${FONT};font-size:13px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#ffffff;"></a></td></tr>`
}

/** Instagram, TikTok and Facebook icons, hosted on the website. */
export function socialIcons(): string {
  const one = (href: string, file: string, alt: string) =>
    `<td style="padding-right:8px;"><a href="${href}" target="_blank" style="display:inline-block;"><img src="${SITE}/brand/${file}" width="28" height="28" alt="${alt}" style="display:block;border:0;width:28px;height:28px;"></a></td>`
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px;"><tr>${one('https://www.instagram.com/truetodetail', 'icon-instagram.png', 'Instagram')}${one('https://www.tiktok.com/@truetodetail', 'icon-tiktok.png', 'TikTok')}${one('https://www.facebook.com/truetodetail', 'icon-facebook.png', 'Facebook')}</tr></table>`
}

export interface EmailParts {
  title: string
  preheader: string
  /** Small orange label above the heading, e.g. "New booking request". */
  eyebrow?: string
  heading: string
  intro?: string
  /** Already-built detail blocks (see detail() and groupTitle()). */
  details?: string[]
  /** Extra paragraphs after the details, e.g. notes. */
  after?: string[]
  cta?: { href: string; label: string }
  footnote?: string
  /** A quiet block below the button, split from it by a hairline (e.g. the account invite). */
  aside?: string
  footer: 'customer' | 'staff' | 'auth'
}

export function renderEmail(p: EmailParts): string {
  const rows: string[] = []
  rows.push(logoBand())
  rows.push(section(`${p.eyebrow ? eyebrow(p.eyebrow) : ''}${heading(p.heading)}${p.intro ? paragraph(p.intro, { top: 12 }) : ''}`))
  if (p.details && p.details.length) {
    rows.push(section(`<div style="border-top:1px solid ${colour.line};padding-top:18px;">${p.details.join('')}</div>`))
  }
  for (const a of p.after ?? []) rows.push(section(a, 4))
  if (p.cta) {
    rows.push(section(`${button(p.cta.href, p.cta.label)}${p.footnote ? paragraph(esc(p.footnote), { small: true, top: 14 }) : ''}`, 16))
  } else if (p.footnote) {
    rows.push(section(paragraph(esc(p.footnote), { small: true }), 8))
  }
  if (p.aside) rows.push(section(`<div style="border-top:1px solid ${colour.line};padding-top:18px;">${p.aside}</div>`, 24))
  const footer = p.footer === 'staff'
    ? `Sent by the True To Detail website to the team.<br>True To Detail, mobile car detailing in Hertfordshire.`
    : p.footer === 'auth'
    ? `Need a hand? Call or WhatsApp <a href="tel:${PHONE_TEL}" style="color:${colour.dark};text-decoration:none;font-weight:600;">${PHONE}</a>.<br>True To Detail, mobile car detailing in Hertfordshire.`
    : `Questions? Reply to this email or call or WhatsApp <a href="tel:${PHONE_TEL}" style="color:${colour.dark};text-decoration:none;font-weight:600;">${PHONE}</a>.<br>True To Detail, mobile car detailing in Hertfordshire.`
  rows.push(section(`<p style="margin:0;font-family:${FONT};font-size:13px;line-height:20px;color:${colour.muted};border-top:1px solid ${colour.line};padding-top:16px;">${footer}</p>${p.footer === 'staff' ? '' : socialIcons()}`, 24).replace('padding:24px 20px 0;', 'padding:24px 20px 24px;'))

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<title>${esc(p.title)}</title>
<style>
  @media only screen and (max-width:480px) {
    .shell { padding:0 !important; }
    .card { border-radius:0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${colour.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(p.preheader.slice(0, 110))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colour.page};">
<tr><td class="shell" align="center" style="padding:24px 12px;">
  <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:10px;">
    ${rows.join('\n    ')}
  </table>
</td></tr>
</table>
</body>
</html>`
}

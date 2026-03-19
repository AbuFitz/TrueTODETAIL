/*
  Email templates for True To Detail bookings.

  ─── RESEND SETUP (5 steps) ───────────────────────────────────────────────────
  1. Sign up at https://resend.com
  2. Add & verify your domain:
       resend.com → Domains → Add Domain → truetodetail.co.uk
       Add the DNS records shown (SPF, DKIM, DMARC) via your domain registrar.
  3. Create an API key: resend.com → API Keys → Create API Key
  4. Add to your environment variables:
       RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
       BOOKING_FROM_EMAIL=hello@truetodetail.co.uk
     For local dev, add to .env.local (never commit this file).
     For production (e.g. Vercel): add via Settings → Environment Variables.
  5. Deploy and test with a real booking — you'll see it in Resend's dashboard.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface EmailData {
  id:        string
  pack:      string
  vehicle:   string
  price:     number
  date:      string
  time:      string
  name:      string
  phone:     string
  email:     string
  address:   string
  carReg:    string
  addons:    string[]
  notes?:    string
  createdAt: string
}

const brand = {
  orange:    '#E84A0C',
  dark:      '#0C0C0C',
  light:     '#F5F4F1',
  midGrey:   '#888888',
  lightGrey: '#CCCCCC',
}

/* ── Logo — matches website: TRUE TO · teardrop · DETAIL ───────────────── */
const logoHtml = `
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <tr>
      <td style="padding:0;">
        <span style="font-family:'Arial Black',Arial,sans-serif;font-size:20px;font-weight:900;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;line-height:1;">TRUE TO</span>
      </td>
      <td style="padding:0 6px 0 5px;vertical-align:middle;">
        <!-- Orange teardrop shape matching the website logo mark -->
        <table cellpadding="0" cellspacing="0" style="display:inline-table;">
          <tr><td style="width:9px;height:13px;background:#E84A0C;border-radius:50% 50% 45% 45% / 55% 55% 45% 45%;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
      <td style="padding:0;">
        <span style="font-family:'Arial Black',Arial,sans-serif;font-size:20px;font-weight:900;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;line-height:1;">DETAIL</span>
      </td>
    </tr>
  </table>`

/* ── Social media links ─────────────────────────────────────────────────── */
const socialLinks = `
  <table cellpadding="0" cellspacing="0" style="margin-top:14px;">
    <tr>
      <td style="padding-right:16px;">
        <a href="https://www.instagram.com/truetodetail" style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.orange};text-decoration:none;">Instagram</a>
      </td>
      <td style="padding-right:16px;color:${brand.lightGrey};font-size:11px;">·</td>
      <td style="padding-right:16px;">
        <a href="https://www.tiktok.com/@truetodetail" style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.orange};text-decoration:none;">TikTok</a>
      </td>
      <td style="padding-right:16px;color:${brand.lightGrey};font-size:11px;">·</td>
      <td>
        <a href="https://www.facebook.com/truetodetail" style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.orange};text-decoration:none;">Facebook</a>
      </td>
    </tr>
  </table>`

/* ── Shared HTML wrapper ───────────────────────────────────────────────── */
function wrap(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${brand.light};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.light};padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Logo / header -->
        <tr>
          <td style="background:${brand.dark};padding:28px 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  ${logoHtml}
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);">
                    Hertfordshire, UK
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        ${body}

        <!-- Footer -->
        <tr>
          <td style="background:#ffffff;padding:20px 32px;border-top:1px solid #e8e8e8;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:${brand.midGrey};letter-spacing:1px;text-transform:uppercase;">
              True To Detail · Hertfordshire, UK
            </p>
            <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;color:${brand.lightGrey};">
              07984 237149 · hello@truetodetail.co.uk
            </p>
            ${socialLinks}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/* ── Summary table row ─────────────────────────────────────────────────── */
function row(label: string, value: string, highlight = false): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:12px;color:${brand.midGrey};letter-spacing:1px;text-transform:uppercase;width:38%;vertical-align:top;">
      ${label}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:${highlight ? brand.orange : brand.dark};text-align:right;vertical-align:top;">
      ${value}
    </td>
  </tr>`
}

/* ══════════════════════════════════════════════════════════════════════════
   TEMPLATE 1 — Staff notification (to hello@truetodetail.co.uk)
   ══════════════════════════════════════════════════════════════════════════ */
export function notificationEmail(d: EmailData): string {
  const addonsLine = d.addons.length > 0 ? d.addons.join(', ') : 'None'

  const body = `
  <tr>
    <td style="background:${brand.orange};padding:24px 32px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">
        New Booking Request · Ref: ${d.id}
      </p>
      <h1 style="margin:8px 0 0;font-family:'Arial Black',Arial,sans-serif;font-size:28px;font-weight:bold;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1.1;">
        ${d.pack}
      </h1>
      <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.85);">
        Preferred: ${d.date} at ${d.time} — ${d.address}
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:32px;">

      <!-- Customer details -->
      <h2 style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:2px solid ${brand.orange};padding-bottom:10px;">
        Customer
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Name',  d.name)}
        ${row('Phone', `<a href="tel:${d.phone}" style="color:${brand.dark};text-decoration:none;">${d.phone}</a>`)}
        ${row('Email', `<a href="mailto:${d.email}" style="color:${brand.dark};text-decoration:none;">${d.email}</a>`)}
      </table>

      <!-- Booking details -->
      <h2 style="margin:28px 0 20px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:2px solid ${brand.orange};padding-bottom:10px;">
        Booking Details
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Pack',        d.pack)}
        ${row('Vehicle',     d.vehicle)}
        ${row('Reg',         d.carReg)}
        ${row('Preferred Date', d.date)}
        ${row('Preferred Time', d.time)}
        ${row('Postcode',    d.address)}
        ${row('Add-ons',     addonsLine)}
        ${d.notes ? row('Notes', d.notes) : ''}
        ${row('Total',       `£${d.price}`, true)}
      </table>

      ${d.notes ? `
      <div style="margin-top:20px;background:${brand.light};padding:16px;border-left:3px solid ${brand.orange};">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.midGrey};margin-bottom:6px;">Customer Notes</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${brand.dark};line-height:1.6;">${d.notes}</p>
      </div>` : ''}

      <!-- Action prompt -->
      <div style="margin-top:28px;background:${brand.dark};padding:20px 24px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
          Confirm or reschedule with the customer within <strong style="color:#ffffff;">1 hour</strong> via text to
          <strong style="color:#ffffff;"> ${d.phone}</strong> or email to
          <strong style="color:#ffffff;"> ${d.email}</strong>.
        </p>
      </div>

    </td>
  </tr>`

  return wrap(`New Booking Request — ${d.pack} · ${d.date}`, body)
}

/* ══════════════════════════════════════════════════════════════════════════
   TEMPLATE 2 — Customer confirmation
   ══════════════════════════════════════════════════════════════════════════ */
export function confirmationEmail(d: EmailData): string {
  const addonsLine = d.addons.length > 0 ? d.addons.join(', ') : 'None'

  const body = `
  <tr>
    <td style="background:${brand.dark};padding:32px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">
        Booking Request Received · Ref: ${d.id}
      </p>
      <h1 style="margin:10px 0 6px;font-family:'Arial Black',Arial,sans-serif;font-size:32px;font-weight:bold;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1.05;">
        REQUEST RECEIVED.
      </h1>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.5);">Hi ${d.name.split(' ')[0]}, we've got your preferred slot — we'll be in touch shortly to confirm.</p>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:32px;">

      <!-- Important notice -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#FFF7F4;padding:20px 24px;border-left:4px solid ${brand.orange};">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Please Note — Pending Confirmation</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${brand.dark};line-height:1.6;">
              This is your <strong>preferred date request</strong>, not a confirmed booking yet.
              We'll review your slot and contact you within <strong>1 hour</strong> to confirm.
              Occasionally we may need to suggest an alternative time — we'll always give you plenty of notice.
            </p>
          </td>
        </tr>
      </table>

      <!-- Key date/time highlight -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:${brand.light};padding:20px 24px;border-left:4px solid #cccccc;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${brand.midGrey};margin-bottom:6px;">Your Preferred Slot</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:20px;font-weight:bold;color:${brand.dark};">${d.date} at ${d.time}</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${brand.midGrey};">${d.address}</p>
          </td>
        </tr>
      </table>

      <!-- Booking summary -->
      <h2 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:1px solid #e8e8e8;padding-bottom:10px;">
        Booking Summary
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Pack',    d.pack)}
        ${row('Vehicle', d.vehicle)}
        ${row('Reg',     d.carReg)}
        ${d.addons.length > 0 ? row('Add-ons', addonsLine) : ''}
        ${row('Total',   `£${d.price}`, true)}
      </table>

      <!-- What happens next -->
      <h2 style="margin:28px 0 16px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:1px solid #e8e8e8;padding-bottom:10px;">
        What Happens Next
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eeeeee;vertical-align:top;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};">1 — We confirm your slot</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${brand.midGrey};line-height:1.6;">We'll text or call you within 1 hour to lock in your date. If we need to adjust the time slightly, we'll give you options and plenty of notice.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eeeeee;vertical-align:top;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};">2 — No prep needed</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${brand.midGrey};line-height:1.6;">We bring everything — power, water, all equipment. Just make sure we can access the vehicle.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};">3 — Payment on the day</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${brand.midGrey};line-height:1.6;">Card, bank transfer or cash. Your price is fixed — £${d.price} — no changes on the day.</p>
          </td>
        </tr>
      </table>

      <!-- Questions / contact -->
      <div style="margin-top:28px;background:${brand.light};padding:20px 24px;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.dark};">Any questions?</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:${brand.midGrey};line-height:1.6;">
          Reply to this email, call <a href="tel:+447984237149" style="color:${brand.orange};text-decoration:none;">07984 237149</a>,
          or WhatsApp us. We typically respond within minutes during working hours.
        </p>
      </div>

    </td>
  </tr>`

  return wrap(`Booking Request Received — ${d.date}`, body)
}

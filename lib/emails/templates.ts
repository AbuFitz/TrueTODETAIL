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
       BOOKING_FROM_EMAIL=noreply@truetodetail.co.uk
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

export interface FleetEnquiryData {
  name:      string
  business:  string
  phone:     string
  fleetSize: string
  message:   string
  createdAt: string
}

export interface ChatEscalationData {
  reason:             string
  conversationSummary: string
  customerName:       string | null
  phone:              string | null
  email:              string | null
  postcode:           string | null
  createdAt:          string
}

// Matches the live site's actual palette exactly (components use rgba(12,12,12,a)
// over white for muted text — these are the solid-hex equivalents, since email
// clients are inconsistent about rgba() text colour).
const brand = {
  orange: '#E84A0C',
  dark:   '#0C0C0C',
  light:  '#F5F4F1',
  muted:  '#8A8A8A', // ≈ rgba(12,12,12,0.42) on white
  faint:  '#BFBFBF', // ≈ rgba(12,12,12,0.25) on white
}

/*
  Logo — real brand mark, hosted at /brand/logo-email.png (trimmed, @2x for
  retina, flattened onto the exact header background colour so there's no
  seam). Email clients require absolute URLs for images.
*/
const SITE_URL = 'https://www.truetodetail.co.uk'
const logoHtml = `
  <img
    src="${SITE_URL}/brand/logo-email.png"
    width="108" height="34" alt="True To Detail"
    style="display:block;border:0;outline:none;text-decoration:none;height:34px;width:108px;"
  />`

/* ── Social icon buttons — real hosted icon images, /public/brand/icon-*.png ── */
const socialLinks = `
  <table cellpadding="0" cellspacing="0" style="margin-top:18px;">
    <tr>
      <td style="padding-right:8px;">
        <a href="https://www.instagram.com/truetodetail" target="_blank" style="display:inline-block;">
          <img src="${SITE_URL}/brand/icon-instagram.png" width="30" height="30" alt="Instagram" style="display:block;border:0;width:30px;height:30px;" />
        </a>
      </td>
      <td style="padding-right:8px;">
        <a href="https://www.tiktok.com/@truetodetail" target="_blank" style="display:inline-block;">
          <img src="${SITE_URL}/brand/icon-tiktok.png" width="30" height="30" alt="TikTok" style="display:block;border:0;width:30px;height:30px;" />
        </a>
      </td>
      <td>
        <a href="https://www.facebook.com/truetodetail" target="_blank" style="display:inline-block;">
          <img src="${SITE_URL}/brand/icon-facebook.png" width="30" height="30" alt="Facebook" style="display:block;border:0;width:30px;height:30px;" />
        </a>
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
          <td style="background:${brand.dark};padding:26px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;line-height:0;">
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
          <td style="background:#ffffff;padding:24px 32px;border-top:1px solid #ececec;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:${brand.muted};letter-spacing:1px;text-transform:uppercase;">
              True To Detail · Hertfordshire, UK
            </p>
            <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;color:${brand.faint};">
              07359 591800 · info@truetodetail.co.uk
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
    <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:12px;color:${brand.muted};letter-spacing:1px;text-transform:uppercase;width:38%;vertical-align:top;">
      ${label}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:${highlight ? brand.orange : brand.dark};text-align:right;vertical-align:top;">
      ${value}
    </td>
  </tr>`
}

/* ══════════════════════════════════════════════════════════════════════════
   TEMPLATE 1 — Staff notification (to bookings@truetodetail.co.uk)
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
        Preferred: ${d.date} at ${d.time}, ${d.address}
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
        ${row('Name',  d.name.trim() || 'Not provided')}
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
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.muted};margin-bottom:6px;">Customer Notes</p>
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

  return wrap(`New Booking Request: ${d.pack} · ${d.date}`, body)
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
      <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.5);">Hi ${d.name.trim() ? d.name.trim().split(' ')[0] : 'there'}, we've got your preferred slot. We'll be in touch shortly to confirm.</p>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:32px;">

      <!-- Important notice -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:${brand.light};padding:20px 24px;border-left:4px solid ${brand.orange};">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Please Note: Pending Confirmation</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${brand.dark};line-height:1.6;">
              This is your <strong>preferred date request</strong>, not a confirmed booking yet.
              We'll review your slot and contact you within <strong>1 hour</strong> to confirm.
              Occasionally we may need to suggest an alternative time, but we'll always give you plenty of notice.
            </p>
          </td>
        </tr>
      </table>

      <!-- Key date/time highlight -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:${brand.light};padding:20px 24px;border-left:4px solid ${brand.faint};">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${brand.muted};margin-bottom:6px;">Your Preferred Slot</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:20px;font-weight:bold;color:${brand.dark};">${d.date} at ${d.time}</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${brand.muted};">${d.address}</p>
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
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};">1. We confirm your slot</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${brand.muted};line-height:1.6;">We'll text or call you within 1 hour to lock in your date. If we need to adjust the time slightly, we'll give you options and plenty of notice.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eeeeee;vertical-align:top;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};">2. No prep needed</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${brand.muted};line-height:1.6;">We bring everything: power, water, all equipment. Just make sure we can access the vehicle.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.orange};">3. Payment on the day</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${brand.muted};line-height:1.6;">Card, bank transfer or cash. Your price is fixed at £${d.price}, with no changes on the day.</p>
          </td>
        </tr>
      </table>

      <!-- Questions / contact -->
      <div style="margin-top:28px;background:${brand.light};padding:20px 24px;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:${brand.dark};">Any questions?</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:${brand.muted};line-height:1.6;">
          Reply to this email, call <a href="tel:+447359591800" style="color:${brand.orange};text-decoration:none;">07359 591800</a>,
          or WhatsApp us. We typically respond within minutes during working hours.
        </p>
      </div>

    </td>
  </tr>`

  return wrap(`Booking Request Received: ${d.date}`, body)
}

/* ══════════════════════════════════════════════════════════════════════════
   TEMPLATE 3 — Van & Fleet enquiry notification (to info@truetodetail.co.uk)
   ══════════════════════════════════════════════════════════════════════════ */
export function fleetEnquiryEmail(d: FleetEnquiryData): string {
  const body = `
  <tr>
    <td style="background:${brand.orange};padding:24px 32px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">
        New Van & Fleet Enquiry
      </p>
      <h1 style="margin:8px 0 0;font-family:'Arial Black',Arial,sans-serif;font-size:28px;font-weight:bold;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1.1;">
        ${d.business || d.name}
      </h1>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:32px;">
      <h2 style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:2px solid ${brand.orange};padding-bottom:10px;">
        Contact Details
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Name',        d.name)}
        ${row('Business',    d.business || '—')}
        ${row('Phone',       `<a href="tel:${d.phone}" style="color:${brand.dark};text-decoration:none;">${d.phone}</a>`)}
        ${row('Fleet Size',  d.fleetSize || '—')}
      </table>

      ${d.message ? `
      <div style="margin-top:20px;background:${brand.light};padding:16px;border-left:3px solid ${brand.orange};">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.muted};margin-bottom:6px;">Message</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${brand.dark};line-height:1.6;">${d.message}</p>
      </div>` : ''}

      <div style="margin-top:28px;background:${brand.dark};padding:20px 24px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
          Reply within a few hours via text to
          <strong style="color:#ffffff;"> ${d.phone}</strong>.
        </p>
      </div>

    </td>
  </tr>`

  return wrap(`New Van & Fleet Enquiry: ${d.name}`, body)
}

/* ══════════════════════════════════════════════════════════════════════════
   TEMPLATE 4 — Chat escalation to staff (to info@truetodetail.co.uk)
   ══════════════════════════════════════════════════════════════════════════ */
export function chatEscalationEmail(d: ChatEscalationData): string {
  const body = `
  <tr>
    <td style="background:${brand.orange};padding:24px 32px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">
        Chat Assistant Escalation
      </p>
      <h1 style="margin:8px 0 0;font-family:'Arial Black',Arial,sans-serif;font-size:26px;font-weight:bold;color:#ffffff;letter-spacing:1px;text-transform:uppercase;line-height:1.1;">
        A customer needs a human
      </h1>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:32px;">
      <h2 style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:2px solid ${brand.orange};padding-bottom:10px;">
        Why
      </h2>
      <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:14px;color:${brand.dark};line-height:1.6;">${d.reason}</p>

      <h2 style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${brand.dark};border-bottom:2px solid ${brand.orange};padding-bottom:10px;">
        What we know so far
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row('Name',     d.customerName || 'Not given')}
        ${row('Phone',    d.phone ? `<a href="tel:${d.phone}" style="color:${brand.dark};text-decoration:none;">${d.phone}</a>` : 'Not given')}
        ${row('Email',    d.email ? `<a href="mailto:${d.email}" style="color:${brand.dark};text-decoration:none;">${d.email}</a>` : 'Not given')}
        ${row('Postcode', d.postcode || 'Not given')}
      </table>

      <div style="margin-top:20px;background:${brand.light};padding:16px;border-left:3px solid ${brand.orange};">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${brand.muted};margin-bottom:6px;">Conversation Summary</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${brand.dark};line-height:1.6;white-space:pre-line;">${d.conversationSummary || 'No summary available yet — early in the conversation.'}</p>
      </div>

      <div style="margin-top:28px;background:${brand.dark};padding:20px 24px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
          The customer was told a team member will follow up. Reply using the contact details above if given, or via WhatsApp/call if not.
        </p>
      </div>

    </td>
  </tr>`

  return wrap(`Chat Escalation: ${d.reason}`, body)
}

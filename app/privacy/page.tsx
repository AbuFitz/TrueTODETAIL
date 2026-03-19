import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — True To Detail' }

export default function PrivacyPage() {
  return (
    <div style={{ background: '#F5F4F1', minHeight: '100vh' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: 'clamp(64px, 8vw, 120px) clamp(24px, 5vw, 48px)' }}>

        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
            marginBottom: '48px',
          }}
        >
          ← Back
        </Link>

        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#E84A0C', marginBottom: '16px',
        }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 80px)',
          letterSpacing: '0.02em', lineHeight: 0.9,
          color: '#0C0C0C', marginBottom: '40px',
        }}>
          PRIVACY<br />POLICY
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.38)', marginBottom: '48px' }}>
          Last updated: March 2025
        </p>

        <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }}>
          {[
            {
              heading: '1. Who We Are',
              body: 'True To Detail is a mobile car detailing business operating in Hertfordshire, UK. We are the data controller for the personal information collected through this website and our booking system. Contact: hello@truetodetail.co.uk · 07984 237149.',
            },
            {
              heading: '2. What Data We Collect',
              body: 'When you submit a booking enquiry, we collect: your name, email address, phone number, service address, vehicle registration, and any notes you provide. We do not collect payment card details — payments are taken in person on the day.',
            },
            {
              heading: '3. How We Use Your Data',
              body: 'We use your personal data solely to: process and confirm your booking, contact you about your appointment, and respond to any enquiries or complaints. We do not use your data for marketing unless you have separately opted in.',
            },
            {
              heading: '4. Legal Basis for Processing',
              body: 'We process your data on the basis of contract performance (to fulfil your booking request) and our legitimate interest in providing and improving our service. We do not rely on consent as the basis for booking-related processing.',
            },
            {
              heading: '5. Data Sharing',
              body: 'We do not sell or share your personal data with third parties for marketing purposes. We may share your data with service providers who help us operate our business (such as email delivery services), who are contractually required to protect it. We will disclose data if required by law.',
            },
            {
              heading: '6. Data Retention',
              body: 'We retain booking records for up to 2 years for operational and accounting purposes. After this period, personal data is securely deleted unless we are legally required to retain it for longer.',
            },
            {
              heading: '7. Your Rights',
              body: 'Under UK GDPR, you have the right to access, correct, or delete your personal data; object to processing; and request data portability. To exercise any of these rights, contact us at hello@truetodetail.co.uk. You also have the right to lodge a complaint with the Information Commissioner\'s Office (ico.org.uk).',
            },
            {
              heading: '8. Security',
              body: 'We take appropriate technical and organisational measures to protect your data against unauthorised access, loss, or disclosure. Our website uses HTTPS encryption for all data in transit.',
            },
            {
              heading: '9. Cookies',
              body: 'This website uses cookies. Please see our Cookie Policy for details.',
            },
            {
              heading: '10. Changes to This Policy',
              body: 'We may update this policy from time to time. The current version will always be available on this page. Continued use of our website after changes constitutes acceptance of the updated policy.',
            },
          ].map(section => (
            <div
              key={section.heading}
              style={{ padding: '28px 0', borderBottom: '1px solid rgba(12,12,12,0.08)' }}
            >
              <h2 style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px',
                color: '#0C0C0C', marginBottom: '10px',
              }}>
                {section.heading}
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.78,
                color: 'rgba(12,12,12,0.55)', margin: 0,
              }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

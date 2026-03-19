import Link from 'next/link'

export const metadata = { title: 'Cookie Policy — True To Detail' }

export default function CookiesPage() {
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
          COOKIE<br />POLICY
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.38)', marginBottom: '48px' }}>
          Last updated: March 2025
        </p>

        <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }}>
          {[
            {
              heading: '1. What Are Cookies',
              body: 'Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners.',
            },
            {
              heading: '2. How We Use Cookies',
              body: 'This website uses a minimal set of cookies necessary for the site to function correctly. We do not use cookies for advertising, tracking, or profiling purposes.',
            },
            {
              heading: '3. Types of Cookies We Use',
              body: 'Essential cookies: These are required for the website to operate. They include session cookies that are deleted when you close your browser. We do not use analytics, marketing, or third-party tracking cookies.',
            },
            {
              heading: '4. Third-Party Cookies',
              body: 'We do not embed third-party services (such as social media widgets or advertising networks) that would set cookies on your device without your knowledge.',
            },
            {
              heading: '5. Managing Cookies',
              body: 'You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of this website. For more information on managing cookies, visit aboutcookies.org or allaboutcookies.org.',
            },
            {
              heading: '6. Changes to This Policy',
              body: 'We may update this policy from time to time. The current version will always be available on this page.',
            },
            {
              heading: '7. Contact',
              body: 'If you have any questions about our use of cookies, please contact us at hello@truetodetail.co.uk.',
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

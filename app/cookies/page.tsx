import Link from 'next/link'
import { SiteNavbar, SiteFooter } from '@/components/SiteChrome'
import ManageCookiesButton from '@/components/ManageCookiesButton'

export const metadata = { title: 'Cookie Policy | True To Detail' }

export default function CookiesPage() {
  return (
    <>
    <SiteNavbar />
    <div style={{ background: '#F5F4F1', minHeight: '100vh' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: 'calc(80px + clamp(64px, 8vw, 120px)) clamp(24px, 5vw, 48px) clamp(64px, 8vw, 120px)' }}>

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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.38)', marginBottom: '24px' }}>
          Last updated: September 2026
        </p>

        <ManageCookiesButton />

        <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)', marginTop: '40px' }}>
          {[
            {
              heading: '1. What Are Cookies',
              body: 'Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners.',
            },
            {
              heading: '2. How We Use Cookies',
              body: 'We use a small set of essential cookies required for the site to function, and optional analytics and advertising cookies (Google Analytics / Google Ads) that help us understand how visitors use the site and measure our advertising. The optional cookies are only set if you accept them via the cookie banner.',
            },
            {
              heading: '3. Types of Cookies We Use',
              body: 'Essential cookies: required for the website to operate, including session cookies deleted when you close your browser. Analytics and advertising cookies: set by Google (Google Analytics and Google Ads) to measure site traffic, understand how visitors find and use the site, and measure the effectiveness of our advertising. These are only active once you accept them.',
            },
            {
              heading: '4. Third-Party Cookies',
              body: "We use Google Analytics and Google Ads, which may set third-party cookies on your device once you've given consent. Google processes this data under its own privacy policy, available at policies.google.com/privacy. We don't allow other third-party services (such as social media widgets) to set cookies on this site.",
            },
            {
              heading: '5. Your Consent Choices',
              body: 'On your first visit, a banner lets you accept or reject analytics/advertising cookies. Your choice is remembered on this device, and analytics/advertising cookies are never set until you accept. You can change your choice at any time using the "Manage Cookie Preferences" button above.',
            },
            {
              heading: '6. Managing Cookies',
              body: 'You can also control and delete cookies through your browser settings at any time. Please note that disabling essential cookies may affect the functionality of this website. For more information on managing cookies generally, visit aboutcookies.org or allaboutcookies.org.',
            },
            {
              heading: '7. Changes to This Policy',
              body: 'We may update this policy from time to time. The current version will always be available on this page.',
            },
            {
              heading: '8. Contact',
              body: 'If you have any questions about our use of cookies, please contact us at info@truetodetail.co.uk.',
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
    <SiteFooter />
    </>
  )
}

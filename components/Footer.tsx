'use client'

const YEAR = new Date().getFullYear()

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/truetodetail',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@truetodetail',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.17a8.18 8.18 0 0 0 4.78 1.52V7.24a4.83 4.83 0 0 1-1.01-.55z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/truetodetail',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
]

export default function Footer({ onBookNow }: { onBookNow: () => void }) {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid rgba(12,12,12,0.07)' }}>

      {/* Main 3-column grid */}
      <div
        style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 72px) clamp(40px, 5vw, 72px)',
          display: 'grid',
          gap: 'clamp(32px, 5vw, 72px)',
        }}
        className="grid-cols-1 md:grid-cols-3"
      >

        {/* Col 1 — Brand */}
        <div>
          <a
            href="#"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
          >
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '44px',
              letterSpacing: '0.05em', color: '#0C0C0C', lineHeight: 1,
            }}>
              TRUE TO
            </span>
            <span
              aria-hidden
              style={{
                display: 'inline-block', width: '9px', height: '13px',
                background: '#E84A0C',
                borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                flexShrink: 0, marginBottom: '-3px',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '44px',
              letterSpacing: '0.05em', color: '#0C0C0C', lineHeight: 1,
            }}>
              DETAIL
            </span>
          </a>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
            color: 'rgba(12,12,12,0.42)', marginBottom: '24px', maxWidth: '220px',
          }}>
            Professional mobile car detailing in Hertfordshire. We come to you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="tel:+447984237149"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.38)')}
            >
              07984 237149
            </a>
            <a
              href="mailto:hello@truetodetail.co.uk"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.38)')}
            >
              hello@truetodetail.co.uk
            </a>
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(12,12,12,0.25)', marginBottom: '20px',
          }}>
            Navigation
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['About',    '#howitworks'],
              ['Packages', '#packages'],
              ['Reviews',  '#reviews'],
              ['Book Now', '#contact'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px',
                  color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.38)')}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Col 3 — Book */}
        <div>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(12,12,12,0.25)', marginBottom: '20px',
          }}>
            Book A Detail
          </p>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
            color: 'rgba(12,12,12,0.42)', marginBottom: '24px',
          }}>
            Mon–Sat, 8am–7pm<br />
            Hertfordshire &amp; surrounds
          </p>

          <button
            onClick={onBookNow}
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
              letterSpacing: '0.09em', textTransform: 'uppercase',
              background: '#0C0C0C', color: 'white', border: 'none',
              padding: '14px 24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '16px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E84A0C')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0C0C0C')}
          >
            Book Now
            <span style={{
              display: 'inline-block', width: '4px', height: '6px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
              flexShrink: 0,
            }} />
          </button>
        </div>

      </div>

      {/*
        Massive wordmark stamp.
        Architectural brand element — the same way luxury brands print their name
        as a watermark across the bottom of their website.
        Very low opacity — present but not competing.
      */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(12,12,12,0.06)' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(56px, 14vw, 220px)',
          letterSpacing: '0.04em',
          color: 'rgba(12,12,12,0.045)',
          lineHeight: 0.85,
          whiteSpace: 'nowrap',
          padding: '0 clamp(16px, 3vw, 48px)',
          userSelect: 'none',
          paddingBottom: 'clamp(8px, 1.5vw, 20px)',
        }}>
          TRUE TO DETAIL
        </div>
      </div>

      {/* Bottom bar — copyright + social icons (desktop) + legal links */}
      <div style={{ borderTop: '1px solid rgba(12,12,12,0.06)' }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '16px clamp(24px, 5vw, 72px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '11px',
            color: 'rgba(12,12,12,0.25)', letterSpacing: '0.04em',
          }}>
            © {YEAR} True To Detail · Hertfordshire, UK
          </span>

          {/* Social icons — desktop only */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '16px' }}>
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  color: 'rgba(12,12,12,0.28)',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E84A0C')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.28)')}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              ['Terms',   '/terms'],
              ['Privacy', '/privacy'],
              ['Cookies', '/cookies'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '11px',
                  color: 'rgba(12,12,12,0.28)', textDecoration: 'none', letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.28)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}

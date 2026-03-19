'use client'

const YEAR = new Date().getFullYear()

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

      {/* Bottom bar — copyright + legal links */}
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

const YEAR = new Date().getFullYear()

export default function Footer({ onBookNow }: { onBookNow: () => void }) {
  return (
    <footer style={{ background: '#0A0A0A' }}>

      {/* Main footer content — 3 columns */}
      <div
        style={{
          maxWidth: '1380px', margin: '0 auto',
          padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 80px) clamp(36px, 5vw, 64px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(32px, 5vw, 80px)',
        }}
        className="grid-cols-1 md:grid-cols-3"
      >

        {/* Col 1 — Brand */}
        <div>
          <a href="#" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              letterSpacing: '0.07em', color: 'rgba(255,255,255,0.88)',
            }}>
              TRUE TO
            </span>
            {/* Water-bead dot — consistent with navbar logo */}
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '5px', height: '7px',
                background: '#E84A0C',
                borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                flexShrink: 0,
                marginBottom: '-1px',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              letterSpacing: '0.07em', color: 'rgba(255,255,255,0.88)',
            }}>
              DETAIL
            </span>
          </a>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
            color: 'rgba(255,255,255,0.32)', marginBottom: '24px', maxWidth: '240px',
          }}>
            Professional mobile car detailing in Hertfordshire. We come to you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="tel:+447984237149" style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              color: 'rgba(255,255,255,0.32)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
            >
              07984 237149
            </a>
            <a href="mailto:hello@truetodetail.co.uk" style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              color: 'rgba(255,255,255,0.32)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
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
            color: 'rgba(255,255,255,0.2)', marginBottom: '20px',
          }}>
            Navigation
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Services',  '#services'],
              ['Packages',  '#packages'],
              ['About',     '#about'],
              ['Contact',   '#contact'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px',
                  color: 'rgba(255,255,255,0.32)', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Col 3 — Book + hours */}
        <div>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)', marginBottom: '20px',
          }}>
            Book A Detail
          </p>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
            color: 'rgba(255,255,255,0.32)', marginBottom: '20px',
          }}>
            Mon–Sat, 8am–7pm<br />
            Hertfordshire & surrounds
          </p>

          <button
            onClick={onBookNow}
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
              letterSpacing: '0.09em', textTransform: 'uppercase',
              background: '#E84A0C', color: 'white', border: 'none',
              padding: '14px 24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px',
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
          >
            Book Now
            <span style={{
              display: 'inline-block',
              width: '4px', height: '6px',
              background: 'rgba(255,255,255,0.55)',
              borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
              flexShrink: 0,
            }} />
          </button>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          maxWidth: '1380px', margin: '0 auto',
          padding: '16px clamp(24px, 5vw, 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '11px',
            color: 'rgba(255,255,255,0.16)', letterSpacing: '0.04em',
          }}>
            © {YEAR} True To Detail · Hertfordshire, UK
          </span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '11px',
            color: 'rgba(255,255,255,0.16)', letterSpacing: '0.04em',
          }}>
            hello@truetodetail.co.uk
          </span>
        </div>
      </div>

    </footer>
  )
}

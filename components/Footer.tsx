'use client'

import { AREAS } from '@/lib/areas'

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

      {/* Main 4-column grid */}
      <div
        style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 72px) clamp(40px, 5vw, 72px)',
          display: 'grid',
          gap: 'clamp(32px, 5vw, 72px)',
        }}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
      >

        {/* Col 1 — Brand */}
        <div>
          <a
            href="/"
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
              href="tel:+447359591800"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.38)')}
            >
              07359 591800
            </a>
            <a
              href="mailto:info@truetodetail.co.uk"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.38)')}
            >
              info@truetodetail.co.uk
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
              ['About',           '#howitworks'],
              ['Packages',        '#packages'],
              ['Reviews',         '#reviews'],
              ['Book Now',        '#contact'],
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

          {/* SEO service links */}
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(12,12,12,0.25)', marginBottom: '14px', marginTop: '28px',
          }}>
            Our Services
          </p>
          <nav aria-label="Detailing services" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              ['Mobile Car Detailing',       '/mobile-car-detailing'],
              ['Interior Car Detailing',     '/interior-car-detailing'],
              ['Exterior Car Detailing',     '/exterior-car-detailing'],
              ['Full Car Detail Packages',   '/full-car-detail'],
              ['Professional Car Valeting',  '/professional-car-valeting'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E84A0C')}
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

        {/* Col 4 — Areas We Cover, same list treatment as Our Services so it reads as part of the same grid instead of a separate banded section */}
        <div>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(12,12,12,0.25)', marginBottom: '20px',
          }}>
            Areas We Cover
          </p>
          <nav
            aria-label="Areas we cover"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', columnGap: '20px', rowGap: '10px' }}
          >
            {AREAS.map(area => (
              <a
                key={area.slug}
                href={`/areas/${area.slug}`}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
                  whiteSpace: 'nowrap', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E84A0C')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.38)')}
              >
                {area.name}
              </a>
            ))}
          </nav>
          <a
            href="/areas"
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
              color: '#E84A0C', textDecoration: 'none', whiteSpace: 'nowrap',
              display: 'inline-block', marginTop: '14px',
            }}
          >
            View all areas →
          </a>
        </div>

      </div>

      {/*
        Massive wordmark stamp, layered directly behind the bottom bar rather
        than sitting in its own row — the same way luxury brands print their
        name as a watermark overlapping the page furniture, not beside it.
        Very low opacity — present but not competing with the copyright/
        social/legal row stacked on top of it.
      */}
      {/*
        minHeight matters here: this wrapper only auto-sizes to the
        in-flow bottom bar (~60px), and the watermark below is taken out
        of flow (absolute) — without an explicit minHeight, overflow:
        hidden clips the box down to that ~60px, leaving only a sliver of
        the watermark visible instead of the intended tall band it's
        stamped into.
      */}
      <div style={{
        position: 'relative', overflow: 'hidden', minHeight: 'clamp(150px, 15vw, 230px)',
        borderTop: '1px solid rgba(12,12,12,0.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div
          aria-hidden
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 'clamp(-28px, -3vw, -10px)',
            zIndex: 0, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1vw, 18px)',
            fontFamily: 'var(--font-display)',
            // High floor on purpose — on mobile this should overflow off the
            // edges and get cropped by the wrapper's overflow: hidden, not
            // shrink down to politely fit the viewport.
            fontSize: 'clamp(170px, 19vw, 300px)',
            letterSpacing: '0.04em',
            color: 'rgba(12,12,12,0.05)',
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
            padding: '0 clamp(16px, 3vw, 48px)',
            userSelect: 'none',
          }}
        >
          <span>TRUE TO</span>
          {/* Orange teardrop — same shape as the navbar/footer logo mark */}
          <span aria-hidden style={{
            display: 'inline-block', flexShrink: 0,
            width: 'clamp(8px, 1.2vw, 19px)',
            height: 'clamp(12px, 1.8vw, 28px)',
            background: '#E84A0C',
            opacity: 0.5,
            borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
          }} />
          <span>DETAIL</span>
        </div>

        {/* Bottom bar — copyright + social icons (desktop) + legal links */}
        <div style={{
          position: 'relative', zIndex: 1,
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

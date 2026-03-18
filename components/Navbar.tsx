'use client'

import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Services', href: '#services'  },
  { label: 'Packages', href: '#packages'  },
  { label: 'About',    href: '#about'     },
  { label: 'Contact',  href: '#contact'   },
]

export default function Navbar({ onBookNow }: { onBookNow: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [hovered, setHovered]   = useState<string | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ─── Main nav bar ─── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: '68px',
          background: '#fff',
          borderBottom: '1px solid rgba(12,12,12,0.08)',
          display: 'flex', alignItems: 'center',
          transition: 'box-shadow 0.35s',
          boxShadow: scrolled ? '0 2px 24px rgba(12,12,12,0.06)' : 'none',
        }}
      >
        <div
          style={{
            width: '100%', maxWidth: '1400px', margin: '0 auto',
            padding: '0 clamp(20px, 4vw, 64px)',
            display: 'flex', alignItems: 'center', height: '100%',
          }}
        >

          {/* Logo */}
          <a
            href="#"
            style={{
              textDecoration: 'none', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '7px',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              letterSpacing: '0.06em', color: '#0C0C0C', lineHeight: 1,
            }}>
              TRUE TO
            </span>
            {/*
              The orange droplet — a water bead resting on the nav surface.
              Connects the water / detailing theme without gimmickry.
            */}
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '5px', height: '8px',
                background: '#E84A0C',
                borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                flexShrink: 0,
                marginBottom: '-1px',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              letterSpacing: '0.06em', color: '#0C0C0C', lineHeight: 1,
            }}>
              DETAIL
            </span>
          </a>

          <div style={{ flex: 1 }} />

          {/* Desktop links */}
          <div className="hidden md:flex items-center" style={{ gap: 0 }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px',
                  letterSpacing: '0.04em',
                  color: hovered === l.label ? '#0C0C0C' : 'rgba(12,12,12,0.42)',
                  textDecoration: 'none',
                  padding: '0 18px', height: '68px',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={() => setHovered(l.label)}
                onMouseLeave={() => setHovered(null)}
              >
                {/*
                  The "wipe" underline — mirrors the detailing motion.
                  Sweeps in from left to right on hover, then retracts left-to-right on leave.
                  scaleX(0→1) with transform-origin: left. Precise, intentional.
                */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '18px', right: '18px',
                    height: '1.5px',
                    background: '#E84A0C',
                    transformOrigin: 'left center',
                    transform: `scaleX(${hovered === l.label ? 1 : 0})`,
                    transition: hovered === l.label
                      ? 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'transform 0.18s cubic-bezier(0.55, 0, 1, 0.45)',
                    pointerEvents: 'none',
                  }}
                />
                {l.label}
              </a>
            ))}

            <span style={{
              display: 'block',
              width: 1, height: 20,
              background: 'rgba(12,12,12,0.1)',
              margin: '0 14px', flexShrink: 0,
            }} />

            <button
              onClick={onBookNow}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                letterSpacing: '0.09em', textTransform: 'uppercase',
                background: '#0C0C0C', color: '#fff', border: 'none',
                padding: '11px 24px', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#E84A0C')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0C0C0C')}
            >
              Book Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              gap: '5px', width: '40px', height: '40px',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            {[0, 1, 2].map((j) => (
              <span
                key={j}
                style={{
                  height: '1.5px', background: '#0C0C0C', display: 'block',
                  width: j === 1 ? '16px' : '24px',
                  transformOrigin: 'center',
                  transition: 'all 0.28s',
                  transform:
                    open
                      ? j === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                        : j === 1 ? 'scaleX(0)'
                        : 'rotate(-45deg) translate(4.5px, -4.5px)'
                      : 'none',
                  opacity: open && j === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>

        </div>
      </nav>

      {/* ─── Mobile full-screen menu ─── */}
      {/*
        On mobile, the menu opens dark. The contrast from white → dark
        gives the open animation more drama without any extra effort.
      */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: '#0C0C0C',
          paddingTop: '68px',
          display: 'flex', flexDirection: 'column',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      >
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 clamp(28px, 6vw, 60px)',
          }}
        >
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                  color: 'rgba(255,255,255,0.2)', width: '20px',
                }}>
                  0{i + 1}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 11vw, 64px)',
                  letterSpacing: '0.04em', color: 'white', lineHeight: 1,
                }}>
                  {l.label}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '14px' }}>→</span>
            </a>
          ))}
        </div>

        <div style={{
          padding: 'clamp(20px, 4vw, 36px) clamp(28px, 6vw, 60px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={() => { setOpen(false); onBookNow() }}
            style={{
              width: '100%',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#E84A0C', color: 'white', border: 'none', cursor: 'pointer',
              padding: '16px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            Book Your Detail
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          </button>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '11px',
            color: 'rgba(255,255,255,0.2)', marginTop: '12px', letterSpacing: '0.06em',
          }}>
            07984 237149 · Mon–Sat 8am–7pm
          </p>
        </div>
      </div>
    </>
  )
}

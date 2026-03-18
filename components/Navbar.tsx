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
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: '64px',
          display: 'flex', alignItems: 'center',
          background: '#0A0A0A',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          transition: 'border-color 0.4s',
        }}
      >
        {/*
          Water-surface wave line — appears on scroll.
          Evokes surface tension / the water theme.
        */}
        <svg
          aria-hidden
          style={{
            position: 'absolute', bottom: -2, left: 0,
            width: '100%', height: '4px',
            pointerEvents: 'none',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
          preserveAspectRatio="none"
          viewBox="0 0 1440 4"
        >
          <path
            d="M0,2 C240,0.2 480,3.8 720,2 C960,0.2 1200,3.8 1440,2"
            stroke="#E84A0C"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        <div
          style={{
            width: '100%', maxWidth: '1380px', margin: '0 auto',
            padding: '0 clamp(20px, 4vw, 64px)',
            display: 'flex', alignItems: 'center', height: '100%',
          }}
        >
          {/* Logo — water-bead dot separates "TRUE TO" from "DETAIL" */}
          <a
            href="#"
            style={{
              textDecoration: 'none', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '18px',
              letterSpacing: '0.07em', color: 'rgba(255,255,255,0.88)',
            }}>
              TRUE TO
            </span>
            {/* The water-bead shape — a slightly flattened droplet sitting on the baseline */}
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
              fontFamily: 'var(--font-display)', fontSize: '18px',
              letterSpacing: '0.07em', color: 'rgba(255,255,255,0.88)',
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
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px',
                  letterSpacing: '0.04em',
                  color: hovered === l.label ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.38)',
                  textDecoration: 'none',
                  padding: '0 16px', height: '64px',
                  display: 'flex', alignItems: 'center',
                  position: 'relative',
                  transition: 'color 0.18s',
                }}
                onMouseEnter={() => setHovered(l.label)}
                onMouseLeave={() => setHovered(null)}
              >
                {/*
                  Water-bead hover indicator.
                  Shape: wider than tall, rounded top, slightly flatter bottom —
                  like a bead of water sitting on a polished paint surface.
                  Animates in with spring-like overshoot for a subtle bounce.
                */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '12px',
                    width: '40px',
                    height: '16px',
                    transform: `translateX(-50%) scaleX(${hovered === l.label ? 1 : 0.2})`,
                    opacity: hovered === l.label ? 1 : 0,
                    borderRadius: '50% 50% 45% 45% / 62% 62% 38% 38%',
                    background: 'rgba(232,74,12,0.22)',
                    transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s',
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>{l.label}</span>
              </a>
            ))}

            <span style={{
              display: 'block',
              width: 1, height: 18,
              background: 'rgba(255,255,255,0.1)',
              margin: '0 12px', flexShrink: 0,
            }} />

            <button
              onClick={onBookNow}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                letterSpacing: '0.09em', textTransform: 'uppercase',
                background: '#E84A0C', color: 'white', border: 'none',
                padding: '10px 22px', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
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
                  height: '1.5px', background: 'rgba(255,255,255,0.7)', display: 'block',
                  width: j === 1 ? '16px' : '24px',
                  transformOrigin: 'center',
                  transition: 'all 0.28s',
                  transform:
                    open
                      ? j === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                        : j === 1 ? 'scaleX(0) translateX(-10px)'
                        : 'rotate(-45deg) translate(4.5px, -4.5px)'
                      : 'none',
                  opacity: open && j === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: '#0A0A0A',
          paddingTop: '64px',
          display: 'flex', flexDirection: 'column',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s',
        }}
      >
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 clamp(28px, 6vw, 60px)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)', marginBottom: '28px',
          }}>
            Navigation
          </p>

          {NAV_LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 0',
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
                  fontSize: 'clamp(40px, 11vw, 60px)',
                  letterSpacing: '0.04em', color: 'white', lineHeight: 1,
                }}>
                  {l.label}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>→</span>
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
            color: 'rgba(255,255,255,0.2)', marginTop: '12px', letterSpacing: '0.08em',
          }}>
            07984 237149 · Mon–Sat 8am–7pm
          </p>
        </div>
      </div>
    </>
  )
}

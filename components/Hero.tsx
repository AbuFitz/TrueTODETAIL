'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const WORDS = ['Detail', 'Clean', 'Shine']

const D_TOP = 58
const D_BOT = 38

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  const [displayText, setDisplayText] = useState('Detail')
  const [isDeleting,  setIsDeleting]  = useState(false)
  const [wordIndex,   setWordIndex]   = useState(0)

  useEffect(() => {
    const current = WORDS[wordIndex]
    if (!isDeleting && displayText === current) {
      const t = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(t)
    }
    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setWordIndex(i => (i + 1) % WORDS.length)
      return
    }
    const speed = isDeleting ? 40 : 80
    const t = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? current.slice(0, displayText.length - 1)
          : current.slice(0, displayText.length + 1),
      )
    }, speed)
    return () => clearTimeout(t)
  }, [displayText, isDeleting, wordIndex])

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP HERO  (md and up)
      ───────────────────────────────────────────────────────────── */}
      <section
        className="hidden md:block"
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 80px)',
          background: '#0C0C0C',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=90&fit=crop"
            alt="Professional mobile car detailing service — True To Detail covering Hemel Hempstead, Watford, St Albans and Hertfordshire"
            fill priority sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '82% 55%' }}
          />
        </motion.div>

        {/* Diagonal dark panel */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: '#0C0C0C',
            clipPath: `polygon(0 0, ${D_TOP}% 0, ${D_BOT}% 100%, 0 100%)`,
          }}
        />

        {/* Orange diagonal stripe */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            clipPath: `polygon(
              calc(${D_TOP}% - 1.5px) 0, calc(${D_TOP}% + 1.5px) 0,
              calc(${D_BOT}% + 1.5px) 100%, calc(${D_BOT}% - 1.5px) 100%
            )`,
            background: '#E84A0C',
          }}
        />

        {/* Stats overlay — bottom-right photo area */}
        <div
          style={{
            position: 'absolute', bottom: 0, right: 0, zIndex: 4,
            width: `${100 - D_BOT}%`,
            display: 'flex',
            background: 'linear-gradient(to top, rgba(12,12,12,0.82) 0%, transparent 100%)',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '0 clamp(24px, 4vw, 64px) clamp(20px, 2.5vw, 40px)',
            gap: 'clamp(20px, 3.5vw, 56px)',
            pointerEvents: 'none',
          }}
        >
          {[
            { value: '100%', label: 'Mobile\nService' },
            { value: '£0',   label: 'Hidden\nCharges' },
            { value: '2YR',  label: 'Ceramic\nWarranty' },
          ].map(s => (
            <div key={s.value} style={{ textAlign: 'center', flexShrink: 0 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 80px)',
                letterSpacing: '0.01em',
                color: '#ffffff', lineHeight: 0.88, display: 'block',
              }}>
                {s.value}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(7px, 0.65vw, 10px)',
                fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)', whiteSpace: 'pre-line',
                display: 'block', marginTop: '5px', lineHeight: 1.5,
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop content — left panel */}
        <div
          style={{
            position: 'relative', zIndex: 3,
            width: '55%',
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(28px, 3.5vw, 52px) clamp(20px, 4vw, 64px)',
          }}
        >
          {/* Location label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
              marginBottom: 'clamp(24px, 5vh, 56px)',
            }}
          >
            Hertfordshire, UK
          </motion.p>

          {/* Typewriter headline — grows to fill available space */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            style={{ pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(54px, 13vw, 220px)',
              letterSpacing: '0.01em', color: '#ffffff',
              lineHeight: 0.9,
              display: 'flex', alignItems: 'baseline',
              minHeight: 'calc(clamp(54px, 13vw, 220px) * 0.9)',
            }}>
              <span>{displayText}</span>
              <span
                className="typewriter-cursor"
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 'clamp(3px, 0.22vw, 5px)',
                  height: '0.72em',
                  background: '#ffffff',
                  marginLeft: 'clamp(4px, 0.4vw, 8px)',
                  verticalAlign: 'baseline',
                  position: 'relative', top: '0.04em', flexShrink: 0,
                }}
              />
            </div>

            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 11.5vw, 193px)',
              letterSpacing: '0.01em', color: 'rgba(255,255,255,0.44)',
              display: 'block', lineHeight: 0.9,
              paddingLeft: 'clamp(14px, 3vw, 48px)',
            }}>
              DONE
            </span>

            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(38px, 9vw, 154px)',
              letterSpacing: '0.01em', color: 'rgba(255,255,255,0.30)',
              display: 'block', lineHeight: 0.9,
              paddingLeft: 'clamp(28px, 8vw, 128px)',
            }}>
              RIGHT<span style={{ color: '#E84A0C' }}>.</span>
            </span>
          </motion.div>

          {/* Sub-paragraph + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            style={{
              display: 'flex', flexDirection: 'column',
              gap: 'clamp(20px, 2.5vh, 36px)',
              marginTop: 'clamp(24px, 4vh, 48px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.42)' }} />
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.2vw, 15px)',
                lineHeight: 1.72, color: 'rgba(255,255,255,0.42)',
                maxWidth: '300px', margin: 0,
              }}>
                Mobile detailing delivered to your driveway.<br />
                No drop-off. No waiting. Just flawless results.
              </p>
            </div>

            <button
              onClick={onBookNow}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
                padding: '16px 48px',
                display: 'inline-flex', alignItems: 'center', gap: '14px',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap', alignSelf: 'flex-start',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
            >
              Book Your Detail
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE HERO  (below md)
      ───────────────────────────────────────────────────────────── */}
      <section
        className="flex md:hidden"
        style={{
          position: 'relative',
          minHeight: 'calc(100svh - 80px)',
          flexDirection: 'column',
          background: '#0C0C0C',
          overflow: 'hidden',
        }}
      >
        {/* Orange left bar — spans full height */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: '3px', background: '#E84A0C', zIndex: 10,
        }} />

        {/* ── PHOTO ZONE — clean, clipped, barely touched ── */}
        <div style={{ height: '44vh', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <motion.div
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=85&fit=crop"
              alt="Professional mobile car detailing service near Hemel Hempstead Hertfordshire"
              fill priority sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: '58% 22%' }}
            />
          </motion.div>

          {/* Vignette — just enough for the bottom fade into dark zone */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(12,12,12,0.05) 55%, rgba(12,12,12,0.7) 100%)',
          }} />

          {/* Location badge floating top-left */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            style={{
              position: 'absolute', top: '16px', left: '22px', zIndex: 2,
              display: 'flex', alignItems: 'center', gap: '7px',
            }}
          >
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#E84A0C', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
            }}>
              Hertfordshire, UK
            </span>
          </motion.div>
        </div>

        {/* ── DARK CONTENT ZONE ── */}
        <div style={{
          flex: 1, background: '#0C0C0C',
          display: 'flex', flexDirection: 'column',
          padding: '18px 20px 0 22px',
        }}>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease }}
            style={{ pointerEvents: 'none' }}
          >
            {/* Typewriter word */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(70px, 19.5vw, 88px)',
              letterSpacing: '0.01em', color: '#ffffff',
              lineHeight: 0.87,
              display: 'flex', alignItems: 'baseline',
            }}>
              <span>{displayText}</span>
              <span
                className="typewriter-cursor"
                aria-hidden
                style={{
                  display: 'inline-block', width: '3px', height: '0.65em',
                  background: '#E84A0C', marginLeft: '5px',
                  verticalAlign: 'baseline', flexShrink: 0,
                  position: 'relative', top: '0.04em',
                }}
              />
            </div>

            {/* DONE RIGHT. — single line, muted */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(46px, 12.5vw, 60px)',
              letterSpacing: '0.01em', color: 'rgba(255,255,255,0.22)',
              lineHeight: 0.87,
            }}>
              DONE RIGHT<span style={{ color: '#E84A0C' }}>.</span>
            </div>
          </motion.div>

          {/* Spacer — pushes CTA to bottom */}
          <div style={{ flex: 1, minHeight: '12px' }} />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.6,
              color: 'rgba(255,255,255,0.38)', margin: '0 0 14px',
            }}
          >
            Mobile detailing to your door — no drop-off, fixed prices.
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.36, ease }}
            onClick={onBookNow}
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
              padding: '17px 20px', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            Book Your Detail
            <span style={{
              display: 'inline-block', width: '5px', height: '9px',
              background: 'rgba(255,255,255,0.8)', flexShrink: 0,
              borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
            }} />
          </motion.button>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.42, ease }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: '1px' }}
          >
            {[
              { value: '100%', label: 'Mobile\nService'  },
              { value: '£0',   label: 'Hidden\nCharges'  },
              { value: '5★',   label: 'Rated\nService'   },
            ].map((s, i) => (
              <div key={s.value} style={{
                textAlign: 'center', padding: '11px 4px 12px',
                background: '#111111',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 5.5vw, 24px)',
                  color: '#ffffff', lineHeight: 1, display: 'block', letterSpacing: '0.02em',
                }}>
                  {s.value}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '7px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  display: 'block', marginTop: '4px', whiteSpace: 'pre-line', lineHeight: 1.4,
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

    </div>
  )
}

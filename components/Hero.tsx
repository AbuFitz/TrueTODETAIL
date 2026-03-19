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
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 80px)',
          overflow: 'hidden',
          background: '#0C0C0C',
        }}
      >
        {/* ── Image ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=90&fit=crop"
            alt="Premium car detailing"
            fill priority sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: '82% 55%',
            }}
          />
        </motion.div>

        {/* ── Mobile-only: bottom-up gradient — photo visible top, dark at bottom ── */}
        <div
          aria-hidden
          className="block md:hidden"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to top, rgba(12,12,12,0.97) 0%, rgba(12,12,12,0.88) 38%, rgba(12,12,12,0.50) 62%, rgba(12,12,12,0.18) 100%)',
          }}
        />

        {/* ── Desktop-only: diagonal dark panel ── */}
        <div
          aria-hidden
          className="hidden md:block"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: '#0C0C0C',
            clipPath: `polygon(0 0, ${D_TOP}% 0, ${D_BOT}% 100%, 0 100%)`,
          }}
        />

        {/* ── Desktop-only: orange diagonal stripe ── */}
        <div
          aria-hidden
          className="hidden md:block"
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            clipPath: `polygon(
              calc(${D_TOP}% - 1.5px) 0, calc(${D_TOP}% + 1.5px) 0,
              calc(${D_BOT}% + 1.5px) 100%, calc(${D_BOT}% - 1.5px) 100%
            )`,
            background: '#E84A0C',
          }}
        />

        {/* ── Stats overlay — bottom-right of the photo area (desktop only) ── */}
        <div
          className="hidden md:flex"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 4,
            /* Sits in the photo zone — starts roughly where the diagonal ends at the bottom */
            width: `${100 - D_BOT}%`,
            background: 'linear-gradient(to top, rgba(12,12,12,0.82) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '0 clamp(24px, 4vw, 64px) clamp(24px, 3vw, 48px)',
            gap: 'clamp(24px, 4vw, 64px)',
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
                fontSize: 'clamp(36px, 6vw, 96px)',
                letterSpacing: '0.01em',
                color: '#ffffff',
                lineHeight: 0.88,
                display: 'block',
              }}>
                {s.value}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(8px, 0.75vw, 11px)',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                whiteSpace: 'pre-line',
                display: 'block',
                marginTop: '6px',
                lineHeight: 1.5,
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Content ── */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 3,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Desktop layout: space-between across full height */}
          <div
            className="hidden md:flex"
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              width: '55%',
              padding: 'clamp(28px, 3.5vw, 52px) clamp(20px, 4vw, 64px)',
            }}
          >
            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
              }}
            >
              Hertfordshire, UK
            </motion.p>

            {/* Typewriter headline */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.08, ease }}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(54px, 16.5vw, 260px)',
                letterSpacing: '0.01em', color: '#ffffff',
                lineHeight: 0.9,
                display: 'flex', alignItems: 'baseline',
                minHeight: 'calc(clamp(54px, 16.5vw, 260px) * 0.9)',
              }}>
                <span>{displayText}</span>
                <span
                  className="typewriter-cursor"
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    width: 'clamp(3px, 0.25vw, 5px)',
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
                fontSize: 'clamp(48px, 14.5vw, 228px)',
                letterSpacing: '0.01em', color: 'rgba(255,255,255,0.44)',
                display: 'block', lineHeight: 0.9,
                paddingLeft: 'clamp(14px, 3vw, 48px)',
              }}>
                DONE
              </span>

              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 11.5vw, 182px)',
                letterSpacing: '0.01em', color: 'rgba(255,255,255,0.30)',
                display: 'block', lineHeight: 0.9,
                paddingLeft: 'clamp(28px, 8vw, 128px)',
              }}>
                RIGHT<span style={{ color: '#E84A0C' }}>.</span>
              </span>
            </motion.div>

            {/* Sub-paragraph + CTA grouped together */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease }}
              style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '48px', height: '1px', background: 'rgba(255,255,255,0.42)' }} />
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.4vw, 16px)',
                  lineHeight: 1.72, color: 'rgba(255,255,255,0.42)',
                  maxWidth: '320px', margin: 0,
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
                  padding: '17px 56px',
                  display: 'inline-flex', alignItems: 'center', gap: '16px',
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

          {/* ── Mobile layout ── */}
          <div
            className="flex md:hidden"
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-end',  /* pin everything to bottom */
              height: '100%',
              padding: '0 28px 52px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >

              {/* Location label */}
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.30)',
                margin: '0 0 20px',
              }}>
                Hertfordshire, UK
              </p>

              {/* Staircase headline */}
              <div style={{ pointerEvents: 'none', marginBottom: '22px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(58px, 17vw, 84px)',
                  letterSpacing: '0.01em', color: '#ffffff',
                  lineHeight: 0.88,
                  display: 'flex', alignItems: 'baseline',
                }}>
                  <span>{displayText}</span>
                  <span
                    className="typewriter-cursor"
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: '3px', height: '0.72em',
                      background: '#ffffff',
                      marginLeft: '5px',
                      verticalAlign: 'baseline',
                      position: 'relative', top: '0.04em', flexShrink: 0,
                    }}
                  />
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(50px, 14.5vw, 72px)',
                  letterSpacing: '0.01em', color: 'rgba(255,255,255,0.44)',
                  display: 'block', lineHeight: 0.88,
                  paddingLeft: '10px',
                }}>
                  DONE
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 11.5vw, 58px)',
                  letterSpacing: '0.01em', color: 'rgba(255,255,255,0.28)',
                  display: 'block', lineHeight: 0.88,
                  paddingLeft: '22px',
                }}>
                  RIGHT<span style={{ color: '#E84A0C' }}>.</span>
                </span>
              </div>

              {/* Separator rule */}
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.40)', marginBottom: '14px' }} />

              {/* Sub-text */}
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                lineHeight: 1.7, color: 'rgba(255,255,255,0.45)',
                margin: '0 0 28px',
              }}>
                Mobile detailing to your door.<br />
                No drop-off. Fixed prices. Hertfordshire.
              </p>

              {/* CTA — full width on mobile */}
              <button
                onClick={onBookNow}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '17px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                Book Your Detail
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

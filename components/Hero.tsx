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
      /* Pause 600ms before deleting — short enough to feel fluid */
      const t = setTimeout(() => setIsDeleting(true), 600)
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
              /* Shifted right to show more car, less background */
              objectPosition: '82% 55%',
              transform: 'scale(1.0)',
              transformOrigin: 'center center',
            }}
          />
        </motion.div>

        {/* ── Dark panel ── */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: '#0C0C0C',
          clipPath: `polygon(0 0, ${D_TOP}% 0, ${D_BOT}% 100%, 0 100%)`,
        }} />

        {/* ── Orange diagonal stripe ── */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          clipPath: `polygon(
            calc(${D_TOP}% - 1.5px) 0, calc(${D_TOP}% + 1.5px) 0,
            calc(${D_BOT}% + 1.5px) 100%, calc(${D_BOT}% - 1.5px) 100%
          )`,
          background: '#E84A0C',
        }} />

        {/* ── Content ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          width: '55%',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 'clamp(28px, 3.5vw, 52px) clamp(24px, 4vw, 64px)',
        }}>

          {/* Label — just location, no brand name repeat */}
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
              fontSize: 'clamp(80px, 16.5vw, 260px)',
              letterSpacing: '0.01em', color: '#ffffff',
              lineHeight: 0.9,
              display: 'flex', alignItems: 'baseline',
              minHeight: 'calc(clamp(80px, 16.5vw, 260px) * 0.9)',
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
              fontSize: 'clamp(70px, 14.5vw, 228px)',
              letterSpacing: '0.01em', color: 'rgba(255,255,255,0.44)',
              display: 'block', lineHeight: 0.9,
              paddingLeft: 'clamp(16px, 3vw, 48px)',
            }}>
              DONE
            </span>

            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 11.5vw, 182px)',
              letterSpacing: '0.01em', color: 'rgba(255,255,255,0.30)',
              display: 'block', lineHeight: 0.9,
              paddingLeft: 'clamp(36px, 8vw, 128px)',
            }}>
              RIGHT<span style={{ color: '#E84A0C' }}>.</span>
            </span>
          </motion.div>

          {/* CTA — just the button, no description or phone */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <button
              onClick={onBookNow}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
                /* Wider padding makes the button longer */
                padding: '17px 56px',
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
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
    </div>
  )
}

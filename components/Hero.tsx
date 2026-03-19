'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

/*
  Headline words cycle slowly — DETAIL is the anchor, then three alternatives.
  Each word stays on screen for 3.5 seconds before crossfading.
*/
const HEADLINE_WORDS = ['DETAIL', 'CLEAN', 'PERFECT', 'FLAWLESS']

/* Diagonal split constants — shared by dark panel + orange stripe */
const D_TOP = 58
const D_BOT = 38

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setWordIdx(i => (i + 1) % HEADLINE_WORDS.length),
      3500,
    )
    return () => clearInterval(id)
  }, [])

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

        {/* ── Layer 0: Full-section car image ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=90&fit=crop"
            alt="Premium car detailing"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: '72% 55%',
              /* Zoomed out — no scale transform */
              transform: 'scale(1.0)',
              transformOrigin: 'center center',
            }}
          />
        </motion.div>

        {/* ── Layer 1: Dark panel with diagonal right edge ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: '#0C0C0C',
            clipPath: `polygon(0 0, ${D_TOP}% 0, ${D_BOT}% 100%, 0 100%)`,
          }}
        />

        {/* ── Layer 2: Orange diagonal stripe ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            clipPath: `polygon(
              calc(${D_TOP}% - 1.5px) 0,
              calc(${D_TOP}% + 1.5px) 0,
              calc(${D_BOT}% + 1.5px) 100%,
              calc(${D_BOT}% - 1.5px) 100%
            )`,
            background: '#E84A0C',
          }}
        />

        {/* ── Layer 3: Text content ── */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 3,
            width: '55%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(28px, 3.5vw, 52px) clamp(24px, 4vw, 64px)',
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
            True To Detail — Hertfordshire, UK
          </motion.p>

          {/* Staircase headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            style={{ pointerEvents: 'none' }}
          >
            {/*
              Cycling word — uses AnimatePresence so the exiting word slides up
              while the entering word slides up from below.
              overflow:hidden on the wrapper clips the slide movement cleanly.
            */}
            <div style={{ overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={HEADLINE_WORDS[wordIdx]}
                  initial={{ opacity: 0, y: '30%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '-30%' }}
                  transition={{ duration: 0.55, ease }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(80px, 16.5vw, 260px)',
                    letterSpacing: '0.01em', color: '#ffffff',
                    display: 'block', lineHeight: 0.9,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {HEADLINE_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
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

          {/* Description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.3vw, 15px)', lineHeight: 1.78,
              color: 'rgba(255,255,255,0.38)', maxWidth: '320px', marginBottom: '20px',
            }}>
              Professional mobile detailing straight to your driveway.
              Fixed prices, no drop-off needed, results that speak for themselves.
            </p>

            {/*
              Button stretched full-width across the dark panel.
              Phone number sits below as a secondary action.
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={onBookNow}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '18px 28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
              >
                Book Your Detail
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
              </button>

              <a
                href="tel:+447984237149"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px',
                  color: 'rgba(255,255,255,0.32)', textDecoration: 'none', letterSpacing: '0.03em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
              >
                07984 237149
              </a>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}

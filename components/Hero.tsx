'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const TICKER = [
  'Mobile Service', 'Fixed Pricing', 'Hertfordshire', 'No Drop-Off',
  'Ceramic Coating', 'Book Online', 'We Come To You', 'Professional Grade',
]

const STATS = [
  { val: '100%', label: 'Mobile\nService'    },
  { val: '£0',   label: 'Hidden\nCharges'   },
  { val: '2YR',  label: 'Ceramic\nWarranty' },
]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── Main hero ── */}
      <section
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: 'calc(100vh - 80px)',
          background: '#0C0C0C',
          overflow: 'hidden',
        }}
      >

        {/* ── Left: dark content panel (~56%) ── */}
        <div
          style={{
            flex: '0 0 56%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(28px, 3.5vw, 52px) clamp(24px, 4vw, 64px)',
            background: '#0C0C0C',
            position: 'relative', zIndex: 2,
          }}
        >

          {/* Top label */}
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

          {/*
            ── Staircase headline — as in the reference ──

            DETAIL  (flush left, pure white, dominant)
              DONE  (indented ~3vw, gray ~45%, slightly smaller)
                RIGHT.  (indented ~8vw, gray ~30%, smaller — orange period)

            Each word steps right and fades down.
            The sizes are large enough that DETAIL nearly fills the left panel.
            The orange period on RIGHT. is the only colour accent in the type.
          */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            style={{ pointerEvents: 'none' }}
          >
            {/* DETAIL — full white, no indent */}
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(82px, 17vw, 268px)',
                letterSpacing: '0.01em',
                color: '#ffffff',
                display: 'block',
                lineHeight: 0.9,
              }}>
                DETAIL
              </span>
            </div>

            {/* DONE — step right, faded */}
            <div style={{ paddingLeft: 'clamp(18px, 3vw, 52px)' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(72px, 15vw, 236px)',
                letterSpacing: '0.01em',
                color: 'rgba(255,255,255,0.44)',
                display: 'block',
                lineHeight: 0.9,
              }}>
                DONE
              </span>
            </div>

            {/* RIGHT. — step further right, more faded, orange period */}
            <div style={{ paddingLeft: 'clamp(40px, 8vw, 128px)' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(58px, 12vw, 190px)',
                letterSpacing: '0.01em',
                color: 'rgba(255,255,255,0.30)',
                display: 'block',
                lineHeight: 0.9,
              }}>
                RIGHT<span style={{ color: '#E84A0C' }}>.</span>
              </span>
            </div>
          </motion.div>

          {/* Bottom: description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.3vw, 15px)', lineHeight: 1.78,
              color: 'rgba(255,255,255,0.38)', maxWidth: '320px', marginBottom: '22px',
            }}>
              Professional mobile detailing straight to your driveway.
              Fixed prices, no drop-off needed, results that speak for themselves.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={onBookNow}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '15px 28px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
              >
                Book Your Detail
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.6)', flexShrink: 0,
                }} />
              </button>
              <a
                href="tel:+447984237149"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px',
                  color: 'rgba(255,255,255,0.32)', textDecoration: 'none',
                  letterSpacing: '0.03em',
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

        {/*
          ── Diagonal orange separator ──
          3px stripe that runs the full height between content and image.
          Sits at the left boundary of the image container.
        */}
        <div style={{
          width: '3px',
          background: '#E84A0C',
          flexShrink: 0,
          alignSelf: 'stretch',
          position: 'relative', zIndex: 3,
        }} />

        {/*
          ── Right: car image with diagonal left edge + stats overlay ──
          clipPath creates the angled left edge that mirrors the reference —
          the image cuts in from top-right to bottom-left at a gentle angle.
          Stats are overlaid at the bottom-right with a gradient dark scrim.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            minHeight: '480px',
            clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=90&fit=crop&crop=center"
            alt="Premium car detailing"
            fill
            priority
            sizes="44vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />

          {/*
            ── Stats overlay — bottom-right of image ──
            Dark gradient scrim rises from the bottom.
            100% / £0 / 2YR in large Bebas, small-caps labels below.
            Matches reference exactly.
          */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            style={{
              position: 'absolute', bottom: 0, right: 0, left: 0,
              background: 'linear-gradient(to top, rgba(12,12,12,0.9) 0%, rgba(12,12,12,0.5) 55%, transparent 100%)',
              padding: 'clamp(36px, 5vw, 64px) clamp(20px, 3vw, 40px) clamp(18px, 2.2vw, 28px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              gap: 'clamp(24px, 4.5vw, 64px)',
            }}
          >
            {STATS.map((s) => (
              <div key={s.val} style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4.5vw, 68px)',
                  letterSpacing: '0.03em',
                  color: '#ffffff', lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  fontSize: 'clamp(7px, 0.85vw, 10px)',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.38)',
                  whiteSpace: 'pre-line', lineHeight: 1.4, marginTop: '5px',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>

      </section>

      {/* ── Ticker strip — warm band bridging dark hero to light sections ── */}
      <div style={{
        background: '#F5F4F1',
        borderBottom: '1px solid rgba(12,12,12,0.07)',
        padding: '11px 0',
        overflow: 'hidden',
      }}>
        <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap', userSelect: 'none' }}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '20px', margin: '0 24px' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 500,
                color: 'rgba(12,12,12,0.38)',
                textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.18em',
              }}>
                {item}
              </span>
              <span style={{
                width: 3, height: 3, borderRadius: '50%',
                background: '#E84A0C', flexShrink: 0, opacity: 0.7,
              }} />
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

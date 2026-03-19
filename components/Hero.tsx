'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const TICKER = [
  'Mobile Service', 'Fixed Pricing', 'Hertfordshire', 'No Drop-Off',
  'Ceramic Coating', 'Book Online', 'We Come To You', 'Professional Grade',
]

const STATS = [
  { val: '100%', label: 'Mobile\nService'   },
  { val: '£0',   label: 'Hidden\nCharges'  },
  { val: '2YR',  label: 'Ceramic\nWarranty'},
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

        {/* ── Left: dark content panel (55%) ── */}
        <div
          style={{
            flex: '0 0 55%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(32px, 4vw, 60px) clamp(24px, 4.5vw, 72px)',
            background: '#0C0C0C',
            position: 'relative',
            zIndex: 2,
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
            Stacked headline — left-aligned, NO staircase indent.
            DETAIL: dominant white. DONE: fades to ~45% white. RIGHT.: ~28% + orange period.
            The opacity drop across the three words creates natural depth and movement
            while keeping clean left-alignment — exactly like the reference.
          */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            style={{ pointerEvents: 'none', lineHeight: 0.88 }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 17.5vw, 268px)',
              letterSpacing: '0.01em',
              color: '#ffffff',
              display: 'block',
            }}>
              DETAIL
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(70px, 15.5vw, 236px)',
              letterSpacing: '0.01em',
              color: 'rgba(255,255,255,0.45)',
              display: 'block',
            }}>
              DONE
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 12.5vw, 190px)',
              letterSpacing: '0.01em',
              color: 'rgba(255,255,255,0.28)',
              display: 'block',
            }}>
              RIGHT<span style={{ color: '#E84A0C' }}>.</span>
            </span>
          </motion.div>

          {/* Bottom: description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.78,
              color: 'rgba(255,255,255,0.38)', maxWidth: '340px', marginBottom: '24px',
            }}>
              Professional mobile detailing straight to your driveway.
              Fixed prices, no drop-off, results that speak for themselves.
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
                {/* Bullet dot — matches reference */}
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
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
          The 3px orange stripe runs full height between the content and image.
          On the image side, a clip-path creates the angled left edge,
          making the orange line appear to "cut" at a diagonal — like the reference.
        */}
        <div
          style={{
            width: '3px',
            background: '#E84A0C',
            flexShrink: 0,
            alignSelf: 'stretch',
            position: 'relative',
            zIndex: 3,
          }}
        />

        {/*
          ── Right: car image with diagonal clip + overlaid stats ──
          clipPath polygon: top-left starts 3% inward (creating the diagonal angle),
          then extends straight to the right edge and bottom-right.
          The image container is flush to the viewport edge.
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
            clipPath: 'polygon(3% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=90&fit=crop&crop=center"
            alt="Premium car detailing"
            fill
            priority
            sizes="45vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />

          {/*
            ── Stats overlay — bottom right of image ──
            3 key facts overlaid on a dark-tinted band.
            Matches the reference: large Bebas numbers, small caps labels.
          */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            style={{
              position: 'absolute',
              bottom: 0, right: 0, left: 0,
              background: 'linear-gradient(to top, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.4) 70%, transparent 100%)',
              padding: 'clamp(32px, 4vw, 56px) clamp(20px, 3vw, 40px) clamp(20px, 2.5vw, 32px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              gap: 'clamp(24px, 4vw, 56px)',
            }}
          >
            {STATS.map((s) => (
              <div key={s.val} style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4.5vw, 68px)',
                  letterSpacing: '0.03em',
                  color: '#fff', lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  fontSize: 'clamp(8px, 0.9vw, 11px)',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.42)',
                  whiteSpace: 'pre-line', lineHeight: 1.4, marginTop: '4px',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>

      </section>

      {/* ── Ticker strip ── */}
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

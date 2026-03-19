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

/*
  DIAGONAL CONSTANTS — shared between the dark panel clip-path and orange stripe.
  Top edge of diagonal: 58% from left.
  Bottom edge of diagonal: 38% from left.
  Both use the same two anchor points so they align perfectly.
*/
const D_TOP = 58   // % from left at the top
const D_BOT = 38   // % from left at the bottom

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── Main hero — diagonal split layout ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 80px)',
          overflow: 'hidden',
          background: '#0C0C0C',
        }}
      >

        {/*
          ── Layer 0: Car image — full section background ──
          Covers the entire hero. The dark panel (layer 1) overlays the left portion.
          objectPosition: shifted right to focus on the car body and remove the person.
          scale: slight zoom for more impact.
        */}
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
              /*
                Shift right to cut out the person (who is center-left in the photo)
                and focus on the car body and rear.
              */
              objectPosition: '72% 55%',
              transform: 'scale(1.12)',
              transformOrigin: 'center center',
            }}
          />
        </motion.div>

        {/*
          ── Layer 1: Dark panel with diagonal right edge ──
          clip-path polygon cuts the right edge at an angle:
          top-right corner at ${D_TOP}%, bottom-right corner at ${D_BOT}%.
          This creates the diagonal line effect seen in the reference.
        */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: '#0C0C0C',
            clipPath: `polygon(0 0, ${D_TOP}% 0, ${D_BOT}% 100%, 0 100%)`,
          }}
        />

        {/*
          ── Layer 2: Orange diagonal stripe ──
          A thin parallelogram sharing the EXACT same edge points as the dark panel.
          calc() lets us offset ±1.5px from the edge to create a 3px-wide stripe.
          No SVG complexity — pure CSS clip-path.
        */}
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

        {/*
          ── Layer 3: Text content — absolutely positioned on dark panel ──
          Width constrained to stay within the dark area (left of the diagonal at all heights).
          Content div is 50% wide — safely within the D_BOT=38% wide bottom of the dark panel
          since the actual text blocks (maxWidth 320px) are narrower than 38% of any viewport.
        */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 3,
            width: '55%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(28px, 3.5vw, 52px) clamp(24px, 4vw, 64px)',
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
            ── Staircase headline — matching the reference ──
            DETAIL: flush left, pure white, dominant
            DONE:   +3vw indent, gray (~44% white)
            RIGHT.: +8vw indent, lighter gray (~30% white), orange period
          */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease }}
            style={{ pointerEvents: 'none' }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 16.5vw, 260px)',
              letterSpacing: '0.01em', color: '#ffffff',
              display: 'block', lineHeight: 0.9,
            }}>
              DETAIL
            </span>
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

        {/*
          ── Layer 4: Stats overlay — bottom-right of image ──
          Dark gradient scrim rises from the bottom.
          Stats sit on top, right-aligned.
        */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          style={{
            position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 4,
            background: 'linear-gradient(to top, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.45) 55%, transparent 100%)',
            padding: 'clamp(40px, 6vw, 80px) clamp(24px, 3.5vw, 52px) clamp(18px, 2.2vw, 28px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            gap: 'clamp(28px, 5vw, 72px)',
            pointerEvents: 'none',
          }}
        >
          {STATS.map((s) => (
            <div key={s.val} style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4.5vw, 68px)',
                letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1,
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

      </section>

      {/* ── Ticker strip — warm band bridging hero to light sections ── */}
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

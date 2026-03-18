'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const TICKER = [
  'Mobile Service', 'Fixed Pricing', 'Hertfordshire', 'No Drop-Off',
  'Ceramic Coating', 'Book Online', 'We Come To You', 'Professional Grade',
]

const QUICK_STATS = [
  { val: '100%',  label: 'Fully Mobile' },
  { val: '£0',    label: 'Hidden Charges' },
  { val: '2 YR',  label: 'Ceramic Warranty' },
  { val: '5★',    label: 'Rated Service' },
]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <div style={{ paddingTop: '68px' }}>

      {/* ── Main hero ── */}
      <section
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: 'calc(100vh - 68px)',
          background: '#fff',
          overflow: 'hidden',
        }}
      >

        {/* ── Left: content ── */}
        <div
          style={{
            flex: '0 0 54%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(36px, 5vw, 72px)',
            paddingLeft: 'clamp(24px, 4.5vw, 72px)',
          }}
        >

          {/* Top label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(12,12,12,0.35)',
            }}
          >
            Mobile Detailing · Hertfordshire, UK
          </motion.p>

          {/* Staircase headline — on white, this is iconic */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            style={{ pointerEvents: 'none' }}
          >
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(80px, 18vw, 260px)',
                letterSpacing: '0.02em',
                color: '#0C0C0C',
                display: 'block',
                lineHeight: 0.86,
              }}>
                DETAIL
              </span>
            </div>
            <div style={{ paddingLeft: 'clamp(20px, 6vw, 88px)' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(58px, 13vw, 192px)',
                letterSpacing: '0.02em',
                color: 'rgba(12,12,12,0.22)',
                display: 'block',
                lineHeight: 0.86,
              }}>
                DONE
              </span>
            </div>
            <div style={{ paddingLeft: 'clamp(40px, 12vw, 176px)' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 9vw, 128px)',
                letterSpacing: '0.02em',
                color: 'rgba(12,12,12,0.14)',
                display: 'block',
                lineHeight: 0.86,
              }}>
                RIGHT<span style={{ color: '#E84A0C' }}>.</span>
              </span>
            </div>
          </motion.div>

          {/* Bottom: description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            {/* Thin top rule */}
            <div style={{
              width: '40px', height: '1px',
              background: '#E84A0C', marginBottom: '20px',
            }} />

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.78,
              color: 'rgba(12,12,12,0.48)', maxWidth: '340px', marginBottom: '28px',
            }}>
              Professional mobile detailing straight to your driveway.
              Fixed prices, no drop-off, results you&apos;ll notice immediately.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={onBookNow}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.09em', textTransform: 'uppercase',
                  background: '#0C0C0C', color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '14px 28px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E84A0C')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0C0C0C')}
              >
                Book Your Detail
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              </button>
              <a
                href="tel:+447984237149"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px',
                  color: 'rgba(12,12,12,0.35)', textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0C0C0C')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(12,12,12,0.35)')}
              >
                07984 237149
              </a>
            </div>
          </motion.div>

        </div>

        {/*
          ── Orange separator ──
          A precise 3px vertical stripe between the content
          and the image. Like a detailing pin stripe on a car.
        */}
        <div style={{ width: '3px', background: '#E84A0C', flexShrink: 0, alignSelf: 'stretch' }} />

        {/*
          ── Right: car image flush to viewport edge ──
          No padding, no border, no overlay. The image is
          a clean window into the work.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '480px' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=90&fit=crop&crop=center"
            alt="Premium car detailing"
            fill
            priority
            sizes="46vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>

      </section>

      {/*
        ── Quick stats strip ──
        4 key facts in a horizontal band immediately below the hero.
        Clean, precise, like an automotive specification plate.
        Dark background creates contrast with the white hero.
      */}
      <div style={{
        background: '#0C0C0C',
        borderTop: '3px solid #E84A0C',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {QUICK_STATS.map((s, i) => (
            <div
              key={s.val}
              style={{
                padding: 'clamp(16px, 2vw, 24px) clamp(20px, 3vw, 40px)',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                letterSpacing: '0.04em', color: '#fff', lineHeight: 1,
                flexShrink: 0,
              }}>
                {s.val}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', lineHeight: 1.3,
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/*
        ── Ticker strip ──
        Moving credential band. White on near-black, deliberate pace.
      */}
      <div style={{
        background: '#F5F4F1',
        borderBottom: '1px solid rgba(12,12,12,0.07)',
        padding: '12px 0',
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

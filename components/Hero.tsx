'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const TICKER = [
  'Mobile Service', 'Fixed Pricing', 'Hertfordshire', 'No Drop-Off',
  'Ceramic Coating', 'Book Online', 'We Come To You', 'Professional Grade',
]

const QUICK_STATS = [
  { val: '100%',  label: 'Fully Mobile'     },
  { val: '£0',    label: 'Hidden Charges'   },
  { val: '2 YR',  label: 'Ceramic Warranty' },
  { val: '5★',    label: 'Rated Service'    },
]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <div style={{ paddingTop: '72px' }}>

      {/* ── Main hero — dark left panel + car image right ── */}
      <section
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: 'calc(100vh - 72px)',
          background: '#0C0C0C',
          overflow: 'hidden',
        }}
      >

        {/* ── Left: dark content panel ── */}
        <div
          style={{
            flex: '0 0 52%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(36px, 5vw, 72px)',
            paddingLeft: 'clamp(24px, 4.5vw, 72px)',
            background: '#0C0C0C',
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
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Mobile Detailing · Hertfordshire, UK
          </motion.p>

          {/*
            Staircase headline on dark.
            DETAIL — full white, dominant.
            DONE — faded white, recedes.
            RIGHT. — even more faded, with orange full-stop as the brand punctuation.
            The staircase mirrors the precision layering of detailing work.
          */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            style={{ pointerEvents: 'none' }}
          >
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(76px, 16vw, 240px)',
                letterSpacing: '0.02em',
                color: '#ffffff',
                display: 'block',
                lineHeight: 0.86,
              }}>
                DETAIL
              </span>
            </div>
            <div style={{ paddingLeft: 'clamp(16px, 5vw, 72px)' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(54px, 11.5vw, 178px)',
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.18)',
                display: 'block',
                lineHeight: 0.86,
              }}>
                DONE
              </span>
            </div>
            <div style={{ paddingLeft: 'clamp(32px, 10vw, 144px)' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 8.5vw, 118px)',
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.10)',
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
            {/* Orange rule — like a pinstripe */}
            <div style={{
              width: '40px', height: '2px',
              background: '#E84A0C', marginBottom: '20px',
            }} />

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.78,
              color: 'rgba(255,255,255,0.38)', maxWidth: '340px', marginBottom: '28px',
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
                  background: '#E84A0C', color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '14px 28px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
              >
                Book Your Detail
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              </button>
              <a
                href="tel:+447984237149"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px',
                  color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                07984 237149
              </a>
            </div>
          </motion.div>

        </div>

        {/*
          ── Orange separator ──
          3px vertical stripe. Automotive pinstripe — precise and intentional.
          On the dark hero, this becomes even more striking.
        */}
        <div style={{ width: '3px', background: '#E84A0C', flexShrink: 0, alignSelf: 'stretch' }} />

        {/*
          ── Right: car image flush to viewport edge ──
          No overlay, no text. A clean window into the craft.
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
            sizes="48vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>

      </section>

      {/*
        ── Quick stats strip ──
        Specification plate. Dark, seamless from the hero.
        3px orange top border anchors the colour.
      */}
      <div style={{
        background: '#111111',
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
                padding: 'clamp(18px, 2.2vw, 28px) clamp(20px, 3vw, 40px)',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
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
                color: 'rgba(255,255,255,0.28)', lineHeight: 1.3,
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/*
        ── Ticker ──
        Warm band — bridges dark hero into the white sections below.
      */}
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

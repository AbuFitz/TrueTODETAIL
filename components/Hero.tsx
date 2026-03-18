'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const TICKER = [
  'Mobile Service', 'Fixed Pricing', 'Hertfordshire', 'No Drop-Off',
  'Ceramic Coating', 'Book Online', 'We Come To You', 'Professional Grade',
]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <div style={{ paddingTop: '64px' }}>

      {/* ── Main hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: 'calc(100vh - 64px)',
          background: '#0A0A0A',
        }}
      >

        {/* Tilted car image — right half of screen */}
        <div
          style={{
            position: 'absolute',
            top: '-8%',
            right: '-3%',
            width: '62%',
            height: '116%',
            borderRadius: '32px 0 0 32px',
            overflow: 'hidden',
            transform: 'rotate(-7deg)',
            transformOrigin: 'right top',
            zIndex: 1,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=90&fit=crop&crop=center"
            alt="Premium car detailing"
            fill
            priority
            style={{ objectFit: 'cover', transform: 'scale(1.12)' }}
          />
          {/* Inner subtle darkening at edges */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,10,10,0.3) 0%, transparent 50%)',
          }} />
        </div>

        {/* Gradient: image bleeds into dark bg on the left */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to right, #0A0A0A 28%, rgba(10,10,10,0.75) 50%, rgba(10,10,10,0.1) 72%, transparent 90%)',
          pointerEvents: 'none',
        }} />

        {/* Gradient: bottom section fades to black */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%', zIndex: 2,
          background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Main content */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: 'clamp(28px, 5vw, 80px)',
            paddingTop: 'clamp(36px, 5vw, 72px)',
            paddingBottom: 'clamp(36px, 5vw, 72px)',
          }}
        >

          {/* Brand label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)', fontWeight: 600,
            }}
          >
            True To Detail — Hertfordshire, UK
          </motion.p>

          {/* Cascading staircase headline */}
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease }}
            style={{ pointerEvents: 'none' }}
          >
            {/* DETAIL — largest, leftmost */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(76px, 21vw, 300px)',
                  letterSpacing: '0.025em',
                  color: 'white',
                  display: 'block',
                  lineHeight: 0.87,
                }}
              >
                DETAIL
              </span>
            </div>
            {/* DONE — medium, step right */}
            <div style={{ paddingLeft: 'clamp(24px, 8vw, 120px)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(56px, 16vw, 224px)',
                  letterSpacing: '0.025em',
                  color: 'rgba(255,255,255,0.82)',
                  display: 'block',
                  lineHeight: 0.87,
                }}
              >
                DONE
              </span>
            </div>
            {/* RIGHT. — smallest, most right, orange full stop */}
            <div style={{ paddingLeft: 'clamp(48px, 16vw, 244px)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(38px, 11vw, 150px)',
                  letterSpacing: '0.025em',
                  color: 'rgba(255,255,255,0.65)',
                  display: 'block',
                  lineHeight: 0.87,
                }}
              >
                RIGHT<span style={{ color: '#E84A0C' }}>.</span>
              </span>
            </div>
          </motion.div>

          {/* Bottom row: description + CTA + mini stats */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
              justifyContent: 'space-between', gap: '28px',
            }}
          >
            {/* Description + CTAs */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.38)', maxWidth: '320px', marginBottom: '22px',
                }}
              >
                Professional mobile detailing straight to your driveway. Fixed prices, no drop-off needed, results that speak for themselves.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={onBookNow}
                  style={{
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: '#E84A0C', color: 'white', border: 'none', cursor: 'pointer',
                    padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
                >
                  Book Your Detail
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                </button>
                <a
                  href="tel:+447984237149"
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    color: 'rgba(255,255,255,0.28)', textDecoration: 'none',
                  }}
                >
                  07984 237149
                </a>
              </div>
            </div>

            {/* Mini stat cluster */}
            <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 40px)', alignItems: 'flex-end' }}>
              {[
                { val: '100%', label: 'mobile\nservice'   },
                { val: '£0',   label: 'hidden\ncharges'   },
                { val: '2YR',  label: 'ceramic\nwarranty' },
              ].map(({ val, label }) => (
                <div key={val} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(26px, 3.2vw, 40px)',
                      letterSpacing: '0.03em', color: 'white', lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600,
                      color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase',
                      letterSpacing: '0.15em', lineHeight: 1.45, marginTop: '4px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Ticker strip ── */}
      <div style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '13px 0',
        overflow: 'hidden',
      }}>
        <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap', userSelect: 'none' }}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '18px', margin: '0 20px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.28)',
                  textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.22em',
                }}
              >
                {item}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,74,12,0.6)', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

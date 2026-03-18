'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const FACTS = [
  {
    n:    '01',
    big:  'Fully\nMobile',
    body: 'We come to your home, office or car park — fully self-sufficient with our own power and water supply.',
  },
  {
    n:    '02',
    big:  'Fixed\nPricing',
    body: 'Your price is locked in before you book. Zero hidden charges, zero surprises on the day.',
  },
  {
    n:    '03',
    big:  'No\nDrop-Off',
    body: 'Keep your day exactly as planned. Your car stays right where it is while we work.',
  },
  {
    n:    '04',
    big:  'Based In\nHerts',
    body: 'Hemel Hempstead and the whole of Hertfordshire — wherever you are, we cover it.',
  },
]

export default function Stats() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        zIndex: 5,
        background: '#F4F0E8',
        clipPath: 'polygon(0 5vw, 100% 0, 100% 100%, 0 100%)',
        marginTop: '-5vw',
        paddingTop: 'clamp(64px, 12vw, 160px)',
        paddingBottom: 'clamp(56px, 8vw, 120px)',
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
          <span style={{ width: 20, height: 1, background: '#E84A0C', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)',
          }}>
            Why True To Detail
          </span>
        </div>

        {/* 2×2 → 4×1 feature grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(28px, 3.5vw, 52px)',
                borderRight: i < 3 ? '1px solid rgba(12,12,12,0.07)' : 'none',
              }}
              className={i < 2 ? 'border-b border-ink/[0.07] lg:border-b-0' : ''}
            >
              {/*
                Water-droplet accent — a tiny orange bead shape in the top-left.
                The water detailing motif carried through the light sections.
                Same border-radius language as the navbar bead indicator.
              */}
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: '5px', height: '7px',
                  background: '#E84A0C',
                  borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                  marginBottom: '18px',
                }}
              />

              {/* Small index label */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.28)',
                marginBottom: '14px',
              }}>
                {f.n}
              </span>

              {/* Bold title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(34px, 4vw, 52px)',
                  letterSpacing: '0.025em',
                  color: '#0A0A0A',
                  lineHeight: 0.9,
                  marginBottom: '18px',
                  whiteSpace: 'pre-line',
                }}
              >
                {f.big}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
                color: 'rgba(12,12,12,0.45)',
              }}>
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

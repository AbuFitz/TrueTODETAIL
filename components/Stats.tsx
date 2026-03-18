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
        background: '#F5F4F1',
        paddingTop:    'clamp(64px, 10vw, 140px)',
        paddingBottom: 'clamp(64px, 10vw, 140px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(48px, 7vw, 96px)' }}>
          <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)',
          }}>
            Why True To Detail
          </span>
        </div>

        {/*
          Specification-strip layout.
          4 columns separated by 1px vertical rules — like a premium car brochure
          specification table. No cards, no backgrounds, no shadows.
          Just type, rules, and white space.
        */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid rgba(12,12,12,0.1)',
            borderBottom: '1px solid rgba(12,12,12,0.1)',
          }}
          className="grid-cols-2 lg:grid-cols-4"
        >
          {FACTS.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
              style={{
                padding: 'clamp(32px, 4vw, 56px) clamp(24px, 3vw, 40px)',
                borderRight: i < 3 ? '1px solid rgba(12,12,12,0.1)' : 'none',
              }}
              className={i < 2 ? 'border-b border-ink/[0.1] lg:border-b-0' : ''}
            >

              {/* Number — small, precise, top-left */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(12,12,12,0.25)',
                marginBottom: '20px',
              }}>
                {f.n}
              </span>

              {/* Big title — the spec entry */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(38px, 4.5vw, 58px)',
                  letterSpacing: '0.025em',
                  color: '#0C0C0C',
                  lineHeight: 0.88,
                  marginBottom: '20px',
                  whiteSpace: 'pre-line',
                }}
              >
                {f.big}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.75,
                color: 'rgba(12,12,12,0.48)',
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

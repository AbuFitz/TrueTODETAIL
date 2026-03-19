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
        /* Reduced height — no big heading above the grid now */
        paddingTop:    'clamp(36px, 5vw, 64px)',
        paddingBottom: 'clamp(36px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/*
          Specification-strip layout — 4 columns with vertical rules.
          No heading label above; the facts speak for themselves.
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
                padding: 'clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px)',
                borderRight: i < 3 ? '1px solid rgba(12,12,12,0.1)' : 'none',
              }}
              className={i < 2 ? 'border-b border-ink/[0.1] lg:border-b-0' : ''}
            >
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(12,12,12,0.25)',
                marginBottom: '14px',
              }}>
                {f.n}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  letterSpacing: '0.025em',
                  color: '#0C0C0C',
                  lineHeight: 0.88,
                  marginBottom: '14px',
                  whiteSpace: 'pre-line',
                }}
              >
                {f.big}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.72,
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

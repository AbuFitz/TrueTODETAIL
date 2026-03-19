'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const STEPS = [
  {
    n:    '01',
    title: 'Book Online',
    body:  'Choose your pack, pick a date and drop your address. Takes under two minutes — we confirm within the hour.',
  },
  {
    n:    '02',
    title: 'We Come To You',
    body:  'Your detailer arrives fully equipped — own power, own water. No prep needed on your end.',
  },
  {
    n:    '03',
    title: 'Spotless Results',
    body:  "We don't leave until the finish meets our standard. Backed by our satisfaction guarantee.",
  },
]

export default function Process() {
  return (
    <section
      id="services"
      style={{
        background: '#F5F4F1',
        paddingTop:    'clamp(36px, 5vw, 64px)',
        paddingBottom: 'clamp(36px, 5vw, 64px)',
        borderTop: '1px solid rgba(12,12,12,0.06)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid rgba(12,12,12,0.1)',
            borderBottom: '1px solid rgba(12,12,12,0.1)',
          }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.09 }}
              style={{
                padding: 'clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px)',
                borderRight: i < 2 ? '1px solid rgba(12,12,12,0.1)' : 'none',
              }}
              className={i < 1 ? 'border-b border-ink/[0.1] md:border-b-0' : ''}
            >
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#E84A0C',
                marginBottom: '14px',
              }}>
                {s.n}
              </span>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3vw, 42px)',
                letterSpacing: '0.025em',
                color: '#0C0C0C',
                lineHeight: 0.9,
                marginBottom: '14px',
              }}>
                {s.title.toUpperCase()}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.72,
                color: 'rgba(12,12,12,0.45)',
              }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const STATS = [
  { value: '100%', label: 'Mobile\nService' },
  { value: '£0',   label: 'Hidden\nCharges' },
  { value: '2YR',  label: 'Ceramic\nWarranty' },
]

export default function Stats() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: 'clamp(340px, 50vw, 600px)',
        background: '#0C0C0C',
      }}
    >
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=80&fit=crop"
        alt="Car detailing"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: '50% 60%' }}
      />

      {/* Dark gradient — heavier at bottom so stats read clearly */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(12,12,12,0.30) 0%, rgba(12,12,12,0.72) 55%, rgba(12,12,12,0.88) 100%)',
        }}
      />

      {/* Stats row — anchored to the bottom */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.value}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease, delay: i * 0.1 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: 'clamp(20px, 3vw, 40px) clamp(12px, 2vw, 32px)',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
              textAlign: 'center',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 10vw, 140px)',
              letterSpacing: '0.01em',
              color: '#ffffff',
              lineHeight: 0.88,
              display: 'block',
            }}>
              {s.value}
            </span>

            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(9px, 1vw, 12px)',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              whiteSpace: 'pre-line',
              marginTop: 'clamp(8px, 1.2vw, 16px)',
              lineHeight: 1.5,
            }}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

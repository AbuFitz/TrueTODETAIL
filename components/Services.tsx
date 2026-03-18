'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const SERVICES = [
  {
    n: '01', title: 'Exterior Detail',
    desc: 'Hand wash, clay bar decon, machine polish and protective sealant — delivered to your door with pro-grade products.',
    price: 'From £89',
    indent: 0,
  },
  {
    n: '02', title: 'Interior Detail',
    desc: 'Steam clean, leather conditioning, carpet shampoo and extraction, and complete interior sanitisation.',
    price: 'From £89',
    indent: 1,
  },
  {
    n: '03', title: 'Paint Correction',
    desc: 'Single or multi-stage machine polishing to remove swirl marks, fine scratches and paint oxidation.',
    price: 'POA',
    indent: 2,
  },
  {
    n: '04', title: 'Ceramic Coating',
    desc: 'Bond-level paint protection delivering up to 2 years of hydrophobic, scratch-resistant gloss.',
    price: 'From £549',
    indent: 1,
  },
]

export default function Services() {
  return (
    <section
      id="services"
      style={{
        background: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(64px, 9vw, 130px)',
        paddingBottom: 'clamp(64px, 9vw, 130px)',
      }}
    >
      {/* Large ghost text in background */}
      <span
        aria-hidden
        style={{
          position: 'absolute', right: '-4vw', top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(80px, 15vw, 200px)',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.025)',
          whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        SERVICES
      </span>

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Two-col: image left (organic shape), content right */}
        <div className="grid grid-cols-1 lg:grid-cols-[44%_1fr] gap-12 lg:gap-16 items-start">

          {/* Left — sticky headline + half-pill image */}
          <div className="lg:sticky lg:top-24">

            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span style={{ width: 20, height: 1, background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
              }}>
                What We Do
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(52px, 8vw, 108px)',
                letterSpacing: '0.025em',
                color: 'white', lineHeight: 0.88, marginBottom: '36px',
              }}
            >
              EVERY<br />SERVICE<br />COVERED.
            </motion.h2>

            {/* Half-pill image — flat left, curved right, extends off left edge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
              style={{
                position: 'relative',
                /* Extends 24px beyond the column's left edge */
                marginLeft: 'clamp(-24px, -3vw, -40px)',
                height: 'clamp(280px, 32vw, 460px)',
                /* Half-pill: flat left, curved right */
                borderRadius: '0 clamp(80px, 12vw, 180px) clamp(80px, 12vw, 180px) 0',
                overflow: 'hidden',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1000&q=90&fit=crop&crop=center"
                alt="Professional detailing work"
                fill
                sizes="(max-width: 1024px) 100vw, 44vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {/* Subtle dark overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(10,10,10,0.2) 0%, transparent 60%)',
              }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.7,
                color: 'rgba(255,255,255,0.3)', marginTop: '20px', maxWidth: '280px',
              }}
            >
              All services are fully mobile. Covering Hemel Hempstead and the whole of Hertfordshire.
            </motion.p>

          </div>

          {/* Right — staggered service rows */}
          <div>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                style={{
                  position: 'relative',
                  paddingLeft: `${s.indent * 32}px`,
                }}
                className="group"
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '20px',
                    padding: 'clamp(22px, 2.5vw, 36px) 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                  className="first:border-t first:border-t-white/[0.06]"
                >
                  {/* Ghost large number behind */}
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      right: 0, top: '50%', transform: 'translateY(-50%)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(60px, 10vw, 130px)',
                      letterSpacing: '0.04em',
                      color: 'rgba(255,255,255,0.03)',
                      userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
                    }}
                  >
                    {s.n}
                  </span>

                  {/* Small number label */}
                  <span style={{
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                    letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)',
                    paddingTop: '6px', flexShrink: 0, width: '24px',
                  }}>
                    {s.n}
                  </span>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '10px' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(28px, 3.5vw, 44px)',
                          letterSpacing: '0.025em',
                          color: 'white', lineHeight: 0.9,
                          transition: 'color 0.2s',
                        }}
                        className="group-hover:text-orange"
                      >
                        {s.title}
                      </h3>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                        letterSpacing: '0.06em', color: 'rgba(255,255,255,0.28)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 10px', flexShrink: 0, marginTop: '4px',
                      }}>
                        {s.price}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
                      color: 'rgba(255,255,255,0.38)',
                    }}>
                      {s.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    style={{
                      flexShrink: 0, width: '32px', height: '32px', marginTop: '4px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', color: 'rgba(255,255,255,0.2)',
                      transition: 'all 0.2s',
                    }}
                    className="group-hover:bg-orange group-hover:border-orange group-hover:text-white"
                  >
                    →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

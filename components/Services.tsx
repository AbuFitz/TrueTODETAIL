'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const SERVICES = [
  {
    n: '01', title: 'Exterior Detail',
    desc: 'Hand wash, clay bar decon, machine polish and protective sealant — professional grade products, delivered to your door.',
    price: 'From £89',
  },
  {
    n: '02', title: 'Interior Detail',
    desc: 'Steam clean, leather conditioning, carpet shampoo and extraction. Complete interior sanitisation.',
    price: 'From £89',
  },
  {
    n: '03', title: 'Paint Correction',
    desc: 'Single or multi-stage machine polishing to eliminate swirl marks, fine scratches and paint oxidation.',
    price: 'POA',
  },
  {
    n: '04', title: 'Ceramic Coating',
    desc: 'Bond-level protection delivering up to 2 years of hydrophobic, scratch-resistant gloss. With certificate.',
    price: 'From £549',
  },
]

export default function Services() {
  return (
    <section
      id="services"
      style={{
        background: '#F5F4F1',
        paddingTop: 'clamp(64px, 9vw, 130px)',
        paddingBottom: 'clamp(64px, 9vw, 130px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/* Section header */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: '24px',
          marginBottom: 'clamp(40px, 5vw, 64px)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)',
              }}>
                What We Do
              </span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(52px, 7.5vw, 104px)',
                letterSpacing: '0.025em',
                color: '#0C0C0C', lineHeight: 0.88,
              }}
            >
              EVERY<br />SERVICE<br />COVERED.
            </motion.h2>
          </div>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.75,
            color: 'rgba(12,12,12,0.45)', maxWidth: '280px',
          }}>
            Fully mobile. We bring everything needed to your door — power, water, equipment.
            Covering all of Hertfordshire.
          </p>
        </div>

        {/*
          Full-width image strip.
          No overlay, no text on top. Just the work — clean and honest.
          Like turning the page in a catalog and seeing a full-bleed photograph.
        */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          style={{
            position: 'relative',
            height: 'clamp(200px, 22vw, 360px)',
            overflow: 'hidden',
            marginBottom: 'clamp(48px, 6vw, 80px)',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1600&q=90&fit=crop&crop=center"
            alt="Professional exterior car detailing and paint correction service near Hemel Hempstead, Hertfordshire"
            fill
            sizes="(max-width: 1400px) 100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </motion.div>

        {/*
          Service catalog rows.
          Like a premium restaurant menu or luxury fashion catalog.
          Each service gets a full-width row, clear hierarchy,
          clean rules separating them.
        */}
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, ease, delay: i * 0.06 }}
            className="group"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto auto',
                gap: '0 clamp(16px, 2.5vw, 36px)',
                alignItems: 'center',
                padding: 'clamp(20px, 2.5vw, 32px) 0',
                borderTop: '1px solid rgba(12,12,12,0.08)',
                borderBottom: i === SERVICES.length - 1 ? '1px solid rgba(12,12,12,0.08)' : 'none',
                cursor: 'default',
              }}
            >
              {/* Number */}
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                letterSpacing: '0.22em', color: 'rgba(12,12,12,0.25)',
                paddingTop: '3px', alignSelf: 'start',
              }}>
                {s.n}
              </span>

              {/* Title + description */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(26px, 3.2vw, 44px)',
                    letterSpacing: '0.025em',
                    color: '#0C0C0C', lineHeight: 0.9,
                    marginBottom: '8px',
                    transition: 'color 0.2s',
                  }}
                  className="group-hover:text-orange"
                >
                  {s.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.68,
                  color: 'rgba(12,12,12,0.45)', maxWidth: '520px',
                }}>
                  {s.desc}
                </p>
              </div>

              {/* Price badge */}
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.06em',
                color: 'rgba(12,12,12,0.32)',
                border: '1px solid rgba(12,12,12,0.1)',
                padding: '5px 12px', flexShrink: 0, alignSelf: 'start',
              }}>
                {s.price}
              </span>

              {/* Arrow */}
              <div
                style={{
                  flexShrink: 0, width: '36px', height: '36px',
                  border: '1px solid rgba(12,12,12,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', color: 'rgba(12,12,12,0.22)',
                  transition: 'all 0.2s', alignSelf: 'start',
                }}
                className="group-hover:bg-ink group-hover:border-ink group-hover:text-white"
              >
                →
              </div>
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  )
}

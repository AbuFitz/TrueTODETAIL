'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const REVIEWS = [
  {
    text: "The Premium package completely transformed my 3-year-old Audi. The paint correction brought back a gloss I thought was gone for good. Booked on a Tuesday, they were with me Wednesday morning. Worth every penny.",
    name: 'James H.',
    vehicle: 'Audi A4 — Premium Package',
  },
  {
    text: "Booked online, they showed up on time, did the work right on my driveway, and left it looking genuinely showroom fresh. No faff, no hidden costs, no surprise charges. First-class from start to finish.",
    name: 'Sarah M.',
    vehicle: 'VW Golf — Deep Clean',
  },
  {
    text: "Had the Elite Ceramic done on my BMW and the hydrophobic effect is seriously impressive. Two months on and it still beads water perfectly. The finish is something else.",
    name: 'Michael T.',
    vehicle: 'BMW 3 Series — Elite Ceramic',
  },
]

export default function Testimonials() {
  return (
    <section
      style={{
        background: '#F4F0E8',
        paddingTop: 'clamp(64px, 10vw, 130px)',
        paddingBottom: 'clamp(64px, 10vw, 130px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <span style={{ width: 20, height: 1, background: '#E84A0C', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)',
          }}>
            What Clients Say
          </span>
        </div>

        {/* Review grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1px', background: 'rgba(12,12,12,0.08)' }}>
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.09 }}
              style={{
                background: '#F4F0E8',
                padding: 'clamp(28px, 3vw, 44px)',
                display: 'flex', flexDirection: 'column', gap: '24px',
              }}
            >
              {/* Rating — 5 water-bead dots */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {Array.from({ length: 5 }).map((_, d) => (
                  <span
                    key={d}
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: '5px', height: '7px',
                      background: '#E84A0C',
                      borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                    }}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.78,
                color: 'rgba(12,12,12,0.65)',
                flex: 1,
              }}>
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '18px' }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
                  color: '#0A0A0A', letterSpacing: '0.02em',
                }}>
                  {r.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px',
                  color: 'rgba(12,12,12,0.38)', marginTop: '2px',
                  letterSpacing: '0.02em',
                }}>
                  {r.vehicle}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const REVIEWS = [
  {
    text: "The Premium package completely transformed my 3-year-old Audi. Paint correction brought back a gloss I genuinely thought was gone. They showed up on time, did the job on my driveway, and left it looking showroom fresh. Worth every penny.",
    name: 'James H.',
    vehicle: 'Audi A4 — Premium Package',
  },
  {
    text: "Booked online Tuesday, they were there Wednesday morning. No faff, no hidden costs, no surprise charges. My Golf hasn't looked this good since I bought it. First-class from start to finish — I'll be booking every few months.",
    name: 'Sarah M.',
    vehicle: 'VW Golf — Deep Clean',
  },
  {
    text: "Had the Elite Ceramic coating done on my 3 Series and the hydrophobic effect is seriously impressive. Two months on and it still beads water perfectly. The finish is something else. Genuinely great service.",
    name: 'Michael T.',
    vehicle: 'BMW 3 Series — Elite Ceramic',
  },
]

export default function Testimonials() {
  return (
    <section
      id="reviews"
      style={{
        background: '#fff',
        paddingTop:    'clamp(64px, 10vw, 140px)',
        paddingBottom: 'clamp(64px, 10vw, 140px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/* Header: label + big display headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)',
            }}>
              What Clients Say
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 7.5vw, 104px)',
              letterSpacing: '0.025em',
              color: '#0C0C0C', lineHeight: 0.88,
            }}>
              TRUSTED<br />RESULTS<span style={{ color: '#E84A0C' }}>.</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.75,
              color: 'rgba(12,12,12,0.42)', maxWidth: '260px',
            }}>
              100% mobile. Every review earned on a customer&apos;s driveway. No studio, no tricks.
            </p>
          </div>
        </motion.div>

        {/*
          3 review cards using the 1px gap border trick.
          Background bleeds through the gaps to create seamless hairline borders.
        */}
        <div
          style={{
            display: 'grid',
            gap: '1px',
            background: 'rgba(12,12,12,0.08)',
          }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.09 }}
              style={{
                background: '#fff',
                padding: 'clamp(28px, 3vw, 44px)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* 5 water-bead rating dots */}
              <div style={{ display: 'flex', gap: '5px', marginBottom: '24px' }}>
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

              {/* Quote */}
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.78,
                color: 'rgba(12,12,12,0.6)',
                flex: 1,
                marginBottom: '28px',
              }}>
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ borderTop: '1px solid rgba(12,12,12,0.07)', paddingTop: '18px' }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px',
                  color: '#0C0C0C',
                }}>
                  {r.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px',
                  color: 'rgba(12,12,12,0.35)', marginTop: '3px',
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

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const POINTS = [
  {
    n: '01', title: 'Precision Every Time',
    body: "We won't start a job we can't finish properly. Every detail is carried out to a standard we're proud to put our name on.",
  },
  {
    n: '02', title: 'We Come To You',
    body: 'Fully mobile and self-sufficient. You keep your routine — we show up wherever suits you.',
  },
  {
    n: '03', title: 'Transparent Pricing',
    body: 'Your price is locked in before you book. No surprises, no upsells, no extra charges on the day.',
  },
  {
    n: '04', title: 'We Stand Behind Our Work',
    body: "If you're not completely happy, we'll make it right. No awkward conversations — that's simply how we operate.",
  },
]

export default function HowItWorks({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      style={{
        position: 'relative',
        background: '#0A0A0A',
        clipPath: 'polygon(0 5vw, 100% 0, 100% calc(100% - 5vw), 0 100%)',
        marginTop: '-5vw',
        paddingTop: 'clamp(80px, 14vw, 180px)',
        paddingBottom: 'clamp(80px, 14vw, 180px)',
        zIndex: 3,
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — headline + clean image (no rotation, no polaroid tricks) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span style={{ width: 20, height: 1, background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              }}>
                Why Choose Us
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 8vw, 108px)',
              letterSpacing: '0.025em',
              color: 'white', lineHeight: 0.88, marginBottom: '36px',
            }}>
              MEET<br />TRUE TO<br />DETAIL.
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.75,
              color: 'rgba(255,255,255,0.38)', marginBottom: '36px', maxWidth: '340px',
            }}>
              We built this business on doing the job properly — not on cutting corners or chasing volume.
            </p>

            {/*
              Clean two-image grid — no rotation, no polaroid, no shadow theatre.
              Just the work. Let it speak.
              Left image: tall. Right image: shorter, offset from top.
              Sharp corners. No overlays.
            */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto',
              gap: '4px',
              height: 'clamp(300px, 36vw, 500px)',
            }}>
              {/* Left image — taller */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&fit=crop&crop=center"
                  alt="Detailing process"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              {/* Right image — top-aligned, leaves gap at bottom */}
              <div style={{
                display: 'grid',
                gridTemplateRows: '1fr 36px',
              }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&q=90&fit=crop&crop=center"
                    alt="Professional detailer at work"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {/* Orange accent block at bottom-right — a water-bead reference in architectural form */}
                <div style={{ background: '#E84A0C' }} />
              </div>
            </div>

          </motion.div>

          {/* Right — numbered benefit points + CTAs */}
          <div>
            {POINTS.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '20px',
                  padding: 'clamp(20px, 2.5vw, 32px) 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
                className="first:border-t first:border-t-white/[0.06] group cursor-default"
              >
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                  letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)',
                  paddingTop: '5px', width: '24px', flexShrink: 0,
                }}>
                  {p.n}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px',
                      color: 'white', marginBottom: '8px',
                      transition: 'color 0.2s',
                    }}
                    className="group-hover:text-orange"
                  >
                    {p.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
                    color: 'rgba(255,255,255,0.38)',
                  }}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.28 }}
              style={{ display: 'flex', gap: '12px', paddingTop: '32px', flexWrap: 'wrap' }}
            >
              <button
                onClick={onBookNow}
                style={{
                  flex: '1 1 auto', minWidth: '160px',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: '#E84A0C', color: 'white', border: 'none', cursor: 'pointer',
                  padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
              >
                Book Your Pack
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              </button>
              <a
                href="tel:+447984237149"
                style={{
                  flex: '1 1 auto', minWidth: '140px',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                  padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                }}
              >
                07984 237149
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

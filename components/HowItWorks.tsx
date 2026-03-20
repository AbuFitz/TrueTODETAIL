'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const POINTS = [
  {
    n: '01', title: 'Precision Every Time',
    body: "We won't start a job we can't finish to a standard we're proud of. Every single vehicle gets our full attention.",
  },
  {
    n: '02', title: 'We Come To You',
    body: 'Fully mobile and completely self-sufficient. You keep your day — we show up wherever suits you.',
  },
  {
    n: '03', title: 'Transparent Pricing',
    body: 'Your price is locked in before we book. No surprises, no upsells, no extras on the day. What you see is what you pay.',
  },
  {
    n: '04', title: 'We Stand Behind Our Work',
    body: "If you're not happy, we'll make it right. No awkward conversations — that's how this business runs.",
  },
]

export default function HowItWorks({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      id="howitworks"
      style={{
        /*
          Dark section — alternates with light sections above and below.
        */
        background: '#0C0C0C',
        paddingTop:    'clamp(64px, 10vw, 140px)',
        paddingBottom: 'clamp(64px, 10vw, 140px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: headline + image grid ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              }}>
                Why Choose Us
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 7.5vw, 104px)',
              letterSpacing: '0.025em',
              color: '#ffffff', lineHeight: 0.88, marginBottom: '28px',
            }}>
              MEET<br />TRUE TO<br /><span style={{ color: '#E84A0C' }}>DETAIL.</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.78,
              color: 'rgba(255,255,255,0.35)', marginBottom: '36px', maxWidth: '360px',
            }}>
              We built this business on doing the job properly — not on cutting corners or chasing volume. Every car gets the same standard.
            </p>

            {/*
              Two-image composition on dark background.
              Left: tall shot of the process.
              Right: slightly shorter result shot + orange accent block.
              The orange accent is the brand signature at the bottom right.
            */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px',
              height: 'clamp(280px, 32vw, 460px)',
            }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&fit=crop&crop=center"
                  alt="Mobile car detailing process — professional car cleaning service near Hemel Hempstead"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateRows: '1fr 28px',
                gap: '4px',
              }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=88&fit=crop&crop=center"
                    alt="Professional car detailer at work — True To Detail mobile valeting service Hertfordshire"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {/* Orange accent block — brand signature */}
                <div style={{ background: '#E84A0C' }} />
              </div>
            </div>

          </motion.div>

          {/* ── Right: 4 points + CTAs ── */}
          <div>
            {POINTS.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr',
                  gap: '0 18px',
                  padding: 'clamp(20px, 2.5vw, 30px) 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
                className="first:border-t first:border-t-[rgba(255,255,255,0.06)] group cursor-default"
              >
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                  letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)',
                  paddingTop: '4px',
                }}>
                  {p.n}
                </span>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '16px',
                    color: '#ffffff', marginBottom: '8px',
                    transition: 'color 0.2s',
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72,
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.28 }}
              style={{ display: 'flex', gap: '10px', paddingTop: '28px', flexWrap: 'wrap' }}
            >
              <button
                onClick={onBookNow}
                style={{
                  flex: '1 1 auto', minWidth: '160px',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.09em', textTransform: 'uppercase',
                  background: '#E84A0C', color: 'white', border: 'none', cursor: 'pointer',
                  padding: '15px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
              >
                Book Your Detail
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
              </button>
              <a
                href="tel:+447984237149"
                style={{
                  flex: '1 1 auto', minWidth: '140px',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                  padding: '15px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
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

'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        background: '#0A0A0A',
        overflow: 'hidden',
        paddingTop: 'clamp(72px, 12vw, 160px)',
        paddingBottom: 'clamp(72px, 10vw, 130px)',
        zIndex: 2,
        clipPath: 'polygon(0 5vw, 100% 0, 100% 100%, 0 100%)',
        marginTop: '-5vw',
      }}
    >
      {/*
        No radial glow. No gradient.
        Instead: a thin horizontal rule across the top of the section content
        and a thin vertical orange rule on the left edge — precision accents only.
      */}

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(24px, 4vw, 48px)' }}
        >
          <span style={{ width: 20, height: 1, background: '#E84A0C', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
          }}>
            Ready To Book
          </span>
        </motion.div>

        {/* Wall-to-wall headline */}
        <div style={{ overflow: 'hidden', marginBottom: 'clamp(8px, 1.5vw, 20px)' }}>
          <motion.div
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 30vw, 440px)',
              letterSpacing: '-0.01em',
              color: 'white',
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
            }}>
              BOOK
            </div>
          </motion.div>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          <motion.div
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.08 }}
          >
            {/*
              "NOW" is orange — full weight, full colour.
              The contrast between white BOOK and orange NOW creates
              maximum impact without any gradient or glow.
            */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 30vw, 440px)',
              letterSpacing: '-0.01em',
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
              color: '#E84A0C',
            }}>
              NOW.
            </div>
          </motion.div>
        </div>

        {/* Bottom row: tagline + CTAs + contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.2 }}
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: '32px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 'clamp(24px, 3.5vw, 44px)',
          }}
        >
          {/* Tagline */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.75,
            color: 'rgba(255,255,255,0.35)', maxWidth: '320px',
          }}>
            Book online in minutes. Pick your date, we&apos;ll be there.
            No drop-off, no waiting. Just results.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '240px' }}>
            <button
              onClick={onBookNow}
              style={{
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
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.42)', textDecoration: 'none',
                padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.42)'
              }}
            >
              Call 07984 237149
            </a>
          </div>

          {/* Contact info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
            {[
              ['Area',  'Hertfordshire & surrounds'],
              ['Hours', 'Mon–Sat, 8am–7pm'],
              ['Phone', '07984 237149'],
              ['Email', 'hello@truetodetail.co.uk'],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.2)', marginBottom: '4px',
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  color: 'rgba(255,255,255,0.42)',
                }}>
                  {val}
                </p>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}

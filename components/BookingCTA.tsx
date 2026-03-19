'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      id="contact"
      style={{
        background: '#0C0C0C',
        borderTop: '3px solid #E84A0C',
        paddingTop: 'clamp(64px, 10vw, 130px)',
        paddingBottom: 'clamp(64px, 10vw, 130px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(40px, 6vw, 72px)' }}
        >
          <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
          }}>
            Get Booked In
          </span>
        </motion.div>

        {/*
          2-column layout.
          Left: big bold headline + description + CTAs.
          Right: 3 contact information tiles stacked.
          Symmetric, balanced, action-focused.
        */}
        <div
          style={{
            display: 'grid',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'start',
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >

          {/* ── Left: headline + CTAs ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 10vw, 160px)',
              letterSpacing: '0.02em',
              lineHeight: 0.86,
              color: '#ffffff',
              marginBottom: 'clamp(24px, 3vw, 40px)',
            }}>
              BOOK<br />YOUR<br />
              <span style={{ color: '#E84A0C' }}>DETAIL.</span>
            </h2>

            {/* Thin orange rule */}
            <div style={{ width: '40px', height: '2px', background: '#E84A0C', marginBottom: '20px' }} />

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.78,
              color: 'rgba(255,255,255,0.38)', maxWidth: '340px',
              marginBottom: 'clamp(28px, 4vw, 44px)',
            }}>
              Mobile. Professional. Fixed prices. We come to your door — no drop-off, no waiting around, just results.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px' }}>
              <button
                onClick={onBookNow}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: '#E84A0C', color: 'white', border: 'none', cursor: 'pointer',
                  padding: '17px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
                onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
              >
                Book Your Detail
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              </button>
              <a
                href="tel:+447984237149"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                  padding: '17px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                }}
              >
                Call 07984 237149
              </a>
            </div>
          </motion.div>

          {/* ── Right: 3 stacked contact info tiles ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.06)' }}
          >
            {[
              {
                label: 'Coverage Area',
                value: 'Hertfordshire & surrounds',
                detail: 'Hemel Hempstead, Watford, St Albans, and beyond.',
              },
              {
                label: 'Working Hours',
                value: 'Mon–Sat, 8am–7pm',
                detail: 'Book online any time. We confirm within 2 hours.',
              },
              {
                label: 'Get In Touch',
                value: 'hello@truetodetail.co.uk',
                detail: '07984 237149 — calls and WhatsApp welcome.',
              },
            ].map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.08 }}
                style={{
                  background: '#161616',
                  padding: 'clamp(24px, 2.8vw, 36px)',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.22)', marginBottom: '10px',
                }}>
                  {tile.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.2vw, 28px)',
                  letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1,
                  marginBottom: '10px',
                }}>
                  {tile.value}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.28)',
                }}>
                  {tile.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/*
          Bottom strip — 4 quick facts to reinforce trust.
          Horizontal rule above, then 4 items with orange dot separators.
        */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease, delay: 0.3 }}
          style={{
            marginTop: 'clamp(48px, 7vw, 96px)',
            paddingTop: 'clamp(24px, 3vw, 36px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexWrap: 'wrap', gap: '20px 0',
            alignItems: 'center',
          }}
        >
          {[
            'Confirmed within 1 hour',
            ' Payment on the day',
            ' Mon–Sat, 8am–7pm',
          ].map((fact, i) => (
            <div key={fact} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
              }}>
                {fact}
              </span>
              {i < 2 && (
                <span style={{
                  display: 'inline-block', width: '4px', height: '6px',
                  background: '#E84A0C', flexShrink: 0,
                  borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                  opacity: 0.7,
                }} />
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Metadata } from 'next'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const VAN_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Van Clean',
    price: 'From £70',
    duration: '1–2 hrs',
    tagline: 'Clean cab, clean image',
    includes: [
      'Exterior wash & dry',
      'Cab vacuum',
      'Dashboard & console wipe',
      'Glass cleaned',
      'Tyre dressing',
    ],
  },
  {
    id: 'full',
    name: 'Full Van Valet',
    price: 'From £140',
    duration: '3–4 hrs',
    tagline: 'The complete reset',
    featured: true,
    includes: [
      'Everything in Basic',
      'Deep cab clean',
      'Seat shampoo',
      'Full interior wipe-down',
      'Door shuts cleaned',
      'Odour treatment',
      'Spray wax protection',
    ],
  },
  {
    id: 'heavy',
    name: 'Heavy Duty Clean',
    price: 'From £200',
    duration: '5–6 hrs',
    tagline: 'Full interior reset',
    includes: [
      'Everything in Full Valet',
      'Full interior extraction',
      'Stain removal treatment',
      'Deep odour elimination',
      'Load area clean',
      'Final price on condition',
    ],
  },
]

const FLEET_BENEFITS = [
  { label: 'Priority scheduling', desc: 'Your vehicles jump the queue — every time.' },
  { label: 'Consistent results', desc: 'Same standard across every vehicle in your fleet.' },
  { label: 'Custom pricing', desc: 'Tailored rates based on frequency and fleet size.' },
  { label: 'Flexible plans', desc: 'Weekly, bi-weekly or monthly — you decide.' },
]

export default function VanFleetPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', business: '', phone: '', fleet: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate submission — wire up to /api/booking or contact endpoint
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setSubmitting(false)
  }

  const fieldLabel: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.3)', marginBottom: '10px',
  }

  const textInput: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    fontFamily: 'var(--font-body)', fontSize: '14px', color: '#ffffff',
    outline: 'none', background: 'rgba(255,255,255,0.05)',
    boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
  }

  return (
    <div style={{ background: '#0C0C0C', minHeight: '100vh' }}>

      {/* ── Sticky nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: '72px', background: '#0C0C0C',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: '1400px', margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 64px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Back link — hidden on small screens to prevent overflow */}
            <a
              href="/"
              className="hidden sm:flex"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
                alignItems: 'center', gap: '6px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            >
              ← Back
            </a>
            <span className="hidden sm:block" style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 4vw, 22px)',
                letterSpacing: '0.06em', color: '#ffffff', lineHeight: 1,
              }}>
                TRUE TO
              </span>
              <span style={{
                display: 'inline-block', width: 'clamp(4px, 1vw, 5px)', height: 'clamp(6px, 1.5vw, 8px)',
                background: '#E84A0C',
                borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
                flexShrink: 0, marginBottom: '-1px',
              }} />
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 4vw, 22px)',
                letterSpacing: '0.06em', color: '#ffffff', lineHeight: 1,
              }}>
                DETAIL
              </span>
            </a>
          </div>

          <a
            href="#enquire"
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'clamp(10px, 2vw, 11px)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#E84A0C', color: '#fff', textDecoration: 'none',
              padding: 'clamp(9px, 2vw, 11px) clamp(14px, 3vw, 22px)', display: 'inline-block',
              transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
          >
            Get a Quote
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        paddingTop: 'clamp(40px, 8vw, 160px)',
        paddingBottom: 'clamp(40px, 8vw, 120px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ width: 24, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
              }}>
                Commercial & Fleet Services
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 10vw, 148px)',
              letterSpacing: '0.025em', color: '#ffffff',
              lineHeight: 0.86, marginBottom: '36px',
            }}>
              VANS.<br />
              FLEETS.<br />
              <span style={{ color: '#E84A0C' }}>DONE RIGHT.</span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.8vw, 17px)',
              lineHeight: 1.72, color: 'rgba(255,255,255,0.38)',
              maxWidth: '520px', marginBottom: 'clamp(28px, 4vw, 40px)',
            }}>
              Designed for working vehicles, fleets and business owners who need reliable,
              consistent cleaning — without the hassle of booking one car at a time.
            </p>

            {/* Stats — 3-col grid so they never wrap awkwardly on mobile */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {[['3', 'Van Packages'], ['10%+', 'Fleet Discount'], ['Same Day', 'Priority Slots']].map(([val, lab]) => (
                <div key={lab} style={{
                  background: '#141414',
                  padding: 'clamp(14px, 2.5vw, 20px) clamp(12px, 2vw, 20px)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 44px)',
                    letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1,
                  }}>
                    {val}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(8px, 1.5vw, 11px)', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)', marginTop: '5px', lineHeight: 1.3,
                  }}>
                    {lab}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Van Packages ── */}
      <section style={{
        paddingTop: 'clamp(48px, 8vw, 120px)',
        paddingBottom: 'clamp(48px, 8vw, 120px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            style={{ marginBottom: 'clamp(40px, 6vw, 72px)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              }}>
                Van Services
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 96px)',
              letterSpacing: '0.025em', color: '#ffffff', lineHeight: 0.88,
            }}>
              THREE LEVELS.<br />
              ONE STANDARD.
            </h2>
          </motion.div>

          {/* Van package cards */}
          <div
            style={{
              display: 'grid',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRight: 'none', borderBottom: 'none',
            }}
            className="grid-cols-1 md:grid-cols-3"
          >
            {VAN_PACKAGES.map((pkg, i) => {
              const feat = !!pkg.featured
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                  style={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'column',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    background: feat ? '#ffffff' : '#141414',
                    marginTop: feat ? '-1px' : 0,
                    zIndex: feat ? 2 : 1,
                  }}
                >
                  {feat && <div style={{ height: '3px', background: '#E84A0C', flexShrink: 0 }} />}

                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    padding: 'clamp(28px, 3vw, 44px)',
                  }}>

                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '24px',
                    }}>
                      {feat ? (
                        <span style={{
                          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                          letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E84A0C',
                        }}>
                          Most Popular
                        </span>
                      ) : <span />}
                      <span style={{
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: feat ? 'rgba(12,12,12,0.35)' : 'rgba(255,255,255,0.25)',
                        border: `1px solid ${feat ? 'rgba(12,12,12,0.12)' : 'rgba(255,255,255,0.1)'}`,
                        padding: '3px 8px',
                      }}>
                        {pkg.duration}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(28px, 3vw, 40px)',
                      letterSpacing: '0.03em',
                      color: feat ? '#0C0C0C' : '#ffffff',
                      lineHeight: 0.92, marginBottom: '4px',
                    }}>
                      {pkg.name}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '13px',
                      color: feat ? 'rgba(12,12,12,0.42)' : 'rgba(255,255,255,0.32)',
                      marginBottom: '24px',
                    }}>
                      {pkg.tagline}
                    </p>

                    <div style={{ marginBottom: '28px' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(48px, 5vw, 68px)',
                        letterSpacing: '0.01em', lineHeight: 1,
                        color: feat ? '#0C0C0C' : '#ffffff',
                      }}>
                        {pkg.price}
                      </span>
                    </div>

                    <div style={{
                      height: '1px',
                      background: feat ? 'rgba(12,12,12,0.08)' : 'rgba(255,255,255,0.07)',
                      marginBottom: '24px',
                    }} />

                    <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                      {pkg.includes.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{
                            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                            color: feat ? '#E84A0C' : 'rgba(255,255,255,0.2)',
                            flexShrink: 0, marginTop: '2px',
                          }}>
                            {feat ? '→' : '–'}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.5,
                            color: feat ? 'rgba(12,12,12,0.55)' : 'rgba(255,255,255,0.4)',
                          }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#enquire"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '15px 20px', textDecoration: 'none',
                        background: feat ? '#E84A0C' : 'rgba(255,255,255,0.08)',
                        color: feat ? 'white' : 'rgba(255,255,255,0.7)',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = feat ? '#C53D08' : '#E84A0C'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = feat ? '#E84A0C' : 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = feat ? 'white' : 'rgba(255,255,255,0.7)'
                      }}
                    >
                      Enquire About This
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                    </a>

                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Van note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: '18px',
              fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.7,
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Note:</span>{' '}
            Van pricing is based on standard working vans. Heavily soiled or commercial-use interiors may require a custom quote — we&apos;ll always confirm before we start.
          </motion.p>

        </div>
      </section>

      {/* ── Fleet Plans ── */}
      <section style={{
        paddingTop: 'clamp(48px, 8vw, 120px)',
        paddingBottom: 'clamp(48px, 8vw, 120px)',
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

          <div
            style={{
              display: 'grid', gap: 'clamp(48px, 8vw, 100px)',
              alignItems: 'start',
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                }}>
                  Fleet Plans
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 6vw, 88px)',
                letterSpacing: '0.025em', color: '#ffffff', lineHeight: 0.88,
                marginBottom: '28px',
              }}>
                MORE VEHICLES.<br />
                BETTER <span style={{ color: '#E84A0C' }}>RATES.</span>
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.75,
                color: 'rgba(255,255,255,0.38)', marginBottom: '36px', maxWidth: '440px',
              }}>
                Running 3 or more vehicles? We&apos;ll build a plan around your schedule and fleet size —
                with discounted rates, priority slots and one point of contact.
              </p>

              {/* Discount tiers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '36px' }}>
                {[
                  { tier: '3–4 vehicles', discount: '10% off', col: 'rgba(255,255,255,0.5)' },
                  { tier: '5–9 vehicles', discount: '15% off', col: 'rgba(255,255,255,0.75)' },
                  { tier: '10+ vehicles', discount: 'Custom pricing', col: '#E84A0C' },
                ].map(({ tier, discount, col }) => (
                  <div
                    key={tier}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: '#141414',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
                      color: 'rgba(255,255,255,0.45)',
                    }}>
                      {tier}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '20px',
                      letterSpacing: '0.04em', color: col,
                    }}>
                      {discount}
                    </span>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                color: 'rgba(255,255,255,0.22)', lineHeight: 1.6,
              }}>
                Weekly, bi-weekly or monthly scheduling available. Get in touch and we&apos;ll put together a tailored proposal.
              </p>
            </motion.div>

            {/* Right — benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              {FLEET_BENEFITS.map((b, i) => (
                <div
                  key={b.label}
                  style={{
                    padding: 'clamp(20px, 2.5vw, 32px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: '#141414',
                    display: 'flex', gap: '20px', alignItems: 'flex-start',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '28px',
                    letterSpacing: '0.04em', color: '#E84A0C', lineHeight: 1,
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    0{i + 1}
                  </span>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px',
                      color: '#ffffff', marginBottom: '6px',
                    }}>
                      {b.label}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── Enquiry Form ── */}
      <section
        id="enquire"
        style={{
          paddingTop: 'clamp(48px, 8vw, 120px)',
          paddingBottom: 'clamp(48px, 8vw, 120px)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

          <div
            style={{ display: 'grid', gap: 'clamp(48px, 8vw, 100px)', alignItems: 'start' }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            {/* Left — heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                }}>
                  Get in Touch
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 6vw, 88px)',
                letterSpacing: '0.025em', color: '#ffffff', lineHeight: 0.88,
                marginBottom: '28px',
              }}>
                LET&apos;S TALK<br />
                <span style={{ color: '#E84A0C' }}>BUSINESS.</span>
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.75,
                color: 'rgba(255,255,255,0.38)', maxWidth: '400px', marginBottom: '36px',
              }}>
                Whether it&apos;s a single van or a full fleet, drop us a message and we&apos;ll
                come back to you with a tailored quote — usually within a few hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  ['Phone', '07984 237149'],
                  ['Email', 'hello@truetodetail.co.uk'],
                  ['Hours', 'Mon–Sat · 8am–7pm'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.22)', width: '48px', flexShrink: 0,
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      color: 'rgba(255,255,255,0.6)',
                    }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              {submitted ? (
                <div style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: '#141414',
                  padding: 'clamp(32px, 4vw, 56px)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 56, height: 56, background: '#E84A0C',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '36px',
                    letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1, marginBottom: '12px',
                  }}>
                    MESSAGE SENT
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.38)',
                  }}>
                    We&apos;ll be in touch within a few hours to discuss your requirements.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: '#141414',
                    padding: 'clamp(28px, 3.5vw, 48px)',
                    display: 'flex', flexDirection: 'column', gap: '20px',
                  }}
                >
                  <div style={{ display: 'grid', gap: '16px' }} className="grid-cols-1 sm:grid-cols-2">
                    <div>
                      <label style={fieldLabel}>Your Name</label>
                      <input
                        required type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        style={textInput}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                    <div>
                      <label style={fieldLabel}>Business Name</label>
                      <input
                        type="text"
                        value={form.business}
                        onChange={e => setForm(f => ({ ...f, business: e.target.value }))}
                        placeholder="Smith & Sons Ltd"
                        style={textInput}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '16px' }} className="grid-cols-1 sm:grid-cols-2">
                    <div>
                      <label style={fieldLabel}>Phone Number</label>
                      <input
                        required type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="07700 900000"
                        style={textInput}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                    <div>
                      <label style={fieldLabel}>Fleet Size</label>
                      <select
                        value={form.fleet}
                        onChange={e => setForm(f => ({ ...f, fleet: e.target.value }))}
                        style={{
                          ...textInput,
                          appearance: 'none',
                          color: form.fleet ? '#ffffff' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        <option value="" disabled>Select fleet size</option>
                        <option value="1">1 van</option>
                        <option value="2">2 vans</option>
                        <option value="3-4">3–4 vehicles</option>
                        <option value="5-9">5–9 vehicles</option>
                        <option value="10+">10+ vehicles</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={fieldLabel}>Tell Us More (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Vehicle types, frequency, any specific requirements..."
                      rows={4}
                      style={{ ...textInput, resize: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%', padding: '16px 24px',
                      background: '#E84A0C', color: '#ffffff', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      opacity: submitting ? 0.7 : 1,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#C53D08' }}
                    onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#E84A0C' }}
                  >
                    {submitting ? 'Sending...' : 'Send Enquiry'}
                    {!submitting && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── Footer strip ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(20px, 3vw, 28px) clamp(24px, 5vw, 72px)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px',
        maxWidth: '1400px', margin: '0 auto',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          © 2025 True To Detail · Hertfordshire
        </span>
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Back to main site →
        </a>
      </div>

    </div>
  )
}

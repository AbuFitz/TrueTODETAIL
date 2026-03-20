'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type VehicleType = 'small' | 'midsize' | 'largesuv'

const VEHICLES: { key: VehicleType; label: string; sub: string }[] = [
  { key: 'small',    label: 'Small Car',      sub: 'Hatch / Saloon'        },
  { key: 'midsize',  label: 'Mid-Size',        sub: 'Saloon / Estate / SUV' },
  { key: 'largesuv', label: 'Large SUV / 4×4', sub: 'Big SUVs, 7 seaters'  },
]

interface Pkg {
  id:       string
  name:     string
  tagline:  string
  duration: string
  price:    Record<VehicleType, number>
  includes: string[]
  featured: boolean
}

const PACKAGES: Pkg[] = [
  {
    id: 'essential', name: 'Essential', tagline: 'Quick refresh', duration: '2–3 hrs',
    featured: false,
    price: { small: 80, midsize: 90, largesuv: 105 },
    includes: ['Safe wash & dry', 'Wheels cleaned', 'Interior vacuum', 'Dashboard wipe', 'Glass cleaned', 'Tyre dressing'],
  },
  {
    id: 'full-valet', name: 'Full Valet', tagline: 'Our most popular service', duration: '4–5 hrs',
    featured: true,
    price: { small: 140, midsize: 155, largesuv: 175 },
    includes: ['Everything in Essential', 'Deep interior clean', 'Seat shampoo', 'Carpet extraction', 'Door shuts cleaned', 'Spray wax protection'],
  },
  {
    id: 'premium', name: 'Premium Detail', tagline: 'Best for resale / transformation', duration: '6–7 hrs',
    featured: false,
    price: { small: 220, midsize: 240, largesuv: 270 },
    includes: ['Everything in Full Valet', 'Clay bar decontamination', 'Light machine polish', 'Paint sealant', 'Trim restoration', 'Odour treatment'],
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Packages({
  onBookPack,
}: {
  onBookPack: (pkg: string, vehicle: VehicleType) => void
}) {
  const [vehicle, setVehicle] = useState<VehicleType>('small')

  return (
    <section
      id="packages"
      style={{
        background: '#0C0C0C',
        paddingTop:    'clamp(64px, 10vw, 140px)',
        paddingBottom: 'clamp(64px, 10vw, 140px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: '24px',
            marginBottom: 'clamp(32px, 5vw, 64px)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ width: 20, height: '1.5px', background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              }}>
                Packages
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 7.5vw, 104px)',
              letterSpacing: '0.025em',
              color: '#ffffff', lineHeight: 0.88,
            }}>
              PICK YOUR<br />
              LEVEL OF <span style={{ color: '#E84A0C' }}>CLEAN.</span>
            </h2>
          </div>

          {/* Vehicle selector */}
          <div
            className="items-start md:items-end"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <p
              className="text-left md:text-right"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'rgba(255,255,255,0.3)', maxWidth: '220px', lineHeight: 1.6,
              }}
            >
              Select your vehicle type — prices update instantly.
            </p>
            <div style={{
              display: 'inline-flex',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              {VEHICLES.map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setVehicle(key)}
                  style={{
                    padding: '11px 18px',
                    background: vehicle === key ? '#fff' : 'transparent',
                    cursor: 'pointer', border: 'none',
                    borderRight: key !== 'largesuv' ? '1px solid rgba(255,255,255,0.12)' : 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                    letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1,
                    color: vehicle === key ? '#0C0C0C' : 'rgba(255,255,255,0.45)',
                    transition: 'color 0.15s',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    display: 'block', marginTop: '3px',
                    fontFamily: 'var(--font-body)', fontSize: '10px', lineHeight: 1,
                    color: vehicle === key ? 'rgba(12,12,12,0.4)' : 'rgba(255,255,255,0.22)',
                    transition: 'color 0.15s',
                  }}>
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Package cards grid — 4 cols: 3 active + 1 membership teaser */}
        <div
          style={{
            display: 'grid',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRight: 'none',
            borderBottom: 'none',
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: pkg.featured ? '#ffffff' : '#141414',
                marginTop: pkg.featured ? '-1px' : 0,
                zIndex: pkg.featured ? 2 : 1,
              }}
            >
              {pkg.featured && (
                <div style={{ height: '3px', background: '#E84A0C', flexShrink: 0 }} />
              )}

              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: 'clamp(24px, 2.5vw, 36px)',
              }}>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '20px',
                }}>
                  {pkg.featured ? (
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
                    color: pkg.featured ? 'rgba(12,12,12,0.35)' : 'rgba(255,255,255,0.25)',
                    border: `1px solid ${pkg.featured ? 'rgba(12,12,12,0.12)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '3px 8px',
                  }}>
                    {pkg.duration}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 2.5vw, 32px)',
                  letterSpacing: '0.03em',
                  color: pkg.featured ? '#0C0C0C' : '#ffffff',
                  lineHeight: 0.92, marginBottom: '4px',
                }}>
                  {pkg.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  color: pkg.featured ? 'rgba(12,12,12,0.42)' : 'rgba(255,255,255,0.32)',
                  marginBottom: '20px',
                }}>
                  {pkg.tagline}
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: pkg.featured ? 'rgba(12,12,12,0.32)' : 'rgba(255,255,255,0.28)',
                    marginBottom: '2px',
                  }}>
                    from
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(52px, 5.5vw, 72px)',
                      letterSpacing: '0.01em', lineHeight: 1,
                      color: pkg.featured ? '#0C0C0C' : '#ffffff',
                    }}>
                      £{pkg.price[vehicle]}
                    </span>
                  </div>
                </div>

                <div style={{
                  height: '1px',
                  background: pkg.featured ? 'rgba(12,12,12,0.08)' : 'rgba(255,255,255,0.07)',
                  marginBottom: '20px',
                }} />

                <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                  {pkg.includes.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                        color: pkg.featured ? '#E84A0C' : 'rgba(255,255,255,0.2)',
                        flexShrink: 0, marginTop: '2px',
                      }}>
                        {pkg.featured ? '→' : '–'}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.5,
                        color: pkg.featured ? 'rgba(12,12,12,0.55)' : 'rgba(255,255,255,0.4)',
                      }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onBookPack(pkg.name, vehicle)}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', cursor: 'pointer', border: 'none',
                    background: pkg.featured ? '#E84A0C' : 'rgba(255,255,255,0.08)',
                    color: pkg.featured ? 'white' : 'rgba(255,255,255,0.7)',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = pkg.featured ? '#C53D08' : '#E84A0C'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = pkg.featured ? '#E84A0C' : 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = pkg.featured ? 'white' : 'rgba(255,255,255,0.7)'
                  }}
                >
                  Book This Pack
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                </button>

              </div>
            </motion.div>
          ))}

          {/* 4th card — Membership / Maintenance (Coming Soon) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, ease, delay: 0.21 }}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column',
              borderRight: '1px solid rgba(255,255,255,0.07)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: '#0E0E0E',
            }}
          >
            {/* Dashed top accent — signals "coming" */}
            <div style={{
              height: '2px', flexShrink: 0,
              background: 'repeating-linear-gradient(90deg, #E84A0C 0px, #E84A0C 8px, transparent 8px, transparent 16px)',
              opacity: 0.5,
            }} />

            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              padding: 'clamp(24px, 2.5vw, 36px)',
            }}>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#E84A0C', opacity: 0.7,
                }}>
                  Coming Soon
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '3px 8px',
                }}>
                  Monthly
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 2.5vw, 32px)',
                letterSpacing: '0.03em',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 0.92, marginBottom: '4px',
              }}>
                Membership
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'rgba(255,255,255,0.22)',
                marginBottom: '20px',
              }}>
                Keep your car clean, all year round
              </p>

              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.06em',
                  color: 'rgba(255,255,255,0.18)',
                  marginBottom: '2px',
                }}>
                  from
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(52px, 5.5vw, 72px)',
                    letterSpacing: '0.01em', lineHeight: 1,
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    £50
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    color: 'rgba(255,255,255,0.2)',
                  }}>
                    /mo
                  </span>
                </div>
              </div>

              <div style={{
                height: '1px',
                background: 'rgba(255,255,255,0.05)',
                marginBottom: '20px',
              }} />

              <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                {[
                  'Monthly maintenance visit',
                  'Exterior safe wash',
                  'Interior vacuum & wipe',
                  'Glass clean & tyre dress',
                  'Priority booking slots',
                  'Discounted rates',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                      color: 'rgba(255,255,255,0.15)',
                      flexShrink: 0, marginTop: '2px',
                    }}>
                      –
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.5,
                      color: 'rgba(255,255,255,0.25)',
                    }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div style={{
                width: '100%',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px dashed rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
              }}>
                Launching Soon
                <span style={{
                  width: 16, height: 16, flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', color: 'rgba(255,255,255,0.3)',
                }}>
                  ◎
                </span>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Add-ons strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            marginTop: 'clamp(36px, 4vw, 56px)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: 'clamp(16px, 2vw, 24px) clamp(20px, 3vw, 36px)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px',
            background: '#191919',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)', flexShrink: 0,
          }}>
            Add-ons
          </span>
          <span style={{ display: 'block', width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} className="hidden sm:block" />
          {[
            ['Engine Bay Clean',            '£40'],
            ['Pet Hair Removal',            '£25'],
            ['Odour Treatment',             '£30'],
            ['Seat Shampoo (extra heavy)',  '£30'],
            ['Interior Steam Sanitisation', '£35'],
          ].map(([name, price]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                {name}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '15px',
                letterSpacing: '0.03em', color: '#E84A0C',
              }}>
                {price}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Van & Fleet callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: 'clamp(24px, 3vw, 36px)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: 'clamp(20px, 2.5vw, 28px) clamp(20px, 3vw, 36px)',
            background: '#111111',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
                color: 'rgba(255,255,255,0.7)', marginBottom: '3px',
              }}>
                Running a van or fleet?
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                color: 'rgba(255,255,255,0.3)',
              }}>
                We have dedicated commercial services, fleet pricing and business packages.
              </p>
            </div>
          </div>
          <a
            href="/van-fleet"
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#E84A0C', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '8px',
              flexShrink: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            View Van & Fleet
            <span style={{ fontSize: '14px' }}>→</span>
          </a>
        </motion.div>

      </div>
    </section>
  )
}

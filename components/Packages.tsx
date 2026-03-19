'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type VehicleType = 'hatchback' | 'suv' | 'prestige'

const VEHICLES: { key: VehicleType; label: string; sub: string }[] = [
  { key: 'hatchback', label: 'Hatchback', sub: '/ Saloon'   },
  { key: 'suv',       label: 'SUV',       sub: '/ 4×4'      },
  { key: 'prestige',  label: 'Sports',    sub: '/ Prestige'  },
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
    id: 'essential', name: 'Essential', tagline: 'The perfect fresh start', duration: '2–3 hrs',
    featured: false,
    price: { hatchback: 89, suv: 109, prestige: 149 },
    includes: ['Hand wash & hand dry', 'Wheel & tyre clean', 'Glass inside & out', 'Full interior vacuum', 'Dashboard wipe-down'],
  },
  {
    id: 'deep-clean', name: 'Deep Clean', tagline: 'A proper inside-out reset', duration: '4–5 hrs',
    featured: false,
    price: { hatchback: 179, suv: 219, prestige: 279 },
    includes: ['Everything in Essential', 'Interior steam clean', 'Leather conditioning', 'Carpet shampoo & extract', 'Exterior wax & sealant', 'Engine bay wipe'],
  },
  {
    id: 'premium', name: 'Premium', tagline: 'The full transformation', duration: '6–8 hrs',
    featured: true,
    price: { hatchback: 299, suv: 369, prestige: 479 },
    includes: ['Everything in Deep Clean', 'Clay bar decontamination', 'Single-stage machine polish', 'Paint sealant application', 'Ozone odour treatment', 'Glass coating'],
  },
  {
    id: 'elite', name: 'Elite Ceramic', tagline: 'Maximum protection. Lasting gloss.', duration: '1–2 days',
    featured: false,
    price: { hatchback: 549, suv: 679, prestige: 849 },
    includes: ['Everything in Premium', 'Two-stage paint correction', 'Ceramic coating — 2 year', 'Fabric & carpet protection', 'Headlight restoration', 'Completion certificate'],
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Packages({
  onBookPack,
}: {
  onBookPack: (pkg: string, vehicle: VehicleType) => void
}) {
  const [vehicle, setVehicle] = useState<VehicleType>('hatchback')

  return (
    <section
      id="packages"
      style={{
        /*
          Dark background — packages on near-black creates a premium editorial feel.
          The featured (white) card contrasts sharply. The dark section also
          separates cleanly from the white Stats section before it.
        */
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
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: '28px',
            marginBottom: 'clamp(40px, 5vw, 64px)',
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              color: 'rgba(255,255,255,0.3)', textAlign: 'right', maxWidth: '220px', lineHeight: 1.6,
            }}>
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
                    borderRight: key !== 'prestige' ? '1px solid rgba(255,255,255,0.12)' : 'none',
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

        {/*
          Package cards grid.
          On the dark background:
          — Standard cards: #191919 (slightly lifted dark)
          — Featured card: pure WHITE — the inversion is striking and draws the eye instantly.
          No gap; border trick for seamless seams.
        */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
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
              {/* Featured: 3px orange top accent */}
              {pkg.featured && (
                <div style={{ height: '3px', background: '#E84A0C', flexShrink: 0 }} />
              )}

              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: 'clamp(24px, 2.5vw, 36px)',
              }}>

                {/* Top row: label + duration */}
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

                {/* Package name */}
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

                {/* THE PRICE — visual hero element */}
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

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: pkg.featured ? 'rgba(12,12,12,0.08)' : 'rgba(255,255,255,0.07)',
                  marginBottom: '20px',
                }} />

                {/* Feature list */}
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

                {/* CTA */}
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
            ['Engine Bay Detail',     '£50'],
            ['Headlight Restoration', '£40'],
            ['Odour Elimination',     '£60'],
            ['Pet Hair Removal',      '£30'],
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

      </div>
    </section>
  )
}

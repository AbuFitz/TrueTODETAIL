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
    includes: ['Hand wash & hand dry', 'Wheel & tyre clean', 'Glass cleaned inside & out', 'Full interior vacuum', 'Dashboard wipe-down'],
  },
  {
    id: 'deep-clean', name: 'Deep Clean', tagline: 'A proper inside-out refresh', duration: '4–5 hrs',
    featured: false,
    price: { hatchback: 179, suv: 219, prestige: 279 },
    includes: ['Everything in Essential', 'Interior steam clean', 'Leather conditioning', 'Carpet shampoo & extraction', 'Exterior wax & sealant', 'Engine bay wipe'],
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
  onBookPack: (pkg: string, vehicle: VehicleType, price: number) => void
}) {
  const [vehicle, setVehicle] = useState<VehicleType>('hatchback')

  return (
    <section
      id="packages"
      style={{
        position: 'relative',
        background: '#F4F0E8',
        /* Diagonal top going the other way — cuts up right to left */
        clipPath: 'polygon(0 0, 100% 5vw, 100% 100%, 0 100%)',
        marginTop: '-5vw',
        paddingTop: 'clamp(72px, 13vw, 170px)',
        paddingBottom: 'clamp(64px, 9vw, 130px)',
        zIndex: 4,
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Header + vehicle selector */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: '32px',
            marginBottom: 'clamp(40px, 5vw, 64px)',
          }}
        >
          {/* Headline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ width: 20, height: 1, background: '#E84A0C', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)',
              }}>
                Packages
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(52px, 8vw, 108px)',
                letterSpacing: '0.025em',
                color: '#0A0A0A', lineHeight: 0.88,
              }}
            >
              PICK YOUR<br />
              LEVEL OF{' '}
              <span style={{ color: '#E84A0C' }}>CLEAN.</span>
            </h2>
          </div>

          {/* Vehicle tabs + caption */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.45)',
              textAlign: 'right', maxWidth: '240px', lineHeight: 1.6,
            }}>
              Select your vehicle type — prices update instantly. All fixed, no extras.
            </p>

            {/* Vehicle tabs */}
            <div style={{
              display: 'inline-flex',
              border: '1px solid rgba(12,12,12,0.12)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              {VEHICLES.map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setVehicle(key)}
                  style={{
                    padding: '12px 18px',
                    background: vehicle === key ? '#0A0A0A' : 'transparent',
                    cursor: 'pointer', border: 'none',
                    borderRight: key !== 'prestige' ? '1px solid rgba(12,12,12,0.1)' : 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                    letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1,
                    color: vehicle === key ? 'white' : 'rgba(12,12,12,0.55)',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    display: 'block', marginTop: '3px',
                    fontFamily: 'var(--font-body)', fontSize: '11px', lineHeight: 1,
                    color: vehicle === key ? 'rgba(255,255,255,0.45)' : 'rgba(12,12,12,0.3)',
                  }}>
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cards — featured card pops out of the row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            alignItems: 'stretch',
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
                borderRadius: pkg.featured ? '20px' : '16px',
                overflow: 'hidden',
                background: pkg.featured ? '#0A0A0A' : 'white',
                /* Featured card breaks out of the row vertically */
                marginTop: pkg.featured ? '-20px' : '0',
                marginBottom: pkg.featured ? '-20px' : '0',
                boxShadow: pkg.featured
                  ? '0 32px 80px rgba(10,10,10,0.35), 0 4px 16px rgba(10,10,10,0.2)'
                  : '0 1px 4px rgba(12,12,12,0.06)',
                zIndex: pkg.featured ? 10 : 1,
              }}
            >
              {/* Featured: orange top bar */}
              {pkg.featured && (
                <div style={{ height: '3px', background: '#E84A0C', flexShrink: 0 }} />
              )}

              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: pkg.featured ? 'clamp(24px, 2.5vw, 32px)' : 'clamp(20px, 2vw, 28px)',
              }}>

                {/* Duration badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  {pkg.featured && (
                    <span style={{
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: '#E84A0C', display: 'block', marginBottom: '0',
                    }}>
                      Most Popular
                    </span>
                  )}
                  {!pkg.featured && <span />}
                  <span style={{
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: pkg.featured ? 'rgba(255,255,255,0.3)' : 'rgba(12,12,12,0.3)',
                    border: `1px solid ${pkg.featured ? 'rgba(255,255,255,0.1)' : 'rgba(12,12,12,0.1)'}`,
                    padding: '3px 8px', borderRadius: '4px',
                  }}>
                    {pkg.duration}
                  </span>
                </div>

                {/* Package name */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(26px, 2.8vw, 34px)',
                    letterSpacing: '0.03em',
                    color: pkg.featured ? 'white' : '#0A0A0A',
                    lineHeight: 0.9, marginBottom: '6px',
                  }}
                >
                  {pkg.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  color: pkg.featured ? 'rgba(255,255,255,0.4)' : 'rgba(12,12,12,0.4)',
                  marginBottom: '18px',
                }}>
                  {pkg.tagline}
                </p>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '12px',
                      color: pkg.featured ? 'rgba(255,255,255,0.35)' : 'rgba(12,12,12,0.35)',
                    }}>
                      from
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(40px, 4.5vw, 54px)',
                        letterSpacing: '0.02em',
                        color: pkg.featured ? 'white' : '#0A0A0A',
                        lineHeight: 1,
                      }}
                    >
                      £{pkg.price[vehicle]}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: pkg.featured ? 'rgba(255,255,255,0.08)' : 'rgba(12,12,12,0.07)',
                  marginBottom: '20px',
                }} />

                {/* Includes list */}
                <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {pkg.includes.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
                        background: pkg.featured ? '#E84A0C' : 'rgba(12,12,12,0.2)',
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.45,
                        color: pkg.featured ? 'rgba(255,255,255,0.5)' : 'rgba(12,12,12,0.55)',
                      }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <button
                  onClick={() => onBookPack(pkg.name, vehicle, pkg.price[vehicle])}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', cursor: 'pointer', border: 'none',
                    borderRadius: '8px',
                    background: pkg.featured ? '#E84A0C' : 'rgba(12,12,12,0.06)',
                    color: pkg.featured ? 'white' : 'rgba(12,12,12,0.6)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = pkg.featured ? '#C53D08' : '#0A0A0A'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = pkg.featured ? '#E84A0C' : 'rgba(12,12,12,0.06)'
                    e.currentTarget.style.color = pkg.featured ? 'white' : 'rgba(12,12,12,0.6)'
                  }}
                >
                  Book This Pack
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: 0.5, flexShrink: 0 }} />
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
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: 'clamp(40px, 5vw, 64px)',
            border: '1px solid rgba(12,12,12,0.1)',
            borderRadius: '12px',
            padding: 'clamp(16px, 2vw, 24px) clamp(20px, 3vw, 36px)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 32px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.3)',
            flexShrink: 0,
          }}>
            Add-ons
          </span>
          <span style={{ width: 1, height: 20, background: 'rgba(12,12,12,0.1)', flexShrink: 0 }} className="hidden sm:block" />
          {[
            ['Engine Bay Detail', '£50'],
            ['Headlight Restoration', '£40'],
            ['Odour Elimination', '£60'],
            ['Pet Hair Removal', '£30'],
          ].map(([name, price]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.4)' }}>{name}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '16px',
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

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type VehicleType = 'hatchback' | 'suv' | 'prestige'

const VEHICLES: { key: VehicleType; label: string; sub: string }[] = [
  { key: 'hatchback', label: 'Hatchback', sub: '/ Saloon' },
  { key: 'suv',       label: 'SUV',       sub: '/ 4×4'   },
  { key: 'prestige',  label: 'Sports',    sub: '/ Prestige' },
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
    id: 'essential', name: 'Essential', tagline: 'A thorough hand wash & tidy',
    duration: '2–3 hrs', featured: false,
    price: { hatchback: 89, suv: 109, prestige: 149 },
    includes: [
      'Hand wash & hand dry',
      'Wheel & tyre clean',
      'All glass cleaned',
      'Full interior vacuum',
      'Dashboard & console wipe',
    ],
  },
  {
    id: 'deep-clean', name: 'Deep Clean', tagline: 'A complete inside-out refresh',
    duration: '4–5 hrs', featured: false,
    price: { hatchback: 179, suv: 219, prestige: 279 },
    includes: [
      'Everything in Essential',
      'Interior steam clean',
      'Leather seat conditioning',
      'Carpet shampoo & extraction',
      'Exterior wax & sealant',
      'Engine bay wipe-down',
    ],
  },
  {
    id: 'premium', name: 'Premium', tagline: 'Our most complete transformation',
    duration: '6–8 hrs', featured: true,
    price: { hatchback: 299, suv: 369, prestige: 479 },
    includes: [
      'Everything in Deep Clean',
      'Clay bar decontamination',
      'Single-stage machine polish',
      'Paint sealant application',
      'Ozone odour treatment',
      'Full glass coating',
    ],
  },
  {
    id: 'elite', name: 'Elite Ceramic', tagline: 'Maximum protection. Lasting gloss.',
    duration: '1–2 days', featured: false,
    price: { hatchback: 549, suv: 679, prestige: 849 },
    includes: [
      'Everything in Premium',
      'Two-stage paint correction',
      'Ceramic coating — 2 year',
      'Fabric & carpet protection',
      'Headlight restoration',
      'Certificate of completion',
    ],
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
      className="bg-ink border-t border-white/[0.06]"
      style={{ paddingTop: 'clamp(64px, 8vw, 120px)', paddingBottom: 'clamp(64px, 8vw, 120px)' }}
    >
      <div className="max-w-[1380px] mx-auto px-6 md:px-10">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-5 h-px bg-orange flex-shrink-0" />
              <span className="section-label text-white/30">Packages</span>
            </div>
            <h2
              className="font-display text-white leading-[0.88]"
              style={{ fontSize: 'clamp(54px, 7.5vw, 96px)', letterSpacing: '0.025em' }}
            >
              PICK YOUR<br />LEVEL OF<br /><span className="text-orange">CLEAN.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="font-body text-[14px] text-white/35 max-w-xs leading-relaxed md:text-right">
              Select your vehicle — your price updates instantly. All prices are fixed with no surprises on the day.
            </p>

            {/* Vehicle type tabs */}
            <div className="inline-flex border border-white/[0.1] overflow-hidden">
              {VEHICLES.map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setVehicle(key)}
                  className={`px-5 py-3.5 text-left border-r border-white/[0.08] last:border-r-0
                              transition-colors duration-150 ${
                    vehicle === key
                      ? 'bg-white text-ink'
                      : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="font-body font-semibold text-[12px] tracking-[0.04em] uppercase block leading-none">
                    {label}
                  </span>
                  <span className={`font-body text-[11px] mt-1 block ${vehicle === key ? 'text-ink/40' : 'text-white/25'}`}>
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              className={`relative flex flex-col group ${
                pkg.featured ? 'bg-white' : 'bg-ink-1'
              }`}
            >
              {/* Featured top bar */}
              {pkg.featured && (
                <div className="h-[3px] bg-orange w-full flex-shrink-0" />
              )}

              <div className="flex flex-col flex-1 p-7 md:p-8">

                {/* Name + duration */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    {pkg.featured && (
                      <span className="section-label text-ink/35 block mb-2">Most Popular</span>
                    )}
                    <h3
                      className={`font-display leading-[0.9] ${pkg.featured ? 'text-ink' : 'text-white'}`}
                      style={{ fontSize: 'clamp(28px, 3vw, 34px)', letterSpacing: '0.03em' }}
                    >
                      {pkg.name}
                    </h3>
                  </div>
                  <span
                    className={`font-body text-[10px] tracking-wider uppercase border px-2 py-1 flex-shrink-0 mt-1 ${
                      pkg.featured ? 'border-ink/15 text-ink/35' : 'border-white/15 text-white/30'
                    }`}
                  >
                    {pkg.duration}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-body text-[12px] ${pkg.featured ? 'text-ink/40' : 'text-white/30'}`}>
                      from
                    </span>
                    <span
                      className={`font-display leading-none ${pkg.featured ? 'text-ink' : 'text-white'}`}
                      style={{ fontSize: 'clamp(40px, 5vw, 52px)', letterSpacing: '0.02em' }}
                    >
                      £{pkg.price[vehicle]}
                    </span>
                  </div>
                  <p className={`font-body text-[13px] mt-2 ${pkg.featured ? 'text-ink/45' : 'text-white/35'}`}>
                    {pkg.tagline}
                  </p>
                </div>

                <div className={`h-px mb-5 ${pkg.featured ? 'bg-ink/8' : 'bg-white/[0.07]'}`} />

                {/* Includes */}
                <ul className="flex flex-col gap-2.5 flex-1 mb-7">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className={`mt-[7px] w-1 h-1 rounded-full flex-shrink-0 ${
                          pkg.featured ? 'bg-orange' : 'bg-white/25'
                        }`}
                      />
                      <span className={`font-body text-[13px] leading-snug ${pkg.featured ? 'text-ink/60' : 'text-white/40'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onBookPack(pkg.name, vehicle, pkg.price[vehicle])}
                  className={`w-full py-4 font-body font-semibold text-[12px] tracking-[0.08em]
                              uppercase flex items-center justify-between px-5
                              transition-colors duration-200 ${
                    pkg.featured
                      ? 'bg-orange text-white hover:bg-orange-dark'
                      : 'bg-white/[0.07] text-white/70 hover:bg-orange hover:text-white'
                  }`}
                >
                  Book This Pack
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pkg.featured ? 'bg-white/60' : 'bg-white/30'}`} />
                </button>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 border border-white/[0.07] px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10"
        >
          <p className="section-label text-white/25 flex-shrink-0">Add-ons</p>
          <div className="hidden sm:block w-px h-5 bg-white/10 flex-shrink-0" />
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              ['Engine Bay Detail', '£50'],
              ['Headlight Restoration', '£40'],
              ['Odour Elimination', '£60'],
              ['Pet Hair Removal', '£30'],
            ].map(([name, price]) => (
              <div key={name} className="flex items-baseline gap-2">
                <span className="font-body text-[13px] text-white/35">{name}</span>
                <span className="font-display text-[15px] text-orange" style={{ letterSpacing: '0.03em' }}>
                  {price}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

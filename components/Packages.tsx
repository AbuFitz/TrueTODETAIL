'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type VehicleType = 'hatchback' | 'suv' | 'prestige'

const vehicleTypes: { key: VehicleType; label: string; sub: string }[] = [
  { key: 'hatchback', label: 'Hatchback', sub: '/ Saloon' },
  { key: 'suv', label: 'SUV', sub: '/ 4×4' },
  { key: 'prestige', label: 'Sports', sub: '/ Prestige' },
]

interface Package {
  id: string
  name: string
  tagline: string
  price: Record<VehicleType, number>
  includes: string[]
  popular: boolean
  duration: string
}

const packages: Package[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'A thorough hand wash & tidy',
    price: { hatchback: 89, suv: 109, prestige: 149 },
    includes: [
      'Hand wash & hand dry',
      'Wheel & tyre clean',
      'All glass cleaned',
      'Full interior vacuum',
      'Dashboard & console wipe',
    ],
    popular: false,
    duration: '2–3 hrs',
  },
  {
    id: 'deep-clean',
    name: 'Deep Clean',
    tagline: 'A complete inside-out refresh',
    price: { hatchback: 179, suv: 219, prestige: 279 },
    includes: [
      'Everything in Essential',
      'Interior steam clean',
      'Leather seat conditioning',
      'Carpet shampoo & extraction',
      'Exterior wax & sealant',
      'Engine bay wipe-down',
    ],
    popular: false,
    duration: '4–5 hrs',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Our most complete transformation',
    price: { hatchback: 299, suv: 369, prestige: 479 },
    includes: [
      'Everything in Deep Clean',
      'Clay bar decontamination',
      'Single-stage machine polish',
      'Paint sealant application',
      'Ozone odour treatment',
      'Full glass coating',
    ],
    popular: true,
    duration: '6–8 hrs',
  },
  {
    id: 'elite-ceramic',
    name: 'Elite Ceramic',
    tagline: 'Maximum protection. Lasting gloss.',
    price: { hatchback: 549, suv: 679, prestige: 849 },
    includes: [
      'Everything in Premium',
      'Two-stage paint correction',
      'Ceramic coating — 2 year',
      'Fabric & carpet protection',
      'Headlight restoration',
      'Certificate of completion',
    ],
    popular: false,
    duration: '1–2 days',
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Packages({ onBookPack }: { onBookPack: (pkg: string, vehicle: VehicleType, price: number) => void }) {
  const [vehicle, setVehicle] = useState<VehicleType>('hatchback')

  return (
    <section id="packages" className="py-24 md:py-32 bg-site-light">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-orange" />
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/35">Choose Your Pack</p>
            </div>
            <h2
              className="font-display font-black uppercase leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)' }}
            >
              PICK YOUR
              <br />
              LEVEL OF
              <br />
              <span className="text-orange">CLEAN.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <p className="font-body text-sm text-black/45 max-w-xs leading-relaxed md:text-right">
              Select your vehicle type below — your price updates instantly.
              All prices are fixed with no surprises on the day.
            </p>
            {/* Vehicle selector */}
            <div className="inline-flex bg-white border border-black/10 overflow-hidden">
              {vehicleTypes.map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setVehicle(key)}
                  className={`px-7 py-4 text-left transition-all duration-200 border-r border-black/10 last:border-r-0 ${
                    vehicle === key
                      ? 'bg-site-black text-white'
                      : 'bg-white text-site-black hover:bg-site-light'
                  }`}
                >
                  <span className="font-display font-black text-[13px] tracking-wider uppercase block leading-none">{label}</span>
                  <span className={`font-mono text-[9px] tracking-wide mt-1.5 block ${vehicle === key ? 'text-white/45' : 'text-black/35'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/6">
          {packages.map((pkg, i) => {
            const isPopular = pkg.popular
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className={`relative flex flex-col group transition-shadow duration-300 ${
                  isPopular
                    ? 'bg-orange'
                    : 'bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.10)]'
                }`}
              >
                {/* Popular top accent */}
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-site-black" />
                )}

                {/* Non-popular hover top accent */}
                {!isPopular && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                )}

                <div className="flex flex-col flex-1 p-8">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div>
                      {isPopular && (
                        <span className="font-mono text-[9px] tracking-[0.28em] uppercase block mb-2 text-site-black/55">
                          Most Popular
                        </span>
                      )}
                      <h3 className={`font-display font-black text-3xl uppercase leading-[0.88] ${isPopular ? 'text-site-black' : 'text-site-black'}`}>
                        {pkg.name}
                      </h3>
                    </div>
                    <span className={`font-mono text-[9px] tracking-wide uppercase border px-2.5 py-1.5 flex-shrink-0 mt-1 ${
                      isPopular ? 'border-site-black/20 text-site-black/45' : 'border-black/10 text-black/35'
                    }`}>
                      {pkg.duration}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-mono text-sm ${isPopular ? 'text-site-black/50' : 'text-black/35'}`}>from</span>
                      <span className={`font-display font-black leading-none ${isPopular ? 'text-site-black' : 'text-site-black'}`}
                        style={{ fontSize: 'clamp(3rem, 5vw, 4rem)' }}
                      >
                        £{pkg.price[vehicle]}
                      </span>
                    </div>
                    <p className={`font-body text-xs mt-2 leading-snug ${isPopular ? 'text-site-black/50' : 'text-black/40'}`}>
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={`h-px mb-6 ${isPopular ? 'bg-site-black/12' : 'bg-black/6'}`} />

                  {/* Includes */}
                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className={`mt-[6px] w-1 h-1 rounded-full flex-shrink-0 ${isPopular ? 'bg-site-black/35' : 'bg-orange'}`} />
                        <span className={`font-body text-[13px] leading-snug ${isPopular ? 'text-site-black/65' : 'text-black/55'}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button */}
                  <button
                    onClick={() => onBookPack(pkg.name, vehicle, pkg.price[vehicle])}
                    className={`btn-sweep w-full py-4 font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase flex items-center justify-between px-5 transition-colors duration-200 ${
                      isPopular
                        ? 'bg-site-black text-white hover:bg-site-dark'
                        : 'bg-site-black text-white hover:bg-orange'
                    }`}
                  >
                    BOOK THIS PACK
                    <span className="text-sm leading-none">&rarr;</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add-ons row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-6 bg-white border border-black/6 px-8 py-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-orange" />
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/35">Add-ons</p>
            </div>
            <div className="hidden sm:block w-px h-6 bg-black/8 flex-shrink-0" />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                ['Engine Bay Detail', '£50'],
                ['Headlight Restoration', '£40'],
                ['Odour Elimination', '£60'],
                ['Pet Hair Removal', '£30'],
              ].map(([name, price]) => (
                <div key={name} className="flex items-baseline gap-2">
                  <span className="font-body text-[13px] text-black/55">{name}</span>
                  <span className="font-display font-black text-sm text-orange">{price}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

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
  accent: string
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
    accent: 'border-black/15',
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
    accent: 'border-black/15',
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
    accent: 'border-orange',
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
    name: 'Elite\nCeramic',
    tagline: 'Maximum protection. Lasting gloss.',
    price: { hatchback: 549, suv: 679, prestige: 849 },
    accent: 'border-black/15',
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
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-black/40">Choose Your Pack</p>
            </div>
            <h2 className="font-display font-black text-5xl md:text-6xl xl:text-7xl uppercase leading-[0.88]">
              PICK YOUR
              <br />
              LEVEL OF
              <br />
              <span className="text-orange">CLEAN.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <p className="font-body text-sm text-black/50 max-w-xs leading-relaxed md:text-right">
              Select your vehicle type. Your price updates instantly.
              All prices are fixed — no surprises on the day.
            </p>
            {/* Vehicle selector — bigger, spacious buttons */}
            <div className="inline-flex bg-white border border-black/12">
              {vehicleTypes.map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setVehicle(key)}
                  className={`px-8 py-5 text-left transition-colors duration-150 border-r border-black/12 last:border-r-0 ${
                    vehicle === key
                      ? 'bg-site-black text-white'
                      : 'bg-white text-site-black hover:bg-site-light'
                  }`}
                >
                  <span className="font-display font-black text-sm tracking-wider uppercase block leading-none">{label}</span>
                  <span className={`font-mono text-[10px] tracking-wide mt-1.5 block ${vehicle === key ? 'text-white/50' : 'text-black/40'}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Package cards — single row at lg, 2-col at md */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8">
          {packages.map((pkg, i) => {
            const isOrange = pkg.popular
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className={`relative flex flex-col ${isOrange ? 'bg-orange' : 'bg-white'}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-site-black" />
                )}

                <div className="flex flex-col flex-1 p-8">
                  {/* Top: name + duration */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      {pkg.popular && (
                        <span className={`font-body text-[9px] tracking-[0.25em] uppercase block mb-2 ${isOrange ? 'text-site-black/60' : 'text-orange'}`}>
                          Most Popular
                        </span>
                      )}
                      <h3 className={`font-display text-3xl uppercase leading-[0.9] whitespace-pre-line ${isOrange ? 'text-site-black' : 'text-site-black'}`}>
                        {pkg.name}
                      </h3>
                    </div>
                    <span className={`font-body text-[10px] tracking-wider uppercase border px-2.5 py-1.5 flex-shrink-0 mt-1 ${
                      isOrange ? 'border-site-black/20 text-site-black/50' : 'border-black/12 text-black/40'
                    }`}>
                      {pkg.duration}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-7">
                    <span className={`font-display text-6xl leading-none ${isOrange ? 'text-site-black' : 'text-site-black'}`}>
                      £{pkg.price[vehicle]}
                    </span>
                    <p className={`font-body text-xs mt-1.5 ${isOrange ? 'text-site-black/55' : 'text-black/40'}`}>
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={`h-px mb-6 ${isOrange ? 'bg-site-black/15' : 'bg-black/8'}`} />

                  {/* Includes list */}
                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className={`mt-[5px] w-1 h-1 rounded-full flex-shrink-0 ${isOrange ? 'bg-site-black/40' : 'bg-orange'}`} />
                        <span className={`font-body text-sm leading-snug ${isOrange ? 'text-site-black/70' : 'text-black/60'}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => onBookPack(pkg.name.replace('\n', ' '), vehicle, pkg.price[vehicle])}
                    className={`w-full py-4 font-display font-black text-xs tracking-[0.15em] uppercase flex items-center justify-between px-5 transition-colors duration-200 ${
                      isOrange
                        ? 'bg-site-black text-white hover:bg-site-dark'
                        : 'bg-site-black text-white hover:bg-orange'
                    }`}
                  >
                    BOOK THIS PACK
                    <span className="text-sm leading-none">→</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add-ons row — horizontal, minimal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-6 bg-white border border-black/8 px-8 py-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            <p className="font-display text-sm uppercase tracking-widest text-black/40 flex-shrink-0">
              Add-ons
            </p>
            <div className="h-px sm:h-8 sm:w-px bg-black/10 flex-shrink-0" />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                ['Engine Bay Detail', '£50'],
                ['Headlight Restoration', '£40'],
                ['Odour Elimination', '£60'],
                ['Pet Hair Removal', '£30'],
              ].map(([name, price]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="font-body text-sm text-black/60">{name}</span>
                  <span className="font-display text-sm text-orange">{price}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

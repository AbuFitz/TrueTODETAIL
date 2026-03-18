'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

type VehicleType = 'hatchback' | 'suv' | 'prestige'

const vehicleTypes: { key: VehicleType; label: string }[] = [
  { key: 'hatchback', label: 'Hatchback / Saloon' },
  { key: 'suv', label: 'SUV / 4×4' },
  { key: 'prestige', label: 'Sports / Prestige' },
]

interface Package {
  id: string
  name: string
  tagline: string
  price: Record<VehicleType, number>
  bg: 'light' | 'black' | 'orange' | 'dark'
  includes: string[]
  popular: boolean
  image: string
  imageAlt: string
  duration: string
}

const packages: Package[] = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    tagline: 'The perfect entry-level clean',
    price: { hatchback: 89, suv: 109, prestige: 149 },
    bg: 'light',
    includes: [
      'Hand wash & hand dry',
      'Wheel & tyre cleaning',
      'All window cleaning',
      'Full interior vacuum',
      'Dashboard & console wipe',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80',
    imageAlt: 'Car exterior wash',
    duration: '2–3 hrs',
  },
  {
    id: 'deep-clean',
    name: 'DEEP CLEAN',
    tagline: 'A thorough inside-out refresh',
    price: { hatchback: 179, suv: 219, prestige: 279 },
    bg: 'black',
    includes: [
      'Everything in Essential',
      'Interior steam clean',
      'Leather seat conditioning',
      'Carpet shampoo & extract',
      'Exterior wax & sealant coat',
      'Engine bay wipe-down',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    imageAlt: 'Car interior deep clean',
    duration: '4–5 hrs',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    tagline: 'Our most popular transformation',
    price: { hatchback: 299, suv: 369, prestige: 479 },
    bg: 'orange',
    includes: [
      'Everything in Deep Clean',
      'Clay bar decontamination',
      'Single-stage machine polish',
      'Paint sealant application',
      'Ozone odour treatment',
      'Full glass coating',
    ],
    popular: true,
    image: 'https://images.unsplash.com/photo-1611566026373-c6c8da0be2eb?w=800&q=80',
    imageAlt: 'Car machine polishing',
    duration: '6–8 hrs',
  },
  {
    id: 'elite-ceramic',
    name: 'ELITE CERAMIC',
    tagline: 'Maximum protection. Lasting gloss.',
    price: { hatchback: 549, suv: 679, prestige: 849 },
    bg: 'dark',
    includes: [
      'Everything in Premium',
      'Two-stage paint correction',
      'Ceramic coating (2-year)',
      'Fabric & carpet protection',
      'Headlight restoration',
      'Certificate of completion',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    imageAlt: 'Ceramic coated car',
    duration: '1–2 days',
  },
]

const cardStyles: Record<Package['bg'], { wrapper: string; badge: string; priceBg: string; btn: string; text: string; subtext: string; bullet: string }> = {
  light: {
    wrapper: 'bg-site-light text-site-black',
    badge: 'bg-site-black text-white',
    priceBg: '',
    btn: 'bg-site-black text-white hover:bg-orange',
    text: 'text-site-black',
    subtext: 'text-site-black/50',
    bullet: 'text-orange',
  },
  black: {
    wrapper: 'bg-site-black text-white',
    badge: 'bg-orange text-white',
    priceBg: '',
    btn: 'bg-white text-site-black hover:bg-orange hover:text-white',
    text: 'text-white',
    subtext: 'text-white/50',
    bullet: 'text-orange',
  },
  orange: {
    wrapper: 'bg-orange text-site-black',
    badge: 'bg-site-black text-white',
    priceBg: '',
    btn: 'bg-site-black text-white hover:bg-white hover:text-site-black',
    text: 'text-site-black',
    subtext: 'text-site-black/60',
    bullet: 'text-site-black',
  },
  dark: {
    wrapper: 'bg-site-dark text-white',
    badge: 'bg-orange text-white',
    priceBg: '',
    btn: 'bg-white text-site-black hover:bg-orange hover:text-white',
    text: 'text-white',
    subtext: 'text-white/50',
    bullet: 'text-orange',
  },
}

export default function Packages({ onBookPack }: { onBookPack: (pkg: string, vehicle: VehicleType, price: number) => void }) {
  const [vehicle, setVehicle] = useState<VehicleType>('hatchback')

  return (
    <section id="packages" className="py-20 md:py-28 bg-white">
      {/* Section header */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-14"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-orange mb-3">
              — Shop Detailing Packs
            </p>
            <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
              CHOOSE
              <br />
              YOUR LEVEL
              <br />
              OF CLEAN.
            </h2>
          </div>
          <p className="font-body text-base text-black/50 max-w-xs">
            Pick a pack, choose your vehicle type, and book. We handle everything
            else — guaranteed.
          </p>
        </div>

        {/* Vehicle type toggle */}
        <div className="mt-10 flex">
          <div className="inline-flex border border-black/15">
            {vehicleTypes.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setVehicle(key)}
                className={`px-6 py-3 font-display font-bold text-xs tracking-widest uppercase transition-colors duration-150 ${
                  vehicle === key
                    ? 'bg-site-black text-white'
                    : 'bg-white text-site-black hover:bg-site-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Package cards grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-black/10">
        {packages.map((pkg, cardIdx) => {
          const styles = cardStyles[pkg.bg]
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: cardIdx * 0.08 }}
              className={`${styles.wrapper} relative flex flex-col border border-black/10 group detail-card`}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className={`absolute top-4 right-4 z-10 ${styles.badge} text-[10px] font-display font-black tracking-widest px-3 py-1.5 uppercase`}>
                  MOST POPULAR
                </div>
              )}

              {/* Image */}
              <div className="relative h-52 overflow-hidden flex-shrink-0">
                <Image
                  src={pkg.image}
                  alt={pkg.imageAlt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Duration overlay */}
                <div className="absolute bottom-0 left-0 bg-black/60 px-4 py-2">
                  <span className="font-display font-bold text-xs text-white tracking-widest">{pkg.duration}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-7">
                {/* Package name */}
                <h3 className={`font-display font-black text-4xl uppercase leading-none mb-1 ${styles.text}`}>
                  {pkg.name}
                </h3>
                <p className={`font-body text-xs ${styles.subtext} tracking-wider mb-6`}>
                  {pkg.tagline}
                </p>

                {/* Price */}
                <div className="mb-7">
                  <span className={`font-display font-black text-5xl leading-none ${styles.text}`}>
                    £{pkg.price[vehicle]}
                  </span>
                  <span className={`font-body text-xs ${styles.subtext} ml-2`}>
                    {vehicle === 'prestige' ? '/ prestige' : vehicle === 'suv' ? '/ suv' : '/ hatchback'}
                  </span>
                </div>

                {/* Includes */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className={`${styles.bullet} mt-0.5 flex-shrink-0 text-xs`}>●</span>
                      <span className={`font-body text-sm leading-snug ${styles.text} opacity-80`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onBookPack(pkg.name, vehicle, pkg.price[vehicle])}
                  className={`w-full py-4 font-display font-black text-sm tracking-widest uppercase flex items-center justify-between px-6 transition-colors duration-200 ${styles.btn}`}
                >
                  BOOK THIS PACK
                  <span className="text-lg leading-none">→</span>
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add-ons strip */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="border border-black/10 p-7 bg-site-light">
          <p className="font-display font-black text-xl uppercase tracking-wider mb-5">
            ADD-ONS — Customise Your Pack
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Engine Bay Detail', price: '+£50' },
              { name: 'Headlight Restoration', price: '+£40' },
              { name: 'Odour Elimination', price: '+£60' },
              { name: 'Pet Hair Removal', price: '+£30' },
            ].map((addon) => (
              <div key={addon.name} className="bg-white border border-black/10 p-5 flex flex-col gap-1">
                <span className="font-display font-bold text-sm uppercase tracking-wide text-site-black">
                  {addon.name}
                </span>
                <span className="font-display font-black text-2xl text-orange">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

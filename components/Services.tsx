'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const services = [
  {
    id: 'exterior',
    index: '01',
    title: 'Exterior Detail',
    desc: 'Hand wash, clay bar decontamination, machine polish and paint sealant — all at your location.',
    highlight: false,
  },
  {
    id: 'interior',
    index: '02',
    title: 'Interior Detail',
    desc: 'Steam clean, leather conditioning, carpet shampoo and extraction, and full interior sanitisation.',
    highlight: false,
  },
  {
    id: 'paint',
    index: '03',
    title: 'Paint Correction',
    desc: 'Remove swirl marks, fine scratches and oxidation. Single or multi-stage machine polishing to suit your paint.',
    highlight: false,
  },
  {
    id: 'ceramic',
    index: '04',
    title: 'Ceramic Coating',
    desc: 'Bond-level paint protection delivering up to 2 years of hydrophobic, scratch-resistant gloss. Our flagship service.',
    highlight: true,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="font-body text-[11px] tracking-[0.28em] uppercase text-black/30 mb-5">
              What We Do
            </p>
            <h2
              className="font-display font-black uppercase leading-[0.88] text-site-black"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
            >
              EVERY SERVICE
              <br />
              <span className="text-orange">COVERED.</span>
            </h2>
          </div>
          <p className="font-body text-[15px] text-black/45 max-w-xs leading-relaxed">
            From a quick refresh to full ceramic protection — every level of care, mobile to your door.
          </p>
        </motion.div>

        {/* Service rows */}
        <div className="flex flex-col divide-y divide-black/8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease, delay: i * 0.06 }}
              className={`relative flex flex-col md:flex-row md:items-center gap-4 md:gap-10 py-8 group ${
                svc.highlight ? '-mx-6 md:-mx-12 px-6 md:px-12 overflow-hidden' : ''
              }`}
            >
              {/* Ceramic: dark background image */}
              {svc.highlight && (
                <>
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&fit=crop&crop=center"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-15"
                  />
                  <div className="absolute inset-0 bg-site-black/90" />
                </>
              )}

              {/* Hover left accent line (non-highlight rows) */}
              {!svc.highlight && (
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-orange scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
              )}

              {/* Index number */}
              <span
                className={`relative z-10 font-body font-semibold text-[11px] tracking-[0.2em] flex-shrink-0 w-8 ${
                  svc.highlight ? 'text-white/25' : 'text-black/20'
                }`}
              >
                {svc.index}
              </span>

              {/* Title */}
              <h3
                className={`relative z-10 font-display font-black uppercase leading-[0.88] flex-shrink-0 md:w-56 transition-colors duration-200 ${
                  svc.highlight
                    ? 'text-white'
                    : 'text-site-black group-hover:text-orange'
                }`}
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
              >
                {svc.title}
              </h3>

              {/* Divider */}
              <div className={`relative z-10 hidden md:block h-px flex-1 ${svc.highlight ? 'bg-white/8' : 'bg-black/8'}`} />

              {/* Description */}
              <p className={`relative z-10 font-body text-[14px] leading-relaxed md:w-[320px] flex-shrink-0 ${
                svc.highlight ? 'text-white/50' : 'text-black/45'
              }`}>
                {svc.desc}
              </p>

              {/* Ceramic CTA */}
              {svc.highlight && (
                <a
                  href="#packages"
                  className="relative z-10 flex-shrink-0 flex items-center justify-between gap-6
                             bg-orange text-white px-7 py-4
                             font-body font-semibold text-[11px] tracking-[0.14em] uppercase
                             hover:bg-white hover:text-site-black transition-colors duration-200"
                >
                  VIEW PACKS
                  <span className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

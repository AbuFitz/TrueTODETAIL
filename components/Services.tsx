'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const services = [
  {
    id: 'exterior',
    index: '01',
    title: 'Exterior\nDetail',
    desc: 'Hand wash, clay bar decontamination, machine polish and paint sealant — all by hand, at your location.',
    dark: false,
  },
  {
    id: 'interior',
    index: '02',
    title: 'Interior\nDetail',
    desc: 'Steam clean, leather conditioning, carpet shampoo and extraction, and full interior sanitisation.',
    dark: false,
  },
  {
    id: 'paint',
    index: '03',
    title: 'Paint\nCorrection',
    desc: 'Remove swirl marks, fine scratches and oxidation. Single or multi-stage machine polishing tailored to your paint.',
    dark: false,
  },
  {
    id: 'ceramic',
    index: '04',
    title: 'Ceramic\nCoating',
    desc: 'Bond-level paint protection that delivers up to 2 years of hydrophobic, scratch-resistant gloss. Our flagship service.',
    dark: false,
    highlight: true,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white">
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
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-orange" />
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/35">What We Do</p>
            </div>
            <h2
              className="font-display font-black uppercase leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)' }}
            >
              EVERY SERVICE
              <br />
              <span className="text-orange">COVERED.</span>
            </h2>
          </div>
          <p className="font-body text-sm text-black/45 max-w-xs leading-relaxed">
            From a quick refresh to full ceramic protection — every level of care,
            mobile to your door.
          </p>
        </motion.div>

        {/* Service list */}
        <div className="flex flex-col divide-y divide-black/6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              className={`relative flex flex-col md:flex-row md:items-center gap-6 py-9 md:py-11 group ${
                svc.highlight ? 'overflow-hidden -mx-6 md:-mx-12 px-6 md:px-12' : ''
              }`}
            >
              {/* Ceramic background */}
              {svc.highlight && (
                <>
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&fit=crop&crop=center"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-15"
                  />
                  <div className="absolute inset-0 bg-site-black/88" />
                </>
              )}

              {/* Hover orange left rule — non-highlight rows */}
              {!svc.highlight && (
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-orange scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
              )}

              {/* Number */}
              <span
                className={`relative z-10 font-display font-black leading-none flex-shrink-0 w-14 transition-colors duration-200 ${
                  svc.highlight ? 'text-white/10' : 'text-black/8 group-hover:text-orange/20'
                }`}
                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
              >
                {svc.index}
              </span>

              {/* Title */}
              <h3
                className={`relative z-10 font-display font-black uppercase leading-[0.88] whitespace-pre-line flex-shrink-0 md:w-52 transition-colors duration-200 ${
                  svc.highlight ? 'text-white' : 'text-site-black group-hover:text-orange'
                }`}
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
              >
                {svc.title}
              </h3>

              {/* Divider line */}
              <div className={`relative z-10 hidden md:block h-px flex-1 transition-colors duration-200 ${
                svc.highlight ? 'bg-white/8' : 'bg-black/6 group-hover:bg-orange/20'
              }`} />

              {/* Description */}
              <p className={`relative z-10 font-body text-sm leading-relaxed md:w-[320px] flex-shrink-0 ${
                svc.highlight ? 'text-white/50' : 'text-black/45'
              }`}>
                {svc.desc}
              </p>

              {/* Ceramic CTA */}
              {svc.highlight && (
                <a
                  href="#packages"
                  className="btn-sweep relative z-10 flex-shrink-0 bg-orange text-white px-7 py-4 font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase flex items-center gap-4 hover:bg-white hover:text-site-black transition-colors duration-200"
                >
                  VIEW PACK &rarr;
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

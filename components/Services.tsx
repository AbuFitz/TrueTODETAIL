'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const services = [
  {
    id: 'exterior',
    index: '01',
    title: 'Exterior\nDetail',
    desc: 'Hand wash, clay bar decontamination, machine polish and paint sealant — all by hand, at your location.',
    dark: true,
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
    dark: true,
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
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-black/40">What We Do</p>
            </div>
            <h2 className="font-display text-5xl md:text-6xl xl:text-7xl uppercase leading-[0.88]">
              EVERY SERVICE
              <br />
              <span className="text-orange">COVERED.</span>
            </h2>
          </div>
          <p className="font-body text-sm text-black/45 max-w-xs leading-relaxed">
            From a quick refresh to full ceramic protection — we offer every level of care,
            mobile to your door.
          </p>
        </motion.div>

        {/* Service list — horizontal rows, clean and clear */}
        <div className="flex flex-col divide-y divide-black/8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              className={`flex flex-col md:flex-row md:items-center gap-6 py-8 md:py-10 ${svc.highlight ? 'bg-site-black -mx-6 md:-mx-12 px-6 md:px-12' : ''}`}
            >
              {/* Number */}
              <span className={`font-display text-5xl leading-none flex-shrink-0 w-16 ${svc.highlight ? 'text-white/15' : 'text-black/10'}`}>
                {svc.index}
              </span>

              {/* Title */}
              <h3 className={`font-display text-3xl md:text-4xl uppercase leading-[0.9] whitespace-pre-line flex-shrink-0 md:w-56 ${svc.highlight ? 'text-white' : 'text-site-black'}`}>
                {svc.title}
              </h3>

              {/* Divider */}
              <div className={`hidden md:block h-px flex-1 ${svc.highlight ? 'bg-white/10' : 'bg-black/8'}`} />

              {/* Description */}
              <p className={`font-body text-sm leading-relaxed md:w-80 flex-shrink-0 ${svc.highlight ? 'text-white/55' : 'text-black/50'}`}>
                {svc.desc}
              </p>

              {/* Ceramic CTA */}
              {svc.highlight && (
                <a
                  href="#packages"
                  className="flex-shrink-0 bg-orange text-white px-7 py-4 font-display font-black text-xs tracking-[0.15em] uppercase flex items-center gap-4 hover:bg-white hover:text-site-black transition-colors duration-200"
                >
                  VIEW PACK →
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}


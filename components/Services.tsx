'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const SERVICES = [
  {
    n:    '01',
    title: 'Exterior Detail',
    desc:  'Hand wash, clay bar decontamination, machine polish and protective sealant — all performed at your location with pro-grade products.',
    tag:  'From £89',
  },
  {
    n:    '02',
    title: 'Interior Detail',
    desc:  'Full steam clean, leather conditioning, carpet shampoo and extraction, and complete interior sanitisation.',
    tag:  'From £89',
  },
  {
    n:    '03',
    title: 'Paint Correction',
    desc:  'Remove swirl marks, fine scratches and oxidation using single or multi-stage machine polishing tailored to your paint.',
    tag:  'POA',
  },
  {
    n:    '04',
    title: 'Ceramic Coating',
    desc:  'Bond-level paint protection delivering up to 2 years of hydrophobic, scratch-resistant gloss. Our flagship service.',
    tag:  'From £549',
  },
]

export default function Services() {
  return (
    <section
      id="services"
      className="bg-parchment border-t border-ink/[0.06]"
      style={{ paddingTop: 'clamp(64px, 8vw, 120px)', paddingBottom: 'clamp(64px, 8vw, 120px)' }}
    >
      <div className="max-w-[1380px] mx-auto px-6 md:px-10">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-14 md:mb-20">
          <span className="w-5 h-px bg-orange flex-shrink-0" />
          <span className="section-label text-ink/35">What We Do</span>
        </div>

        {/* Two-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-12 lg:gap-20 items-start">

          {/* Left — sticky headline + photo */}
          <div className="lg:sticky lg:top-24">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="font-display text-ink leading-[0.88] mb-10"
              style={{ fontSize: 'clamp(54px, 7.5vw, 96px)', letterSpacing: '0.025em' }}
            >
              EVERY<br />SERVICE<br />COVERED.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="relative overflow-hidden"
              style={{ height: 'clamp(200px, 22vw, 320px)' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&q=90&fit=crop&crop=center"
                alt="Professional detailing"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-[13px] text-ink/35 leading-relaxed mt-6 max-w-xs"
            >
              All services are fully mobile. We cover Hemel Hempstead and the whole of Hertfordshire.
            </motion.p>
          </div>

          {/* Right — numbered service rows */}
          <div>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className="group flex items-start gap-6 py-8
                           border-b border-ink/[0.07] first:border-t cursor-default"
              >
                {/* Number */}
                <span className="font-body text-[10px] font-semibold text-ink/20 tracking-wider pt-1.5 flex-shrink-0 w-6">
                  {s.n}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3
                      className="font-display text-ink leading-none
                                 group-hover:text-orange transition-colors duration-200"
                      style={{ fontSize: 'clamp(26px, 3vw, 38px)', letterSpacing: '0.025em' }}
                    >
                      {s.title}
                    </h3>
                    <span
                      className="font-body font-semibold text-[11px] tracking-wide
                                 text-ink/30 border border-ink/12 px-2.5 py-1 flex-shrink-0 mt-1"
                    >
                      {s.tag}
                    </span>
                  </div>
                  <p className="font-body text-[14px] leading-[1.7] text-ink/45">
                    {s.desc}
                  </p>
                </div>

                {/* Arrow icon */}
                <div
                  className="flex-shrink-0 w-8 h-8 mt-0.5
                             border border-ink/10 flex items-center justify-center
                             text-ink/20 text-xs
                             group-hover:bg-orange group-hover:border-orange group-hover:text-white
                             transition-all duration-200"
                >
                  →
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

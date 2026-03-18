'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const pillars = [
  {
    number: '01',
    heading: 'Expert\nTechnicians',
    body: 'Trained, certified detailers who treat your car with the same care they\'d give their own.',
    light: true,
  },
  {
    number: '02',
    heading: 'Premium\nProducts',
    body: 'We use professional-grade chemicals, compounds and coatings — the same as trade specialists.',
    light: false,
  },
  {
    number: '03',
    heading: 'We Come\nTo You',
    body: 'Fully mobile and self-contained. We bring everything — water, power, equipment.',
    light: false,
  },
  {
    number: '04',
    heading: 'Honest\nPricing',
    body: 'See your price before you book. No surprises, no hidden add-ons, no upselling at the door.',
    light: true,
  },
]

export default function Stats() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="w-5 h-px bg-orange" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-black/40">Why True To Detail</p>
        </motion.div>

        {/* Split: headline left, pillars right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease }}
          >
            <h2 className="font-display text-5xl md:text-6xl xl:text-7xl uppercase leading-[0.88] text-site-black">
              BUILT ON
              <br />
              <span className="text-orange">DOING IT</span>
              <br />
              RIGHT.
            </h2>
            <p className="font-body text-sm text-black/45 leading-relaxed mt-8 max-w-xs">
              Every job is carried out to a standard we&apos;re proud to put our name on.
              No shortcuts. No half-measures.
            </p>
          </motion.div>

          {/* 2x2 pillars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/8">
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className={`p-8 md:p-10 flex flex-col gap-5 ${p.light ? 'bg-site-light' : 'bg-site-black'}`}
              >
                <span className={`font-display text-5xl leading-none ${p.light ? 'text-black/12' : 'text-white/10'}`}>
                  {p.number}
                </span>
                <div>
                  <h3 className={`font-display text-2xl uppercase leading-tight whitespace-pre-line ${p.light ? 'text-site-black' : 'text-white'}`}>
                    {p.heading}
                  </h3>
                  <p className={`font-body text-sm leading-relaxed mt-3 ${p.light ? 'text-black/50' : 'text-white/45'}`}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}


'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

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
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 mb-14"
        >
          <span className="w-5 h-px bg-orange" />
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/35">Why True To Detail</p>
        </motion.div>

        {/* Headline left, pillars right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-20 items-start">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease }}
            className="lg:sticky lg:top-32"
          >
            <h2
              className="font-display font-black uppercase leading-[0.88] text-site-black"
              style={{ fontSize: 'clamp(3.2rem, 5.5vw, 5.5rem)' }}
            >
              BUILT ON
              <br />
              <span className="text-orange">DOING IT</span>
              <br />
              RIGHT.
            </h2>
            <div className="w-10 h-[2px] bg-orange mt-7 mb-5" />
            <p className="font-body text-sm text-black/45 leading-relaxed max-w-[260px]">
              Every job is carried out to a standard we&apos;re proud to put our name on. No shortcuts. No half-measures.
            </p>
          </motion.div>

          {/* 2×2 pillars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className={`relative p-8 md:p-10 flex flex-col gap-5 overflow-hidden group ${p.light ? 'bg-site-light' : 'bg-site-black'}`}
              >
                {/* Ghost number — large background */}
                <span
                  className={`absolute -top-4 -right-2 font-display font-black leading-none select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1`}
                  style={{
                    fontSize: 'clamp(6rem, 10vw, 9rem)',
                    color: p.light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)',
                  }}
                >
                  {p.number}
                </span>

                {/* Orange top-left accent bar on hover */}
                <span className={`absolute top-0 left-0 w-0 h-[2px] bg-orange transition-all duration-500 group-hover:w-full`} />

                <div className="relative z-10">
                  <h3 className={`font-display font-black text-2xl md:text-3xl uppercase leading-[0.9] whitespace-pre-line mb-3 ${p.light ? 'text-site-black' : 'text-white'}`}>
                    {p.heading}
                  </h3>
                  <p className={`font-body text-sm leading-relaxed ${p.light ? 'text-black/50' : 'text-white/40'}`}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Full-width photo strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease }}
        className="relative mt-20 md:mt-28 h-[300px] md:h-[440px] overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1800&q=85&fit=crop&crop=center"
          alt="Car detailing in progress"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-site-black/60 via-site-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-site-black/40 to-transparent" />

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-end px-8 md:px-16 pb-10 md:pb-14">
          <div>
            <p
              className="font-display font-black uppercase text-white leading-none mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
            >
              Every Detail.
              <br />
              <span className="text-orange">Every Time.</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-white/30" />
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/40">
                Hemel Hempstead &amp; Hertfordshire
              </p>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  )
}

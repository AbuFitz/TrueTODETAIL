'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: i * 0.11,
    },
  }),
}

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-site-black">

      {/* ── Background image ── */}
      <Image
        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=2200&q=90"
        alt="A professionally detailed car"
        fill
        className="object-cover object-center"
        priority
      />

      {/* ── Dark gradient layers for legibility ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-site-black via-site-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-site-black/55 via-transparent to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pb-14 md:pb-20 pt-[110px]">

        {/* Overline */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex items-center gap-3 mb-10"
        >
          <span className="w-8 h-px bg-orange flex-shrink-0" />
          <p className="font-body text-[11px] tracking-[0.28em] uppercase text-white/50">
            Hemel Hempstead &amp; Surrounding Areas &nbsp;·&nbsp; 100% Mobile Service
          </p>
        </motion.div>

        {/* Main headline — three lines, last word in orange */}
        <div className="mb-10 md:mb-14">
          {['MAKE YOUR', 'CAR LOOK', 'FLAWLESS.'].map((line, i) => (
            <motion.h1
              key={line}
              custom={i + 1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="font-display text-[17vw] sm:text-[13vw] md:text-[10.5vw] lg:text-[9vw] uppercase leading-[0.88] text-white"
            >
              {i === 2 ? (
                <>
                  <span className="text-orange">FLAWLESS</span>
                  <span className="text-white">.</span>
                </>
              ) : (
                line
              )}
            </motion.h1>
          ))}
        </div>

        {/* Body + CTAs row */}
        <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">

          <motion.p
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-body text-white/50 text-base md:text-lg max-w-[360px] leading-relaxed"
          >
            Pro-grade detailing packs delivered to your door across Hertfordshire.
            Book in minutes — we arrive fully equipped.
          </motion.p>

          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
          >
            <button
              onClick={onBookNow}
              className="bg-orange text-white px-9 py-5 font-display font-black text-sm tracking-[0.15em] uppercase inline-flex items-center justify-between gap-8 hover:bg-orange-dark transition-colors duration-200"
            >
              SHOP PACKS
              <span className="text-xl leading-none">→</span>
            </button>
            <a
              href="#services"
              className="border border-white/20 text-white px-9 py-5 font-display font-black text-sm tracking-[0.15em] uppercase inline-flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-colors duration-200"
            >
              SEE SERVICES
            </a>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 md:mt-14 pt-7 border-t border-white/10 flex flex-wrap items-center gap-x-10 gap-y-4"
        >
          {[
            ['500+', 'Cars Detailed'],
            ['5★', 'Google Rated'],
            ['10+', 'Years Experience'],
            ['CERTIFIED', 'Detailers'],
          ].map(([val, label]) => (
            <div key={val} className="flex items-center gap-3">
              <span className="font-display text-2xl text-white leading-none">{val}</span>
              <span className="font-body text-[10px] tracking-widest uppercase text-white/40 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

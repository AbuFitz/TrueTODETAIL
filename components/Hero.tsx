'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section className="relative min-h-screen bg-site-black flex flex-col overflow-hidden">

      {/* ── Structural noise / texture layer — pure CSS, no image dependency ── */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── Orange edge accent ── */}
      <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-orange opacity-60" />

      {/* ── Top bar — nav clearance + location tag ── */}
      <div className="relative z-10 pt-[72px] px-6 md:px-14 lg:px-20 flex items-center justify-between mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="flex items-center gap-3"
        >
          <span className="w-5 h-px bg-orange" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/40">
            Hemel Hempstead &amp; Hertfordshire
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="font-body text-[10px] tracking-[0.2em] uppercase text-white/25"
        >
          Mobile Detailing
        </motion.p>
      </div>

      {/* ── Main content — fills available height ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-14 lg:px-20 pb-12 md:pb-16 pt-8 md:pt-12">

        {/* Headline block */}
        <div>
          {/* Pre-heading */}
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease }}
            className="font-body text-[11px] tracking-[0.35em] uppercase text-orange mb-7"
          >
            Professional Car Detailing
          </motion.p>

          {/* The big statement */}
          <div className="overflow-hidden">
            {['YOUR CAR.', 'PROPERLY', 'DETAILED.'].map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.h1
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease }}
                  className="font-display uppercase text-white leading-[0.85]"
                  style={{ fontSize: 'clamp(3.5rem, 11.5vw, 10rem)' }}
                >
                  {i === 1 ? <span className="text-orange">{line}</span> : line}
                </motion.h1>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row — descriptor + CTAs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pt-12 md:pt-16 border-t border-white/8 mt-10">

          {/* Left: value props as a minimal list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.65, ease }}
            className="flex flex-col gap-4"
          >
            {[
              'We come to your door. No drop-off.',
              'Pro-grade products & techniques.',
              'Fixed prices. No hidden charges.',
            ].map((point) => (
              <div key={point} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                <p className="font-body text-sm text-white/50 leading-snug">{point}</p>
              </div>
            ))}
          </motion.div>

          {/* Right: CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.78, ease }}
            className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
          >
            <button
              onClick={onBookNow}
              className="bg-orange text-white px-10 py-5 font-display font-black text-sm tracking-[0.15em] uppercase inline-flex items-center justify-between gap-10 hover:bg-white hover:text-site-black transition-colors duration-200"
            >
              VIEW PACKS
              <span className="text-base leading-none">→</span>
            </button>
            <a
              href="tel:+447984237149"
              className="border border-white/15 text-white/70 px-10 py-5 font-body font-semibold text-[11px] tracking-[0.18em] uppercase inline-flex items-center justify-center hover:border-white/40 hover:text-white transition-colors duration-200"
            >
              07984 237149
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom strip — horizontal scrolling fact bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1, ease }}
        className="relative z-10 border-t border-white/8 bg-site-black/60"
      >
        <div className="px-6 md:px-14 lg:px-20 py-4 flex flex-wrap items-center gap-x-10 gap-y-3">
          {[
            { n: '10+', t: 'Years Experience' },
            { n: 'CERTIFIED', t: 'Detailers' },
            { n: '100%', t: 'Mobile Service' },
            { n: 'FIXED', t: 'Transparent Pricing' },
          ].map(({ n, t }) => (
            <div key={n} className="flex items-center gap-2.5">
              <span className="font-display text-lg text-white leading-none">{n}</span>
              <span className="font-body text-[9px] tracking-[0.2em] uppercase text-white/30">{t}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}


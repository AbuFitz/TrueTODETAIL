'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section className="min-h-screen pt-[88px] flex flex-col md:grid md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px]">

      {/* ── LEFT: full-bleed image + orange text box overlay ── */}
      <div className="relative min-h-[72vw] md:min-h-0 overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=80&fit=crop&crop=center"
          alt="Professional car detailing"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />

        {/* Deep overlay so any image quality works */}
        <div className="absolute inset-0 bg-gradient-to-br from-site-black/80 via-site-black/55 to-site-black/40" />

        {/* Top-left mobile service tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="absolute top-8 left-8 md:left-12 flex items-center gap-2.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          <p className="font-body text-[10px] tracking-[0.28em] uppercase text-white/45">
            100% Mobile Service
          </p>
        </motion.div>

        {/* Orange text box — the centrepiece */}
        <div className="absolute left-8 md:left-12 lg:left-16 bottom-14 md:bottom-20">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease }}
            className="bg-orange px-8 py-9 md:px-10 md:py-11"
            style={{ maxWidth: 'clamp(260px, 28vw, 380px)' }}
          >
            <h1
              className="font-display font-extrabold text-site-black uppercase leading-[0.82] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
            >
              DETAILING<br />
              YOU CAN<br />
              TRUST.
            </h1>
          </motion.div>

          {/* Location line beneath box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="w-7 h-px bg-white/25" />
            <p className="font-body text-[10px] tracking-[0.24em] uppercase text-white/35">
              Hemel Hempstead &amp; Hertfordshire
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT: structured info panel ── */}
      <div className="bg-white flex flex-col border-t md:border-t-0 md:border-l border-black/10">

        {/* Top descriptor block */}
        <div className="flex-1 flex flex-col justify-between p-8 md:p-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease }}
              className="font-body text-[10px] tracking-[0.28em] uppercase text-black/30 mb-5"
            >
              Professional Car Detailing
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease }}
              className="font-body text-[15px] text-black/60 leading-[1.65] mb-8"
            >
              We bring certified detailers to your driveway. Pro-grade products,
              fixed prices, and results that hold up.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.68, ease }}
              className="space-y-3"
            >
              {[
                'No drop-off — we come to your door',
                'Fixed prices, no hidden charges',
                'Certified products & techniques',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                  <p className="font-body text-[13px] text-black/45">{point}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CTA button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease }}
            onClick={onBookNow}
            className="mt-10 w-full bg-site-black text-white py-[18px] font-display font-bold text-[14px] tracking-[0.2em] uppercase flex items-center justify-between px-7 hover:bg-orange transition-colors duration-200 group"
          >
            BOOK YOUR PACK
            <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">→</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/8" />

        {/* ── Video placeholder section ── */}
        <div className="relative h-[260px] md:h-[280px] bg-site-black overflow-hidden flex-shrink-0">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 60%, #111 100%)',
            }}
          />

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 40px)',
            }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.9, ease }}
              className="w-16 h-16 border border-white/15 rounded-full flex items-center justify-center hover:border-orange hover:bg-orange/10 transition-colors duration-300 cursor-pointer"
            >
              <span className="text-white text-xl ml-1">▶</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="font-body text-[10px] tracking-[0.3em] uppercase text-white/25"
            >
              Watch our work
            </motion.p>
          </div>

          {/* Bottom info strip */}
          <div className="absolute bottom-0 left-0 right-0 px-7 py-4 flex items-center justify-between border-t border-white/6">
            <a
              href="tel:+447984237149"
              className="font-body text-[11px] tracking-wider text-white/35 hover:text-white/65 transition-colors"
            >
              07984 237149
            </a>
            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] tracking-widest uppercase text-white/20">Mon–Sat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange/60" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


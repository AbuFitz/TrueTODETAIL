'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

// nav clearance: 28px (announcement) + 72px (nav) = 100px total
const NAV_H = 100

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      className="flex flex-col md:grid md:grid-cols-[1fr_460px] lg:grid-cols-[1fr_500px]"
      style={{ minHeight: `calc(100vh - ${NAV_H}px)`, marginTop: `${NAV_H}px` }}
    >

      {/* ── LEFT: full-bleed image + orange text box overlay ── */}
      <div className="relative min-h-[70vw] md:min-h-0 overflow-hidden">
        {/* Background photo — UK premium detailing */}
        <Image
          src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=85&fit=crop&crop=center"
          alt="Premium car detailing"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
        {/* Subtle dark vignette so the orange box pops off the image */}
        <div className="absolute inset-0 bg-gradient-to-br from-site-black/55 via-site-black/25 to-transparent" />

        {/* Mobile tag top-left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="absolute top-8 left-8 md:left-12 flex items-center gap-2.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/50">
            100% Mobile · Hemel Hempstead
          </p>
        </motion.div>

        {/* ── ORANGE TEXT BOX — vertically centred, large, bold, like reference ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease }}
          className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2"
        >
          <div
            className="bg-orange"
            style={{ padding: 'clamp(32px, 3.5vw, 52px) clamp(28px, 3vw, 46px)' }}
          >
            <h1
              className="font-display font-black text-site-black uppercase leading-[0.82]"
              style={{
                fontSize: 'clamp(3.6rem, 6.8vw, 6.2rem)',
                letterSpacing: '-0.025em',
              }}
            >
              DETAILING
              <br />YOU CAN
              <br />TRUST.
            </h1>
          </div>

          {/* Location line beneath */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75, ease }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="w-6 h-px bg-white/30" />
            <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40">
              Hemel Hempstead &amp; Hertfordshire
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT: small info area + large video section ── */}
      <div className="bg-white flex flex-col border-t md:border-t-0 md:border-l border-black/10">

        {/* Top info area — compact */}
        <div className="p-8 md:p-10 flex-shrink-0">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease }}
            className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/30 mb-5"
          >
            Professional Car Detailing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55, ease }}
            className="font-body text-[14px] leading-[1.65] text-black/55 mb-6"
          >
            Certified detailers to your door. Pro-grade results, fixed prices — no drop-off required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65, ease }}
            className="flex flex-col gap-2.5 mb-8"
          >
            {[
              'We come to you — driveway or car park',
              'Fixed prices, no hidden charges',
              'Professional grade products only',
            ].map((pt) => (
              <div key={pt} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                <p className="font-body text-[12px] text-black/45">{pt}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.76, ease }}
            onClick={onBookNow}
            className="w-full bg-site-black text-white py-5 font-mono font-semibold text-[11px] tracking-[0.18em] uppercase flex items-center justify-between px-7 hover:bg-orange transition-colors duration-200"
          >
            BOOK YOUR PACK
            <span className="text-base leading-none">→</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/8 flex-shrink-0" />

        {/* ── VIDEO SECTION — takes all remaining space ── */}
        <div className="relative flex-1 min-h-[320px] bg-site-black overflow-hidden">
          {/* Grid texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 48px),' +
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 48px)',
            }}
          />

          {/* Play button centred */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          >
            <button
              className="w-20 h-20 border border-white/15 rounded-full flex items-center justify-center hover:border-orange hover:bg-orange/10 transition-all duration-300 group"
              aria-label="Watch our work"
            >
              <span className="text-white text-2xl ml-1.5 group-hover:text-orange transition-colors">▶</span>
            </button>
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/25">Watch our work</p>
          </motion.div>

          {/* Bottom strip */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/6 px-8 py-4 flex items-center justify-between">
            <a
              href="tel:+447984237149"
              className="font-mono text-[10px] tracking-wider text-white/30 hover:text-white/60 transition-colors"
            >
              07984 237149
            </a>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-widest uppercase text-white/20">Mon–Sat 8am–7pm</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange/50" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

// Nav total offset: 28px announcement + 72px nav = 100px
const NAV_OFFSET = 100

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      className="flex flex-col md:grid md:grid-cols-[1fr_460px] lg:grid-cols-[1fr_500px]"
      style={{ minHeight: `calc(100vh - ${NAV_OFFSET}px)`, marginTop: `${NAV_OFFSET}px` }}
    >

      {/* LEFT: full-bleed photo + orange text box */}
      <div className="relative min-h-[65vw] md:min-h-0 overflow-hidden">

        {/* Background photo — user confirmed happy with this */}
        <Image
          src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=85&fit=crop&crop=center"
          alt="Premium car detailing"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />

        {/* Dark gradient — heavier left to let orange box read clearly */}
        <div className="absolute inset-0 bg-gradient-to-r from-site-black/65 via-site-black/30 to-transparent" />

        {/* Location tag — top left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="absolute top-8 left-8 md:left-12 flex items-center gap-2.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-white/50">
            100% Mobile · Hemel Hempstead
          </p>
        </motion.div>

        {/* ORANGE TEXT BOX — large, bold, vertically centred on photo */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2"
        >
          <div
            className="bg-orange"
            style={{ padding: 'clamp(36px, 4vw, 56px) clamp(30px, 3.5vw, 50px)' }}
          >
            <h1
              className="font-display font-extrabold uppercase text-site-black"
              style={{
                fontSize: 'clamp(4rem, 7.5vw, 7.5rem)',
                lineHeight: 0.82,
                letterSpacing: '-0.02em',
              }}
            >
              DETAILING
              <br />YOU CAN
              <br />TRUST.
            </h1>
          </div>

          {/* Location line beneath box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="w-7 h-px bg-white/25" />
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/35">
              Hemel Hempstead &amp; Hertfordshire
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT PANEL: info section + close-up photo (like S&Y reference) */}
      <div className="bg-white flex flex-col border-t md:border-t-0 md:border-l border-black/10">

        {/* TOP: compact info area */}
        <div className="flex flex-col justify-between p-9 md:p-10" style={{ flex: '0 0 auto' }}>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease }}
            className="font-mono text-[10px] tracking-[0.28em] uppercase text-black/30 mb-5"
          >
            Professional Car Detailing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55, ease }}
            className="font-body text-[15px] leading-[1.7] text-black/55 mb-7"
          >
            We bring certified detailers to your driveway. Pro-grade products, fixed prices, no drop-off required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65, ease }}
            className="flex flex-col gap-3 mb-8"
          >
            {[
              'We come to you — driveway or car park',
              'Fixed prices, no hidden charges',
              'Professional-grade products only',
            ].map((pt) => (
              <div key={pt} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                <p className="font-body text-[13px] text-black/45">{pt}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.76, ease }}
            onClick={onBookNow}
            className="w-full bg-site-black text-white py-5 font-mono font-semibold text-[11px] tracking-[0.18em] uppercase flex items-center justify-between px-7 hover:bg-orange transition-colors duration-200 group"
          >
            BOOK YOUR PACK
            <span className="text-base leading-none group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
          </motion.button>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-black/8 flex-shrink-0" />

        {/* BOTTOM: close-up detail photo fills remaining height (like S&Y bottom panel) */}
        <div className="relative flex-1 min-h-[260px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=85&fit=crop&crop=center"
            alt="Car paint close-up detail"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />
          {/* Overlay at bottom with contact info strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-site-black/75 to-transparent px-8 py-5 flex items-center justify-between">
            <a
              href="tel:+447984237149"
              className="font-mono text-[10px] tracking-wider text-white/40 hover:text-white/70 transition-colors"
            >
              07984 237149
            </a>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/25">Mon–Sat / 8am–7pm</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange/60" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const NAV_OFFSET = 100

const features = [
  'We come to you — driveway or car park',
  'Fixed prices, no hidden charges',
  'Professional-grade products only',
]

const trustItems = [
  { value: '100%', label: 'Mobile' },
  { value: '5★', label: 'Service' },
  { value: '0', label: 'Drop-off needed' },
]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      className="flex flex-col md:grid md:grid-cols-[1fr_460px] lg:grid-cols-[1fr_500px]"
      style={{ minHeight: `calc(100vh - ${NAV_OFFSET}px)`, marginTop: `${NAV_OFFSET}px` }}
    >

      {/* LEFT: full-bleed photo + orange text box */}
      <div className="relative min-h-[65vw] md:min-h-0 overflow-hidden">

        <Image
          src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=85&fit=crop&crop=center"
          alt="Premium car detailing"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />

        {/* Gradient — strong left, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-site-black/70 via-site-black/30 to-transparent" />
        {/* Bottom fade for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-site-black/40 via-transparent to-transparent" />

        {/* Location tag — top left */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="absolute top-8 left-8 md:left-12 flex items-center gap-2.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/45">
            Mobile Detailing · Hemel Hempstead
          </p>
        </motion.div>

        {/* MAIN HEADLINE BOX */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2"
        >
          <div
            className="bg-orange"
            style={{ padding: 'clamp(32px, 3.8vw, 52px) clamp(28px, 3.2vw, 48px)' }}
          >
            <h1
              className="font-display font-black uppercase text-site-black"
              style={{
                fontSize: 'clamp(3.8rem, 7.2vw, 7.8rem)',
                lineHeight: 0.85,
                letterSpacing: '-0.02em',
              }}
            >
              DETAILING
              <br />YOU CAN
              <br />TRUST.
            </h1>
          </div>

          {/* Sub-line beneath box */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.85, ease }}
            className="mt-5 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-orange/50" />
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/35">
              Hemel Hempstead &amp; Hertfordshire
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom-left scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease }}
          className="absolute bottom-8 left-8 md:left-12 hidden md:flex items-center gap-3"
        >
          <div className="flex flex-col gap-1">
            <span className="block w-px h-5 bg-white/20 mx-auto" />
            <span className="block w-px h-3 bg-white/10 mx-auto" />
          </div>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/25">Scroll</p>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white flex flex-col border-t md:border-t-0 md:border-l border-black/8">

        {/* TOP: info area */}
        <div className="flex flex-col justify-between p-9 md:p-10" style={{ flex: '0 0 auto' }}>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/25 mb-5"
          >
            Professional Car Detailing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease }}
            className="font-body text-[15px] leading-[1.75] text-black/50 mb-7"
          >
            We bring certified detailers to your driveway. Pro-grade products, fixed prices, no drop-off required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease }}
            className="flex flex-col gap-3 mb-8"
          >
            {features.map((pt, i) => (
              <div key={pt} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                <p className="font-body text-[13px] leading-snug text-black/45">{pt}</p>
              </div>
            ))}
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease }}
            className="grid grid-cols-3 border border-black/8 mb-7"
          >
            {trustItems.map((item, i) => (
              <div
                key={item.label}
                className={`px-4 py-3 text-center ${i < trustItems.length - 1 ? 'border-r border-black/8' : ''}`}
              >
                <p className="font-display font-black text-xl leading-none text-site-black">{item.value}</p>
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-black/30 mt-1.5">{item.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.78, ease }}
            onClick={onBookNow}
            className="btn-sweep w-full bg-site-black text-white py-5 font-mono font-semibold text-[11px] tracking-[0.18em] uppercase flex items-center justify-between px-7 hover:bg-orange transition-colors duration-200 group"
          >
            BOOK YOUR PACK
            <span className="text-sm leading-none group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/6 flex-shrink-0" />

        {/* BOTTOM: close-up photo */}
        <div className="relative flex-1 min-h-[260px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=85&fit=crop&crop=center"
            alt="Car paint close-up detail"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
          {/* Contact strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-site-black/80 via-site-black/40 to-transparent px-8 py-6 flex items-center justify-between">
            <a
              href="tel:+447984237149"
              className="font-mono text-[11px] tracking-wider text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              07984 237149
            </a>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">Mon–Sat / 8am–7pm</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange/70" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

// Nav height is 68px (no announcement bar)
const NAV_H = 68

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      className="flex flex-col md:grid md:grid-cols-[1fr_460px] lg:grid-cols-[1fr_500px]"
      style={{ minHeight: `calc(100vh - ${NAV_H}px)`, marginTop: `${NAV_H}px` }}
    >

      {/* ── LEFT: clean photo + orange headline box (no dark overlay) ── */}
      <div className="relative min-h-[65vw] md:min-h-0 overflow-hidden bg-[#E8E8E8]">

        <Image
          src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1800&q=85&fit=crop&crop=center"
          alt="Premium car detailing"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />

        {/* Orange headline box — centred on photo, like the reference */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{ left: 'clamp(32px, 8vw, 100px)' }}
        >
          <div className="bg-orange" style={{ padding: 'clamp(28px, 3.5vw, 48px) clamp(24px, 3vw, 42px)' }}>
            <h1
              className="font-display font-black uppercase text-site-black"
              style={{
                fontSize: 'clamp(4rem, 8vw, 8.5rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.01em',
              }}
            >
              DETAILING
              <br />YOU CAN
              <br />TRUST.
            </h1>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="bg-white flex flex-col border-t md:border-t-0 md:border-l border-black/8">

        {/* TOP: white space + description + CTA — mirrors reference */}
        <div className="flex flex-col justify-center flex-1 px-10 py-12 md:py-16" style={{ minHeight: '45%' }}>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
            className="font-body text-[11px] tracking-[0.28em] uppercase text-black/30 mb-8"
          >
            Professional Car Detailing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45, ease }}
            className="font-body text-[17px] leading-[1.65] text-black/60 mb-10"
          >
            We bring certified detailers directly to your driveway — pro-grade products, fixed prices, no drop-off required.
          </motion.p>

          {/* Feature points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.55, ease }}
            className="flex flex-col gap-3 mb-10"
          >
            {[
              'We come to you — driveway or car park',
              'Fixed prices with no hidden charges',
              'Professional-grade products only',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                <span className="font-body text-sm text-black/50">{item}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA button — same style as reference "SCHEDULE SERVICE" */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65, ease }}
            onClick={onBookNow}
            className="w-full bg-site-black text-white px-7 py-5
                       font-body font-semibold text-[11px] tracking-[0.14em] uppercase
                       flex items-center justify-between
                       hover:bg-orange transition-colors duration-200 group"
          >
            BOOK YOUR PACK
            <span className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0 group-hover:bg-white/70 transition-colors duration-200" />
          </motion.button>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.75, ease }}
            className="mt-6 flex items-center gap-5"
          >
            <a
              href="tel:+447984237149"
              className="font-body text-[12px] text-black/40 hover:text-site-black transition-colors duration-150"
            >
              07984 237149
            </a>
            <span className="w-px h-3 bg-black/15" />
            <span className="font-body text-[12px] text-black/30">Mon–Sat · 8am–7pm</span>
          </motion.div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-black/8 flex-shrink-0" />

        {/* BOTTOM: VIDEO — autoplay, muted, looping background video */}
        <div className="relative flex-1 min-h-[280px] overflow-hidden bg-site-black">
          {/*
            Free stock video: "Person Doing a Car Wash" — Pexels ID 4863282
            License: Pexels License (free for commercial use, no attribution required)
            Replace with your own branded video for production.
          */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/4863282/4863282-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
            {/* Fallback embed if direct MP4 is blocked */}
            <iframe
              src="https://www.pexels.com/video/4863282/embed?autoplay=1&loop=1"
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
              allow="autoplay; fullscreen"
              title="Car detailing video"
            />
          </video>
          {/* Bottom info strip */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none
                          bg-gradient-to-t from-site-black/70 to-transparent px-8 py-5
                          flex items-center justify-between">
            <span className="font-body text-[11px] tracking-[0.18em] uppercase text-white/40">
              Professional Detail
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange/70" />
          </div>
        </div>

      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const TICKER = [
  'Mobile Service',
  'Fixed Pricing',
  'Hertfordshire',
  'No Drop-Off',
  'Ceramic Coating',
  'Book Online',
  'Professional Grade',
  'We Come To You',
]

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <div style={{ paddingTop: '64px' }}>

      {/* ── Main hero split ── */}
      <section
        className="grid grid-cols-1 md:grid-cols-[55%_45%]"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >

        {/* LEFT — ink panel, all text */}
        <div className="bg-ink flex flex-col justify-between px-8 md:px-14 lg:px-20 py-14 md:py-16">

          {/* Top brand label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="section-label text-white/20"
          >
            True To Detail — Hertfordshire, UK
          </motion.p>

          {/* Centre: massive headline */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
          >
            <h1
              className="font-display text-white leading-[0.88]"
              style={{
                fontSize: 'clamp(72px, 13vw, 156px)',
                letterSpacing: '0.025em',
              }}
            >
              DETAIL<br />DONE<br />RIGHT.
            </h1>
          </motion.div>

          {/* Bottom: desc + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="space-y-7"
          >
            <p className="font-body text-[15px] leading-[1.75] text-white/40 max-w-[340px]">
              Professional mobile detailing straight to your driveway. Fixed prices, no drop-off needed, results that speak for themselves.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onBookNow}
                className="font-body font-semibold text-[12px] tracking-[0.1em] uppercase
                           bg-orange text-white px-8 py-4
                           hover:bg-orange-dark transition-colors duration-200
                           flex items-center gap-4"
              >
                Book Your Detail
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
              </button>

              <a
                href="tel:+447984237149"
                className="font-body text-[13px] text-white/30
                           hover:text-white/60 transition-colors duration-200"
              >
                07984 237149
              </a>
            </div>

            {/* Three quick facts */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {['100% mobile', 'Fixed prices', 'No drop-off'].map((fact) => (
                <span key={fact} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange flex-shrink-0" />
                  <span className="font-body text-[12px] text-white/30">{fact}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT — full-bleed photo */}
        <div className="relative min-h-[60vw] md:min-h-0 overflow-hidden bg-ink-1">
          <Image
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1400&q=90&fit=crop&crop=center"
            alt="Premium car being detailed"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
          {/* Subtle left bleed into dark panel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(12,12,12,0.35) 0%, transparent 30%)',
            }}
          />
        </div>
      </section>

      {/* ── Ticker strip ── */}
      <div className="bg-ink border-t border-white/[0.05] py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-6">
              <span
                className="font-display text-white/30 uppercase"
                style={{ fontSize: '12px', letterSpacing: '0.2em' }}
              >
                {item}
              </span>
              <span className="w-[3px] h-[3px] rounded-full bg-orange/50 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

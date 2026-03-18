'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const infoItems = [
  '100% Mobile Service',
  'Hemel Hempstead & Hertfordshire',
  'Mon–Sat · 8am–7pm',
  'hello@truetodetail.co.uk',
]

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section id="contact" className="relative bg-orange overflow-hidden">

      {/* Decorative large text background */}
      <div
        className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-black uppercase leading-none text-site-black/[0.06] whitespace-nowrap"
          style={{ fontSize: 'clamp(8rem, 18vw, 22rem)' }}
        >
          TTD
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-12"
        >
          {/* Headline */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-5 h-px bg-site-black/30" />
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-site-black/40">Ready To Book</p>
            </div>
            <h2
              className="font-display font-black uppercase leading-[0.85] text-site-black"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 7.5rem)' }}
            >
              READY WHEN
              <br />
              YOU ARE.
            </h2>
            <p className="font-body text-base text-site-black/55 mt-6 max-w-sm leading-relaxed">
              Book online in minutes, pick your date and we&apos;ll be there.
              No drop-off. No waiting. Just results.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <button
              onClick={onBookNow}
              className="btn-sweep bg-site-black text-white px-10 py-5 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase inline-flex items-center justify-between gap-12 hover:bg-site-dark transition-colors duration-200"
            >
              BOOK YOUR PACK
              <span className="text-sm">&rarr;</span>
            </button>
            <a
              href="tel:+447984237149"
              className="border border-site-black/20 text-site-black px-10 py-5 font-mono font-semibold text-[11px] tracking-[0.18em] uppercase inline-flex items-center justify-center hover:border-site-black hover:bg-site-black/5 transition-all duration-200"
            >
              CALL &nbsp; 07984 237149
            </a>
          </div>
        </motion.div>

        {/* Bottom info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-site-black/12 flex flex-wrap items-center gap-x-10 gap-y-3"
        >
          {infoItems.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="hidden sm:block w-px h-3 bg-site-black/15" />}
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-site-black/40">
                {item}
              </span>
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

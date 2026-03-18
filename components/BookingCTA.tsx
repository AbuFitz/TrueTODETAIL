'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section id="contact" className="relative bg-orange overflow-hidden">

      {/* Decorative large background text */}
      <div
        className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-8"
        aria-hidden
      >
        <span
          className="font-display font-black uppercase leading-none text-site-black/[0.07] whitespace-nowrap"
          style={{ fontSize: 'clamp(6rem, 16vw, 20rem)' }}
        >
          TTD
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div>
            <p className="font-body text-[11px] tracking-[0.28em] uppercase text-site-black/40 mb-6">
              Ready To Book
            </p>
            <h2
              className="font-display font-black uppercase leading-[0.88] text-site-black"
              style={{ fontSize: 'clamp(3.2rem, 7vw, 7.5rem)' }}
            >
              READY WHEN
              <br />
              YOU ARE.
            </h2>
            <p className="font-body text-[16px] text-site-black/55 mt-6 max-w-sm leading-relaxed">
              Book online in minutes, pick your date and we&apos;ll be there. No drop-off. No waiting. Just results.
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0">
            <button
              onClick={onBookNow}
              className="flex items-center justify-between gap-12 bg-site-black text-white
                         px-10 py-5 font-body font-semibold text-[11px] tracking-[0.14em] uppercase
                         hover:bg-site-dark transition-colors duration-200 group"
            >
              BOOK YOUR PACK
              <span className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors duration-200" />
            </button>
            <a
              href="tel:+447984237149"
              className="flex items-center justify-center px-10 py-5 border border-site-black/20
                         font-body font-semibold text-[11px] tracking-[0.14em] uppercase text-site-black
                         hover:border-site-black hover:bg-site-black/5 transition-all duration-200"
            >
              CALL 07984 237149
            </a>
          </div>
        </motion.div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-14 pt-8 border-t border-site-black/12 flex flex-wrap items-center gap-x-8 gap-y-3"
        >
          {[
            '100% Mobile Service',
            'Hemel Hempstead & Hertfordshire',
            'Mon–Sat · 8am–7pm',
            'hello@truetodetail.co.uk',
          ].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="hidden sm:block w-px h-3 bg-site-black/15" />}
              <span className="font-body text-[11px] tracking-[0.2em] uppercase text-site-black/40">
                {item}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section id="contact" className="bg-orange">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-12"
        >
          {/* Headline */}
          <div>
            <h2 className="font-display font-black text-6xl md:text-7xl xl:text-8xl uppercase leading-[0.85] text-site-black">
              READY WHEN
              <br />
              YOU ARE.
            </h2>
            <p className="font-body text-base text-site-black/60 mt-6 max-w-sm leading-relaxed">
              Book online in minutes, pick your date and we&apos;ll be there.
              No drop-off. No waiting. Just results.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <button
              onClick={onBookNow}
              className="bg-site-black text-white px-10 py-5 font-display font-black text-sm tracking-[0.15em] uppercase inline-flex items-center justify-between gap-12 hover:bg-site-dark transition-colors duration-200"
            >
              BOOK YOUR PACK
              <span className="text-base">→</span>
            </button>
            <a
              href="tel:+447984237149"
              className="border-2 border-site-black/20 text-site-black px-10 py-5 font-body font-semibold text-[11px] tracking-[0.18em] uppercase inline-flex items-center justify-center hover:border-site-black transition-colors duration-200"
            >
              CALL &nbsp; 07984 237149
            </a>
          </div>
        </motion.div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-site-black/15 flex flex-wrap items-center gap-x-10 gap-y-3"
        >
          {[
            '100% Mobile Service',
            'Hemel Hempstead & Hertfordshire',
            'Mon–Sat · 8am–7pm',
            'hello@truetodetail.co.uk',
          ].map((item) => (
            <span key={item} className="font-body text-[10px] tracking-[0.2em] uppercase text-site-black/45">
              {item}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}


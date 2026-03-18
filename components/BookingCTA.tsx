'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      id="contact"
      className="relative bg-ink overflow-hidden border-t border-white/[0.05]"
      style={{ paddingTop: 'clamp(80px, 10vw, 140px)', paddingBottom: 'clamp(80px, 10vw, 140px)' }}
    >

      {/* Large ghost text */}
      <div
        className="absolute inset-0 flex items-center justify-end overflow-hidden
                   pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-display text-white/[0.03] whitespace-nowrap leading-none pr-0"
          style={{ fontSize: 'clamp(120px, 22vw, 280px)', letterSpacing: '0.04em' }}
        >
          BOOK NOW
        </span>
      </div>

      <div className="relative z-10 max-w-[1380px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end"
        >

          {/* Left: headline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-5 h-px bg-orange flex-shrink-0" />
              <span className="section-label text-white/25">Ready To Book</span>
            </div>
            <h2
              className="font-display text-white leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(64px, 10vw, 130px)', letterSpacing: '0.025em' }}
            >
              READY<br />WHEN YOU<br /><span className="text-orange">ARE.</span>
            </h2>
            <p className="font-body text-[15px] text-white/40 leading-[1.75] max-w-sm">
              Book online in minutes. Pick your date, we&apos;ll be there. No drop-off, no waiting. Just results.
            </p>
          </div>

          {/* Right: CTAs + info strip */}
          <div>
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={onBookNow}
                className="btn-cta w-full py-5 text-[13px]"
              >
                Book Your Pack
                <span className="dot" />
              </button>
              <a
                href="tel:+447984237149"
                className="w-full flex items-center justify-center py-5 border border-white/15
                           font-body font-semibold text-[12px] tracking-[0.08em] uppercase
                           text-white/50 hover:border-white/35 hover:text-white/80
                           transition-all duration-200"
              >
                Call 07984 237149
              </a>
            </div>

            {/* Info items */}
            <div className="border-t border-white/[0.07] pt-8 grid grid-cols-2 gap-y-5 gap-x-8">
              {[
                ['Service Area',   'Hemel Hempstead & Hertfordshire'],
                ['Hours',          'Mon–Sat, 8am–7pm'],
                ['Phone',          '07984 237149'],
                ['Email',          'hello@truetodetail.co.uk'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="section-label text-white/20 mb-1">{label}</p>
                  <p className="font-body text-[13px] text-white/50">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

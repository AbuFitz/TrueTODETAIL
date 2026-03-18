'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const reasons = [
  {
    number: '01',
    title: 'Precision Every Time',
    desc: "We won't start a job we can't finish properly. Every detail is carried out to a standard we're prepared to put our name behind.",
  },
  {
    number: '02',
    title: 'We Come To You',
    desc: 'Fully mobile and self-sufficient. You keep your routine — we show up at your driveway, office or wherever suits you.',
  },
  {
    number: '03',
    title: 'Transparent Pricing',
    desc: 'Your price is locked in before you book. No surprises, no upsells, no extra charges on the day.',
  },
  {
    number: '04',
    title: 'We Stand Behind Our Work',
    desc: "If you're not completely happy, we'll come back and make it right. No awkward conversations — that's just how we operate.",
  },
]

export default function HowItWorks({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section>

      {/* ── BLACK BANNER HEADLINE — like "MEET SANDERS & YOUNG" in reference ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease }}
        className="bg-site-black py-8 md:py-10 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-display font-black uppercase text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', letterSpacing: '-0.01em' }}
          >
            MEET TRUE TO DETAIL
          </h2>
        </div>
      </motion.div>

      {/* ── TWO-COLUMN: photo left, content right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT: photo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease }}
          className="relative min-h-[340px] lg:min-h-[600px] overflow-hidden bg-site-light"
        >
          <Image
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&q=85&fit=crop&crop=center"
            alt="Professional detailer at work"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        {/* RIGHT: reasons + CTAs */}
        <div className="bg-white px-8 md:px-12 py-12 md:py-16 flex flex-col justify-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease }}
            className="mb-10"
          >
            <p className="font-body text-[11px] tracking-[0.28em] uppercase text-black/30 mb-4">
              Why Choose Us
            </p>
            <p className="font-body text-[16px] leading-[1.7] text-black/55 max-w-md">
              We built this business on doing the job properly — not on taking shortcuts or chasing volume.
            </p>
          </motion.div>

          {/* Reason list — two-col label/description like reference */}
          <div className="flex flex-col divide-y divide-black/8 mb-12">
            {reasons.map((r, i) => (
              <motion.div
                key={r.number}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, ease, delay: i * 0.07 }}
                className="grid grid-cols-[auto_1fr] gap-x-8 py-6 group"
              >
                <div>
                  <p className="font-body font-semibold text-[14px] text-site-black group-hover:text-orange transition-colors duration-150">
                    {r.title}
                  </p>
                </div>
                <p className="font-body text-[14px] text-black/45 leading-relaxed">
                  {r.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, ease, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={onBookNow}
              className="flex items-center justify-between gap-8 bg-site-black text-white
                         px-8 py-5 font-body font-semibold text-[11px] tracking-[0.14em] uppercase
                         hover:bg-orange transition-colors duration-200 group"
            >
              BOOK YOUR PACK
              <span className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors duration-200" />
            </button>
            <a
              href="tel:+447984237149"
              className="flex items-center justify-center px-8 py-5 border border-black/15
                         font-body font-semibold text-[11px] tracking-[0.14em] uppercase text-black/55
                         hover:border-black/40 hover:text-site-black transition-all duration-200"
            >
              07984 237149
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

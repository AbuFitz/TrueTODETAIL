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
    desc: 'Choose a pack, choose your vehicle. Your price is locked in before you book. No surprises, no extra charges on the day.',
  },
  {
    number: '04',
    title: 'We Stand Behind Our Work',
    desc: "If you're not completely happy, we'll come back and make it right. No awkward conversations — that's just how we operate.",
  },
]

export default function HowItWorks({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section className="py-24 md:py-32 bg-site-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header + two-column layout: text left, photo right on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-0 items-stretch">

          {/* LEFT COLUMN */}
          <div className="lg:pr-16">

          {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-orange" />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">Why Choose Us</p>
            </div>
            <h2 className="font-display font-black text-5xl md:text-6xl xl:text-7xl uppercase leading-[0.88] text-white">
              TRUE TO
              <br />
              <span className="text-orange">DETAIL.</span>
              <br />
              IN EVERY WAY.
            </h2>
          </div>
          <p className="font-body text-sm text-white/35 max-w-xs leading-relaxed">
            We built this business on doing the job properly — not on taking shortcuts.
          </p>
        </motion.div>

          {/* Reasons */}
        <div className="flex flex-col gap-0 border-t border-white/8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.number}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              className="grid grid-cols-[48px_1fr] md:grid-cols-[80px_220px_1fr] gap-0 border-b border-white/8 py-7 md:py-9 items-start md:items-center"
            >
              <span className="font-display text-2xl text-white/15 leading-none pt-1">{r.number}</span>
              <h3 className="font-display text-xl md:text-2xl uppercase leading-tight text-white pr-8">{r.title}</h3>
              <p className="font-body text-sm text-white/40 leading-relaxed col-start-2 md:col-start-3 mt-2 md:mt-0 max-w-lg">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease, delay: 0.25 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onBookNow}
            className="bg-orange text-white px-10 py-5 font-display font-black text-sm tracking-[0.15em] uppercase inline-flex items-center justify-between gap-10 hover:bg-white hover:text-site-black transition-colors duration-200"
          >
            BOOK YOUR PACK
            <span className="text-base">→</span>
          </button>
          <a
            href="tel:+447984237149"
            className="border border-white/15 text-white/60 px-10 py-5 font-body font-semibold text-[11px] tracking-[0.18em] uppercase inline-flex items-center justify-center hover:border-white/35 hover:text-white transition-colors duration-200"
          >
            OR CALL 07984 237149
          </a>
        </motion.div>

          </div>{/* end left column */}

          {/* RIGHT COLUMN: photo panel */}
          <div className="hidden lg:block relative border-l border-white/8 overflow-hidden min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=85&fit=crop&crop=center"
              alt="Detailer at work"
              fill
              sizes="360px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-site-black/60" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/35 mb-2">
                Certified detailers
              </p>
              <div className="w-8 h-px bg-orange" />
            </div>
          </div>

        </div>{/* end two-column grid */}

      </div>
    </section>
  )
}


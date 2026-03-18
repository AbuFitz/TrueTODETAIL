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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-0 items-stretch">

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
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25">Why Choose Us</p>
                </div>
                <h2
                  className="font-display font-black uppercase leading-[0.88] text-white"
                  style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)' }}
                >
                  TRUE TO
                  <br />
                  <span className="text-orange">DETAIL.</span>
                  <br />
                  IN EVERY WAY.
                </h2>
              </div>
              <p className="font-body text-sm text-white/30 max-w-xs leading-relaxed">
                We built this business on doing the job properly — not on taking shortcuts.
              </p>
            </motion.div>

            {/* Reasons */}
            <div className="flex flex-col border-t border-white/6">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.number}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                  className="group grid grid-cols-[48px_1fr] md:grid-cols-[72px_200px_1fr] gap-0 border-b border-white/6 py-8 md:py-10 items-start md:items-center cursor-default"
                >
                  <span className="font-mono text-[10px] tracking-wider text-white/15 leading-none pt-1.5 tabular-nums">{r.number}</span>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase leading-tight text-white pr-8 group-hover:text-orange transition-colors duration-200">
                    {r.title}
                  </h3>
                  <p className="font-body text-[13px] text-white/35 leading-relaxed col-start-2 md:col-start-3 mt-2 md:mt-0 max-w-md group-hover:text-white/50 transition-colors duration-200">
                    {r.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, ease, delay: 0.25 }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onBookNow}
                className="btn-sweep bg-orange text-white px-10 py-5 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase inline-flex items-center justify-between gap-10 hover:bg-white hover:text-site-black transition-colors duration-200"
              >
                BOOK YOUR PACK
                <span className="text-sm">&rarr;</span>
              </button>
              <a
                href="tel:+447984237149"
                className="border border-white/12 text-white/50 px-10 py-5 font-mono font-semibold text-[11px] tracking-[0.18em] uppercase inline-flex items-center justify-center hover:border-white/30 hover:text-white/80 transition-all duration-200"
              >
                OR CALL 07984 237149
              </a>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: photo panel */}
          <div className="hidden lg:block relative border-l border-white/6 overflow-hidden min-h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=85&fit=crop&crop=center"
              alt="Detailer at work"
              fill
              sizes="380px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-site-black/90 via-site-black/40 to-site-black/20" />

            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
              <p className="font-display font-black text-3xl uppercase leading-tight text-white mb-3">
                Certified<br />
                <span className="text-orange">Detailers</span>
              </p>
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-orange" />
                <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/30">
                  Hemel Hempstead
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

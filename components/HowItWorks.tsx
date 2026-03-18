'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const REASONS = [
  {
    n:     '01',
    title: 'Precision Every Time',
    body:  "We won't start a job we can't finish properly. Every detail is carried out to a standard we're proud to put our name on.",
  },
  {
    n:     '02',
    title: 'We Come To You',
    body:  'Fully mobile and self-sufficient. You keep your routine — we show up wherever suits you.',
  },
  {
    n:     '03',
    title: 'Transparent Pricing',
    body:  'Your price is locked in before you book. No surprises, no upsells, no extra charges on the day.',
  },
  {
    n:     '04',
    title: 'We Stand Behind Our Work',
    body:  "If you're not happy, we'll make it right. No awkward conversations — that's simply how we operate.",
  },
]

export default function HowItWorks({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section
      className="bg-white border-t border-ink/[0.06]"
      style={{ paddingTop: 'clamp(64px, 8vw, 120px)', paddingBottom: 'clamp(64px, 8vw, 120px)' }}
    >
      <div className="max-w-[1380px] mx-auto px-6 md:px-10">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-14 md:mb-20">
          <span className="w-5 h-px bg-orange flex-shrink-0" />
          <span className="section-label text-ink/35">Why Choose Us</span>
        </div>

        {/* Two-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — headline + photo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <h2
              className="font-display text-ink leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(54px, 7.5vw, 96px)', letterSpacing: '0.025em' }}
            >
              MEET<br />TRUE TO<br />DETAIL.
            </h2>
            <p className="font-body text-[15px] leading-[1.75] text-ink/45 mb-10 max-w-sm">
              We built this business on doing the job properly — not on cutting corners or chasing volume. Here&apos;s what that means in practice.
            </p>

            {/* Photo */}
            <div
              className="relative overflow-hidden"
              style={{ height: 'clamp(220px, 26vw, 380px)' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&q=90&fit=crop&crop=center"
                alt="Detailer working on a car"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right — reasons */}
          <div className="flex flex-col justify-between gap-0">
            {REASONS.map((r, i) => (
              <motion.div
                key={r.n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className="grid grid-cols-[auto_1fr] gap-x-7 py-7
                           border-b border-ink/[0.07] first:border-t group cursor-default"
              >
                <span className="font-body text-[10px] font-semibold text-ink/20 tracking-wider pt-1.5 flex-shrink-0 w-6">
                  {r.n}
                </span>
                <div>
                  <h3
                    className="font-body font-semibold text-[15px] text-ink mb-2
                               group-hover:text-orange transition-colors duration-200"
                  >
                    {r.title}
                  </h3>
                  <p className="font-body text-[14px] leading-[1.7] text-ink/45">
                    {r.body}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3 pt-8"
            >
              <button
                onClick={onBookNow}
                className="btn-cta flex-1 justify-between"
              >
                Book Your Pack
                <span className="dot" />
              </button>
              <a
                href="tel:+447984237149"
                className="flex-1 flex items-center justify-center border border-ink/12 py-4
                           font-body font-semibold text-[12px] tracking-[0.08em] uppercase
                           text-ink/50 hover:border-ink/30 hover:text-ink transition-all duration-200"
              >
                07984 237149
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const FEATURES = [
  {
    title: 'Fully Mobile',
    body:  'We come to your home, office or car park — fully self-sufficient with our own power and water.',
  },
  {
    title: 'Fixed Pricing',
    body:  'Your price is locked in before you book. No hidden charges, no surprises on the day.',
  },
  {
    title: 'No Drop-Off',
    body:  'Keep your schedule. Your car stays right where it is while we work.',
  },
  {
    title: 'Hertfordshire',
    body:  'Based in Hemel Hempstead, covering the whole of Hertfordshire and surrounding areas.',
  },
]

export default function Stats() {
  return (
    <section id="about" className="bg-white border-t border-ink/[0.06]">
      <div className="max-w-[1380px] mx-auto">

        {/* 4-column grid — each feature is one column */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-ink/[0.06]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.07 }}
              className="px-8 md:px-10 py-10 md:py-12"
            >
              <span className="block font-body text-[10px] tracking-[0.22em] uppercase text-ink/25 font-semibold mb-4">
                0{i + 1}
              </span>
              <h3
                className="font-display text-ink leading-[0.9] mb-4"
                style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '0.03em' }}
              >
                {f.title}
              </h3>
              <p className="font-body text-[13px] leading-[1.7] text-ink/45">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

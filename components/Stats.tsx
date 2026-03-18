'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

// Honest facts — no fake stats for a new business
const cards = [
  {
    heading: 'Mobile',
    sub: '100% — we come to you',
    light: true,
  },
  {
    heading: 'Fixed\nPrice',
    sub: 'No hidden charges, ever',
    light: false,
  },
  {
    heading: 'No\nDrop-Off',
    sub: 'Your driveway, your schedule',
    light: false,
  },
  {
    heading: 'Hertsford-\nshire',
    sub: 'Hemel Hempstead & surrounding areas',
    light: true,
  },
]

export default function Stats() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Two-column layout — headline + image left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT: headline + photo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="font-body text-[11px] tracking-[0.28em] uppercase text-black/30 mb-6">
              Why True To Detail
            </p>
            <h2
              className="font-display font-black uppercase text-site-black leading-[0.88] mb-12"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}
            >
              HERTFORDSHIRE'S
              <br />
              PREMIUM MOBILE
              <br />
              DETAIL SERVICE
            </h2>

            {/* Photo */}
            <div className="relative h-[320px] md:h-[380px] overflow-hidden bg-site-light">
              <Image
                src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&q=85&fit=crop&crop=center"
                alt="Car detailing in progress"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* RIGHT: 2×2 card grid — large bold text, alternating light/dark */}
          <div className="grid grid-cols-2 gap-px bg-black/8 self-start">
            {cards.map((card, i) => (
              <motion.div
                key={card.heading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className={`flex flex-col justify-between p-7 md:p-8 min-h-[220px] md:min-h-[260px] ${
                  card.light ? 'bg-site-light' : 'bg-site-black'
                }`}
              >
                {/* Big bold heading — fills the card like reference */}
                <h3
                  className={`font-display font-black uppercase leading-[0.85] whitespace-pre-line ${
                    card.light ? 'text-site-black' : 'text-white'
                  }`}
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
                >
                  {card.heading}
                </h3>

                {/* Bottom label */}
                <div className={`border-t pt-3 mt-auto ${card.light ? 'border-black/10' : 'border-white/10'}`}>
                  <p className={`font-body text-[12px] leading-snug ${card.light ? 'text-black/50' : 'text-white/45'}`}>
                    {card.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { faqJsonLd, jsonLdGraph } from '@/lib/jsonld'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const FAQS = [
  {
    q: 'How long does a detail take?',
    a: 'It depends on the package: Essential runs 2–3 hours, Full Valet 4–5 hours, and Premium Detail 6–7 hours. We confirm an exact arrival window the morning of your booking.',
  },
  {
    q: 'Do you offer mobile car detailing near me?',
    a: 'Yes. We are a fully mobile service based in Hemel Hempstead. We come directly to your home, workplace or any convenient location, covering roughly a 25-mile radius across Hertfordshire and selected areas of Buckinghamshire, Bedfordshire and North West London.',
  },
  {
    q: 'What areas do you cover?',
    a: "Hertfordshire in full, including Watford, St Albans, Berkhamsted, Harpenden, Kings Langley, Tring, Rickmansworth and Radlett, plus parts of Buckinghamshire (Chesham, Amersham, High Wycombe), Bedfordshire (Luton, Dunstable) and North West London (Borehamwood, Bushey). See our full Areas We Cover page for postcodes and local details, or drop us a message if you're not sure.",
  },
  {
    q: 'What is included in a full car detail?',
    a: 'Our Premium Detail covers everything in the Full Valet package (deep interior clean, seat shampoo, carpet extraction and spray wax) plus clay bar decontamination, light machine polish, paint sealant, trim restoration and odour treatment. Every stage is completed with professional-grade products and equipment.',
  },
  {
    q: 'How often should I detail my car?',
    a: 'For most drivers, a thorough detail every 3–6 months is ideal. This keeps contamination from bonding permanently to your paintwork and interior surfaces, and makes each subsequent detail quicker. If your vehicle has a ceramic coating, regular maintenance washes every 4–8 weeks will keep the coating performing correctly.',
  },
  {
    q: 'Do I need to be home?',
    a: "No. As long as we can access the vehicle, you can carry on with your day. We'll message when we arrive and when we're done.",
  },
  {
    q: 'What do I need to prepare?',
    a: "Nothing. We bring our own power, water, and all professional-grade equipment. Just make sure the car is accessible and we handle the rest.",
  },
  {
    q: 'What if I\'m not happy with the result?',
    a: "We'll come back and fix it, simple as that. We don't leave a job we're not proud of, but if something isn't right, there are no awkward conversations. That's our word.",
  },
  {
    q: 'How do I pay?',
    a: 'Payment is due on the day of service. We accept card, bank transfer, and cash. Your price is fixed at booking, with no changes on the day.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      style={{
        background: '#F5F4F1',
        paddingTop:    'clamp(64px, 9vw, 120px)',
        paddingBottom: 'clamp(64px, 9vw, 120px)',
      }}
    >
      {/* FAQ structured data sits with the FAQ it describes, generated from the same list. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdGraph(faqJsonLd(FAQS)) }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)' }}>

        <div
          style={{
            display: 'grid',
            gap: 'clamp(32px, 6vw, 96px)',
            alignItems: 'start',
          }}
          className="grid-cols-1 lg:grid-cols-[1fr_2fr]"
        >

          {/* Left — sticky label */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 6.5vw, 88px)',
                letterSpacing: '0.025em',
                color: '#0C0C0C', lineHeight: 0.88,
              }}
            >
              COMMON<br />QUESTIONS<span style={{ color: '#E84A0C' }}>.</span>
            </motion.h2>
          </div>

          {/* Right — accordion */}
          <div>
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10px' }}
                transition={{ duration: 0.4, ease, delay: i * 0.05 }}
                style={{ borderBottom: '1px solid rgba(12,12,12,0.1)' }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: 'clamp(18px, 2vw, 26px) 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-body)', fontWeight: 600,
                    fontSize: 'clamp(15px, 1.5vw, 18px)',
                    color: '#0C0C0C', lineHeight: 1.3,
                    transition: 'color 0.2s',
                  }}>
                    {faq.q}
                  </span>
                  {/* +/– toggle */}
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0, width: 28, height: 28,
                      border: '1px solid rgba(12,12,12,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 300,
                      color: open === i ? '#E84A0C' : 'rgba(12,12,12,0.4)',
                      transition: 'color 0.2s, border-color 0.2s',
                      borderColor: open === i ? '#E84A0C' : 'rgba(12,12,12,0.15)',
                    }}
                  >
                    {open === i ? '−' : '+'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.78,
                        color: 'rgba(12,12,12,0.52)',
                        paddingBottom: 'clamp(16px, 2vw, 24px)',
                        maxWidth: '600px',
                      }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

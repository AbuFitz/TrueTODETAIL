'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { faqJsonLd, jsonLdGraph } from '@/lib/jsonld'
import { FAQS } from '@/lib/faq'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]


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

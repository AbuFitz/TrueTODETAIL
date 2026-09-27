'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

type Role = 'user' | 'assistant'
interface Message {
  role: Role
  content: string
}

const PHONE_DISPLAY = '07359 591800'
const PHONE_TEL = '+447359591800'
const WHATSAPP_URL = `https://wa.me/447359591800?text=${encodeURIComponent(
  "Hi! I'd like to ask about a car detail.",
)}`

const GREETING: Message = {
  role: 'assistant',
  content:
    "Hey! I'm here to help with anything about True To Detail: pricing, coverage, booking, whatever you need. What can I help with?",
}

function goToBooking() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('ttd:book-now'))
  if (window.location.pathname !== '/') {
    window.location.href = '/'
  }
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const history = messages.filter((m) => m !== GREETING || messages.length > 1)
    const nextMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const json = await res.json()
      const reply: string = json.reply ?? "Sorry, something went wrong there. Try WhatsApp or give us a call on " + PHONE_DISPLAY + "."
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Network hiccup on my end. WhatsApp or call us on ${PHONE_DISPLAY} and we'll sort it directly.`,
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* ── Floating launcher button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        style={{
          position: 'fixed',
          bottom: 'clamp(16px, 3vw, 28px)',
          right: 'clamp(16px, 3vw, 28px)',
          zIndex: 55,
          width: 56, height: 56,
          borderRadius: '50%',
          background: '#E84A0C',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(232,74,12,0.4)',
          transition: 'background 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
        onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease }}
            style={{
              position: 'fixed',
              bottom: 'clamp(80px, 12vw, 100px)',
              right: 'clamp(12px, 3vw, 28px)',
              left: 'clamp(12px, 3vw, 28px)',
              zIndex: 90,
              marginLeft: 'auto',
              width: 'min(100%, 380px)',
              height: 'min(75vh, 600px)',
              background: '#ffffff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: '#0C0C0C', padding: '18px 20px', flexShrink: 0 }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', marginBottom: '4px',
              }}>
                True To Detail
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '24px',
                letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1,
              }}>
                NEED A HAND<span style={{ color: '#E84A0C' }}>?</span>
              </h3>
            </div>

            {/* Quick actions */}
            <div style={{
              display: 'flex', gap: '1px', background: 'rgba(12,12,12,0.08)',
              flexShrink: 0,
            }}>
              <button
                onClick={() => { setOpen(false); goToBooking() }}
                style={{
                  flex: 1, padding: '11px 6px', background: '#F5F4F1', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.03em', color: '#0C0C0C',
                }}
              >
                Book Now
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: '11px 6px', background: '#F5F4F1', textDecoration: 'none',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.03em', color: '#0C0C0C', textAlign: 'center',
                }}
              >
                WhatsApp
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                style={{
                  flex: 1, padding: '11px 6px', background: '#F5F4F1', textDecoration: 'none',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.03em', color: '#0C0C0C', textAlign: 'center',
                }}
              >
                Call
              </a>
            </div>

            {/* Message list */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '84%',
                    background: m.role === 'user' ? '#0C0C0C' : '#F5F4F1',
                    color: m.role === 'user' ? '#ffffff' : '#0C0C0C',
                    padding: '10px 14px',
                    fontFamily: 'var(--font-body)', fontSize: '13.5px', lineHeight: 1.55,
                  }}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div style={{
                  alignSelf: 'flex-start', background: '#F5F4F1', padding: '10px 14px',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 5, height: 5, borderRadius: '50%', background: 'rgba(12,12,12,0.3)',
                      animation: `ttd-typing-dot 1s ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{
              display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid rgba(12,12,12,0.08)', flexShrink: 0,
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask us anything..."
                maxLength={1000}
                style={{
                  flex: 1, padding: '11px 14px', border: '1px solid rgba(12,12,12,0.14)',
                  fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#0C0C0C',
                  outline: 'none', background: 'white',
                }}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: '#E84A0C', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: sending || !input.trim() ? 0.5 : 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ttd-typing-dot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </>
  )
}

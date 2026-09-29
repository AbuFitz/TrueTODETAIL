'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { emptyConversationState, type ConversationState, type ChatAction } from '@/lib/chat/types'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

type Role = 'user' | 'assistant'
interface Message {
  role: Role
  content: string
  action?: ChatAction
}

const PHONE_DISPLAY = '07359 591800'
const PHONE_TEL = '+447359591800'
const WHATSAPP_URL = `https://wa.me/447359591800?text=${encodeURIComponent(
  "Hi! I'd like to ask about a car detail.",
)}`

const GREETING: Message = {
  role: 'assistant',
  content:
    "Hey, welcome to True To Detail! I can help with pricing, coverage, booking, or anything else on your mind. What can I help with?",
}

// Every page listens for this and opens the booking popup in place, so the
// chat never needs to send the visitor away from what they were reading.
function goToBooking() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('ttd:book-now'))
}

const QUICK_ACTIONS = [
  {
    label: 'Book Now',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.1c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.03.28-3.44-.72-2.9-1.22-4.77-4.18-4.91-4.37-.14-.19-1.17-1.56-1.17-2.97s.73-2.1 1-2.39c.26-.28.57-.35.76-.35h.55c.18 0 .41-.03.63.48.24.56.79 1.94.86 2.08.07.14.11.3.02.49-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.2 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.9.91.28.14.46.21.53.32.07.12.07.68-.17 1.35z" />
      </svg>
    ),
  },
  {
    label: 'Call',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
]

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [conversationState, setConversationState] = useState<ConversationState>(emptyConversationState())
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const t = setTimeout(() => inputRef.current?.focus(), 250)
      return () => { clearTimeout(t); document.body.style.overflow = '' }
    }
    document.body.style.overflow = ''
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
      // The server gives each AI provider a fixed time before answering from
      // its rules, so this only trips if the request itself is lost.
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: history.map((m) => ({ role: m.role, content: m.content })),
          conversationState,
        }),
        signal: AbortSignal.timeout(45_000),
      })
      const json = await res.json()
      const reply: string = json.reply ?? `Sorry, something went wrong there. Try WhatsApp or give us a call on ${PHONE_DISPLAY}.`
      const action: ChatAction = json.action ?? null
      if (json.conversationState) setConversationState(json.conversationState)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, action }])
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
          display: open ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(232,74,12,0.4)',
          transition: 'background 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#C53D08')}
        onMouseLeave={e => (e.currentTarget.style.background = '#E84A0C')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Tap-outside-to-close scrim (mobile-friendly, invisible on desktop since panel doesn't cover much) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 85, background: 'rgba(12,12,12,0.25)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease }}
              style={{
                position: 'fixed',
                bottom: 'clamp(16px, 3vw, 28px)',
                right: 'clamp(12px, 3vw, 28px)',
                zIndex: 90,
                width: 'min(92vw, 380px)',
                height: 'min(64vh, 540px)',
                maxHeight: 'calc(100dvh - 32px)',
                background: '#ffffff',
                borderRadius: '18px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ background: '#0C0C0C', padding: '16px 16px 16px 20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)', marginBottom: '4px',
                  }}>
                    True To Detail
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '22px',
                    letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1,
                  }}>
                    NEED A HAND<span style={{ color: '#E84A0C' }}>?</span>
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close support chat"
                  style={{
                    width: 32, height: 32, flexShrink: 0, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.6)', transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Quick actions */}
              <div style={{
                display: 'flex', gap: '8px', padding: '12px 12px 0', flexShrink: 0,
              }}>
                <button
                  onClick={() => { setOpen(false); goToBooking() }}
                  style={{
                    flex: 1, padding: '9px 4px', background: '#F5F4F1', border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                    color: '#0C0C0C', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  }}
                >
                  {QUICK_ACTIONS[0].icon}
                  Book Now
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, padding: '9px 4px', background: '#F5F4F1', textDecoration: 'none', borderRadius: '10px',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                    color: '#0C0C0C', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  }}
                >
                  {QUICK_ACTIONS[1].icon}
                  WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  style={{
                    flex: 1, padding: '9px 4px', background: '#F5F4F1', textDecoration: 'none', borderRadius: '10px',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                    color: '#0C0C0C', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  }}
                >
                  {QUICK_ACTIONS[2].icon}
                  Call
                </a>
              </div>

              {/* Message list */}
              <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px', maxWidth: '84%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div
                      style={{
                        background: m.role === 'user' ? '#0C0C0C' : '#F5F4F1',
                        color: m.role === 'user' ? '#ffffff' : '#0C0C0C',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        borderBottomRightRadius: m.role === 'user' ? '4px' : '14px',
                        borderBottomLeftRadius: m.role === 'user' ? '14px' : '4px',
                        fontFamily: 'var(--font-body)', fontSize: '13.5px', lineHeight: 1.55,
                      }}
                    >
                      {m.content}
                    </div>
                    {m.action?.type === 'open_booking' && (
                      <button
                        onClick={() => { setOpen(false); goToBooking() }}
                        style={{
                          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                          color: '#fff', background: '#E84A0C', border: 'none', borderRadius: '8px',
                          padding: '9px 14px', cursor: 'pointer',
                        }}
                      >
                        Continue to Booking →
                      </button>
                    )}
                  </div>
                ))}
                {sending && (
                  <div style={{
                    alignSelf: 'flex-start', background: '#F5F4F1', padding: '10px 14px',
                    borderRadius: '14px', borderBottomLeftRadius: '4px',
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
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask us anything..."
                  maxLength={1000}
                  style={{
                    flex: 1, padding: '11px 14px', border: '1px solid rgba(12,12,12,0.14)', borderRadius: '10px',
                    // 16px prevents iOS Safari from zooming the whole page in on focus
                    // (it auto-zooms any input below that size).
                    fontFamily: 'var(--font-body)', fontSize: '16px', color: '#0C0C0C',
                    outline: 'none', background: 'white',
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  aria-label="Send message"
                  style={{
                    width: 44, height: 44, flexShrink: 0, borderRadius: '10px',
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
          </>
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

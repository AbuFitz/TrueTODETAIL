'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { appAdminLoginUrl } from '@/lib/appUrl'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onBookNow?: () => void
}

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'rgba(12,12,12,0.38)', marginBottom: '10px',
}

const textInput: React.CSSProperties = {
  width: '100%', padding: '14px 16px',
  border: '1px solid rgba(12,12,12,0.12)',
  fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0C0C0C',
  outline: 'none', background: 'white', boxSizing: 'border-box' as const,
}

/**
 * Signs in directly on this site (no redirect to the Job System app) by
 * calling Supabase auth here — the resulting session cookie is scoped to
 * .truetodetail.co.uk (see lib/supabaseBrowser.ts), so app.truetodetail.co.uk
 * picks it up automatically. There's no sign-up here on purpose: accounts
 * are created as part of booking, same rule as the Job System's own
 * /account/login. Staff/admin sign-in stays a dedicated page on the app
 * subdomain rather than a popup here.
 */
export default function LoginModal({ isOpen, onClose, onBookNow }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setEmail(''); setPassword(''); setError(''); setSubmitting(false)
    }, 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? "That email or password isn't right."
        : signInError.message)
      setSubmitting(false)
      return
    }
    handleClose()
  }

  const handleBookNow = () => {
    handleClose()
    onBookNow?.()
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(12,12,12,0.82)', backdropFilter: 'blur(3px)' }}
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '400px',
          background: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{ background: '#0C0C0C', padding: '24px 32px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)', marginBottom: '6px',
            }}>
              True To Detail
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '28px',
              letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1,
            }}>
              SIGN IN
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              width: 36, height: 36, background: 'rgba(255,255,255,0.07)',
              border: 'none', cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)', fontSize: '16px', transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <p style={fieldLabel}>Email</p>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={textInput}
              />
            </div>
            <div>
              <p style={fieldLabel}>Password</p>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={textInput}
              />
            </div>

            {error && (
              <div style={{ borderLeft: '2px solid #ef4444', background: '#fef2f2', padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', padding: '15px 24px', background: '#E84A0C', color: '#ffffff',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
                fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: submitting ? 0.7 : 1, transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#C53D08' }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#E84A0C' }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.5)', textAlign: 'center' }}>
            Don&rsquo;t have an account yet?{' '}
            <button
              type="button"
              onClick={handleBookNow}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: '#0C0C0C', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              Book a detail
            </button>{' '}
            to get set up.
          </p>

          <p style={{ marginTop: '14px', fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(12,12,12,0.3)', textAlign: 'center' }}>
            <a href={appAdminLoginUrl()} style={{ color: 'inherit' }}>
              Staff sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

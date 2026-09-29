'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const STORAGE_KEY = 'ttd_cookie_consent'

function applyConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // localStorage only exists after hydration, so the banner can't know
    // whether to show until this effect runs. One extra render on first load.
    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) } catch { /* blocked storage: ask again */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== 'granted' && stored !== 'denied') setVisible(true)

    const reopen = () => setVisible(true)
    window.addEventListener('ttd:manage-cookies', reopen)
    return () => window.removeEventListener('ttd:manage-cookies', reopen)
  }, [])

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied')
    } catch {
      // Private browsing or storage blocked: consent still applies for this visit.
    }
    applyConsent(granted)
    setVisible(false)
  }

  // Publish the banner's height so floating buttons (the chat launcher) can
  // sit above it instead of underneath it while it's showing.
  const bannerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = document.documentElement
    const el = bannerRef.current
    if (!visible || !el) {
      root.style.removeProperty('--cookie-banner-h')
      return
    }
    const update = () => root.style.setProperty('--cookie-banner-h', `${el.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => { observer.disconnect(); root.style.removeProperty('--cookie-banner-h') }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 80,
        background: '#0C0C0C',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 48px)',
      }}
    >
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px 24px',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6,
          color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '640px', flex: '1 1 320px',
        }}>
          We use essential cookies to run this site, and optional analytics/advertising cookies to understand traffic and measure ads, only with your consent.{' '}
          <Link href="/cookies" style={{ color: '#E84A0C', textDecoration: 'underline' }}>Read our Cookie Policy</Link>.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => choose(false)}
            style={{
              padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Reject
          </button>
          <button
            onClick={() => choose(true)}
            style={{
              padding: '12px 20px', background: '#E84A0C', border: 'none',
              color: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

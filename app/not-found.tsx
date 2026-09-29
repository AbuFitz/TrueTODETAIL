import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNavbar, SiteFooter } from '@/components/SiteChrome'
import BookNowButton from '@/components/BookNowButton'

export const metadata: Metadata = {
  title: 'Page not found',
}

const LINKS: [string, string][] = [
  ['Mobile car valeting', '/professional-car-valeting'],
  ['Mobile car wash', '/mobile-car-wash'],
  ['Full car detail', '/full-car-detail'],
  ['Van & fleet', '/van-fleet'],
  ['Areas we cover', '/areas'],
]

export default function NotFound() {
  return (
    <>
      <SiteNavbar />
      <main style={{ background: '#0C0C0C', minHeight: '70vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'calc(80px + clamp(56px, 9vw, 112px)) clamp(24px, 5vw, 48px) clamp(56px, 9vw, 112px)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E84A0C', marginBottom: '16px' }}>
            404 · Page not found
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 10vw, 120px)', lineHeight: 0.9, color: '#ffffff', letterSpacing: '0.01em', marginBottom: '24px' }}>
            WRONG<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>TURN<span style={{ color: '#E84A0C' }}>.</span></span>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: '520px', marginBottom: '36px' }}>
            That page doesn&apos;t exist, or it has moved. You can still book a mobile valet or detail right here, or head to one of these instead.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <BookNowButton style={{ display: 'inline-block', background: '#E84A0C', color: '#fff', padding: '15px 36px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Book a Detail
            </BookNowButton>
            <Link href="/" style={{ display: 'inline-block', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>
              Home
            </Link>
          </div>
          <nav aria-label="Popular pages" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '28px' }}>
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>
                {label} →
              </Link>
            ))}
          </nav>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

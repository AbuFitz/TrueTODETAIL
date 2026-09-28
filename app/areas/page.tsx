import type { Metadata } from 'next'
import Link from 'next/link'
import { AREAS, REGIONS } from '@/lib/areas'
import { SiteNavbar, SiteFooter } from '@/components/SiteChrome'
import BookNowButton from '@/components/BookNowButton'
import { breadcrumbJsonLd, jsonLdGraph } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Areas We Cover: Mobile Car Valeting Across Hertfordshire',
  description:
    'True To Detail provides fully mobile car valeting and detailing across Hertfordshire and selected areas of Buckinghamshire and Bedfordshire, within roughly 25 miles of Hemel Hempstead. See full coverage by town.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/areas',
  },
  openGraph: {
    title: 'Areas We Cover | True To Detail',
    description:
      'Mobile car detailing across Hertfordshire and selected areas of Buckinghamshire, Bedfordshire and North West London, within roughly 25 miles of Hemel Hempstead.',
    url: 'https://www.truetodetail.co.uk/areas',
  },
}

export default function AreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraph(breadcrumbJsonLd([['Home', '/'], ['Areas We Cover', '/areas']])) }}
      />
      <SiteNavbar />
      <main style={{ background: '#0C0C0C' }}>

        {/* ── Dark intro section ── */}
        <section style={{ paddingTop: 'calc(80px + clamp(40px, 6vw, 72px))', paddingBottom: 'clamp(56px, 8vw, 96px)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>

            <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
              <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                <li><Link href="/" style={{ color: '#E84A0C', textDecoration: 'none' }}>Home</Link></li>
                <li aria-hidden>›</li>
                <li aria-current="page">Areas We Cover</li>
              </ol>
            </nav>

            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#E84A0C', marginBottom: '16px',
            }}>
              Coverage
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)',
              letterSpacing: '0.02em', color: '#ffffff', lineHeight: 0.92, marginBottom: '24px',
            }}>
              MOBILE CAR DETAILING ACROSS<br />
              <span style={{ color: '#E84A0C' }}>HERTFORDSHIRE & SURROUNDING AREAS</span>
            </h1>

            <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: '20px', fontWeight: 500, maxWidth: '720px' }}>
              Based in Hemel Hempstead, True To Detail provides fully mobile car detailing throughout Hertfordshire and selected areas of Buckinghamshire, Bedfordshire and North West London. Our standard service area covers approximately 25 miles from Hemel Hempstead.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(255,255,255,0.35)', maxWidth: '720px' }}>
              Not sure if your postcode is covered? Message us on WhatsApp or call <a href="tel:+447359591800" style={{ color: '#E84A0C', textDecoration: 'none' }}>07359 591800</a> and we'll confirm straight away, or pick your town below for local postcodes, nearby villages and a map of the area.
            </p>
          </div>
        </section>

        {/* ── Light section: region groups ── */}
        <section style={{ background: '#F5F4F1', paddingTop: 'clamp(48px, 7vw, 80px)', paddingBottom: 'clamp(48px, 7vw, 80px)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>
            {REGIONS.map((region) => {
              const areasInRegion = AREAS.filter((a) => a.region === region)
              if (areasInRegion.length === 0) return null
              return (
                <section key={region} style={{ marginBottom: '48px' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 30px)',
                    letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '18px',
                    borderBottom: '1px solid rgba(12,12,12,0.12)', paddingBottom: '12px',
                  }}>
                    {region}
                  </h2>
                  <div style={{ display: 'grid', gap: '16px' }} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {areasInRegion.map((area) => (
                      <Link
                        key={area.slug}
                        href={`/areas/${area.slug}`}
                        style={{
                          display: 'block', textDecoration: 'none',
                          background: '#ffffff',
                          border: '1px solid rgba(12,12,12,0.08)', padding: '20px 22px',
                          transition: 'border-color 0.2s, transform 0.2s',
                        }}
                      >
                        <p style={{
                          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '16px',
                          color: '#0C0C0C', marginBottom: '4px',
                        }}>
                          {area.name}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(12,12,12,0.4)', marginBottom: '10px' }}>
                          {area.postcodes.join(' · ')}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6, color: 'rgba(12,12,12,0.55)' }}>
                          {area.tagline}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </section>

        {/* ── Dark CTA section ── */}
        <section style={{ background: '#0C0C0C', borderTop: '3px solid #E84A0C', paddingTop: 'clamp(48px, 7vw, 72px)', paddingBottom: 'clamp(48px, 7vw, 72px)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)',
              letterSpacing: '0.02em', color: '#ffffff', lineHeight: 0.95, marginBottom: '28px',
            }}>
              READY TO BOOK YOUR <span style={{ color: '#E84A0C' }}>DETAIL?</span>
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <BookNowButton
                style={{
                  display: 'inline-block', background: '#E84A0C', color: '#fff',
                  padding: '15px 36px',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}
              >
                Book Your Detail
              </BookNowButton>
              <Link href="/van-fleet" style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>
                Van & Fleet →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}

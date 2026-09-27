import type { Metadata } from 'next'
import Link from 'next/link'
import { AREAS, REGIONS } from '@/lib/areas'

export const metadata: Metadata = {
  title: 'Areas We Cover | Mobile Car Detailing Across Hertfordshire',
  description:
    'True To Detail provides fully mobile car detailing across Hertfordshire and selected areas of Buckinghamshire and Bedfordshire, within roughly 25 miles of Hemel Hempstead. See full coverage by town.',
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
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 48px)' }}>

        <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
          <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'rgba(12,12,12,0.45)' }}>
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
          letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px',
        }}>
          MOBILE CAR DETAILING ACROSS<br />
          <span style={{ color: '#E84A0C' }}>HERTFORDSHIRE & SURROUNDING AREAS</span>
        </h1>

        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '20px', fontWeight: 500, maxWidth: '720px' }}>
          Based in Hemel Hempstead, True To Detail provides fully mobile car detailing throughout Hertfordshire and selected areas of Buckinghamshire, Bedfordshire and North West London. Our standard service area covers approximately 25 miles from Hemel Hempstead.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.55)', marginBottom: '48px', maxWidth: '720px' }}>
          Not sure if your postcode is covered? Message us on WhatsApp or call <a href="tel:+447359591800" style={{ color: '#E84A0C', textDecoration: 'none' }}>07359 591800</a> and we'll confirm straight away, or pick your town below for local postcodes, nearby villages and a map of the area.
        </p>

        {REGIONS.map((region) => {
          const areasInRegion = AREAS.filter((a) => a.region === region)
          if (areasInRegion.length === 0) return null
          return (
            <section key={region} style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 30px)',
                letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '18px',
                borderBottom: '1px solid rgba(12,12,12,0.1)', paddingBottom: '12px',
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
                      border: '1px solid rgba(12,12,12,0.1)', padding: '20px 22px',
                      transition: 'border-color 0.2s',
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

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block', background: '#E84A0C', color: '#fff',
              padding: '15px 36px', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            Book Your Detail
          </Link>
          <Link href="/van-fleet" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
            Van & Fleet →
          </Link>
        </div>

      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AREAS, getAreaBySlug, mapEmbedUrl, nearestAreas } from '@/lib/areas'
import { PACKAGES, VEHICLE_LABELS, type VehicleType } from '@/lib/pricing'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'
import { faqJsonLd, jsonLdGraph } from '@/lib/jsonld'
import { SiteNavbar, SiteFooter } from '@/components/SiteChrome'
import BookNowButton from '@/components/BookNowButton'

const VEHICLES = Object.keys(VEHICLE_LABELS) as VehicleType[]
const FROM_PRICE = Math.min(...PACKAGES.flatMap((p) => Object.values(p.price)))

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const area = getAreaBySlug(slug)
  if (!area) return {}

  // Matches how people in the UK actually search: "valeting" and "car wash"
  // alongside "detailing". The template appends "| True To Detail".
  const title = `Mobile Car Valeting & Detailing in ${area.name}`
  const description = `Mobile car valeting, detailing and hand car washes in ${area.name} (${area.postcodes.join(', ')}). We come to your driveway with our own water and power. Fixed prices from £${FROM_PRICE}.`

  return {
    title,
    description,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: { title: `${title} | True To Detail`, description, url: `/areas/${area.slug}` },
  }
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = getAreaBySlug(slug)
  if (!area) notFound()

  const otherAreas = nearestAreas(area, 5)

  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([['Home', '/'], ['Areas We Cover', '/areas'], [area.name, `/areas/${area.slug}`]]),
    serviceJsonLd({
      name: `Mobile Car Valeting & Detailing in ${area.name}`,
      path: `/areas/${area.slug}`,
      description: area.intro,
      serviceType: 'Mobile car valeting and detailing',
      areaName: area.name,
      county: area.county,
    }),
    faqJsonLd(area.faqs),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <SiteNavbar />
      <main style={{ background: '#0C0C0C' }}>

        {/* ── Dark hero section ── */}
        <section style={{ paddingTop: 'calc(80px + clamp(40px, 6vw, 72px))', paddingBottom: 'clamp(48px, 7vw, 72px)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>

            <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
              <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                <li><Link href="/" style={{ color: '#E84A0C', textDecoration: 'none' }}>Home</Link></li>
                <li aria-hidden>›</li>
                <li><Link href="/areas" style={{ color: '#E84A0C', textDecoration: 'none' }}>Areas We Cover</Link></li>
                <li aria-hidden>›</li>
                <li aria-current="page">{area.name}</li>
              </ol>
            </nav>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)',
              letterSpacing: '0.02em', color: '#ffffff', lineHeight: 0.92, marginBottom: '24px',
            }}>
              MOBILE CAR VALETING<br />
              <span style={{ color: '#E84A0C' }}>& DETAILING IN {area.name.toUpperCase()}</span>
            </h1>

            <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
              {area.intro}
            </p>
          </div>
        </section>

        {/* ── Light section: postcodes ── */}
        <section style={{ background: '#F5F4F1' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(48px, 7vw, 72px) clamp(24px, 5vw, 48px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              POSTCODES & AREAS COVERED
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {area.postcodes.map((pc) => (
                <span
                  key={pc}
                  style={{
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px',
                    padding: '7px 14px', border: '1px solid rgba(12,12,12,0.15)', background: '#ffffff',
                    color: '#0C0C0C', borderRadius: '999px',
                  }}
                >
                  {pc}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '8px' }}>
              We also regularly cover: {area.neighbourhoods.join(', ')}.
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(12,12,12,0.45)' }}>
              {area.driveTime} Not sure your exact postcode is included? Message us on WhatsApp or call{' '}
              <a href="tel:+447359591800" style={{ color: '#E84A0C', textDecoration: 'none' }}>07359 591800</a> and we&apos;ll confirm straight away.
            </p>
          </div>
        </section>

        {/* ── White section: map ── */}
        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 48px)' }}>
            <div style={{
              position: 'relative', height: 'clamp(280px, 40vw, 420px)',
              overflow: 'hidden', border: '1px solid rgba(12,12,12,0.1)',
            }}>
              <iframe
                src={mapEmbedUrl(area)}
                width="100%" height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of our ${area.name} mobile detailing coverage area`}
              />
            </div>
          </div>
        </section>

        {/* ── Dark section: local paragraph ── */}
        <section style={{ background: '#0C0C0C' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(48px, 7vw, 72px) clamp(24px, 5vw, 48px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#ffffff', marginBottom: '16px' }}>
              WORKING IN {area.name.toUpperCase()}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(255,255,255,0.5)' }}>
              {area.localParagraph}
            </p>
          </div>
        </section>

        {/* ── Light section: packages ── */}
        <section style={{ background: '#F5F4F1' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(48px, 7vw, 72px) clamp(24px, 5vw, 48px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              CAR VALETING PRICES IN {area.name.toUpperCase()}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '20px' }}>
              The same fixed prices apply in {area.name} as everywhere else we cover. No call-out fee and no travel surcharge.
            </p>
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#ffffff' }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '2px solid #E84A0C', fontWeight: 700, color: '#0C0C0C' }}>Package</th>
                    {VEHICLES.map((v) => (
                      <th key={v} scope="col" style={{ textAlign: 'right', padding: '12px 10px', borderBottom: '2px solid #E84A0C', fontWeight: 700, color: '#0C0C0C' }}>{VEHICLE_LABELS[v]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PACKAGES.map((p) => (
                    <tr key={p.id}>
                      <th scope="row" style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '1px solid rgba(12,12,12,0.08)', fontWeight: 600, color: '#0C0C0C' }}>
                        {p.id}
                        <span style={{ display: 'block', fontWeight: 400, fontSize: '12px', color: 'rgba(12,12,12,0.45)' }}>{p.duration}</span>
                      </th>
                      {VEHICLES.map((v) => (
                        <td key={v} style={{ textAlign: 'right', padding: '12px 10px', borderBottom: '1px solid rgba(12,12,12,0.08)', color: '#0C0C0C' }}>£{p.price[v]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul style={{ fontSize: '15px', lineHeight: 2, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              {PACKAGES.map((p) => (
                <li key={p.id}><strong>{p.id}</strong>: {p.includes.join(', ')}.</li>
              ))}
            </ul>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Looking for a car wash in {area.name}? Our Essential package is a proper hand wash done on your driveway, which is far kinder to paintwork than a brush car wash, plus a quick interior tidy.
              See our <Link href="/mobile-car-wash" style={{ color: '#E84A0C', textDecoration: 'none' }}>mobile car wash</Link> page for what&apos;s included.
            </p>
          </div>
        </section>

        {/* ── White section: FAQs ── */}
        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(48px, 7vw, 72px) clamp(24px, 5vw, 48px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              {area.name.toUpperCase()} FAQS
            </h2>
            <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }}>
              {area.faqs.map((faq) => (
                <div key={faq.q} style={{ padding: '20px 0', borderBottom: '1px solid rgba(12,12,12,0.08)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '15px', color: '#0C0C0C', marginBottom: '8px' }}>
                    {faq.q}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.72, color: 'rgba(12,12,12,0.58)' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dark CTA + nearby areas ── */}
        <section style={{ background: '#0C0C0C', borderTop: '3px solid #E84A0C' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(48px, 7vw, 72px) clamp(24px, 5vw, 48px)' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <BookNowButton
                style={{
                  display: 'inline-block', background: '#E84A0C', color: '#fff',
                  padding: '15px 36px',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}
              >
                Book Your Valet in {area.name}
              </BookNowButton>
              <a href="tel:+447359591800" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                07359 591800
              </a>
            </div>

            <nav aria-label="Nearby areas" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                Nearby Areas We Also Cover
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {otherAreas.map((a) => (
                  <Link key={a.slug} href={`/areas/${a.slug}`} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>
                    {a.name}
                  </Link>
                ))}
                <Link href="/areas" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                  View all areas →
                </Link>
              </div>
            </nav>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}

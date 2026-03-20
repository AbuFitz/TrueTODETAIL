import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Full Car Detail Packages | Hemel Hempstead & Hertfordshire',
  description:
    'Full car detail packages near Hemel Hempstead. Complete interior and exterior detailing including machine polish and paint protection. Mobile service covering Watford, St Albans, Berkhamsted and all Hertfordshire areas. Fixed prices.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/full-car-detail',
  },
  openGraph: {
    title: 'Full Car Detail Packages | True To Detail',
    description: 'Complete interior and exterior car detailing in Hertfordshire. Fixed prices, fully mobile service. Book online today.',
    url: 'https://www.truetodetail.co.uk/full-car-detail',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Full Car Detail',
  provider: { '@type': 'LocalBusiness', name: 'True To Detail', url: 'https://www.truetodetail.co.uk', telephone: '+447984237149' },
  areaServed: ['Hemel Hempstead', 'Watford', 'St Albans', 'Berkhamsted', 'Harpenden', 'Kings Langley', 'Tring'],
  serviceType: 'Full Car Detail',
  url: 'https://www.truetodetail.co.uk/full-car-detail',
}

export default function FullCarDetailPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 48px)' }}>

          <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
            <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'rgba(12,12,12,0.45)' }}>
              <li><Link href="/" style={{ color: '#E84A0C', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden>›</li>
              <li><Link href="/mobile-car-detailing" style={{ color: '#E84A0C', textDecoration: 'none' }}>Mobile Car Detailing</Link></li>
              <li aria-hidden>›</li>
              <li aria-current="page">Full Car Detail</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px' }}>
            FULL CAR DETAIL PACKAGES<br />
            <span style={{ color: '#E84A0C' }}>HERTFORDSHIRE</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '40px', fontWeight: 500 }}>
            Our full car detail packages combine a comprehensive interior deep clean with a professional exterior treatment — delivering a complete vehicle transformation from the inside out.
          </p>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              WHAT IS INCLUDED IN A FULL CAR DETAIL?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              A full car detail addresses every aspect of your vehicle — interior and exterior — in a single comprehensive service. Here&apos;s what&apos;s included in our Premium full detail package:
            </p>
            <div style={{ display: 'grid', gap: '24px', marginBottom: '16px' }} className="grid-cols-1 md:grid-cols-2">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0C0C0C', marginBottom: '12px' }}>Interior</p>
                <ul style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(12,12,12,0.62)', paddingLeft: '18px', margin: 0 }}>
                  <li>Full vacuum — seats, carpets, boot, crevices</li>
                  <li>Steam cleaning of all hard surfaces</li>
                  <li>Hot water extraction on fabric seats and carpets</li>
                  <li>Leather clean and condition</li>
                  <li>Dashboard, plastics and trim deep cleaned</li>
                  <li>Interior glass cleaned streak-free</li>
                  <li>Door shuts and jambs cleaned</li>
                </ul>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0C0C0C', marginBottom: '12px' }}>Exterior</p>
                <ul style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(12,12,12,0.62)', paddingLeft: '18px', margin: 0 }}>
                  <li>Snow foam pre-wash and hand wash</li>
                  <li>Iron fallout and tar decontamination</li>
                  <li>Clay bar paint decontamination</li>
                  <li>Single-stage machine polish</li>
                  <li>Premium synthetic paint sealant</li>
                  <li>Wheel and tyre deep clean and dressing</li>
                  <li>Exterior glass and trim cleaned</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              HOW OFTEN SHOULD YOU DETAIL YOUR CAR?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              For most drivers, a thorough full detail every 3–6 months is the ideal frequency. This keeps the vehicle in excellent condition, prevents contamination from bonding permanently to paintwork and interiors, and makes each subsequent detail quicker and more affordable.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              In between full details, a maintenance wash every 4–8 weeks helps preserve the finish and prevent premature deterioration of any paint protection applied. If your vehicle has a ceramic coating, regular maintenance washing is especially important to maintain the coating&apos;s hydrophobic properties.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Vehicles that see heavy use — family cars, dog-owner vehicles, daily commuters — typically benefit from more frequent interior details, even if the exterior is maintained on a longer schedule.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              FULL DETAIL PRICING
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Our Premium full car detail starts from <strong>£299</strong> for a standard hatchback or saloon, <strong>£369</strong> for an SUV or 4x4, and <strong>£479</strong> for sports or prestige vehicles. All prices are fixed at the time of booking — no surprises on the day.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              For the ultimate in vehicle protection, our Elite Ceramic package combines a full detail with professional ceramic coating from <strong>£549</strong>, including a 2-year ceramic warranty.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              MOBILE FULL DETAIL SERVICE
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              True To Detail provides full car detail services across Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley and nearby Hertfordshire towns. We are fully self-contained — our mobile unit includes its own power, water and professional equipment. No drop-off, no waiting, no hassle.
            </p>
          </section>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/" style={{ display: 'inline-block', background: '#E84A0C', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Book Your Detail
            </Link>
            <Link href="/professional-car-valeting" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
              Car Valeting →
            </Link>
          </div>

          <nav aria-label="Related services" style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '16px' }}>Related Services</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[['Mobile Car Detailing', '/mobile-car-detailing'], ['Interior Car Detailing', '/interior-car-detailing'], ['Exterior Car Detailing', '/exterior-car-detailing'], ['Professional Car Valeting', '/professional-car-valeting']].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
    </>
  )
}

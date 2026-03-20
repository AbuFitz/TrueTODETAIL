import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Professional Car Valeting Service | Hemel Hempstead & Hertfordshire',
  description:
    'Professional car valeting near Hemel Hempstead. Mobile car valet service covering Watford, St Albans, Berkhamsted and surrounding Hertfordshire areas. Fixed prices, no drop-off needed. Book online today.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/professional-car-valeting',
  },
  openGraph: {
    title: 'Professional Car Valeting | True To Detail',
    description: 'Mobile professional car valeting in Hertfordshire. We come to you — no drop-off needed. Fixed prices, exceptional results.',
    url: 'https://www.truetodetail.co.uk/professional-car-valeting',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Professional Car Valeting',
  provider: { '@type': 'LocalBusiness', name: 'True To Detail', url: 'https://www.truetodetail.co.uk', telephone: '+447984237149' },
  areaServed: ['Hemel Hempstead', 'Watford', 'St Albans', 'Berkhamsted', 'Harpenden', 'Kings Langley', 'Tring', 'Abbots Langley', 'Chesham', 'Rickmansworth'],
  serviceType: 'Professional Car Valeting',
  url: 'https://www.truetodetail.co.uk/professional-car-valeting',
}

export default function ProfessionalCarValetingPage() {
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
              <li aria-current="page">Professional Car Valeting</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px' }}>
            PROFESSIONAL CAR VALETING<br />
            <span style={{ color: '#E84A0C' }}>NEAR HEMEL HEMPSTEAD</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '40px', fontWeight: 500 }}>
            True To Detail offers a professional mobile car valet service across Hemel Hempstead and surrounding Hertfordshire areas — combining the convenience of mobile service with the quality of a dedicated detailing studio.
          </p>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              VALETING VS DETAILING — WHAT&apos;S THE DIFFERENCE?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Car valeting and car detailing are terms often used interchangeably, but there are meaningful differences in what each involves.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              <strong>Car valeting</strong> typically refers to a thorough clean of the vehicle — both interior and exterior. A professional valet covers vacuuming, interior wipe-down, exterior hand wash, wheel clean and window cleaning. It leaves the car clean and presentable.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              <strong>Car detailing</strong> goes further — it involves paint correction, decontamination, machine polishing, paint protection and restoration work that improves the vehicle&apos;s condition beyond its cleaned state. Detailing addresses defects in the paintwork and materials that valeting doesn&apos;t touch.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              At True To Detail, we offer services across the full spectrum — from a thorough valet (our Essential package) through to full paint correction and ceramic coating (our Elite Ceramic package). All delivered as a mobile service to your location.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              BENEFITS OF PROFESSIONAL CAR DETAILING
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Professional car detailing and valeting offers several advantages over DIY cleaning or a drive-through car wash:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Better results</strong> — Professional products, equipment and techniques deliver a finish that simply cannot be replicated at home.</li>
              <li><strong>Paint protection</strong> — Correct washing and decontamination techniques protect your paintwork. Automatic car washes cause swirl damage.</li>
              <li><strong>Vehicle value</strong> — A well-maintained vehicle in excellent condition retains significantly more resale value.</li>
              <li><strong>Hygiene</strong> — Deep interior cleaning removes bacteria, allergens and contaminants that a standard clean misses.</li>
              <li><strong>Convenience</strong> — Mobile detailing means zero inconvenience — we come to you and work around your schedule.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              MOBILE CAR VALET SERVICE COVERAGE
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              True To Detail provides professional mobile car valeting and detailing services across Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley and nearby towns. Our coverage spans the wider Hertfordshire region, including Harpenden, Tring, Abbots Langley, Chesham, Rickmansworth, Apsley, Leverstock Green, Redbourn, Boxmoor, Bovingdon and Markyate.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Our mobile setup is entirely self-contained — we bring our own power supply, water and professional-grade equipment. Whether you need a professional car valet at your home in Berkhamsted, your workplace in Watford or anywhere else across Hertfordshire, we can accommodate your booking.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              CAR VALETING PACKAGES & PRICING
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              We offer four packages to suit different requirements:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Essential Valet</strong> — Interior vacuum and wipe-down, exterior wash, wheels and windows. From £89 (hatchback).</li>
              <li><strong>Deep Clean Valet</strong> — Full interior deep clean including steam treatment, exterior decontamination, clay bar, machine polish and wax. From £179.</li>
              <li><strong>Premium Detail</strong> — Comprehensive interior restoration, paint decontamination, machine polish and synthetic sealant protection. From £299.</li>
              <li><strong>Elite Ceramic</strong> — Full paint correction and professional ceramic coating with 2-year warranty. From £549.</li>
            </ul>
          </section>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/" style={{ display: 'inline-block', background: '#E84A0C', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Book Your Valet
            </Link>
            <Link href="/mobile-car-detailing" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
              All Services →
            </Link>
          </div>

          <nav aria-label="Related services" style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '16px' }}>Related Services</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[['Mobile Car Detailing', '/mobile-car-detailing'], ['Interior Car Detailing', '/interior-car-detailing'], ['Exterior Car Detailing', '/exterior-car-detailing'], ['Full Car Detail', '/full-car-detail']].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
    </>
  )
}

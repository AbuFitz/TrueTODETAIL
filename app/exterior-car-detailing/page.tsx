import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Exterior Car Detailing Service | Hemel Hempstead & Hertfordshire',
  description:
    'Professional exterior car detailing near Hemel Hempstead. Paint decontamination, clay bar, machine polish, ceramic coating and paint protection. Mobile service covering all Hertfordshire areas.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/exterior-car-detailing',
  },
  openGraph: {
    title: 'Exterior Car Detailing | True To Detail',
    description: 'Professional exterior car detailing in Hertfordshire. Machine polish, paint correction, ceramic coating. Fully mobile service.',
    url: 'https://www.truetodetail.co.uk/exterior-car-detailing',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Exterior Car Detailing',
  provider: { '@type': 'LocalBusiness', name: 'True To Detail', url: 'https://www.truetodetail.co.uk', telephone: '+447984237149' },
  areaServed: ['Hemel Hempstead', 'Watford', 'St Albans', 'Berkhamsted', 'Harpenden', 'Kings Langley', 'Tring', 'Abbots Langley', 'Chesham', 'Rickmansworth'],
  serviceType: 'Exterior Car Detailing',
  url: 'https://www.truetodetail.co.uk/exterior-car-detailing',
}

export default function ExteriorCarDetailingPage() {
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
              <li aria-current="page">Exterior Car Detailing</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px' }}>
            EXTERIOR CAR DETAILING<br />
            <span style={{ color: '#E84A0C' }}>HERTFORDSHIRE</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '40px', fontWeight: 500 }}>
            Protect your paintwork and restore your vehicle&apos;s exterior to a flawless finish with our professional exterior car detailing service — available across Hemel Hempstead and all surrounding Hertfordshire areas.
          </p>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              WHAT DOES EXTERIOR DETAILING INCLUDE?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Exterior car detailing is a systematic, multi-stage process that goes well beyond a standard car wash. It removes contamination at every level — from surface road grime right down to bonded iron particles, tar and tree sap embedded in your paintwork.
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Pre-rinse and snow foam application to loosen surface contamination</li>
              <li>Safe two-bucket hand wash with premium pH-neutral shampoo</li>
              <li>Iron fallout and tar spot decontamination</li>
              <li>Clay bar treatment to remove bonded surface contamination</li>
              <li>Machine polish to remove swirl marks, light scratches and oxidation</li>
              <li>Paint protection wax, sealant or ceramic coating applied</li>
              <li>Wheel and tyre deep clean, wheel wax and tyre dressing</li>
              <li>Door shuts, arches and jambs cleaned</li>
              <li>Exterior glass polished and protected streak-free</li>
              <li>Plastic and rubber trim cleaned and dressed</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              PAINT CORRECTION & MACHINE POLISHING
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Over time, every vehicle develops swirl marks, light scratches and surface marring — often caused by improper washing techniques or automatic car washes. These defects scatter light and dull your paint&apos;s natural clarity and depth.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Machine polishing corrects these defects by removing a microscopic layer of clear coat, eliminating the scratches and restoring a mirror-like finish. Our single-stage machine polish (included in the Premium package) dramatically improves paint clarity and gloss. For more severe defects, our Elite Ceramic package includes full multi-stage paint correction prior to ceramic coating application.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              PAINT PROTECTION & CERAMIC COATING
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              After machine polishing, paint protection is applied to preserve the corrected finish and protect against future contamination. We offer three levels of protection:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Carnauba Wax</strong> — Natural warm gloss and 2–3 months of protection. Included in Deep Clean.</li>
              <li><strong>Synthetic Sealant</strong> — Harder, longer-lasting protection (4–6 months). Included in Premium.</li>
              <li><strong>Ceramic Coating</strong> — Semi-permanent protection with 2-year warranty, hydrophobic properties and exceptional gloss. Included in Elite Ceramic.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              MOBILE EXTERIOR DETAILING NEAR YOU
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              True To Detail provides mobile exterior car detailing services across Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley, Harpenden, Tring, Chesham and nearby Hertfordshire towns. We bring our professional setup directly to your home or workplace — no drop-off or collection needed.
            </p>
          </section>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/" style={{ display: 'inline-block', background: '#E84A0C', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Book Your Detail
            </Link>
            <Link href="/full-car-detail" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
              Full Car Detail →
            </Link>
          </div>

          <nav aria-label="Related services" style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '16px' }}>Related Services</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[['Mobile Car Detailing', '/mobile-car-detailing'], ['Interior Car Detailing', '/interior-car-detailing'], ['Full Car Detail', '/full-car-detail'], ['Professional Car Valeting', '/professional-car-valeting']].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
    </>
  )
}

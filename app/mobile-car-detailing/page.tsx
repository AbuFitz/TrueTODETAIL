import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mobile Car Detailing Near Hemel Hempstead & Hertfordshire',
  description:
    'True To Detail provides professional mobile car detailing across Hemel Hempstead, Watford, St Albans, Berkhamsted and all surrounding Hertfordshire areas. We come to you — no drop-off needed. Book online today.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/mobile-car-detailing',
  },
  openGraph: {
    title: 'Mobile Car Detailing Near Hemel Hempstead | True To Detail',
    description:
      'Professional mobile car detailing covering Hemel Hempstead and all surrounding Hertfordshire areas. Book online today.',
    url: 'https://www.truetodetail.co.uk/mobile-car-detailing',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Mobile Car Detailing',
  provider: {
    '@type': 'LocalBusiness',
    name: 'True To Detail',
    url: 'https://www.truetodetail.co.uk',
    telephone: '+447984237149',
  },
  areaServed: [
    'Hemel Hempstead', 'Watford', 'St Albans', 'Berkhamsted', 'Harpenden',
    'Kings Langley', 'Tring', 'Abbots Langley', 'Chesham', 'Rickmansworth',
    'Apsley', 'Leverstock Green', 'Redbourn', 'Boxmoor', 'Bovingdon', 'Markyate',
  ],
  description:
    'Professional mobile car detailing service operating across Hemel Hempstead and surrounding Hertfordshire towns.',
  serviceType: 'Mobile Car Detailing',
  url: 'https://www.truetodetail.co.uk/mobile-car-detailing',
}

export default function MobileCarDetailingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 48px)' }}>

          <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
            <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'rgba(12,12,12,0.45)' }}>
              <li><Link href="/" style={{ color: '#E84A0C', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden>›</li>
              <li aria-current="page">Mobile Car Detailing</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px' }}>
            MOBILE CAR DETAILING<br />
            <span style={{ color: '#E84A0C' }}>NEAR HEMEL HEMPSTEAD</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '40px', fontWeight: 500 }}>
            True To Detail provides professional mobile car detailing services across Hemel Hempstead and surrounding areas — we come directly to your home, workplace or any convenient location.
          </p>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              WHAT IS MOBILE CAR DETAILING?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Mobile car detailing is a professional cleaning and restoration service that comes directly to you. Unlike a traditional car wash, detailing involves a thorough, multi-stage process that cleans, protects and restores your vehicle to a near-showroom condition — inside and out.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              At True To Detail, our mobile detailing service covers every element of your vehicle: from deep interior cleaning and steam treatment to exterior decontamination, machine polishing and professional paint protection. Every job is carried out with professional-grade equipment — including our own power and water supply — so there&apos;s nothing you need to arrange.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Whether you&apos;re looking for a one-off clean before a special occasion, regular maintenance to keep your car looking its best, or a full paint correction and ceramic coating, we have a package to suit your needs and budget.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              AREAS WE COVER
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              True To Detail provides mobile car detailing services across Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley and nearby towns. Our coverage spans the wider Hertfordshire region, meaning we can reach customers across:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Hemel Hempstead and Boxmoor</li>
              <li>Watford and Rickmansworth</li>
              <li>St Albans and Harpenden</li>
              <li>Berkhamsted and Tring</li>
              <li>Kings Langley and Abbots Langley</li>
              <li>Apsley, Leverstock Green and Redbourn</li>
              <li>Chesham, Bovingdon and Markyate</li>
            </ul>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Not sure if we cover your area? Get in touch — if you&apos;re in or around Hertfordshire, the chances are we can reach you.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              WHY CHOOSE MOBILE DETAILING?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              The convenience of mobile car detailing is unmatched. There&apos;s no need to drive to a detailing studio, wait around, or arrange collection. Instead, our fully equipped van arrives at your chosen location — whether that&apos;s your driveway in Hemel Hempstead, your office car park in Watford, or a residential street in St Albans.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              For busy professionals, parents or anyone whose schedule doesn&apos;t allow for a half-day trip to a valeting centre, mobile detailing reclaims your time without compromising on the quality of results. You carry on with your day whilst we restore your vehicle.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Our pricing is fixed and transparent — the quote you receive when booking is exactly what you pay on the day. No hidden charges, no surprises.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              OUR DETAILING PACKAGES
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              We offer four main packages to suit different needs and budgets. All packages include our full mobile service — we come to you with everything needed to complete the job.
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Essential Detail</strong> — Interior vacuum, wipe-down, exterior hand wash, wheel clean, tyre dressing, windows. From £89.</li>
              <li><strong>Deep Clean Detail</strong> — Full interior deep clean, steam treatment, decontamination, clay bar, machine polish, wax protection. From £179.</li>
              <li><strong>Premium Detail</strong> — Comprehensive interior restoration, paint decontamination, single-stage machine polish, premium sealant. From £299.</li>
              <li><strong>Elite Ceramic</strong> — Full paint correction, professional-grade ceramic coating with 2-year warranty. From £549.</li>
            </ul>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Optional add-ons include engine bay detailing, headlight restoration, odour elimination and pet hair removal.
            </p>
          </section>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
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
            <Link href="/interior-car-detailing" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
              Interior Detailing →
            </Link>
          </div>

          <nav aria-label="Related services" style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '16px' }}>
              Related Services
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                ['Interior Car Detailing', '/interior-car-detailing'],
                ['Exterior Car Detailing', '/exterior-car-detailing'],
                ['Full Car Detail', '/full-car-detail'],
                ['Professional Car Valeting', '/professional-car-valeting'],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
    </>
  )
}

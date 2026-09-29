import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNavbar, SiteFooter } from '@/components/SiteChrome'
import BookNowButton from '@/components/BookNowButton'
import { AREAS } from '@/lib/areas'
import { PACKAGES, VEHICLE_LABELS, type VehicleType } from '@/lib/pricing'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'
import { faqJsonLd, jsonLdGraph } from '@/lib/jsonld'

const ESSENTIAL = PACKAGES.find((p) => p.id === 'Essential')!
const FULL_VALET = PACKAGES.find((p) => p.id === 'Full Valet')!
const VEHICLES = Object.keys(VEHICLE_LABELS) as VehicleType[]
const FROM = Math.min(...Object.values(ESSENTIAL.price))

export const metadata: Metadata = {
  title: 'Mobile Car Wash at Home in Hemel Hempstead & Herts',
  description: `A proper hand car wash on your driveway across Hemel Hempstead, Watford, St Albans and Hertfordshire. We bring our own water and power. From £${FROM}, no queues, no brushes.`,
  alternates: { canonical: '/mobile-car-wash' },
  openGraph: {
    title: 'Mobile Car Wash at Home | True To Detail',
    description: 'Hand car wash at your home or workplace across Hertfordshire. Our own water and power, fixed prices.',
    url: '/mobile-car-wash',
  },
}

const FAQS = [
  {
    q: 'Do you need to use my water or electricity?',
    a: 'No. We carry our own water and power, so we can wash your car on a driveway, in a work car park or on the street outside, as long as we can park close by.',
  },
  {
    q: 'How long does a mobile car wash take?',
    a: `Our Essential package takes around ${ESSENTIAL.duration.replace('–', ' to ')} depending on the size and condition of the vehicle. You don't need to stay with the car while we work.`,
  },
  {
    q: 'Is a mobile car wash the same as a valet?',
    a: `Not quite. Our Essential package is a thorough hand wash with a quick interior tidy. A full valet goes much deeper inside: seat shampoo, carpet extraction and door shuts, starting from £${Math.min(...Object.values(FULL_VALET.price))}.`,
  },
  {
    q: 'Why not just use a drive-through car wash?',
    a: 'Brush car washes drag grit across the paint and are one of the most common causes of swirl marks. A careful hand wash with clean mitts and pH-neutral shampoo gets the car just as clean without scratching it.',
  },
  {
    q: 'Can you wash my car while I am at work?',
    a: 'Yes. Plenty of our washes happen in workplace car parks during the day. Just let us know where the car is parked and leave us the keys or unlock it when we arrive.',
  },
]

const jsonLd = jsonLdGraph(
  breadcrumbJsonLd([['Home', '/'], ['Mobile Car Wash', '/mobile-car-wash']]),
  serviceJsonLd({
    name: 'Mobile Car Wash',
    path: '/mobile-car-wash',
    description: 'Hand car wash and interior tidy at your home or workplace across Hemel Hempstead and Hertfordshire, with our own water and power.',
    serviceType: 'Mobile car wash',
  }),
  faqJsonLd(FAQS),
)

const h2 = { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' } as const
const body = { fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' } as const

export default function MobileCarWashPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <SiteNavbar />
      <main style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'calc(80px + clamp(48px, 8vw, 96px)) clamp(24px, 5vw, 48px) clamp(48px, 8vw, 96px)' }}>

          <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
            <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'rgba(12,12,12,0.45)' }}>
              <li><Link href="/" style={{ color: '#E84A0C', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden>›</li>
              <li aria-current="page">Mobile Car Wash</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px' }}>
            MOBILE CAR WASH<br />
            <span style={{ color: '#E84A0C' }}>AT YOUR DOOR</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '40px', fontWeight: 500 }}>
            A proper hand car wash on your driveway or at work, anywhere across Hemel Hempstead and Hertfordshire. We bring our own water and power, so there&apos;s no queue, no brushes and no need to go anywhere.
          </p>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={h2}>WHAT&apos;S INCLUDED</h2>
            <p style={body}>
              Our mobile car wash is the {ESSENTIAL.id} package: {ESSENTIAL.description.charAt(0).toLowerCase() + ESSENTIAL.description.slice(1)}
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              {ESSENTIAL.includes.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={h2}>MOBILE CAR WASH PRICES</h2>
            <p style={body}>Fixed prices, the same across every area we cover. No call-out fee.</p>
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    {VEHICLES.map((v) => (
                      <th key={v} scope="col" style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '2px solid #E84A0C', fontWeight: 700, color: '#0C0C0C' }}>{VEHICLE_LABELS[v]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {VEHICLES.map((v) => (
                      <td key={v} style={{ padding: '14px 10px', fontFamily: 'var(--font-display)', fontSize: '28px', color: '#0C0C0C' }}>£{ESSENTIAL.price[v]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={body}>
              Want the inside done properly too? Our <Link href="/professional-car-valeting" style={{ color: '#E84A0C', textDecoration: 'none' }}>full valet</Link> adds seat shampoo, carpet extraction and spray wax.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={h2}>HAND WASH VS DRIVE-THROUGH CAR WASH</h2>
            <p style={body}>
              Automatic car washes are quick, but their brushes drag grit from every car before yours across your paint. Over time that leaves the fine swirl marks you see in direct sunlight. We wash by hand with clean mitts, a pH-neutral shampoo and a safe drying method, so the car comes out clean without collecting new scratches.
            </p>
            <p style={body}>
              And because we come to you, there&apos;s no queue on a Saturday morning and no sitting in the car while it goes through.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={h2}>WHERE WE WASH</h2>
            <p style={body}>
              We&apos;re based in Hemel Hempstead and cover roughly 25 miles around it. Pick your town to see local postcodes and details:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px' }}>
              {AREAS.map((a) => (
                <Link key={a.slug} href={`/areas/${a.slug}`} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>
                  Car wash in {a.name}
                </Link>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={h2}>MOBILE CAR WASH FAQS</h2>
            <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }}>
              {FAQS.map((f) => (
                <div key={f.q} style={{ padding: '20px 0', borderBottom: '1px solid rgba(12,12,12,0.08)' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '15px', color: '#0C0C0C', marginBottom: '8px', textTransform: 'none', letterSpacing: 0 }}>{f.q}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.72, color: 'rgba(12,12,12,0.58)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <BookNowButton style={{ display: 'inline-block', background: '#E84A0C', color: '#fff', padding: '15px 36px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Book Your Car Wash
            </BookNowButton>
            <Link href="/professional-car-valeting" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
              Full Valet →
            </Link>
          </div>

          <nav aria-label="Related services" style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '16px' }}>Related Services</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[['Mobile Car Detailing', '/mobile-car-detailing'], ['Professional Car Valeting', '/professional-car-valeting'], ['Interior Car Detailing', '/interior-car-detailing'], ['Exterior Car Detailing', '/exterior-car-detailing'], ['Van & Fleet (Coming Soon)', '/van-fleet']].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
      <SiteFooter />
    </>
  )
}

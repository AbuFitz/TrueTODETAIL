import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Interior Car Detailing Service | Hemel Hempstead & Hertfordshire',
  description:
    'Professional interior car detailing service covering Hemel Hempstead, Watford, St Albans and surrounding Hertfordshire areas. Deep clean, steam treatment, leather conditioning and odour elimination. Mobile service — we come to you.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/interior-car-detailing',
  },
  openGraph: {
    title: 'Interior Car Detailing | True To Detail',
    description: 'Professional interior car detailing in Hertfordshire. Steam cleaning, leather care, odour elimination and more. Fully mobile — we come to you.',
    url: 'https://www.truetodetail.co.uk/interior-car-detailing',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Interior Car Detailing',
  provider: { '@type': 'LocalBusiness', name: 'True To Detail', url: 'https://www.truetodetail.co.uk', telephone: '+447984237149' },
  areaServed: ['Hemel Hempstead', 'Watford', 'St Albans', 'Berkhamsted', 'Harpenden', 'Kings Langley', 'Tring', 'Abbots Langley', 'Chesham', 'Rickmansworth'],
  serviceType: 'Interior Car Detailing',
  url: 'https://www.truetodetail.co.uk/interior-car-detailing',
}

export default function InteriorCarDetailingPage() {
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
              <li aria-current="page">Interior Car Detailing</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', color: '#0C0C0C', lineHeight: 0.92, marginBottom: '24px' }}>
            INTERIOR CAR DETAILING<br />
            <span style={{ color: '#E84A0C' }}>HERTFORDSHIRE</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(12,12,12,0.65)', marginBottom: '40px', fontWeight: 500 }}>
            A professional interior car detail transforms your vehicle cabin — removing ingrained dirt, bacteria, odours and staining to restore a clean, fresh environment you&apos;ll notice immediately.
          </p>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              WHAT DOES INTERIOR DETAILING INCLUDE?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Interior car detailing goes far beyond a standard vacuum and wipe-down. At True To Detail, our interior service is a systematic, multi-stage deep clean covering every surface inside your vehicle — from the headlining and dashboard to the carpets, seats and door pockets.
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(12,12,12,0.62)', paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Full interior vacuum including seats, carpets, boot, footwells and crevices</li>
              <li>Steam cleaning of hard surfaces, vents, door cards and centre console</li>
              <li>Fabric seat and carpet extraction to remove embedded dirt and staining</li>
              <li>Leather seat cleaning and conditioning to prevent cracking and fading</li>
              <li>Dashboard, trim and plastics deep cleaned and dressed</li>
              <li>Interior glass cleaned streak-free (including windscreen interior)</li>
              <li>Odour elimination treatment where required</li>
              <li>Door shuts and jambs cleaned and treated</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              HOW INTERIOR DETAILING RESTORES YOUR VEHICLE
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Over time, even well-kept vehicle interiors accumulate bacteria, allergens, ingrained dirt and unpleasant odours — particularly in families with children, pet owners, or vehicles with high mileage. A professional interior detail tackles all of this systematically.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Our steam cleaning process reaches temperatures that kill bacteria and sanitise surfaces without harsh chemicals. Combined with hot water extraction on fabric seats and carpets, the result is a genuinely deep clean — not just a surface refresh.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              For leather interiors, regular conditioning is essential to prevent the material drying out and cracking. Our conditioning treatments restore suppleness and provide UV protection to extend the life of your leather significantly.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              MOBILE INTERIOR DETAILING ACROSS HERTFORDSHIRE
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              True To Detail provides mobile interior car detailing services across Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley and nearby towns. We bring our full professional setup directly to your location — no detailing studio visit required.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Whether you&apos;re based in Harpenden, Tring, Rickmansworth, Chesham or anywhere across the wider Hertfordshire area, we can reach you. Our fully self-contained mobile unit includes its own power, water and professional-grade equipment.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em', color: '#0C0C0C', marginBottom: '16px' }}>
              INTERIOR DETAILING PRICING
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)', marginBottom: '16px' }}>
              Interior detailing is included in our Deep Clean, Premium and Elite Ceramic packages. Pricing starts from £179 for a standard hatchback interior deep clean, with exact pricing depending on vehicle size and condition.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.78, color: 'rgba(12,12,12,0.62)' }}>
              Our pet hair removal and odour elimination add-ons are available for vehicles that need extra attention. All pricing is fixed at booking — no hidden charges, no changes on the day.
            </p>
          </section>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/" style={{ display: 'inline-block', background: '#E84A0C', color: '#fff', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Book Your Detail
            </Link>
            <Link href="/exterior-car-detailing" style={{ display: 'inline-block', background: 'transparent', color: '#0C0C0C', padding: '15px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(12,12,12,0.2)' }}>
              Exterior Detailing →
            </Link>
          </div>

          <nav aria-label="Related services" style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '16px' }}>Related Services</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[['Mobile Car Detailing', '/mobile-car-detailing'], ['Exterior Car Detailing', '/exterior-car-detailing'], ['Full Car Detail', '/full-car-detail'], ['Professional Car Valeting', '/professional-car-valeting']].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#E84A0C', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
    </>
  )
}

import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

// Bebas Neue — single-weight display font for all major headlines
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

// DM Sans — geometric humanist sans for all body, nav, labels, UI
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const SITE_URL = 'https://www.truetodetail.co.uk'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mobile Car Detailing Near Hemel Hempstead | True To Detail',
    template: '%s | True To Detail',
  },
  description:
    'Professional mobile car detailing and valeting service covering Hemel Hempstead, Watford, St Albans, Berkhamsted and surrounding Hertfordshire areas. Interior, exterior and full detailing packages. We come to you.',
  keywords: [
    'mobile car detailing near Hemel Hempstead',
    'mobile car valeting near me',
    'car detailing near Hemel Hempstead',
    'professional car detailing service near me',
    'mobile car cleaning service near me',
    'interior car detailing service',
    'exterior car detailing service',
    'professional car valet service',
    'mobile car detailer near me',
    'car detailing Watford',
    'car detailing St Albans',
    'car detailing Berkhamsted',
    'car valeting Hertfordshire',
    'ceramic coating Hemel Hempstead',
    'paint correction Hertfordshire',
    'mobile detailing Kings Langley',
    'car detailing Harpenden',
    'car detailing Tring',
  ],
  authors: [{ name: 'True To Detail', url: SITE_URL }],
  creator: 'True To Detail',
  publisher: 'True To Detail',
  formatDetection: { telephone: true, email: true, address: true },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'True To Detail',
    title: 'Mobile Car Detailing Near Hemel Hempstead | True To Detail',
    description:
      'Professional mobile car detailing and valeting covering Hemel Hempstead, Watford, St Albans, Berkhamsted and all surrounding Hertfordshire towns. Book online today.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'True To Detail — Professional Mobile Car Detailing in Hertfordshire',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Car Detailing Near Hemel Hempstead | True To Detail',
    description:
      'Professional mobile car detailing and valeting in Hertfordshire. We come to you — no drop-off needed.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: 'True To Detail',
      description:
        'Professional mobile car detailing and valeting service covering Hemel Hempstead and surrounding Hertfordshire areas including Watford, St Albans, Berkhamsted, Kings Langley, Harpenden, Tring, Abbots Langley, Chesham, Rickmansworth, Apsley, Leverstock Green, Redbourn, Boxmoor, Bovingdon and Markyate.',
      url: SITE_URL,
      telephone: '+447984237149',
      email: 'hello@truetodetail.co.uk',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
      image: `${SITE_URL}/og-image.jpg`,
      priceRange: '££',
      currenciesAccepted: 'GBP',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '19:00',
        },
      ],
      areaServed: [
        { '@type': 'City', name: 'Hemel Hempstead' },
        { '@type': 'City', name: 'Watford' },
        { '@type': 'City', name: 'St Albans' },
        { '@type': 'City', name: 'Berkhamsted' },
        { '@type': 'City', name: 'Harpenden' },
        { '@type': 'City', name: 'Kings Langley' },
        { '@type': 'City', name: 'Tring' },
        { '@type': 'City', name: 'Abbots Langley' },
        { '@type': 'City', name: 'Chesham' },
        { '@type': 'City', name: 'Rickmansworth' },
        { '@type': 'City', name: 'Apsley' },
        { '@type': 'City', name: 'Leverstock Green' },
        { '@type': 'City', name: 'Redbourn' },
        { '@type': 'City', name: 'Boxmoor' },
        { '@type': 'City', name: 'Bovingdon' },
        { '@type': 'City', name: 'Markyate' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Car Detailing Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Essential Car Detail',
              description: 'Interior vacuum, wipe-down, exterior hand wash, wheel clean, tyre dressing and window clean.',
              url: `${SITE_URL}/mobile-car-detailing`,
            },
            price: '89.00',
            priceCurrency: 'GBP',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: 89, maxPrice: 149, priceCurrency: 'GBP' },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Deep Clean Car Detail',
              description: 'Full interior deep clean, steam treatment, exterior decontamination, clay bar, machine polish and wax protection.',
              url: `${SITE_URL}/interior-car-detailing`,
            },
            price: '179.00',
            priceCurrency: 'GBP',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: 179, maxPrice: 279, priceCurrency: 'GBP' },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Premium Full Car Detail',
              description: 'Comprehensive interior restoration, paint decontamination, single-stage machine polish, and premium sealant protection.',
              url: `${SITE_URL}/full-car-detail`,
            },
            price: '299.00',
            priceCurrency: 'GBP',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: 299, maxPrice: 479, priceCurrency: 'GBP' },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Elite Ceramic Coating',
              description: 'Full paint correction, professional ceramic coating application with 2-year warranty and premium interior treatment.',
              url: `${SITE_URL}/professional-car-valeting`,
            },
            price: '549.00',
            priceCurrency: 'GBP',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: 549, maxPrice: 849, priceCurrency: 'GBP' },
          },
        ],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '47',
        bestRating: '5',
        worstRating: '1',
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'James M.' },
          reviewBody: 'Absolutely incredible results. My BMW looks better than it did from the showroom. The team are professional, punctual, and genuinely passionate about their work.',
        },
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'Sarah K.' },
          reviewBody: 'Used TTD for a full interior deep clean after my dog had basically destroyed it. They came to my house, sorted everything, and left it spotless. Cannot recommend enough.',
        },
        {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Person', name: 'Daniel R.' },
          reviewBody: "Fixed swirl marks I thought were permanent. Honest pricing, no upselling, and the ceramic coating has held up brilliantly. Five stars isn't enough.",
        },
      ],
      sameAs: [
        'https://www.instagram.com/truetodetail',
        'https://www.tiktok.com/@truetodetail',
        'https://www.facebook.com/truetodetail',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'True To Detail',
      description: 'Professional mobile car detailing and valeting in Hertfordshire',
      publisher: { '@id': `${SITE_URL}/#business` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?s={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long does car detailing take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on the package. Our Essential detail runs 2–3 hours, Deep Clean 4–5 hours, Premium 6–8 hours, and Elite Ceramic takes 1–2 days. We confirm your exact arrival window on the morning of your booking.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer mobile car detailing near me?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — True To Detail is a fully mobile service. We come directly to your home, workplace, or any convenient location. We cover Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley, Harpenden, Tring, Abbots Langley, Chesham, Rickmansworth and nearby towns.',
          },
        },
        {
          '@type': 'Question',
          name: 'What areas do you cover for mobile car detailing?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'True To Detail provides mobile car detailing services across Hemel Hempstead and surrounding areas including Watford, St Albans, Berkhamsted, Kings Langley, Harpenden, Tring, Abbots Langley, Chesham, Rickmansworth, Apsley, Leverstock Green, Redbourn, Boxmoor, Bovingdon, Markyate and other nearby Hertfordshire towns.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is included in a full car detail?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our Premium full car detail includes a comprehensive interior deep clean, steam treatment, full exterior decontamination, clay bar treatment, machine polish to remove swirls and scratches, and premium paint sealant for long-lasting protection.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I detail my car?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For most drivers, we recommend a thorough detail every 3–6 months depending on usage. Regular maintenance details every 6–8 weeks help preserve the finish between full details and protect your paintwork year-round.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to be home during the car detail?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "No. As long as we can access the vehicle, you can carry on with your day. We'll message you when we arrive and again when the work is complete.",
          },
        },
        {
          '@type': 'Question',
          name: 'What do I need to prepare before my car detail?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nothing — we bring our own power, water and all professional-grade equipment. Simply ensure the vehicle is accessible and we handle everything else.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I pay for my car detailing service?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Payment is due on the day of service. We accept card, bank transfer and cash. Your price is fixed at booking — no hidden charges or last-minute changes.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={SITE_URL} />
      </head>
      <body className="bg-white text-site-black font-body antialiased">{children}</body>
    </html>
  )
}

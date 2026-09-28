// Shared structured data and URL helpers so every page describes the same
// business entity (one @id) with the same real prices from lib/pricing.ts,
// instead of each page hand-copying its own slightly different version.

import { AREAS } from '@/lib/areas'
import { PACKAGES, BUSINESS_INFO } from '@/lib/pricing'

export const SITE_URL = 'https://www.truetodetail.co.uk'
export const BUSINESS_ID = `${SITE_URL}/#business`
export const WEBSITE_ID = `${SITE_URL}/#website`

// Towns we cover that don't (yet) have their own area page. Kept here so the
// structured data and the visible copy name the same places.
const EXTRA_TOWNS = [
  'Kings Langley', 'Abbots Langley', 'Bovingdon', 'Redbourn', 'Markyate',
  'Radlett', 'Bushey', 'Hatfield', 'Welwyn Garden City', 'Beaconsfield', 'High Wycombe',
]

export const SERVED_TOWNS: string[] = [...AREAS.map((a) => a.name), ...EXTRA_TOWNS]

const BASE = AREAS.find((a) => a.slug === 'hemel-hempstead')!

export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

function priceRange(): string {
  const all = PACKAGES.flatMap((p) => Object.values(p.price))
  return `£${Math.min(...all)}-£${Math.max(...all)}`
}

export function localBusinessJsonLd() {
  return {
    '@type': 'AutoWash',
    '@id': BUSINESS_ID,
    name: BUSINESS_INFO.name,
    alternateName: 'True To Detail Mobile Car Valeting & Detailing',
    description:
      'Fully mobile car valeting, car detailing and hand car wash service based in Hemel Hempstead. We come to your home or workplace with our own water and power, covering Hertfordshire and nearby parts of Buckinghamshire, Bedfordshire and North West London within roughly 25 miles.',
    url: SITE_URL,
    telephone: BUSINESS_INFO.phoneTel,
    email: BUSINESS_INFO.email,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    image: `${SITE_URL}/og-image.jpg`,
    priceRange: priceRange(),
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
    // Service-area business: locality only, no street address published.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hemel Hempstead',
      addressRegion: 'Hertfordshire',
      addressCountry: 'GB',
    },
    geo: { '@type': 'GeoCoordinates', latitude: BASE.lat, longitude: BASE.lng },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '19:00',
      },
    ],
    areaServed: [
      {
        '@type': 'GeoCircle',
        geoMidpoint: { '@type': 'GeoCoordinates', latitude: BASE.lat, longitude: BASE.lng },
        geoRadius: Math.round(BUSINESS_INFO.coverageRadiusMiles * 1609.34),
      },
      ...SERVED_TOWNS.map((name) => ({ '@type': 'City', name })),
      { '@type': 'AdministrativeArea', name: 'Hertfordshire' },
      { '@type': 'AdministrativeArea', name: 'Buckinghamshire' },
      { '@type': 'AdministrativeArea', name: 'Bedfordshire' },
    ],
    knowsAbout: [
      'Mobile car valeting',
      'Car detailing',
      'Mobile car wash',
      'Hand car wash',
      'Interior car cleaning',
      'Machine polishing',
      'Paint correction',
      'Ceramic coating',
      'Van and fleet cleaning',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mobile Car Valeting & Detailing Packages',
      itemListElement: PACKAGES.map((p) => {
        const prices = Object.values(p.price)
        return {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: `${p.id} Package`, description: p.description },
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            priceCurrency: 'GBP',
          },
        }
      }),
    },
    sameAs: [
      'https://www.instagram.com/truetodetail',
      'https://www.tiktok.com/@truetodetail',
      'https://www.facebook.com/truetodetail',
    ],
  }
}

export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'True To Detail',
    alternateName: ['TTD', 'True To Detail Car Detailing'],
    inLanguage: 'en-GB',
    publisher: { '@id': BUSINESS_ID },
  }
}

export function serviceJsonLd(opts: {
  name: string
  path: string
  description: string
  serviceType: string
  areaName?: string
  county?: string
}) {
  const url = absoluteUrl(opts.path)
  const prices = PACKAGES.flatMap((p) => Object.values(p.price))
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url,
    provider: { '@id': BUSINESS_ID },
    areaServed: opts.areaName
      ? {
          '@type': 'City',
          name: opts.areaName,
          ...(opts.county ? { containedInPlace: { '@type': 'AdministrativeArea', name: opts.county } } : {}),
        }
      : SERVED_TOWNS.map((name) => ({ '@type': 'City', name })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'GBP',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
    },
  }
}

export function breadcrumbJsonLd(items: [name: string, path: string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function jsonLdGraph(...nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
}

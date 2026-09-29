import type { Metadata } from 'next'
import Script from 'next/script'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import SupportWidget from '@/components/SupportWidget'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import { SITE_URL, localBusinessJsonLd, websiteJsonLd } from '@/lib/seo'
import { jsonLdGraph } from '@/lib/jsonld'
import './globals.css'

// Google tag (Analytics/Ads) measurement ID. Not a secret: it's public in every
// page's rendered HTML and network requests, so it's fine hardcoded here.
const GA_MEASUREMENT_ID = 'G-YSW7TYVCE9'

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

// Search Console / Bing Webmaster verification codes live in Vercel env vars
// (they're public by design, but keeping them out of the repo means swapping
// accounts never needs a code change). Empty until set.
const verificationOther: Record<string, string> = {}
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther['msvalidate.01'] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
}

const HOME_TITLE = 'Mobile Car Valeting & Detailing in Hemel Hempstead | True To Detail'
const HOME_DESCRIPTION =
  'Mobile car valeting, detailing and hand car washes at your door across Hemel Hempstead, Watford, St Albans and Herts. Fixed prices from £80. Book online.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: '%s | True To Detail',
  },
  description: HOME_DESCRIPTION,
  applicationName: 'True To Detail',
  authors: [{ name: 'True To Detail', url: SITE_URL }],
  creator: 'True To Detail',
  publisher: 'True To Detail',
  category: 'Automotive',
  formatDetection: { telephone: true, email: true, address: true },
  alternates: {
    canonical: '/',
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    other: verificationOther,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'True To Detail',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'True To Detail: mobile car valeting and detailing in Hertfordshire',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
  manifest: '/manifest.webmanifest',
}

export const viewport = {
  themeColor: '#0C0C0C',
}

// Site-wide structured data: the business entity and the website. Page-level
// schema (services, areas, FAQs) references this business by @id rather than
// redefining it, and FAQ markup lives only on the page whose FAQ is visible.
const jsonLd = jsonLdGraph(localBusinessJsonLd(), websiteJsonLd())

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        {/*
          Google tag (gtag.js) with Consent Mode v2. All signals default to
          "denied" until the visitor accepts via CookieConsentBanner (or has
          already accepted in a previous visit, per localStorage) — required
          for UK/EEA visitors before any analytics or ad cookies are set.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              var storedConsent = null;
              try { storedConsent = localStorage.getItem('ttd_cookie_consent'); } catch (e) {}
              var granted = storedConsent === 'granted';
              gtag('consent', 'default', {
                ad_storage: granted ? 'granted' : 'denied',
                ad_user_data: granted ? 'granted' : 'denied',
                ad_personalization: granted ? 'granted' : 'denied',
                analytics_storage: granted ? 'granted' : 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `gtag('js', new Date());\ngtag('config', '${GA_MEASUREMENT_ID}');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className="bg-white text-site-black font-body antialiased">
        {children}
        {/*
          gtag.js (~170 KB) loads after the page finishes loading so it never
          competes with the hero image or hydration. The consent defaults and
          config above only queue commands on dataLayer, which it processes
          on arrival, so no pageview is lost.
        */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
        <SupportWidget />
        <CookieConsentBanner />
      </body>
    </html>
  )
}

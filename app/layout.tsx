import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

// Bebas Neue — single-weight display font for all major headlines
// Clean, condensed, ultra-bold. Industry standard for premium automotive brands.
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

// DM Sans — geometric humanist sans for all body, nav, labels, UI
// Much cleaner and more premium-feeling than Inter for this brand style.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TRUE TO DETAIL — Premium Mobile Auto Detailing',
  description:
    'Professional mobile car detailing in Hemel Hempstead & Hertfordshire. Book online for hand wash, paint correction, ceramic coating and more.',
  keywords: ['car detailing', 'mobile detailing', 'ceramic coating', 'paint correction', 'Hemel Hempstead'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="bg-white text-site-black font-body antialiased">{children}</body>
    </html>
  )
}

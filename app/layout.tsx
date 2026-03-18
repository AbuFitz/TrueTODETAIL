import type { Metadata } from 'next'
import { Space_Grotesk, Barlow_Condensed, Inter } from 'next/font/google'
import './globals.css'

// Wordmark / logo — Space Grotesk Bold matches the heavy grotesque style in the reference
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-wordmark',
  display: 'swap',
})

// Section headings — Barlow Condensed ultra-bold for the big condensed headline look
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

// Body text — Inter for all body copy, labels and UI text
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" className={`${spaceGrotesk.variable} ${barlowCondensed.variable} ${inter.variable}`}>
      <body className="bg-white text-site-black font-body antialiased">{children}</body>
    </html>
  )
}

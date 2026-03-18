import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Logo / wordmark — normal-width Barlow 900 with wide tracking = "dragged" effect
const barlowWordmark = Barlow({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-wordmark',
  display: 'swap',
})

// Section headings — condensed Barlow 800, Benzin Bold equivalent
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

// Body — Inter, closest to Neue Haas Unica Pro available on Google
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

// UI labels / overlines / nav — JetBrains Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TRUE TO DETAIL — Premium Auto Detailing',
  description:
    'Professional car detailing packages that transform your vehicle. Book mobile detailing, paint correction, ceramic coatings and more.',
  keywords: ['car detailing', 'auto detailing', 'ceramic coating', 'paint correction', 'mobile detailing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${barlowWordmark.variable} ${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-white text-site-black font-body">{children}</body>
    </html>
  )
}

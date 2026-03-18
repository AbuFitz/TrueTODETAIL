import type { Metadata } from 'next'
import { Barlow, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
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
    <html lang="en" className={`${barlow.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="bg-white text-site-black font-body">{children}</body>
    </html>
  )
}

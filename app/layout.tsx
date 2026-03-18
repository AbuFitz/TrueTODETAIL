import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import './globals.css'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
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
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-white text-site-black font-body">{children}</body>
    </html>
  )
}

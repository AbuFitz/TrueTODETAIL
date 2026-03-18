import type { Metadata } from 'next'
import { Barlow_Condensed, DM_Sans } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
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
    <html lang="en" className={`${barlow.variable} ${dmSans.variable}`}>
      <body className="bg-white text-site-black font-body">{children}</body>
    </html>
  )
}

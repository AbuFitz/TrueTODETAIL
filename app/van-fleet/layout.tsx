import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Van & Fleet Cleaning: Coming Soon to Hertfordshire',
  description:
    'Van and fleet cleaning from True To Detail is coming soon to Hemel Hempstead and Hertfordshire. Register your interest and we will let you know the moment it opens.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/van-fleet',
  },
  openGraph: {
    title: 'Van & Fleet Cleaning, Coming Soon | True To Detail',
    description:
      'Van and fleet cleaning is coming soon to Hemel Hempstead and Hertfordshire. Register your interest.',
    url: 'https://www.truetodetail.co.uk/van-fleet',
  },
}

export default function VanFleetLayout({ children }: { children: React.ReactNode }) {
  return children
}

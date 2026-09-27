import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Van & Fleet Cleaning Services | True To Detail',
  description:
    'Commercial van and fleet cleaning across Hemel Hempstead and Hertfordshire. Priority scheduling, consistent results and discounted rates for 3+ vehicles. Get a tailored quote.',
  alternates: {
    canonical: 'https://www.truetodetail.co.uk/van-fleet',
  },
  openGraph: {
    title: 'Van & Fleet Cleaning Services | True To Detail',
    description:
      'Commercial van and fleet cleaning across Hemel Hempstead and Hertfordshire. Priority scheduling, consistent results and discounted rates for 3+ vehicles.',
    url: 'https://www.truetodetail.co.uk/van-fleet',
  },
}

export default function VanFleetLayout({ children }: { children: React.ReactNode }) {
  return children
}

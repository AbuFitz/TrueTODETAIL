import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'True To Detail',
    short_name: 'True To Detail',
    description: 'Mobile car detailing across Hemel Hempstead & Hertfordshire',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0C0C',
    theme_color: '#0C0C0C',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

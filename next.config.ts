import type { NextConfig } from 'next'

// Proxies the Job System app's account pages in under this site's own
// domain — visiting /account here transparently serves
// app.truetodetail.co.uk/account behind the scenes, so there's no redirect
// and no second domain in the address bar. The asset paths are needed too:
// the proxied HTML references its own JS/CSS bundle at these same
// root-relative paths, which the browser would otherwise request from
// *this* site (where they don't exist) rather than the app. Staff/admin and
// detailer links stay on the app's own subdomain on purpose — see
// lib/appUrl.ts.
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://app.truetodetail.co.uk').replace(/\/$/, '')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/account', destination: `${APP_URL}/account` },
      { source: '/account/:path*', destination: `${APP_URL}/account/:path*` },
      { source: '/assets/:path*', destination: `${APP_URL}/assets/:path*` },
      { source: '/icons/:path*', destination: `${APP_URL}/icons/:path*` },
      { source: '/maplibre/:path*', destination: `${APP_URL}/maplibre/:path*` },
    ]
  },
}

export default nextConfig

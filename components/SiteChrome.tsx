'use client'

import Navbar from './Navbar'
import Footer from './Footer'

// Pages outside the homepage have no BookingModal of their own. Reuse the
// same cross-page event the SupportWidget uses: dispatch it (the homepage
// listens and opens its modal), then navigate home if we're not there yet.
function handleBookNow() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('ttd:book-now'))
  if (window.location.pathname !== '/') {
    window.location.href = '/'
  }
}

export function SiteNavbar() {
  return <Navbar onBookNow={handleBookNow} />
}

export function SiteFooter() {
  return <Footer onBookNow={handleBookNow} />
}

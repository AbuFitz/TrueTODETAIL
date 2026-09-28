'use client'

import Navbar from './Navbar'
import Footer from './Footer'

// Pages outside the homepage have no BookingModal of their own. On the
// homepage itself, dispatch the event the homepage already listens for.
// From any other page, a plain event fired right before navigating away
// is lost — the homepage's listener doesn't exist until after the new
// page has loaded — so instead flag it via a query param the homepage
// checks for on mount.
function handleBookNow() {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== '/') {
    window.location.href = '/?book=1'
  } else {
    window.dispatchEvent(new Event('ttd:book-now'))
  }
}

export function SiteNavbar() {
  return <Navbar onBookNow={handleBookNow} />
}

export function SiteFooter() {
  return <Footer onBookNow={handleBookNow} />
}

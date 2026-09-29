'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import BookingModal from './LazyBookingModal'

// Every page that isn't the homepage renders both SiteNavbar and SiteFooter
// (never one without the other), so the actual modal instance lives here,
// in SiteFooter — its fixed-position overlay doesn't care where it sits in
// the tree. SiteNavbar's "Book Now" just dispatches the same ttd:book-now
// event the homepage's own BookingModal already listens for, so clicking
// it opens the modal in place instead of leaving the current page.
function dispatchBookNow() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('ttd:book-now'))
}

export function SiteNavbar() {
  return <Navbar onBookNow={dispatchBookNow} />
}

export function SiteFooter() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handler = () => setModalOpen(true)
    window.addEventListener('ttd:book-now', handler)
    return () => window.removeEventListener('ttd:book-now', handler)
  }, [])

  return (
    <>
      <Footer onBookNow={dispatchBookNow} />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

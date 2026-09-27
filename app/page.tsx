'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Packages from '@/components/Packages'
import FAQ from '@/components/FAQ'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import BookingCTA from '@/components/BookingCTA'
import BookingModal from '@/components/BookingModal'
import Footer from '@/components/Footer'

type VehicleType = 'small' | 'midsize' | 'largesuv'

export default function HomePage() {
  const [modalOpen,       setModalOpen]       = useState(false)
  const [selectedPack,    setSelectedPack]    = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | ''>('')

  const openModal = () => {
    setSelectedPack('')
    setSelectedVehicle('')
    setModalOpen(true)
  }

  const handleBookPack = (pack: string, vehicle: VehicleType) => {
    setSelectedPack(pack)
    setSelectedVehicle(vehicle)
    setModalOpen(true)
  }

  // Lets the site-wide SupportWidget/Navbar/Footer open this modal from anywhere.
  // On the homepage itself, that's a same-page event. From other pages, the
  // caller navigates here with ?book=1 instead (an event fired right before
  // a full page navigation would never reach this listener).
  useEffect(() => {
    const handler = () => openModal()
    window.addEventListener('ttd:book-now', handler)

    if (new URLSearchParams(window.location.search).get('book') === '1') {
      openModal()
      window.history.replaceState({}, '', '/')
    }

    return () => window.removeEventListener('ttd:book-now', handler)
  }, [])

  return (
    <>
      <Navbar onBookNow={openModal} />

      <main>
        <Hero       onBookNow={openModal} />
        <Stats />
        <Packages   onBookPack={handleBookPack} />
        <FAQ />
        <HowItWorks onBookNow={openModal} />
        <Testimonials />
        <BookingCTA onBookNow={openModal} />
      </main>

      <Footer onBookNow={openModal} />

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPack={selectedPack}
        initialVehicle={selectedVehicle}
      />
    </>
  )
}

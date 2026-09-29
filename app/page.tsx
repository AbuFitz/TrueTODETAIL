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
import BookingModal from '@/components/LazyBookingModal'
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

  // Lets the site-wide SupportWidget open this modal from the homepage too.
  useEffect(() => {
    const handler = () => openModal()
    window.addEventListener('ttd:book-now', handler)
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

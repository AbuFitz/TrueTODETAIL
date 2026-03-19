'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Process from '@/components/Process'
import Packages from '@/components/Packages'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import BookingCTA from '@/components/BookingCTA'
import BookingModal from '@/components/BookingModal'
import Footer from '@/components/Footer'

type VehicleType = 'hatchback' | 'suv' | 'prestige'

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

  return (
    <>
      <Navbar onBookNow={openModal} />

      <main>
        <Hero     onBookNow={openModal} />
        <Stats />
        <Process />
        <Packages onBookPack={handleBookPack} />
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

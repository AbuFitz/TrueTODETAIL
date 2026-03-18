'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Packages from '@/components/Packages'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import BookingCTA from '@/components/BookingCTA'
import BookingModal from '@/components/BookingModal'
import Footer from '@/components/Footer'

type VehicleType = 'sedan' | 'suv' | 'exotic'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState('Premium')
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('sedan')
  const [selectedPrice, setSelectedPrice] = useState(299)

  const openModal = () => setModalOpen(true)

  const handleBookPack = (pack: string, vehicle: VehicleType, price: number) => {
    setSelectedPack(pack)
    setSelectedVehicle(vehicle)
    setSelectedPrice(price)
    setModalOpen(true)
  }

  return (
    <>
      <Navbar onBookNow={openModal} />

      <main>
        <Hero onBookNow={openModal} />
        <Stats />
        <Packages onBookPack={handleBookPack} />
        <Services />
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
        initialPrice={selectedPrice}
      />
    </>
  )
}

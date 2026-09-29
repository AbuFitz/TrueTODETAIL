'use client'

import { useEffect, type ComponentProps } from 'react'
import dynamic from 'next/dynamic'
import type BookingModalComponent from './BookingModal'

// The booking popup (and framer-motion with it) isn't needed to paint the
// page, so it loads on demand instead of shipping in every page's first
// bundle. It also mounts fresh on each open, so the package or vehicle a
// visitor picked on a card is always the one preselected.
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false })

const loadBookingModal = () => import('./BookingModal')

export default function LazyBookingModal(props: ComponentProps<typeof BookingModalComponent>) {
  // Warm the chunk on the visitor's first interaction, so the popup is
  // usually ready before they reach a Book button.
  useEffect(() => {
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const
    const warm = () => {
      events.forEach((e) => window.removeEventListener(e, warm))
      void loadBookingModal()
    }
    events.forEach((e) => window.addEventListener(e, warm, { once: true, passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, warm))
  }, [])

  if (!props.isOpen) return null
  return <BookingModal {...props} />
}

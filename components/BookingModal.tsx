'use client'

import { useState } from 'react'

type VehicleType = 'sedan' | 'suv' | 'exotic'
type Step = 1 | 2 | 3 | 4

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialPack?: string
  initialVehicle?: VehicleType
  initialPrice?: number
}

const packOptions = ['Essential', 'Deep Clean', 'Premium', 'Elite Ceramic']
const vehicleLabels: Record<VehicleType, string> = {
  sedan: 'Sedan / Hatch',
  suv: 'SUV / Truck',
  exotic: 'Sports / Exotic',
}
const timeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']

const priceMap: Record<string, Record<VehicleType, number>> = {
  'Essential':     { sedan: 89,  suv: 109, exotic: 149 },
  'Deep Clean':    { sedan: 179, suv: 219, exotic: 279 },
  'Premium':       { sedan: 299, suv: 369, exotic: 479 },
  'Elite Ceramic': { sedan: 549, suv: 679, exotic: 849 },
}

export default function BookingModal({
  isOpen,
  onClose,
  initialPack = 'Premium',
  initialVehicle = 'sedan',
  initialPrice = 299,
}: BookingModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [pack, setPack] = useState(initialPack)
  const [vehicle, setVehicle] = useState<VehicleType>(initialVehicle)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [bookingId, setBookingId] = useState('')

  const price = priceMap[pack]?.[vehicle] ?? initialPrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setApiError('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack, vehicle, price, date, time, name, phone, email, address, notes }),
      })

      const json = await res.json()

      if (!res.ok) {
        setApiError(json.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      setBookingId(json.booking?.id ?? '')
      setStep(4)
    } catch {
      setApiError('Network error — please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setName('')
      setPhone('')
      setEmail('')
      setAddress('')
      setNotes('')
      setDate('')
      setTime('')
      setApiError('')
      setBookingId('')
    }, 350)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-site-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 bg-white w-full md:max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="bg-site-black text-white px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">
              Mobile Detailing — Booking Request
            </p>
            <h2 className="font-display text-2xl uppercase">
              {step === 4 ? 'BOOKING CONFIRMED' : 'BOOK YOUR DETAIL'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors text-xl font-body"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex border-b border-black/10">
            {(['Pack', 'Schedule', 'Your Details'] as const).map((label, i) => (
              <div
                key={label}
                className={`flex-1 py-2.5 text-center font-body font-semibold text-[10px] tracking-[0.15em] uppercase transition-colors ${
                  step === i + 1
                    ? 'bg-orange text-white'
                    : step > i + 1
                    ? 'bg-site-light text-site-black/30 line-through'
                    : 'bg-site-light text-site-black/30'
                }`}
              >
                {i + 1}. {label}
              </div>
            ))}
          </div>
        )}

        <div className="p-8">

          {/* ─── STEP 1: Pack & Vehicle ─── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-3 text-black/50">
                  Select Your Pack
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {packOptions.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPack(p)}
                      className={`p-4 border font-body font-semibold text-sm text-left flex items-center justify-between transition-colors duration-150 ${
                        pack === p
                          ? 'bg-site-black text-white border-site-black'
                          : 'bg-white text-site-black border-black/15 hover:border-site-black'
                      }`}
                    >
                      {p}
                      {pack === p && <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-3 text-black/50">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(vehicleLabels) as [VehicleType, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setVehicle(key)}
                      className={`p-4 border font-body font-semibold text-xs text-center transition-colors duration-150 ${
                        vehicle === key
                          ? 'bg-site-black text-white border-site-black'
                          : 'bg-white text-site-black border-black/15 hover:border-site-black'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-site-light p-6 flex items-center justify-between">
                <div>
                  <p className="font-body text-[10px] text-black/40 tracking-[0.15em] uppercase">Estimated Price</p>
                  <p className="font-display text-5xl mt-1">£{price}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-xs font-semibold text-black/50">{pack}</p>
                  <p className="font-body text-xs text-black/40">{vehicleLabels[vehicle]}</p>
                  <p className="font-body text-[10px] text-black/30 mt-1">Mobile — we come to you</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-orange text-white py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase flex items-center justify-between px-6 hover:bg-orange-dark transition-colors"
              >
                NEXT: SCHEDULE
                <span className="text-lg">→</span>
              </button>
            </div>
          )}

          {/* ─── STEP 2: Date, Time & Address ─── */}
          {step === 2 && (
            <form
              onSubmit={(e) => { e.preventDefault(); setStep(3) }}
              className="space-y-8"
            >
              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-3 text-black/50">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-black/15 px-5 py-4 font-body text-sm focus:outline-none focus:border-site-black"
                />
              </div>

              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-3 text-black/50">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`py-3 border font-body font-semibold text-xs tracking-wider transition-colors ${
                        time === t
                          ? 'bg-site-black text-white border-site-black'
                          : 'border-black/15 hover:border-site-black'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="font-body text-[10px] text-black/35 mt-3 tracking-wider">
                  We&apos;ll confirm your exact arrival window within 1 hour of booking.
                </p>
              </div>

              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-3 text-black/50">
                  Service Address *
                </label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your driveway, office or postcode"
                  className="w-full border border-black/15 px-5 py-4 font-body text-sm focus:outline-none focus:border-site-black"
                />
                <p className="font-body text-[10px] text-black/35 mt-2 tracking-wider">
                  We come to you — driveway, office, car park. Wherever works.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-site-black py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-site-light transition-colors"
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  disabled={!date || !time || !address.trim()}
                  className="flex-[2] bg-orange text-white py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase flex items-center justify-between px-6 hover:bg-orange-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  NEXT: YOUR DETAILS
                  <span className="text-lg">→</span>
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP 3: Contact Details ─── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-2 text-black/50">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full border border-black/15 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black"
                  />
                </div>
                <div>
                  <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-2 text-black/50">
                    Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900000"
                    className="w-full border border-black/15 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-2 text-black/50">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full border border-black/15 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black"
                />
              </div>

              <div>
                <label className="font-body font-semibold text-[10px] tracking-[0.18em] uppercase block mb-2 text-black/50">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Access instructions, add-ons, specific concerns..."
                  rows={3}
                  className="w-full border border-black/15 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-site-light p-5 text-xs font-body space-y-2 text-black/50">
                <div className="flex justify-between">
                  <span>Pack</span>
                  <span className="font-semibold text-site-black">{pack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle</span>
                  <span className="font-semibold text-site-black">{vehicleLabels[vehicle]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date &amp; Time</span>
                  <span className="font-semibold text-site-black">{date} at {time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="font-semibold text-site-black truncate ml-4 max-w-[180px]">{address}</span>
                </div>
                <div className="border-t border-black/10 pt-3 flex justify-between">
                  <span className="font-bold text-site-black text-sm">TOTAL</span>
                  <span className="font-display text-site-black text-xl">£{price}</span>
                </div>
              </div>

              {apiError && (
                <div className="bg-red-50 border border-red-200 px-5 py-4 font-body text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(2); setApiError('') }}
                  className="flex-1 border-2 border-site-black py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-site-light transition-colors"
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-orange text-white py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-orange-dark transition-colors disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      SENDING...
                    </>
                  ) : 'CONFIRM BOOKING'}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP 4: Confirmation ─── */}
          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-orange flex items-center justify-center mx-auto">
                <span className="text-white font-display text-5xl leading-none">✓</span>
              </div>
              <div>
                <h3 className="font-display text-4xl uppercase mb-3">
                  YOU&apos;RE BOOKED IN!
                </h3>
                {bookingId && (
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-black/30 mb-3">
                    Ref: {bookingId}
                  </p>
                )}
                <p className="font-body text-sm text-black/55 max-w-xs mx-auto leading-relaxed">
                  We&apos;ll confirm via text and email within the hour. Our detailer comes to you on{' '}
                  <strong>{date}</strong> at <strong>{time}</strong>.
                </p>
              </div>
              <div className="bg-site-light p-6 text-left space-y-2 text-sm font-body text-black/50">
                <div className="flex justify-between">
                  <span>Pack</span>
                  <span className="font-semibold text-site-black">{pack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="font-semibold text-site-black truncate ml-4 max-w-[200px]">{address}</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-3 mt-2">
                  <span className="font-bold text-site-black">Total</span>
                  <span className="font-display text-site-black text-xl">£{price}</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-site-black text-white py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-orange transition-colors"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

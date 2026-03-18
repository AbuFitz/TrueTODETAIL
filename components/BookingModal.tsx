'use client'

import { useState } from 'react'

type VehicleType = 'hatchback' | 'suv' | 'prestige'
type Step = 1 | 2 | 3 | 4

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialPack?: string
  initialVehicle?: VehicleType | ''
  initialPrice?: number
}

const packOptions = ['Essential', 'Deep Clean', 'Premium', 'Elite Ceramic']
const vehicleLabels: Record<VehicleType, string> = {
  hatchback: 'Hatchback / Saloon',
  suv: 'SUV / 4×4',
  prestige: 'Sports / Prestige',
}
const timeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']

const priceMap: Record<string, Record<VehicleType, number>> = {
  'Essential':     { hatchback: 89,  suv: 109, prestige: 149 },
  'Deep Clean':    { hatchback: 179, suv: 219, prestige: 279 },
  'Premium':       { hatchback: 299, suv: 369, prestige: 479 },
  'Elite Ceramic': { hatchback: 549, suv: 679, prestige: 849 },
}

const stepLabels = ['Pack', 'Schedule', 'Your Details'] as const

export default function BookingModal({
  isOpen,
  onClose,
  initialPack = '',
  initialVehicle = '',
  initialPrice = 0,
}: BookingModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [pack, setPack] = useState(initialPack)
  const [vehicle, setVehicle] = useState<VehicleType | ''>(initialVehicle as VehicleType | '')
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

  const price = pack && vehicle ? (priceMap[pack]?.[vehicle as VehicleType] ?? 0) : null

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
      setPack(initialPack)
      setVehicle(initialVehicle as VehicleType | '')
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
        className="absolute inset-0 bg-site-black/85 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 bg-white w-full md:max-w-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-site-black text-white px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/30 mb-1.5">
              Mobile Detailing — Booking Request
            </p>
            <h2 className="font-display font-black text-2xl uppercase leading-none">
              {step === 4 ? 'BOOKING CONFIRMED' : 'BOOK YOUR DETAIL'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 transition-colors text-white/50 hover:text-white text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex border-b border-black/8">
            {stepLabels.map((label, i) => {
              const isActive = step === i + 1
              const isDone = step > i + 1
              return (
                <div
                  key={label}
                  className={`flex-1 py-3 text-center font-mono font-semibold text-[9px] tracking-[0.18em] uppercase transition-colors ${
                    isActive
                      ? 'bg-orange text-white'
                      : isDone
                      ? 'bg-site-black/5 text-black/30'
                      : 'bg-site-light text-black/25'
                  }`}
                >
                  <span className={isDone ? 'line-through' : ''}>{i + 1}. {label}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="p-8">

          {/* ─── STEP 1: Pack & Vehicle ─── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3 text-black/40">
                  Select Your Pack
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {packOptions.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPack(p)}
                      className={`p-4 border font-body font-semibold text-sm text-left flex items-center justify-between transition-all duration-150 ${
                        pack === p
                          ? 'bg-site-black text-white border-site-black'
                          : 'bg-white text-site-black border-black/12 hover:border-site-black'
                      }`}
                    >
                      {p}
                      {pack === p && <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3 text-black/40">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(vehicleLabels) as [VehicleType, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setVehicle(key)}
                      className={`p-4 border font-body font-semibold text-xs text-center transition-all duration-150 ${
                        vehicle === key
                          ? 'bg-site-black text-white border-site-black'
                          : 'bg-white text-site-black border-black/12 hover:border-site-black'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price preview */}
              <div className="bg-site-light p-6 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] text-black/35 tracking-[0.18em] uppercase mb-2">Estimated Price</p>
                  {price !== null
                    ? <p className="font-display font-black text-5xl leading-none">&pound;{price}</p>
                    : <p className="font-display font-black text-4xl leading-none text-black/20">—</p>
                  }
                </div>
                <div className="text-right">
                  <p className="font-body text-xs font-semibold text-black/50">{pack || 'No pack selected'}</p>
                  <p className="font-body text-xs text-black/35 mt-1">{vehicle ? vehicleLabels[vehicle as VehicleType] : 'No vehicle selected'}</p>
                  <p className="font-mono text-[9px] text-black/25 mt-2 tracking-wider">Mobile — we come to you</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!pack || !vehicle}
                className="btn-sweep w-full bg-orange text-white py-5 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase flex items-center justify-between px-6 hover:bg-[#C53D08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                NEXT: SCHEDULE
                <span>&rarr;</span>
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
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3 text-black/40">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-black/12 px-5 py-4 font-body text-sm focus:outline-none focus:border-site-black transition-colors bg-white"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3 text-black/40">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`py-3.5 border font-mono font-semibold text-[10px] tracking-wider transition-all duration-150 ${
                        time === t
                          ? 'bg-site-black text-white border-site-black'
                          : 'border-black/12 text-black/55 hover:border-site-black hover:text-site-black'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="font-mono text-[9px] text-black/30 mt-3 tracking-wider">
                  We&apos;ll confirm your exact arrival window within 1 hour of booking.
                </p>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3 text-black/40">
                  Service Address *
                </label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your driveway, office or postcode"
                  className="w-full border border-black/12 px-5 py-4 font-body text-sm focus:outline-none focus:border-site-black transition-colors bg-white placeholder:text-black/25"
                />
                <p className="font-mono text-[9px] text-black/30 mt-2 tracking-wider">
                  We come to you — driveway, office, car park. Wherever works.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-site-black py-5 font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase hover:bg-site-light transition-colors"
                >
                  &larr; BACK
                </button>
                <button
                  type="submit"
                  disabled={!date || !time || !address.trim()}
                  className="btn-sweep flex-[2] bg-orange text-white py-5 font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase flex items-center justify-between px-6 hover:bg-[#C53D08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  NEXT: YOUR DETAILS
                  <span>&rarr;</span>
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP 3: Contact Details ─── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-2 text-black/40">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full border border-black/12 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black transition-colors bg-white placeholder:text-black/25"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-2 text-black/40">
                    Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07984 237149"
                    className="w-full border border-black/12 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black transition-colors bg-white placeholder:text-black/25"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-2 text-black/40">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full border border-black/12 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black transition-colors bg-white placeholder:text-black/25"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-2 text-black/40">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Access instructions, add-ons, specific concerns..."
                  rows={3}
                  className="w-full border border-black/12 px-4 py-4 font-body text-sm focus:outline-none focus:border-site-black transition-colors resize-none bg-white placeholder:text-black/25"
                />
              </div>

              {/* Summary */}
              <div className="bg-site-light p-5 text-xs font-body space-y-2.5 text-black/45">
                {[
                  ['Pack', pack],
                  ['Vehicle', vehicle ? vehicleLabels[vehicle as VehicleType] : '—'],
                  ['Date & Time', `${date} at ${time}`],
                  ['Address', address],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between gap-4">
                    <span>{key}</span>
                    <span className="font-semibold text-site-black text-right truncate max-w-[180px]">{val}</span>
                  </div>
                ))}
                <div className="border-t border-black/8 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-site-black text-sm tracking-wider uppercase">Total</span>
                  <span className="font-display font-black text-site-black text-2xl leading-none">
                    {price !== null ? `£${price}` : '—'}
                  </span>
                </div>
              </div>

              {apiError && (
                <div className="border-l-2 border-red-500 bg-red-50 px-5 py-4 font-body text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(2); setApiError('') }}
                  className="flex-1 border border-site-black py-5 font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase hover:bg-site-light transition-colors"
                >
                  &larr; BACK
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-sweep flex-[2] bg-orange text-white py-5 font-mono font-semibold text-[10.5px] tracking-[0.16em] uppercase flex items-center justify-center gap-3 hover:bg-[#C53D08] transition-colors disabled:opacity-70"
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
                <span className="text-white font-display font-black text-5xl leading-none">✓</span>
              </div>
              <div>
                <h3 className="font-display font-black text-4xl uppercase mb-3 leading-none">
                  YOU&apos;RE BOOKED IN!
                </h3>
                {bookingId && (
                  <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-black/25 mb-4">
                    Ref: {bookingId}
                  </p>
                )}
                <p className="font-body text-sm text-black/50 max-w-xs mx-auto leading-relaxed">
                  We&apos;ll confirm via text and email within the hour. Our detailer comes to you on{' '}
                  <strong className="text-site-black">{date}</strong> at <strong className="text-site-black">{time}</strong>.
                </p>
              </div>
              <div className="bg-site-light p-6 text-left space-y-2.5 text-sm font-body text-black/45">
                <div className="flex justify-between">
                  <span>Pack</span>
                  <span className="font-semibold text-site-black">{pack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="font-semibold text-site-black truncate ml-4 max-w-[200px]">{address}</span>
                </div>
                <div className="flex justify-between border-t border-black/8 pt-3 mt-2 items-baseline">
                  <span className="font-bold text-site-black tracking-wider uppercase text-xs">Total</span>
                  <span className="font-display font-black text-site-black text-2xl leading-none">&pound;{price}</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="btn-sweep w-full bg-site-black text-white py-5 font-mono font-semibold text-[11px] tracking-[0.16em] uppercase hover:bg-orange transition-colors"
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

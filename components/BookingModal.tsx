'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PACKAGES, ADDONS, VEHICLE_LABELS as vehicleLabels, TIME_SLOTS as timeSlots, type VehicleType } from '@/lib/pricing'

type Step = 1 | 2 | 3 | 4

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialPack?: string
  initialVehicle?: VehicleType | ''
}

// Mirror the server-side checks in app/api/booking/route.ts exactly, so every
// field that can fail server validation is caught immediately in the UI
// instead of surfacing only after the customer finishes the whole form.
const POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE    = /^[\d\s\+\-\(\)]{7,20}$/
const CAR_REG_RE  = /^[A-Z0-9]{2,8}$/

const packOptions = PACKAGES
const priceMap: Record<string, Record<VehicleType, number>> = Object.fromEntries(PACKAGES.map(p => [p.id, p.price]))

const STEP_LABELS = ['Select Pack', 'Schedule', 'Your Details']

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'rgba(12,12,12,0.38)', marginBottom: '10px',
}

const textInput: React.CSSProperties = {
  width: '100%', padding: '14px 16px',
  border: '1px solid rgba(12,12,12,0.12)',
  // 16px avoids iOS Safari zooming the page in when a field is focused.
  fontFamily: 'var(--font-body)', fontSize: '16px', color: '#0C0C0C',
  outline: 'none', background: 'white', boxSizing: 'border-box' as const,
}

export default function BookingModal({
  isOpen,
  onClose,
  initialPack    = '',
  initialVehicle = '',
}: BookingModalProps) {
  const [step,           setStep]           = useState<Step>(1)
  const [pack,           setPack]           = useState(initialPack)
  const [vehicle,        setVehicle]        = useState<VehicleType | ''>(initialVehicle as VehicleType | '')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [date,           setDate]           = useState('')
  const [time,           setTime]           = useState('')
  const [address,        setAddress]        = useState('')
  const [postcodeTouched, setPostcodeTouched] = useState(false)
  const [carReg,         setCarReg]         = useState('')
  const [carRegTouched,  setCarRegTouched]  = useState(false)
  const [name,           setName]           = useState('')
  const [phone,          setPhone]          = useState('')
  const [phoneTouched,   setPhoneTouched]   = useState(false)
  const [email,          setEmail]          = useState('')
  const [emailTouched,   setEmailTouched]   = useState(false)
  const [notes,          setNotes]          = useState('')
  const [submitting,     setSubmitting]     = useState(false)
  const [apiError,       setApiError]       = useState('')
  const [bookingId,      setBookingId]      = useState('')

  const postcodeValid = POSTCODE_RE.test(address.trim())
  // Server strips whitespace before checking format (registrations are often
  // typed with a gap, e.g. "AB12 CDE") — mirror that here before validating.
  const carRegValid   = CAR_REG_RE.test(carReg.trim().replace(/\s+/g, ''))
  const phoneValid    = PHONE_RE.test(phone.trim())
  const emailValid    = EMAIL_RE.test(email.trim())

  const basePrice   = pack && vehicle ? (priceMap[pack]?.[vehicle as VehicleType] ?? 0) : null
  const addonTotal  = ADDONS.filter(a => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0)
  const totalPrice  = basePrice !== null ? basePrice + addonTotal : null

  // Price is always shown on Step 1, even before pack/vehicle are picked — as
  // a range that narrows down to an exact total once both are selected.
  const allPrices  = Object.values(priceMap).flatMap(v => Object.values(v))
  const overallMin = Math.min(...allPrices)
  const overallMax = Math.max(...allPrices)
  const packPrices = pack ? Object.values(priceMap[pack]) : []
  const packMin    = packPrices.length ? Math.min(...packPrices) : null
  const packMax    = packPrices.length ? Math.max(...packPrices) : null

  const toggleAddon = (id: string) =>
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneTouched(true); setEmailTouched(true)
    if (!phoneValid || !emailValid) return
    setSubmitting(true)
    setApiError('')
    try {
      const res  = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pack, vehicle,
          date, time, address, carReg,
          name, phone, email, notes,
          addons: selectedAddons,   // send IDs — API maps to labels for email
        }),
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
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1); setPack(initialPack); setVehicle(initialVehicle as VehicleType | '')
      setSelectedAddons([]); setCarReg('')
      setName(''); setPhone(''); setEmail(''); setAddress(''); setNotes('')
      setDate(''); setTime(''); setApiError(''); setBookingId('')
      setPostcodeTouched(false); setCarRegTouched(false); setPhoneTouched(false); setEmailTouched(false)
    }, 400)
  }

  if (!isOpen) return null

  return (
    <div data-testid="booking-modal" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(12,12,12,0.82)', backdropFilter: 'blur(3px)' }}
        onClick={handleClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '520px',
          height: '100dvh',
          background: '#ffffff',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >

        {/* ── Header ── */}
        <div style={{ background: '#0C0C0C', padding: '24px 32px 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)', marginBottom: '6px',
              }}>
                {step === 4 ? 'Booking Confirmed' : 'Mobile Detailing · Hertfordshire'}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '28px',
                letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1,
              }}>
                {step === 4 ? "YOU'RE BOOKED IN" : <>BOOK YOUR <span style={{ color: '#E84A0C' }}>DETAIL</span></>}
              </h2>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close"
              style={{
                width: 36, height: 36, background: 'rgba(255,255,255,0.07)',
                border: 'none', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)', fontSize: '16px', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            >
              ✕
            </button>
          </div>

          {step < 4 && (
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{
                    flex: 1, height: '2px',
                    background: s <= step ? '#E84A0C' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
                Step {step} of 3: {STEP_LABELS[step - 1]}
              </p>
            </div>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* ── STEP 1: Pack, Vehicle, Add-ons ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Pack selection */}
              <div>
                <p style={fieldLabel}>Select Your Pack</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {packOptions.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPack(p.id)}
                      style={{
                        width: '100%', padding: '16px 18px',
                        background: pack === p.id ? '#0C0C0C' : 'transparent',
                        border: `1px solid ${pack === p.id ? '#0C0C0C' : 'rgba(12,12,12,0.1)'}`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        textAlign: 'left', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (pack !== p.id) e.currentTarget.style.borderColor = 'rgba(12,12,12,0.3)' }}
                      onMouseLeave={e => { if (pack !== p.id) e.currentTarget.style.borderColor = 'rgba(12,12,12,0.1)' }}
                    >
                      <div>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: pack === p.id ? '#ffffff' : '#0C0C0C', display: 'block', marginBottom: '3px' }}>
                          {p.id}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: pack === p.id ? 'rgba(255,255,255,0.42)' : 'rgba(12,12,12,0.38)' }}>
                          {p.tagline} · {p.duration}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: vehicle ? '22px' : '15px', color: pack === p.id ? '#E84A0C' : 'rgba(12,12,12,0.35)', letterSpacing: '0.02em', flexShrink: 0, marginLeft: '12px', textAlign: 'right' }}>
                        {vehicle
                          ? `£${priceMap[p.id]?.[vehicle as VehicleType] ?? '—'}`
                          : `£${Math.min(...Object.values(priceMap[p.id]))}–£${Math.max(...Object.values(priceMap[p.id]))}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle type */}
              <div>
                <p style={fieldLabel}>Vehicle Type</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(Object.entries(vehicleLabels) as [VehicleType, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setVehicle(key)}
                      style={{
                        flex: 1, padding: '13px 8px',
                        background: vehicle === key ? '#0C0C0C' : 'transparent',
                        border: `1px solid ${vehicle === key ? '#0C0C0C' : 'rgba(12,12,12,0.12)'}`,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                        color: vehicle === key ? '#ffffff' : 'rgba(12,12,12,0.55)',
                        textAlign: 'center', letterSpacing: '0.02em', transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <p style={fieldLabel}>Add-Ons (optional)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ADDONS.map(addon => {
                    const selected = selectedAddons.includes(addon.id)
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        style={{
                          width: '100%', padding: '13px 16px',
                          background: selected ? 'rgba(232,74,12,0.06)' : 'transparent',
                          border: `1px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.1)'}`,
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          textAlign: 'left', transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Checkbox indicator */}
                          <span style={{
                            width: 16, height: 16, flexShrink: 0,
                            border: `1.5px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.2)'}`,
                            background: selected ? '#E84A0C' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}>
                            {selected && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <polyline points="1 3.5 3.5 6 8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: selected ? '#0C0C0C' : 'rgba(12,12,12,0.6)' }}>
                            {addon.label}
                          </span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: selected ? '#E84A0C' : 'rgba(12,12,12,0.3)', flexShrink: 0 }}>
                          +£{addon.price}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price preview — always visible: a range that narrows to an exact total */}
              <div style={{ background: '#0C0C0C', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                    {totalPrice !== null ? (addonTotal > 0 ? 'Total inc. add-ons' : 'Your Price') : pack ? `${pack} Price Range` : 'Price Range'}
                  </p>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '44px', color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1 }}>
                    {totalPrice !== null
                      ? `£${totalPrice}`
                      : pack
                        ? `£${packMin}–£${packMax}`
                        : `£${overallMin}–£${overallMax}`}
                  </span>
                  {totalPrice !== null && addonTotal > 0 && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                      Base £{basePrice} + add-ons £{addonTotal}
                    </p>
                  )}
                  {totalPrice === null && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                      {pack ? 'Depends on vehicle size' : 'Select a pack and vehicle for your exact price'}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>{pack || '—'}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{vehicle ? vehicleLabels[vehicle as VehicleType] : '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Date, Time, Address, Car Reg ── */}
          {step === 2 && (
            <form id="step2-form" onSubmit={e => { e.preventDefault(); setStep(3) }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={fieldLabel}>Preferred Date</label>
                <input
                  type="date" required
                  min={new Date().toISOString().split('T')[0]}
                  value={date} onChange={e => setDate(e.target.value)}
                  style={textInput}
                />
              </div>

              <div>
                <label style={fieldLabel}>Preferred Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {timeSlots.map(t => (
                    <button
                      key={t} type="button" onClick={() => setTime(t)}
                      style={{
                        padding: '13px 8px',
                        border: `1px solid ${time === t ? '#0C0C0C' : 'rgba(12,12,12,0.1)'}`,
                        background: time === t ? '#0C0C0C' : 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
                        color: time === t ? '#ffffff' : 'rgba(12,12,12,0.5)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(12,12,12,0.28)', marginTop: '10px' }}>
                  Exact arrival window confirmed within 1 hour of booking.
                </p>
              </div>

              <div>
                <label style={fieldLabel}>Service Postcode</label>
                <input
                  required type="text" value={address}
                  onChange={e => setAddress(e.target.value.toUpperCase())}
                  onBlur={() => setPostcodeTouched(true)}
                  placeholder="Enter your postcode"
                  maxLength={8}
                  style={{
                    ...textInput, textTransform: 'uppercase', letterSpacing: '0.12em',
                    border: `1px solid ${postcodeTouched && address.trim() && !postcodeValid ? '#dc2626' : 'rgba(12,12,12,0.12)'}`,
                  }}
                />
                {postcodeTouched && address.trim() && !postcodeValid ? (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#dc2626', marginTop: '8px' }}>
                    That doesn&apos;t look like a valid UK postcode — double-check it.
                  </p>
                ) : (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(12,12,12,0.28)', marginTop: '8px' }}>
                    We use this to confirm we cover your area.
                  </p>
                )}
              </div>

              <div>
                <label style={fieldLabel}>Vehicle Registration</label>
                <input
                  required type="text" value={carReg}
                  onChange={e => setCarReg(e.target.value.toUpperCase())}
                  onBlur={() => setCarRegTouched(true)}
                  placeholder="e.g. AB12 CDE"
                  maxLength={8}
                  style={{
                    ...textInput, textTransform: 'uppercase', letterSpacing: '0.1em',
                    border: `1px solid ${carRegTouched && carReg.trim() && !carRegValid ? '#dc2626' : 'rgba(12,12,12,0.12)'}`,
                  }}
                />
                {carRegTouched && carReg.trim() && !carRegValid ? (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#dc2626', marginTop: '8px' }}>
                    That doesn&apos;t look like a valid registration — letters and numbers only.
                  </p>
                ) : (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(12,12,12,0.28)', marginTop: '8px' }}>
                    Helps us confirm vehicle details before we arrive.
                  </p>
                )}
              </div>
            </form>
          )}

          {/* ── STEP 3: Contact + Summary ── */}
          {step === 3 && (
            <form id="step3-form" noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={fieldLabel}>Full Name (optional)</label>
                  <input
                    type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Smith"
                    style={textInput}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Phone</label>
                  <input
                    required type="tel" value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onBlur={() => setPhoneTouched(true)}
                    placeholder="07700 900000"
                    style={{ ...textInput, border: `1px solid ${phoneTouched && !phoneValid ? '#dc2626' : 'rgba(12,12,12,0.12)'}` }}
                  />
                  {phoneTouched && !phoneValid && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#dc2626', marginTop: '6px' }}>
                      Please enter a valid phone number.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label style={fieldLabel}>Email</label>
                <input
                  required type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="john@example.com"
                  style={{ ...textInput, border: `1px solid ${emailTouched && !emailValid ? '#dc2626' : 'rgba(12,12,12,0.12)'}` }}
                />
                {emailTouched && !emailValid && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#dc2626', marginTop: '6px' }}>
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <label style={fieldLabel}>Notes (optional)</label>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Access notes, specific concerns..."
                  rows={3}
                  maxLength={1000}
                  style={{ ...textInput, resize: 'none' }}
                />
                {notes.length > 800 && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: notes.length >= 1000 ? '#dc2626' : 'rgba(12,12,12,0.28)', marginTop: '6px' }}>
                    {notes.length}/1000
                  </p>
                )}
              </div>

              {/* Summary */}
              <div style={{ background: '#F5F4F1', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {([
                    ['Pack',       pack],
                    ['Vehicle',    vehicle ? vehicleLabels[vehicle as VehicleType] : '—'],
                    ['Reg',        carReg || '—'],
                    ['Date & Time', date && time ? `${date} · ${time}` : '—'],
                    ['Postcode',   address || '—'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.4)', flexShrink: 0 }}>{k}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0C0C0C', textAlign: 'right', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                    </div>
                  ))}
                  {selectedAddons.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.4)', flexShrink: 0 }}>Add-ons</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0C0C0C', textAlign: 'right', maxWidth: '220px' }}>
                        {ADDONS.filter(a => selectedAddons.includes(a.id)).map(a => a.label).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', marginTop: '14px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0C0C0C' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#0C0C0C' }}>
                    {totalPrice !== null ? `£${totalPrice}` : '—'}
                  </span>
                </div>
              </div>

              {apiError && (
                <div style={{ borderLeft: '2px solid #ef4444', background: '#fef2f2', padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626' }}>
                  {apiError}
                </div>
              )}
            </form>
          )}

          {/* ── STEP 4: Confirmation ── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <div style={{ width: 72, height: 72, background: '#E84A0C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '0.03em', color: '#0C0C0C', lineHeight: 1, marginBottom: '12px' }}>
                CONFIRMED
              </h3>
              {bookingId && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.28)', marginBottom: '16px' }}>
                  Ref: {bookingId}
                </p>
              )}
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.72, color: 'rgba(12,12,12,0.5)', maxWidth: '340px', margin: '0 auto 28px' }}>
                We&apos;ll confirm by text and email within the hour. Your detailer arrives on{' '}
                <strong style={{ color: '#0C0C0C' }}>{date}</strong> at{' '}
                <strong style={{ color: '#0C0C0C' }}>{time}</strong>.
              </p>

              <div style={{ background: '#F5F4F1', padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
                {[
                  ['Pack',     pack],
                  ['Reg',      carReg],
                  ['Postcode', address],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(12,12,12,0.4)' }}>{k}</span>
                    <span style={{ fontWeight: 600, color: '#0C0C0C', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                  </div>
                ))}
                {selectedAddons.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(12,12,12,0.4)' }}>Add-ons</span>
                    <span style={{ fontWeight: 600, color: '#0C0C0C', maxWidth: '220px', textAlign: 'right' }}>
                      {ADDONS.filter(a => selectedAddons.includes(a.id)).map(a => a.label).join(', ')}
                    </span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', marginTop: '10px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>£{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                style={{
                  width: '100%', padding: '17px 24px',
                  background: '#0C0C0C', color: 'white', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E84A0C')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0C0C0C')}
              >
                Done
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
              </button>
            </div>
          )}
        </div>

        {/* ── Footer nav ── */}
        {step < 4 && (
          <div style={{ borderTop: '1px solid rgba(12,12,12,0.06)', padding: '16px 32px', flexShrink: 0, background: 'white', display: 'flex', gap: '10px' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => { setStep(s => (s - 1) as Step); setApiError('') }}
                style={{
                  padding: '15px 20px', border: '1px solid rgba(12,12,12,0.12)',
                  background: 'transparent', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.45)',
                  transition: 'border-color 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(12,12,12,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(12,12,12,0.12)'}
              >
                ← Back
              </button>
            )}

            {step === 1 && (
              <button
                type="button" onClick={() => setStep(2)} disabled={!pack || !vehicle}
                style={{ flex: 1, padding: '15px 24px', background: '#E84A0C', color: '#ffffff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: !pack || !vehicle ? 0.4 : 1, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (pack && vehicle) e.currentTarget.style.background = '#C53D08' }}
                onMouseLeave={e => { if (pack && vehicle) e.currentTarget.style.background = '#E84A0C' }}
              >
                Next: Schedule
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
              </button>
            )}

            {step === 2 && (
              <button
                type="submit" form="step2-form" disabled={!date || !time || !postcodeValid || !carRegValid}
                onClick={() => { setPostcodeTouched(true); setCarRegTouched(true) }}
                style={{ flex: 1, padding: '15px 24px', background: '#E84A0C', color: '#ffffff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: !date || !time || !postcodeValid || !carRegValid ? 0.4 : 1, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (date && time && postcodeValid && carRegValid) e.currentTarget.style.background = '#C53D08' }}
                onMouseLeave={e => { if (date && time && postcodeValid && carRegValid) e.currentTarget.style.background = '#E84A0C' }}
              >
                Next: Your Details
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
              </button>
            )}

            {step === 3 && (
              <button
                type="submit" form="step3-form" disabled={submitting}
                style={{ flex: 1, padding: '15px 24px', background: '#E84A0C', color: '#ffffff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: submitting ? 0.7 : 1, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#C53D08' }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#E84A0C' }}
              >
                {submitting ? (
                  <><span className="animate-spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />Sending...</>
                ) : 'Confirm Booking'}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

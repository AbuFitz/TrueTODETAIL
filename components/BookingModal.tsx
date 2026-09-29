'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PACKAGES, ADDONS, VEHICLE_LABELS as vehicleLabels, VEHICLE_GUIDE, VEHICLE_GUIDE_NOTE, TIME_SLOTS as timeSlots, type VehicleType } from '@/lib/pricing'
import { formatBookingDate, formatShortDate, isSlotAvailable, ukNow } from '@/lib/slots'
import { useDialogFocus } from '@/lib/useDialogFocus'

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

const STEP_LABELS = ['Vehicle & Pack', 'Schedule', 'Your Details']
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px',
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: 'rgba(12,12,12,0.38)', marginBottom: '10px',
}

const sectionHeading: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px',
  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
  color: '#E84A0C', marginBottom: '4px',
}

const textInput: React.CSSProperties = {
  width: '100%', padding: '14px 16px',
  border: '1px solid rgba(12,12,12,0.12)',
  // 16px avoids iOS Safari zooming the page in when a field is focused.
  fontFamily: 'var(--font-body)', fontSize: '16px', color: '#0C0C0C',
  outline: 'none', background: 'white', boxSizing: 'border-box' as const,
}

function CheckIcon({ size = 9, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 7" fill="none">
      <polyline points="1 3.5 3.5 6 8 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// A text input with a live valid/invalid visual state — a green check appears
// the moment the value is correct, a red border + message the moment it
// isn't, so the customer never has to guess whether something is wrong.
function ValidatedField({
  label, value, onChange, onBlur, placeholder, type = 'text', maxLength,
  touched, valid, errorText, helperText, uppercase, letterSpacing,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  placeholder: string
  type?: string
  maxLength?: number
  touched: boolean
  valid: boolean
  errorText: string
  helperText: string
  uppercase?: boolean
  letterSpacing?: string
}) {
  const showError = touched && value.trim() !== '' && !valid
  const showValid = touched && value.trim() !== '' && valid
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          required type={type} value={value}
          onChange={e => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            ...textInput,
            textTransform: uppercase ? 'uppercase' : 'none',
            letterSpacing: letterSpacing ?? textInput.letterSpacing,
            paddingRight: '42px',
            borderColor: showError ? '#dc2626' : showValid ? '#16a34a' : 'rgba(12,12,12,0.12)',
            transition: 'border-color 0.15s',
          }}
        />
        {showValid && (
          <span style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            width: 20, height: 20, borderRadius: '50%', background: '#16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckIcon size={10} />
          </span>
        )}
        {showError && (
          <span style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            width: 20, height: 20, borderRadius: '50%', background: '#dc2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '13px', fontWeight: 700, lineHeight: 1,
          }}>
            !
          </span>
        )}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: showError ? 600 : 400,
        color: showError ? '#dc2626' : 'rgba(12,12,12,0.28)', marginTop: '8px',
      }}>
        {showError ? errorText : helperText}
      </p>
    </div>
  )
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

  const panelRef = useRef<HTMLDivElement>(null)
  useDialogFocus(panelRef, isOpen)

  // Escape closes the popup, as with any dialog.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!isOpen) return null

  return (
    <div
      data-testid="booking-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(12,12,12,0.82)', backdropFilter: 'blur(3px)' }}
        onClick={handleClose}
      />

      <motion.div
        ref={panelRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.42, ease }}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)', marginBottom: '6px',
              }}>
                {step === 4 ? 'Booking Requested' : 'Mobile Detailing · Hertfordshire'}
              </p>
              <h2 id="booking-modal-title" style={{
                fontFamily: 'var(--font-display)', fontSize: '28px',
                letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1,
              }}>
                {step === 4 ? 'REQUEST SENT.' : <>BOOK YOUR <span style={{ color: '#E84A0C' }}>DETAIL</span></>}
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

          {/* Numbered stepper — clearer sense of progress than a plain bar */}
          {step < 4 && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {STEP_LABELS.map((label, i) => {
                const stepNum = (i + 1) as Step
                const isDone = stepNum < step
                const isActive = stepNum === step
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEP_LABELS.length - 1 ? 1 : undefined }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: isDone ? '#16a34a' : isActive ? '#E84A0C' : 'rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700,
                        color: isDone || isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
                        transition: 'background 0.3s',
                      }}>
                        {isDone ? <CheckIcon size={9} /> : stepNum}
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600,
                        letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center',
                        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap',
                      }}>
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div style={{
                        flex: 1, height: '2px', marginTop: '10px', marginLeft: '4px', marginRight: '4px',
                        background: isDone ? '#16a34a' : 'rgba(255,255,255,0.12)', transition: 'background 0.3s',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease }}
            >

          {/* ── STEP 1: Vehicle, Pack, Add-ons ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Vehicle type comes first — a quick, easy first decision that
                  immediately unlocks exact pack prices below instead of ranges. */}
              <div>
                <p style={sectionHeading}>Vehicle</p>
                <p style={fieldLabel}>What size is your vehicle?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(Object.entries(vehicleLabels) as [VehicleType, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVehicle(key)}
                      aria-pressed={vehicle === key}
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: vehicle === key ? '#0C0C0C' : 'transparent',
                        border: `1px solid ${vehicle === key ? '#0C0C0C' : 'rgba(12,12,12,0.12)'}`,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        display: 'flex', flexDirection: 'column', gap: '3px',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: vehicle === key ? '#ffffff' : '#0C0C0C', letterSpacing: '0.02em' }}>
                        {label} <span style={{ fontWeight: 400, color: vehicle === key ? 'rgba(255,255,255,0.7)' : 'rgba(12,12,12,0.6)' }}>· {VEHICLE_GUIDE[key].body}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: vehicle === key ? 'rgba(255,255,255,0.6)' : 'rgba(12,12,12,0.5)' }}>
                        e.g. {VEHICLE_GUIDE[key].examples}
                      </span>
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'rgba(12,12,12,0.5)', marginTop: '8px', lineHeight: 1.5 }}>{VEHICLE_GUIDE_NOTE}</p>
              </div>

              {/* Pack selection */}
              <div>
                <p style={sectionHeading}>Package</p>
                <p style={fieldLabel}>Choose your package</p>
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
                          ? `£${priceMap[p.id]?.[vehicle as VehicleType] ?? 0}`
                          : `£${Math.min(...Object.values(priceMap[p.id]))}–£${Math.max(...Object.values(priceMap[p.id]))}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <p style={sectionHeading}>Add-ons</p>
                <p style={fieldLabel}>Optional extras</p>
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
                          <span style={{
                            width: 16, height: 16, flexShrink: 0,
                            border: `1.5px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.2)'}`,
                            background: selected ? '#E84A0C' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}>
                            {selected && <CheckIcon size={9} />}
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
                      {pack ? 'Depends on vehicle size' : 'Select a vehicle and pack for your exact price'}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>{pack || 'No package yet'}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{vehicle ? vehicleLabels[vehicle as VehicleType] : 'No vehicle yet'}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Date, Time, Address, Car Reg ── */}
          {step === 2 && (
            <form id="step2-form" onSubmit={e => { e.preventDefault(); setStep(3) }} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              <div>
                <p style={sectionHeading}>Date &amp; Time</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
                  <div>
                    <label style={fieldLabel}>Preferred Date</label>
                    <input
                      type="date" required
                      min={ukNow().date}
                      value={date}
                      onChange={e => {
                        const d = e.target.value
                        setDate(d)
                        // Drop a picked slot that isn't possible on the new date.
                        if (time && !isSlotAvailable(d, time)) setTime('')
                      }}
                      style={textInput}
                    />
                  </div>

                  <div>
                    <label style={fieldLabel}>Preferred Time Slot</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {timeSlots.map(t => {
                        // Slots already passed today (or within the hour) can't be picked.
                        const unavailable = Boolean(date) && !isSlotAvailable(date, t)
                        return (
                        <button
                          key={t} type="button" onClick={() => setTime(t)}
                          disabled={unavailable}
                          aria-disabled={unavailable}
                          title={unavailable ? 'This time has passed today' : undefined}
                          style={{
                            padding: '13px 8px',
                            border: `1px solid ${time === t ? '#0C0C0C' : 'rgba(12,12,12,0.1)'}`,
                            background: time === t ? '#0C0C0C' : 'transparent',
                            cursor: unavailable ? 'not-allowed' : 'pointer',
                            opacity: unavailable ? 0.3 : 1,
                            textDecoration: unavailable ? 'line-through' : 'none',
                            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
                            color: time === t ? '#ffffff' : 'rgba(12,12,12,0.5)',
                            transition: 'all 0.15s',
                          }}
                        >
                          {t}
                        </button>
                        )
                      })}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(12,12,12,0.28)', marginTop: '10px' }}>
                      Exact arrival window confirmed as soon as possible.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', paddingTop: '24px' }}>
                <p style={sectionHeading}>Location &amp; Vehicle</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
                  <ValidatedField
                    label="Service Postcode"
                    value={address}
                    onChange={setAddress}
                    onBlur={() => setPostcodeTouched(true)}
                    placeholder="Enter your postcode"
                    maxLength={8}
                    touched={postcodeTouched}
                    valid={postcodeValid}
                    errorText="That doesn't look like a valid UK postcode. Please double-check it."
                    helperText="We use this to confirm we cover your area."
                    uppercase
                    letterSpacing="0.12em"
                  />

                  <ValidatedField
                    label="Vehicle Registration"
                    value={carReg}
                    onChange={setCarReg}
                    onBlur={() => setCarRegTouched(true)}
                    placeholder="e.g. AB12 CDE"
                    maxLength={8}
                    touched={carRegTouched}
                    valid={carRegValid}
                    errorText="That doesn't look like a valid registration. Letters and numbers only."
                    helperText="Helps us confirm vehicle details before we arrive."
                    uppercase
                    letterSpacing="0.1em"
                  />
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 3: Contact + Summary ── */}
          {step === 3 && (
            <form id="step3-form" noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={sectionHeading}>Your Details</p>
              </div>

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

                <ValidatedField
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder="07700 900000"
                  type="tel"
                  touched={phoneTouched}
                  valid={phoneValid}
                  errorText="Please enter a valid phone number."
                  helperText="We'll text to confirm your slot."
                />
              </div>

              <ValidatedField
                label="Email"
                value={email}
                onChange={setEmail}
                onBlur={() => setEmailTouched(true)}
                placeholder="john@example.com"
                type="email"
                touched={emailTouched}
                valid={emailValid}
                errorText="Please enter a valid email address."
                helperText="Your booking confirmation goes here."
              />

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
              <div style={{ background: '#F5F4F1', padding: '20px', borderTop: '3px solid #E84A0C' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.35)', marginBottom: '14px' }}>
                  Booking Summary
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {([
                    ['Pack',       pack],
                    ['Vehicle',    vehicle ? vehicleLabels[vehicle as VehicleType] : 'Not set'],
                    ['Reg',        carReg || 'Not set'],
                    ['Date & Time', date && time ? `${formatShortDate(date)} · ${time}` : 'Not set'],
                    ['Postcode',   address || 'Not set'],
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
                    {totalPrice !== null ? `£${totalPrice}` : '£0'}
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
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease }}
                style={{ width: 72, height: 72, background: '#E84A0C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', borderRadius: '50%' }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '0.03em', color: '#0C0C0C', lineHeight: 1, marginBottom: '12px' }}>
                THANK YOU
              </h3>
              {bookingId && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.28)', marginBottom: '16px' }}>
                  Ref: {bookingId}
                </p>
              )}
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.72, color: 'rgba(12,12,12,0.5)', maxWidth: '340px', margin: '0 auto 28px' }}>
                We&apos;ll be in touch by text and email as soon as possible to confirm your slot on{' '}
                <strong style={{ color: '#0C0C0C' }}>{formatBookingDate(date)}</strong> at{' '}
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

            </motion.div>
          </AnimatePresence>
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
                {!vehicle ? 'Select your vehicle size' : !pack ? 'Select a package' : 'Next: Schedule'}
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
                {!date ? 'Select a date' : !time ? 'Select a time' : !postcodeValid ? 'Enter your postcode' : !carRegValid ? 'Enter vehicle registration' : 'Next: Your Details'}
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

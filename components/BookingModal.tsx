'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PACKAGES, ADDONS, VEHICLE_LABELS as vehicleLabels, VEHICLE_GUIDE, VEHICLE_GUIDE_NOTE, TIME_SLOTS as timeSlots, type VehicleType } from '@/lib/pricing'
import { formatBookingDate, formatShortDate, isSlotAvailable, ukNow } from '@/lib/slots'
import { useDialogFocus } from '@/lib/useDialogFocus'

// One question per screen. 'done' is the confirmation after the request is sent.
type Question = 'size' | 'package' | 'extras' | 'when' | 'where' | 'details' | 'review'
type Step = Question | 'done'

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

const QUESTIONS: { key: Question; title: string; hint: string }[] = [
  { key: 'size',    title: 'Car size',          hint: 'This sets the price.' },
  { key: 'package', title: 'Package',           hint: 'Pick the level of detail.' },
  { key: 'extras',  title: 'Extras',            hint: 'Optional. Add whatever helps.' },
  { key: 'when',    title: 'Date and time',     hint: 'Pick a day, then a time.' },
  { key: 'where',   title: 'Where and which car', hint: 'We come to you.' },
  { key: 'details', title: 'Your details',      hint: 'So we can confirm with you.' },
  { key: 'review',  title: 'Check and send',    hint: 'Last look before it goes.' },
]
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

/** Seven days starting weekOffset weeks after today (UK date), as YYYY-MM-DD. */
function weekDates(weekOffset: number): string[] {
  const start = new Date(`${ukNow().date}T00:00:00Z`)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + weekOffset * 7 + i)
    return d.toISOString().slice(0, 10)
  })
}

function monthLabel(days: string[]): string {
  const f = (d: string, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...o }).format(new Date(`${d}T00:00:00Z`))
  const a = f(days[0], { month: 'long', year: 'numeric' })
  const b = f(days[6], { month: 'long', year: 'numeric' })
  return a === b ? a : `${f(days[0], { month: 'short' })} to ${b}`
}

/** A tappable choice, the same shape for size, package and every other pick-one list. */
function Choice({ selected, onClick, role, children }: { selected: boolean; onClick: () => void; role?: 'radio'; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role ? selected : undefined}
      aria-pressed={role ? undefined : selected}
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer', minHeight: '56px',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px',
        background: selected ? 'rgba(232,74,12,0.07)' : '#ffffff',
        border: `1px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.12)'}`,
        boxShadow: selected ? '0 0 0 1px #E84A0C' : 'none',
      }}
    >
      <span aria-hidden style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.2)'}`,
        background: selected ? '#E84A0C' : '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{selected && <CheckIcon size={9} />}</span>
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
    </button>
  )
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
  const [step,           setStep]           = useState<Step>('size')
  const [pack,           setPack]           = useState(initialPack)
  const [vehicle,        setVehicle]        = useState<VehicleType | ''>(initialVehicle as VehicleType | '')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [weekOffset,     setWeekOffset]     = useState(0)
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

  const toggleAddon = (id: string) =>
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

  const at = step === 'done' ? QUESTIONS.length : QUESTIONS.findIndex(q => q.key === step)
  // No price until the package step, where the customer first sees what things cost.
  const priced = totalPrice !== null && at >= QUESTIONS.findIndex(q => q.key === 'package')

  const canContinue: Record<Question, boolean> = {
    size: Boolean(vehicle),
    package: Boolean(pack),
    extras: true,
    when: Boolean(date) && Boolean(time) && isSlotAvailable(date, time),
    where: postcodeValid && carRegValid,
    details: phoneValid && emailValid,
    review: true,
  }

  const send = async () => {
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
        return
      }
      setBookingId(json.booking?.id ?? '')
      setStep('done')
    } catch {
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    if (step === 'done') return
    if (step === 'where') { setPostcodeTouched(true); setCarRegTouched(true) }
    if (step === 'details') { setPhoneTouched(true); setEmailTouched(true) }
    if (!canContinue[step]) return
    if (step === 'review') { void send(); return }
    setApiError('')
    setStep(QUESTIONS[at + 1].key)
  }

  const back = () => {
    if (step === 'done' || at === 0) return
    setApiError('')
    setStep(QUESTIONS[at - 1].key)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('size'); setPack(initialPack); setVehicle(initialVehicle as VehicleType | '')
      setSelectedAddons([]); setCarReg('')
      setName(''); setPhone(''); setEmail(''); setAddress(''); setNotes('')
      setWeekOffset(0); setDate(''); setTime(''); setApiError(''); setBookingId('')
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

  const question = step === 'done' ? null : QUESTIONS[at]
  const days = weekDates(weekOffset)
  const addonText = ADDONS.filter(a => selectedAddons.includes(a.id)).map(a => a.label).join(', ')
  const buttonStyle: React.CSSProperties = {
    flex: 1, minHeight: '52px', padding: '0 24px', background: '#E84A0C', color: '#ffffff', border: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
    letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '10px', transition: 'background 0.2s',
  }

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
          background: '#0C0C0C',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', touchAction: 'manipulation',
        }}
      >

        {/* ── Header: the question, on black ── */}
        <div style={{ background: '#0C0C0C', padding: '18px 24px 18px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            }}>
              {step === 'done' ? 'Request sent' : `Step ${at + 1} of ${QUESTIONS.length}`}
            </p>
            <button
              onClick={handleClose}
              aria-label="Close"
              style={{
                width: 44, height: 44, margin: '-8px -8px -8px 0', background: 'transparent',
                border: 'none', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)', fontSize: '18px',
              }}
            >
              ✕
            </button>
          </div>

          {step !== 'done' && (
            <ol aria-label="Booking steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', listStyle: 'none', padding: 0, margin: '10px 0 14px' }}>
              {QUESTIONS.map((q, i) => (
                <li key={q.key} aria-current={i === at ? 'step' : undefined} style={{ height: 4, background: i <= at ? '#E84A0C' : 'rgba(255,255,255,0.18)' }} />
              ))}
            </ol>
          )}

          <h2 id="booking-modal-title" style={{
            fontFamily: 'var(--font-display)', fontSize: '34px',
            letterSpacing: '0.03em', color: '#ffffff', lineHeight: 1,
            marginTop: step === 'done' ? '8px' : 0,
          }}>
            {step === 'done' ? 'REQUEST SENT.' : <>{question!.title.toUpperCase()}<span style={{ color: '#E84A0C' }}>.</span></>}
          </h2>
          {question && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '6px' }}>
              {question.hint}
            </p>
          )}
        </div>

        {/* ── The answer, on a white sheet ── */}
        <form
          id="booking-step-form"
          noValidate
          onSubmit={e => { e.preventDefault(); next() }}
          style={{ flex: 1, minHeight: 0, background: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, display: 'flex', flexDirection: 'column' }}
        >
          <div data-testid="booking-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '22px 24px 12px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease }}
              >

                {step === 'size' && (
                  <div>
                    <div role="radiogroup" aria-label="Vehicle size" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(Object.entries(vehicleLabels) as [VehicleType, string][]).map(([key, label]) => (
                        <Choice key={key} role="radio" selected={vehicle === key} onClick={() => setVehicle(key)}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: '#0C0C0C' }}>{label}</span>
                          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.35, color: 'rgba(12,12,12,0.75)' }}>{VEHICLE_GUIDE[key].body}</span>
                          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '11.5px', lineHeight: 1.35, color: 'rgba(12,12,12,0.5)' }}>{VEHICLE_GUIDE[key].examples}</span>
                        </Choice>
                      ))}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'rgba(12,12,12,0.5)', marginTop: '10px', lineHeight: 1.45 }}>
                      {VEHICLE_GUIDE_NOTE}
                    </p>
                  </div>
                )}

                {step === 'package' && (
                  <div role="radiogroup" aria-label="Package" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {packOptions.map(p => (
                      <Choice key={p.id} role="radio" selected={pack === p.id} onClick={() => setPack(p.id)}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: '#0C0C0C' }}>{p.id}</span>
                            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'rgba(12,12,12,0.55)' }}>{p.tagline} · {p.duration}</span>
                          </span>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', lineHeight: 1, color: '#0C0C0C', flexShrink: 0 }}>
                            £{priceMap[p.id]?.[vehicle as VehicleType] ?? 0}
                          </span>
                        </span>
                      </Choice>
                    ))}
                  </div>
                )}

                {step === 'extras' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ADDONS.map(addon => {
                      const selected = selectedAddons.includes(addon.id)
                      return (
                        <Choice key={addon.id} selected={selected} onClick={() => toggleAddon(addon.id)}>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: '#0C0C0C' }}>{addon.label}</span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'rgba(12,12,12,0.5)', flexShrink: 0 }}>+£{addon.price}</span>
                          </span>
                        </Choice>
                      )
                    })}
                  </div>
                )}

                {step === 'when' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.5)' }}>
                        {monthLabel(days)}
                      </p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {([['Earlier week', -1, '‹'], ['Later week', 1, '›']] as const).map(([label, d, glyph]) => (
                          <button
                            key={label} type="button" aria-label={label}
                            disabled={(d === -1 && weekOffset === 0) || (d === 1 && weekOffset >= 11)}
                            onClick={() => setWeekOffset(w => w + d)}
                            style={{ width: 44, height: 44, border: '1px solid rgba(12,12,12,0.12)', background: '#ffffff', cursor: 'pointer', fontSize: '20px', lineHeight: 1, opacity: (d === -1 && weekOffset === 0) || (d === 1 && weekOffset >= 11) ? 0.3 : 1 }}
                          >
                            {glyph}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div role="group" aria-label="Day" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px', marginTop: '10px' }}>
                      {days.map(d => {
                        const full = !timeSlots.some(t => isSlotAvailable(d, t))
                        const [wd, dayNum] = formatShortDate(d).split(' ')
                        const selected = date === d
                        return (
                          <button
                            key={d} type="button" disabled={full} aria-pressed={selected} aria-label={formatBookingDate(d)}
                            onClick={() => { setDate(d); if (time && !isSlotAvailable(d, time)) setTime('') }}
                            style={{
                              minHeight: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              border: `1px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.12)'}`,
                              background: selected ? '#E84A0C' : '#ffffff', color: selected ? '#ffffff' : '#0C0C0C',
                              cursor: full ? 'not-allowed' : 'pointer', opacity: full ? 0.3 : 1,
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>{wd}</span>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', lineHeight: 1 }}>{dayNum}</span>
                          </button>
                        )
                      })}
                    </div>

                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.5)', marginTop: '18px' }}>Time</p>
                    <div role="group" aria-label="Time" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
                      {timeSlots.map(t => {
                        // Slots already passed today (or within the hour) can't be picked.
                        const unavailable = !date || !isSlotAvailable(date, t)
                        const selected = time === t
                        return (
                          <button
                            key={t} type="button" onClick={() => setTime(t)}
                            disabled={unavailable} aria-pressed={selected}
                            title={unavailable && date ? 'This time has passed today' : undefined}
                            style={{
                              minHeight: '48px',
                              border: `1px solid ${selected ? '#E84A0C' : 'rgba(12,12,12,0.12)'}`,
                              background: selected ? '#E84A0C' : '#ffffff', color: selected ? '#ffffff' : '#0C0C0C',
                              cursor: unavailable ? 'not-allowed' : 'pointer', opacity: unavailable ? 0.3 : 1,
                              textDecoration: unavailable && date ? 'line-through' : 'none',
                              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px',
                            }}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'rgba(12,12,12,0.5)', marginTop: '10px' }}>
                      {date ? 'Exact arrival window confirmed as soon as possible.' : 'Pick a day to see the times.'}
                    </p>
                  </div>
                )}

                {step === 'where' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                )}

                {step === 'details' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={fieldLabel}>Full Name (optional)</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" autoComplete="name" style={textInput} />
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
                  </div>
                )}

                {step === 'review' && (
                  <div>
                    <div style={{ background: '#F5F4F1', borderTop: '3px solid #E84A0C', padding: '16px 18px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {([
                          ['Pack',        pack],
                          ['Vehicle',     vehicle ? vehicleLabels[vehicle as VehicleType] : 'Not set'],
                          ['Reg',         carReg || 'Not set'],
                          ['Date & Time', date && time ? `${formatShortDate(date)} · ${time}` : 'Not set'],
                          ['Postcode',    address || 'Not set'],
                          ...(addonText ? [['Add-ons', addonText]] : []),
                        ] as [string, string][]).map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.45)', flexShrink: 0 }}>{k}</span>
                            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#0C0C0C', textAlign: 'right' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px' }}>£{totalPrice ?? 0}</span>
                      </div>
                    </div>
                    <label style={{ ...fieldLabel, marginTop: '14px', marginBottom: '8px' }}>Anything we should know? (optional)</label>
                    <textarea
                      value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Access notes, specific concerns..."
                      rows={2} maxLength={1000}
                      style={{ ...textInput, resize: 'none' }}
                    />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', lineHeight: 1.5, color: 'rgba(12,12,12,0.5)', marginTop: '8px' }}>
                      This sends us a request. It is not a booking until we confirm it with you. Payment is on the day.
                    </p>
                    {apiError && (
                      <div role="alert" style={{ borderLeft: '2px solid #ef4444', background: '#fef2f2', padding: '12px 14px', marginTop: '10px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626' }}>
                        {apiError}
                      </div>
                    )}
                  </div>
                )}

                {step === 'done' && (
                  <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease }}
                      style={{ width: 64, height: 64, background: '#E84A0C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', borderRadius: '50%' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '0.03em', color: '#0C0C0C', lineHeight: 1, marginBottom: '10px' }}>
                      THANK YOU
                    </h3>
                    {bookingId && (
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.4)', marginBottom: '14px' }}>
                        Ref: {bookingId}
                      </p>
                    )}
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.65, color: 'rgba(12,12,12,0.6)', maxWidth: '340px', margin: '0 auto 20px' }}>
                      We&apos;ll be in touch by text and email as soon as possible to confirm your slot on{' '}
                      <strong style={{ color: '#0C0C0C' }}>{formatBookingDate(date)}</strong> at{' '}
                      <strong style={{ color: '#0C0C0C' }}>{time}</strong>.
                    </p>
                    <div style={{ background: '#F5F4F1', padding: '16px 18px', textAlign: 'left' }}>
                      {([['Pack', pack], ['Reg', carReg], ['Postcode', address], ...(addonText ? [['Add-ons', addonText]] : [])] as [string, string][]).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '6px' }}>
                          <span style={{ color: 'rgba(12,12,12,0.45)' }}>{k}</span>
                          <span style={{ fontWeight: 600, color: '#0C0C0C', textAlign: 'right' }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', marginTop: '8px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>£{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer: back and continue, always in the same place ── */}
          <div style={{ borderTop: '1px solid rgba(12,12,12,0.08)', padding: '12px 24px calc(12px + env(safe-area-inset-bottom))', flexShrink: 0, background: '#ffffff', display: 'flex', gap: '10px' }}>
            {step === 'done' ? (
              <button type="button" onClick={handleClose} style={{ ...buttonStyle, background: '#0C0C0C' }}>Done</button>
            ) : (
              <>
                {at > 0 && (
                  <button
                    type="button" onClick={back}
                    style={{
                      minHeight: '52px', padding: '0 20px', border: '1px solid rgba(12,12,12,0.15)', background: 'transparent', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(12,12,12,0.6)', flexShrink: 0,
                    }}
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canContinue[step] || submitting}
                  style={{ ...buttonStyle, opacity: !canContinue[step] || submitting ? 0.4 : 1 }}
                >
                  {submitting ? (
                    <><span className="animate-spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />Sending...</>
                  ) : step === 'review' ? 'Send request' : priced ? `Continue · £${totalPrice}` : 'Continue'}
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

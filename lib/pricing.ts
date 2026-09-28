// Single source of truth for services, packages, pricing and add-ons.
// Imported by the booking API (server-side price computation), the booking
// modal (client-side price preview) and the chat assistant's business
// knowledge layer, so a price or policy change here updates all three.

export type VehicleType = 'small' | 'midsize' | 'largesuv'

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  small: 'Small Car',
  midsize: 'Mid-Size',
  largesuv: 'Large SUV / 4×4',
}

export interface PackageDef {
  id: string
  tagline: string
  duration: string
  description: string
  includes: string[]
  price: Record<VehicleType, number>
}

export const PACKAGES: PackageDef[] = [
  {
    id: 'Essential',
    tagline: 'Quick refresh',
    duration: '2–3 hrs',
    description: 'A quick refresh or regular upkeep between bigger details.',
    includes: ['Safe wash & dry', 'Wheels cleaned', 'Interior vacuum', 'Dashboard wipe', 'Glass cleaned', 'Tyre dressing'],
    price: { small: 80, midsize: 90, largesuv: 105 },
  },
  {
    id: 'Full Valet',
    tagline: 'Our most popular service',
    duration: '4–5 hrs',
    description: 'The best all-round choice for most customers.',
    includes: ['Everything in Essential', 'Deep interior clean', 'Seat shampoo', 'Carpet extraction', 'Door shuts cleaned', 'Spray wax protection'],
    price: { small: 140, midsize: 155, largesuv: 175 },
  },
  {
    id: 'Premium Detail',
    tagline: 'Best for resale / transformation',
    duration: '6–7 hrs',
    description: 'Best for a car that needs real correction work, or before a sale/valuation.',
    includes: ['Everything in Full Valet', 'Clay bar decontamination', 'Light machine polish', 'Paint sealant', 'Trim restoration', 'Odour treatment'],
    price: { small: 220, midsize: 240, largesuv: 270 },
  },
]

export interface AddonDef {
  id: string
  label: string
  price: number
}

export const ADDONS: AddonDef[] = [
  { id: 'engine-bay',   label: 'Engine Bay Clean',            price: 40 },
  { id: 'pet-hair',     label: 'Pet Hair Removal',            price: 25 },
  { id: 'odour',        label: 'Odour Treatment',             price: 30 },
  { id: 'seat-shampoo', label: 'Seat Shampoo (Extra Heavy)',  price: 30 },
  { id: 'steam',        label: 'Interior Steam Sanitisation', price: 35 },
]

export const TIME_SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']

export function getPackage(id: string): PackageDef | undefined {
  return PACKAGES.find(p => p.id.toLowerCase() === id.toLowerCase())
}

export function getAddon(id: string): AddonDef | undefined {
  return ADDONS.find(a => a.id === id || a.label.toLowerCase() === id.toLowerCase())
}

export function calculatePrice(packageId: string, vehicle: VehicleType, addonIds: string[] = []): { basePrice: number; addonTotal: number; total: number; breakdown: string[] } | null {
  const pkg = getPackage(packageId)
  if (!pkg) return null
  const basePrice = pkg.price[vehicle]
  const breakdown: string[] = []
  let addonTotal = 0
  for (const id of addonIds) {
    const addon = getAddon(id)
    if (addon) {
      addonTotal += addon.price
      breakdown.push(`${addon.label} +£${addon.price}`)
    }
  }
  return { basePrice, addonTotal, total: basePrice + addonTotal, breakdown }
}

// Bespoke services that aren't fixed-price packages — always quoted, never
// calculated. Keeping this explicit stops the chat assistant (or anyone
// else) from inventing a number for these.
export const BESPOKE_SERVICES = [
  'Ceramic coating',
  'Full multi-stage paint correction',
]

export const BUSINESS_INFO = {
  name: 'True To Detail',
  baseLocation: 'Hemel Hempstead, Hertfordshire',
  hours: 'Monday to Saturday, 8am to 7pm',
  phone: '07359 591800',
  phoneTel: '+447359591800',
  email: 'info@truetodetail.co.uk',
  whatsappUrl: 'https://wa.me/447359591800',
  coverageRadiusMiles: 25,
  bookingConfirmationWindow: 'as soon as possible, during working hours',
  depositRequired: false,
  paymentMethods: ['card', 'bank transfer', 'cash'],
  paymentTiming: 'on the day, on completion',
  cancellationPolicy:
    'Customers can cancel or reschedule any time; at least 24 hours notice is requested. Cancelling or no-showing with less than 24 hours notice may incur a fee of up to 50% of the agreed price.',
  satisfactionPromise: "If a customer isn't happy with the result, we come back and fix it.",
  fleetDiscount: '10%+ off for 3 or more vehicles booked as a fleet, more for larger fleets.',
  membershipStatus: 'A monthly membership/maintenance plan is coming soon and is not bookable yet.',
}

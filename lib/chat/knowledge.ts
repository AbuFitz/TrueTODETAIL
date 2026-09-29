// Central retrieval layer over the business's real data (pricing, coverage
// areas, policies). The chat assistant never hardcodes a price, postcode
// list or policy in its own prompt text — it reads from here, which reads
// from the same lib/pricing.ts and lib/areas.ts the rest of the site uses.

import { FAQS } from '@/lib/faq'
import { AREAS, type Area } from '@/lib/areas'
import { PACKAGES, ADDONS, BESPOKE_SERVICES, BUSINESS_INFO, VEHICLE_LABELS, TIME_SLOTS } from '@/lib/pricing'

export function findAreaByPostcode(postcodeRaw: string): Area | null {
  const district = postcodeRaw.trim().toUpperCase().match(/^[A-Z]{1,2}[0-9][0-9A-Z]?/)?.[0]
  if (!district) return null
  return AREAS.find(a => a.postcodes.includes(district)) ?? null
}

export function coverageSummaryText(): string {
  const towns = AREAS.map(a => a.name).join(', ')
  return `Based in ${BUSINESS_INFO.baseLocation}. Standard coverage is roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius. Towns regularly covered: ${towns}, plus villages/neighbourhoods around each. A town not on this list is very likely still covered if within about ${BUSINESS_INFO.coverageRadiusMiles} miles of ${BUSINESS_INFO.baseLocation}, confirm via WhatsApp/call. Full postcode lists live on /areas.`
}

export function pricingSummaryText(): string {
  const lines = PACKAGES.map(p =>
    `${p.id} (${p.duration}): £${p.price.small}/£${p.price.midsize}/£${p.price.largesuv} (Small Car: hatchbacks and coupes / Mid-Size: saloons and estates / Large SUV or 4x4: SUVs, 4x4s and people carriers). ${p.description} Includes: ${p.includes.join(', ')}.`
  )
  const addonLines = ADDONS.map(a => `${a.label} +£${a.price}`).join(', ')
  return [
    'Packages (price varies by vehicle size: Small Car / Mid-Size / Large SUV or 4x4):',
    ...lines,
    `Add-ons (any package): ${addonLines}.`,
    `Bespoke, quoted-only (never a fixed price, always requires a real quote): ${BESPOKE_SERVICES.join(', ')}.`,
  ].join('\n')
}

export function businessFactsText(): string {
  return [
    `Name: ${BUSINESS_INFO.name}. Fully mobile, comes to the customer, no drop-off.`,
    `Hours: ${BUSINESS_INFO.hours}. Bookings confirmed ${BUSINESS_INFO.bookingConfirmationWindow}.`,
    `Contact: ${BUSINESS_INFO.phone} (call/WhatsApp), ${BUSINESS_INFO.email}.`,
    `Payment: ${BUSINESS_INFO.paymentMethods.join(', ')}, ${BUSINESS_INFO.paymentTiming}. No deposit required.`,
    `Cancellation policy: ${BUSINESS_INFO.cancellationPolicy}`,
    `Satisfaction promise: ${BUSINESS_INFO.satisfactionPromise}`,
    `Fleet/commercial: ${BUSINESS_INFO.fleetDiscount} Point business enquiries to the Van & Fleet page/enquiry form for a manual quote.`,
    `Membership: ${BUSINESS_INFO.membershipStatus}`,
    `Available appointment slots (fixed daily times, not a live calendar): ${TIME_SLOTS.join(', ')}.`,
  ].join('\n')
}

export function faqText(): string {
  return FAQS.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n')
}

export function vehicleLabelList(): string {
  return Object.values(VEHICLE_LABELS).join(', ')
}

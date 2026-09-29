// Tool definitions + executors for the support chat assistant. Every action
// that touches real business data (price, coverage, availability) goes
// through one of these — the model is never allowed to compute or invent
// the result itself. Executors are pure functions; sending the actual
// human-escalation email is handled by the API route after it sees this
// tool was called, so this module has no side effects of its own.

import { PACKAGES, ADDONS, calculatePrice as computePrice, type VehicleType, TIME_SLOTS, BUSINESS_INFO } from '@/lib/pricing'
import { findAreaByPostcode } from '@/lib/chat/knowledge'

// Provider-agnostic tool definition (plain JSON Schema) — translated to
// whichever LLM provider's own tool/function format at call time, so this
// definition and executeTool() below don't depend on any specific SDK.
export interface ToolDef {
  name: string
  description: string
  input_schema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export const CHAT_TOOLS: ToolDef[] = [
  {
    name: 'check_coverage',
    description: "Check whether a UK postcode falls within True To Detail's service area. Always call this instead of guessing when a customer gives a postcode.",
    input_schema: {
      type: 'object',
      properties: {
        postcode: { type: 'string', description: 'The postcode or postcode district the customer gave, e.g. "HP2 6EL" or "HP2".' },
      },
      required: ['postcode'],
    },
  },
  {
    name: 'calculate_price',
    description: 'Get the exact fixed price for a package + vehicle size + optional add-ons. Always call this before quoting any figure, never compute or state a price from memory.',
    input_schema: {
      type: 'object',
      properties: {
        packageName: { type: 'string', description: 'Exact package name: "Essential", "Full Valet", or "Premium Detail".' },
        vehicle: { type: 'string', enum: ['small', 'midsize', 'largesuv'], description: 'Vehicle size category.' },
        addons: { type: 'array', items: { type: 'string' }, description: 'Add-on ids or labels, e.g. ["pet-hair", "engine-bay"].' },
      },
      required: ['packageName', 'vehicle'],
    },
  },
  {
    name: 'get_package_info',
    description: "Get full details (duration, what's included, description) for one package, or all packages if none is named.",
    input_schema: {
      type: 'object',
      properties: {
        packageName: { type: 'string', description: 'Exact package name, or omit for all packages.' },
      },
    },
  },
  {
    name: 'check_availability',
    description: 'Get the real fixed appointment time slots and confirmation policy. There is no live calendar, this returns the honest, fixed slot list and the confirmation window, never a fabricated "yes that slot is free".',
    // Gemini rejects object schemas with no properties, so give it one optional field.
    input_schema: { type: 'object', properties: { date: { type: 'string', description: 'Optional date the customer asked about.' } } },
  },
  {
    name: 'lookup_booking',
    description: 'Attempt to look up an existing booking. There is no chat-accessible booking database, so this always returns that lookups must go through phone/WhatsApp, call it so the assistant gives that honest answer rather than guessing.',
    input_schema: {
      type: 'object',
      properties: {
        reference: { type: 'string', description: 'Booking reference if the customer gave one.' },
      },
    },
  },
  {
    name: 'request_human_support',
    description:
      'Escalate to a real staff member. Call this when: the customer explicitly asks for a person; a complaint is sensitive or the customer is upset; the enquiry needs a bespoke/commercial quote (ceramic coating, paint correction, fleet); the request falls outside available services; you are not confident you can answer correctly; or the customer says your answer is wrong more than once.',
    input_schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Short reason for escalating, for the staff member reading it.' },
      },
      required: ['reason'],
    },
  },
  {
    name: 'prepare_booking_summary',
    description: "Call this once you have enough information (package, vehicle, postcode, and ideally a date/time preference) to summarise a ready-to-book enquiry. This does NOT create a real booking, it only prepares a summary and prompts the customer to confirm via the site's Book Now flow, which handles real submission.",
    input_schema: {
      type: 'object',
      properties: {
        packageName: { type: 'string' },
        vehicle: { type: 'string', enum: ['small', 'midsize', 'largesuv'] },
        addons: { type: 'array', items: { type: 'string' } },
        postcode: { type: 'string' },
        requestedDate: { type: 'string' },
        requestedTime: { type: 'string' },
      },
      required: ['packageName', 'vehicle'],
    },
  },
]

function isVehicleType(v: unknown): v is VehicleType {
  return v === 'small' || v === 'midsize' || v === 'largesuv'
}

export interface ToolExecutionResult {
  output: unknown
  action?: 'open_booking' | 'human_escalated'
  escalationReason?: string
}

export function executeTool(name: string, input: Record<string, unknown>): ToolExecutionResult {
  switch (name) {
    case 'check_coverage': {
      const postcode = String(input.postcode ?? '')
      const area = findAreaByPostcode(postcode)
      if (area) {
        return { output: { covered: true, area: area.name, driveTime: area.driveTime, page: `/areas/${area.slug}` } }
      }
      return {
        output: {
          covered: 'unknown',
          note: `That postcode district isn't in the known coverage list, but standard coverage is roughly a ${BUSINESS_INFO.coverageRadiusMiles}-mile radius from ${BUSINESS_INFO.baseLocation}. Suggest confirming via WhatsApp/call rather than asserting it's covered or not.`,
        },
      }
    }

    case 'calculate_price': {
      const packageName = String(input.packageName ?? '')
      const vehicle = isVehicleType(input.vehicle) ? input.vehicle : null
      if (!vehicle) return { output: { error: 'Invalid or missing vehicle size.' } }
      const addons = Array.isArray(input.addons) ? input.addons.map(String) : []
      const result = computePrice(packageName, vehicle, addons)
      if (!result) return { output: { error: `Unknown package "${packageName}". Valid packages: Essential, Full Valet, Premium Detail.` } }
      return { output: result }
    }

    case 'get_package_info': {
      const packageName = input.packageName ? String(input.packageName) : null
      if (packageName) {
        const pkg = PACKAGES.find(p => p.id.toLowerCase() === packageName.toLowerCase())
        if (!pkg) return { output: { error: `Unknown package "${packageName}".` } }
        return { output: pkg }
      }
      return { output: { packages: PACKAGES, addons: ADDONS } }
    }

    case 'check_availability': {
      return {
        output: {
          timeSlots: TIME_SLOTS,
          hours: BUSINESS_INFO.hours,
          confirmationPolicy: `No live calendar exists, a requested slot is a preference, confirmed ${BUSINESS_INFO.bookingConfirmationWindow}.`,
        },
      }
    }

    case 'lookup_booking': {
      return {
        output: {
          available: false,
          note: `No chat-accessible booking lookup exists. Direct the customer to call/WhatsApp ${BUSINESS_INFO.phone} with their reference (or name/postcode) for staff to check.`,
        },
      }
    }

    case 'request_human_support': {
      const reason = String(input.reason ?? 'Customer requested human assistance.')
      return { output: { escalated: true, reason }, action: 'human_escalated', escalationReason: reason }
    }

    case 'prepare_booking_summary': {
      const packageName = String(input.packageName ?? '')
      const vehicle = isVehicleType(input.vehicle) ? input.vehicle : null
      if (!vehicle) return { output: { error: 'Invalid or missing vehicle size.' } }
      const addons = Array.isArray(input.addons) ? input.addons.map(String) : []
      const priced = computePrice(packageName, vehicle, addons)
      return {
        output: {
          ready: Boolean(priced),
          packageName, vehicle, addons,
          postcode: input.postcode ?? null,
          requestedDate: input.requestedDate ?? null,
          requestedTime: input.requestedTime ?? null,
          price: priced,
          instruction: 'This is a summary only, not a confirmed booking. The customer must click Book Now to actually submit it.',
        },
        action: 'open_booking',
      }
    }

    default:
      return { output: { error: `Unknown tool: ${name}` } }
  }
}

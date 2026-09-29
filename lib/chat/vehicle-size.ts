// Turns what a customer says about their car into one of our three sizes.
// Owner rule: hatchbacks and coupes are small, saloons and estates are
// mid-size, SUVs, 4x4s and people carriers are large. UK body-type names only
// in anything we say; American words ("sedan", "wagon") are understood when a
// customer types them but never repeated back.

import { VEHICLE_GUIDE, VEHICLE_LABELS, type VehicleType } from '@/lib/pricing'

// Body type words always win over model names: "C Class coupe" is a coupe.
const BODY_PATTERNS: [VehicleType, RegExp][] = [
  ['largesuv', /\b(suv|4x4|4wd|awd|crossover|off[\s-]?road(er)?|pick[\s-]?up|people[\s-]?carrier|mpv|minivan|seven[\s-]?seat(er)?|7[\s-]?seat(er)?)\b|\b(large|big)[\s-]?(size[d]?\s*)?(car|vehicle)\b|^\s*(large|big)\s*[.!]?\s*$/i],
  ['midsize', /\b(mid[\s-]?size(d)?|medium[\s-]?(size[d]?|car|vehicle)|saloon|sedan|estate|wagon|touring|avant)\b|^\s*(mid|medium|middle)\s*[.!]?\s*$/i],
  ['small', /\b(small[\s-]?(size[d]?\s*)?(car|vehicle)|hatch(back)?|coupe|coupé|supermini|city car|compact)\b|^\s*small\s*[.!]?\s*$/i],
]

// Common UK models, used only when no body type word is given.
const MODEL_PATTERNS: [VehicleType, RegExp][] = [
  ['largesuv', /\b(range rover|land rover|defender|discovery|evoque|qashqai|juke|kuga|puma|ecosport|captur|sportage|tucson|tiguan|t[\s-]?roc|kodiaq|karoq|rav4|cr[\s-]?v|duster|mokka|x[1-7]|q[2-8]|glc|gle|galaxy|touran|sharan|alhambra|zafira|scenic|s[\s-]?max)\b/i],
  ['midsize', /\b(3[\s-]?series|5[\s-]?series|c[\s-]?class|e[\s-]?class|a4|a6|mondeo|octavia|superb|passat|insignia|accord|corolla|camry|mazda\s?6|i40|xf|xe|s60|v60|v70)\b/i],
  ['small', /\b(mini(?!\s*(valet|detail|clean|service))|fiesta|polo|corsa|golf|focus|clio|micra|yaris|fiat 500|aygo|c1|i10|i20|astra|a1|a3|1[\s-]?series|tt|mx[\s-]?5|swift|picanto|sandero|ibiza|megane|civic)\b/i],
]

/** Every distinct size the message points at (usually zero or one). */
export function detectVehicleSizes(message: string): VehicleType[] {
  const collect = (patterns: [VehicleType, RegExp][]) => {
    const found: VehicleType[] = []
    for (const [size, re] of patterns) if (re.test(message) && !found.includes(size)) found.push(size)
    return found
  }
  const byBody = collect(BODY_PATTERNS)
  if (byBody.length > 0) return byBody
  return collect(MODEL_PATTERNS)
}

// "small SUV" is a large-vehicle word plus a size word, so let the body type
// win rather than calling it ambiguous.
export function resolveVehicleSize(message: string): { size: VehicleType | null; ambiguous: boolean } {
  const found = detectVehicleSizes(message)
  if (found.length === 0) return { size: null, ambiguous: false }
  if (found.length === 1) return { size: found[0], ambiguous: false }
  if (found.includes('largesuv')) return { size: 'largesuv', ambiguous: false }
  return { size: null, ambiguous: true }
}

export const SIZE_HELP_RE = /(what|which)\s+(car\s+)?size|what\s+(counts|is|are)\s+(as\s+)?(a\s+)?(small|mid|medium|large|big)|(small|mid|medium|large|big)[\s-]?(size|sized)?\s+(car\s+)?(mean|vs|or|versus)|difference between (small|mid|large)|how (do|can) i (know|tell)\s+(what|which)\s+size|not sure (what|which)?\s*size|size (guide|chart|of my car)|does my car (count|fit)/i

export function sizeGuideText(): string {
  const lower = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t)
  const line = (k: VehicleType) => `${VEHICLE_LABELS[k]}: ${lower(VEHICLE_GUIDE[k].body)} (${VEHICLE_GUIDE[k].examples})`
  return `Here's how we size cars. ${line('small')}. ${line('midsize')}. ${line('largesuv')}. Tell me your make and model and I'll say which one it is.`
}

export function sizeGuideForPrompt(): string {
  return (Object.keys(VEHICLE_GUIDE) as VehicleType[])
    .map(k => `${VEHICLE_LABELS[k]} (${k}): ${VEHICLE_GUIDE[k].body}, e.g. ${VEHICLE_GUIDE[k].examples}`)
    .join('\n')
}

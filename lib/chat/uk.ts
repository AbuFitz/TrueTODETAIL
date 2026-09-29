// The site speaks British English. Whatever a model writes, American car words and
// spellings are turned into the UK ones before a customer sees them.

const SWAPS: [RegExp, string][] = [
  [/\ba (station )?wagon\b/gi, 'an estate'],
  [/\bsedans\b/gi, 'saloons'],
  [/\bsedan\b/gi, 'saloon'],
  [/\bstation wagons?\b/gi, 'estate'],
  [/\bwagons\b/gi, 'estates'],
  [/\bwagon\b/gi, 'estate'],
  [/\bminivans\b/gi, 'people carriers'],
  [/\bminivan\b/gi, 'people carrier'],
  [/\bhoods\b/gi, 'bonnets'],
  [/\bhood\b/gi, 'bonnet'],
  [/\btrunk\b/gi, 'boot'],
  [/\bfenders\b/gi, 'wings'],
  [/\bfender\b/gi, 'wing'],
  [/\bwindshields\b/gi, 'windscreens'],
  [/\bwindshield\b/gi, 'windscreen'],
  [/\bgas(oline)?\b/gi, 'petrol'],
  [/\btires\b/gi, 'tyres'],
  [/\btire\b/gi, 'tyre'],
  [/\bcolors\b/gi, 'colours'],
  [/\bcolor\b/gi, 'colour'],
  [/\bcolored\b/gi, 'coloured'],
  [/\borganize\b/gi, 'organise'],
  [/\bcenter\b/gi, 'centre'],
  [/\bcancell?ed\b/gi, 'cancelled'],
]

function matchCase(from: string, to: string): string {
  if (from === from.toUpperCase() && from.length > 1) return to.toUpperCase()
  if (from[0] === from[0]!.toUpperCase()) return to.charAt(0).toUpperCase() + to.slice(1)
  return to
}

export function withUkWording(text: string): string {
  let out = text
  for (const [re, to] of SWAPS) out = out.replace(re, m => matchCase(m, to))
  return out
}

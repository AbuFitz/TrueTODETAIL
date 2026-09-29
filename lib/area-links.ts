// Just the town names and URLs, for client components like the footer.
// Importing lib/areas.ts there would ship every town page's full copy in
// the site-wide JavaScript bundle. lib/areas.ts checks this list against
// its own data at build time, so the two can't drift apart silently.
export const AREA_LINKS: { slug: string; name: string }[] = [
  { slug: 'hemel-hempstead', name: 'Hemel Hempstead' },
  { slug: 'st-albans', name: 'St Albans' },
  { slug: 'watford', name: 'Watford' },
  { slug: 'berkhamsted', name: 'Berkhamsted' },
  { slug: 'harpenden', name: 'Harpenden' },
  { slug: 'rickmansworth', name: 'Rickmansworth' },
  { slug: 'chesham', name: 'Chesham' },
  { slug: 'amersham', name: 'Amersham' },
  { slug: 'borehamwood', name: 'Borehamwood' },
  { slug: 'luton', name: 'Luton' },
  { slug: 'dunstable', name: 'Dunstable' },
  { slug: 'tring', name: 'Tring' },
]

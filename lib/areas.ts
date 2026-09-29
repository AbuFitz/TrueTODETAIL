import { AREA_LINKS } from '@/lib/area-links'

export interface AreaFAQ {
  q: string
  a: string
}

export interface Area {
  slug: string
  name: string
  county: string
  region: string
  lat: number
  lng: number
  zoom: number
  distanceMiles: number
  driveTime: string
  postcodes: string[]
  neighbourhoods: string[]
  tagline: string
  intro: string
  localParagraph: string
  faqs: AreaFAQ[]
}

export const REGIONS = [
  'Hemel Hempstead',
  'Dacorum & West Herts',
  'St Albans & District',
  'Watford & Three Rivers',
  'Buckinghamshire',
  'Bedfordshire',
] as const

export const AREAS: Area[] = [
  {
    slug: 'hemel-hempstead',
    name: 'Hemel Hempstead',
    county: 'Hertfordshire',
    region: 'Hemel Hempstead',
    lat: 51.7533, lng: -0.4689, zoom: 12,
    distanceMiles: 0,
    driveTime: 'Local. Same-day slots are available here more often than anywhere else on our books.',
    postcodes: ['HP1', 'HP2', 'HP3'],
    neighbourhoods: ['Boxmoor', 'Apsley', 'Leverstock Green', 'Adeyfield', 'Grovehill', 'Gadebridge', 'Warners End', 'Chaulden', 'Bennetts End', 'Nash Mills', 'Felden', 'Piccotts End', 'Maylands', 'Bourne End', 'Great Gaddesden', 'Gaddesden Row'],
    tagline: 'Our home turf. Every job starts and ends here.',
    intro: "True To Detail is based in Hemel Hempstead, so if you're anywhere in HP1, HP2 or HP3 you're about as close to us as it gets. We're regularly working driveways in Boxmoor and Apsley, offices around Maylands industrial estate, and homes across Adeyfield, Grovehill and Leverstock Green, often on the same day you book.",
    localParagraph: "Being based here means Hemel jobs rarely wait long for a slot, and if something needs a follow-up visit, say a stain that needs a second pass or a recheck on a sealant cure, we can usually swing back round within a day or two rather than scheduling weeks out. We know the area well enough to give an honest arrival window rather than a vague half-day slot.",
    faqs: [
      { q: 'How quickly can you get to me in Hemel Hempstead?', a: "Because we're based here, Hemel is where we have the most flexibility. It's common to get a slot within a few days, and sometimes the same or next day if your schedule allows." },
      { q: 'Do you cover the industrial estates (Maylands, Boxmoor)?', a: 'Yes. We regularly detail fleet and personal vehicles at Maylands and the surrounding business parks. Just make sure we can access the vehicle during your booked window.' },
      { q: 'Can you fit a detail in before or after work hours?', a: "We run Monday to Saturday, 8am to 7pm, so early morning and early evening slots are both realistic for Hemel bookings. Just let us know your preference when you book." },
    ],
  },
  {
    slug: 'st-albans',
    name: 'St Albans',
    county: 'Hertfordshire',
    region: 'St Albans & District',
    lat: 51.7520, lng: -0.3360, zoom: 12,
    distanceMiles: 9,
    driveTime: 'Around 20 to 25 minutes from our Hemel Hempstead base.',
    postcodes: ['AL1', 'AL2', 'AL3', 'AL4'],
    neighbourhoods: ['Chiswell Green', 'Park Street', 'Bricket Wood', 'London Colney', 'Frogmore', 'Sandridge', 'Marshalswick', 'Jersey Farm', 'Colney Heath', 'Wheathampstead'],
    tagline: 'Cathedral city streets, driveway-friendly service.',
    intro: 'True To Detail provides fully mobile car detailing throughout St Albans, including AL1, AL2, AL3 and AL4. We regularly cover Chiswell Green, Park Street, Marshalswick, Jersey Farm, Sandridge and London Colney, working on driveways, at offices, and at homes across the district.',
    localParagraph: "St Albans has a lot of terraced streets and permit-only parking zones close to the centre, so we ask where we can safely park the van and access your vehicle before we set an arrival window. Most St Albans customers are further out in Marshalswick, Jersey Farm or Chiswell Green, where a driveway or nearby space makes things straightforward.",
    faqs: [
      { q: 'Do you cover central St Albans or just the outskirts?', a: "Both. We cover the full AL1 to AL4 area. In the city centre itself, parking can be tighter, so we'll check access details when you book to make sure we can work efficiently." },
      { q: 'Can you come to an office or workplace in St Albans?', a: 'Yes, plenty of our St Albans bookings are at workplaces during the day. We just need somewhere to park close to the vehicle for our equipment.' },
      { q: 'Do you cover Wheathampstead and Harpenden too?', a: "We do. Both sit within our standard coverage area, and we're often working across St Albans and Harpenden on the same day." },
    ],
  },
  {
    slug: 'watford',
    name: 'Watford',
    county: 'Hertfordshire',
    region: 'Watford & Three Rivers',
    lat: 51.6565, lng: -0.3903, zoom: 12,
    distanceMiles: 11,
    driveTime: 'Typically 20 to 25 minutes from Hemel Hempstead.',
    postcodes: ['WD17', 'WD18', 'WD19', 'WD24', 'WD25'],
    neighbourhoods: ['Cassiobury', 'Nascot Wood', 'North Watford', 'West Watford', 'Garston', 'Leavesden', 'Oxhey', 'South Oxhey'],
    tagline: 'From Cassiobury driveways to Leavesden business parks.',
    intro: "Watford is one of our most regular runs outside Hemel. We cover WD17, WD18, WD19, WD24 and WD25, including Cassiobury, Nascot Wood, North and West Watford, Garston, Leavesden and Oxhey. Whether it's a driveway detail near Cassiobury Park or a fleet vehicle at a Leavesden business park, we bring the same setup: our own power, water and equipment.",
    localParagraph: "Watford's mix of dense residential streets and larger business parks around Leavesden means our bookings here vary a lot, from a single family car in South Oxhey to multiple vehicles for a local business. Either way, we confirm parking and access before the day so there's no wasted time on arrival.",
    faqs: [
      { q: 'Do you cover the Leavesden business parks?', a: 'Yes, we regularly detail vehicles at workplaces around Leavesden, both one-off bookings and repeat business customers.' },
      { q: 'Is Watford within your standard pricing, or is it extra?', a: "Watford sits comfortably inside our standard 25-mile coverage area from Hemel Hempstead, so it's priced the same as any other job. No travel surcharge." },
      { q: 'Can you handle a full valet for a family car in Watford in a single visit?', a: "Yes. Our Full Valet and Premium Detail packages are built to be completed in one visit, typically 4 to 7 hours depending on the package and vehicle size." },
    ],
  },
  {
    slug: 'berkhamsted',
    name: 'Berkhamsted',
    county: 'Hertfordshire',
    region: 'Dacorum & West Herts',
    lat: 51.7621, lng: -0.5648, zoom: 13,
    distanceMiles: 4,
    driveTime: 'Usually under 15 minutes from Hemel Hempstead.',
    postcodes: ['HP4'],
    neighbourhoods: ['Northchurch', 'Potten End', 'Little Gaddesden'],
    tagline: 'One of our closest and most frequent runs.',
    intro: "Berkhamsted (HP4) is right on our doorstep, along with Northchurch, Potten End and Little Gaddesden. It's one of our shortest drives from base, which means Berkhamsted bookings are usually easy to slot in quickly, including for Full Valet and Premium Detail jobs that run several hours.",
    localParagraph: "Berkhamsted's high street and surrounding residential roads are mostly good for van access, and a lot of our regular customers here are on quieter side streets near the canal or up towards Kings Langley Road. Being this close to base also means if a follow-up visit is ever needed, it's rarely a long wait.",
    faqs: [
      { q: 'How far in advance do I need to book in Berkhamsted?', a: "Because it's so close to our base, Berkhamsted often has more availability at short notice than towns further out. Worth asking even if you need something this week." },
      { q: 'Do you cover Northchurch and Potten End as standard?', a: 'Yes, both are treated as part of Berkhamsted for booking and pricing purposes.' },
      { q: 'Can you do a Premium Detail in one visit for a Berkhamsted address?', a: 'Yes, Premium Detail typically takes 6 to 7 hours and is completed in a single visit. We just need continuous access to the vehicle for that window.' },
    ],
  },
  {
    slug: 'harpenden',
    name: 'Harpenden',
    county: 'Hertfordshire',
    region: 'St Albans & District',
    lat: 51.8171, lng: -0.3560, zoom: 13,
    distanceMiles: 10,
    driveTime: 'Around 20 to 25 minutes from Hemel Hempstead.',
    postcodes: ['AL5'],
    neighbourhoods: ['Rothamsted', 'Harpenden Common', 'Batford', 'Southdown'],
    tagline: 'Driveway-heavy streets, dependable results.',
    intro: "Harpenden (AL5) is a regular fixture on our schedule, from the roads around Harpenden Common to Batford and Southdown. Plenty of driveways here make for straightforward access, which suits longer jobs like Full Valet and Premium Detail well.",
    localParagraph: "Harpenden tends to be one of our tidier jobs logistically: wide roads, good driveway access, and customers who often book our higher packages for cars that see a lot of commuting mileage into London via the train station. We bring everything needed, so there's nothing for you to prepare beforehand.",
    faqs: [
      { q: 'Is Harpenden covered as standard, or does it cost more?', a: "Harpenden is well within our usual coverage area, priced the same as Hemel Hempstead itself. No extra travel charge." },
      { q: 'Do you offer anything for commuter cars that just need regular upkeep?', a: "Our Essential pack is designed for exactly that: a quick, thorough refresh between bigger details, ideal for cars driven daily." },
      { q: 'Can I book for a work day when I\'m not home?', a: "Yes, as long as we can access the vehicle we're happy to work while you're out. We'll message when we arrive and again once it's done." },
    ],
  },
  {
    slug: 'rickmansworth',
    name: 'Rickmansworth',
    county: 'Hertfordshire',
    region: 'Watford & Three Rivers',
    lat: 51.6390, lng: -0.4770, zoom: 13,
    distanceMiles: 9,
    driveTime: 'Typically 20 to 25 minutes from Hemel Hempstead.',
    postcodes: ['WD3'],
    neighbourhoods: ['Croxley Green', 'Mill End', 'Batchworth', 'Moor Park'],
    tagline: 'Canal-side town, regularly on our route.',
    intro: "Rickmansworth and the wider WD3 area, including Croxley Green, Mill End, Batchworth and Moor Park, sit comfortably inside our standard coverage. It's a town we're in and out of often, whether that's a canal-side driveway or a property near Moor Park.",
    localParagraph: "A lot of Rickmansworth's residential streets back onto the canal or the Chess valley, and driveway space is generally decent, which keeps setup simple. We often pair a Rickmansworth booking with a Croxley Green or Watford job on the same day, so scheduling flexibility here is usually good.",
    faqs: [
      { q: 'Do you cover Croxley Green and Moor Park as part of Rickmansworth?', a: 'Yes, both fall within our Rickmansworth coverage for booking purposes.' },
      { q: 'Can you match a specific time window in Rickmansworth?', a: "We confirm your exact arrival window within an hour of booking, and we're generally reliable to that window unless something unusual comes up earlier in the day." },
      { q: 'What if my car has heavy mud or debris from country roads nearby?', a: "That's exactly what our Full Valet and Premium Detail packages are built for: deep interior extraction plus exterior decontamination handles it." },
    ],
  },
  {
    slug: 'chesham',
    name: 'Chesham',
    county: 'Buckinghamshire',
    region: 'Buckinghamshire',
    lat: 51.7053, lng: -0.6103, zoom: 13,
    distanceMiles: 9,
    driveTime: 'Around 20 to 25 minutes from Hemel Hempstead.',
    postcodes: ['HP5'],
    neighbourhoods: ['Chesham Bois', 'Ley Hill', 'Waterside'],
    tagline: 'The end of the Metropolitan line, well within our reach.',
    intro: "Chesham (HP5), including Chesham Bois, Ley Hill and the Waterside area, sits just over the Hertfordshire border in Buckinghamshire. It's comfortably within our standard 25-mile radius from Hemel Hempstead, so it's booked and priced exactly the same as our Hertfordshire jobs.",
    localParagraph: "Chesham's valley setting means some streets are steep or narrow, so we like to confirm parking near your vehicle in advance. Once we're set up, the job runs the same as anywhere else: our own power and water, so there's nothing you need to arrange.",
    faqs: [
      { q: 'Is Chesham really covered, even though it\'s in Buckinghamshire?', a: "Yes. Our coverage is based on distance from Hemel Hempstead, not county lines, and Chesham falls well inside our usual 25-mile area." },
      { q: 'Do you cover Chesham Bois separately?', a: 'No need. Chesham Bois is treated as part of the same Chesham coverage area.' },
      { q: 'What if my street is narrow or has limited parking?', a: "Let us know when booking and we'll figure out the best spot for the van in advance, so there's no delay on the day." },
    ],
  },
  {
    slug: 'amersham',
    name: 'Amersham',
    county: 'Buckinghamshire',
    region: 'Buckinghamshire',
    lat: 51.6743, lng: -0.6072, zoom: 13,
    distanceMiles: 12,
    driveTime: 'Usually 25 to 30 minutes from Hemel Hempstead.',
    postcodes: ['HP6', 'HP7'],
    neighbourhoods: ['Old Amersham', 'Amersham-on-the-Hill'],
    tagline: 'Old town charm, new town convenience.',
    intro: "Amersham splits neatly into Old Amersham and Amersham-on-the-Hill (HP6/HP7), and we cover both. It's one of the further edges of our standard area, but still well inside the 25-mile radius we work from around Hemel Hempstead.",
    localParagraph: "Old Amersham's historic high street has some tighter parking, while Amersham-on-the-Hill tends to have easier driveway access. Either way, we plan the visit around whichever suits your address. Being further out, Amersham bookings sometimes need a touch more notice than closer towns, but availability is usually good within the week.",
    faqs: [
      { q: 'Is there an extra charge for Amersham given the distance?', a: "No. Amersham is within our standard coverage radius, so pricing is the same as anywhere else we cover." },
      { q: 'Do I need to book further ahead for Amersham?', a: "Not necessarily, but since it's on the edge of our usual working area, booking a few days ahead gives us more flexibility to fit you in at a convenient time." },
      { q: 'Can you tell me if my exact postcode is covered before I book?', a: "Absolutely. Message us on WhatsApp or call and we'll confirm straight away." },
    ],
  },
  {
    slug: 'borehamwood',
    name: 'Borehamwood',
    county: 'Hertfordshire',
    region: 'Dacorum & West Herts',
    lat: 51.6553, lng: -0.2793, zoom: 13,
    distanceMiles: 15,
    driveTime: 'Typically 30 to 35 minutes from Hemel Hempstead.',
    postcodes: ['WD6'],
    neighbourhoods: ['Elstree', 'Well End'],
    tagline: 'Studio town, still comfortably within reach.',
    intro: "Borehamwood and Elstree (WD6) sit towards the eastern edge of our coverage area, roughly 15 miles from our Hemel Hempstead base. We regularly work here for both residential driveways and vehicles connected to the local studio and business community.",
    localParagraph: "Borehamwood being on the edge of our usual radius means we tend to batch bookings here where we can, so if you're flexible on the day, we can often offer a better choice of time slots. The service itself is identical to anywhere closer to base.",
    faqs: [
      { q: 'Is Borehamwood within your standard 25-mile coverage?', a: "Yes, it's right at the edge of it, and comfortably inside." },
      { q: 'Do you cover Elstree separately?', a: "Elstree is covered under the same Borehamwood service area." },
      { q: 'Can you detail vehicles connected to local production/studio work?', a: "Yes, we've worked on vehicles for people connected to the local studios. The same fixed-price packages apply." },
    ],
  },
  {
    slug: 'luton',
    name: 'Luton',
    county: 'Bedfordshire',
    region: 'Bedfordshire',
    lat: 51.8787, lng: -0.4200, zoom: 12,
    distanceMiles: 13,
    driveTime: 'Usually 25 to 30 minutes from Hemel Hempstead.',
    postcodes: ['LU1', 'LU2', 'LU3', 'LU4'],
    neighbourhoods: ['Stopsley', 'Marsh Farm', 'Leagrave', 'Bury Park', 'Wardown'],
    tagline: 'Airport town, full coverage across LU1 to LU4.',
    intro: "Luton (LU1, LU2, LU3, LU4) is one of our furthest regular towns, taking in Stopsley, Marsh Farm, Leagrave, Bury Park and the areas around Wardown Park. It's within our standard 25-mile radius, and we work here on the same fixed-price basis as anywhere closer to Hemel Hempstead.",
    localParagraph: "With the airport and motorway links nearby, a fair few Luton bookings are for cars that spend a lot of time on the road, sometimes picking up more road grime and interior wear than average. Our Full Valet and Premium Detail packages are built for exactly that kind of reset.",
    faqs: [
      { q: 'Do you cover all of Luton, or just certain postcodes?', a: "We cover LU1 through LU4 as standard. If you're further out towards LU5/LU6, get in touch to confirm distance from your exact address." },
      { q: 'Is there a premium for coming out to Luton?', a: "No, Luton falls within our standard 25-mile coverage, so pricing is unchanged." },
      { q: 'Can you deal with heavy interior wear from frequent motorway driving?', a: "Yes, that's a common ask in Luton. Our Premium Detail includes a comprehensive interior restoration alongside the exterior work." },
    ],
  },
  {
    slug: 'dunstable',
    name: 'Dunstable',
    county: 'Bedfordshire',
    region: 'Bedfordshire',
    lat: 51.8860, lng: -0.5210, zoom: 13,
    distanceMiles: 11,
    driveTime: 'Typically 20 to 25 minutes from Hemel Hempstead.',
    postcodes: ['LU5', 'LU6'],
    neighbourhoods: ['Houghton Regis', 'Kensworth', 'Studham'],
    tagline: 'On the edge of the Chilterns, well within our radius.',
    intro: "Dunstable (LU5, LU6), along with Houghton Regis, Kensworth and Studham, sits just over the Bedfordshire border but comfortably inside our 25-mile working area from Hemel Hempstead.",
    localParagraph: "The Chiltern edge around Dunstable means some properties are on chalky, dusty tracks that can leave a car looking worse than it is. Our exterior decontamination and wheel cleaning stages are built to shift that kind of build-up rather than just rinse over it.",
    faqs: [
      { q: 'Do you cover Houghton Regis as part of Dunstable?', a: 'Yes, Houghton Regis, Kensworth and Studham are all included in our Dunstable coverage.' },
      { q: 'Is Dunstable priced the same as closer towns?', a: "Yes, it's within our standard coverage radius so pricing doesn't change." },
      { q: 'My car picks up a lot of chalk dust living out here, can that be fully removed?', a: "Generally yes. Our exterior wash and decontamination stages are designed to lift ground-in dust and grime, not just move it around." },
    ],
  },
  {
    slug: 'tring',
    name: 'Tring',
    county: 'Hertfordshire',
    region: 'Dacorum & West Herts',
    lat: 51.7964, lng: -0.6579, zoom: 13,
    distanceMiles: 8,
    driveTime: 'Usually 15 to 20 minutes from Hemel Hempstead.',
    postcodes: ['HP23'],
    neighbourhoods: ['Tring Station', 'Wigginton', 'Long Marston', 'Aldbury'],
    tagline: 'A short hop along the Chilterns, regularly booked.',
    intro: "Tring (HP23) and the surrounding villages, Wigginton, Long Marston, Aldbury and the area around Tring Station, are a short, regular run for us from Hemel Hempstead, close enough that scheduling is rarely an issue.",
    localParagraph: "Tring's mix of town streets and quieter surrounding villages both work well for us: plenty of driveway parking, and being this close to base means if you need a follow-up visit, it's straightforward to arrange.",
    faqs: [
      { q: 'Do you cover the villages around Tring, like Aldbury or Wigginton?', a: 'Yes, all are included in our Tring coverage area.' },
      { q: 'How soon can I get booked in around Tring?', a: "Being close to our base, Tring often has good short-notice availability. Worth asking even for this week." },
      { q: 'Can you handle a car that\'s been used on the Ridgeway/countryside routes nearby?', a: "Yes, mud and countryside grime on the exterior and in the boot/footwells is a routine job for our Full Valet and Premium Detail packages." },
    ],
  },
]

// Fails the build if the footer's lightweight link list drifts from AREAS.
{
  const expected = AREAS.map((a) => `${a.slug}:${a.name}`).join('|')
  const actual = AREA_LINKS.map((a) => `${a.slug}:${a.name}`).join('|')
  if (expected !== actual) {
    throw new Error('lib/area-links.ts is out of sync with AREAS in lib/areas.ts')
  }
}

/** The n closest other areas by straight-line distance, for "nearby areas" links. */
export function nearestAreas(area: Area, n: number): Area[] {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dist = (b: Area) => {
    const dLat = toRad(b.lat - area.lat)
    const dLng = toRad(b.lng - area.lng)
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(area.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
    return 2 * Math.asin(Math.sqrt(h))
  }
  return AREAS.filter((a) => a.slug !== area.slug)
    .sort((a, b) => dist(a) - dist(b))
    .slice(0, n)
}

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}

export function mapEmbedUrl(area: Pick<Area, 'lat' | 'lng' | 'zoom'>): string {
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d40000!2d${area.lng}!3d${area.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${area.zoom}!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk`
}

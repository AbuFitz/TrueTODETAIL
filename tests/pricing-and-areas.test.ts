import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculatePrice, PACKAGES } from '@/lib/pricing'
import { AREAS, nearestAreas } from '@/lib/areas'
import { AREA_LINKS } from '@/lib/area-links'

test('prices are computed server-side from the package table plus add-ons', () => {
  assert.deepEqual(calculatePrice('Full Valet', 'midsize', ['pet-hair'])?.total, 155 + 25)
  assert.equal(calculatePrice('Essential', 'small')?.total, 80)
  assert.equal(calculatePrice('Not a pack', 'small'), null)
})

test('every package has a price for every vehicle size', () => {
  for (const p of PACKAGES) for (const size of ['small', 'midsize', 'largesuv'] as const) assert.ok(p.price[size] > 0, `${p.id} ${size}`)
})

test('footer area links match the full area data', () => {
  assert.deepEqual(AREA_LINKS, AREAS.map((a) => ({ slug: a.slug, name: a.name })))
})

test('nearby areas are sorted by distance and exclude the area itself', () => {
  const watford = AREAS.find((a) => a.slug === 'watford')!
  const near = nearestAreas(watford, 3)
  assert.equal(near.length, 3)
  assert.ok(!near.some((a) => a.slug === 'watford'))
  assert.ok(near.some((a) => a.slug === 'rickmansworth'), 'Rickmansworth is one of the closest to Watford')
})

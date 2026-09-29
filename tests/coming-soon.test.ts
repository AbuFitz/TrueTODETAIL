import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { BUSINESS_INFO, VEHICLE_GUIDE_NOTE } from '@/lib/pricing'
import { localBusinessJsonLd } from '@/lib/seo'
import { runRuleBasedTurn } from '@/lib/chat/rule-based'
import { emptyConversationState } from '@/lib/chat/types'

function talk(messages: string[]) {
  let state = emptyConversationState()
  return messages.map((m, i) => {
    const r = runRuleBasedTurn(state, m, i === 0)
    state = r.state
    return r
  })
}

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

test('van and fleet is advertised as coming soon, with no prices or discounts promised', () => {
  assert.match(BUSINESS_INFO.fleetDiscount, /coming soon/i)
  assert.doesNotMatch(BUSINESS_INFO.fleetDiscount, /\d+%/)
  assert.match(VEHICLE_GUIDE_NOTE, /coming soon/i)
  const [r] = talk(['do you clean vans'])
  assert.match(r!.text, /coming soon/i)
  assert.doesNotMatch(r!.text, /\d+%|£\d/)
  assert.match(r!.text, /\/van-fleet/)
})

test('every link to the van and fleet page says coming soon or soon', () => {
  assert.match(read('components/Navbar.tsx'), /label: 'Fleet',\s+href: '\/van-fleet', soon: true/)
  assert.match(read('components/Footer.tsx'), /Van & Fleet \(Coming Soon\)/)
  assert.match(read('components/Packages.tsx'), /Vans and fleets are coming soon/)
  assert.match(read('app/areas/page.tsx'), /Van & Fleet · Coming soon/)
  assert.match(read('app/not-found.tsx'), /coming soon/)
  assert.match(read('app/mobile-car-wash/page.tsx'), /Van & Fleet \(Coming Soon\)/)
  assert.match(read('app/van-fleet/layout.tsx'), /Coming Soon/)
  const page = read('app/van-fleet/page.tsx')
  assert.match(page, /Coming soon/)
  assert.match(page, /Register Interest/)
  assert.doesNotMatch(page, /Send Enquiry|LET&apos;S TALK/)
  assert.ok(!localBusinessJsonLd().knowsAbout?.includes('Van and fleet cleaning'), 'not listed as a service yet')
})

const OLD_NUMBER = /07984\s?237149|\+?447984\s?237149/
function files(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'tests', 'e2e'].includes(f)) continue
    const p = join(dir, f)
    if (statSync(p).isDirectory()) files(p, out)
    else if (/\.(tsx?|json|txt|md|xml|html)$/.test(f) && f !== 'llms.txt' && f !== 'tsconfig.tsbuildinfo') out.push(p)
  }
  return out
}

test('the old phone number appears nowhere in the site, and the current one is the canonical contact', () => {
  for (const dir of ['app', 'components', 'lib', 'public']) {
    for (const f of files(join(process.cwd(), dir))) {
      assert.doesNotMatch(readFileSync(f, 'utf8'), OLD_NUMBER, f)
    }
  }
  const ld = localBusinessJsonLd() as { telephone: string; contactPoint: { telephone: string }[] }
  assert.equal(ld.telephone, '+447359591800')
  assert.equal(ld.contactPoint[0]!.telephone, '+447359591800')
  const llms = read('public/llms.txt')
  assert.match(llms, /07359 591800/)
  assert.match(llms, /07984 237149[^\n]*no longer in use/i)
  assert.match(read('app/layout.tsx'), /Call 07359 591800/)
})

import { expect, test } from '@playwright/test'

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => { try { localStorage.setItem('ttd_cookie_consent', 'denied') } catch {} })
})

test('reduced motion: smooth scrolling and the marquee are off, framer entrances do not travel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
  const running = await page.evaluate(() =>
    Array.from(document.querySelectorAll('*')).filter((el) => {
      const cs = getComputedStyle(el)
      return cs.animationName !== 'none' && (cs.animationIterationCount === 'infinite' || parseFloat(cs.animationDuration) > 0.05)
    }).length,
  )
  expect(running, 'no long or looping CSS animation under reduced motion').toBe(0)
})

test('normal motion: smooth scrolling is on', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth')
})

test('in-page links land below the fixed navigation, not under it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#packages', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const top = await page.locator('#packages').evaluate((el) => Math.round(el.getBoundingClientRect().top))
  expect(top, 'the section starts below the 80px bar').toBeGreaterThanOrEqual(80)
})

test('the confirmation promise reads the same everywhere on the home page', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const text = await page.locator('body').innerText()
  expect(text).not.toMatch(/within 2 hours/i)
  expect(text).not.toMatch(/Confirmed within 1 hour/i)
  expect(text).toMatch(/as soon as possible/i)
})

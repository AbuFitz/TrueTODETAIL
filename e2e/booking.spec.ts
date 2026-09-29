import { expect, test } from '@playwright/test'

// 14:30 UTC on 1 Oct 2026 is 15:30 in the UK: every slot up to 4pm has
// gone (an hour's notice is needed), 6pm is still open.
const NOW = new Date('2026-10-01T14:30:00Z')

test.beforeEach(async ({ page, context }) => {
  await context.addInitScript(() => { try { localStorage.setItem('ttd_cookie_consent', 'denied') } catch {} })
  await page.clock.install({ time: NOW })
})

test('booking popup: past slots are blocked and a request goes through', async ({ page }) => {
  let sent: Record<string, unknown> | null = null
  await page.route('**/api/booking', async (route) => {
    sent = route.request().postDataJSON()
    await route.fulfill({ status: 201, json: { success: true, booking: { id: 'TTD-261001-TEST' } } })
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('ttd:book-now')))
  const popup = page.getByTestId('booking-modal')
  await expect(popup).toBeVisible()

  await popup.getByRole('radio', { name: /Mid-Size/ }).first().click()
  await popup.getByRole('button', { name: /Full Valet/ }).first().click()
  await popup.getByRole('button', { name: /Next: Schedule/ }).click()

  const date = popup.locator('input[type="date"]')
  await expect(date).toHaveAttribute('min', '2026-10-01')
  await date.fill('2026-10-01')
  for (const slot of ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']) {
    await expect(popup.getByRole('button', { name: slot, exact: true })).toBeDisabled()
  }
  await expect(popup.getByRole('button', { name: '6:00 PM', exact: true })).toBeEnabled()

  await date.fill('2026-10-10')
  await popup.getByRole('button', { name: '2:00 PM', exact: true }).click()
  await popup.getByPlaceholder('Enter your postcode').fill('HP1 3PT')
  await popup.getByPlaceholder('e.g. AB12 CDE').fill('AB21CDE')
  await popup.getByRole('button', { name: /Next: Your Details/ }).click()
  await popup.getByPlaceholder('John Smith').fill('Sam Test')
  await popup.getByPlaceholder('07700 900000').fill('07700 900123')
  await popup.getByPlaceholder('john@example.com').fill('sam@example.com')
  await expect(popup.getByText('Sat 10 Oct · 2:00 PM')).toBeVisible()
  await popup.getByRole('button', { name: /Confirm Booking/ }).click()

  await expect(popup.getByText('REQUEST SENT.')).toBeVisible()
  await expect(popup.getByText(/confirm your slot on Saturday 10 October 2026 at 2:00 PM/)).toBeVisible()
  expect(sent).toMatchObject({ pack: 'Full Valet', vehicle: 'midsize', date: '2026-10-10', time: '2:00 PM', address: 'HP1 3PT' })

  await page.keyboard.press('Escape')
  await expect(popup).toHaveCount(0)
})

test('booking popup: a delivery failure tells the customer to call', async ({ page }) => {
  await page.route('**/api/booking', (route) =>
    route.fulfill({ status: 502, json: { error: "Sorry, we couldn't send your request just now. Please call or WhatsApp us on 07359 591800 and we'll book you in." } }))
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('ttd:book-now')))
  const popup = page.getByTestId('booking-modal')
  await popup.getByRole('radio', { name: /Small Car/ }).first().click()
  await popup.getByRole('button', { name: /Essential/ }).first().click()
  await popup.getByRole('button', { name: /Next: Schedule/ }).click()
  await popup.locator('input[type="date"]').fill('2026-10-12')
  await popup.getByRole('button', { name: '10:00 AM', exact: true }).click()
  await popup.getByPlaceholder('Enter your postcode').fill('WD17 1AA')
  await popup.getByPlaceholder('e.g. AB12 CDE').fill('AB21CDE')
  await popup.getByRole('button', { name: /Next: Your Details/ }).click()
  await popup.getByPlaceholder('07700 900000').fill('07700 900123')
  await popup.getByPlaceholder('john@example.com').fill('sam@example.com')
  await popup.getByRole('button', { name: /Confirm Booking/ }).click()
  await expect(popup.getByText(/07359 591800/)).toBeVisible()
  await expect(popup.getByText('REQUEST SENT.')).toHaveCount(0)
})

/** Distance from the top of the viewport to the top of an element, or null when it is off screen. */
async function topOf(page: import('@playwright/test').Page, locator: import('@playwright/test').Locator) {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return r.bottom < 0 || r.top > window.innerHeight ? null : Math.round(r.top)
  })
}

test('booking popup guides to the next part of each step after a choice', async ({ page }) => {
  // A short window so the steps have to scroll, on phone and desktop alike.
  const width = page.viewportSize()?.width ?? 1280
  await page.setViewportSize({ width, height: 640 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('ttd:book-now')))
  const popup = page.getByTestId('booking-modal')
  await expect(popup).toBeVisible()

  await popup.getByRole('radio', { name: /Mid-Size/ }).first().click()
  await page.waitForTimeout(900)
  expect(await topOf(page, popup.getByText('Choose your package')), 'packages in view after the size').not.toBeNull()

  await popup.getByRole('button', { name: /Full Valet/ }).first().click()
  await page.waitForTimeout(900)
  const extras = popup.getByText('Optional extras')
  const extrasTop = await topOf(page, extras)
  expect(extrasTop, 'add-ons in view after the package').not.toBeNull()
  expect(extrasTop!, 'add-ons brought up the screen, not left at the bottom').toBeLessThan(420)

  await popup.getByRole('button', { name: /Next: Schedule/ }).click()
  await popup.locator('input[type="date"]').fill('2030-01-15')
  await page.waitForTimeout(900)
  const slot = popup.getByRole('button', { name: '10:00 AM', exact: true })
  expect(await topOf(page, slot), 'time slots in view after the date').not.toBeNull()
  await slot.click()
  await page.waitForTimeout(900)
  expect(await topOf(page, popup.getByPlaceholder('Enter your postcode')), 'postcode in view after the time').not.toBeNull()
})

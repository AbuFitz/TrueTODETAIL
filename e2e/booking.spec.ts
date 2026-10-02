import { expect, test } from '@playwright/test'

// 14:30 UTC on 1 Oct 2026 is 15:30 in the UK: every slot up to 4pm has
// gone (an hour's notice is needed), 6pm is still open.
const NOW = new Date('2026-10-01T14:30:00Z')

test.beforeEach(async ({ page, context }) => {
  await context.addInitScript(() => { try { localStorage.setItem('ttd_cookie_consent', 'denied') } catch {} })
  await page.clock.install({ time: NOW })
})

async function open(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('ttd:book-now')))
  const popup = page.getByTestId('booking-modal')
  await expect(popup).toBeVisible()
  return popup
}
const next = (popup: import('@playwright/test').Locator) => popup.getByRole('button', { name: /^Continue/ }).click()

test('booking popup: one question per screen, no price before the package step, past slots are blocked and a request goes through', async ({ page }) => {
  let sent: Record<string, unknown> | null = null
  await page.route('**/api/booking', async (route) => {
    sent = route.request().postDataJSON()
    await route.fulfill({ status: 201, json: { success: true, booking: { id: 'TTD-261001-TEST' } } })
  })

  const popup = await open(page)
  await expect(popup.getByRole('heading', { name: /Car size/i })).toBeVisible()
  await expect(popup.getByText(/Step 1 of 7/)).toBeVisible()
  await expect(popup).not.toContainText('£')

  await popup.getByRole('radio', { name: /Mid-Size/ }).click()
  await next(popup)
  await expect(popup.getByRole('heading', { name: /^Package/i })).toBeVisible()
  await popup.getByRole('radio', { name: /Full Valet/ }).click()
  await expect(popup.getByRole('button', { name: /Continue · £155/ })).toBeVisible()
  await next(popup)
  await popup.getByRole('button', { name: /Engine Bay Clean/ }).click()
  await expect(popup.getByRole('button', { name: /Continue · £195/ })).toBeVisible()
  await popup.getByRole('button', { name: /Engine Bay Clean/ }).click()
  await next(popup)

  // Today: every slot up to 4pm has gone, 6pm is still open.
  await popup.getByRole('button', { name: 'Thursday 1 October 2026' }).click()
  for (const slot of ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']) {
    await expect(popup.getByRole('button', { name: slot, exact: true })).toBeDisabled()
  }
  await expect(popup.getByRole('button', { name: '6:00 PM', exact: true })).toBeEnabled()

  await popup.getByRole('button', { name: 'Later week' }).click()
  await popup.getByRole('button', { name: 'Saturday 10 October 2026' }).click()
  await popup.getByRole('button', { name: '2:00 PM', exact: true }).click()
  await next(popup)

  await popup.getByPlaceholder('Enter your postcode').fill('HP1 3PT')
  await popup.getByPlaceholder('e.g. AB12 CDE').fill('AB21CDE')
  await next(popup)
  await popup.getByPlaceholder('John Smith').fill('Sam Test')
  await popup.getByPlaceholder('07700 900000').fill('07700 900123')
  await popup.getByPlaceholder('john@example.com').fill('sam@example.com')
  await next(popup)

  await expect(popup.getByRole('heading', { name: /Check and send/i })).toBeVisible()
  await expect(popup.getByText('Sat 10 Oct · 2:00 PM')).toBeVisible()
  await expect(popup.getByText(/not a booking until we confirm it/i)).toBeVisible()
  await popup.getByRole('button', { name: /Send request/ }).click()

  await expect(popup.getByText('REQUEST SENT.')).toBeVisible()
  await expect(popup.getByText(/confirm your slot on Saturday 10 October 2026 at 2:00 PM/)).toBeVisible()
  expect(sent).toMatchObject({ pack: 'Full Valet', vehicle: 'midsize', date: '2026-10-10', time: '2:00 PM', address: 'HP1 3PT' })

  await page.keyboard.press('Escape')
  await expect(popup).toHaveCount(0)
})

test('booking popup: a delivery failure tells the customer to call', async ({ page }) => {
  await page.route('**/api/booking', (route) =>
    route.fulfill({ status: 502, json: { error: "Sorry, we couldn't send your request just now. Please call or WhatsApp us on 07359 591800 and we'll book you in." } }))
  const popup = await open(page)
  await popup.getByRole('radio', { name: /Small Car/ }).click()
  await next(popup)
  await popup.getByRole('radio', { name: /Essential/ }).click()
  await next(popup)
  await next(popup)
  await popup.getByRole('button', { name: 'Later week' }).click()
  await popup.getByRole('button', { name: 'Monday 12 October 2026' }).click()
  await popup.getByRole('button', { name: '10:00 AM', exact: true }).click()
  await next(popup)
  await popup.getByPlaceholder('Enter your postcode').fill('WD17 1AA')
  await popup.getByPlaceholder('e.g. AB12 CDE').fill('AB21CDE')
  await next(popup)
  await popup.getByPlaceholder('07700 900000').fill('07700 900123')
  await popup.getByPlaceholder('john@example.com').fill('sam@example.com')
  await next(popup)
  await popup.getByRole('button', { name: /Send request/ }).click()
  await expect(popup.getByText(/07359 591800/)).toBeVisible()
  await expect(popup.getByText('REQUEST SENT.')).toHaveCount(0)
})

for (const [w, h] of [[375, 667], [390, 844], [1280, 720]] as const) {
  test(`booking popup: every step fits a ${w}x${h} screen with nothing to scroll and no field small enough to zoom a phone`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    await page.route('**/api/booking', (route) => route.fulfill({ status: 201, json: { success: true, booking: { id: 'TTD-X' } } }))
    const popup = await open(page)
    await page.waitForTimeout(700)
    const fits = async (label: string) => {
      const m = await page.evaluate(() => {
        const sheet = document.querySelector<HTMLElement>('[data-testid="booking-scroll"]')!
        const small = Array.from(document.querySelectorAll('[data-testid="booking-modal"] input, [data-testid="booking-modal"] textarea')).filter(
          (el) => parseFloat(getComputedStyle(el).fontSize) < 16,
        ).length
        return { inner: sheet.scrollHeight - sheet.clientHeight, x: document.documentElement.scrollWidth - window.innerWidth, small }
      })
      expect(m.inner, `${label}: needs scrolling`).toBeLessThanOrEqual(1)
      expect(m.x, `${label}: sideways scroll`).toBeLessThanOrEqual(0)
      expect(m.small, `${label}: field under 16px`).toBe(0)
    }
    await fits('size')
    await popup.getByRole('radio', { name: /Mid-Size/ }).click(); await next(popup)
    await fits('package')
    await popup.getByRole('radio', { name: /Full Valet/ }).click(); await next(popup)
    await fits('extras'); await next(popup)
    await popup.getByRole('button', { name: 'Later week' }).click()
    await popup.getByRole('button', { name: 'Saturday 10 October 2026' }).click()
    await popup.getByRole('button', { name: '2:00 PM', exact: true }).click()
    await fits('when'); await next(popup)
    await popup.getByPlaceholder('Enter your postcode').fill('HP1 3PT')
    await popup.getByPlaceholder('e.g. AB12 CDE').fill('AB21CDE')
    await fits('where'); await next(popup)
    await popup.getByPlaceholder('07700 900000').fill('07700 900123')
    await popup.getByPlaceholder('john@example.com').fill('sam@example.com')
    await fits('details'); await next(popup)
    await fits('review')
    await popup.getByRole('button', { name: /Send request/ }).click()
    await expect(popup.getByText('REQUEST SENT.')).toBeVisible()
    await fits('sent')
  })
}

import { expect, test, type Page } from '@playwright/test'

// Every screen shape a customer might use, including short landscape phones.
const SIZES: Array<[number, number]> = [
  [320, 568], [360, 640], [390, 844], [412, 915], [600, 900], [768, 1024], [820, 1180],
  [1024, 768], [1280, 800], [1440, 900], [1920, 1080], [667, 375], [740, 360], [844, 390],
]
const PAGES = ['/', '/areas', '/areas/watford', '/van-fleet', '/mobile-car-wash', '/terms']

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => { try { localStorage.setItem('ttd_cookie_consent', 'denied') } catch {} })
})

async function noSidewaysScroll(page: Page, label: string) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(over, `${label}: page is ${over}px wider than the screen`).toBeLessThanOrEqual(1)
}

for (const [w, h] of SIZES) {
  test(`pages fit at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      await noSidewaysScroll(page, `${path} at ${w}x${h}`)
      // The footer carries the watermark only, no logo of its own.
      await expect(page.locator('footer a[aria-label="True To Detail, home"]')).toHaveCount(0)
    }
  })

  test(`booking popup and chat stay on screen at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    await page.goto('/', { waitUntil: 'networkidle' })

    // Booking popup
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('ttd:book-now')))
    const popup = page.getByTestId('booking-modal').locator('> div').nth(1)
    await expect(popup).toBeVisible()
    // The popup slides in; measure once it has settled.
    await page.waitForTimeout(700)
    let box = (await popup.boundingBox())!
    expect(box.x, 'popup starts off the left of the screen').toBeGreaterThanOrEqual(-1)
    expect(box.x + box.width, 'popup runs off the right of the screen').toBeLessThanOrEqual(w + 1)
    expect(box.y + box.height, 'popup runs off the bottom of the screen').toBeLessThanOrEqual(h + 1)
    await noSidewaysScroll(page, `booking popup at ${w}x${h}`)
    // The step button must be reachable without scrolling the page.
    const next = page.getByTestId('booking-modal').getByRole('button', { name: /Select your vehicle size|Next|Confirm/ }).last()
    const nb = (await next.boundingBox())!
    expect(nb.y + nb.height, 'the popup button is below the screen').toBeLessThanOrEqual(h + 1)
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('booking-modal')).toHaveCount(0)

    // Chat
    await page.getByRole('button', { name: 'Open support chat' }).click()
    const chat = page.getByRole('dialog', { name: 'Support chat' })
    await expect(chat).toBeVisible()
    await page.waitForTimeout(400)
    box = (await chat.boundingBox())!
    expect(box.x, 'chat starts off the left of the screen').toBeGreaterThanOrEqual(-1)
    expect(box.y, 'chat starts above the top of the screen').toBeGreaterThanOrEqual(-1)
    expect(box.x + box.width, 'chat runs off the right').toBeLessThanOrEqual(w + 1)
    expect(box.y + box.height, 'chat runs off the bottom').toBeLessThanOrEqual(h + 1)
    const input = chat.getByPlaceholder('Ask us anything...')
    const ib = (await input.boundingBox())!
    expect(ib.y + ib.height, 'chat message box is off screen').toBeLessThanOrEqual(h + 1)
    expect(box.height, 'chat is too short to use').toBeGreaterThan(Math.min(260, h * 0.6))
    await noSidewaysScroll(page, `chat at ${w}x${h}`)
  })
}

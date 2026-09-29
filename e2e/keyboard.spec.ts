import { expect, test } from '@playwright/test'

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => { try { localStorage.setItem('ttd_cookie_consent', 'denied') } catch {} })
})

for (const [name, open, dialog] of [
  ['booking popup', "window.dispatchEvent(new CustomEvent('ttd:book-now'))", '[data-testid="booking-modal"]'],
  ['chat', null, '[role="dialog"][aria-label="Support chat"]'],
] as const) {
  test(`${name}: Tab stays inside, Escape closes, page scroll is restored`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    if (open) await page.evaluate(open)
    else await page.getByRole('button', { name: 'Open support chat' }).click()
    const popup = page.locator(dialog)
    await expect(popup).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press(i % 6 === 5 ? 'Shift+Tab' : 'Tab')
      expect(await popup.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(popup).toHaveCount(0)
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  })
}

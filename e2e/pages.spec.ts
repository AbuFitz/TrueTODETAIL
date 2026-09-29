import { expect, test } from '@playwright/test'

const PAGES = ['/', '/areas', '/areas/watford', '/van-fleet', '/mobile-car-wash', '/full-car-detail',
  '/interior-car-detailing', '/exterior-car-detailing', '/professional-car-valeting', '/mobile-car-detailing',
  '/privacy', '/terms', '/cookies']

for (const path of PAGES) {
  test(`${path} loads with a heading and no page errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    // Some pages have separate mobile and desktop layouts; exactly one heading shows.
    await expect(page.locator('h1:visible')).toHaveCount(1)
    expect(errors).toEqual([])
  })
}

test('unknown pages get the 404 page', async ({ page }) => {
  const res = await page.goto('/definitely-not-a-page')
  expect(res?.status()).toBe(404)
})

import { expect, test } from '@playwright/test'

// Talks to the real /api/support-chat route. Without AI keys (as in CI)
// that's the rules engine, so its answers can be checked exactly; with
// keys a model answers and only the basics are checked.
test('chat widget answers, keeps markup as text and hands focus back', async ({ page }) => {
  const dialogs: string[] = []
  page.on('dialog', async (d) => { dialogs.push(d.message()); await d.dismiss() })
  await page.goto('/')

  const launcher = page.getByRole('button', { name: 'Open support chat' })
  await launcher.click()
  const chat = page.getByRole('dialog', { name: 'Support chat' })
  const input = chat.getByPlaceholder('Ask us anything...')
  await expect(input).toBeFocused()

  async function ask(text: string) {
    await input.fill(text)
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/support-chat')),
      chat.getByRole('button', { name: 'Send message' }).click(),
    ])
    return (await res.json()) as { reply: string; engine: string }
  }

  const first = await ask('how much is a full valet')
  expect(first.reply.length).toBeGreaterThan(10)
  const second = await ask('mid-size')
  if (second.engine === 'rules') {
    expect(second.reply).toContain('£155')
    await expect(chat.getByText(/£155/).last()).toBeVisible()
  }

  await ask('<img src=x onerror=alert(1)>')
  await expect(chat.getByText('<img src=x onerror=alert(1)>')).toBeVisible()
  expect(dialogs).toEqual([])

  await page.keyboard.press('Escape')
  await expect(chat).toHaveCount(0)
  await expect(launcher).toBeFocused()
})

test('cookie banner never covers the chat button', async ({ page }) => {
  await page.goto('/')
  const banner = page.getByRole('dialog', { name: 'Cookie consent' })
  await expect(banner).toBeVisible()
  const launcher = page.getByRole('button', { name: 'Open support chat' })
  // The button slides up once the banner has measured itself.
  await expect.poll(async () => {
    const b = (await banner.boundingBox())!
    const c = (await launcher.boundingBox())!
    return c.y + c.height <= b.y
  }).toBe(true)
})

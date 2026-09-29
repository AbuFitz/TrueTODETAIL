import { defineConfig, devices } from '@playwright/test'

// End-to-end checks of the flows customers actually use, against a
// production build. Run `npm run build` first, then `npm run test:e2e`.
// Nothing here sends a real booking or chat: the API calls that would
// email the business are answered inside the test.
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:3007',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: 'npm run start -- -p 3007',
    url: 'http://localhost:3007',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})

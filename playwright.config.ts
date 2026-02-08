import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'NEXT_FONT_GOOGLE_MOCKED=1 npm run dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120000,
  },
})

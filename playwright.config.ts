import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Development compiles routes on demand; production keeps the stricter budget.
  timeout: process.env.PLAYWRIGHT_DEV_SERVER === '1' ? 90000 : 30000,
  expect: { timeout: process.env.PLAYWRIGHT_DEV_SERVER === '1' ? 15000 : 5000 },
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER ? undefined : {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});


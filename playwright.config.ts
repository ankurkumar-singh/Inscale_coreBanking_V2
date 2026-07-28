import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/e2e',

  /* Run independent tests in parallel */
  fullyParallel: true,

  /* Prevent accidental test.only commits in CI */
  forbidOnly: isCI,

  /* Retry failed tests only in CI */
  retries: isCI ? 2 : 0,

  /*
   * Use one worker in CI.
   * Locally, omit this property so Playwright uses its default worker count.
   */
  ...(isCI ? { workers: 1 } : {}),

  /* Generate HTML execution report */
  reporter: [
    ['html', { open: 'never' }],
  ],

  /* Common configuration for every browser */
  use: {
    /* Add the application URL later */
    // baseURL: 'https://application-url.com',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Cross-browser execution */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],

  /* Configure only if the application runs locally */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !isCI,
  // },
});
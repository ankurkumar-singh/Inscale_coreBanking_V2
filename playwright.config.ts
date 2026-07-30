import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/e2e',

  /* Public demo application is more reliable with sequential execution */
  fullyParallel: false,

  /* Prevent cross-browser test instability caused by parallel load */
  workers: 1,

  /* Prevent accidental test.only commits in CI */
  forbidOnly: isCI,

  /* Retry failed tests only in CI */
  retries: isCI ? 2 : 0,

  /* Generate HTML execution report */
  reporter: [
    ['line'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
  ],

  /* Common configuration for every browser */
  use: {
    /* Application URL with optional environment override */
    baseURL:
      process.env.BASE_URL ??
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/',

    trace: 'retain-on-failure',
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
});

import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
 //import path from 'path';
 //dotenv.config({ path: path.resolve(__dirname, '.env') });
 require('dotenv').config()
 //console.log(process.env)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: false,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      },
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    //['allure-playwright']
    ['html']
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
     //baseURL: 'http://localhost:4200/',
     globalQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
     baseURL: process.env.DEV === '1' ? 'http://localhost:4200'
            : process.env.STG == '1' ? 'http://localhost:4202/'
            : 'http://localhost:4201/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: {
         ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/' 
      },
    },
    {
      name: 'stg',
      use: {
         ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4202/' 
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 15 Pro Max']
      }
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
   webServer: {
     command: 'npm run start',
     url: 'http://localhost:4200/',
     timeout: 120 * 1000, // ⬅️ aumentás a 2 minutos
     reuseExistingServer: !process.env.CI,
   },
});

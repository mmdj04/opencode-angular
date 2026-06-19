import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  expect: { timeout: 10000 },
  timeout: 30000,
  fullyParallel: !process.env['CI'],
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 3 : 0,
  workers: process.env['CI'] ? 1 : '50%',
  reporter: process.env['CI']
    ? [['dot'], ['json', { outputFile: 'test-results/report.json' }]]
    : [['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'node /tmp/serve.js',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});

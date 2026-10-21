import { defineConfig } from '@playwright/test';

/**
 * Set PLAYWRIGHT_CHANNEL=chrome (or msedge) to reuse a browser that is already
 * installed locally instead of downloading Playwright's Chromium build.
 */
const channel = process.env.PLAYWRIGHT_CHANNEL as 'chrome' | 'msedge' | undefined;

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    ...(channel ? { channel } : {}),
  },
  webServer: {
    command: 'pnpm start --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
  timeout: 60000,
});

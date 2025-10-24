// Basic Playwright config skeleton
// Run via: npm run e2e:local
// Requires application dev server already running on localhost:5173 (default Vite)

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    headless: true,
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  retries: 0,
  reporter: [['list']]
});

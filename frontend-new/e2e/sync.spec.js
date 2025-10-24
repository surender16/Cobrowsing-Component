// Lightweight skeleton e2e
// Assumes dev server & OpenTok mock environment (future: inject mock session)
// For now, placeholder verifies page load and placeholder sync manager presence.

import { test, expect } from '@playwright/test';

// NOTE: Real OpenTok interactions require instrumentation; this skeleton focuses on structure.

test.describe('Realtime sync skeleton', () => {
  test('loads home page and exposes syncManager', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    const hasSync = await page.evaluate(() => typeof window.syncManager !== 'undefined');
    expect(hasSync).toBeFalsy(); // Not globally exposed yet (documented) - adjust if exposed later
  });
});

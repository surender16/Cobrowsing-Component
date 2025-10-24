import { test, expect } from '@playwright/test';

// Basic e2e to assert scroll & cursor sync operations produce state changes.
// NOTE: This assumes dev server running and pages accessible at /agent and /customer with query params.

async function getScrollPercent(page, containerSelector) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const h = el.scrollHeight - el.clientHeight;
    return h > 0 ? el.scrollTop / h : 0;
  }, containerSelector);
}

test('scroll & cursor sync basic', async ({ browser }) => {
  const agentCtx = await browser.newContext();
  const customerCtx = await browser.newContext();
  const agentPage = await agentCtx.newPage();
  const customerPage = await customerCtx.newPage();

  await agentPage.goto('http://localhost:5173/agent');
  await customerPage.goto('http://localhost:5173/customer');

  // Wait for sync manager init (heuristic: window.syncManager exists)
  await agentPage.waitForFunction(() => window.syncManager && window.syncManager.getState().seq >= 0);
  await customerPage.waitForFunction(() => window.syncManager && window.syncManager.getState().seq >= 0);

  // Perform scroll in agent catalog container (assume .catalog-scroll exists)
  await agentPage.evaluate(() => {
    const el = document.querySelector('.catalog-scroll');
    if (el) el.scrollTop = el.scrollHeight / 2;
  });

  // Allow propagation
  await customerPage.waitForTimeout(400);

  const agentPercent = await getScrollPercent(agentPage, '.catalog-scroll');
  const customerPercent = await getScrollPercent(customerPage, '.catalog-scroll');

  expect(agentPercent).not.toBeNull();
  expect(customerPercent).not.toBeNull();
  // Customer should approximate agent scroll (within 0.05 tolerance)
  expect(Math.abs(agentPercent - customerPercent)).toBeLessThan(0.05);

  // Move cursor on agent
  await agentPage.mouse.move(200, 300);
  await customerPage.waitForTimeout(300);

  // Verify customer sees remote cursor (state-based)
  const cursorState = await customerPage.evaluate(() => {
    const s = window.syncManager.getState();
    return Object.keys(s.cursors).length;
  });
  expect(cursorState).toBeGreaterThan(0);

  await agentCtx.close();
  await customerCtx.close();
});

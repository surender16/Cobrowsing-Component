/* eslint-env jest */
import { syncManager } from '../../src/sync/syncManager';

function createMockSession() {
  const handlers = {};
  return {
    on: (type, cb) => { handlers[type] = handlers[type] || []; handlers[type].push(cb); },
    off: (type, cb) => { if (handlers[type]) handlers[type] = handlers[type].filter(h => h !== cb); },
    signal: ({ type, data }, cb) => {
      if (type === 'sync') {
        (handlers['signal:sync'] || []).forEach(h => h({ type: 'signal:sync', data }));
      }
      cb && cb(null);
    }
  };
}

describe('PAYMENT_STEP metadata sync', () => {
  beforeEach(() => { try { syncManager.shutdown(); } catch(e) {} });
  afterAll(() => { try { syncManager.shutdown(); } catch(e) {} });

  test('agent sets payment step and customer snapshot receives it', () => {
    const session = createMockSession();
    syncManager.init({ otSession: session, localUserId: 'agent-pay', role: 'agent', sessionId: 'sess' });
    // Use dedicated paymentStep API (DETAIL_ACTION does not set paymentStep field)
    syncManager.paymentStep('review');
    const snap = syncManager.getState();
    expect(snap.metadata.paymentStep).toBe('review');
    syncManager.shutdown();
    syncManager.init({ otSession: session, localUserId: 'cust-pay', role: 'customer', sessionId: 'sess' });
    syncManager._handleSnapshot({ sharedState: snap });
    expect(syncManager.getState().metadata.paymentStep).toBe('review');
  });

  test('step updates propagate with snapshot', () => {
    const session = createMockSession();
    syncManager.init({ otSession: session, localUserId: 'agent-pay2', role: 'agent', sessionId: 'sess' });
    syncManager.paymentStep('confirm');
    const snap = syncManager.getState();
    expect(snap.metadata.paymentStep).toBe('confirm');
    syncManager.shutdown();
    syncManager.init({ otSession: session, localUserId: 'cust-pay2', role: 'customer', sessionId: 'sess' });
    syncManager._handleSnapshot({ sharedState: snap });
    expect(syncManager.getState().metadata.paymentStep).toBe('confirm');
  });
});

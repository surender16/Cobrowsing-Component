/* eslint-env jest */
import { syncManager, ACTION_TYPES } from '../../src/sync/syncManager';

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

describe('DETAIL_ACTION propagation', () => {
  beforeEach(() => { try { syncManager.shutdown(); } catch(e) {} });
  afterAll(() => { try { syncManager.shutdown(); } catch(e) {} });

  test('agent detailAction updates metadata and customer receives snapshot delta', () => {
    const session = createMockSession();
    syncManager.init({ otSession: session, localUserId: 'agent-x', role: 'agent', sessionId: 'sess' });
    syncManager.detailAction('packageDetails', { packageDetails: { open: true, packageId: 'PKG1' } });
    const snap = syncManager.getState();
    expect(snap.metadata.detail.packageDetails.open).toBe(true);
    // Simulate customer join & snapshot receive
    syncManager.shutdown();
    syncManager.init({ otSession: session, localUserId: 'cust-y', role: 'customer', sessionId: 'sess' });
    syncManager._handleSnapshot({ sharedState: snap });
    const custState = syncManager.getState();
    expect(custState.metadata.detail.packageDetails.packageId).toBe('PKG1');
  });
});

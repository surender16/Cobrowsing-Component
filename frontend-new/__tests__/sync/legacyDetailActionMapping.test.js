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

describe('legacy detail action mapping', () => {
  beforeEach(() => { try { syncManager.shutdown(); } catch(e) {} });
  afterAll(() => { try { syncManager.shutdown(); } catch(e) {} });

  test('tab-change legacy detailAction propagates metadata.detail', () => {
    const session = createMockSession();
    syncManager.init({ otSession: session, localUserId: 'agent-legacy', role: 'agent', sessionId: 'sess' });
    // detailAction wrapper expects (name, payload)
    syncManager.detailAction('tab-change', { tab: 'overview' });
    const snap = syncManager.getState();
    expect(snap.metadata.detail.name).toBe('tab-change');
    expect(snap.metadata.detail.tab).toBe('overview');
    syncManager.shutdown();
    syncManager.init({ otSession: session, localUserId: 'cust-legacy', role: 'customer', sessionId: 'sess' });
    syncManager._handleSnapshot({ sharedState: snap });
    const cust = syncManager.getState();
    expect(cust.metadata.detail.name).toBe('tab-change');
    expect(cust.metadata.detail.tab).toBe('overview');
  });
});

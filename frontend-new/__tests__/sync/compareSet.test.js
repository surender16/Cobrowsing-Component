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

describe('compareSet synchronization', () => {
  beforeEach(() => { try { syncManager.shutdown(); } catch(e) {} });
  afterAll(() => { try { syncManager.shutdown(); } catch(e) {} });

  test('agent toggles compare items and customer applies deltas sequentially', () => {
    const session = createMockSession();
    syncManager.init({ otSession: session, localUserId: 'agent-compare', role: 'agent', sessionId: 'sess' });
    syncManager.toggleCompare('A1', true);
    syncManager.toggleCompare('B2', true);
    const agentState = syncManager.getState();
    expect(agentState.selection.compareSet).toEqual(['A1','B2']);
    const snapshot = agentState;
    syncManager.shutdown();
    syncManager.init({ otSession: session, localUserId: 'cust-compare', role: 'customer', sessionId: 'sess' });
    syncManager._handleSnapshot({ sharedState: snapshot });
    const custState = syncManager.getState();
    expect(custState.selection.compareSet).toEqual(['A1','B2']);
  });
});

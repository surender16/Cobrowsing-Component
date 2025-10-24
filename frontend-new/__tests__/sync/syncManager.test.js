/* eslint-env jest */
import { syncManager, ACTION_TYPES } from '../../src/sync/syncManager';

// Create a lightweight mock OpenTok session
function createMockSession() {
  const handlers = {};
  return {
    on: (type, cb) => { handlers[type] = handlers[type] || []; handlers[type].push(cb); },
    off: (type, cb) => { if (handlers[type]) handlers[type] = handlers[type].filter(h => h !== cb); },
    signal: ({ type, data }, cb) => {
      // Immediately loop back for customer remote application when needed
      if (type === 'sync') {
        // Simulate network deliver to all handlers registered on 'signal:sync'
        (handlers['signal:sync'] || []).forEach(h => h({ type: 'signal:sync', data }));
      }
      if (cb) cb(null);
    },
    _trigger: (type, payload) => { (handlers[type] || []).forEach(h => h(payload)); }
  };
}

beforeEach(() => {
  // Reset manager by shutting down and re-instantiating (module pattern keeps singleton)
  try { syncManager.shutdown(); } catch(e) {}
});

afterAll(() => {
  try { syncManager.shutdown(); } catch(e) {}
});

describe('syncManager sequencing & snapshot', () => {
  test('agent navigation increments seq and broadcasts delta', () => {
    const session = createMockSession();
    syncManager.init({ otSession: session, localUserId: 'agent-1', role: 'agent', sessionId: 'sess' });
    const initialSeq = syncManager.getState().seq;
    syncManager.applyLocalAction({ type: ACTION_TYPES.NAVIGATE, data: { view: 'compare' } });
    const st = syncManager.getState();
    expect(st.view).toBe('compare');
    expect(st.seq).toBe(initialSeq + 1);
  });

  test('customer receives delta and updates seq', () => {
    const session = createMockSession();
    // Init as agent, perform action
    syncManager.init({ otSession: session, localUserId: 'agent-A', role: 'agent', sessionId: 'sess' });
    syncManager.applyLocalAction({ type: ACTION_TYPES.NAVIGATE, data: { view: 'detail' } });
    const snapshot = syncManager.getState();
    // Re-init same singleton as customer (simulate different role switch for test)
    syncManager.shutdown();
    syncManager.init({ otSession: session, localUserId: 'cust-1', role: 'customer', sessionId: 'sess' });
    syncManager._handleSnapshot({ sharedState: snapshot });
    expect(syncManager.getState().seq).toBe(snapshot.seq);
    expect(syncManager.getState().view).toBe('detail');
  });

  test('seq gap triggers snapshot request', () => {
    const session = createMockSession();
    // Init as customer first (no seq yet)
    syncManager.init({ otSession: session, localUserId: 'cust-gap', role: 'customer', sessionId: 'sess' });
    const envelope = { type: 'SYNC', op: 'DELTA', seq: 5, payload: { delta: { view: 'compare' } }, clientId: 'agent-XYZ' };
    syncManager._handleSignal({ data: JSON.stringify(envelope) });
    expect(syncManager.getState().view).not.toBe('compare');
  });
});

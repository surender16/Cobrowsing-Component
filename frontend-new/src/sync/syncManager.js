// Unified synchronization manager over OpenTok signals
// Implements authoritative agent state, sequencing, ack/retry, snapshot, scroll & cursor sync.
// Plain JavaScript module.
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

// Config values (can be overridden via window.SYNC_CONFIG or env injection)
const DEFAULT_CONFIG = {
  ackTimeoutMs: 1500,
  maxRetries: 3,
  heartbeatIntervalMs: 8000,
  snapshotIntervalMs: 30000, // periodic snapshot broadcast (agent only)
  cursorFps: 30,
  scrollThrottleMs: 100, // ~10/sec
  historySize: 200,
  telemetry: true
};

// Allowed view names (extend as needed)
const ALLOWED_VIEWS = new Set(['catalog', 'detail', 'compare', 'payment']);

// Action op constants
export const ACTION_TYPES = {
  NAVIGATE: 'NAVIGATE',
  SNAPSHOT: 'SNAPSHOT',
  DELTA: 'DELTA',
  CURSOR: 'CURSOR',
  SCROLL: 'SCROLL',
  SELECT: 'SELECT',
  UNSELECT: 'UNSELECT',
  SHARE_PACKAGES: 'SHARE_PACKAGES',
  COMPARE_SELECT: 'COMPARE_SELECT',
  DETAIL_ACTION: 'DETAIL_ACTION',
  PAYMENT_STEP: 'PAYMENT_STEP'
};

// Legacy mapping for existing signal action names -> unified action semantics
const LEGACY_DETAIL_ACTIONS = new Set([
  'tab-change','image-select','day-select','fullscreen-toggle','slideshow-toggle','image-navigate','zoom-change','scroll-sync','comparison-action','payment-action','payment-field-change','modal-open','modal-close','activities-modal-open','activities-modal-close'
]);

// Internal state singleton instance reference
let instance = null;

function nowTs() { return Date.now(); }

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// Utility throttle (timestamp based) for scroll events
function createThrottle(delayMs, fn) {
  let last = 0;
  let scheduledArgs = null;
  let rafId = null;
  const invoke = (args) => { fn(...args); };
  return function throttled(...args) {
    const t = nowTs();
    if (t - last >= delayMs) {
      last = t;
      invoke(args);
    } else {
      scheduledArgs = args;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (scheduledArgs) {
            last = nowTs();
            invoke(scheduledArgs);
            scheduledArgs = null;
          }
        });
      }
    }
  };
}

class SyncManager {
  constructor() {
    if (instance) return instance;

  const globalCfg = (typeof window !== 'undefined' && window.SYNC_CONFIG) ? window.SYNC_CONFIG : {};
  this.config = { ...DEFAULT_CONFIG, ...globalCfg };
    this.role = null; // 'agent' | 'customer'
    this.localUserId = null;
    this.session = null;
    this.state = this._createEmptyState();
    this.lastSeq = 0; // last applied authoritative sequence
    this.agentSeq = 0; // only used by agent
    this.pendingAcks = new Map(); // seq -> {delta, attempts, timeoutId}
    this.history = []; // recent deltas
    this.subscribers = new Set();
    this.cursorRafPending = false;
    this.lastCursorSentTs = 0;
    this.heartbeatId = null;
    this.snapshotTimerId = null;
    this.connectionListenersRegistered = false;
    this.destroyed = false;
    this.scrollThrottle = createThrottle(this.config.scrollThrottleMs, (containerId, percentY, percentX) => {
      this._sendOp(ACTION_TYPES.SCROLL, { containerId, percentY, percentX });
    });
    instance = this;
  }

  _createEmptyState() {
    return {
      sessionId: null,
      seq: 0,
      lastUpdatedBy: null,
      view: 'catalog',
      viewParams: {},
      sharedPackages: [],
      selection: { userSelections: { agent: [], customer: [] }, compareSet: [] },
      scrollPositions: {}, // containerId -> percent (0-1)
      cursors: {}, // userId -> {xPercent, yPercent, lastSeenSeq, ts}
      metadata: {}
    };
  }

  init({ otSession, localUserId, role, sessionId }) {
    if (this.destroyed) {
      // allow revival for tests / re-init
      this.destroyed = false;
    }
    this.session = otSession || openTokSessionSingleton.getSession();
    this.localUserId = localUserId;
    this.role = role;
    if (sessionId) this.state.sessionId = sessionId;
    if (!this.session) {
      console.warn('[sync] init without session yet; will wait for availability');
    } else {
      this._registerSignalHandler();
      this._registerConnectionHandlers();
    }
    if (this.role === 'agent') {
      // agent periodically broadcasts snapshot for resilience
      this._startSnapshotTimer();
    }
    this._startHeartbeat();
    // Late join logic: request snapshot if not agent
    if (this.role !== 'agent') {
      setTimeout(() => this.requestSnapshot('join'), 500);
    }
    return this;
  }

  shutdown() {
    this.destroyed = true; // mark but reversible on next init
    this._clearRetryTimers();
    this._stopHeartbeat();
    this._stopSnapshotTimer();
    if (this.session) {
      this.session.off('signal:sync', this._boundSignalHandler);
    }
    this.subscribers.clear();
  }

  onStateChange(cb) { this.subscribers.add(cb); return () => this.subscribers.delete(cb); }

  getState() { return deepClone(this.state); }

  applyLocalAction(action) {
    // action: { type, data }
    const { type, data } = action;
    // Validate agent-only modifications
    const agentOnly = new Set([ACTION_TYPES.NAVIGATE, ACTION_TYPES.SHARE_PACKAGES, ACTION_TYPES.PAYMENT_STEP]);
    if (agentOnly.has(type) && this.role !== 'agent') {
      console.warn('[sync] Rejecting non-agent attempt for agent-only action', type);
      return false;
    }
    switch (type) {
      case ACTION_TYPES.NAVIGATE:
        if (!ALLOWED_VIEWS.has(data.view)) return false;
        this._applyDelta({ view: data.view, viewParams: data.viewParams || {} }, true);
        break;
      case ACTION_TYPES.COMPARE_SELECT:
        this._updateCompareSet(data); // data: { packageId, selected }
        break;
      case ACTION_TYPES.SELECT:
      case ACTION_TYPES.UNSELECT:
        this._updateUserSelection(data); // data: { packageId, selected }
        break;
      case ACTION_TYPES.SCROLL:
        this._applyScrollLocal(data); // {containerId, element, y, x}
        return true; // scroll handled with throttle send
      case ACTION_TYPES.CURSOR:
        this._queueCursorSend(data); // {x, y, element}
        return true;
      case ACTION_TYPES.DETAIL_ACTION:
        this._applyDetailAction(data);
        break;
      case ACTION_TYPES.PAYMENT_STEP:
        this._applyDelta({ metadata: { ...this.state.metadata, paymentStep: data.step } }, true);
        break;
      case ACTION_TYPES.SHARE_PACKAGES:
        this._applyDelta({ sharedPackages: data.packages || [] }, true);
        break;
      default:
        // Support legacy detail actions (from PackageDetailsCoBrowseManager)
        if (LEGACY_DETAIL_ACTIONS.has(type)) {
          this._applyDetailAction({ legacyType: type, ...data });
          return true;
        }
        console.warn('[sync] Unknown local action type', type);
        return false;
    }
    return true;
  }

  // Convenience wrappers replacing legacy managers
  navigate(view, viewParams) {
    return this.applyLocalAction({ type: ACTION_TYPES.NAVIGATE, data: { view, viewParams } });
  }
  selectPackage(packageId) {
    return this.applyLocalAction({ type: ACTION_TYPES.SELECT, data: { packageId, selected: true } });
  }
  unselectPackage(packageId) {
    return this.applyLocalAction({ type: ACTION_TYPES.UNSELECT, data: { packageId, selected: false } });
  }
  toggleCompare(packageId, selected) {
    return this.applyLocalAction({ type: ACTION_TYPES.COMPARE_SELECT, data: { packageId, selected } });
  }
  sharePackages(packages) {
    return this.applyLocalAction({ type: ACTION_TYPES.SHARE_PACKAGES, data: { packages } });
  }
  detailAction(name, payload) {
    return this.applyLocalAction({ type: ACTION_TYPES.DETAIL_ACTION, data: { name, ...payload } });
  }
  paymentStep(step) {
    return this.applyLocalAction({ type: ACTION_TYPES.PAYMENT_STEP, data: { step } });
  }
  scroll(containerId, element, y, x) {
    return this.applyLocalAction({ type: ACTION_TYPES.SCROLL, data: { containerId, element, y, x } });
  }
  cursor(element, x, y) {
    return this.applyLocalAction({ type: ACTION_TYPES.CURSOR, data: { element, x, y } });
  }

  requestSnapshot(reason = 'manual') {
    this._sendEnvelope('REQ_SNAPSHOT', null, { reason });
  }

  // Internal delta application. If isAuthoritativeLocal (agent) we assign seq and broadcast DELTA.
  _applyDelta(delta, broadcast) {
    // Create new state
    const newState = deepClone(this.state);
    Object.keys(delta).forEach(k => {
      if (k === 'metadata') {
        newState.metadata = { ...newState.metadata, ...delta.metadata };
      } else if (k === 'selection') {
        // merge selection object
        newState.selection = { ...newState.selection, ...delta.selection };
      } else if (k === 'scrollPositions') {
        newState.scrollPositions = { ...newState.scrollPositions, ...delta.scrollPositions };
      } else if (k === 'cursors') {
        newState.cursors = { ...newState.cursors, ...delta.cursors };
      } else {
        newState[k] = delta[k];
      }
    });
    if (this.role === 'agent') {
      this.agentSeq += 1;
      newState.seq = this.agentSeq;
      newState.lastUpdatedBy = 'agent';
      this.state = newState;
      this.lastSeq = newState.seq;
      this._notify();
      if (broadcast) {
        this._broadcastDelta(delta, newState.seq);
      }
    } else {
      // Optimistic local update for customer (not authoritative) - do not change seq
      this.state = newState;
      this._notify();
    }
  }

  _broadcastDelta(delta, seq) {
    const payload = { delta };
    this._sendEnvelope('DELTA', payload, null, seq, true);
    // Track ack
    this._trackPending(seq, payload);
  }

  _trackPending(seq, payload) {
    this._clearPending(seq);
    const entry = { payload, attempts: 0, timeoutId: null };
    const schedule = () => {
      entry.attempts += 1;
      if (entry.attempts > this.config.maxRetries) {
        this._logTelemetry('delta_drop', { seq });
        this._clearPending(seq);
        return;
      }
      entry.timeoutId = setTimeout(() => {
        this._logTelemetry('delta_retry', { seq, attempt: entry.attempts });
        this._sendEnvelope('DELTA', payload, null, seq, true); // resend
        schedule();
      }, this.config.ackTimeoutMs * Math.pow(2, entry.attempts - 1));
    };
    this.pendingAcks.set(seq, entry);
    schedule();
  }

  _clearPending(seq) {
    const pending = this.pendingAcks.get(seq);
    if (pending) {
      if (pending.timeoutId) clearTimeout(pending.timeoutId);
      this.pendingAcks.delete(seq);
    }
  }

  _clearRetryTimers() {
    this.pendingAcks.forEach(p => { if (p.timeoutId) clearTimeout(p.timeoutId); });
    this.pendingAcks.clear();
  }

  _registerSignalHandler() {
    if (!this.session) return;
    this._boundSignalHandler = (event) => this._handleSignal(event);
    this.session.on('signal:sync', this._boundSignalHandler);
  }

  _registerConnectionHandlers() {
    if (!this.session || this.connectionListenersRegistered) return;
    this.connectionListenersRegistered = true;
    this.session.on('connectionDestroyed', () => {
      if (this.role === 'agent') {
        // customer left; nothing special
      }
    });
    this.session.on('sessionDisconnected', () => {
      this._logTelemetry('session_disconnected');
    });
    this.session.on('connectionCreated', () => {
      if (this.role === 'agent') {
        // new participant joined, proactively send snapshot
        this._sendSnapshot('auto_on_join');
      }
    });
  }

  _handleSignal(event) {
    try {
      const data = JSON.parse(event.data);
      if (data.type !== 'SYNC') return; // ignore other general signals
      const { op, seq, payload, clientId } = data; // clientId may be used for future validation
      if (clientId === this.localUserId) return; // ignore self
      switch (op) {
        case 'DELTA':
          this._handleRemoteDelta(seq, payload, clientId);
          break;
        case 'SNAPSHOT':
          this._handleSnapshot(payload);
          break;
        case 'REQ_SNAPSHOT':
          if (this.role === 'agent') this._sendSnapshot('requested');
          break;
        case 'ACK':
          this._clearPending(seq);
          break;
        case 'HEARTBEAT':
          // presence refresh for cursors maybe
          break;
        case 'CURSOR':
          this._handleRemoteCursor(payload, seq, clientId);
          break;
        case 'SCROLL':
          this._handleRemoteScroll(payload, seq, clientId);
          break;
        default:
          this._logTelemetry('unknown_op', { op });
      }
    } catch (e) {
      console.error('[sync] Failed to parse signal', e);
    }
  }

  _handleRemoteDelta(seq, payload, _clientId) {
    if (this.role === 'agent') {
      // agent does not accept remote deltas modifying authoritative fields
      return;
    }
    if (seq <= this.lastSeq) {
      this._logTelemetry('delta_replay_ignored', { seq });
      return; // replay or duplicate
    }
    if (seq !== this.lastSeq + 1) {
      // gap detected
      this._logTelemetry('seq_gap', { expected: this.lastSeq + 1, got: seq });
      this.requestSnapshot('seq_gap');
      return;
    }
    // Apply delta
    const { delta } = payload;
    const newState = deepClone(this.state);
    Object.keys(delta).forEach(k => {
      if (k === 'metadata') newState.metadata = { ...newState.metadata, ...delta.metadata };
      else if (k === 'selection') newState.selection = { ...newState.selection, ...delta.selection };
      else if (k === 'scrollPositions') newState.scrollPositions = { ...newState.scrollPositions, ...delta.scrollPositions };
      else if (k === 'cursors') newState.cursors = { ...newState.cursors, ...delta.cursors };
      else newState[k] = delta[k];
    });
    newState.seq = seq;
    newState.lastUpdatedBy = 'agent';
    this.state = newState;
    this.lastSeq = seq;
    this._notify();
    // ACK back to agent
    this._sendEnvelope('ACK', null, null, seq);
  }

  _handleSnapshot(payload) {
    const { sharedState } = payload;
    if (!sharedState) return;
    this.state = sharedState; // trust authoritative snapshot
    this.lastSeq = sharedState.seq;
    this.agentSeq = sharedState.seq; // if we are agent, align
    this._notify();
  }

  _handleRemoteCursor(payload, _seq, _clientId) {
    const { xPercent, yPercent, userId } = payload; // unused parameters underscored
    if (userId === this.localUserId) return;
    this.state.cursors[userId] = { xPercent, yPercent, lastSeenSeq: this.lastSeq, ts: nowTs() };
    this._notify();
  }

  _handleRemoteScroll(payload) {
    const { containerId, percentY, percentX } = payload; // remote scroll
    this.state.scrollPositions[containerId] = { percentY, percentX, ts: nowTs() };
    this._notify();
  }

  _sendSnapshot(reason = 'periodic') {
    const snapshot = deepClone(this.state);
    this._sendEnvelope('SNAPSHOT', { sharedState: snapshot, reason }, null, snapshot.seq);
  }

  _sendOp(opType, payload) {
    const seqForNonDelta = this.role === 'agent' ? this.agentSeq : this.lastSeq;
    this._sendEnvelope(opType, payload, null, seqForNonDelta);
  }

  _sendEnvelope(op, payload, to = null, seqOverride = null, recordHistory = false) {
    if (!this.session) return;
    const seq = seqOverride != null ? seqOverride : this.lastSeq;
    const envelope = {
      type: 'SYNC',
      op,
      sessionId: this.state.sessionId,
      seq,
      payload,
      timestamp: nowTs(),
      clientId: this.localUserId
    };
    const dataStr = JSON.stringify(envelope);
    if (dataStr.length > 8192) {
      console.warn('[sync] Envelope too large', op, dataStr.length);
    }
    this.session.signal({ type: 'sync', data: dataStr, to }, (err) => {
      if (err) console.error('[sync] signal error', err);
    });
    if (recordHistory && op === 'DELTA') {
      this.history.push(envelope);
      if (this.history.length > this.config.historySize) this.history.shift();
    }
  }

  _notify() {
    this.subscribers.forEach(cb => {
      try { cb(this.getState()); } catch (e) { console.error('[sync] subscriber error', e); }
    });
  }

  _updateCompareSet({ packageId, selected, batch }) {
    let compareSet;
    if (batch && Array.isArray(packageId)) {
      // Batch update: replace compareSet with provided IDs
      compareSet = new Set(packageId);
    } else {
      compareSet = new Set(this.state.selection.compareSet);
      if (selected) compareSet.add(packageId); else compareSet.delete(packageId);
    }
    this._applyDelta({ selection: { compareSet: Array.from(compareSet) } }, true);
  }

  _updateUserSelection({ packageId, selected }) {
    const userKey = this.role === 'agent' ? 'agent' : 'customer';
    const current = new Set(this.state.selection.userSelections[userKey]);
    if (selected) current.add(packageId); else current.delete(packageId);
    const newUserSelections = { ...this.state.selection.userSelections, [userKey]: Array.from(current) };
    this._applyDelta({ selection: { userSelections: newUserSelections } }, this.role === 'agent');
  }

  _applyDetailAction(data) {
    // Generic detail view metadata merge
    const meta = { ...this.state.metadata, detail: { ...(this.state.metadata.detail || {}), ...data } };
    this._applyDelta({ metadata: meta }, this.role === 'agent');
  }

  _applyScrollLocal({ containerId, element, y, x }) {
    if (!element) return;
    const height = element.scrollHeight - element.clientHeight;
    const width = element.scrollWidth - element.clientWidth;
    const percentY = height > 0 ? (y / height) : 0;
    const percentX = width > 0 ? (x / width) : 0;
    this.state.scrollPositions[containerId] = { percentY, percentX, ts: nowTs() };
    this._notify();
    // Only agent broadcasts authoritative scroll
    if (this.role === 'agent') {
      this.scrollThrottle(containerId, percentY, percentX);
    }
  }

  _queueCursorSend({ x, y, element }) {
    if (this.role !== 'agent') return; // only agent cursor broadcast
    const sendInterval = 1000 / this.config.cursorFps;
    const now = nowTs();
    if (now - this.lastCursorSentTs < sendInterval) {
      if (!this.cursorRafPending) {
        this.cursorRafPending = true;
        requestAnimationFrame(() => {
          this.cursorRafPending = false;
          this._queueCursorSend({ x, y, element });
        });
      }
      return;
    }
    this.lastCursorSentTs = now;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const xPercent = rect.width > 0 ? (x - rect.left) / rect.width : 0;
    const yPercent = rect.height > 0 ? (y - rect.top) / rect.height : 0;
    this.state.cursors[this.localUserId] = { xPercent, yPercent, lastSeenSeq: this.lastSeq, ts: nowTs() };
    this._notify();
    this._sendOp('CURSOR', { xPercent, yPercent, userId: this.localUserId });
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this.heartbeatId = setInterval(() => {
      this._sendEnvelope('HEARTBEAT', { cursors: this.state.cursors }, null, this.lastSeq);
      this._pruneCursorPresence();
    }, this.config.heartbeatIntervalMs);
  }

  _stopHeartbeat() { if (this.heartbeatId) { clearInterval(this.heartbeatId); this.heartbeatId = null; } }

  _startSnapshotTimer() {
    this._stopSnapshotTimer();
    if (this.role !== 'agent') return;
    this.snapshotTimerId = setInterval(() => this._sendSnapshot('periodic'), this.config.snapshotIntervalMs);
  }

  _stopSnapshotTimer() { if (this.snapshotTimerId) { clearInterval(this.snapshotTimerId); this.snapshotTimerId = null; } }

  _pruneCursorPresence() {
    const cutoff = nowTs() - 5000; // 5s TTL
    Object.keys(this.state.cursors).forEach(uid => {
      if (this.state.cursors[uid].ts < cutoff) delete this.state.cursors[uid];
    });
    this._notify();
  }

  _logTelemetry(event, data = {}) {
    if (!this.config.telemetry) return;
    console.log('[sync-telemetry]', event, data);
  }
}

export const syncManager = new SyncManager();

// Convenience hook (requires React). Provided as optional integration helper.
// Imported lazily to avoid hard dep if used outside React context.
export function createSyncSelector(selector) {
  return function useSelectedSyncState() {
    // dynamic import of react to avoid bundler issues if not used
    const React = (typeof window !== 'undefined' && window.React)
      ? window.React
      : (typeof globalThis !== 'undefined' && globalThis.require ? globalThis.require('react') : null);
    const { useEffect, useState } = React;
    const [selected, setSelected] = useState(selector(syncManager.getState()));
    useEffect(() => {
      const unsub = syncManager.onStateChange(state => setSelected(selector(state)));
      return unsub;
    }, []);
    return selected;
  };
}

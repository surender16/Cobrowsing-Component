import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

/**
 * Unified, production-grade scroll sync hook using OpenTok signals.
 * - Percent-based mapping for robustness across content size differences
 * - Bi-directional with leader election + hysteresis to prevent ping-pong
 * - Throttled outbound (default 100ms), immediate inbound with rAF
 * - Readiness via ResizeObserver + MutationObserver; queues last remote
 * - Backpressure/coalescing: applies only latest remote
 * - Self-echo prevention via sourceId + lastAppliedFromRemote timestamp
 *
 * @param {Object} params
 * @param {string} params.containerId Stable ID for this scroll container (e.g., 'package-details')
 * @param {'agent'|'customer'} params.userType
 * @param {boolean} params.enabled Whether sync is enabled
 * @param {number} [params.throttleMs=100] Outbound throttle (ms)
 * @returns {Object} { scrollRef, attach, isLeader, setLeader, setContainerReady }
 */
// Unified API: supports both object and positional signatures for backward compatibility
// Preferred: useUnifiedScrollSync({ containerId, userType, enabled, throttleMs })
// Legacy: useUnifiedScrollSync(userType, enabled, containerId)
export function useUnifiedScrollSync(arg1, enabledArg, containerIdArg) {
  // Normalize params
  const params = typeof arg1 === 'object' && arg1 !== null
    ? arg1
    : { userType: arg1, enabled: enabledArg, containerId: containerIdArg };

  const {
    containerId,
    userType,
    enabled = true,
    throttleMs = 100,
  } = params;
  const scrollRef = useRef(null);
  const containerReadyRef = useRef(false);
  const resizeObserverRef = useRef(null);
  const mutationObserverRef = useRef(null);
  const lastSizeStableTsRef = useRef(0);
  const sizeStableTimerRef = useRef(null);
  const isLeaderRef = useRef(false);
  const lastLocalActivityTsRef = useRef(0);
  const lastAppliedRemoteTsRef = useRef(0);
  const lastRemotePayloadRef = useRef(null);
  const throttleTimerRef = useRef(null);
  const rafApplyRef = useRef(0);
  const localSourceId = useMemo(() => `${userType}-${Math.random().toString(36).slice(2)}`, [userType]);
  const [isLeader, setIsLeader] = useState(false);

  const markSizeStableSoon = useCallback(() => {
    if (sizeStableTimerRef.current) clearTimeout(sizeStableTimerRef.current);
    sizeStableTimerRef.current = setTimeout(() => {
      lastSizeStableTsRef.current = Date.now();
      containerReadyRef.current = true;
    }, 150);
  }, []);

  const computePercents = useCallback((el) => {
    if (!el) return { percentY: 0, percentX: 0, pxY: 0, pxX: 0 };
    const maxY = Math.max(1, el.scrollHeight - el.clientHeight);
    const maxX = Math.max(1, el.scrollWidth - el.clientWidth);
    return {
      percentY: el.scrollTop / maxY,
      percentX: el.scrollLeft / maxX,
      pxY: el.scrollTop,
      pxX: el.scrollLeft,
    };
  }, []);

  const applyRemote = useCallback((payload) => {
    const el = scrollRef.current;
    if (!el) return;
    // Backpressure/coalesce: keep only latest
    lastRemotePayloadRef.current = payload;
    if (rafApplyRef.current) return; // already scheduled
    rafApplyRef.current = requestAnimationFrame(() => {
      rafApplyRef.current = 0;
      const latest = lastRemotePayloadRef.current;
      if (!latest) return;
      // Readiness guard
      if (!containerReadyRef.current) return;
      // Leader election: if we recently had local activity, delay accepting remote
      const now = Date.now();
      const noLocalFor = now - lastLocalActivityTsRef.current;
      if (noLocalFor < 300) return; // hysteresis window

      const elMaxY = Math.max(1, el.scrollHeight - el.clientHeight);
      const elMaxX = Math.max(1, el.scrollWidth - el.clientWidth);
      const targetY = Math.min(elMaxY, Math.max(0, Math.round(latest.percentY * elMaxY)));
      const targetX = Math.min(elMaxX, Math.max(0, Math.round(latest.percentX * elMaxX)));

      const dist = Math.abs(el.scrollTop - targetY);
      const smooth = dist < 200; // small adjustments are smooth

      // Prevent echo loop: mark last applied from remote
      lastAppliedRemoteTsRef.current = now;

      el.scrollTo({ top: targetY, left: targetX, behavior: smooth ? 'smooth' : 'auto' });
    });
  }, []);

  const sendScroll = useCallback(() => {
    if (!enabled) return;
    const el = scrollRef.current;
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (!el || !session) return;
    const { percentY, percentX, pxY, pxX } = computePercents(el);
    const payload = {
      containerId,
      percentY: Number.isFinite(percentY) ? Number(percentY.toFixed(4)) : 0,
      percentX: Number.isFinite(percentX) ? Number(percentX.toFixed(4)) : 0,
      pxY,
      pxX,
      userType,
      sourceId: localSourceId,
      ts: Date.now(),
    };
    let attempts = 0;
    const maxRetries = 3;
    const trySend = () => {
      attempts += 1;
      console.info('[scroll-sync][send]', containerId, payload);
      openTokSessionSingleton.sendSignal({ type: 'scroll-sync', data: JSON.stringify(payload) }, (err) => {
        if (err && attempts < maxRetries) {
          console.warn('[scroll-sync][error] send failed, retrying', err);
          setTimeout(trySend, attempts * 250);
        } else if (err) {
          console.error('[scroll-sync][error] send failed after retries', err);
        }
      });
    };
    trySend();
  }, [computePercents, containerId, enabled, localSourceId, userType]);

  const handleLocalScroll = useCallback(() => {
    // Ignore echoes for a short window after applying remote
    if (Date.now() - lastAppliedRemoteTsRef.current < 80) return;
    lastLocalActivityTsRef.current = Date.now();
    if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
    throttleTimerRef.current = setTimeout(sendScroll, throttleMs);
    if (!isLeaderRef.current) {
      isLeaderRef.current = true;
      setIsLeader(true);
      console.info('[scroll-sync][leader] local became leader', containerId);
    }
  }, [containerId, sendScroll, throttleMs]);

  const attach = useCallback((el) => {
    if (!el) return;
    scrollRef.current = el;
  }, []);

  const setContainerReady = useCallback((ready) => {
    containerReadyRef.current = !!ready;
  }, []);

  // Init observers for readiness
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onSizeChange = () => {
      containerReadyRef.current = false;
      markSizeStableSoon();
    };
    try {
      resizeObserverRef.current = new ResizeObserver(onSizeChange);
      resizeObserverRef.current.observe(el);
    } catch {}
    try {
      mutationObserverRef.current = new MutationObserver(onSizeChange);
      mutationObserverRef.current.observe(el, { childList: true, subtree: true, attributes: true });
    } catch {}
    // Initial mark ready once mounted
    markSizeStableSoon();
    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      if (mutationObserverRef.current) mutationObserverRef.current.disconnect();
      if (sizeStableTimerRef.current) clearTimeout(sizeStableTimerRef.current);
    };
  }, [markSizeStableSoon]);

  // Bind local scroll events
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) return;
    const onScroll = () => handleLocalScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [enabled, handleLocalScroll]);

  // OpenTok receiver
  useEffect(() => {
    if (!enabled) return;
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (!session) return;
    const onRecv = (event) => {
      try {
        const data = JSON.parse(event.data || '{}');
        if (data.sourceId === localSourceId) return; // self-echo
        if (data.containerId !== containerId) return;
        if (data.userType === userType) return; // ignore same side
        console.info('[scroll-sync][recv]', containerId, data);
        // Leader hysteresis: if we are actively local, delay acceptance (handled in applyRemote)
        // Mark that remote is leader after quiet period
        const now = Date.now();
        if (now - lastLocalActivityTsRef.current > 300 && !isLeaderRef.current) {
          // already follower
        } else if (now - lastLocalActivityTsRef.current > 300 && isLeaderRef.current) {
          isLeaderRef.current = false;
          setIsLeader(false);
          console.info('[scroll-sync][leader] remote became leader', containerId);
        }
        applyRemote(data);
      } catch (e) {
        console.error('[scroll-sync][error] parse', e);
      }
    };
    session.on('signal:scroll-sync', onRecv);
    return () => {
      try { session.off('signal:scroll-sync', onRecv); } catch {}
    };
  }, [applyRemote, containerId, enabled, localSourceId, userType]);

  // Cleanup timers
  useEffect(() => () => {
    if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
    if (rafApplyRef.current) cancelAnimationFrame(rafApplyRef.current);
  }, []);

  return {
    scrollRef,
    attach,
    isLeader,
    setLeader: (v) => { isLeaderRef.current = !!v; setIsLeader(!!v); },
    setContainerReady,
  };
}


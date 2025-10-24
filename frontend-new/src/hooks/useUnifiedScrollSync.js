import { useEffect, useRef, useCallback, useState } from 'react';
import { syncManager } from '../sync/syncManager';

// Unified scroll sync hook using syncManager SCROLL op (agent authoritative)
// Usage: const { ref, isActiveController } = useUnifiedScrollSync(userType, enabled, containerId)
export function useUnifiedScrollSync(userType = 'agent', enabled = true, containerId = 'catalog') {
  const ref = useRef(null);
  const [isActiveController, setIsActiveController] = useState(false);

  // Local scroll handler dispatches through syncManager (agent only broadcasts)
  const onScroll = useCallback(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    // Heuristic: agent becomes controller on first scroll interaction
    if (userType === 'agent') setIsActiveController(true);
    syncManager.scroll(containerId, el, el.scrollTop, el.scrollLeft);
  }, [enabled, containerId, userType]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [onScroll, enabled]);

  // Subscribe to remote scroll updates from syncManager state
  useEffect(() => {
    if (!enabled) return;
    const unsub = syncManager.onStateChange(state => {
      const pos = state.scrollPositions[containerId];
      if (!pos || userType === 'agent') return; // customer applies agent scroll
      const el = ref.current;
      if (!el) return;
      const targetTop = pos.percentY * (el.scrollHeight - el.clientHeight);
      const targetLeft = pos.percentX * (el.scrollWidth - el.clientWidth);
      // Smooth apply
      el.scrollTo({ top: targetTop, left: targetLeft, behavior: 'smooth' });
    });
    return unsub;
  }, [enabled, containerId, userType]);

  return { scrollRef: ref, isActiveController };
}

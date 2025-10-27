import { useEffect, useRef, useCallback, useState } from 'react';
import { syncManager } from '../sync/syncManager';

// Enhanced unified scroll sync hook using syncManager SCROLL op (agent authoritative)
// Usage: const { ref, isActiveController } = useUnifiedScrollSync(userType, enabled, containerId)
export function useUnifiedScrollSync(userType = 'agent', enabled = true, containerId = 'catalog') {
  const ref = useRef(null);
  const [isActiveController, setIsActiveController] = useState(false);
  const scrollTimeout = useRef(null);
  const lastScrollTime = useRef(0);
  const isScrolling = useRef(false);

  // Enhanced scroll handler with improved throttling and smooth animation
  const onScroll = useCallback(() => {
    if (!enabled || !ref.current) return;

    const now = Date.now();
    const minScrollInterval = 50; // 20fps max scroll updates

    // Only process scroll if enough time has passed
    if (now - lastScrollTime.current >= minScrollInterval) {
      const el = ref.current;

      // Heuristic: agent becomes controller on first scroll interaction
      if (userType === 'agent') setIsActiveController(true);

      // Calculate scroll percentages for better accuracy
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const scrollWidth = el.scrollWidth - el.clientWidth;
      const percentY = scrollHeight > 0 ? el.scrollTop / scrollHeight : 0;
      const percentX = scrollWidth > 0 ? el.scrollLeft / scrollWidth : 0;

      // Update sync manager with normalized values
      syncManager.scroll(containerId, el, percentY, percentX);
      lastScrollTime.current = now;

      // Reset scroll state after delay
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      isScrolling.current = true;
      
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150); // Adjust based on scroll animation duration
    }
  }, [enabled, containerId, userType]);

  // Improved scroll event listener setup
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const options = { passive: true };
    el.addEventListener('scroll', onScroll, options);
    
    // Cleanup function
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      el.removeEventListener('scroll', onScroll);
    };
  }, [onScroll, enabled]);

  // Enhanced remote scroll update handler
  useEffect(() => {
    if (!enabled) return;

    const unsub = syncManager.onStateChange(state => {
      const pos = state.scrollPositions[containerId];
      if (!pos || userType === 'agent' || !ref.current || isScrolling.current) return;

      const el = ref.current;
      const targetTop = pos.percentY * (el.scrollHeight - el.clientHeight);
      const targetLeft = pos.percentX * (el.scrollWidth - el.clientWidth);

      // Smooth scroll with easing
      el.scrollTo({
        top: targetTop,
        left: targetLeft,
        behavior: 'smooth'
      });
    });

    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      unsub();
    };
  }, [enabled, containerId, userType]);

  // Reset controller status when disabled
  useEffect(() => {
    if (!enabled && isActiveController) {
      setIsActiveController(false);
    }
  }, [enabled, isActiveController]);

  return { scrollRef: ref, isActiveController };
}

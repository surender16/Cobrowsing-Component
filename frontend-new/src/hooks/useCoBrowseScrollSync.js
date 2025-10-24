import { useState, useRef, useEffect, useCallback } from 'react';
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

/**
 * Custom hook for synchronizing scroll position between agent and customer
 * @param {string} userType - 'agent' or 'customer'
 * @param {boolean} enabled - Whether scroll sync is enabled
 * @param {string} containerType - Type of scroll container ('catalog', 'comparison', 'details', 'modal', 'drawer', 'package-list')
 * @returns {Object} - Scroll sync state and methods
 */
export const useCoBrowseScrollSync = (userType = 'agent', enabled = true, containerType = 'catalog', options = {}) => {
  const { passive = false } = options;
  const [isActiveController, setIsActiveController] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState({ scrollTop: 0, scrollLeft: 0 });


  // Refs for tracking scroll state
  const scrollRef = useRef(null);
  const lastScrollPositionRef = useRef({ scrollTop: 0, scrollLeft: 0 });
  const incomingScrollRef = useRef(false);
  const scrollAnimationRef = useRef(false);
  const isActiveControllerRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const throttleTimeoutRef = useRef(null);
  const scrollDelayTimeoutRef = useRef(null);
  
  // Enhanced loop prevention
  const lastReceivedScrollRef = useRef({ scrollTop: 0, scrollLeft: 0, timestamp: 0 });
  const scrollCooldownRef = useRef(false);
  const scrollCooldownTimeoutRef = useRef(null);

  // Determine signal type based on container type
  const getSignalType = useCallback(() => {
    switch (containerType) {
      case 'comparison':
        return 'cobrowse-comparison-scroll-sync';
      case 'details':
        return 'cobrowse-details-scroll-sync';
      case 'modal':
        return 'cobrowse-modal-scroll-sync';
      case 'drawer':
        return 'cobrowse-drawer-scroll-sync';
      case 'package-list':
        return 'cobrowse-package-list-scroll-sync';
      case 'catalog':
      default:
        return 'cobrowse-scroll-sync';
    }
  }, [containerType]);

  // Debug logging function
  const log = useCallback((message, data = null) => {
    console.log(`📊 [${userType}-${containerType}] ${message}`, data || '');
  }, [userType, containerType]);

  // Throttled scroll position sender with delay for smooth scrolling
  const sendScrollPositionThrottled = useCallback((scrollTop, scrollLeft) => {
    // Clear existing throttle timeout
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
    }

    // Set new throttle timeout with delay for smooth scrolling
    throttleTimeoutRef.current = setTimeout(() => {
      const session = openTokSessionSingleton.getSession();
      if (!session || !enabled) {
        log('Cannot send scroll signal - no session or disabled');
        return;
      }

      const scrollData = {
        scrollTop,
        scrollLeft,
        userType,
        containerType,
        timestamp: Date.now()
      };

      const primaryType = getSignalType();
      const payload = JSON.stringify(scrollData);

      log(`📤 Sending scroll signal (${primaryType}):`, scrollData);

      // Send to primary channel
      openTokSessionSingleton.sendSignal({ type: primaryType, data: payload }, (err) => {
        if (err) {
          log('❌ Failed to send scroll signal (primary):', err);
        } else {
          log('✅ Successfully sent scroll signal (primary)');
        }
      });

      // Also send to generic channel for compatibility
      if (primaryType !== 'cobrowse-scroll-sync') {
        openTokSessionSingleton.sendSignal({ type: 'cobrowse-scroll-sync', data: payload }, (err) => {
          if (err) {
            log('❌ Failed to send scroll signal (fallback):', err);
          } else {
            log('✅ Successfully sent scroll signal (fallback)');
          }
        });
      }
    }, 150); // Increased to 150ms to reduce signal frequency and prevent loops
  }, [userType, enabled, log, getSignalType, containerType]);

  // Send scroll position to other party (immediate, for important updates)
  const sendScrollPosition = useCallback((scrollTop, scrollLeft) => {
    const session = openTokSessionSingleton.getSession();
    if (!session || !enabled) return;

    const scrollData = {
      scrollTop,
      scrollLeft,
      userType,
      containerType,
      timestamp: Date.now()
    };

    const primaryType = getSignalType();
    const payload = JSON.stringify(scrollData);

    // Send to primary channel
    openTokSessionSingleton.sendSignal({ type: primaryType, data: payload }, (err) => {
      if (err) {
        log('Failed to send scroll signal (primary):', err);
      }
    });

    // Also send to generic channel for compatibility
    if (primaryType !== 'cobrowse-scroll-sync') {
      openTokSessionSingleton.sendSignal({ type: 'cobrowse-scroll-sync', data: payload }, (err) => {
        if (err) {
          log('Failed to send scroll signal (fallback):', err);
        }
      });
    }
  }, [userType, enabled, log, getSignalType, containerType]);

  // Apply scroll position to the scroll container with smooth animation and delay
  const applyScrollPosition = useCallback((scrollTop, scrollLeft) => {
    if (!scrollRef.current) {
      log('⚠️ ScrollRef not available, cannot apply scroll position');
      return;
    }

    log('Applying scroll position:', { scrollTop, scrollLeft });

    // Mark that we're applying an incoming scroll
    incomingScrollRef.current = true;
    scrollAnimationRef.current = true;

    // Add a small delay before applying scroll for smoother experience
    if (scrollDelayTimeoutRef.current) {
      clearTimeout(scrollDelayTimeoutRef.current);
    }

    scrollDelayTimeoutRef.current = setTimeout(() => {
      // Double check scrollRef is still available
      if (!scrollRef.current) {
        log('⚠️ ScrollRef no longer available');
        incomingScrollRef.current = false;
        scrollAnimationRef.current = false;
        return;
      }

      // Apply the scroll position smoothly
      scrollRef.current.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: 'smooth'
      });

      // Update last scroll position
      const newPosition = { scrollTop, scrollLeft };
      setLastScrollPosition(newPosition);
      lastScrollPositionRef.current = newPosition;

      // Reset flags after animation completes
      setTimeout(() => {
        incomingScrollRef.current = false;
        scrollAnimationRef.current = false;
      }, 300); // Reduced to 300ms for smoother transitions
    }, 30); // Reduced to 30ms for faster response
  }, [log]);

  // Handle incoming scroll signals
  const handleScrollSignal = useCallback((event) => {
    if (!enabled) {
      log('Scroll sync disabled, ignoring signal');
      return;
    }

    try {
      const data = JSON.parse(event.data);
      log(`📥 Received scroll signal:`, data);

      // Ignore signals from a different container type
      if (data.containerType !== containerType) {
        log(`Ignoring signal - wrong container type (${data.containerType} vs ${containerType})`);
        return;
      }

      // Ignore signals originating from this same connection (self), independent of userType label
      const session = openTokSessionSingleton.getSession();
      if (session && event.from && session.connection && event.from.connectionId === session.connection.connectionId) {
        log('Ignoring signal - from same connection');
        return;
      }

      // Additional check: ignore if userType matches (extra safety)
      if (data.userType === userType) {
        log('Ignoring signal - from same user type');
        return;
      }

      // Track received scroll to prevent loops
      lastReceivedScrollRef.current = {
        scrollTop: data.scrollTop,
        scrollLeft: data.scrollLeft,
        timestamp: Date.now()
      };

      log(`🎯 Applying scroll position from other party:`, { scrollTop: data.scrollTop, scrollLeft: data.scrollLeft });

      // Apply the scroll position to our container
      applyScrollPosition(data.scrollTop, data.scrollLeft);

    } catch (err) {
      log('❌ Failed to parse scroll signal:', err);
    }
  }, [enabled, log, applyScrollPosition, containerType]);

  // Handle scroll events from the local container
  const handleScroll = useCallback((event) => {
    log('📊 Scroll event detected');
    
    // Enhanced loop prevention - check multiple conditions
    if (incomingScrollRef.current || scrollAnimationRef.current || scrollCooldownRef.current) {
      log('Ignoring scroll event - incoming, animating, or cooldown active');
      return; // Ignore scroll events caused by incoming signals
    }

    const { scrollTop, scrollLeft } = event.target;
    const now = Date.now();

    // Check if this scroll is too similar to the last received scroll (loop prevention)
    const lastReceived = lastReceivedScrollRef.current;
    const timeDiff = now - lastReceived.timestamp;
    const positionDiff = Math.abs(scrollTop - lastReceived.scrollTop) + Math.abs(scrollLeft - lastReceived.scrollLeft);
    
    if (timeDiff < 1000 && positionDiff < 10) {
      log('Ignoring scroll - too similar to recently received scroll (loop prevention)');
      return;
    }

    // Check if scroll position actually changed significantly
    const lastPos = lastScrollPositionRef.current;
    const scrollThreshold = 5; // Increased threshold to reduce sensitivity
    if (Math.abs(scrollTop - lastPos.scrollTop) < scrollThreshold &&
      Math.abs(scrollLeft - lastPos.scrollLeft) < scrollThreshold) {
      log('Scroll change too small, ignoring');
      return;
    }

    // Mark this user as the active controller
    isActiveControllerRef.current = true;
    setIsActiveController(true);

    log('🎯 Local scroll detected - sending to other party:', { scrollTop, scrollLeft });

    // Set cooldown to prevent immediate feedback
    scrollCooldownRef.current = true;
    if (scrollCooldownTimeoutRef.current) {
      clearTimeout(scrollCooldownTimeoutRef.current);
    }
    scrollCooldownTimeoutRef.current = setTimeout(() => {
      scrollCooldownRef.current = false;
    }, 200); // 200ms cooldown

    // Send scroll position to other party (throttled for performance)
    sendScrollPositionThrottled(scrollTop, scrollLeft);

    // Update last scroll position
    lastScrollPositionRef.current = { scrollTop, scrollLeft };
    setLastScrollPosition({ scrollTop, scrollLeft });
  }, [sendScrollPositionThrottled, log]);

  // Handle scroll timeout (when user stops scrolling)
  const handleScrollEnd = useCallback(() => {
    // Reset active controller after user stops scrolling
    setTimeout(() => {
      if (isActiveControllerRef.current && !incomingScrollRef.current) {
        isActiveControllerRef.current = false;
        setIsActiveController(false);
        log('Released active control');
      }
    }, 1500); // Reduced to 1500ms for faster control switching
  }, [log]);

  // Set up scroll event listener on the scroll container
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !enabled) {
      log('⚠️ Cannot setup scroll listener - no container or disabled');
      return;
    }

    log('✅ Setting up scroll event listener on container');

    const handleScrollEvent = (event) => {
      log('📊 Scroll event fired on container');
      handleScroll(event);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout for scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        handleScrollEnd();
      }, 100); // Reduced to 100ms for faster control switching
    };

    scrollContainer.addEventListener('scroll', handleScrollEvent, { passive: true });
    log('✅ Scroll event listener added successfully');

    return () => {
      log('🧹 Cleaning up scroll event listener');
      scrollContainer.removeEventListener('scroll', handleScrollEvent);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, handleScrollEnd, enabled, log]);

  // Set up OpenTok signal listener with retry mechanism
  useEffect(() => {
    if (!enabled) {
      log('Scroll sync disabled, skipping signal setup');
      return;
    }

    const signalType = getSignalType();
    let isRegistered = false;
    let retryCount = 0;
    const maxRetries = 10;

    const tryRegisterHandler = () => {
      const session = openTokSessionSingleton.getSession();

      if (session && !isRegistered) {
        log(`🔧 Setting up scroll sync signal listener for: ${signalType}`);
        const successPrimary = openTokSessionSingleton.registerSignalHandler(`signal:${signalType}`, handleScrollSignal);
        const alsoRegisterGeneric = signalType !== 'cobrowse-scroll-sync';
        const successGeneric = alsoRegisterGeneric
          ? openTokSessionSingleton.registerSignalHandler('signal:cobrowse-scroll-sync', handleScrollSignal)
          : true;

        if (successPrimary && successGeneric) {
          isRegistered = true;
          log(`✅ Successfully registered scroll sync handler for: ${signalType}${alsoRegisterGeneric ? ' + generic' : ''}`);
        } else {
          log(`⚠️ Failed to register handler for: ${signalType}${alsoRegisterGeneric ? ' and/or generic' : ''}`);
        }
      } else if (!session && retryCount < maxRetries) {
        // Session not available yet, retry after a short delay
        retryCount++;
        log(`⏳ Session not available, retry ${retryCount}/${maxRetries}`);
        setTimeout(tryRegisterHandler, 500);
      } else if (retryCount >= maxRetries) {
        log(`❌ Max retries reached, could not register scroll sync for: ${signalType}`);
      }
    };

    // Try to register immediately
    tryRegisterHandler();

    return () => {
      if (isRegistered) {
        log(`Cleaning up scroll sync signal listener for: ${signalType}`);
        openTokSessionSingleton.unregisterSignalHandler(`signal:${signalType}`);
        if (signalType !== 'cobrowse-scroll-sync') {
          openTokSessionSingleton.unregisterSignalHandler('signal:cobrowse-scroll-sync');
        }
        isRegistered = false;
      }
    };
  }, [handleScrollSignal, enabled, log, getSignalType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
      if (scrollDelayTimeoutRef.current) {
        clearTimeout(scrollDelayTimeoutRef.current);
      }
      if (scrollCooldownTimeoutRef.current) {
        clearTimeout(scrollCooldownTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollRef,
    isActiveController,
    lastScrollPosition,
    handleScroll,
    handleScrollEnd,
    applyScrollPosition,
    isIncomingScroll: incomingScrollRef.current,
    isScrollAnimating: scrollAnimationRef.current,
    // Additional utility methods
    syncToPosition: (scrollTop, scrollLeft) => {
      if (!incomingScrollRef.current) {
        sendScrollPosition(scrollTop, scrollLeft);
      }
    },
    getScrollPosition: () => {
      if (scrollRef.current) {
        return {
          scrollTop: scrollRef.current.scrollTop,
          scrollLeft: scrollRef.current.scrollLeft
        };
      }
      return { scrollTop: 0, scrollLeft: 0 };
    }
  };
}; 
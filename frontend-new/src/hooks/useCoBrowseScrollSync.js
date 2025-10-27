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
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error'
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncError, setSyncError] = useState(null);

  // Refs for tracking scroll state
  const scrollRef = useRef(null);
  const lastScrollPositionRef = useRef({ scrollTop: 0, scrollLeft: 0 });
  const incomingScrollRef = useRef(false);
  const scrollAnimationRef = useRef(false);
  const isActiveControllerRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const throttleTimeoutRef = useRef(null);
  const scrollDelayTimeoutRef = useRef(null);
  
  // New refs for enhanced sync stability
  const lastSuccessfulSyncRef = useRef(Date.now());
  const syncAttemptCountRef = useRef(0);
  const syncIntervalRef = useRef(null);

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
    }, 50); // Reduced to 50ms for smoother, more responsive sync (20fps)
  }, [userType, enabled, log, getSignalType, containerType]);

  // Send scroll position with enhanced reliability and feedback
  const sendScrollPosition = useCallback((scrollTop, scrollLeft) => {
    const session = openTokSessionSingleton.getSession();
    if (!session || !enabled) {
      setSyncError('No active session or sync disabled');
      return;
    }

    // Update UI state
    setSyncStatus('syncing');
    setSyncProgress(25);

    const scrollData = {
      scrollTop,
      scrollLeft,
      userType,
      containerType,
      timestamp: Date.now(),
      syncId: Math.random().toString(36).substring(7), // Unique sync ID for tracking
      attempt: syncAttemptCountRef.current + 1
    };

    const primaryType = getSignalType();
    const payload = JSON.stringify(scrollData);

    // Track sync attempt
    syncAttemptCountRef.current++;

    const handleSignalResult = (err, channel) => {
      if (err) {
        log(`❌ Failed to send scroll signal (${channel}):`, err);
        setSyncStatus('error');
        setSyncError(`Failed to send ${channel} signal: ${err.message}`);
        
        // Retry logic for failed signals
        if (syncAttemptCountRef.current < 3) {
          setTimeout(() => sendScrollPosition(scrollTop, scrollLeft), 100 * Math.pow(2, syncAttemptCountRef.current));
        }
      } else {
        log(`✅ Successfully sent scroll signal (${channel})`);
        setSyncProgress(prev => Math.min(prev + 25, 100));
        
        // Reset error state on success
        if (channel === 'primary') {
          setSyncError(null);
          lastSuccessfulSyncRef.current = Date.now();
        }
      }
    };

    // Send to primary channel
    openTokSessionSingleton.sendSignal({ type: primaryType, data: payload }, 
      (err) => handleSignalResult(err, 'primary')
    );

    // Also send to generic channel for compatibility
    if (primaryType !== 'cobrowse-scroll-sync') {
      openTokSessionSingleton.sendSignal({ type: 'cobrowse-scroll-sync', data: payload },
        (err) => handleSignalResult(err, 'fallback')
      );
    }

    // Set up health check interval
    if (!syncIntervalRef.current) {
      syncIntervalRef.current = setInterval(() => {
        const timeSinceLastSync = Date.now() - lastSuccessfulSyncRef.current;
        if (timeSinceLastSync > 5000) { // 5 seconds without successful sync
          setSyncStatus('error');
          setSyncError('Sync connection unstable');
          log('⚠️ Sync connection unstable - last successful sync was ' + timeSinceLastSync + 'ms ago');
        }
      }, 5000);
    }
  }, [userType, enabled, log, getSignalType, containerType]);

  // Apply received scroll position
  const applyScrollPosition = useCallback((scrollTop, scrollLeft) => {
    if (!scrollRef.current) return;

    incomingScrollRef.current = true;
    scrollAnimationRef.current = true;

    scrollRef.current.scrollTo({
      top: scrollTop,
      left: scrollLeft,
      behavior: 'smooth'
    });

    // Update last position
    const newPosition = { scrollTop, scrollLeft };
    setLastScrollPosition(newPosition);
    lastScrollPositionRef.current = newPosition;

    // Reset flags after animation - faster reset for smoother sync
    setTimeout(() => {
      incomingScrollRef.current = false;
      scrollAnimationRef.current = false;
    }, 50); // Reduced to 50ms for very fast sync
  }, [log]);

  // Handle incoming scroll signals with enhanced error handling and retry logic
  const handleScrollSignal = useCallback((event) => {
    if (!enabled) return;

    try {
      const data = JSON.parse(event.data);

      // Only process signals for matching container type
      if (data.containerType !== containerType) return;

      // Only process signals from opposite user type
      if (data.userType === userType) return;

      // Update sync status
      setSyncStatus('syncing');
      setSyncProgress(50); // Initial progress

      // Verify data integrity
      if (typeof data.scrollTop !== 'number' || typeof data.scrollLeft !== 'number') {
        throw new Error('Invalid scroll position data');
      }

      // Apply the scroll position with retry logic
      const maxRetries = 3;
      let retryCount = 0;

      const attemptSync = () => {
        try {
          applyScrollPosition(data.scrollTop, data.scrollLeft);
          
          // Update success metrics
          lastSuccessfulSyncRef.current = Date.now();
          syncAttemptCountRef.current = 0;
          setSyncStatus('idle');
          setSyncProgress(100);
          setSyncError(null);
          
          log(`✅ Scroll sync successful for ${containerType}`);
        } catch (syncErr) {
          retryCount++;
          if (retryCount < maxRetries) {
            log(`⚠️ Retry ${retryCount}/${maxRetries} for ${containerType}`);
            setTimeout(attemptSync, 100 * retryCount); // Exponential backoff
          } else {
            setSyncStatus('error');
            setSyncError(`Failed to sync after ${maxRetries} attempts`);
            log(`❌ Scroll sync failed for ${containerType} after ${maxRetries} attempts`);
          }
        }
      };

      attemptSync();

    } catch (err) {
      console.error('Failed to parse scroll signal:', err);
      setSyncStatus('error');
      setSyncError(err.message);
      setSyncProgress(0);
    }
  }, [enabled, containerType, userType, applyScrollPosition, log]);

  // Handle scroll events from the local container
  const handleScroll = useCallback((event) => {
    // Ignore programmatic scrolls (only if actively receiving incoming scroll)
    if (incomingScrollRef.current) {
      return;
    }

    const { scrollTop, scrollLeft } = event.target;

    // Mark as active controller
    isActiveControllerRef.current = true;
    setIsActiveController(true);

    // Don't set cooldown - let it throttle naturally through sendScrollPositionThrottled

    // Send scroll position using throttled version for smoother performance
    sendScrollPositionThrottled(scrollTop, scrollLeft);

    // Update last position
    lastScrollPositionRef.current = { scrollTop, scrollLeft };
    setLastScrollPosition({ scrollTop, scrollLeft });
  }, [sendScrollPositionThrottled]);

  // Handle scroll timeout (when user stops scrolling)
  const handleScrollEnd = useCallback(() => {
    // Reset active controller after user stops scrolling
    setTimeout(() => {
      if (isActiveControllerRef.current && !incomingScrollRef.current) {
        isActiveControllerRef.current = false;
        setIsActiveController(false);
        log('Released active control');
      }
    }, 500); // Reduced to 500ms for faster control switching
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
      }, 150); // Reduced to 150ms for faster scroll end detection
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

  // Enhanced cleanup and monitoring
  useEffect(() => {
    // Set up connection monitoring
    const healthCheck = setInterval(() => {
      const session = openTokSessionSingleton.getSession();
      if (!session) {
        setSyncStatus('error');
        setSyncError('Session disconnected');
        log('❌ No active session');
      } else if (syncStatus === 'error' && session) {
        // Try to recover from error state
        setSyncStatus('idle');
        setSyncError(null);
        log('🔄 Recovered from error state');
      }
    }, 2000);

    // Monitor sync performance
    const performanceCheck = setInterval(() => {
      if (syncAttemptCountRef.current > 10) {
        log('⚠️ High number of sync attempts detected');
        syncAttemptCountRef.current = 0; // Reset counter
      }
    }, 10000);

    // Cleanup function
    return () => {
      // Clear all timeouts and intervals
      [
        scrollTimeoutRef.current,
        throttleTimeoutRef.current,
        scrollDelayTimeoutRef.current,
        scrollCooldownTimeoutRef.current,
        syncIntervalRef.current,
        healthCheck,
        performanceCheck
      ].forEach(timer => timer && clearTimeout(timer));

      // Reset states
      setSyncStatus('idle');
      setSyncProgress(0);
      setSyncError(null);
      syncAttemptCountRef.current = 0;
      log('🧹 Cleanup complete');
    };
  }, [log]);

  return {
    scrollRef,
    isActiveController,
    lastScrollPosition,
    handleScroll,
    handleScrollEnd,
    applyScrollPosition,
    isIncomingScroll: incomingScrollRef.current,
    isScrollAnimating: scrollAnimationRef.current,
    // Sync status information
    syncStatus,
    syncProgress,
    syncError,
    // Enhanced utility methods
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
    },
    // Reset sync state
    resetSync: () => {
      setSyncStatus('idle');
      setSyncProgress(0);
      setSyncError(null);
      syncAttemptCountRef.current = 0;
      lastSuccessfulSyncRef.current = Date.now();
    }
  };
}; 
// Deprecated legacy scroll sync manager.
// All realtime signaling now handled centrally by syncManager (SCROLL op).
// This class is retained as a thin compatibility wrapper for existing components
// that still import scrollSyncManager. It maps API calls to syncManager.scroll.
import { syncManager } from '../sync/syncManager';

/**
 * Centralized scroll synchronization manager
 * Manages multiple scroll containers and their synchronization states
 */
class ScrollSyncManager {
  constructor() {
    if (ScrollSyncManager.instance) return ScrollSyncManager.instance;
    this.containers = new Map(); // containerId -> { ref, type, callbacks }
    this.isEnabled = true;
    this.userType = null;
    ScrollSyncManager.instance = this;
  }

  /**
   * Get the singleton instance
   */
  static getInstance() {
    if (!ScrollSyncManager.instance) {
      ScrollSyncManager.instance = new ScrollSyncManager();
    }
    return ScrollSyncManager.instance;
  }

  /**
   * Initialize the scroll sync manager
   * @param {string} userType - 'agent' or 'customer'
   * @param {Object} session - OpenTok session object
   */
  initialize(userType /*, sessionIgnored */) {
    this.userType = userType;
    this.isEnabled = true;
    console.log(`[scroll-sync] compatibility manager initialized for ${userType}`);
  }

  /**
   * Set up signal handlers for all scroll sync container types
   */
  // Legacy no-op: signal handlers now handled in syncManager.
  setupSignalHandlers() {}

  /**
   * Create a scroll signal handler for a specific container type
   * @param {string} containerType - Type of container
   * @returns {Function} Signal handler function
   */
  createScrollSignalHandler() { /* deprecated path */ return () => {}; }

  /**
   * Register a scroll container
   * @param {string} containerId - Unique identifier for the container
   * @param {Object} containerData - Container data including ref and callbacks
   */
  registerContainer(containerId, containerData) {
    this.containers.set(containerId, {
      ...containerData,
      id: containerId,
      isActive: false,
      lastScrollPosition: { scrollTop: 0, scrollLeft: 0 }
    });
    
    console.log(`📊 Registered scroll container: ${containerId}`);
  }

  /**
   * Unregister a scroll container
   * @param {string} containerId - Container identifier
   */
  unregisterContainer(containerId) {
    this.containers.delete(containerId);
    console.log(`📊 Unregistered scroll container: ${containerId}`);
  }

  /**
   * Send scroll position for a specific container
   * @param {string} containerId - Container identifier
   * @param {number} scrollTop - Vertical scroll position
   * @param {number} scrollLeft - Horizontal scroll position
   * @param {string} containerType - Type of container
   */
  sendScrollPosition(containerId, scrollTop, scrollLeft /*, containerTypeIgnored */) {
    if (!this.isEnabled) return;
    const container = this.containers.get(containerId);
    const element = container?.ref?.current || container?.element || null;
    // Delegate to syncManager (will throttle & broadcast if agent)
    syncManager.scroll(containerId, element, scrollTop, scrollLeft);
    this.updateContainerPosition(containerId, scrollTop, scrollLeft);
  }

  /**
   * Enable or disable scroll synchronization
   * @param {boolean} enabled - Whether to enable scroll sync
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`📊 Scroll sync ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get all registered containers
   * @returns {Map} Map of registered containers
   */
  getContainers() {
    return this.containers;
  }

  /**
   * Get a specific container
   * @param {string} containerId - Container identifier
   * @returns {Object|null} Container data or null
   */
  getContainer(containerId) {
    return this.containers.get(containerId);
  }

  /**
   * Update container scroll position
   * @param {string} containerId - Container identifier
   * @param {number} scrollTop - Vertical scroll position
   * @param {number} scrollLeft - Horizontal scroll position
   */
  updateContainerPosition(containerId, scrollTop, scrollLeft) {
    const container = this.containers.get(containerId);
    if (container) {
      container.lastScrollPosition = { scrollTop, scrollLeft };
    }
  }

  /**
   * Set container as active controller
   * @param {string} containerId - Container identifier
   * @param {boolean} isActive - Whether container is active
   */
  setContainerActive(containerId, isActive) {
    const container = this.containers.get(containerId);
    if (container) {
      container.isActive = isActive;
    }
  }

  /**
   * Cleanup and reset the manager
   */
  cleanup() {
    console.log('[scroll-sync] cleanup compatibility manager');
    this.containers.clear();
    this.isEnabled = false;
    this.userType = null;
  }

  /**
   * Get scroll sync statistics
   * @returns {Object} Statistics about scroll sync usage
   */
  getStats() {
    return {
      enabled: this.isEnabled,
      userType: this.userType,
      containerCount: this.containers.size,
      containers: Array.from(this.containers.keys()),
      activeContainers: Array.from(this.containers.values())
        .filter(c => c.isActive)
        .map(c => c.id),
      mode: 'compat-wrapper'
    };
  }
}

// Export singleton instance
export const scrollSyncManager = ScrollSyncManager.getInstance();

// Export the class for testing purposes
export { ScrollSyncManager };
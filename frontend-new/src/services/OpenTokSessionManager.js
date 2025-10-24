import { chunkedSessionManager } from './ChunkedSessionManager';

/**
 * Singleton pattern for OpenTok session handling
 * Provides centralized session management across the application
 */
class OpenTokSessionSingleton {
  constructor() {
    if (OpenTokSessionSingleton.instance) {
      return OpenTokSessionSingleton.instance;
    }

    this.session = null;
    this.sessionRef = { current: null };
    this.signalHandlers = new Map();
    this.isInitialized = false;
    this.listeners = new Set();

    OpenTokSessionSingleton.instance = this;
  }

  /**
   * Get the singleton instance
   */
  static getInstance() {
    if (!OpenTokSessionSingleton.instance) {
      OpenTokSessionSingleton.instance = new OpenTokSessionSingleton();
    }
    return OpenTokSessionSingleton.instance;
  }

  /**
   * Initialize the session
   * @param {Object} session - OpenTok session object
   */
  initialize(session) {
    if (this.isInitialized && this.session === session) {
      console.log('🔌 Session already initialized with same session');
      return;
    }

    console.log('🔌 Initializing OpenTok session singleton');
    this.session = session;
    this.sessionRef.current = session;
    this.isInitialized = true;

    // Add a general signal listener for debugging
    session.on('signal', (event) => {
      console.log('🔌 GENERAL SIGNAL RECEIVED:', event.type, event.data);
    });

    // Notify all listeners that session is available
    this.notifyListeners('sessionInitialized', session);
  }

  /**
   * Get the current session
   * @returns {Object|null} Current session or null
   */
  getSession() {
    return this.session;
  }

  /**
   * Get the session ref (for compatibility with existing code)
   * @returns {Object} Session ref object
   */
  getSessionRef() {
    return this.sessionRef;
  }

  /**
   * Check if session is available
   * @returns {boolean} True if session is available
   */
  isSessionAvailable() {
    return this.isInitialized && this.session !== null;
  }

  /**
   * Register a signal handler
   * @param {string} signalType - Signal type (e.g., 'signal:package-share')
   * @param {Function} handler - Signal handler function
   */
  registerSignalHandler(signalType, handler) {
    if (!this.isSessionAvailable()) {
      console.warn(`🔌 Cannot register signal handler ${signalType}: No session available`);
      return false;
    }

    console.log(`🔌 Registering signal handler: ${signalType}`);
    console.log(`🔌 Handler function:`, handler);
    console.log(`🔌 Session object:`, this.session);

    // Remove existing handler if any
    if (this.signalHandlers.has(signalType)) {
      console.log(`🔌 Removing existing handler for: ${signalType}`);
      this.session.off(signalType, this.signalHandlers.get(signalType));
    }

    // Register new handler
    this.signalHandlers.set(signalType, handler);
    this.session.on(signalType, handler);
    console.log(`🔌 Successfully registered handler for: ${signalType}`);

    return true;
  }

  /**
   * Unregister a signal handler
   * @param {string} signalType - Signal type to unregister
   */
  unregisterSignalHandler(signalType) {
    if (!this.isSessionAvailable()) {
      return;
    }

    const handler = this.signalHandlers.get(signalType);
    if (handler) {
      console.log(`🔌 Unregistering signal handler: ${signalType}`);
      this.session.off(signalType, handler);
      this.signalHandlers.delete(signalType);
    }
  }

  /**
   * Register multiple signal handlers at once
   * @param {Object} handlers - Object with signal types as keys and handlers as values
   */
  registerSignalHandlers(handlers) {
    if (!this.isSessionAvailable()) {
      console.warn('🔌 Cannot register signal handlers: No session available');
      return false;
    }

    console.log('🔌 Registering multiple signal handlers:', Object.keys(handlers));

    Object.entries(handlers).forEach(([signalType, handler]) => {
      this.registerSignalHandler(signalType, handler);
    });

    return true;
  }

  /**
   * Unregister all signal handlers
   */
  unregisterAllSignalHandlers() {
    if (!this.isSessionAvailable()) {
      return;
    }

    console.log('🔌 Unregistering all signal handlers');

    this.signalHandlers.forEach((handler, signalType) => {
      this.session.off(signalType, handler);
    });

    this.signalHandlers.clear();
  }

  /**
   * Send a signal
   * @param {Object} signalData - Signal data object
   * @param {Function} callback - Optional callback function
   */
  async sendSignal(signalData, callback) {
    if (!this.isSessionAvailable()) {
      const error = new Error('Cannot send signal: No session available');
      console.error('🔌', error.message);
      if (callback) callback(error);
      return false;
    }

    console.log('🔌 Sending signal:', signalData.type);
    console.log('🔌 Signal data:', signalData);
    console.log('🔌 Session available:', !!this.session);

    this.session.signal(signalData, (err) => {
      if (err) {
        console.error('🔌 Signal send error:', err);
      } else {
        console.log('🔌 Signal sent successfully:', signalData.type);
      }
      if (callback) callback(err);
    });
    return true;
  }

  /**
   * Register a general signal listener for debugging
   * @param {Function} handler - Signal handler function
   */
  registerGeneralSignalListener(handler) {
    if (!this.isSessionAvailable()) {
      console.warn('🔌 Cannot register general signal listener: No session available');
      return false;
    }

    console.log('🔌 Registering general signal listener');
    this.session.on('signal', handler);
    return true;
  }

  /**
   * Unregister a general signal listener
   * @param {Function} handler - Signal handler function to unregister
   */
  unregisterGeneralSignalListener(handler) {
    if (!this.isSessionAvailable()) {
      return;
    }

    console.log('🔌 Unregistering general signal listener');
    this.session.off('signal', handler);
  }

  /**
   * Register a specific signal type listener
   * @param {string} signalType - Signal type (e.g., 'callAccepted', 'endCall')
   * @param {Function} handler - Signal handler function
   */
  registerSpecificSignalListener(signalType, handler) {
    if (!this.isSessionAvailable()) {
      console.warn(`🔌 Cannot register specific signal listener ${signalType}: No session available`);
      return false;
    }

    console.log(`🔌 Registering specific signal listener: ${signalType}`);
    this.session.on(signalType, handler);
    return true;
  }

  /**
   * Unregister a specific signal type listener
   * @param {string} signalType - Signal type to unregister
   * @param {Function} handler - Signal handler function to unregister
   */
  unregisterSpecificSignalListener(signalType, handler) {
    if (!this.isSessionAvailable()) {
      return;
    }

    console.log(`🔌 Unregistering specific signal listener: ${signalType}`);
    this.session.off(signalType, handler);
  }

  /**
   * Add a listener for session events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  addListener(event, callback) {
    this.listeners.add({ event, callback });
  }

  /**
   * Remove a listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  removeListener(event, callback) {
    this.listeners.forEach(listener => {
      if (listener.event === event && listener.callback === callback) {
        this.listeners.delete(listener);
      }
    });
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }

  /**
   * Cleanup and reset the singleton
   */
  cleanup() {
    console.log('🔌 Cleaning up OpenTok session singleton');

    this.unregisterAllSignalHandlers();
    this.listeners.clear();
    this.session = null;
    this.sessionRef.current = null;
    this.isInitialized = false;
  }

  /**
   * Get session manager for chunked data operations
   * @returns {Object} Session manager instance
   */
  getSessionManager() {
    return chunkedSessionManager;
  }
}

// Export singleton instance
export const openTokSessionSingleton = OpenTokSessionSingleton.getInstance();

// Export the class for testing purposes
export { OpenTokSessionSingleton }; 
// Simplified wrapper delegating to unified syncManager; legacy signaling removed.
import { syncManager } from '../sync/syncManager';

class PackageDetailsCoBrowseSingleton {
  constructor() {
    if (PackageDetailsCoBrowseSingleton.instance) return PackageDetailsCoBrowseSingleton.instance;
    this.isInitialized = false;
    this.listeners = new Map();
    this.isIncomingActionRef = { current: false };
    PackageDetailsCoBrowseSingleton.instance = this;
  }
  static getInstance() { return PackageDetailsCoBrowseSingleton.instance || new PackageDetailsCoBrowseSingleton(); }
  initialize() { if (this.isInitialized) return; this.isInitialized = true; }
  addListener(eventType, cb) { if (!this.listeners.has(eventType)) this.listeners.set(eventType, new Set()); this.listeners.get(eventType).add(cb); }
  removeListener(eventType, cb) { const set = this.listeners.get(eventType); if (set) set.delete(cb); }
  notifyListeners(eventType, data) { const set = this.listeners.get(eventType); if (set) set.forEach(fn => { try { fn(data); } catch(e){ console.error(e); } }); }
  sendAction(actionType, data, userType) {
    if (this.isIncomingActionRef.current) return false;
    syncManager.detailAction(actionType, { userType, ...data });
    return true;
  }
  cleanup() { this.listeners.clear(); this.isInitialized = false; this.isIncomingActionRef.current = false; }
}
export const packageDetailsCoBrowseSingleton = PackageDetailsCoBrowseSingleton.getInstance();
export { PackageDetailsCoBrowseSingleton };
import { extractPackageIds } from '../utils/packageLookup';
import { syncManager, ACTION_TYPES } from '../sync/syncManager';
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

/**
 * Comparison Sync Service for sending comparison data via ID-based transmission
 * This service sends only package IDs to avoid OpenTok's 8192 character limit
 * Package data is reconstructed from IDs on the receiving end
 */
export class ComparisonSyncService {
    constructor() {
        this.isSending = false;
        this.sendingProgress = 0;
    }

    /**
     * Send comparison data to other party using ID-based transmission
     * @param {string} action - The comparison action type
     * @param {Array} compareList - Array of packages in comparison
     * @param {string} userType - 'agent' or 'customer'
     * @param {Object} options - Additional options
     * @param {Function} options.onProgress - Progress callback
     * @param {Function} options.onComplete - Completion callback
     * @param {Function} options.onError - Error callback
     */
    async sendComparisonData(action, compareList = [], userType = 'agent', options = {}) {
        const {
            onComplete,
            onError
        } = options;

        console.log(`🎭 ComparisonSyncService.sendComparisonData called:`, {
            action,
            compareListLength: compareList?.length,
            userType
        });

        if (this.isSending) {
            const error = new Error('Another comparison transmission is already in progress');
            console.error('🎭 Another transmission already in progress');
            onError?.(error);
            throw error;
        }

        try {
            this.isSending = true;
            this.sendingProgress = 0;

            // Extract only package IDs to minimize data size
            const packageIds = extractPackageIds(compareList);

            // Prepare comparison data with only IDs
            const comparisonData = {
                action,
                userType,
                packageIds: packageIds, // Send IDs only
                timestamp: new Date().toISOString()
            };

            const dataSize = new Blob([JSON.stringify(comparisonData)]).size;

            console.log(`🎭 ${userType} preparing to send comparison data (${this.formatFileSize(dataSize)})`);
            console.log('🎭 Comparison data structure:', {
                action,
                packageIdsCount: packageIds?.length,
                packageIds: packageIds,
                dataSize
            });

                        // Use unified syncManager SHARE_PACKAGES + COMPARE_SELECT broadcast semantics
                        syncManager.sharePackages([]); // ensure packages previously shared if needed
                        // Broadcast selection set via compareSet handling; agent authoritative
                        if (userType === 'agent') {
                            // Replace entire compareSet by toggling each id (simplified)
                            syncManager.applyLocalAction({ type: ACTION_TYPES.DETAIL_ACTION, data: { name: 'comparison-init', packageIds } });
                        }
                        this.isSending = false;
                        this.sendingProgress = 100;
                        onComplete?.();

        } catch (error) {
            this.isSending = false;
            this.sendingProgress = 0;
            console.error('🎭 Failed to send comparison data:', error);
            onError?.(error);
            throw error;
        }
    }

    /**
     * Send comparison data using chunked transmission
     * @param {Object} session - OpenTok session
     * @param {Object} comparisonData - Comparison data object
     * @param {Function} onProgress - Progress callback
     * @param {Function} onComplete - Complete callback
     * @param {Function} onError - Error callback
     */
    async sendChunkedComparison(session, comparisonData, onProgress, onComplete, onError) {
        return new Promise((resolve, reject) => {
            console.log('🎭 Starting chunked comparison transmission');

            const sessionManager = openTokSessionSingleton.getSessionManager();

            if (!sessionManager) {
                const error = new Error('Session manager not available');
                console.error('🎭 Session manager not available for chunked transmission');
                reject(error);
                return;
            }

            sessionManager.sendChunkedData(
                session,
                comparisonData,
                'comparison-sync-chunk', // Different signal type for comparison
                // Progress callback
                (progress, sentChunks, totalChunks) => {
                    this.sendingProgress = progress;
                    console.log(`🎭 Comparison sending progress: ${progress.toFixed(1)}% (${sentChunks}/${totalChunks})`);
                    onProgress?.(progress, sentChunks, totalChunks);
                },
                // Complete callback
                () => {
                    this.isSending = false;
                    this.sendingProgress = 100;
                    console.log('🎭 Comparison sending completed successfully');
                    onComplete?.();
                    resolve();
                },
                // Error callback
                (error) => {
                    this.isSending = false;
                    this.sendingProgress = 0;
                    console.error('🎭 Comparison sending failed:', error);
                    onError?.(error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Send comparison data using standard OpenTok signals (for smaller data)
     * @param {Object} session - OpenTok session
     * @param {Object} comparisonData - Comparison data object
     * @param {Function} onComplete - Complete callback
     * @param {Function} onError - Error callback
     */
    // Deprecated direct signal method removed in favor of syncManager

    /**
     * Get current sending status
     * @returns {Object} Status object
     */
    getStatus() {
        return {
            isSending: this.isSending,
            progress: this.sendingProgress
        };
    }

    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size string
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Export singleton instance
export const comparisonSyncService = new ComparisonSyncService();

import { openTokSessionSingleton } from './OpenTokSessionManager';

/**
 * Agent Package Service for sending large package data via chunked transmission
 * This service integrates with OpenTokSessionManager to handle large datasets
 */
export class AgentPackageService {
  constructor() {
    this.isSending = false;
    this.sendingProgress = 0;
    this.onProgressCallback = null;
    this.onCompleteCallback = null;
    this.onErrorCallback = null;
  }

  /**
   * Send packages to customer using chunked transmission
   * @param {Array} packages - Array of package objects to send
   * @param {Object} options - Options for sending
   * @param {Function} options.onProgress - Progress callback (progress, sentChunks, totalChunks)
   * @param {Function} options.onComplete - Completion callback
   * @param {Function} options.onError - Error callback
   * @param {boolean} options.useChunking - Force chunking even for small data (default: auto)
   */
  async sendPackages(packages, options = {}) {
    const {
      onProgress,
      onComplete,
      onError,
      useChunking = 'auto'
    } = options;

    console.log('📦 AgentPackageService.sendPackages called with:', {
      packagesCount: packages?.length,
      useChunking,
      options: Object.keys(options)
    });

    const session = openTokSessionSingleton.getSession();
    console.log('📦 Session available:', !!session);
    console.log('📦 Session object:', session);
    
    if (!session) {
      const error = new Error('No active OpenTok session');
      console.error('📦 No session available for package sharing');
      onError?.(error);
      throw error;
    }

    if (!packages || !Array.isArray(packages)) {
      const error = new Error('Packages must be an array');
      console.error('📦 Invalid packages data:', packages);
      onError?.(error);
      throw error;
    }

    if (this.isSending) {
      const error = new Error('Another package transmission is already in progress');
      console.error('📦 Another transmission already in progress');
      onError?.(error);
      throw error;
    }

    try {
      this.isSending = true;
      this.sendingProgress = 0;
      this.onProgressCallback = onProgress;
      this.onCompleteCallback = onComplete;
      this.onErrorCallback = onError;

      // Prepare package data
      const packageData = { packages };
      const dataSize = new Blob([JSON.stringify(packageData)]).size;
      
      console.log(`📦 Agent preparing to send ${packages.length} packages (${this.formatFileSize(dataSize)})`);
      console.log('📦 Package data structure:', {
        hasPackages: !!packageData.packages,
        packagesLength: packageData.packages?.length,
        dataSize,
        samplePackage: packageData.packages?.[0] ? {
          id: packageData.packages[0].id,
          name: packageData.packages[0].name,
          price: packageData.packages[0].price
        } : null
      });

      // Determine if we should use chunking
      const shouldUseChunking = useChunking === true || 
        (useChunking === 'auto' && dataSize > 5000); // Use chunking for data > 5KB

      console.log('📦 Chunking decision:', {
        useChunking,
        shouldUseChunking,
        dataSize,
        threshold: 5000
      });

      if (shouldUseChunking) {
        console.log('📦 Using chunked transmission for large package data');
        console.log('📦 Agent: Data size:', dataSize, 'bytes, threshold: 5000 bytes');
        await this.sendChunkedPackages(session, packageData);
      } else {
        console.log('📦 Using standard transmission for small package data');
        console.log('📦 Agent: Data size:', dataSize, 'bytes, threshold: 5000 bytes');
        await this.sendStandardPackages(session, packageData);
      }

    } catch (error) {
      this.isSending = false;
      this.sendingProgress = 0;
      console.error('📦 Failed to send packages:', error);
      console.error('📦 Error stack:', error.stack);
      this.onErrorCallback?.(error);
      throw error;
    }
  }

  /**
   * Send packages using chunked transmission
   * @param {Object} session - OpenTok session
   * @param {Object} packageData - Package data object
   */
  async sendChunkedPackages(session, packageData) {
    return new Promise((resolve, reject) => {
      console.log('📦 Agent: Starting chunked package transmission');
      console.log('📦 Agent: Session object:', session);
      console.log('📦 Agent: Package data keys:', Object.keys(packageData));
      
      const sessionManager = openTokSessionSingleton.getSessionManager();
      console.log('📦 Agent: Session manager available:', !!sessionManager);
      
      if (!sessionManager) {
        const error = new Error('Session manager not available');
        console.error('📦 Agent: Session manager not available for chunked transmission');
        reject(error);
        return;
      }
      
      sessionManager.sendChunkedData(
        session,
        packageData,
        'package-share-chunk',
        // Progress callback
        (progress, sentChunks, totalChunks) => {
          this.sendingProgress = progress;
          console.log(`📦 Agent sending progress: ${progress.toFixed(1)}% (${sentChunks}/${totalChunks})`);
          this.onProgressCallback?.(progress, sentChunks, totalChunks);
        },
        // Complete callback
        () => {
          this.isSending = false;
          this.sendingProgress = 100;
          console.log('📦 Agent package sending completed successfully');
          this.onCompleteCallback?.();
          resolve();
        },
        // Error callback
        (error) => {
          this.isSending = false;
          this.sendingProgress = 0;
          console.error('📦 Agent package sending failed:', error);
          console.error('📦 Agent package sending error stack:', error.stack);
          this.onErrorCallback?.(error);
          reject(error);
        }
      );
    });
  }

  /**
   * Send packages using standard OpenTok signals (for smaller data)
   * @param {Object} session - OpenTok session
   * @param {Object} packageData - Package data object
   */
  async sendStandardPackages(session, packageData) {
    return new Promise((resolve, reject) => {
      console.log('📦 Agent: Sending standard package signal:', packageData);
      console.log('📦 Agent: Session object:', session);
      console.log('📦 Agent: Package data size:', new Blob([JSON.stringify(packageData)]).size);
      
      const signalData = {
        type: 'package-share',
        data: JSON.stringify(packageData)
      };
      
      console.log('📦 Agent: Signal data to send:', {
        type: signalData.type,
        dataSize: new Blob([signalData.data]).size,
        dataPreview: signalData.data.substring(0, 100) + '...'
      });
      
      openTokSessionSingleton.sendSignal(signalData, (error) => {
        this.isSending = false;
        
        if (error) {
          console.error('📦 Standard package sending failed:', error);
          console.error('📦 Standard package sending error stack:', error.stack);
          this.onErrorCallback?.(error);
          reject(error);
        } else {
          this.sendingProgress = 100;
          console.log('📦 Standard package sending completed successfully');
          this.onCompleteCallback?.();
          resolve();
        }
      });
    });
  }

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
   * Cancel current sending operation
   */
  cancelSending() {
    if (this.isSending) {
      this.isSending = false;
      this.sendingProgress = 0;
      console.log('📦 Package sending cancelled');
    }
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
export const agentPackageService = new AgentPackageService();

/**
 * Example usage for agent side:
 * 
 * import { agentPackageService } from '../services/AgentPackageService';
 * import { samplePackageData } from '../data/samplePackageData';
 * 
 * // In your agent component:
 * const handleSharePackages = async (selectedPackages) => {
 *   try {
 *     await agentPackageService.sendPackages(
 *       sessionRef.current, 
 *       selectedPackages,
 *       {
 *         onProgress: (progress, sent, total) => {
 *           console.log(`Sending: ${progress.toFixed(1)}% (${sent}/${total})`);
 *           setUploadProgress(progress);
 *         },
 *         onComplete: () => {
 *           console.log('Packages sent successfully!');
 *           setShowSuccessMessage(true);
 *         },
 *         onError: (error) => {
 *           console.error('Failed to send packages:', error);
 *           setErrorMessage(error.message);
 *         },
 *         useChunking: 'auto' // or true/false to force behavior
 *       }
 *     );
 *   } catch (error) {
 *     console.error('Error initiating package send:', error);
 *   }
 * };
 * 
 * // Send all sample packages:
 * const handleShareAllPackages = () => {
 *   handleSharePackages(samplePackageData);
 * };
 * 
 * // Send selected packages:
 * const handleShareSelected = (packageIds) => {
 *   const selectedPackages = samplePackageData.filter(pkg => 
 *     packageIds.includes(pkg.id)
 *   );
 *   handleSharePackages(selectedPackages);
 * };
 */ 
/**
 * OpenTok Session Manager for handling chunked data transmission
 * Handles large package data by breaking it into chunks and reassembling on receiver side
 */

import { openTokSessionSingleton } from './OpenTokSessionManager.js';

// Maximum size for OpenTok signals (in bytes) - keeping it safe under the 8KB limit
const MAX_SIGNAL_SIZE = 6000;
const CHUNK_TIMEOUT = 10000; // 10 seconds timeout for chunk reception

export class ChunkedSessionManager {
  constructor() {
    this.pendingChunks = new Map(); // Store pending chunk assemblies
    this.chunkTimeouts = new Map(); // Store timeouts for cleanup
    this.progressCallbacks = new Map(); // Store progress callbacks
  }

  /**
   * Split large data into manageable chunks
   * @param {Object} data - Data to be chunked
   * @param {string} messageId - Unique identifier for this message
   * @returns {Array} Array of chunk objects
   */
  createChunks(data, messageId) {
    const jsonString = JSON.stringify(data);
    const totalSize = new Blob([jsonString]).size;

    // If data is small enough, send as single chunk
    if (totalSize <= MAX_SIGNAL_SIZE) {
      return [{
        messageId,
        chunkIndex: 0,
        totalChunks: 1,
        isLast: true,
        data: jsonString,
        size: totalSize
      }];
    }

    const chunks = [];
    const chunkSize = MAX_SIGNAL_SIZE - 200; // Reserve space for metadata
    let chunkIndex = 0;

    for (let i = 0; i < jsonString.length; i += chunkSize) {
      const chunk = jsonString.slice(i, i + chunkSize);
      const isLast = i + chunkSize >= jsonString.length;

      chunks.push({
        messageId,
        chunkIndex,
        totalChunks: Math.ceil(jsonString.length / chunkSize),
        isLast,
        data: chunk,
        size: new Blob([chunk]).size
      });

      chunkIndex++;
    }

    return chunks;
  }

  /**
   * Send chunked data through OpenTok session
   * @param {Object} session - OpenTok session
   * @param {Object} data - Data to send
   * @param {string} signalType - Signal type (e.g., 'package-share-chunk')
   * @param {Function} onProgress - Progress callback function
   * @param {Function} onComplete - Completion callback function
   * @param {Function} onError - Error callback function
   */
  sendChunkedData(session, data, signalType, onProgress, onComplete, onError) {
    console.log('📦 ChunkedSessionManager.sendChunkedData called with:', {
      sessionAvailable: !!session,
      dataKeys: Object.keys(data),
      signalType,
      hasProgressCallback: !!onProgress,
      hasCompleteCallback: !!onComplete,
      hasErrorCallback: !!onError
    });

    if (!session) {
      const error = new Error('No session provided for chunked data transmission');
      console.error('📦 ChunkedSessionManager: No session provided');
      onError?.(error);
      return;
    }

    const messageId = this.generateMessageId();
    const chunks = this.createChunks(data, messageId);

    console.log(`📦 Sending ${chunks.length} chunks for message ${messageId}`);
    console.log('📦 Chunk details:', chunks.map(chunk => ({
      chunkIndex: chunk.chunkIndex,
      totalChunks: chunk.totalChunks,
      size: chunk.size,
      isLast: chunk.isLast
    })));

    // Send metadata first
    const metadata = {
      messageId,
      totalChunks: chunks.length,
      totalSize: chunks.reduce((sum, chunk) => sum + chunk.size, 0),
      timestamp: Date.now()
    };

    console.log('📦 Sending metadata:', metadata);

    openTokSessionSingleton.sendSignal({
      type: `${signalType}-metadata`,
      data: JSON.stringify(metadata)
    }, (error) => {
      if (error) {
        console.error('📦 Failed to send metadata:', error);
        console.error('📦 Metadata error stack:', error.stack);
        onError?.(error);
        return;
      }

      console.log('📦 Metadata sent successfully, starting chunk transmission');

      // Send chunks with delay to avoid overwhelming the connection
      this.sendChunksSequentially(chunks, signalType, 0, onProgress, onComplete, onError);
    });
  }

  /**
   * Send chunks sequentially with small delays
   */
  sendChunksSequentially(chunks, signalType, index, onProgress, onComplete, onError) {
    if (index >= chunks.length) {
      console.log('📦 All chunks sent successfully, calling completion callback');
      onComplete?.();
      return;
    }

    const chunk = chunks[index];
    console.log(`📦 Sending chunk ${index + 1}/${chunks.length}:`, {
      messageId: chunk.messageId,
      chunkIndex: chunk.chunkIndex,
      size: chunk.size,
      isLast: chunk.isLast,
      dataPreview: chunk.data.substring(0, 50) + '...'
    });

    openTokSessionSingleton.sendSignal({
      type: signalType,
      data: JSON.stringify(chunk)
    }, (error) => {
      if (error) {
        console.error(`📦 Failed to send chunk ${index + 1}:`, error);
        console.error(`📦 Chunk ${index + 1} error stack:`, error.stack);
        onError?.(error);
        return;
      }

      const progress = ((index + 1) / chunks.length) * 100;
      onProgress?.(progress, index + 1, chunks.length);

      console.log(`📦 Sent chunk ${index + 1}/${chunks.length} (${progress.toFixed(1)}%)`);

      if (index + 1 < chunks.length) {
        // Small delay between chunks to avoid overwhelming the connection
        console.log(`📦 Waiting 50ms before sending next chunk...`);
        setTimeout(() => {
          this.sendChunksSequentially(chunks, signalType, index + 1, onProgress, onComplete, onError);
        }, 50);
      } else {
        console.log('📦 All chunks sent, calling completion callback');
        onComplete?.();
      }
    });
  }

  /**
   * Handle incoming chunk metadata
   * @param {Object} session - OpenTok session
   * @param {Object} metadata - Metadata object
   * @param {Function} onProgress - Progress callback
   * @param {Function} onComplete - Completion callback
   * @param {Function} onError - Error callback
   */
  handleChunkMetadata(session, metadata, onProgress, onComplete, onError) {
    const { messageId, totalChunks, totalSize } = metadata;

    console.log(`📦 Receiving chunked message ${messageId}: ${totalChunks} chunks, ${totalSize} bytes`);

    // Initialize chunk assembly
    this.pendingChunks.set(messageId, {
      chunks: new Array(totalChunks),
      receivedCount: 0,
      totalChunks,
      totalSize,
      onProgress,
      onComplete,
      onError
    });

    // Set timeout for cleanup
    const timeout = setTimeout(() => {
      console.error(`📦 Timeout waiting for chunks for message ${messageId}`);
      this.cleanupPendingChunks(messageId);
      onError?.(new Error('Chunk reception timeout'));
    }, CHUNK_TIMEOUT);

    this.chunkTimeouts.set(messageId, timeout);
  }

  /**
   * Handle incoming chunk
   * @param {Object} chunkData - Chunk data object
   */
  handleChunk(chunkData) {
    console.log('📦 ChunkedSessionManager.handleChunk called with:', chunkData);

    const { messageId, chunkIndex, totalChunks, data } = chunkData;

    console.log('📦 Processing chunk:', {
      messageId,
      chunkIndex,
      totalChunks,
      dataSize: data?.length,
      dataPreview: data?.substring(0, 50) + '...'
    });

    const pending = this.pendingChunks.get(messageId);
    if (!pending) {
      console.warn(`📦 Received chunk for unknown message ${messageId}`);
      console.warn('📦 Available pending messages:', Array.from(this.pendingChunks.keys()));
      return;
    }

    console.log('📦 Found pending message:', {
      messageId,
      receivedCount: pending.receivedCount,
      totalChunks: pending.totalChunks,
      chunksArrayLength: pending.chunks.length
    });

    // Store chunk
    pending.chunks[chunkIndex] = data;
    pending.receivedCount++;

    console.log(`📦 Received chunk ${chunkIndex + 1}/${totalChunks} for message ${messageId}`);
    console.log('📦 Updated pending message:', {
      messageId,
      receivedCount: pending.receivedCount,
      totalChunks: pending.totalChunks,
      missingChunks: pending.chunks.map((chunk, index) => chunk === undefined ? index : null).filter(index => index !== null)
    });

    // Update progress
    const progress = (pending.receivedCount / totalChunks) * 100;
    pending.onProgress?.(progress, pending.receivedCount, totalChunks);

    // Check if all chunks received
    if (pending.receivedCount === totalChunks) {
      console.log(`📦 All chunks received for message ${messageId}, starting assembly`);
      this.assembleChunks(messageId);
    } else {
      console.log(`📦 Still waiting for ${totalChunks - pending.receivedCount} more chunks for message ${messageId}`);
    }
  }

  /**
   * Assemble chunks into original data
   * @param {string} messageId - Message identifier
   */
  assembleChunks(messageId) {
    console.log(`📦 ChunkedSessionManager.assembleChunks called for message: ${messageId}`);

    const pending = this.pendingChunks.get(messageId);
    if (!pending) {
      console.error(`📦 No pending chunks found for message ${messageId}`);
      return;
    }

    console.log('📦 Assembling chunks:', {
      messageId,
      totalChunks: pending.totalChunks,
      receivedCount: pending.receivedCount,
      chunksArrayLength: pending.chunks.length,
      missingChunks: pending.chunks.map((chunk, index) => chunk === undefined ? index : null).filter(index => index !== null)
    });

    try {
      // Concatenate all chunks
      const fullData = pending.chunks.join('');
      console.log('📦 Concatenated data length:', fullData.length);
      console.log('📦 Concatenated data preview:', fullData.substring(0, 100) + '...');

      const parsedData = JSON.parse(fullData);
      console.log('📦 Successfully parsed assembled data:', {
        dataType: typeof parsedData,
        dataKeys: Object.keys(parsedData),
        packagesCount: parsedData.packages?.length
      });

      console.log(`📦 Successfully assembled message ${messageId}`);

      // Clear timeout
      const timeout = this.chunkTimeouts.get(messageId);
      if (timeout) {
        clearTimeout(timeout);
        this.chunkTimeouts.delete(messageId);
        console.log(`📦 Cleared timeout for message ${messageId}`);
      }

      // Call completion callback
      console.log('📦 Calling completion callback with assembled data');
      pending.onComplete?.(parsedData);

      // Cleanup
      this.cleanupPendingChunks(messageId);
      console.log(`📦 Cleaned up pending chunks for message ${messageId}`);

    } catch (error) {
      console.error(`📦 Failed to assemble chunks for message ${messageId}:`, error);
      console.error('📦 Assembly error stack:', error.stack);
      console.error('📦 Chunks array:', pending.chunks);
      pending.onError?.(error);
      this.cleanupPendingChunks(messageId);
    }
  }

  /**
   * Clean up pending chunks and timeouts
   * @param {string} messageId - Message identifier
   */
  cleanupPendingChunks(messageId) {
    this.pendingChunks.delete(messageId);

    const timeout = this.chunkTimeouts.get(messageId);
    if (timeout) {
      clearTimeout(timeout);
      this.chunkTimeouts.delete(messageId);
    }
  }

  /**
   * Generate unique message ID
   * @returns {string} Unique message ID
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up all pending operations (call on session disconnect)
   */
  cleanup() {
    // Clear all timeouts
    this.chunkTimeouts.forEach(timeout => clearTimeout(timeout));

    // Clear all maps
    this.pendingChunks.clear();
    this.chunkTimeouts.clear();
    this.progressCallbacks.clear();

    console.log('📦 ChunkedSessionManager cleaned up');
  }
}

// Export singleton instance
export const chunkedSessionManager = new ChunkedSessionManager();
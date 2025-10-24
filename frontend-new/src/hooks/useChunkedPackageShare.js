import { useState, useCallback, useRef, useEffect } from 'react';
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

/**
 * Custom hook for handling chunked package sharing over OpenTok sessions
 * Uses the singleton session manager for better session handling
 */
export const useChunkedPackageShare = () => {
  console.log('📦 useChunkedPackageShare: Hook called');
  
  const [isReceiving, setIsReceiving] = useState(false);
  const [receivingProgress, setReceivingProgress] = useState(0);
  const [receivingDetails, setReceivingDetails] = useState({
    chunksReceived: 0,
    totalChunks: 0,
    messageId: null,
    estimatedSize: 0
  });
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [error, setError] = useState(null);

  // Refs for cleanup
  const currentMessageRef = useRef(null);
  const sessionManager = openTokSessionSingleton.getSessionManager();

  /**
   * Send chunked package data to the session
   * @param {Array} packages - Package data to send
   * @param {Function} onComplete - Callback when sending is complete
   * @param {Function} onError - Callback when sending fails
   */
  const sendPackages = useCallback(async (packages, onComplete, onError) => {
    const session = openTokSessionSingleton.getSession();
    if (!session) {
      const error = new Error('No active session');
      setError(error);
      onError?.(error);
      return;
    }

    if (!packages || !Array.isArray(packages)) {
      const error = new Error('Invalid package data');
      setError(error);
      onError?.(error);
      return;
    }

    try {
      setIsSending(true);
      setSendingProgress(0);
      setError(null);

      const packageData = { packages };

      sessionManager.sendChunkedData(
        session,
        packageData,
        'package-share-chunk',
        // Progress callback
        (progress, sentChunks, totalChunks) => {
          setSendingProgress(progress);
          console.log(`📦 Sending progress: ${progress.toFixed(1)}% (${sentChunks}/${totalChunks})`);
        },
        // Complete callback
        () => {
          setIsSending(false);
          setSendingProgress(100);
          console.log('📦 Package sending completed successfully');
          onComplete?.();
        },
        // Error callback
        (error) => {
          setIsSending(false);
          setSendingProgress(0);
          setError(error);
          console.error('📦 Package sending failed:', error);
          onError?.(error);
        }
      );
    } catch (error) {
      setIsSending(false);
      setSendingProgress(0);
      setError(error);
      onError?.(error);
    }
  }, [sessionManager]);

  /**
   * Handle incoming chunk metadata signal
   */
  const handleChunkMetadata = useCallback((event) => {
    console.log('📦 CUSTOMER: Received chunk metadata signal:', event);
    console.log('📦 CUSTOMER: Event data:', event.data);
    console.log('📦 CUSTOMER: Event type:', event.type);
    
    const session = openTokSessionSingleton.getSession();
    console.log('📦 CUSTOMER: Session:', session);
    console.log('📦 CUSTOMER: Session available:', !!session);
    
    if (!session) {
      console.warn('📦 CUSTOMER: No session available for chunk metadata handling');
      return;
    }
    
    try {
      const metadata = JSON.parse(event.data);
      console.log('📦 CUSTOMER: Parsed metadata:', metadata);
      
      currentMessageRef.current = metadata.messageId;
      
      setIsReceiving(true);
      setReceivingProgress(0);
      setReceivingDetails({
        chunksReceived: 0,
        totalChunks: metadata.totalChunks,
        messageId: metadata.messageId,
        estimatedSize: metadata.totalSize
      });
      setError(null);

      console.log(`📦 CUSTOMER: Starting to receive chunked package data: ${metadata.totalChunks} chunks, ${metadata.totalSize} bytes`);
      console.log(`📦 CUSTOMER: Message ID: ${metadata.messageId}`);

      // Start receiving chunks
      sessionManager.handleChunkMetadata(
        session,
        metadata,
        // Progress callback
        (progress, receivedChunks, totalChunks) => {
          setReceivingProgress(progress);
          setReceivingDetails(prev => ({
            ...prev,
            chunksReceived: receivedChunks
          }));
          console.log(`📦 CUSTOMER: Receiving progress: ${progress.toFixed(1)}% (${receivedChunks}/${totalChunks})`);
        },
        // Complete callback
        (assembledData) => {
          setIsReceiving(false);
          setReceivingProgress(100);
          currentMessageRef.current = null;
          
          console.log('📦 CUSTOMER: Successfully received and assembled package data:', assembledData);
          console.log('📦 CUSTOMER: Assembled data keys:', Object.keys(assembledData));
          console.log('📦 CUSTOMER: Packages count:', assembledData.packages?.length);
          
          // Trigger the original package-share logic
          if (assembledData.packages && Array.isArray(assembledData.packages)) {
            // Create a synthetic event to maintain compatibility
            const syntheticEvent = {
              data: JSON.stringify(assembledData),
              type: 'signal:package-share'
            };
            
            console.log('📦 CHUNKED HOOK: Created synthetic event:', syntheticEvent);
            console.log('📦 CHUNKED HOOK: Synthetic event data:', syntheticEvent.data);
            console.log('📦 CHUNKED HOOK: window.chunkedPackageReceived exists:', !!window.chunkedPackageReceived);
            
            // Dispatch to any registered package share handlers
            if (window.chunkedPackageReceived) {
              console.log('📦 CHUNKED HOOK: Calling window.chunkedPackageReceived');
              window.chunkedPackageReceived(syntheticEvent);
            } else {
              console.error('📦 CHUNKED HOOK: window.chunkedPackageReceived callback not found!');
            }
          } else {
            console.error('📦 CHUNKED HOOK: Invalid assembled data structure:', assembledData);
            console.error('📦 CHUNKED HOOK: packages property:', assembledData.packages);
            console.error('📦 CHUNKED HOOK: packages is array:', Array.isArray(assembledData.packages));
          }
        },
        // Error callback
        (error) => {
          setIsReceiving(false);
          setReceivingProgress(0);
          setError(error);
          currentMessageRef.current = null;
          console.error('📦 CUSTOMER: Failed to receive chunked package data:', error);
          console.error('📦 CUSTOMER: Error stack:', error.stack);
        }
      );
    } catch (error) {
      console.error('📦 CUSTOMER: Failed to parse chunk metadata:', error);
      console.error('📦 CUSTOMER: Raw event data:', event.data);
      setError(error);
    }
  }, [sessionManager]);

  /**
   * Handle incoming chunk signal
   */
  const handleChunk = useCallback((event) => {
    console.log('📦 CUSTOMER: Received chunk signal:', event);
    console.log('📦 CUSTOMER: Chunk event data:', event.data);
    console.log('📦 CUSTOMER: Chunk event type:', event.type);
    
    try {
      const chunkData = JSON.parse(event.data);
      console.log('📦 CUSTOMER: Parsed chunk data:', {
        messageId: chunkData.messageId,
        chunkIndex: chunkData.chunkIndex,
        totalChunks: chunkData.totalChunks,
        size: chunkData.size,
        isLast: chunkData.isLast,
        dataPreview: chunkData.data?.substring(0, 50) + '...'
      });
      
      // Only process chunks for the current message
      if (chunkData.messageId !== currentMessageRef.current) {
        console.warn(`📦 CUSTOMER: Received chunk for different message: ${chunkData.messageId} vs ${currentMessageRef.current}`);
        return;
      }

      console.log(`📦 CUSTOMER: Processing chunk ${chunkData.chunkIndex + 1}/${chunkData.totalChunks} for message ${chunkData.messageId}`);
      
      const sessionManager = openTokSessionSingleton.getSessionManager();
      console.log('📦 CUSTOMER: Session manager available for chunk processing:', !!sessionManager);
      
      if (!sessionManager) {
        console.error('📦 CUSTOMER: No session manager available for chunk processing');
        return;
      }
      
      sessionManager.handleChunk(chunkData);
    } catch (error) {
      console.error('📦 CUSTOMER: Failed to parse chunk data:', error);
      console.error('📦 CUSTOMER: Raw chunk event data:', event.data);
      setError(error);
    }
  }, []);

  // Register signal handlers when session becomes available
  useEffect(() => {
    const handleSessionInitialized = () => {
      console.log('📦 useChunkedPackageShare: Session initialized, registering signal handlers');
      
      // Register chunked package signal handlers
      openTokSessionSingleton.registerSignalHandler('signal:package-share-chunk-metadata', handleChunkMetadata);
      openTokSessionSingleton.registerSignalHandler('signal:package-share-chunk', handleChunk);
    };

    // If session is already available, register handlers immediately
    if (openTokSessionSingleton.isSessionAvailable()) {
      handleSessionInitialized();
    }

    // Listen for session initialization
    openTokSessionSingleton.addListener('sessionInitialized', handleSessionInitialized);

    return () => {
      openTokSessionSingleton.removeListener('sessionInitialized', handleSessionInitialized);
    };
  }, [handleChunkMetadata, handleChunk]);

  /**
   * Cleanup function to call when session ends
   */
  const cleanup = useCallback(() => {
    sessionManager.cleanup();
    setIsReceiving(false);
    setIsSending(false);
    setReceivingProgress(0);
    setSendingProgress(0);
    setError(null);
    setReceivingDetails({
      chunksReceived: 0,
      totalChunks: 0,
      messageId: null,
      estimatedSize: 0
    });
    currentMessageRef.current = null;
  }, [sessionManager]);

  /**
   * Get human-readable file size
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    // States
    isReceiving,
    receivingProgress,
    receivingDetails: {
      ...receivingDetails,
      formattedSize: formatFileSize(receivingDetails.estimatedSize)
    },
    isSending,
    sendingProgress,
    error,
    
    // Functions
    sendPackages,
    cleanup,
    formatFileSize,
    handleChunkMetadata,
    handleChunk,
    
    // Status helpers
    isActive: isReceiving || isSending,
    canSend: !isReceiving && !isSending && openTokSessionSingleton.isSessionAvailable(),
  };
}; 
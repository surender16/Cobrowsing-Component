import { useState, useRef, useCallback } from 'react';
import { ChunkedSessionManager } from '../services/ChunkedSessionManager';
import { getPackagesByIds } from '../utils/packageLookup';

/**
 * Hook for handling ID-based comparison data reception
 * Reconstructs full package objects from IDs received via OpenTok signals
 */
export const useChunkedComparisonSync = () => {
    const [isReceiving, setIsReceiving] = useState(false);
    const [receivingProgress, setReceivingProgress] = useState(0);
    const [receivingDetails, setReceivingDetails] = useState({ current: 0, total: 0 });
    const [error, setError] = useState(null);

    const chunkedManagerRef = useRef(null);
    const dataReceivedCallbackRef = useRef(null);

    // Initialize the chunked session manager
    const initializeManager = useCallback(() => {
        if (!chunkedManagerRef.current) {
            chunkedManagerRef.current = new ChunkedSessionManager();
            console.log('🎭 Initialized ChunkedSessionManager for comparison sync');
        }
        return chunkedManagerRef.current;
    }, []);

    /**
     * Handle chunk metadata signal
     */
    const handleChunkMetadata = useCallback((event) => {
        console.log('🎭 Comparison: Received chunk metadata signal');

        try {
            const manager = initializeManager();
            const metadataResult = manager.handleChunkMetadata(event);

            if (metadataResult && metadataResult.totalChunks) {
                console.log(`🎭 Comparison: Expecting ${metadataResult.totalChunks} chunks`);
                setIsReceiving(true);
                setReceivingProgress(0);
                setReceivingDetails({ current: 0, total: metadataResult.totalChunks });
                setError(null);
            }
        } catch (err) {
            console.error('🎭 Comparison: Error handling chunk metadata:', err);
            setError(err.message);
        }
    }, [initializeManager]);

    /**
     * Handle individual chunk signal
     */
    const handleChunk = useCallback((event) => {
        console.log('🎭 Comparison: Received chunk signal');

        try {
            const manager = initializeManager();
            const result = manager.handleChunk(event);

            if (result) {
                const { receivedChunks, totalChunks, progress, isComplete, reassembledData } = result;

                console.log(`🎭 Comparison: Progress ${progress.toFixed(1)}% (${receivedChunks}/${totalChunks})`);
                setReceivingProgress(progress);
                setReceivingDetails({ current: receivedChunks, total: totalChunks });

                if (isComplete && reassembledData) {
                    console.log('🎭 Comparison: All chunks received, data reassembled');
                    setIsReceiving(false);
                    setReceivingProgress(100);

                    // Parse the comparison data
                    try {
                        const comparisonData = JSON.parse(reassembledData);
                        console.log('🎭 Comparison: Parsed comparison data:', {
                            action: comparisonData.action,
                            packageIdsCount: comparisonData.packageIds?.length,
                            packageIds: comparisonData.packageIds,
                            userType: comparisonData.userType
                        });

                        // Reconstruct packages from IDs
                        const compareList = getPackagesByIds(comparisonData.packageIds || []);
                        console.log('🎭 Comparison: Reconstructed packages from IDs:', {
                            requestedIds: comparisonData.packageIds?.length,
                            foundPackages: compareList.length
                        });

                        // Create the full comparison data with reconstructed packages
                        const fullComparisonData = {
                            ...comparisonData,
                            compareList: compareList
                        };

                        // Trigger the callback with the received comparison data
                        if (dataReceivedCallbackRef.current) {
                            dataReceivedCallbackRef.current(fullComparisonData);
                        }

                        // Reset progress after a short delay
                        setTimeout(() => {
                            setReceivingProgress(0);
                            setReceivingDetails({ current: 0, total: 0 });
                            manager.resetChunkStorage();
                        }, 1000);

                    } catch (parseErr) {
                        console.error('🎭 Comparison: Failed to parse reassembled data:', parseErr);
                        setError('Failed to parse comparison data');
                        setIsReceiving(false);
                    }
                }
            }
        } catch (err) {
            console.error('🎭 Comparison: Error handling chunk:', err);
            setError(err.message);
            setIsReceiving(false);
        }
    }, [initializeManager]);

    /**
     * Set the callback for when comparison data is received
     */
    const setDataReceivedCallback = useCallback((callback) => {
        dataReceivedCallbackRef.current = callback;
    }, []);

    /**
     * Cleanup function
     */
    const cleanup = useCallback(() => {
        if (chunkedManagerRef.current) {
            chunkedManagerRef.current.resetChunkStorage();
            chunkedManagerRef.current = null;
        }
        setIsReceiving(false);
        setReceivingProgress(0);
        setReceivingDetails({ current: 0, total: 0 });
        setError(null);
        dataReceivedCallbackRef.current = null;
    }, []);

    return {
        isReceiving,
        receivingProgress,
        receivingDetails,
        error,
        handleChunkMetadata,
        handleChunk,
        setDataReceivedCallback,
        cleanup
    };
};

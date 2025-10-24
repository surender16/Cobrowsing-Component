import { useState, useEffect, useCallback } from 'react';
import { getPackagesByIds, extractPackageIds } from '../utils/packageLookup';
import { syncManager } from '../sync/syncManager';

// Legacy signal constants removed – unified syncManager handles compareSet via COMPARE_SELECT

export const useComparePackages = (userType = 'agent') => {
  const [compareList, setCompareList] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const getCompareIds = useCallback(() => extractPackageIds(compareList), [compareList]);

  // applySelection retained for potential future modal sync; currently unused so commented to avoid lint error
  const applySelection = useCallback((ids) => {
    const packages = getPackagesByIds(ids);
    compareIdsRef.current = ids;
    setCompareList(packages);
  }, []);

  const broadcastSelection = useCallback(() => {
    if (userType === 'agent') {
      // Broadcast full compareSet by reapplying each id; simplified for now
      compareList.forEach(pkg => syncManager.toggleCompare(pkg.id, true));
    }
  }, [compareList, userType]);

  const updateCompareList = useCallback((updater, { broadcast = true } = {}) => {
    setCompareList(prev => {
      const next = updater(prev);
      if (broadcast) broadcastSelection();
      return next;
    });
  }, [broadcastSelection]);

  const addToCompare = useCallback((pkg, { broadcast = true } = {}) => {
    updateCompareList(prev => {
      if (prev.some(item => item.id === pkg.id)) return prev;
      return [...prev, pkg];
    }, { broadcast });
  }, [updateCompareList]);

  const removeFromCompare = useCallback((packageId, { broadcast = true } = {}) => {
    updateCompareList(prev => prev.filter(pkg => pkg.id !== packageId), { broadcast });
  }, [updateCompareList]);

  const batchAddToCompare = useCallback((packages, { broadcast = true } = {}) => {
    updateCompareList(() => {
      const uniqueMap = new Map();
      packages.forEach(pkg => {
        if (pkg?.id) {
          uniqueMap.set(pkg.id, pkg);
        }
      });
      return Array.from(uniqueMap.values());
    }, { broadcast });
  }, [updateCompareList]);

  const clearComparison = useCallback(() => {
    setCompareList([]);
    if (userType === 'agent') broadcastSelection();
  }, [broadcastSelection, userType]);

  const openComparison = useCallback(() => {
    setIsComparisonOpen(true);
  }, []);

  // confirmOpenComparison removed (unused)

  const closeComparison = useCallback(() => { setIsComparisonOpen(false); }, []);

  useEffect(() => {
    const unsubscribe = syncManager.onStateChange(state => {
      const ids = state.selection.compareSet || [];
      const pkgs = getPackagesByIds(ids);
      setCompareList(pkgs);
    });
    return unsubscribe;
  }, []);

  const getBestValue = useCallback(() => {
    if (compareList.length === 0) return null;
    return compareList.reduce((best, current) => {
      const bestPrice = best.price?.discounted || best.price;
      const currentPrice = current.price?.discounted || current.price;
      return currentPrice < bestPrice ? current : best;
    });
  }, [compareList]);

  // Set compare list by IDs (atomic update and broadcast)
  const setCompareIds = useCallback((ids, { broadcast = true } = {}) => {
    const pkgs = getPackagesByIds(ids);
    setCompareList(pkgs);
    if (broadcast && userType === 'agent') {
      // Broadcast the full compare set atomically
      syncManager.applyLocalAction({
        type: 'COMPARE_SELECT',
        data: { packageId: ids, selected: true, batch: true }
      });
    }
  }, [userType]);
  
  const isInComparison = useCallback((id) => compareList.some(pkg => pkg.id === id), [compareList]);
  const isComparisonFull = useCallback(() => compareList.length >= 3, [compareList]);

  return {
    compareList,
    isComparisonOpen,
    addToCompare,
    batchAddToCompare,
    removeFromCompare,
    clearComparison,
    openComparison,
    closeComparison,
    getBestValue,
    isInComparison,
    isComparisonFull,
    getCompareIds,
    setCompareIds
  };
};


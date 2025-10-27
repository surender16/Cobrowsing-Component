import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Share as ShareIcon,
  Compare as CompareIcon,
} from "@mui/icons-material";
import CustomerCatalogView from "../../../../components/CustomerCatalogView";
import TourComparisonModal from "../../../../components/Compare/TourComparisonModal";
import { useComparePackages } from "../../../../hooks/useComparePackages";
import { getPackagesByIds } from "../../../../utils/packageLookup";
import { syncManager } from '../../../../sync/syncManager';

const PackageShareDialog = ({
  open,
  onClose,
  sharedPackages,
  userType = "customer",
  packageDetailsToOpen = null,
  onPackageDetailsOpened = () => {},
  sendPackageDetailsAction = null,
  sendComparisonAction = null
}) => {
  // Use the comparison hook
  const {
    compareList,
    isComparisonOpen,
    addToCompare,
    batchAddToCompare,
    removeFromCompare,
    clearComparison,
    getBestValue,
    openComparison,
    closeComparison,
    isInComparison,
    isComparisonFull,
  } = useComparePackages(userType);

  useEffect(() => { console.log("🎭 PackageShareDialog open changed:", open); }, [open]);

  // Effect to log when packages change
  useEffect(() => {
    console.log("🎭 PackageShareDialog: sharedPackages changed:", sharedPackages);
  }, [sharedPackages]);

  // Unified sync subscription for comparison modal open/close
  useEffect(() => {
    const unsub = syncManager.onStateChange(state => {
      const cmp = state.metadata?.detail?.comparison;
      if (!cmp) return;
      if (cmp.open) {
        const ids = cmp.packageIds || [];
        if (ids.length) {
          const pkgs = getPackagesByIds(ids);
          batchAddToCompare(pkgs);
        } else if (compareList.length === 0 && sharedPackages.length > 0) {
          batchAddToCompare(sharedPackages);
        }
        openComparison({ silent: true });
      } else if (cmp.open === false) {
        closeComparison();
      }
    });
    return unsub;
  }, [batchAddToCompare, openComparison, closeComparison, sharedPackages, compareList.length]);
  

  const handleOpenComparison = () => {
    console.log("🎭 Opening comparison drawer with", compareList.length, "packages");

    // If customer has no packages in comparison but has shared packages, add them
    const packagesToCompare = compareList.length > 0 ? compareList : sharedPackages;
    const packageIds = packagesToCompare.map(p => p.id);
    
    console.log("🎭 Sending comparison open signal to agent with package IDs:", packageIds);

    // Send signal to agent to sync comparison with action and package IDs
    if (sendComparisonAction) {
      console.log("🎭 Calling sendComparisonAction prop function with customer-opened-comparison action");
      sendComparisonAction('customer-opened-comparison', packageIds);
    }

    openComparison();
  };


  const handleCloseComparison = () => {
    console.log("🎭 Closing comparison drawer");
    
    // Send signal to agent to close comparison
    if (sendComparisonAction) {
      console.log("🎭 Sending close comparison signal to agent");
      const packageIds = compareList.map(p => p.id);
      sendComparisonAction('close-comparison', packageIds);
    }
    
    closeComparison();
  };

  return (
    <>
      {/* Shared Tour Packages Card Grid (browse mode) */}
      {!isComparisonOpen && (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            <ShareIcon /> Shared Tour Packages ({sharedPackages.length})
          </DialogTitle>
          <DialogContent sx={{ p: 0, flex: 1, overflow: "hidden" }}>
            <CustomerCatalogView
              sharedPackages={sharedPackages}
              onInterested={() => { }}
              packageDetailsToOpen={packageDetailsToOpen}
              onPackageDetailsOpened={onPackageDetailsOpened}
              sendPackageDetailsAction={sendPackageDetailsAction}
              userType={userType}
              compareList={compareList}
              addToCompare={addToCompare}
              removeFromCompare={removeFromCompare}
              isInComparison={isInComparison}
              isComparisonFull={isComparisonFull}
              onComparePackages={handleOpenComparison}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Button onClick={onClose} variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Comparison Modal */}
      <TourComparisonModal
        open={isComparisonOpen}
        onClose={handleCloseComparison}
        compareList={compareList}
        onRemoveFromCompare={removeFromCompare}
        onClearComparison={clearComparison}
        getBestValue={getBestValue}
        userType="customer"
        sharedPackages={sharedPackages}
        sendComparisonAction={sendComparisonAction}
      />
    </>
  );
};

export default PackageShareDialog; 
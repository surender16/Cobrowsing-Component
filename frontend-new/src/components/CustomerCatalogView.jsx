import React, { useState, useEffect } from "react";
import {
  DialogContent,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Grow,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { useUnifiedScrollSync } from "../hooks/useUnifiedScrollSync";
import PackageDetailsModal from "./PackageDetailsModal";

const CustomerCatalogView = ({
  sharedPackages = [],
  onInterested = () => { },
  packageDetailsToOpen = null,
  sendPackageDetailsAction = null,
  userType = "customer", // 'agent' or 'customer'
  // Comparison props
  compareList = [],
  addToCompare = () => {},
  removeFromCompare = () => {},
  isInComparison = () => false,
  isComparisonFull = false,
  onComparePackages = () => {},
}) => {
  // Local state for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Co-browse scroll sync hook
  const { scrollRef, isActiveController } = useUnifiedScrollSync(userType, true, 'catalog');

  // Effect to handle opening modal from other party's signal (handled by parent)
  useEffect(() => {
    if (packageDetailsToOpen) {
      console.log(`📦 [${userType}] Opening modal from parent signal with package:`, packageDetailsToOpen.id);
      setSelectedPackage(packageDetailsToOpen);
      setModalOpen(true);
    }
  }, [packageDetailsToOpen, userType]);

  // Modal handlers
  const handleOpenModal = (pkg) => {
    console.log(`[${userType} Catalog] Opening modal for package:`, pkg.id);
    setSelectedPackage(pkg);
    setModalOpen(true);

    // Send signal to other party to open the same modal
    if (sendPackageDetailsAction) {
      const action = userType === 'agent' ? 'agent-opened-package-details' : 'customer-opened-package-details';
      console.log(`[${userType} Catalog] Sending signal to open package details:`, action);
      sendPackageDetailsAction(action, pkg);
    }
  };

  const handleCloseModal = () => {
    console.log(`[${userType} Catalog] Closing modal`);
    setModalOpen(false);
    setSelectedPackage(null);

    // Send signal to other party to close the same modal
    if (sendPackageDetailsAction) {
      console.log(`[${userType} Catalog] Sending signal to close package details`);
      sendPackageDetailsAction('close-package-details');
    }
  };

  // Debug logging moved to useEffect to prevent re-renders

  return (
    <Box sx={{ position: 'relative', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <DialogContent
        sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Header with sync indicator */}
        <Box sx={{
          p: 3,
          bgcolor: "primary.main",
          color: "white",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">
            Shared Tour Packages ({sharedPackages.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {userType === 'customer' && (
              <Chip
                label="From Agent"
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              />
            )}


            {/* {isActiveController && (
            <Chip
              label="You're controlling scroll"
              size="small"
              sx={{
                bgcolor: "rgba(76, 175, 80, 0.9)",
                color: "white",
              }}
            />
          )} */}
            {!isActiveController && (
              <Chip
                label={`Synced with ${userType === 'agent' ? 'customer' : 'agent'}`}
                size="small"
                sx={{
                  bgcolor: "rgba(33, 150, 243, 0.9)",
                  color: "white",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Scrollable Packages Grid */}
        <Box
          ref={scrollRef}
          id="agent-catalog-scroll"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            // Add visual indicator when this side is actively controlling
            borderLeft: isActiveController ? '4px solid' : 'none',
            borderColor: 'success.main',
            // Prevent scroll conflicts
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          }}
        >
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            {/* Remove debugging logs that cause re-renders */}
            {sharedPackages.map((pkg, index) => {
              return (
                <Grid sx={{ width: "250px" }} item xs={3} sm={3} md={3} lg={3} key={pkg.id}>
                  <Grow
                    in={true}
                    timeout={300 + (index * 100)}
                    style={{ transformOrigin: '0 0 0' }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        position: "relative",
                        borderRadius: 3,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "1px solid transparent",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.02)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                          "& .package-image": {
                            transform: "scale(1.05)",
                          },
                          "& .view-details-hint": {
                            opacity: 1,
                            transform: "translateY(0)",
                          },
                        },
                      }}
                      onClick={() => handleOpenModal(pkg)}
                    >
                      {/* Compare Button */}
                      <Tooltip title={isInComparison(pkg.id) ? "Remove from comparison" : "Add to comparison"}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInComparison(pkg.id)) {
                              removeFromCompare(pkg.id);
                            } else {
                              addToCompare(pkg);
                            }
                          }}
                          disabled={!isInComparison(pkg.id) && isComparisonFull()}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 3,
                            bgcolor: isInComparison(pkg.id) ? "success.main" : "rgba(255, 255, 255, 0.9)",
                            color: isInComparison(pkg.id) ? "white" : "primary.main",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            "&:hover": {
                              bgcolor: isInComparison(pkg.id) ? "success.dark" : "white",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {isInComparison(pkg.id) ? <CheckIcon /> : <AddIcon />}
                        </IconButton>
                      </Tooltip>

                      {/* Package Image */}
                      <Box
                        sx={{
                          height: 180,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          className="package-image"
                          component="img"
                          image={pkg.image}
                          alt={pkg.name}
                          sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                        />

                        {/* Hover Overlay for Details */}
                        <Box
                          className="view-details-hint"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(0, 0, 0, 0.3)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                            }}
                          >
                            Click to View Details
                          </Typography>
                        </Box>

                        {/* Recommended Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            left: 12,
                            bgcolor: "rgba(76, 175, 80, 0.95)",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          RECOMMENDED
                        </Box>

                        {/* Type Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            zIndex: 2,
                          }}
                        >
                          <Chip
                            label={pkg.type}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 255, 255, 0.95)",
                              color: "primary.main",
                              fontWeight: 600,
                              backdropFilter: "blur(10px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        {/* Package Name */}
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            lineHeight: 1.2,
                            mb: 1,
                            minHeight: "2.4rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {pkg.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            fontSize: "0.8rem",
                            lineHeight: 1.4,
                            minHeight: "3.6rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {pkg.description}
                        </Typography>

                        {/* Price and Action */}
                        <Box sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: "auto"
                        }}>
                          <Typography
                            variant="h6"
                            color="primary.main"
                            sx={{
                              fontSize: "1.1rem",
                              fontWeight: 700,
                            }}
                          >
                            £{(pkg.price?.discounted || pkg.price)?.toLocaleString?.('en-US') || pkg.price?.discounted || pkg.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: "success.main",
                              "&:hover": {
                                bgcolor: "success.dark",
                                transform: "scale(1.05)",
                              },
                              fontSize: "0.7rem",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => onInterested(pkg)}
                          >
                            Interested
                          </Button>
                        </Box>

                        {/* View Details Button */}
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(pkg);
                            }}
                            sx={{
                              fontWeight: 600,
                              py: 1,
                              borderWidth: 2,
                              "&:hover": {
                                bgcolor: "primary.main",
                                color: "white",
                                borderWidth: 2,
                                transform: "scale(1.02)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              );
            })}
          </Grid>

          {/* Empty State */}
          {sharedPackages.length === 0 && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No packages shared yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your agent will share personalized travel packages during the call
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Badge badgeContent={compareList.length} color="error">
            <Button
              variant="contained"
              size="large"
              startIcon={<CompareArrowsIcon />}
              onClick={onComparePackages}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                py: 1.5,
                px: 3,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: "bold",
                boxShadow: "0 8px 24px rgba(25, 118, 210, 0.4)",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(25, 118, 210, 0.5)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Compare Packages
            </Button>
          </Badge>
        </Box>
      )}

      {/* Package Details Modal */}
      {modalOpen && (
        <PackageDetailsModal
          open={modalOpen}
          onClose={handleCloseModal}
          packageData={selectedPackage}
          userType={userType}
        />
      )}
    </Box>
  );
};

export default CustomerCatalogView; 
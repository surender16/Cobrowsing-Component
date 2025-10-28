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
  Paper,
  Checkbox,
  Slider,
  FormGroup,
  FormControlLabel,
  Button,
  Divider,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  FilterList,
  CompareArrows as CompareIcon,
  Compare as CompareActiveIcon,
} from "@mui/icons-material";
import { useEnhancedScrollSync } from "../hooks/useEnhancedScrollSync";
import { samplePackageData } from "../data/samplePackageData";
import PackageDetailsModal from "./PackageDetailsModal";

// Use centralized package data
const tourPackages = samplePackageData;

const holidayTypes = [
  "Hotels & Stay",
  "Cruise & Stay",
  "Multi-Centre"
];

const regions = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa"
];

const AgentCatalog = ({
  selectedPackages,
  onPackageSelect,
  clearSelectedPackages,
  sharedPackages = [],
  isSharingPackages = false, // eslint-disable-line no-unused-vars
  sharingProgress = 0, // eslint-disable-line no-unused-vars
  sharingStatus = '', // eslint-disable-line no-unused-vars
  packageDetailsToOpen = null,
  sendPackageDetailsAction = null,
  // Comparison props
  compareList = [],
  addToCompare = () => { },
  removeFromCompare = () => { },
  isInComparison = () => false,
  isComparisonFull = () => false,
  onComparePackages = () => { },
  sendComparisonAction = null,
}) => {
  // Filter states
  const [priceRange, setPriceRange] = useState([500, 3000]);
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState(tourPackages);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Enhanced scroll sync hook (unified container id across agent/customer shared lists)
  const { scrollRef, isLeader: isActiveController } = useEnhancedScrollSync({ containerId: 'shared-packages', userType: 'agent', enabled: true, throttleMs: 80 });

  // Effect to handle opening/closing modal from customer signal (handled by parent)
  useEffect(() => {
    if (packageDetailsToOpen) {
      // Incoming open signal
      console.log(`📦 [agent] Opening modal from parent signal with package:`, packageDetailsToOpen.id);
      setSelectedPackage(packageDetailsToOpen);
      setModalOpen(true);
    } else {
      // Incoming close signal
      console.log(`[Agent Catalog] Closing modal from parent signal`);
      setModalOpen(false);
      setSelectedPackage(null);
    }
  }, [packageDetailsToOpen, modalOpen]);

  // Filter packages based on price range, holiday types, and regions
  useEffect(() => {
    let filtered = tourPackages.filter((pkg) => {
      const packagePrice = pkg.price?.discounted || pkg.price;
      return packagePrice >= priceRange[0] && packagePrice <= priceRange[1];
    });

    if (selectedHolidayTypes.length > 0) {
      filtered = filtered.filter((pkg) => selectedHolidayTypes.includes(pkg.holidayType || pkg.type));
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter((pkg) => selectedRegions.includes(pkg.region));
    }

    setFilteredPackages(filtered);
  }, [priceRange, selectedHolidayTypes, selectedRegions]);

  const handleHolidayTypeFilterChange = (type) => {
    setSelectedHolidayTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRegionFilterChange = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  // Modal handlers
  const handleOpenModal = (pkg) => {
    console.log("[Agent Catalog] handleOpenModal called with package:", pkg.id);

    // Set state in a single batch to prevent multiple re-renders
    setSelectedPackage(pkg);
    setModalOpen(true);

    // Send signal to customer to open the same modal using parent's signal function
    // Send signal for any agent-initiated opens, let receiver handle duplicates
    if (sendPackageDetailsAction) {
      // Always send open signal to ensure both sides stay in sync
      console.log("[Agent Catalog] Sending signal to customer to open package details");
      sendPackageDetailsAction('agent-opened-package-details', pkg);
    } else {
      console.log("[Agent Catalog] Not sending signal - no signal function provided");
    }
  };

  const handleCloseModal = () => {
    console.log("[Agent Catalog] Closing modal");
    setModalOpen(false);
    setSelectedPackage(null);

    // Send signal to customer to close the same modal using parent's signal function
    // Send signal on any close by agent - the receiver will handle deduplication
    if (sendPackageDetailsAction) {
      // Send close signal regardless of incoming state to ensure both sides stay in sync
      console.log("[Agent Catalog] Sending signal to close package details");
      sendPackageDetailsAction('close-package-details');
    } else {
      console.log("[Agent Catalog] Not sending signal - no signal function provided");
    }
  };

  console.log("[Agent Catalog] Scroll sync active controller:", isActiveController);

  return (
    <DialogContent
      sx={{ p: 0, height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Filter Icon and Collapsible Filters Section */}
      <Box sx={{ p: 2, bgcolor: "grey.50", borderBottom: 1, borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Tour Packages
            <Chip
              label={`${selectedPackages.length} selected`}
              size="small"
              color="primary"
              sx={{ ml: 2, fontWeight: "bold" }}
            />

            {/* Comparison Notification */}
            {compareList && compareList.length > 0 && (
              <Chip
                label={`${compareList.length} packages to compare`}
                size="small"
                color="secondary"
                sx={{
                  ml: 2,
                  fontWeight: 600,
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.7 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
            )}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
              sx={{
                color: "primary.main",
                bgcolor: "white",
                border: "1px solid",
                borderColor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
              }}
            >
              <FilterList />
            </IconButton>



            {/* {isActiveController && (
              <Chip
                label="You're controlling scroll"
                size="small"
                color="primary"
              />
            )} */}
          </Box>
        </Box>

        <Collapse in={!isFiltersCollapsed}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "primary.main" }}>
              Filter Packages
            </Typography>

            <Grid container spacing={3}>
              {/* Price Range Filter */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Price Range: £{priceRange[0].toLocaleString("en-US")} - £
                  {priceRange[1].toLocaleString("en-US")}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) =>
                    `£${value.toLocaleString("en-US")}`
                  }
                  min={500}
                  max={3000}
                  step={50}
                  sx={{ width: "90%" }}
                />
              </Grid>

              {/* Holiday Type Filter */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Holiday Type
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {holidayTypes.map((type) => (
                      <Grid item xs={12} key={type}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedHolidayTypes.includes(type)}
                              onChange={() => handleHolidayTypeFilterChange(type)}
                              size="small"
                            />
                          }
                          label={type}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.9rem",
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>

              {/* Region Filter */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Region
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {regions.map((region) => (
                      <Grid item xs={12} key={region}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(region)}
                              onChange={() => handleRegionFilterChange(region)}
                              size="small"
                            />
                          }
                          label={region}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.9rem",
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
            </Grid>

            {/* Clear Filters */}
            <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setPriceRange([500, 3000]);
                  setSelectedHolidayTypes([]);
                  setSelectedRegions([]);
                }}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => {
                  setPriceRange([500, 3000]);
                  setSelectedHolidayTypes([]);
                  setSelectedRegions([]);
                  setFilteredPackages(tourPackages);
                  // Clear selected packages for sharing
                  if (clearSelectedPackages) {
                    clearSelectedPackages();
                  }
                }}
                sx={{
                  bgcolor: "error.main",
                  "&:hover": {
                    bgcolor: "error.dark",
                  },
                }}
              >
                Reset All
              </Button>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                Showing {filteredPackages.length} of {tourPackages.length} packages
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>

      <Divider />

      {/* Scrollable Packages Grid */}
      <Box
        ref={scrollRef}
        id="shared-packages-scroll-agent"
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          // Add visual indicator when this side is actively controlling
          borderLeft: isActiveController ? '4px solid' : 'none',
          borderColor: 'primary.main',
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
          {filteredPackages.map((pkg, index) => (
            <Grid sx={{ width: "250px" }} item xs={3} sm={3} md={3} lg={3} key={pkg.id}>
              <Grow
                in={true}
                timeout={300 + index * 100}
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper
                  elevation={selectedPackages.includes(pkg.id) ? 8 : 2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isInComparison(pkg.id) ? "3px solid #4caf50" :
                      selectedPackages.includes(pkg.id) ? "3px solid" : "2px solid transparent",
                    borderColor: isInComparison(pkg.id) ? "#4caf50" :
                      selectedPackages.includes(pkg.id) ? "primary.main" : "transparent",
                    boxShadow: isInComparison(pkg.id) ? "0 8px 25px rgba(76, 175, 80, 0.3)" :
                      selectedPackages.includes(pkg.id) ? "0 8px 25px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.1)",
                    transition:
                      "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      "& .package-checkbox": {
                        opacity: 1,
                        transform: "scale(1.1)",
                      },
                      "& .package-image": {
                        transform: "scale(1.05)",
                      },
                      "& .package-price": {
                        color: "secondary.main",
                        transform: "scale(1.05)",
                      },
                      "& .view-details-button": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                      "& .hover-overlay": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Selection Checkbox */}
                  <Checkbox
                    className="package-checkbox"
                    checked={selectedPackages.includes(pkg.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      console.log("🔘 Checkbox clicked for package:", pkg.id, "Current selectedPackages:", selectedPackages);
                      onPackageSelect(pkg.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 3,
                      bgcolor: selectedPackages.includes(pkg.id)
                        ? "rgba(76, 175, 80, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                      color: selectedPackages.includes(pkg.id) ? "white" : "primary.main",
                      borderRadius: "50%",
                      padding: "8px",
                      opacity: selectedPackages.includes(pkg.id) ? 1 : 0.7,
                      transition: "all 0.3s ease",
                      boxShadow: selectedPackages.includes(pkg.id)
                        ? "0 4px 12px rgba(76, 175, 80, 0.4)"
                        : "0 4px 12px rgba(0,0,0,0.15)",
                      "&:hover": {
                        bgcolor: selectedPackages.includes(pkg.id)
                          ? "rgba(76, 175, 80, 1)"
                          : "rgba(255, 255, 255, 1)",
                        transform: "scale(1.1)",
                      },
                      "&.Mui-checked": {
                        color: "white",
                        bgcolor: "rgba(76, 175, 80, 0.95)",
                      },
                    }}
                  />

                  {/* Add to Compare Button */}
                  <Tooltip title={
                    isInComparison(pkg.id)
                      ? "Remove from comparison"
                      : isComparisonFull()
                        ? "Maximum 3 packages for comparison"
                        : "Add to comparison"
                  }>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();

                        // Add click animation
                        e.target.style.transform = "scale(0.8)";
                        setTimeout(() => {
                          e.target.style.transform = "scale(1)";
                        }, 150);

                        if (isInComparison(pkg.id)) {
                          removeFromCompare(pkg.id);
                        } else if (!isComparisonFull()) {
                          addToCompare(pkg);
                        }
                      }}
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 3,
                        bgcolor: isInComparison(pkg.id) ? "secondary.main" : "rgba(255, 255, 255, 0.95)",
                        color: isInComparison(pkg.id) ? "white" : "primary.main",
                        borderRadius: "50%",
                        padding: "8px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        border: isInComparison(pkg.id) ? "2px solid white" : "2px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          bgcolor: isInComparison(pkg.id) ? "secondary.dark" : "rgba(255, 255, 255, 1)",
                          transform: "scale(1.1)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                        },
                        "&:disabled": {
                          opacity: 0.5,
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    >
                      <CompareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Comparison Selected Badge */}
                  {/* {isInComparison(pkg.id) && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 60, // Adjust position to avoid overlap with checkbox
                        zIndex: 3,
                        bgcolor: "success.main",
                        color: "white",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.4)",
                      }}
                    >
                      ✓
                    </Box>
                  )} */}

                  {/* View Details Button - Overlay on image */}
                  <Box
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(pkg);
                    }}
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      zIndex: 3,
                      opacity: 0,
                      transform: "translateY(-10px)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    {/* <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.8)",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      View Details
                    </Button> */}
                  </Box>


                  {/* Package Image */}
                  <Box
                    sx={{
                      height: 180,
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(pkg);
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
                      className="hover-overlay"
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

                    {/* Type Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
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

                    {/* Shared Badge */}
                    {sharedPackages.find(shared => shared.id === pkg.id) && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          zIndex: 2,
                        }}
                      >
                        <Chip
                          label="Shared"
                          size="small"
                          color="success"
                          sx={{
                            bgcolor: "rgba(76, 175, 80, 0.95)",
                            color: "white",
                            fontWeight: 600,
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        />
                      </Box>
                    )}
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

                    {/* Price and Selection */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                      }}
                    >
                      <Typography
                        className="package-price"
                        variant="h6"
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "primary.main",
                          transition: "all 0.3s ease",
                        }}
                      >
                        £{(pkg.price?.discounted || pkg.price)?.toLocaleString?.("en-US") || pkg.price?.discounted || pkg.price}
                      </Typography>

                      {selectedPackages.includes(pkg.id) && (
                        <Chip
                          label="Selected"
                          size="small"
                          color="success"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.05)" },
                              "100%": { transform: "scale(1)" },
                            },
                          }}
                        />
                      )}
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
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {filteredPackages.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No packages match your filters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your price range or package type filters
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sticky Footer for Comparison */}
      {compareList.length > 0 && (
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#c8e6c9',
            color: 'black',
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              from: {
                transform: 'translateY(100%)',
                opacity: 0,
              },
              to: {
                transform: 'translateY(0)',
                opacity: 1,
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CompareActiveIcon />
            <Typography variant="h6" fontWeight="bold">
              {compareList.length}/3 Selected
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {compareList.length === 3 ? 'Maximum reached' : `Add ${3 - compareList.length} more`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => {
                console.log("[Agent Catalog] Compare Packages button clicked");
                console.log("[Agent Catalog] compareList:", compareList);
                try {
                  if (sendComparisonAction && Array.isArray(compareList) && compareList.length > 0) {
                    const ids = compareList.map((p) => (p && p.id ? p.id : p));
                    console.log("[Agent Catalog] Sending comparison open signal with ids:", ids);
                    sendComparisonAction('agent-opened-comparison', ids);
                  }
                } catch (err) {
                  console.warn('[Agent Catalog] Error sending comparison signal', err);
                }

                onComparePackages();
              }}
              sx={{
                fontWeight: 'bold',
                px: 3,
                py: 1,
                mr: 2,
                minWidth: 160,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Compare Packages
            </Button>
          </Box>
        </Box>
      )}

      {/* Package Details Modal */}
      {modalOpen && (
        <PackageDetailsModal
          open={modalOpen}
          onClose={handleCloseModal}
          packageData={selectedPackage}
          userType="agent"
        />
      )}
    </DialogContent>
  );
};

export default AgentCatalog; 
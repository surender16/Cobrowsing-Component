import React, { useState, useEffect, useRef,useCallback  } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardMedia,
  Chip, 
  Button,
  Paper,
  Stack,
  Rating,
  Divider,
  Avatar,
  Tab,
  Tabs,
  Badge,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fade,
  Zoom,
  Slide,
  Collapse,
  Backdrop,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Fab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Add as AddIcon,
  KeyboardArrowLeft as LeftArrowIcon,
  KeyboardArrowRight as RightArrowIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  LocalActivity as ActivityIcon,
  PhotoCamera as PhotoIcon,
  EmojiEvents as HighlightIcon,
  FavoriteBorder as FavoriteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  LocalPhone as PhoneIcon,
  Email as EmailIcon,
  Language as WebIcon,
  CreditCard as CreditCardIcon,
  Lock as LockIcon,
  Payment as PaymentIcon,
  VerifiedUser as VerifiedUserIcon,
  Sync as SyncIcon,
  AccountCircle as AccountIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useEnhancedScrollSync } from '../hooks/useEnhancedScrollSync';
import { usePackageDetailsCoBrowse } from '../hooks/usePackageDetailsCoBrowse';
import ActivitiesModal from './ActivitiesModal';
import { useCoBrowseScrollSync } from '../hooks/useCoBrowseScrollSync';
// removed duplicate import of useUnifiedScrollSync

const PackageDetailsModal = ({ open, onClose, packageData, userType = 'customer' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [isImageSlideshow, setIsImageSlideshow] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isFloatingButtonsVisible, setIsFloatingButtonsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]); // Store selected activities
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0); // 0: Order Summary, 1: Payment Details, 2: Thank You
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    agreeToTerms: false,
  });
  const [paymentFormFilledBy, setPaymentFormFilledBy] = useState(null); // Track who is filling the form

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const slideshowInterval = useRef(null);
  const hasSentOpenSignalRef = useRef(false);
  const lastManualSyncAtRef = useRef(0);
  const lastManualSyncTopRef = useRef(0);  
  const lastBoundaryRef = useRef(null);

  // Use scroll sync hook for package details (enabled only when modal is open)
  // New unified scroll sync (percent-based via OpenTok)
  const { scrollRef, isLeader, syncStatus } = useEnhancedScrollSync({
    containerId: 'package-details',
    userType,
    enabled: open,
    throttleMs: 30, // Very fast throttle for smooth sync
    immediate: true // Enable immediate sync
  });
  // Backward-compatible flags (not used visually here)
  // const syncStatus = 'idle';
  const syncProgress = 0;
  const syncError = null;
  const resetSync = () => { };
 
  // Add sync status indicator
  useEffect(() => {
    if (syncError) {
      console.log(`📊 [${userType}] Sync error:`, syncError);
    }
  }, [syncError, userType]);

  // Reset sync when modal opens
  useEffect(() => {
    if (open) {
      resetSync();
    }
  }, [open, resetSync]);

  // Use package details co-browsing hook
  const {
    // Incoming actions
    incomingTabChange,
    incomingImageSelect,
    incomingDaySelect,
    incomingFullscreenToggle,
    incomingSlideshowToggle,
    incomingImageNavigate,
    incomingZoomChange,
    incomingComparisonAction,
    incomingPaymentAction,
    incomingPaymentFieldChange,
    incomingModalOpen,
    incomingModalClose,
    incomingActivitiesModalOpen,
    incomingActivitiesModalClose,
    incomingWishlistToggle,
    incomingActivityToggle,
    incomingActivitiesConfirm,

    // Action senders
    sendTabChange,
    sendImageSelect,
    sendDaySelect,
    sendFullscreenToggle,
    sendSlideshowToggle,
    sendImageNavigate,
    sendZoomChange,
    sendPaymentAction,
    sendPaymentFieldChange,
    sendModalOpen,
    sendModalClose,
    sendActivitiesModalOpen,
    sendActivitiesModalClose,
    sendWishlistToggle,
    sendActivityToggle,
    sendActivitiesConfirm,

    // Utility functions
    clearIncomingActions,
  } = usePackageDetailsCoBrowse(userType, true);

  // Effect to handle modal opening and send signal to other party
  useEffect(() => {
    if (open && packageData && !hasSentOpenSignalRef.current) {
      console.log(`📦 [${userType}] Package details modal opened for package:`, packageData.id);
      sendModalOpen(packageData);
      hasSentOpenSignalRef.current = true;
    } else if (!open) {
      // Reset the flag when modal closes
      hasSentOpenSignalRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, packageData?.id, userType]);

  // Reset scroll sync state when modal opens to prevent boundary tracking issues
  useEffect(() => {
    if (open) {
      // Reset boundary tracking state when modal opens
      lastBoundaryRef.current = null;
      lastManualSyncAtRef.current = 0;
      lastManualSyncTopRef.current = 0;
    }
  }, [open]);

  // Effect to handle incoming modal open/close actions
  useEffect(() => {
    if (incomingModalOpen && incomingModalOpen.data?.packageData) {
      console.log(`📦 [${userType}] Received modal open signal for package:`, incomingModalOpen.data.packageData.id);
      // This will be handled by parent components
    }
  }, [incomingModalOpen]);

  // Track if close was initiated by incoming signal
  const closeFromSignalRef = React.useRef(false);

  useEffect(() => {
    if (incomingModalClose && !isClosingRef.current) {
      console.log(`📦 [${userType}] Received modal close signal`);
      isClosingRef.current = true;
      closeFromSignalRef.current = true; // Mark that we're closing due to signal
      onClose();
      // Reset after a short delay
      setTimeout(() => {
        closeFromSignalRef.current = false;
        isClosingRef.current = false;
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingModalClose, onClose]);

  // Effect to handle incoming activities modal open/close actions
  useEffect(() => {
    if (incomingActivitiesModalOpen) {
      console.log(`🎯 [${userType}] Received activities modal open signal:`, incomingActivitiesModalOpen);
      setShowActivitiesModal(true);
    }
  }, [incomingActivitiesModalOpen]);

  useEffect(() => {
    if (incomingActivitiesModalClose) {
      console.log(`🎯 [${userType}] Received activities modal close signal:`, incomingActivitiesModalClose);
      setShowActivitiesModal(false);
    }
  }, [incomingActivitiesModalClose]);

  // Effect to handle incoming tab changes
  useEffect(() => {
    if (incomingTabChange && incomingTabChange.data?.tabIndex !== undefined) {
      console.log(`📦 [${userType}] Received tab change:`, incomingTabChange.data.tabIndex);
      setActiveTab(incomingTabChange.data.tabIndex);
    }
  }, [incomingTabChange]);

  // Wishlist toggle incoming sync
  useEffect(() => {
    if (incomingWishlistToggle && typeof incomingWishlistToggle.data?.isWishlisted === 'boolean') {
      setIsWishlisted(incomingWishlistToggle.data.isWishlisted);
    }
  }, [incomingWishlistToggle]);

  // Activities confirm incoming sync
  useEffect(() => {
    if (incomingActivitiesConfirm && Array.isArray(incomingActivitiesConfirm.data?.selectedActivityIds)) {
      const ids = new Set(incomingActivitiesConfirm.data.selectedActivityIds);
      const full = (packageData?.activities || []).filter(a => ids.has(a.id));
      setSelectedActivities(full);
    }
  }, [incomingActivitiesConfirm, packageData]);

  // Effect to handle incoming image selections
  useEffect(() => {
    if (incomingImageSelect && incomingImageSelect.data?.imageIndex !== undefined) {
      console.log(`📦 [${userType}] Received image select:`, incomingImageSelect.data.imageIndex);
      setSelectedImageIndex(incomingImageSelect.data.imageIndex);
    }
  }, [incomingImageSelect]);

  // Effect to handle incoming day selections
  useEffect(() => {
    if (incomingDaySelect && incomingDaySelect.data?.dayIndex !== undefined) {
      console.log(`📦 [${userType}] Received day select:`, incomingDaySelect.data.dayIndex);
      setSelectedDay(incomingDaySelect.data.dayIndex);
    }
  }, [incomingDaySelect]);

  // Effect to handle incoming day selections from legacy sync
  useEffect(() => {
    if (incomingDaySelect && incomingDaySelect.data?.dayIndex !== undefined) {
      console.log(`📦 [${userType}] Received day select (legacy):`, incomingDaySelect.data.dayIndex);
      setSelectedDay(incomingDaySelect.data.dayIndex);
    }
  }, [incomingDaySelect, userType]);

  // Effect to handle incoming fullscreen toggle
  useEffect(() => {
    if (incomingFullscreenToggle && incomingFullscreenToggle.data?.isFullscreen !== undefined) {
      console.log(`📦 [${userType}] Received fullscreen toggle:`, incomingFullscreenToggle.data.isFullscreen);
      setIsImageFullscreen(incomingFullscreenToggle.data.isFullscreen);
    }
  }, [incomingFullscreenToggle]);

  // Effect to handle incoming slideshow toggle
  useEffect(() => {
    if (incomingSlideshowToggle && incomingSlideshowToggle.data?.isSlideshow !== undefined) {
      console.log(`📦 [${userType}] Received slideshow toggle:`, incomingSlideshowToggle.data.isSlideshow);
      setIsImageSlideshow(incomingSlideshowToggle.data.isSlideshow);
    }
  }, [incomingSlideshowToggle]);

  // Effect to handle incoming image navigation
  useEffect(() => {
    if (incomingImageNavigate && incomingImageNavigate.data?.imageIndex !== undefined) {
      console.log(`📦 [${userType}] Received image navigate:`, incomingImageNavigate.data.imageIndex);
      setSelectedImageIndex(incomingImageNavigate.data.imageIndex);
    }
  }, [incomingImageNavigate]);

  // Effect to handle incoming zoom changes
  useEffect(() => {
    if (incomingZoomChange && incomingZoomChange.data?.zoomLevel !== undefined) {
      console.log(`📦 [${userType}] Received zoom change:`, incomingZoomChange.data.zoomLevel);
      setImageZoom(incomingZoomChange.data.zoomLevel);
    }
  }, [incomingZoomChange]);

  // The useCoBrowseScrollSync hook handles incoming scroll sync internally
  // No need for duplicate handling here

  // Effect to handle incoming comparison actions
  useEffect(() => {
    if (incomingComparisonAction) {
      console.log(`📦 [${userType}] Received comparison action:`, incomingComparisonAction.data);
      // This will be handled by parent components
    }
  }, [incomingComparisonAction]);

  // Effect to handle incoming payment actions (removed duplicate - now handled in line ~508)

  // Effect to handle incoming payment field changes
  useEffect(() => {
    if (incomingPaymentFieldChange && incomingPaymentFieldChange.data) {
      const { fieldName, fieldValue } = incomingPaymentFieldChange.data;
      const fromUserType = incomingPaymentFieldChange.userType;
      console.log(`📦 [${userType}] Received payment field change from ${fromUserType}:`, fieldName, fieldValue);

      setPaymentFormData(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }));

      // Track that form is being filled by the other party (keep it persistent)
      // Only change if it's from a different user than current
      if (fromUserType !== userType) {
        setPaymentFormFilledBy(fromUserType);
      }
    }
  }, [incomingPaymentFieldChange, userType]);

  // Clear incoming actions after processing
  useEffect(() => {
    const hasIncomingActions = incomingTabChange || incomingImageSelect || incomingDaySelect ||
      incomingFullscreenToggle || incomingSlideshowToggle || incomingImageNavigate ||
      incomingZoomChange || incomingComparisonAction ||
      incomingPaymentAction || incomingPaymentFieldChange || incomingModalOpen || incomingModalClose ||
      incomingActivitiesModalOpen || incomingActivitiesModalClose || incomingWishlistToggle ||
      incomingActivityToggle || incomingActivitiesConfirm;

    if (hasIncomingActions) {
      // Clear after a short delay to ensure processing is complete
      setTimeout(() => {
        clearIncomingActions();
      }, 50); // Reduced delay for faster response
    }
  }, [incomingTabChange, incomingImageSelect, incomingDaySelect, incomingFullscreenToggle,
    incomingSlideshowToggle, incomingImageNavigate, incomingZoomChange,
    incomingComparisonAction, incomingPaymentAction, incomingPaymentFieldChange, incomingModalOpen, incomingModalClose,
    incomingActivitiesModalOpen, incomingActivitiesModalClose, incomingWishlistToggle,
    incomingActivityToggle, incomingActivitiesConfirm,
    clearIncomingActions]);

  // Enhanced handlers with bidirectional sync
  const handleTabChange = useCallback((event, newValue) => {
    console.log(`📦 [${userType}] handleTabChange called with newValue:`, newValue);
    setActiveTab(newValue);
    sendTabChange(newValue);
  }, [sendTabChange]);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
    sendImageSelect(index);
  };

  const handleDaySelect = useCallback((index) => {
    console.log(`📦 [${userType}] handleDaySelect called with index:`, index);
    setSelectedDay(index);
    sendDaySelect(index);
  }, [sendDaySelect]);

  const toggleImageFullscreen = () => {
    const newFullscreenState = !isImageFullscreen;
    setIsImageFullscreen(newFullscreenState);
    sendFullscreenToggle(newFullscreenState);
  };

  const toggleSlideshow = () => {
    const newSlideshowState = !isImageSlideshow;
    setIsImageSlideshow(newSlideshowState);
    sendSlideshowToggle(newSlideshowState);
  };

  const navigateImage = (direction) => {
    if (packageData && packageData.images) {
      const newIndex = direction === 'next'
        ? (selectedImageIndex + 1) % packageData.images.length
        : selectedImageIndex === 0 ? packageData.images.length - 1 : selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      sendImageNavigate(newIndex);
    }
  };

  const handleCloseModal = () => {
    console.log(`[${userType}] handleCloseModal called, closeFromSignal:`, closeFromSignalRef.current);

    // Only send close signal if this close wasn't triggered by an incoming signal
    if (!closeFromSignalRef.current) {
      sendModalClose();
      console.log(`[${userType}] Sending modal close signal`);
    } else {
      console.log(`[${userType}] Skip sending close signal - closed due to incoming signal`);
    }

    onClose();
  };

  const handleImageZoom = (direction) => {
    const newZoom = direction === 'in' ? imageZoom * 1.2 : imageZoom / 1.2;
    const clampedZoom = Math.max(0.5, Math.min(3, newZoom));
    setImageZoom(clampedZoom);
    sendZoomChange(clampedZoom);
  };

  useEffect(() => {
    if (open) {
      setIsLoading(false); // Set loading to false immediately
    }
  }, [open]);

  // Monitor scroll position for UI updates (floating buttons, etc.)
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollTop = scrollRef.current.scrollTop;

      // Update UI state only
      setScrollY(scrollTop);
      setIsFloatingButtonsVisible(scrollTop > 200);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement && open) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [open, scrollRef]);

  // Force scroll sync initialization when modal opens
  useEffect(() => {
    if (open && scrollRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (scrollRef.current) {
          // Trigger a small scroll event to initialize sync
          const currentScrollTop = scrollRef.current.scrollTop;
          scrollRef.current.scrollTop = currentScrollTop + 1;
          scrollRef.current.scrollTop = currentScrollTop;
        }
      }, 100);
    }
  }, [open, scrollRef]);


  useEffect(() => {
    if (isImageSlideshow && packageData?.images?.length) {
      slideshowInterval.current = setInterval(() => {
        setSelectedImageIndex(prev =>
          prev === packageData.images.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    } else {
      clearInterval(slideshowInterval.current);
    }

    return () => clearInterval(slideshowInterval.current);
  }, [isImageSlideshow, packageData?.images?.length]);

  // Add debugging for packageData (commented out to prevent re-renders)
  // useEffect(() => {
  //   console.log("[PackageDetailsModal] Modal props:", { open, packageData: packageData?.id, userType });
  // }, [open, packageData?.id, userType]);

  // Sync payment step changes
  useEffect(() => {
    if (incomingPaymentAction) {
      // Handle both old format (incomingPaymentAction.data) and new format (incomingPaymentAction)
      const actionData = incomingPaymentAction.data || incomingPaymentAction;
      const { action, step } = actionData;
      console.log(`📦 [${userType}] Received payment action:`, action, 'step:', step);

      if (action === 'payment-step-change' && typeof step === 'number') {
        setPaymentStep(step);
      } else if (action === 'payment-success') {
        setPaymentStep(2);
        setPaymentSuccess(true);
      } else if (action === 'payment-modal-opened') {
        setIsPaymentModalOpen(true);
        setPaymentStep(typeof step === 'number' ? step : 0);
      } else if (action === 'payment-modal-closed') {
        setIsPaymentModalOpen(false);
        setPaymentStep(0);
      }
    }
  }, [incomingPaymentAction]);

  // Don't return null immediately, let the modal render and show loading state
  // if (!packageData) return null;

  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    sendWishlistToggle(next);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setPaymentError(false);
    setPaymentStep(2); // Move to thank you page
    // Reset form data and tracking on payment success
    setPaymentFormData({
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      agreeToTerms: false,
    });
    setPaymentFormFilledBy(null);
    sendPaymentAction('payment-success', { action: 'payment-success', step: 2 });
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentStep(0); // Reset to order summary
    setPaymentSuccess(false);
    setPaymentError(false);
    // Reset form tracking when modal closes
    setPaymentFormFilledBy(null);
    sendPaymentAction('payment-modal-closed', { action: 'payment-modal-closed', step: 0 });
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
    setPaymentStep(0); // Start at order summary
    // Reset form tracking when modal opens
    setPaymentFormFilledBy(null);
    sendPaymentAction('payment-modal-opened', { action: 'payment-modal-opened', step: 0 });
  };

  const handleContinueToPayment = () => {
    setPaymentStep(1); // Move to payment details
    sendPaymentAction('payment-step-change', { action: 'payment-step-change', step: 1 });
  };

  const handleBackToSummary = () => {
    setPaymentStep(0); // Go back to order summary
    sendPaymentAction('payment-step-change', { action: 'payment-step-change', step: 0 });
  };

  const handlePaymentFieldChange = (fieldName, fieldValue) => {
    setPaymentFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));

    // Track that current user is filling the form (only if not already set by them)
    if (paymentFormFilledBy !== userType) {
      setPaymentFormFilledBy(userType);
    }

    sendPaymentFieldChange(fieldName, fieldValue);
  };

  // Helper to determine if specific sensitive field should be blurred (for privacy)
  const shouldBlurField = (fieldName) => {
    // Agent should see blurred ONLY for sensitive fields when customer is filling
    const sensitiveFields = ['cardNumber', 'cvv', 'expiryDate'];
    return userType === 'agent' && paymentFormFilledBy === 'customer' && sensitiveFields.includes(fieldName);
  };

  // Helper to mask sensitive data for display
  const getMaskedValue = (fieldName, value) => {
    if (!shouldBlurField(fieldName)) return value;

    if (!value) return value;

    switch (fieldName) {
      case 'cardNumber':
        return '•••• •••• •••• ••••';
      case 'cvv':
        return '•••';
      case 'expiryDate':
        return '••/••';
      default:
        return value;
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setPaymentSuccess(false);
  };

  const handleCloseErrorSnackbar = () => {
    setPaymentError(false);
  };

  const renderLoadingScreen = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
      }}
    >
      <Box textAlign="center">
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="white">
          Preparing your travel experience...
        </Typography>
      </Box>
    </Box>
  );

  const renderTopBanner = () => (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 1, sm: 1.5 },
        transition: 'all 0.3s ease',
        transform: scrollY > 50 ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: scrollY > 50 ? theme.shadows[8] : theme.shadows[2],
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 1, sm: 0 }}>
        <Box flex={1} width="100%">
          <Slide direction="right" in={!isLoading} timeout={800}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="bold"
              color="primary.main"
              gutterBottom
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 1, sm: 0.5 },
              }}
            >
              {packageData.title}
            </Typography>
          </Slide>
          <Fade in={!isLoading} timeout={1000}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
              <LocationIcon color="action" fontSize="small" />
              {packageData.route && packageData.route?.map((location, index) => (
                <React.Fragment key={index}>
                  <Zoom in={!isLoading} timeout={800 + index * 100}>
                    <Chip
                      label={location}
                      variant="outlined"
                      size="small"
                      color="primary"
                      sx={{
                        transition: 'all 0.3s ease',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    />
                  </Zoom>
                  {index < (packageData.route?.length - 1) && (
                    <Typography variant="caption" color="text.secondary">•</Typography>
                  )}
                </React.Fragment>
              ))}
              <Zoom in={!isLoading} timeout={1200}>
                <Chip
                  label={packageData.duration}
                  color="secondary"
                  size="small"
                  sx={{
                    ml: { xs: 0, sm: 1 },
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Zoom>
            </Box>
          </Fade>
        </Box>
        <Box display="flex" gap={1} justifyContent={{ xs: 'center', sm: 'flex-end' }} width={{ xs: '100%', sm: 'auto' }}>
          {/* Scroll Sync Indicator */}
          <Tooltip title={isLeader ? "You're controlling scroll" : "Scroll synchronized with other party"}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                bgcolor: isLeader ? 'warning.main' : 'success.main',
                color: 'white',
                borderRadius: 1,
                fontSize: '0.7rem',
                fontWeight: 'bold',
                animation: isLeader ? 'none' : 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              <SyncIcon sx={{ fontSize: '0.8rem' }} />
              {isLeader ? 'CONTROLLING' : 'SYNC'}
            </Box>
          </Tooltip>
          <Tooltip title="Add to Wishlist">
            <IconButton
              onClick={toggleWishlist}
              size="small"
              sx={{
                bgcolor: isWishlisted ? 'error.main' : 'grey.100',
                color: isWishlisted ? 'white' : 'grey.700',
                '&:hover': {
                  bgcolor: isWishlisted ? 'error.dark' : 'grey.200',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share Package">
            <IconButton
              size="small"
              sx={{
                bgcolor: 'grey.100',
                '&:hover': {
                  bgcolor: 'grey.200',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton
              onClick={handleCloseModal}
              size="small"
              sx={{
                bgcolor: 'grey.100',
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  const renderImageGallery = () => (
    <Box sx={{ mb: { xs: 2, sm: 3 }, position: 'relative' }}>
      <Grid container spacing={{ xs: 1, sm: 1.5 }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Card
            elevation={6}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: { xs: 1, sm: 2 },
              '&:hover .image-controls': {
                opacity: 1,
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: { xs: 200, sm: 250, md: 600 },
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={toggleImageFullscreen}
            >
              <CardMedia
                component="img"
                height="100%"
                image={packageData.images[selectedImageIndex]}
                alt="Package main image"
                sx={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: `scale(${imageZoom})`,
                  '&:hover': {
                    transform: `scale(${imageZoom * 1.05})`,
                  },
                }}
              />

              {/* Image overlay with gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: { xs: '20%', sm: '25%' },
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography variant="body2" color="white" fontWeight="bold" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}>
                  {packageData.images.length} Photos • Click to view fullscreen
                </Typography>
                <Typography variant="caption" color="white" fontWeight="bold" sx={{
                  fontSize: '0.7rem',
                  display: { xs: 'block', sm: 'none' }
                }}>
                  {packageData.images.length} Photos
                </Typography>
              </Box>

              {/* Image Navigation Controls */}
              <Box
                className="image-controls"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: { xs: 1, sm: 1.5 },
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <PrevIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <NextIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Top Right Controls */}
              <Box
                className="image-controls"
                sx={{
                  position: 'absolute',
                  top: { xs: 8, sm: 12 },
                  right: { xs: 8, sm: 12 },
                  display: 'flex',
                  gap: { xs: 0.25, sm: 0.5 },
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Tooltip title="Slideshow">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSlideshow();
                    }}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    {isImageSlideshow ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fullscreen">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImageFullscreen();
                    }}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    <FullscreenIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Image Counter */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: 8, sm: 12 },
                  right: { xs: 8, sm: 12 },
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: { xs: 1, sm: 1.5 },
                  py: { xs: 0.25, sm: 0.5 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {selectedImageIndex + 1} / {packageData.images.length}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card
            elevation={6}
            sx={{
              height: { xs: 'auto', md: 600 },
              maxHeight: { xs: 300, sm: 400, md: 600 },
              display: { xs: 'none', sm: 'none', lg: 'block' },
              overflowY: 'auto',
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: { xs: 1, sm: 1.5 },
              overflow: 'hidden',

              background: theme.palette.background.paper,
              boxShadow: theme.shadows[12],
            }}
          >
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                p: { xs: 0.5, sm: 0.75 },
                color: 'white',
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                📷 Gallery
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 0.5, sm: 0.75 } }}>
              <Stack spacing={{ xs: 0.5, sm: 0.75 }}>
                {packageData.images.map((image, index) => (
                  <Zoom key={index} in={!isLoading} timeout={600 + index * 50}>
                    <Card
                      elevation={selectedImageIndex === index ? 6 : 2}
                      sx={{
                        cursor: 'pointer',
                        border: selectedImageIndex === index ? 2 : 0,
                        borderColor: 'primary.main',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          elevation: 4,
                          transform: 'scale(1.05)',
                        },
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: { xs: 0.5, sm: 0.75 },
                      }}
                      onClick={() => handleImageSelect(index)}
                    >
                      <CardMedia
                        component="img"
                        height={{ xs: 50, sm: 60 }}
                        image={image}
                        alt={`Package image ${index + 1}`}
                        sx={{
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                      />
                      {selectedImageIndex === index && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: 2, sm: 3 },
                            right: { xs: 2, sm: 3 },
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: { xs: 12, sm: 16 },
                            height: { xs: 12, sm: 16 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }} />
                        </Box>
                      )}
                    </Card>
                  </Zoom>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderImageFullscreen = () => (
    <Dialog
      open={isImageFullscreen}
      onClose={toggleImageFullscreen}
      maxWidth={false}
      fullScreen
      sx={{ '& .MuiDialog-paper': { bgcolor: 'black' } }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={packageData.images[selectedImageIndex]}
          alt="Fullscreen"
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            transform: `scale(${imageZoom})`,
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Fullscreen Controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            onClick={() => handleImageZoom('out')}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            onClick={() => handleImageZoom('in')}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={toggleImageFullscreen}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navigation */}
        <IconButton
          onClick={() => navigateImage('prev')}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          }}
        >
          <PrevIcon />
        </IconButton>
        <IconButton
          onClick={() => navigateImage('next')}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          }}
        >
          <NextIcon />
        </IconButton>

        {/* Image Info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body1">
            {selectedImageIndex + 1} of {packageData.images.length}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );

  const renderHighlightsBadges = () => (
    <Fade in={!isLoading} timeout={1400}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}20)`,
                border: `1px solid ${theme.palette.primary.light}`,
                borderRadius: { xs: 1.5, sm: 2 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} mb={{ xs: 1.5, sm: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                    }}
                  >
                    <HighlightIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main" sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: { xs: 1.2, sm: 1.4 }
                  }}>
                    PACKAGE HIGHLIGHTS
                  </Typography>
                </Box>
                <Stack spacing={{ xs: 1, sm: 1.5 }}>
                  {packageData.highlights?.map((highlight, index) => (
                    <Slide key={index} direction="right" in={!isLoading} timeout={800 + index * 100}>
                      <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                        <CheckIcon
                          color="success"
                          sx={{
                            mt: 0.2,
                            p: 0.3,
                            bgcolor: 'success.light',
                            borderRadius: '50%',
                            color: 'white',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          }}
                        />
                        <Typography variant="body2" sx={{
                          flex: 1,
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          lineHeight: { xs: 1.3, sm: 1.4 }
                        }}>
                          {highlight}
                        </Typography>
                      </Box>
                    </Slide>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.success.light}20, ${theme.palette.success.main}20)`,
                border: `1px solid ${theme.palette.success.light}`,
                borderRadius: { xs: 1.5, sm: 2 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} mb={{ xs: 1.5, sm: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'success.main',
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                    }}
                  >
                    <ActivityIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight="bold" color="success.main" sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: { xs: 1.2, sm: 1.4 }
                  }}>
                    ACTIVITIES
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  lineHeight: { xs: 1.3, sm: 1.4 }
                }}>
                  Exciting activities and experiences included in this package
                </Typography>
                <Button
                  startIcon={<AddIcon fontSize="small" />}
                  variant="contained"
                  color="success"
                  fullWidth
                  size="small"
                  onClick={() => {
                    console.log(`🎯 [${userType}] Opening activities modal and sending signal`);
                    setShowActivitiesModal(true);
                    sendActivitiesModalOpen();
                  }}
                  sx={{
                    borderRadius: { xs: 1, sm: 1.5 },
                    py: { xs: 0.75, sm: 1 },
                    fontWeight: 'bold',
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add Activities
                </Button>
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      </Box>
    </Fade>
  );

  const renderTabSection = () => (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: { xs: 1.5, sm: 2 },
          overflow: 'hidden',
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          sx={{
            bgcolor: 'grey.50',
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1.5, sm: 2 },
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white',
              },
            },
            '& .Mui-selected': {
              bgcolor: 'primary.main',
              color: 'white !important',
            },
          }}
        >
          {packageData.tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>
      </Paper>

      <Fade in={!isLoading} timeout={1000}>
        <Box>
          {activeTab === 0 && renderItineraryContent()}
          {activeTab === 1 && renderPoliciesContent()}
          {activeTab === 2 && renderSummaryContent()}
        </Box>
      </Fade>
    </Box>
  );

  const renderItineraryContent = () => {
    // If no itinerary data, show a message
    if (!packageData.itinerary || packageData.itinerary.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Detailed Itinerary Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please contact us for more information about this tour package.
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: "150px" }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stepper orientation="vertical" activeStep={selectedDay}>
            {packageData.itinerary?.map((day, index) => (
              <Step key={index} expanded={true}>
                <StepLabel
                  onClick={() => handleDaySelect(index)}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiStepLabel-label': {
                      fontWeight: selectedDay === index ? 'bold' : 'normal',
                      color: selectedDay === index ? 'primary.main' : 'text.primary',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight="bold" sx={{
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 }
                    }}>
                      {day.day} - {day.city}
                    </Typography>
                    <Chip
                      label={day.date}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        '&:hover': { bgcolor: 'primary.light', color: 'white' },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>
                </StepLabel>
                <StepContent>
                  <Collapse in={selectedDay === index} timeout={500}>
                    <Card
                      elevation={selectedDay === index ? 6 : 2}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        border: selectedDay === index ? 2 : 0,
                        borderColor: 'primary.main',
                        borderRadius: { xs: 1.5, sm: 2 },
                        transition: 'all 0.5s ease',
                        mb: { xs: 1, sm: 1.5 },
                        background: selectedDay === index
                          ? `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.background.paper})`
                          : 'background.paper',
                      }}
                    >
                      {/* Flight Information */}
                      {day.flightNote && (
                        <Fade in={selectedDay === index} timeout={800}>
                          <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} mb={{ xs: 1, sm: 1.5 }}>
                              <Avatar sx={{ bgcolor: 'info.main', width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 } }}>
                                <FlightIcon sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
                              </Avatar>
                              <Typography variant="subtitle2" fontWeight="bold" color="info.main" sx={{
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                              }}>
                                FLIGHT
                              </Typography>
                            </Box>
                            <Paper
                              elevation={2}
                              sx={{
                                p: { xs: 1.5, sm: 2 },
                                bgcolor: 'info.50',
                                borderRadius: { xs: 1, sm: 1.5 },
                                border: `1px solid ${theme.palette.info.light}`,
                              }}
                            >
                              <Typography variant="body2" color="info.main" sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' }
                              }}>
                                <InfoIcon sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
                                {day.flightNote}
                              </Typography>
                            </Paper>
                          </Box>
                        </Fade>
                      )}

                      {/* Hotel Information */}
                      {day.hotel && (
                        <Fade in={selectedDay === index} timeout={1000}>
                          <Box>
                            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} mb={{ xs: 1, sm: 1.5 }}>
                              <Avatar sx={{ bgcolor: 'success.main', width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 } }}>
                                <HotelIcon sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
                              </Avatar>
                              <Typography variant="subtitle2" fontWeight="bold" color="success.main" sx={{
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                              }}>
                                HOTEL
                              </Typography>
                            </Box>
                            <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: { xs: 1, sm: 1.5 } }}>
                              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                <Grid size={{ xs: 12, md: 8 }}>
                                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' }
                                  }}>
                                    {day.hotel.name}
                                  </Typography>
                                  <Box display="flex" alignItems="center" gap={1} mb={{ xs: 1, sm: 1.5 }}>
                                    <Rating value={day.hotel.stars} readOnly size="small" />
                                    <Typography variant="body2" fontWeight="bold" sx={{
                                      fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                    }}>
                                      ({day.hotel.rating})
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                  }}>
                                    📍 {day.hotel.location}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold" gutterBottom sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                  }}>
                                    🛏️ {day.hotel.stay}
                                  </Typography>
                                  <Typography variant="body2" gutterBottom sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                  }}>
                                    🏨 {day.hotel.type}
                                  </Typography>
                                  <Box sx={{ mt: { xs: 1, sm: 1.5 } }}>
                                    {day.hotel.inclusions.map((inclusion, idx) => (
                                      <Chip
                                        key={idx}
                                        label={inclusion}
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                        sx={{
                                          mr: { xs: 0.25, sm: 0.5 },
                                          mb: { xs: 0.25, sm: 0.5 },
                                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                          '&:hover': { bgcolor: 'success.light', color: 'white' },
                                          transition: 'all 0.3s ease',
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <Card elevation={2} sx={{ borderRadius: { xs: 1, sm: 1.5 }, overflow: 'hidden' }}>
                                    <CardMedia
                                      component="img"
                                      height={{ xs: 80, sm: 100 }}
                                      image={day.hotel.image || '/api/placeholder/150/120'}
                                      alt={day.hotel.name}
                                      sx={{
                                        transition: 'transform 0.3s ease',
                                        '&:hover': { transform: 'scale(1.1)' },
                                      }}
                                    />
                                  </Card>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Box>
                        </Fade>
                      )}
                    </Card>
                  </Collapse>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Grid>

        {/* Enhanced Sidebar */}
        {packageData.sidebar && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              elevation={4}
              sx={{
                position: 'sticky',
                top: { xs: 80, sm: 100 },
                borderRadius: { xs: 1.5, sm: 2 },
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  p: { xs: 1.5, sm: 2 },
                  color: 'white',
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{
                  fontSize: { xs: '0.85rem', sm: '0.95rem' }
                }}>
                  Trip Timeline
                </Typography>
                <Typography variant="body2" sx={{
                  opacity: 0.9,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}>
                  Click on any day to view details
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <List dense>
                  {packageData.sidebar?.days?.map((date, index) => (
                    <ListItem
                      key={index}
                      button
                      selected={selectedDay === index}
                      onClick={() => handleDaySelect(index)}
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        px: { xs: 1.5, sm: 2 },
                        borderLeft: selectedDay === index ? 3 : 0,
                        borderColor: 'primary.main',
                        bgcolor: selectedDay === index ? 'primary.50' : 'transparent',
                        '&:hover': {
                          bgcolor: 'primary.100',
                        },
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: { xs: 24, sm: 28 },
                            height: { xs: 24, sm: 28 },
                            bgcolor: selectedDay === index ? 'primary.main' : 'grey.300',
                            color: selectedDay === index ? 'white' : 'grey.600',
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={date}
                        primaryTypographyProps={{
                          fontWeight: selectedDay === index ? 'bold' : 'normal',
                          color: selectedDay === index ? 'primary.main' : 'text.primary',
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />

                {/* Enhanced Best Deals Section */}
                <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      background: `linear-gradient(135deg, ${theme.palette.success.light}20, ${theme.palette.success.main}20)`,
                      border: `1px solid ${theme.palette.success.light}`,
                      borderRadius: { xs: 1, sm: 1.5 },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={{ xs: 1, sm: 1.5 }}>
                      <OfferIcon color="success" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="success.main" sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}>
                        {packageData.sidebar?.bestDeals?.message}
                      </Typography>
                    </Box>
                    <Stack spacing={{ xs: 0.75, sm: 1 }}>
                      {packageData.sidebar?.bestDeals?.actions?.map((action, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1}>
                          <CheckIcon
                            color="success"
                            sx={{
                              p: 0.2,
                              bgcolor: 'success.main',
                              borderRadius: '50%',
                              color: 'white',
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            }}
                          />
                          <Typography variant="body2" sx={{
                            flex: 1,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}>
                            {action}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderPoliciesContent = () => (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 1.5, sm: 2 } }}>
      <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} mb={{ xs: 2, sm: 3 }}>
        <Avatar sx={{ bgcolor: 'info.main', width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
          <SecurityIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          Cancellation & Payment Policies
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ p: { xs: 2, sm: 2.5 }, height: '100%', borderRadius: { xs: 1, sm: 1.5 } }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error.main" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              Cancellation Policy
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                <CheckIcon color="success" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  <strong>Free cancellation</strong> up to 7 days before departure
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                <InfoIcon color="warning" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  <strong>50% refund</strong> for cancellations between 3-7 days before departure
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                <CloseIcon color="error" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  <strong>No refund</strong> for cancellations within 3 days of departure
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ p: { xs: 2, sm: 2.5 }, height: '100%', borderRadius: { xs: 1, sm: 1.5 } }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.main" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              Payment Policy
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                <MoneyIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  <strong>30% advance payment</strong> required to confirm booking
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                <ScheduleIcon color="warning" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  <strong>Balance payment</strong> due 15 days before departure
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                <CheckIcon color="success" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  <strong>EMI options available</strong> with 0% interest for 6 months
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{
        mt: { xs: 2, sm: 3 },
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'info.50',
        borderRadius: { xs: 1, sm: 1.5 },
        border: `1px solid ${theme.palette.info.light}`
      }}>
        <Typography variant="body2" color="info.main" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
          💡 Pro Tip:
        </Typography>
        <Typography variant="body2" color="info.main" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
          Book early to secure the best rates and ensure availability. Our flexible payment options make it easy to plan your dream vacation.
        </Typography>
      </Box>
    </Paper>
  );

  const renderSummaryContent = () => (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 1.5, sm: 2 } }}>
      <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} mb={{ xs: 2, sm: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
          <InfoIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          Package Summary
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={2}
            sx={{
              p: { xs: 2, sm: 2.5 },
              height: '100%',
              borderRadius: { xs: 1, sm: 1.5 },
              border: `1px solid ${theme.palette.success.light}`,
              bgcolor: 'success.50',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.main" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              ✅ Package Includes
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              {[
                'Accommodation as per itinerary',
                'Daily breakfast at hotels',
                'AC transportation throughout',
                'Sightseeing as per itinerary',
                'Professional tour guide'
              ].map((item, index) => (
                <Box key={index} display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                  <CheckIcon
                    color="success"
                    sx={{
                      mt: 0.5,
                      p: 0.2,
                      bgcolor: 'success.main',
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={2}
            sx={{
              p: { xs: 2, sm: 2.5 },
              height: '100%',
              borderRadius: { xs: 1, sm: 1.5 },
              border: `1px solid ${theme.palette.error.light}`,
              bgcolor: 'error.50',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error.main" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              ❌ Package Excludes
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              {[
                'International/Domestic flights',
                'Personal expenses',
                'Travel insurance',
                'Entry fees to monuments',
                'Tips and gratuities'
              ].map((item, index) => (
                <Box key={index} display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 1.5 }}>
                  <CloseIcon
                    color="error"
                    sx={{
                      mt: 0.5,
                      p: 0.2,
                      bgcolor: 'error.main',
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Selected Activities Section */}
      {selectedActivities.length > 0 && (
        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
          <Card
            elevation={2}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: { xs: 1, sm: 1.5 },
              border: `1px solid ${theme.palette.info.light}`,
              bgcolor: 'info.50',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="info.main" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              🎯 Selected Activities ({selectedActivities.length})
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {selectedActivities.map((activity, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={activity.id || index}>
                  <Card
                    elevation={1}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      height: '100%',
                      borderRadius: { xs: 1, sm: 1.5 },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      border: '1px solid',
                      borderColor: 'info.light',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'info.main',
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      <CheckIcon />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                        {activity.name}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip
                          label={activity.duration}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                        <Chip
                          label={activity.difficulty}
                          size="small"
                          color="info"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>
      )}

      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center', borderRadius: { xs: 1, sm: 1.5 } }}>
              <PhoneIcon color="primary" sx={{ fontSize: { xs: 28, sm: 32 }, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                Round-the-clock assistance for your peace of mind
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center', borderRadius: { xs: 1, sm: 1.5 } }}>
              <SecurityIcon color="success" sx={{ fontSize: { xs: 28, sm: 32 }, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Secure Booking
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                Your data and payments are completely secure
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center', borderRadius: { xs: 1, sm: 1.5 } }}>
              <StarIcon color="warning" sx={{ fontSize: { xs: 28, sm: 32 }, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Best Value
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                Guaranteed best prices with premium service
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );

  const renderPriceBox = () => (
    <Card
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxHeight: { xs: 'auto', sm: 'auto' },
        overflowY: 'auto',
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 0,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        zIndex: 1000,
        boxShadow: theme.shadows[12],
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          p: { xs: 0.75, sm: 1 },
          color: 'white',
        }}
      >
        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
          💳 Price Summary
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={{ xs: 1, sm: 2 }}>
          {/* Left Side - Price Details */}
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }} flexWrap="wrap" flex={1}>
            {/* Original Price */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                p: { xs: 0.5, sm: 0.75 },
                bgcolor: 'grey.100',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'grey.200',
                  transform: 'scale(1.02)',
                }
              }}
            >
              <Typography variant="caption" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' }, color: 'text.secondary' }}>
                Original:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  textDecoration: 'line-through',
                  fontSize: { xs: '0.55rem', sm: '0.6rem' },
                  fontWeight: 'bold',
                  color: 'text.secondary'
                }}
              >
                £{packageData.price.original.toLocaleString()}
              </Typography>
            </Box>

            {/* Final Price */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                p: { xs: 0.5, sm: 0.75 },
                bgcolor: 'primary.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'primary.light',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.100',
                  transform: 'scale(1.02)',
                }
              }}
            >
              <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                Final:
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                £{packageData.price.discounted.toLocaleString()}
              </Typography>
            </Box>

            {/* Savings */}
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                px: { xs: 0.75, sm: 1 },
                py: { xs: 0.5, sm: 0.75 },
                borderRadius: 1,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'success.dark',
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                🎉 Save £{(packageData.price.original - packageData.price.discounted).toLocaleString()}
              </Typography>
            </Box>

            {/* EMI Option */}
            <Box
              sx={{
                bgcolor: 'info.50',
                px: { xs: 0.75, sm: 1 },
                py: { xs: 0.5, sm: 0.75 },
                borderRadius: 1,
                border: `1px solid ${theme.palette.info.light}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'info.100',
                  transform: 'scale(1.02)',
                }
              }}
            >
              <Typography variant="caption" color="info.main" fontWeight="bold" sx={{ fontSize: { xs: '0.5rem', sm: '0.55rem' } }}>
                💳 EMI from {packageData.price.emi}
              </Typography>
            </Box>
          </Box>

          {/* Right Side - Payment Button */}
          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
            {/* Trust Badges */}


            {/* Proceed to Payment Button */}
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenPaymentModal}
              sx={{
                py: { xs: 0.75, sm: 1 },
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 'bold',
                borderRadius: { xs: 0.5, sm: 0.75 },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[8],
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
                transition: 'all 0.3s ease',
                minWidth: { xs: 'auto', sm: '140px' },
              }}
            >
              Proceed to Payment
            </Button>
          </Box>
        </Box>

        {/* Additional Info */}
        <Typography variant="caption" color="text.secondary" sx={{
          fontSize: { xs: '0.5rem', sm: '0.55rem' },
          display: 'block',
          mt: { xs: 0.5, sm: 0.75 },
          textAlign: 'center',
          opacity: 0.8,
        }}>
          Per {packageData.price.per} • {packageData.price.notes}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderFloatingActions = () => (
    <Fade in={isFloatingButtonsVisible}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <SpeedDial
          ariaLabel="Package Actions"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<ShareIcon />}
            tooltipTitle="Share Package"
            sx={{ bgcolor: 'primary.main', color: 'white' }}
          />
          <SpeedDialAction
            icon={<DownloadIcon />}
            tooltipTitle="Download Itinerary"
            sx={{ bgcolor: 'success.main', color: 'white' }}
          />
          <SpeedDialAction
            icon={<PhoneIcon />}
            tooltipTitle="Call Expert"
            sx={{ bgcolor: 'warning.main', color: 'white' }}
          />
          <SpeedDialAction
            icon={<EmailIcon />}
            tooltipTitle="Email Details"
            sx={{ bgcolor: 'info.main', color: 'white' }}
          />
        </SpeedDial>
      </Box>
    </Fade>
  );

  const renderPaymentModal = () => (
    <Dialog
      open={isPaymentModalOpen}
      onClose={handleClosePaymentModal}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 1, sm: 2 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          p: { xs: 2, sm: 3 },
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <PaymentIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Secure Payment
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Complete your booking with confidence
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClosePaymentModal}
          sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
        <Stepper activeStep={paymentStep} sx={{ mb: 2 }}>
          <Step><StepLabel>Order Summary</StepLabel></Step>
          <Step><StepLabel>Payment Details</StepLabel></Step>
          <Step><StepLabel>Confirmation</StepLabel></Step>
        </Stepper>
      </Box>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Step 0: Order Summary Only */}
        {paymentStep === 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Review Your Order
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Package:</Typography>
                  <Typography variant="body2" fontWeight="bold">{packageData.title}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Duration:</Typography>
                  <Typography variant="body2">{packageData.duration}</Typography>
                </Box>

                {/* Selected Activities */}
                {selectedActivities.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="bold" gutterBottom>
                        Selected Activities ({selectedActivities.length}):
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {selectedActivities.map((activity, index) => (
                          <Box
                            key={activity.id || index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: 1,
                              bgcolor: 'info.50',
                              border: '1px solid',
                              borderColor: 'info.light',
                            }}
                          >
                            <CheckIcon color="info" sx={{ fontSize: 16 }} />
                            <Typography variant="caption" sx={{ flex: 1, fontSize: '0.75rem' }}>
                              {activity.name}
                            </Typography>
                            <Chip
                              label={activity.duration}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                  </>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Original Price:</Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                    £{packageData.price.original.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Discount:</Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    -£{(packageData.price.original - packageData.price.discounted).toLocaleString()}
                  </Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">Total Amount:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    £{packageData.price.discounted.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'success.50', p: 2, borderRadius: 1, border: `1px solid ${theme.palette.success.light}` }}>
                  <Typography variant="body2" color="success.main" fontWeight="bold" textAlign="center">
                    🎉 You Save £{(packageData.price.original - packageData.price.discounted).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleContinueToPayment}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }}
            >
              Continue to Payment
            </Button>
          </Box>
        )}

        {/* Step 1: Payment Details */}
        {paymentStep === 1 && (
          <Grid container spacing={3}>
            {/* Order Summary - First on mobile */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 1, sm: 2 }, height: 'fit-content', position: 'sticky', top: 20 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <VerifiedUserIcon color="success" sx={{ fontSize: { xs: 28, sm: 32 } }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Order Summary
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">Total Amount:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      £{packageData.price.discounted.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: 'success.50',
                      p: 2,
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.success.light}`,
                    }}
                  >
                    <Typography variant="body2" color="success.main" fontWeight="bold" textAlign="center">
                      🎉 You Save £{(packageData.price.original - packageData.price.discounted).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                    <SecurityIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Secure payment powered by Stripe
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Payment Form - Second on mobile */}
            <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 1, sm: 2 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CreditCardIcon color="primary" sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                      Card Details
                    </Typography>
                  </Box>
                  {userType === 'agent' && paymentFormFilledBy === 'customer' && (
                    <Chip
                      icon={<LockIcon />}
                      label="Customer's Private Data"
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Box>

                <Grid container spacing={2}>
                  {/* Card Number */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      variant="outlined"
                      size="small"
                      value={getMaskedValue('cardNumber', paymentFormData.cardNumber)}
                      onChange={(e) => handlePaymentFieldChange('cardNumber', e.target.value)}
                      disabled={shouldBlurField('cardNumber')}
                      InputProps={{
                        startAdornment: <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          filter: shouldBlurField('cardNumber') ? 'blur(4px)' : 'none',
                          transition: 'filter 0.3s ease',
                        },
                        '& .MuiInputBase-input': {
                          cursor: shouldBlurField('cardNumber') ? 'not-allowed' : 'text',
                        },
                      }}
                    />
                  </Grid>

                  {/* Cardholder Name */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      placeholder="John Doe"
                      variant="outlined"
                      size="small"
                      value={paymentFormData.cardHolderName}
                      onChange={(e) => handlePaymentFieldChange('cardHolderName', e.target.value)}
                      InputProps={{
                        startAdornment: <AccountIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  {/* Expiry Date and CVV */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      variant="outlined"
                      size="small"
                      value={getMaskedValue('expiryDate', paymentFormData.expiryDate)}
                      onChange={(e) => handlePaymentFieldChange('expiryDate', e.target.value)}
                      disabled={shouldBlurField('expiryDate')}
                      InputProps={{
                        startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          filter: shouldBlurField('expiryDate') ? 'blur(4px)' : 'none',
                          transition: 'filter 0.3s ease',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      variant="outlined"
                      size="small"
                      type="password"
                      value={getMaskedValue('cvv', paymentFormData.cvv)}
                      onChange={(e) => handlePaymentFieldChange('cvv', e.target.value)}
                      disabled={shouldBlurField('cvv')}
                      InputProps={{
                        startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          filter: shouldBlurField('cvv') ? 'blur(4px)' : 'none',
                          transition: 'filter 0.3s ease',
                        },
                      }}
                    />
                  </Grid>

                  {/* Billing Address */}
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Billing Address
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      placeholder="123 Main Street"
                      variant="outlined"
                      size="small"
                      value={paymentFormData.address}
                      onChange={(e) => handlePaymentFieldChange('address', e.target.value)}
                      InputProps={{
                        startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="City"
                      placeholder="New York"
                      variant="outlined"
                      size="small"
                      value={paymentFormData.city}
                      onChange={(e) => handlePaymentFieldChange('city', e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      placeholder="NY"
                      variant="outlined"
                      size="small"
                      value={paymentFormData.state}
                      onChange={(e) => handlePaymentFieldChange('state', e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="ZIP/Postal Code"
                      placeholder="10001"
                      variant="outlined"
                      size="small"
                      value={paymentFormData.zipCode}
                      onChange={(e) => handlePaymentFieldChange('zipCode', e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Country</InputLabel>
                      <Select
                        label="Country"
                        value={paymentFormData.country}
                        onChange={(e) => handlePaymentFieldChange('country', e.target.value)}
                      >
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="CA">Canada</MenuItem>
                        <MenuItem value="UK">United Kingdom</MenuItem>
                        <MenuItem value="IN">India</MenuItem>
                        <MenuItem value="AU">Australia</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Privacy Notice */}
                  {userType === 'agent' && paymentFormFilledBy === 'customer' && (
                    <Grid size={{ xs: 12 }}>
                      <Alert severity="info" icon={<LockIcon />} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          🔒 <strong>Privacy Protected:</strong> Customer is entering their payment details. Sensitive card information (Card Number, CVV, Expiry Date) is hidden for security.
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                  {/* Terms and Conditions */}
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={paymentFormData.agreeToTerms}
                          onChange={(e) => handlePaymentFieldChange('agreeToTerms', e.target.checked)}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          I agree to the{' '}
                          <Typography component="span" color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            Terms & Conditions
                          </Typography>{' '}
                          and{' '}
                          <Typography component="span" color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            Privacy Policy
                          </Typography>
                        </Typography>
                      }
                    />
                  </Grid>
                  <Box display="flex" gap={2} mb={1} sx={{ width: '100%' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleBackToSummary}
                      sx={{ flex: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        if (!paymentFormData.agreeToTerms) {
                          setPaymentError(true);
                          return;
                        }
                        sendPaymentAction('payment-button-click', { action: 'payment-button-click', button: 'pay' });
                        handlePaymentSuccess();
                      }}
                      sx={{
                        flex: 2,
                        py: 1.5,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 'bold',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: theme.shadows[8],
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💳 Pay £{packageData.price.discounted.toLocaleString()}
                    </Button>
                  </Box>
                </Grid>
              </Paper>  
            </Grid>  
          </Grid>
        )}

        {/* Step 2: Thank You Page */}
        {paymentStep === 2 && (
          <Box textAlign="center">
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for your payment. Your booking has been confirmed.
            </Typography>
            <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>Booking Details</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom><strong>Package:</strong> {packageData.title}</Typography>
              <Typography variant="body2" gutterBottom><strong>Duration:</strong> {packageData.duration}</Typography>
              <Typography variant="body2" gutterBottom><strong>Total Paid:</strong> £{packageData.price.discounted.toLocaleString()}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                A confirmation email has been sent to your registered email address.
              </Typography>
            </Paper>
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={handleClosePaymentModal}
              sx={{ fontWeight: 'bold' }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {isLoading && renderLoadingScreen()}

      <Dialog
        open={open && !isLoading}
        onClose={handleCloseModal}
        maxWidth={false}
        fullScreen
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.grey[50]})`,
          },
        }}
      >
        {packageData ? (
          <>
            {renderTopBanner()}

            {renderPriceBox()}



            <DialogContent
              ref={scrollRef}
              id={`package-details-scroll-${userType}`}
              sx={{
                p: 0,
                height: 'calc(100vh - 100px)',
                overflow: 'auto',
                scrollBehavior: 'smooth',
                // Add visual indicator when this side is actively controlling
                borderLeft: isLeader ? '4px solid' : 'none',
                borderColor: 'primary.main',
              }}
            >
              <Box sx={{ px: isMobile ? 1.5 : 3, py: 2 }}>
                {renderImageGallery()}
                {renderHighlightsBadges()}

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, lg: 12 }}>
                    {renderTabSection()}
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
          </>
        ) : (
          <DialogContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}
          >
            <Box textAlign="center">
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Loading package details...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait while we prepare the package information.
              </Typography>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {packageData && renderImageFullscreen()}
      {packageData && renderFloatingActions()}
      {packageData && renderPaymentModal()}

      {/* Success Notification */}
      <Snackbar
        open={paymentSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          Payment successful! Your booking has been confirmed.
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={paymentError}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          Payment failed. Please try again or contact support.
        </Alert>
      </Snackbar>

      {/* Activities Modal */}
      <ActivitiesModal
        open={showActivitiesModal}
        onClose={() => {
          setShowActivitiesModal(false);
          sendActivitiesModalClose();
        }}
        activities={packageData?.activities || []}
        packageTitle={packageData?.title}
        packageLocation={packageData?.location}
        userType={userType}
        onActivitiesSelected={(activities) => {
          console.log(`🎯 [${userType}] Activities selected:`, activities);
          setSelectedActivities(activities);
          const ids = activities.map(a => a.id);
          sendActivitiesConfirm(ids);
        }}
        initialSelectedActivities={selectedActivities.map(a => a.id)}
      />
    </>
  );
};

export default PackageDetailsModal;
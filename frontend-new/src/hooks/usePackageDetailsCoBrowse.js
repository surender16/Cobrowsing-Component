import { useState, useEffect, useCallback, useRef } from 'react';
import { packageDetailsCoBrowseSingleton } from '../services/PackageDetailsCoBrowseManager';

/**
 * Custom hook for package details co-browsing
 * Provides bi-directional synchronization for all package details actions
 * @param {string} userType - 'agent' or 'customer'
 * @param {boolean} enabled - Whether co-browsing is enabled
 * @returns {Object} - Co-browsing state and methods
 */
export const usePackageDetailsCoBrowse = (userType = 'agent', enabled = true) => {
  // State for incoming actions
  const [incomingTabChange, setIncomingTabChange] = useState(null);
  const [incomingImageSelect, setIncomingImageSelect] = useState(null);
  const [incomingDaySelect, setIncomingDaySelect] = useState(null);
  const [incomingFullscreenToggle, setIncomingFullscreenToggle] = useState(null);
  const [incomingSlideshowToggle, setIncomingSlideshowToggle] = useState(null);
  const [incomingImageNavigate, setIncomingImageNavigate] = useState(null);
  const [incomingZoomChange, setIncomingZoomChange] = useState(null);
  const [incomingScrollSync, setIncomingScrollSync] = useState(null);
  const [incomingComparisonAction, setIncomingComparisonAction] = useState(null);
  const [incomingPaymentAction, setIncomingPaymentAction] = useState(null);
  const [incomingPaymentFieldChange, setIncomingPaymentFieldChange] = useState(null);
  const [incomingModalOpen, setIncomingModalOpen] = useState(null);
  const [incomingModalClose, setIncomingModalClose] = useState(null);
  const [incomingActivitiesModalOpen, setIncomingActivitiesModalOpen] = useState(null);
  const [incomingActivitiesModalClose, setIncomingActivitiesModalClose] = useState(null);

  // Use the singleton's ref to prevent signal loops
  const isProcessingIncomingActionRef = useRef(false);

  // Initialize the co-browsing singleton
  useEffect(() => {
    if (enabled) {
      packageDetailsCoBrowseSingleton.initialize();
    }
  }, [enabled]);

  // Event handlers for incoming actions
  const handleTabChange = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received tab change:`, data);
    setIncomingTabChange(data);
  }, [userType]);

  const handleImageSelect = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received image select:`, data);
    setIncomingImageSelect(data);
  }, [userType]);

  const handleDaySelect = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received day select:`, data);
    setIncomingDaySelect(data);
  }, [userType]);

  const handleFullscreenToggle = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received fullscreen toggle:`, data);
    setIncomingFullscreenToggle(data);
  }, [userType]);

  const handleSlideshowToggle = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received slideshow toggle:`, data);
    setIncomingSlideshowToggle(data);
  }, [userType]);

  const handleImageNavigate = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received image navigate:`, data);
    setIncomingImageNavigate(data);
  }, [userType]);

  const handleZoomChange = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received zoom change:`, data);
    setIncomingZoomChange(data);
  }, [userType]);

  const handleScrollSync = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received scroll sync:`, data);
    setIncomingScrollSync(data);
  }, [userType]);

  const handleComparisonAction = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received comparison action:`, data);
    setIncomingComparisonAction(data);
  }, [userType]);

  const handlePaymentAction = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received payment action:`, data);
    setIncomingPaymentAction(data);
  }, [userType]);

  const handlePaymentFieldChange = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received payment field change:`, data);
    setIncomingPaymentFieldChange(data);
  }, [userType]);

  const handleModalOpen = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received modal open:`, data);
    setIncomingModalOpen(data);
  }, [userType]);

  const handleModalClose = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`📦 [${userType}] Received modal close:`, data);
    setIncomingModalClose(data);
  }, [userType]);

  const handleActivitiesModalOpen = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`🎯 [${userType}] Received activities modal open:`, data);
    setIncomingActivitiesModalOpen(data);
  }, [userType]);

  const handleActivitiesModalClose = useCallback((data) => {
    if (data.userType === userType) return;

    console.log(`🎯 [${userType}] Received activities modal close:`, data);
    setIncomingActivitiesModalClose(data);
  }, [userType]);

  // Register listeners
  useEffect(() => {
    if (!enabled) return;

    packageDetailsCoBrowseSingleton.addListener('tabChange', handleTabChange);
    packageDetailsCoBrowseSingleton.addListener('imageSelect', handleImageSelect);
    packageDetailsCoBrowseSingleton.addListener('daySelect', handleDaySelect);
    packageDetailsCoBrowseSingleton.addListener('fullscreenToggle', handleFullscreenToggle);
    packageDetailsCoBrowseSingleton.addListener('slideshowToggle', handleSlideshowToggle);
    packageDetailsCoBrowseSingleton.addListener('imageNavigate', handleImageNavigate);
    packageDetailsCoBrowseSingleton.addListener('zoomChange', handleZoomChange);
    packageDetailsCoBrowseSingleton.addListener('scrollSync', handleScrollSync);
    packageDetailsCoBrowseSingleton.addListener('comparisonAction', handleComparisonAction);
    packageDetailsCoBrowseSingleton.addListener('paymentAction', handlePaymentAction);
    packageDetailsCoBrowseSingleton.addListener('paymentFieldChange', handlePaymentFieldChange);
    packageDetailsCoBrowseSingleton.addListener('modalOpen', handleModalOpen);
    packageDetailsCoBrowseSingleton.addListener('modalClose', handleModalClose);
    packageDetailsCoBrowseSingleton.addListener('activitiesModalOpen', handleActivitiesModalOpen);
    packageDetailsCoBrowseSingleton.addListener('activitiesModalClose', handleActivitiesModalClose);

    return () => {
      packageDetailsCoBrowseSingleton.removeListener('tabChange', handleTabChange);
      packageDetailsCoBrowseSingleton.removeListener('imageSelect', handleImageSelect);
      packageDetailsCoBrowseSingleton.removeListener('daySelect', handleDaySelect);
      packageDetailsCoBrowseSingleton.removeListener('fullscreenToggle', handleFullscreenToggle);
      packageDetailsCoBrowseSingleton.removeListener('slideshowToggle', handleSlideshowToggle);
      packageDetailsCoBrowseSingleton.removeListener('imageNavigate', handleImageNavigate);
      packageDetailsCoBrowseSingleton.removeListener('zoomChange', handleZoomChange);
      packageDetailsCoBrowseSingleton.removeListener('scrollSync', handleScrollSync);
      packageDetailsCoBrowseSingleton.removeListener('comparisonAction', handleComparisonAction);
      packageDetailsCoBrowseSingleton.removeListener('paymentAction', handlePaymentAction);
      packageDetailsCoBrowseSingleton.removeListener('paymentFieldChange', handlePaymentFieldChange);
      packageDetailsCoBrowseSingleton.removeListener('modalOpen', handleModalOpen);
      packageDetailsCoBrowseSingleton.removeListener('modalClose', handleModalClose);
      packageDetailsCoBrowseSingleton.removeListener('activitiesModalOpen', handleActivitiesModalOpen);
      packageDetailsCoBrowseSingleton.removeListener('activitiesModalClose', handleActivitiesModalClose);
    };
  }, [enabled, userType, handleTabChange, handleImageSelect, handleDaySelect, handleFullscreenToggle,
    handleSlideshowToggle, handleImageNavigate, handleZoomChange, handleScrollSync,
    handleComparisonAction, handlePaymentAction, handlePaymentFieldChange, handleModalOpen, handleModalClose,
    handleActivitiesModalOpen, handleActivitiesModalClose]);

  // Action senders - use the singleton's isIncomingActionRef
  const sendTabChange = useCallback((tabIndex) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending tab change:`, tabIndex);
    packageDetailsCoBrowseSingleton.sendAction('tab-change', { tabIndex }, userType);
  }, [enabled, userType]);

  const sendImageSelect = useCallback((imageIndex) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending image select:`, imageIndex);
    packageDetailsCoBrowseSingleton.sendAction('image-select', { imageIndex }, userType);
  }, [enabled, userType]);

  const sendDaySelect = useCallback((dayIndex) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending day select:`, dayIndex);
    packageDetailsCoBrowseSingleton.sendAction('day-select', { dayIndex }, userType);
  }, [enabled, userType]);

  const sendFullscreenToggle = useCallback((isFullscreen) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending fullscreen toggle:`, isFullscreen);
    packageDetailsCoBrowseSingleton.sendAction('fullscreen-toggle', { isFullscreen }, userType);
  }, [enabled, userType]);

  const sendSlideshowToggle = useCallback((isSlideshow) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending slideshow toggle:`, isSlideshow);
    packageDetailsCoBrowseSingleton.sendAction('slideshow-toggle', { isSlideshow }, userType);
  }, [enabled, userType]);

  const sendImageNavigate = useCallback((imageIndex) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending image navigate:`, imageIndex);
    packageDetailsCoBrowseSingleton.sendAction('image-navigate', { imageIndex }, userType);
  }, [enabled, userType]);

  const sendZoomChange = useCallback((zoomLevel) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending zoom change:`, zoomLevel);
    packageDetailsCoBrowseSingleton.sendAction('zoom-change', { zoomLevel }, userType);
  }, [enabled, userType]);

  const sendScrollSync = useCallback((scrollTop, scrollLeft) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending scroll sync:`, { scrollTop, scrollLeft });
    packageDetailsCoBrowseSingleton.sendAction('scroll-sync', { scrollTop, scrollLeft }, userType);
  }, [enabled, userType]);

  const sendComparisonAction = useCallback((action, data = {}) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending comparison action:`, action, data);
    packageDetailsCoBrowseSingleton.sendAction('comparison-action', { action, ...data }, userType);
  }, [enabled, userType]);

  const sendPaymentAction = useCallback((action, data = {}) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending payment action:`, action, data);
    packageDetailsCoBrowseSingleton.sendAction('payment-action', { action, ...data }, userType);
  }, [enabled, userType]);

  const sendModalOpen = useCallback((packageData) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending modal open with ID only:`, packageData?.id);
    // Send only package ID to minimize signal payload
    packageDetailsCoBrowseSingleton.sendAction('modal-open', { packageId: packageData?.id }, userType);
  }, [enabled, userType]);

  const sendModalClose = useCallback(() => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending modal close`);
    packageDetailsCoBrowseSingleton.sendAction('modal-close', {}, userType);
  }, [enabled, userType]);

  const sendActivitiesModalOpen = useCallback(() => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`🎯 [${userType}] Sending activities modal open`);
    packageDetailsCoBrowseSingleton.sendAction('activities-modal-open', {}, userType);
  }, [enabled, userType]);

  const sendActivitiesModalClose = useCallback(() => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`🎯 [${userType}] Sending activities modal close`);
    packageDetailsCoBrowseSingleton.sendAction('activities-modal-close', {}, userType);
  }, [enabled, userType]);

  const sendPaymentFieldChange = useCallback((fieldName, fieldValue) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending payment field change:`, fieldName, fieldValue);
    packageDetailsCoBrowseSingleton.sendAction('payment-field-change', { fieldName, fieldValue }, userType);
  }, [enabled, userType]);

  // Clear incoming actions after processing
  const clearIncomingActions = useCallback(() => {
    setIncomingTabChange(null);
    setIncomingImageSelect(null);
    setIncomingDaySelect(null);
    setIncomingFullscreenToggle(null);
    setIncomingSlideshowToggle(null);
    setIncomingImageNavigate(null);
    setIncomingZoomChange(null);
    setIncomingScrollSync(null);
    setIncomingComparisonAction(null);
    setIncomingPaymentAction(null);
    setIncomingPaymentFieldChange(null);
    setIncomingModalOpen(null);
    setIncomingModalClose(null);
    setIncomingActivitiesModalOpen(null);
    setIncomingActivitiesModalClose(null);
  }, []);

  return {
    // Incoming actions
    incomingTabChange,
    incomingImageSelect,
    incomingDaySelect,
    incomingFullscreenToggle,
    incomingSlideshowToggle,
    incomingImageNavigate,
    incomingZoomChange,
    incomingScrollSync,
    incomingComparisonAction,
    incomingPaymentAction,
    incomingPaymentFieldChange,
    incomingModalOpen,
    incomingModalClose,
    incomingActivitiesModalOpen,
    incomingActivitiesModalClose,

    // Action senders
    sendTabChange,
    sendImageSelect,
    sendDaySelect,
    sendFullscreenToggle,
    sendSlideshowToggle,
    sendImageNavigate,
    sendZoomChange,
    sendScrollSync,
    sendComparisonAction,
    sendPaymentAction,
    sendPaymentFieldChange,
    sendModalOpen,
    sendModalClose,
    sendActivitiesModalOpen,
    sendActivitiesModalClose,

    // Utility functions
    clearIncomingActions,
    isIncomingAction: packageDetailsCoBrowseSingleton.isIncomingActionRef.current,
    isProcessingIncomingAction: isProcessingIncomingActionRef.current,
  };
}; 
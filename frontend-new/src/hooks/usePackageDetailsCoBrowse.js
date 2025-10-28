import { useState, useEffect, useCallback, useRef } from 'react';
import { packageDetailsCoBrowseSingleton } from '../services/PackageDetailsCoBrowseManager';
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

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

  // Register OpenTok payment signal listeners (authoritative for payment sync)
  useEffect(() => {
    if (!enabled) return;
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (!session) return;

    const onModalOpened = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload.userType === userType) return;
        setIncomingPaymentAction({ action: 'payment-modal-opened', step: payload.step, userType: payload.userType, data: payload });
      } catch (e) { console.error('payment-modal-opened parse error', e); }
    };
    const onModalClosed = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload.userType === userType) return;
        setIncomingPaymentAction({ action: 'payment-modal-closed', step: 0, userType: payload.userType, data: payload });
      } catch (e) { console.error('payment-modal-closed parse error', e); }
    };
    const onStepChange = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload.userType === userType) return;
        setIncomingPaymentAction({ action: 'payment-step-change', step: payload.step, userType: payload.userType, data: payload });
      } catch (e) { console.error('payment-step-change parse error', e); }
    };
    const onFieldChange = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload.userType === userType) return;
        setIncomingPaymentFieldChange({ userType: payload.userType, data: { fieldName: payload.fieldName, fieldValue: payload.fieldValue } });
      } catch (e) { console.error('payment-field-change parse error', e); }
    };
    const onButtonClick = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload.userType === userType) return;
        setIncomingPaymentAction({ action: 'payment-button-click', userType: payload.userType, data: payload });
      } catch (e) { console.error('payment-button-click parse error', e); }
    };
    const onSuccess = (event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (payload.userType === userType) return;
        setIncomingPaymentAction({ action: 'payment-success', step: 2, userType: payload.userType, data: payload });
      } catch (e) { console.error('payment-success parse error', e); }
    };

    session.on('signal:payment-modal-opened', onModalOpened);
    session.on('signal:payment-modal-closed', onModalClosed);
    session.on('signal:payment-step-change', onStepChange);
    session.on('signal:payment-field-change', onFieldChange);
    session.on('signal:payment-button-click', onButtonClick);
    session.on('signal:payment-success', onSuccess);

    return () => {
      try {
        session.off('signal:payment-modal-opened', onModalOpened);
        session.off('signal:payment-modal-closed', onModalClosed);
        session.off('signal:payment-step-change', onStepChange);
        session.off('signal:payment-field-change', onFieldChange);
        session.off('signal:payment-button-click', onButtonClick);
        session.off('signal:payment-success', onSuccess);
      } catch (e) {
        console.warn('Cleanup payment listeners failed', e);
      }
    };
  }, [enabled, userType]);

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
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (!session) return;
    const actionType = (data && data.action) ? data.action : action;
    const payload = { ...data, userType, timestamp: new Date().toISOString() };
    const maxRetries = 3;
    let attempts = 0;
    const sendOnce = () => {
      attempts += 1;
      console.log(`📡 [${userType}] Sending payment signal: ${actionType} attempt ${attempts}`, payload);
      openTokSessionSingleton.sendSignal({ type: actionType, data: JSON.stringify(payload) }, (err) => {
        if (err && attempts < maxRetries) {
          console.warn('Retrying payment signal due to error:', err);
          setTimeout(sendOnce, 300 * attempts);
        } else if (err) {
          console.error('Failed to send payment signal after retries:', err);
        }
      });
    };
    sendOnce();
  }, [enabled, userType]);

  const sendModalOpen = useCallback((packageData) => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending modal open with ID only:`, packageData?.id);
    // Send only package ID to minimize signal payload
    packageDetailsCoBrowseSingleton.sendAction('modal-open', { packageId: packageData?.id }, userType);
  }, [enabled, userType]);

  const sendModalClose = useCallback(() => {
    if (!enabled || packageDetailsCoBrowseSingleton.isIncomingActionRef.current) return;

    console.log(`📦 [${userType}] Sending modal close signal`);
    packageDetailsCoBrowseSingleton.sendAction('modal-close', {}, userType);
    
    // Also send via OpenTok signal to ensure proper sync
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (session) {
      openTokSessionSingleton.sendSignal(
        {
          type: 'package-details-modal-action',
          data: JSON.stringify({
            action: `${userType}-closed-package-details`,
            userType,
            timestamp: new Date().toISOString(),
          }),
        },
        (err) => {
          if (err) {
            console.error('Failed to send modal close signal:', err);
          } else {
            console.log('✅ Successfully sent modal close signal');
          }
        }
      );
    }
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
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (!session) return;
    const payload = { fieldName, fieldValue, userType, timestamp: new Date().toISOString() };
    const maxRetries = 3;
    let attempts = 0;
    const sendOnce = () => {
      attempts += 1;
      console.log(`📡 [${userType}] Sending payment signal: payment-field-change attempt ${attempts}`, payload);
      openTokSessionSingleton.sendSignal({ type: 'payment-field-change', data: JSON.stringify(payload) }, (err) => {
        if (err && attempts < maxRetries) {
          setTimeout(sendOnce, 300 * attempts);
        } else if (err) {
          console.error('Failed to send payment field change after retries:', err);
        }
      });
    };
    sendOnce();
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
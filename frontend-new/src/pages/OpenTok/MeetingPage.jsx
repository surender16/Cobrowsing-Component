import React, { useEffect, useRef, useState } from "react";
import { useEffect as useLayoutEffect } from "react";
import axios from "axios";
import OT from "@opentok/client";
import AgentCatalog from "../../components/AgentCatalog";
import CustomerCatalogView from "../../components/CustomerCatalogView";
import TourComparisonModal from "../../components/Compare/TourComparisonModal";
import { useComparePackages } from "../../hooks/useComparePackages";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  UploadFile,
  ScreenShare,
  StopScreenShare,
  Description,
  CallEnd,
  Close as CloseIcon,
  Cast,
  CardTravel,
  Compare as CompareIcon,
} from "@mui/icons-material";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { pdfjs } from "react-pdf";
import { samplePackageData } from "../../data/samplePackageData";
import { agentPackageService } from "../../services/AgentPackageService";
import { openTokSessionSingleton } from "../../services/OpenTokSessionManager";
// import { scrollSyncManager } from "../../services/ScrollSyncManager"; // Disabled - using useCoBrowseScrollSync hook instead
import { packageDetailsCoBrowseSingleton } from "../../services/PackageDetailsCoBrowseManager";
import { comparisonSyncService } from "../../services/ComparisonSyncService"; // legacy chunking support
import { syncManager } from '../../sync/syncManager';
import { extractPackageIds, getPackagesByIds } from "../../utils/packageLookup";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://192.168.8.96:3000";
const ENABLE_AGENT_VIDEO = import.meta.env.VITE_AGENT_ENABLE_VIDEO === "true";
const ENABLE_AGENT_AUDIO = import.meta.env.VITE_AGENT_ENABLE_AUDIO === "true";

// Use centralized package data
const tourPackages = samplePackageData;

const MeetingPage = ({ sessionId, onCallEnd, onRemoteJoinStateChange }) => {
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [localVideoOn, setLocalVideoOn] = useState(ENABLE_AGENT_VIDEO);
  const [localAudioOn, setLocalAudioOn] = useState(ENABLE_AGENT_AUDIO);
  const [remoteVideoOn, setRemoteVideoOn] = useState(false);
  const [remoteUserName, setRemoteUserName] = useState("Customer");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasVideoInput, setHasVideoInput] = useState(false);
  const [hasAudioInput, setHasAudioInput] = useState(false);
  const [videoAssistActive, setVideoAssistActive] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [customerFileUrl, setCustomerFileUrl] = useState(null);
  const [customerFileDialogOpen, setCustomerFileDialogOpen] = useState(false);
  const [customerFileName, setCustomerFileName] = useState(null);
  const [waitingForSignedDoc, setWaitingForSignedDoc] = useState(false);
  const [signedDocUrl, setSignedDocUrl] = useState(null);
  const [signedDocName, setSignedDocName] = useState(null);
  const [signedDocDialogOpen, setSignedDocDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCustomerLeftPopup, setShowCustomerLeftPopup] = useState(false);
  const [isCobrowsing, setIsCobrowsing] = useState(false);
  const [openCoBrowseDialog, setOpenCoBrowseDialog] = useState(false);
  const [coBrowseUrl, setCoBrowseUrl] = useState("");

  // Packages state
  const [packagesDialogOpen, setPackagesDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('browse'); // 'browse' or 'shared'
  const [selectedPackages, setSelectedPackages] = useState(() => {
    if (typeof window === 'undefined') return [];
    const stored = window.sessionStorage.getItem('agent-shared-selection');
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [sharedPackages, setSharedPackages] = useState(() => {
    const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem('agent-shared-packages') : null;
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse stored shared packages:', err);
    }
    return [];
  });
  const [sharedComparisonOpen, setSharedComparisonOpen] = useState(false);
  // Local state to reflect compare packages received via signals

  // Package sharing progress state
  const [isSharingPackages, setIsSharingPackages] = useState(false);
  const [sharingProgress, setSharingProgress] = useState(0);
  const [sharingStatus, setSharingStatus] = useState('');
  const [packageDetailsToOpen, setPackageDetailsToOpen] = useState(null);
  // Legacy state (no longer used)
  // Legacy state (no longer used) - removed

  const fileInputRef = useRef(null);
  const publisherRef = useRef(null);
  const subscriberRef = useRef(null);
  const webcamPublisherRef = useRef(null);
  const screenPublisherRef = useRef(null);
  const publisherContainerRef = useRef(null);
  const customerLeftTimeoutRef = useRef(null);

  // Comparison functionality
  const {
    compareList,
    isComparisonOpen,
    addToCompare,
    removeFromCompare,
    clearComparison,
    getBestValue,
    batchAddToCompare,
    isInComparison,
    isComparisonFull,
    openComparison,
    closeComparison,
    setCompareIds
  } = useComparePackages('agent');

  // --- Modal open/close sync state ---
  // Listen for compare modal open/close state from syncManager
  useEffect(() => {
    const unsubscribe = syncManager.onStateChange((state) => {
      // Check for comparison modal open/close in metadata
      const detail = state.metadata?.detail || {};
      if (typeof detail.comparisonOpen === 'boolean') {
        if (detail.comparisonOpen && !isComparisonOpen) {
          openComparison();
        } else if (!detail.comparisonOpen && isComparisonOpen) {
          closeComparison();
        }
      }
    });
    return unsubscribe;
  }, [isComparisonOpen, openComparison, closeComparison]);

  // Broadcast compare modal open/close state
  const broadcastComparisonModalState = (open) => {
    syncManager.detailAction('comparison', { comparisonOpen: open, ts: Date.now() });
  };

  // Prefer the locally synced comparison list (from signals) when available
  const effectiveCompareList = compareList;

  const handleComparePackages = () => {
    // Ensure all selected packages are in the compare set atomically
    const ids = selectedPackages.length > 0 ? selectedPackages : compareList.map(p => p.id);
    setCompareIds(ids, { broadcast: true });
    openComparison();
    broadcastComparisonModalState(true);
    // Optionally: still broadcast legacy detailAction for backward compatibility
    syncManager.detailAction('comparison', { comparison: { open: true, packageIds: ids, ts: Date.now() } });

    // --- Send signal to customer to sync comparison and open modal ---
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (session) {
      openTokSessionSingleton.sendSignal(
        {
          type: "comparison-action",
          data: JSON.stringify({
            action: "agent-opened-comparison",
            packageIds: ids,
            ts: Date.now(),
          }),
        },
        (err) => {
          if (err) {
            console.error("Failed to send shared-comparison-open signal:", err);
          } else {
            console.log("Sent shared-comparison-open signal to customer");
          }
        }
      );
    }
  };

  const ensureMediaAccess = async () => {
    if (!ENABLE_AGENT_VIDEO && !ENABLE_AGENT_AUDIO) return true;
    
    try {
      // Check if we already have the required permissions
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoPermission = devices.some(device => device.kind === 'videoinput' && device.label);
      const hasAudioPermission = devices.some(device => device.kind === 'audioinput' && device.label);
      
      // Request permissions only if needed
      if ((ENABLE_AGENT_VIDEO && !hasVideoPermission) || (ENABLE_AGENT_AUDIO && !hasAudioPermission)) {
        await navigator.mediaDevices.getUserMedia({
          video: ENABLE_AGENT_VIDEO && !hasVideoPermission,
          audio: ENABLE_AGENT_AUDIO && !hasAudioPermission,
        });
      }
      
      return true;
    } catch (error) {
      console.error('🎥 Failed to get media access:', error);
      if (error.name === 'NotAllowedError') {
        alert('Please allow camera/microphone access to use video chat.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera/microphone found. Please check your device settings.');
      }
      return false;
    }
  };

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;

    async function initSession() {
      try {
        const res = await axios.post(`${backendUrl}/api/opentok-token`, {
          sessionId,
          userType: "publisher",
          userData: { name: "Agent" },
        });

        const { apiKey, token } = res.data;
        if (!isMounted) return;

        const session = OT.initSession(apiKey, sessionId);

        // Initialize the singleton with the session
        console.log("🔌 Initializing OpenTok session singleton", session);
        openTokSessionSingleton.initialize(session);

        // Note: Scroll synchronization is now handled by the useCoBrowseScrollSync hook in individual components
        // No need to initialize the global ScrollSyncManager service

        // Initialize package details co-browsing singleton
        packageDetailsCoBrowseSingleton.initialize();

        session.connect(token, async (err) => {
          if (err) {
            console.error("❌ Session connect error:", err);
            return;
          }
          console.log("✅ Agent connected to session");

          // Register signal handlers for file preview functionality
          openTokSessionSingleton.registerSignalHandlers({
            "signal:file-share": (event) => {
              console.log("📄 Agent received file-share signal from customer:", event);
              try {
                const parsed = JSON.parse(event.data);
                console.log("📄 Agent parsed file-share data:", parsed);
                setCustomerFileUrl(parsed.url);
                setCustomerFileName(parsed.name);
                setCustomerFileDialogOpen(true);
                console.log("📄 Agent set customer file dialog to open");
              } catch (err) {
                console.error("📄 Agent failed to parse file-share signal:", err);
              }
            },
            "signal:file-preview": (event) => {
              console.log("📄 Agent received file-preview signal from customer:", event);
              try {
                const parsed = JSON.parse(event.data);
                console.log("📄 Agent parsed file-preview data:", parsed);
                setCustomerFileUrl(parsed.url);
                setCustomerFileName(parsed.name);
                setCustomerFileDialogOpen(true);
                console.log("📄 Agent set customer file dialog to open from file-preview");
              } catch (err) {
                console.error("📄 Agent failed to parse file-preview signal:", err);
              }
            },
            "signal:file-preview-closed": () => {
              console.log("📄 Agent received file-preview-closed signal from customer");
              setCustomerFileDialogOpen(false);
              setCustomerFileUrl(null);
              setCustomerFileName(null);
            },
            "signal:file-for-signing": (event) => {
              console.log("📄 Agent received file-for-signing signal from customer:", event);
              try {
                const parsed = JSON.parse(event.data);
                console.log("📄 Agent parsed file-for-signing data:", parsed);
                setSignedDocUrl(parsed.url);
                setSignedDocName(parsed.name);
                setSignedDocDialogOpen(true);
                setWaitingForSignedDoc(false);
                console.log("📄 Agent set signed doc dialog to open");
              } catch (err) {
                console.error("📄 Agent failed to parse file-for-signing signal:", err);
              }
            },
            "signal:signed-document": (event) => {

              try {
                const data = JSON.parse(event.data);
                if (data.url) {
                  setSignedDocUrl(data.url);
                  setSignedDocName(data.name || "Signed Document");
                  setSignedDocDialogOpen(true);
                  setWaitingForSignedDoc(false);
                }
              } catch (err) {
                console.log("error", err);
              }

            },
            "signal:cobrowsing-url": (event) => {

              try {
                const data = JSON.parse(event.data);
                const url = data.sessionUrl;
                setCoBrowseUrl(url);
                setOpenCoBrowseDialog(true);
                setIsCobrowsing(true);
              } catch (err) {
                console.error("Failed to parse cobrowsing-url signal:", err);
              }

            },
            "signal:shared-comparison-open": (event) => {
              console.log("🎭 Agent received shared-comparison-open signal from customer:", event);
              try {
                const data = JSON.parse(event.data);
                console.log("🎭 Agent parsed shared-comparison-open data:", data);

                if (data.action === "customer-opened-comparison") {
                  console.log("🎭 Customer opened comparison modal - opening agent comparison");

                  // Update the comparison list with customer's data if provided (ID-based)
                  let packagesToAdd = [];
                  
                  if (data.packageIds && data.packageIds.length > 0) {
                    console.log("🎭 Agent received package IDs from customer:", data.packageIds);
                    // Reconstruct packages from IDs
                    packagesToAdd = getPackagesByIds(data.packageIds);
                    console.log(`🎭 Agent reconstructed ${packagesToAdd.length} packages from IDs`);
                  } else if (data.compareList && data.compareList.length > 0) {
                    // Backward compatibility: support old format
                    console.log("🎭 Agent received comparison data from customer (legacy format):", data.compareList);
                    packagesToAdd = data.compareList;
                  } else if (data.sharedPackages && data.sharedPackages.length > 0) {
                    // Backward compatibility: support old shared packages format
                    console.log("🎭 Agent received shared packages data from customer (legacy format):", data.sharedPackages);
                    packagesToAdd = data.sharedPackages;
                  }

              if (packagesToAdd.length > 0) {
                console.log("🎭 Agent batch adding packages from customer:", packagesToAdd.map(p => ({id: p.id, name: p.name})));
                batchAddToCompare(packagesToAdd);
              }

              openComparison();
                }
              } catch (err) {
                console.error("🎭 Agent failed to parse shared-comparison-open signal:", err);
              }
            },
            "signal:package-details-modal-action": (event) => {
              console.log("📦 Agent received package details modal action:", event);
              try {
                const data = JSON.parse(event.data);

                // Ignore signals from same user type
                if (data.userType === 'agent') {
                  return;
                }

                console.log("📦 Agent received package details action:", data.action);

                if (data.action === 'customer-opened-package-details' && data.packageId) {
                  console.log("📦 Customer opened package details - opening agent modal with package ID:", data.packageId);
                  // Find package by ID from local packages array
                  const packageData = getPackagesByIds([data.packageId])[0];
                  if (packageData) {
                    console.log("📦 Agent found package data for ID:", data.packageId);
                    setPackageDetailsToOpen(packageData);
                  } else {
                    console.error("📦 Agent could not find package data for ID:", data.packageId);
                  }
                } else if (data.action === 'close-package-details' || data.action === 'customer-closed-package-details') {
                  console.log("📦 Customer closed package details - closing agent modal");
                  setPackageDetailsToOpen(null);
                }
              } catch (err) {
                console.error("📦 Agent failed to parse package details modal action signal:", err);
              }
            },
            "signal:comparison-action": (event) => {
              console.log("🎭 Agent received comparison action signal:", event);
              try {
                const data = JSON.parse(event.data);

                // // Ignore signals from same user type
                // if (data.userType === 'agent') {
                //   return;
                // }

                console.log("🎭 Agent received comparison action:", data.action);

                if (data.action === 'clear-comparison') {
                  console.log("🎭 Customer cleared comparison - clearing agent comparison");
                  clearComparison();
                } else if (data.action === 'close-comparison') {
                  console.log("🎭 Customer closed comparison - closing agent comparison modal");
                  closeComparison();
                } else if (data.action === 'customer-opened-comparison') {
                  console.log("🎭 Customer opened comparison - opening agent comparison modal");
                  // Preferred compact payload with IDs
                  let packagesToAdd = [];
                  if (Array.isArray(data.packageIds) && data.packageIds.length > 0) {
                    console.log("🎭 Received packageIds:", data.packageIds);
                    packagesToAdd = getPackagesByIds(data.packageIds);
                    console.log(`🎭 Reconstructed ${packagesToAdd.length} packages from IDs`);
                  } else if (Array.isArray(data.compareList) && data.compareList.length > 0) {
                    console.log("🎭 Received full compareList:", data.compareList.length);
                    packagesToAdd = data.compareList;
                  }

                if (packagesToAdd.length > 0) {
                  batchAddToCompare(packagesToAdd);
                }

                openComparison();
                }
              } catch (err) {
                console.error("🎭 Agent failed to parse comparison action signal:", err);
              }
            },
            "signal:customer-request-packages": (event) => {
              console.log("🎭 Agent received customer-request-packages signal:", event);
              try {
                const data = JSON.parse(event.data);
                if (data.action === "open-packages-dialog") {
                  console.log("🎭 Customer requested to open packages dialog");
                  setPackagesDialogOpen(true);
                }
              } catch (err) {
                console.error("🎭 Agent failed to parse customer-request-packages signal:", err);
              }
            },
            "signal:open-package-details": (event) => {
              console.log("🎭 Agent received open-package-details signal:", event);
              try {
                const data = JSON.parse(event.data);
                if (data.action === "open-modal" && data.packageData) {
                  console.log("🎭 Customer requested to open package details modal");
                  // This will be handled by the AgentCatalog component
                  // We need to pass this data to the AgentCatalog
                  setPackageDetailsToOpen(data.packageData);
                }
              } catch (err) {
                console.error("🎭 Agent failed to parse open-package-details signal:", err);
              }
            },
            "signal:close-package-details": (event) => {
              console.log("🎭 Agent received close-package-details signal:", event);
              try {
                const data = JSON.parse(event.data);
                if (data.action === "close-modal") {
                  console.log("🎭 Customer requested to close package details modal");
                  // This will be handled by the AgentCatalog component
                  setPackageDetailsToOpen(null);
                }
              } catch (err) {
                console.error("🎭 Agent failed to parse close-package-details signal:", err);
              }
            }
          });

          // Add a general signal listener for debugging
          openTokSessionSingleton.registerGeneralSignalListener((event) => {
            console.log("🔌 Agent received general signal:", event.type, event.data);
          });

          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInput = devices.some((d) => d.kind === "videoinput");
            const audioInput = devices.some((d) => d.kind === "audioinput");

            setHasVideoInput(videoInput);
            setHasAudioInput(audioInput);
            setLocalVideoOn(ENABLE_AGENT_VIDEO && videoInput);
            setLocalAudioOn(ENABLE_AGENT_AUDIO && audioInput);

            if (
              (ENABLE_AGENT_VIDEO && videoInput) ||
              (ENABLE_AGENT_AUDIO && audioInput)
            ) {
              await ensureMediaAccess();
            }

            const publisherOptions = {
              insertMode: "append",
              width: "100%",
              height: "100%",
              name: "Agent",
              videoSource: ENABLE_AGENT_VIDEO && videoInput ? undefined : null,
              audioSource: ENABLE_AGENT_AUDIO && audioInput ? undefined : null,
              video: ENABLE_AGENT_VIDEO && videoInput,
              audio: ENABLE_AGENT_AUDIO && audioInput,
              showControls: false, // Hide default OpenTok controls
              videoContentHint: 'motion', // Optimize for movement
              enableStereo: ENABLE_AGENT_AUDIO, // Better audio quality if enabled
              enableDtx: false, // Disable discontinuous transmission for clearer audio
              maxResolution: { width: 1280, height: 720 }, // Limit resolution for better performance
              resolution: '640x480', // Default resolution
              frameRate: 30, // Standard frame rate
              insertDefaultUI: true, // Use default OpenTok UI elements
              style: { // Set standard styles
                buttonDisplayMode: 'off',
                nameDisplayMode: 'on',
              }
            };

            try {
              const webcamPublisher = OT.initPublisher(
                publisherContainerRef.current,
                publisherOptions,
                async (pubErr) => {
                  if (pubErr) {
                    console.error("🎥 Publisher init error:", pubErr);
                    if (pubErr.name === 'OT_USER_MEDIA_ACCESS_DENIED') {
                      alert('Please allow camera/microphone access to use video chat.');
                    }
                    return;
                  }

                  webcamPublisherRef.current = webcamPublisher;
                  publisherRef.current = webcamPublisher;

                  try {
                    await new Promise((resolve, reject) => {
                      session.publish(webcamPublisher, (pubErr2) => {
                        if (pubErr2) {
                          console.error("🎥 Publish error:", pubErr2);
                          reject(pubErr2);
                        } else {
                          resolve();
                        }
                      });
                    });

                    // Only send acceptance after successful publish
                    await new Promise((resolve, reject) => {
                      openTokSessionSingleton.sendSignal(
                        {
                          type: "callAccepted",
                          data: "Agent accepted the call",
                        },
                        (err) => {
                          if (err) {
                            console.error("🎥 Signal error:", err);
                            reject(err);
                          } else {
                            resolve();
                          }
                        }
                      );
                    });

                    console.log("🎥 Successfully initialized and published webcam");
                  } catch (error) {
                    console.error("🎥 Failed during publish or signal:", error);
                    if (webcamPublisherRef.current) {
                      webcamPublisherRef.current.destroy();
                      webcamPublisherRef.current = null;
                    }
                  }
                }
              );

              // Add error event listener
              webcamPublisher.on('streamDestroyed', (event) => {
                console.log("🎥 Stream was destroyed:", event.reason);
              });

              webcamPublisher.on('mediaStopped', () => {
                console.log("🎥 Media was stopped");
              });

              webcamPublisher.on('accessDenied', () => {
                console.error("🎥 Media access was denied");
                alert('Camera/microphone access was denied. Please check your browser settings.');
              });

            } catch (error) {
              console.error("🎥 Critical error during publisher initialization:", error);
            }

            webcamPublisher.on("streamCreated", (e) => {
              setShowCustomerLeftPopup(false);
              setLocalVideoOn(e.stream.hasVideo);
            });
          } catch (mediaErr) {
            console.error("Media error:", mediaErr);
            if (mediaErr.name === "NotReadableError") {
              //setRetryMedia(true);
            }
          }

          // Set up session event handlers
          session.on("streamCreated", (event) => {
            setHasRemoteStream(true);
            if (onRemoteJoinStateChange) onRemoteJoinStateChange(true);
            setRemoteVideoOn(event.stream.hasVideo);
            setRemoteUserName(event.stream.name);

            // Mark customer as active
            setShowCustomerLeftPopup(false);
            if (customerLeftTimeoutRef.current) {
              clearTimeout(customerLeftTimeoutRef.current);
              customerLeftTimeoutRef.current = null;
            }

            const subscriber = session.subscribe(
              event.stream,
              subscriberRef.current,
              {
                insertMode: "append",
                width: "100%",
                height: "100%",
                showControls: false, // Hide default OpenTok controls
              },
              (err) => {
                if (err) {
                  console.error("Subscribe error:", err);
                }
              }
            );

            subscriber.on("videoEnabled", () => {
              setRemoteVideoOn(true);
            });

            subscriber.on("videoDisabled", () => {
              setRemoteVideoOn(false);
            });
          });

          session.on("streamDestroyed", (event) => {
            const stream = event.stream;
            const reason = event.reason;

            console.log("🔌 Stream destroyed:", {
              reason,
              streamId: stream?.streamId,
              isPageVisible: !document.hidden
            });

            setHasRemoteStream(false);
            if (onRemoteJoinStateChange) onRemoteJoinStateChange(false);
            setRemoteVideoOn(false);

            // Clear any previous timeout and schedule a new grace period
            if (customerLeftTimeoutRef.current) {
              clearTimeout(customerLeftTimeoutRef.current);
              customerLeftTimeoutRef.current = null;
            }

            // Grace period: only show popup if customer does not reconnect soon
            customerLeftTimeoutRef.current = setTimeout(() => {
              console.log("⏰ Customer left grace period elapsed - showing popup");
              setShowCustomerLeftPopup(true);
              customerLeftTimeoutRef.current = null;
            }, 7000);
          });

          session.on("connectionDestroyed", (event) => {
            console.log("🔌 Connection destroyed:", event.reason);
          });

          session.on("exception", (e) => console.error("⚠️ OpenTok exception:", e));
        });
      } catch (err) {
        console.error("❌ Session initialization error:", err);
      }
    }

    initSession();

    return () => {
      isMounted = false;
      if (openTokSessionSingleton.isSessionAvailable()) {
        openTokSessionSingleton.getSession().disconnect();
      }
      // Cleanup signal handlers
      openTokSessionSingleton.unregisterSignalHandler("signal:file-share");
      openTokSessionSingleton.unregisterSignalHandler("signal:file-preview");
      openTokSessionSingleton.unregisterSignalHandler("signal:file-preview-closed");
      openTokSessionSingleton.unregisterSignalHandler("signal:file-for-signing");
      openTokSessionSingleton.unregisterSignalHandler("signal:shared-comparison-open");
      openTokSessionSingleton.unregisterSignalHandler("signal:customer-request-packages");
      openTokSessionSingleton.unregisterSignalHandler("signal:open-package-details");
      openTokSessionSingleton.unregisterSignalHandler("signal:close-package-details");

      // Note: Scroll sync cleanup is handled by the useCoBrowseScrollSync hook
    };
  }, [sessionId]);

  // Start or stop co-browsing
  const toggleCobrowsing = async () => {
    if (isCobrowsing) {
      setIsCobrowsing(false);
      setCoBrowseUrl("");
      setOpenCoBrowseDialog(false);
    } else {
      const session = openTokSessionSingleton.getSession();
      if (session) {
        openTokSessionSingleton.sendSignal(
          {
            type: "request-cobrowsing-url",
          },
          (err) => {
            if (err) {
              console.error("❌ Signal error:", err);
              setIsCobrowsing(false);
              setCoBrowseUrl("");
              setOpenCoBrowseDialog(false);
            }
          }
        );
      }
    }
  };

  const toggleVideo = async () => {
    const pub = webcamPublisherRef.current;
    if (!pub || !hasVideoInput || isScreenSharing) return;

    if (!localVideoOn) {
      const granted = await ensureMediaAccess();
      if (!granted) return;
    }

    try {
      pub.publishVideo(!localVideoOn);
      setLocalVideoOn(!localVideoOn);
    } catch (err) {
      console.error("Video toggle failed:", err);
    }
  };

  const toggleAudio = () => {
    const pub = webcamPublisherRef.current;
    if (!pub || !hasAudioInput || isScreenSharing) return;

    try {
      pub.publishAudio(!localAudioOn);
      setLocalAudioOn(!localAudioOn);
    } catch (err) {
      console.error("Audio toggle failed:", err);
    }
  };

    const initWebcamPublisher = async () => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!openTokSessionSingleton.isSessionAvailable()) {
            throw new Error('OpenTok session not available');
          }
          
          if (!publisherContainerRef.current) {
            throw new Error('Publisher container not found');
          }

          // Check media access first
          const mediaAccess = await ensureMediaAccess();
          if (!mediaAccess) {
            throw new Error('Failed to get media access');
          }

          const publisherOptions = {
            insertMode: "append",
            width: "100%",
            height: "100%",
            name: "Agent",
            videoSource: ENABLE_AGENT_VIDEO && hasVideoInput ? undefined : null,
            audioSource: ENABLE_AGENT_AUDIO && hasAudioInput ? undefined : null,
            video: ENABLE_AGENT_VIDEO && hasVideoInput,
            audio: ENABLE_AGENT_AUDIO && hasAudioInput,
            showControls: false,
            videoContentHint: 'motion',
            enableStereo: ENABLE_AGENT_AUDIO,
            enableDtx: false,
            maxResolution: { width: 1280, height: 720 },
            resolution: '640x480',
            frameRate: 30,
            insertDefaultUI: true,
            style: {
              buttonDisplayMode: 'off',
              nameDisplayMode: 'on',
            }
          };

          const newWebcamPublisher = OT.initPublisher(
            publisherContainerRef.current,
            publisherOptions,
            async (err) => {
              if (err) {
                console.error("🎥 Webcam publisher init error:", err);
                reject(err);
                return;
              }

              webcamPublisherRef.current = newWebcamPublisher;
              publisherRef.current = newWebcamPublisher;

              const session = openTokSessionSingleton.getSession();
              try {
                await new Promise((innerResolve, innerReject) => {
                  session.publish(newWebcamPublisher, (pubErr) => {
                    if (pubErr) {
                      console.error("🎥 Publish webcam error:", pubErr);
                      innerReject(pubErr);
                    } else {
                      innerResolve();
                    }
                  });
                });

                console.log("🎥 Successfully initialized and published new webcam");
                resolve();
              } catch (pubError) {
                console.error("🎥 Failed to publish webcam:", pubError);
                reject(pubError);
              }
            }
          );

          // Add event listeners for monitoring
          newWebcamPublisher.on('streamDestroyed', (event) => {
            console.log("🎥 New webcam stream was destroyed:", event.reason);
          });

          newWebcamPublisher.on('mediaStopped', () => {
            console.log("🎥 New webcam media was stopped");
          });

          newWebcamPublisher.on('accessDenied', () => {
            console.error("🎥 New webcam access was denied");
            reject(new Error('Camera/microphone access was denied'));
          });

        } catch (error) {
          console.error("🎥 Critical error during new webcam initialization:", error);
          reject(error);
        }
      });
    };  const toggleScreenShare = async () => {
    const session = openTokSessionSingleton.getSession();
    if (!session) return;

    if (isScreenSharing) {
      // Stop screen sharing
      if (screenPublisherRef.current) {
        session.unpublish(screenPublisherRef.current);
        screenPublisherRef.current.destroy();
        screenPublisherRef.current = null;
      }

      // Re-init webcam publisher
      initWebcamPublisher()
        .then(() => {
          setIsScreenSharing(false);
          setLocalVideoOn(true);
        })
        .catch((err) => {
          console.error("🎥 Failed to reinitialize webcam after screen share:", err);
          setIsScreenSharing(false);
          setLocalVideoOn(false);
        });
    } else {
      // Start screen sharing

      // Unpublish webcam before screen share
      if (webcamPublisherRef.current) {
        session.unpublish(webcamPublisherRef.current);
        webcamPublisherRef.current.destroy();
        webcamPublisherRef.current = null;
      }

      const screenPublisher = OT.initPublisher(
        publisherContainerRef.current,
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
          videoSource: "screen",
          audioSource: null,
          publishAudio: false,
          showControls: false, // Hide default OpenTok controls
        },
        (err) => {
          if (err) {
            console.error("Screen publisher init error:", err);
            // Try to re-publish webcam if screen share fails
            if (webcamPublisherRef.current) {
              session.publish(webcamPublisherRef.current);
            }
            return;
          }

          screenPublisherRef.current = screenPublisher;

          // Listen for user manually stopping screen share
          screenPublisher.on("mediaStopped", () => {
            if (session && screenPublisherRef.current) {
              session.unpublish(screenPublisherRef.current);
              screenPublisherRef.current.destroy();
              screenPublisherRef.current = null;
            }

            // Re-init webcam publisher
            initWebcamPublisher()
              .then(() => {
                setIsScreenSharing(false);
                setLocalVideoOn(true);
              })
              .catch((err) => {
                console.error("🎥 Failed to reinitialize webcam after media stop:", err);
                setIsScreenSharing(false);
                setLocalVideoOn(false);
              });
          });

          // Publish screen share
          session.publish(screenPublisher, (pubErr) => {
            if (pubErr) {
              console.error("Screen publish error:", pubErr);
              // Fallback: republish webcam
              if (webcamPublisherRef.current) {
                session.publish(webcamPublisherRef.current);
              }
              return;
            }

            setIsScreenSharing(true);
            setLocalVideoOn(false);
          });
        }
      );
    }
  };

  const handleVideoAssist = () => {
    const session = openTokSessionSingleton.getSession();
    if (!session) return;

    const nextState = !videoAssistActive;
    openTokSessionSingleton.sendSignal(
      {
        type: "video-assist",
        data: nextState ? "enable-video" : "disable-video",
      },
      (err) => {
        if (err) {
          console.error("Signal error:", err);
        } else {
          setVideoAssistActive(nextState);
        }
      }
    );
  };

  const handleEndCall = async () => {
    const session = openTokSessionSingleton.getSession();
    if (session) {
      openTokSessionSingleton.sendSignal(
        { type: "endCall", data: "Agent ended the call" },
        (err) => {
          if (err) console.error("Signal send error:", err);
        }
      );
      session.disconnect();
    }

    onCallEnd();
  };

  const handleCloseFileDialog = () => {
    const session = openTokSessionSingleton.getSession();
    if (session) {
      openTokSessionSingleton.sendSignal(
        {
          type: "file-preview-closed",
          data: "Agent closed the file preview",
        },
        (err) => {
          if (err) console.error("Signal send error:", err);
        }
      );
    }

    setCustomerFileUrl(null);
    setCustomerFileDialogOpen(false);
  };

  const getFileType = (url, name) => {
    const extension = name?.split(".").pop().toLowerCase();

    if (!extension) return "unknown";

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(extension))
      return "image";

    if (["mp4", "webm", "ogg", "mov", "avi"].includes(extension))
      return "video";

    if (["mp3", "wav", "ogg", "m4a"].includes(extension)) return "audio";

    if (["pdf"].includes(extension)) return "pdf";

    return "unknown";
  };

  const handleDownloadAndSignal = async () => {
    if (!signedDocUrl) return;

    try {
      const response = await fetch(signedDocUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = signedDocName || "downloaded-file";
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.warn("Direct download failed, opening file in new tab:", error);
      window.open(signedDocUrl, "_blank", "noopener,noreferrer");
    }
  };

  const renderFallbackAvatar = (label = "You") => (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.800",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          bgcolor: "grey.700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="white">
          {label[0]?.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );

  const isAnyDialogOpen =
    uploadDialogOpen ||
    customerFileDialogOpen ||
    signedDocDialogOpen ||
    waitingForSignedDoc ||
    isUploading;

  const ActivityToolbar = () => (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(216, 216, 216, 0.6)",
        borderRadius: 3,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        gap: 1,
        p: 1,
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <Tooltip title={localVideoOn ? "Turn off video" : "Turn on video"}>
        <span>
          <IconButton
            onClick={toggleVideo}
            sx={{ color: "white" }}
            disabled={isScreenSharing || !hasVideoInput}
          >
            {localVideoOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={localAudioOn ? "Turn off audio" : "Turn on audio"}>
        <span>
          <IconButton
            onClick={toggleAudio}
            sx={{ color: "white" }}
            disabled={!hasAudioInput}
          >
            {localAudioOn ? <Mic /> : <MicOff />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Enable Video Assist">
        <span>
          <IconButton
            onClick={handleVideoAssist}
            sx={{ color: videoAssistActive ? "lime" : "white" }}
          >
            <VideoFileIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}>
        <IconButton
          onClick={toggleScreenShare}
          sx={{ color: "white" }}
          disabled={isAnyDialogOpen}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>
      </Tooltip>

      <Tooltip title={isCobrowsing ? "Stop Co-browsing" : "Start Co-browsing"}>
        <IconButton
          onClick={toggleCobrowsing}
          sx={{ color: isCobrowsing ? "lime" : "white" }}
          disabled={isAnyDialogOpen}
        >
          <Cast />
        </IconButton>
      </Tooltip>

      <Tooltip title="Upload File">
        <IconButton
          component="label"
          sx={{ color: "white" }}
          disabled={isAnyDialogOpen}
        >
          <UploadFile onClick={() => setUploadDialogOpen(true)} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Browse Tour Packages">
        <IconButton
          onClick={async () => {
            console.log("🎭 Agent clicked 'Browse Tour Packages'");
            setViewMode('browse'); // Reset to browse mode
            setPackagesDialogOpen(true);
            // Send signal to customer to open their shared packages dialog
            const session = openTokSessionSingleton.getSession();
            console.log("🔌 Session in handleBrowseTourPackages", session);
            if (session) {
              console.log("📡 Sending signal to customer to open shared packages dialog");
              await openTokSessionSingleton.sendSignal({
                type: "agent-request-shared-packages",
                data: JSON.stringify({
                  action: "open-shared-packages-dialog",
                  timestamp: new Date().toISOString(),
                }),
              });
            }
          }}
          sx={{ color: "white" }}
          disabled={isAnyDialogOpen}
        >
          <CardTravel />
        </IconButton>
      </Tooltip>

      {/* Shared Packages Comparison */}
      {sharedPackages.length > 0 && (
        <Tooltip title={`Compare ${sharedPackages.length} shared packages`}>
          <IconButton
            onClick={openSharedComparison}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
            disabled={isAnyDialogOpen}
          >
            <CompareIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Upload & Send Document for Signing">
        <IconButton
          onClick={() => {
            fileInputRef.current.dataset.intent = "sign";
            fileInputRef.current.setAttribute("accept", ".pdf,.jpg,.jpeg,.png"); // ← restrict for signing
            fileInputRef.current.click();
          }}
          sx={{ color: "white" }}
          disabled={isAnyDialogOpen}
        >
          <Description />
        </IconButton>
      </Tooltip>

      <Tooltip title="End Call">
        <IconButton onClick={handleEndCall} sx={{ color: "red" }}>
          <CallEnd />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // Packages functions
  const handlePackageSelect = (packageId) => {
    console.log("📦 handlePackageSelect called with packageId:", packageId);
    console.log("📦 Current selectedPackages before update:", selectedPackages);
    setSelectedPackages((prev) => {
      const newSelection = prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId];
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('agent-shared-selection', JSON.stringify(newSelection));
      }
      return newSelection;
    });
  };

  const clearSelectedPackages = () => {
    setSelectedPackages([]);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('agent-shared-selection');
    }
  };

  const shareSelectedPackages = async () => {
    if (selectedPackages.length === 0) {
      alert("Please select at least one package to share.");
      return;
    }

    if (isSharingPackages) {
      alert("Package sharing is already in progress. Please wait...");
      return;
    }

    const packagesToShare = tourPackages.filter((pkg) =>
      selectedPackages.includes(pkg.id)
    );

    // Calculate total value of shared packages
    const totalValue = packagesToShare.reduce((sum, pkg) => sum + pkg.price, 0);

    setIsSharingPackages(true);
    setSharingProgress(0);
    setSharingStatus(`Preparing to share ${packagesToShare.length} packages...`);

    try {
      await agentPackageService.sendPackages(
        packagesToShare,
        {
          onProgress: (progress, sentChunks, totalChunks) => {
            setSharingProgress(progress);
            setSharingStatus(`Sending packages: ${sentChunks}/${totalChunks} chunks (${progress.toFixed(1)}%)`);
            console.log(`📦 Agent sending progress: ${progress.toFixed(1)}% (${sentChunks}/${totalChunks})`);
          },
          onComplete: () => {
            console.log(`✅ Successfully shared ${packagesToShare.length} packages worth $${totalValue.toLocaleString("en-US")}`);

            const mergedMap = new Map();
            sharedPackages.forEach(pkg => mergedMap.set(pkg.id, pkg));
            packagesToShare.forEach(pkg => mergedMap.set(pkg.id, pkg));

            const mergedPackages = Array.from(mergedMap.values());
            const sharedIds = mergedPackages.map(pkg => pkg.id);

            setSharedPackages(mergedPackages);
            setSelectedPackages(sharedIds);

            if (typeof window !== 'undefined') {
              window.sessionStorage.setItem('agent-shared-packages', JSON.stringify(mergedPackages));
              window.sessionStorage.setItem('agent-shared-selection', JSON.stringify(sharedIds));
            }

            setSharingStatus(`✅ Successfully shared ${packagesToShare.length} packages!`);

            // Switch to shared packages view after successful sharing
          setViewMode('shared');

            // Reset sharing state after a short delay
            setTimeout(() => {
              setIsSharingPackages(false);
              setSharingProgress(0);
              setSharingStatus('');
            }, 2000);
          },
          onError: (error) => {
            console.error("📦 Package share error:", error);
            setSharingStatus(`❌ Failed to share packages: ${error.message}`);
            alert(`Failed to share packages: ${error.message}`);

            // Reset sharing state after error
            setTimeout(() => {
              setIsSharingPackages(false);
              setSharingProgress(0);
              setSharingStatus('');
            }, 3000);
          },
          useChunking: 'auto' // Automatically determine if chunking is needed
        }
      );
    } catch (error) {
      console.error("📦 Error initiating package share:", error);
      setSharingStatus(`❌ Error: ${error.message}`);
      alert(`Error: ${error.message}`);

      // Reset sharing state
      setIsSharingPackages(false);
      setSharingProgress(0);
      setSharingStatus('');
    }
  };

  const openSharedComparison = () => {
    setSharedComparisonOpen(true);

    // Sync shared comparison with customer
    const session = openTokSessionSingleton.getSession();
    if (session && sharedPackages.length > 0) {
      // Extract package IDs to avoid OpenTok 8192 character limit
      const sharedPackageIds = extractPackageIds(sharedPackages);
      const compareListIds = extractPackageIds(compareList);
      
      console.log("🎭 Agent sending shared comparison with IDs:", {
        sharedPackageIds,
        compareListIds
      });

      openTokSessionSingleton.sendSignal(
        {
          type: "shared-comparison-open",
          data: JSON.stringify({
            action: "agent-opened-comparison",
            packageIds: sharedPackageIds.length > 0 ? sharedPackageIds : compareListIds, // Use IDs only
            timestamp: new Date().toISOString(),
          }),
        },
        (err) => {
          if (err) {
            console.error("Failed to send shared comparison signal:", err);
          }
        }
      );
    }
  };

  // Signal sending functions for child components
  const sendPackageDetailsAction = (action, packageData = null) => {
    const open = action === 'agent-opened-package-details';
    const packageId = packageData?.id || null;
    syncManager.detailAction('packageDetails', { packageDetails: { open, packageId, ts: Date.now() } });
    console.log('[sync] detailAction packageDetails', { open, packageId });

    // Also send OpenTok signal so the remote participant (customer) receives the action
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();
    if (session) {
      const payload = {
        action,
        userType: 'agent',
        timestamp: new Date().toISOString(),
      };

      if (packageId) payload.packageId = packageId;

      openTokSessionSingleton.sendSignal(
        {
          type: 'package-details-modal-action',
          data: JSON.stringify(payload),
        },
        (err) => {
          if (err) console.error('Failed to send package-details-modal-action signal (agent):', err);
        }
      );
    }
  };

  const sendComparisonAction = (action, packageIds) => {
    const session = openTokSessionSingleton.getSession && openTokSessionSingleton.getSession();

    if (action === 'agent-opened-comparison') {
      const ids = packageIds && packageIds.length ? packageIds : compareList.map(p => p.id);
      syncManager.detailAction('comparison', { comparison: { open: true, packageIds: ids, ts: Date.now() } });
      console.log('[sync] comparison open broadcast', ids);

      if (session) {
        openTokSessionSingleton.sendSignal(
          {
            type: 'comparison-action',
            data: JSON.stringify({ action: 'agent-opened-comparison', userType: 'agent', packageIds: ids, timestamp: Date.now() }),
          },
          (err) => {
            if (err) console.error('Failed to send comparison-action signal (open):', err);
          }
        );
      }
    } else if (action === 'close-comparison') {
      syncManager.detailAction('comparison', { comparison: { open: false, ts: Date.now() } });
      console.log('[sync] comparison close broadcast');

      if (session) {
        openTokSessionSingleton.sendSignal(
          {
            type: 'comparison-action',
            data: JSON.stringify({ action: 'close-comparison', userType: 'agent', timestamp: Date.now() }),
          },
          (err) => {
            if (err) console.error('Failed to send comparison-action signal (close):', err);
          }
        );
      }
    } else if (action === 'clear-comparison') {
      clearComparison();
      syncManager.detailAction('comparison', { comparison: { open: true, packageIds: [], ts: Date.now() } });
      console.log('[sync] comparison cleared');

      if (session) {
        openTokSessionSingleton.sendSignal(
          {
            type: 'comparison-action',
            data: JSON.stringify({ action: 'clear-comparison', userType: 'agent', timestamp: Date.now() }),
          },
          (err) => {
            if (err) console.error('Failed to send comparison-action signal (clear):', err);
          }
        );
      }
    }
  };


  const uploadFileAndSignal = async (file, type = "preview") => {
    if (!file) return;

    console.log("📄 Agent uploading file:", file.name, "type:", type);

    const extension = file.name?.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png"].includes(extension);
    const isPdf = extension === "pdf";

    if (type === "sign" && !isPdf && !isImage) {
      alert("Only PDF or image files (JPG, PNG) can be sent for signing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true); // ⬅️ START LOADER
    try {
      console.log("📄 Agent uploading file to server...");
      const res = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedFileUrl = res.data.url;
      const signalType = type === "sign" ? "file-for-signing" : "file-preview";

      console.log("📄 File uploaded successfully, URL:", uploadedFileUrl);
      console.log("📄 Sending signal to customer, type:", signalType);

      const session = openTokSessionSingleton.getSession();
      if (session) {
        openTokSessionSingleton.sendSignal(
          {
            type: signalType,
            data: JSON.stringify({
              name: file.name,
              url: uploadedFileUrl,
            }),
          },
          (err) => {
            if (err) {
              console.error("📄 Signal send error:", err);
            } else {
              console.log("📄 Signal sent successfully to customer");
              if (type === "sign") {
                setWaitingForSignedDoc(true);
              } else {
                setCustomerFileUrl(uploadedFileUrl);
                setCustomerFileName(file.name);
                setCustomerFileDialogOpen(true);
              }
            }
          }
        );
      } else {
        console.error("📄 No session available to send signal");
      }
    } catch (err) {
      console.error("📄 File upload failed:", err);
    } finally {
      setIsUploading(false); // ⬅️ STOP LOADER
    }
  };

  // Remove scrollbars and force 100vh for html/body
useLayoutEffect(() => {
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.overflow = 'hidden';
  return () => {
    document.documentElement.style.height = '';
    document.body.style.height = '';
    document.body.style.overflow = '';
  };
}, []);

  // Removed legacy comparePackages logging - using compareList from useComparePackages
  return (
    <Paper
      elevation={3}
      sx={{
        minHeight: 'calc(100vh - 58px)', // subtract header height
        height: 'calc(100vh - 58px)',
        bgcolor: 'grey.900',
        display: 'flex',
        flexDirection: 'column',
        p: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subscriber (Customer) Video Fullscreen */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          width: '100vw',
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Customer Controls Floating Toolbar (reuse ActivityToolbar with only video/mic) */}
        {typeof window !== 'undefined' && window.location.pathname.includes('customer') && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'rgba(30,30,30,0.85)',
              borderRadius: 3,
              boxShadow: 6,
              display: 'flex',
              gap: 1,
              p: 1,
              zIndex: 20,
            }}
          >
            <Tooltip title={localVideoOn ? 'Turn off video' : 'Turn on video'}>
              <span>
                <IconButton
                  onClick={toggleVideo}
                  sx={{ color: 'white' }}
                  disabled={!hasVideoInput}
                >
                  {localVideoOn ? <Videocam /> : <VideocamOff />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={localAudioOn ? 'Turn off audio' : 'Turn on audio'}>
              <span>
                <IconButton
                  onClick={toggleAudio}
                  sx={{ color: 'white' }}
                  disabled={!hasAudioInput}
                >
                  {localAudioOn ? <Mic /> : <MicOff />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
        <div
          ref={subscriberRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
        {!remoteVideoOn && renderFallbackAvatar(remoteUserName)}
        <Typography
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            bgcolor: "black",
            color: "white",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: 12,
            zIndex: 2,
          }}
        >
          Customer
        </Typography>

        {/* Publisher (Agent) Mini Video Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: { xs: 120, sm: 180, md: 240 },
            height: { xs: 90, sm: 135, md: 160 },
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "black",
            boxShadow: 6,
            zIndex: 10,
            display: localVideoOn || isScreenSharing ? "block" : "none",
          }}
        >
          <div
            ref={publisherContainerRef}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
          {(!localVideoOn && !isScreenSharing) && renderFallbackAvatar("You")}
          <Typography
            sx={{
              position: "absolute",
              bottom: 4,
              left: 4,
              bgcolor: "black",
              color: "white",
              px: 0.5,
              py: 0.25,
              borderRadius: 1,
              fontSize: 10,
              zIndex: 2,
            }}
          >
            You
          </Typography>
        </Box>
      </Box>

      <ActivityToolbar />

      <input
        type="file"
        accept="*/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files[0];
          const intent = e.target.dataset.intent || "preview";

          if (file) {
            await uploadFileAndSignal(
              file,
              intent === "sign" ? "sign" : "preview"
            );
          }

          e.target.value = "";
          delete e.target.dataset.intent;
        }}
      />

      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      >
        <DialogTitle>Select Upload Type</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            onClick={() => {
              setUploadDialogOpen(false);
              fileInputRef.current.click();
            }}
            sx={{ m: 1 }}
          >
            Agent Upload
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setUploadDialogOpen(false);
              const session = openTokSessionSingleton.getSession();
              if (session) {
                openTokSessionSingleton.sendSignal(
                  {
                    type: "file-request",
                    data: "Please upload your file.",
                  },
                  (err) => {
                    if (err) console.error("Signal error:", err);
                  }
                );
              } else {
                console.log("❌ No session available");
              }
            }}
            sx={{ m: 1 }}
          >
            Request Customer Upload
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={customerFileDialogOpen}
        onClose={handleCloseFileDialog}
        aria-labelledby="uploaded-file-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="uploaded-file-dialog-title">File Preview</DialogTitle>
        <DialogContent dividers>
          {customerFileUrl ? (
            (() => {
              const fileType = getFileType(customerFileUrl, customerFileName);

              switch (fileType) {
                case "image":
                  return (
                    <img
                      src={customerFileUrl}
                      alt={customerFileName}
                      style={{
                        width: "100%",
                        maxHeight: 600,
                        objectFit: "contain",
                      }}
                    />
                  );
                case "video":
                  return (
                    <video
                      src={customerFileUrl}
                      controls
                      style={{ width: "100%", maxHeight: 600 }}
                    />
                  );
                case "audio":
                  return (
                    <audio
                      src={customerFileUrl}
                      controls
                      style={{ width: "100%" }}
                    />
                  );
                case "pdf":
                  return (
                    <iframe
                      src={customerFileUrl}
                      title="Uploaded PDF Preview"
                      width="100%"
                      height="600px"
                      style={{ border: "none" }}
                    />
                  );
                default:
                  return (
                    <Typography>
                      Preview not available for this file type.{" "}
                      <a
                        href={customerFileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Click here to download.
                      </a>
                    </Typography>
                  );
              }
            })()
          ) : (
            <Typography color="error">Preview not available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFileDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={waitingForSignedDoc}
        onClose={() => { }}
        disableEscapeKeyDown
      >
        <DialogTitle>Waiting for Signed Document</DialogTitle>
        <DialogContent>
          <Typography>
            Document uploaded. Waiting for the customer to sign and send back...
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={signedDocDialogOpen}
        onClose={() => setSignedDocDialogOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="signed-doc-dialog-title"
      >
        <DialogTitle id="signed-doc-dialog-title">
          Signed Document Preview
        </DialogTitle>
        <DialogContent dividers>
          {signedDocUrl ? (
            (() => {
              const fileType = getFileType(signedDocUrl, signedDocName);

              switch (fileType) {
                case "image":
                  return (
                    <img
                      src={signedDocUrl}
                      alt={signedDocName}
                      style={{
                        width: "100%",
                        maxHeight: 600,
                        objectFit: "contain",
                      }}
                    />
                  );
                case "pdf":
                  return (
                    <iframe
                      src={signedDocUrl}
                      title="Uploaded PDF Preview"
                      width="100%"
                      height="600px"
                      style={{ border: "none" }}
                    />
                  );
                default:
                  return (
                    <Typography>
                      Preview not available for this file type.
                      <a href={signedDocUrl} target="_blank" rel="noreferrer">
                        Click here to download.
                      </a>
                    </Typography>
                  );
              }
            })()
          ) : (
            <Typography color="error">Preview not available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {signedDocUrl && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadAndSignal}
            >
              Download
            </Button>
          )}
          <Button onClick={() => setSignedDocDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isUploading} onClose={() => { }} disableEscapeKeyDown>
        <DialogTitle>Uploading File...</DialogTitle>
        <DialogContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress />
          <Typography>Please wait while the file is being uploaded.</Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCustomerLeftPopup}
        onClose={() => setShowCustomerLeftPopup(false)}
        aria-labelledby="customer-left-dialog-title"
      >
        <DialogTitle id="customer-left-dialog-title">
          Customer Disconnected
        </DialogTitle>
        <DialogContent>
          <Typography>The customer has left the session.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEndCall} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCoBrowseDialog}
        onClose={toggleCobrowsing}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Cobrowse Session</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <iframe
            src={coBrowseUrl}
            width="100%"
            height="600px"
            style={{ border: "none" }}
            title="Cobrowse Session"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleCobrowsing}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Card/Grid selection/sharing view (browse mode) */}
      {!isComparisonOpen && (
        <Dialog
          open={packagesDialogOpen}
          onClose={() => {
            setPackagesDialogOpen(false);
            setViewMode('browse');
          }}
          maxWidth="xl"
          fullWidth
          sx={{
            "& .MuiDialog-paper": { minHeight: "90vh", maxHeight: "95vh" },
          }}
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white", display: "flex", gap: 2 }}>
            <CardTravel />
            {viewMode === 'browse' ? 'Agent Catalog - Co-browsing Enabled' : `Shared Tour Packages (${sharedPackages.length})`}
            {/* Optionally add selection summary etc here */}
          </DialogTitle>
          <DialogContent>
            {/* AgentCatalog or CustomerCatalogView as before */}
            {viewMode === 'browse' ? (
              <AgentCatalog
                selectedPackages={selectedPackages}
                onPackageSelect={handlePackageSelect}
                clearSelectedPackages={clearSelectedPackages}
                sharedPackages={sharedPackages}
                isSharingPackages={isSharingPackages}
                sharingProgress={sharingProgress}
                sharingStatus={sharingStatus}
                packageDetailsToOpen={packageDetailsToOpen}
                onPackageDetailsOpened={() => setPackageDetailsToOpen(null)}
                sendPackageDetailsAction={sendPackageDetailsAction}
                compareList={effectiveCompareList}
                addToCompare={addToCompare}
                removeFromCompare={removeFromCompare}
                isInComparison={isInComparison}
                isComparisonFull={isComparisonFull}
                onComparePackages={handleComparePackages}
              />
            ) : (
              <CustomerCatalogView
                sharedPackages={sharedPackages}
                onInterested={pkg => {}}
                packageDetailsToOpen={packageDetailsToOpen}
                sendPackageDetailsAction={sendPackageDetailsAction}
                userType="agent"
                compareList={effectiveCompareList}
                addToCompare={addToCompare}
                removeFromCompare={removeFromCompare}
                isInComparison={isInComparison}
                isComparisonFull={isComparisonFull}
                onComparePackages={handleComparePackages}
              />
            )}
          </DialogContent>

          {viewMode === 'browse' && (
            <DialogActions
              sx={{
                p: 3,
                bgcolor: "grey.50",
                position: "sticky",
                bottom: 0,
                borderTop: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Button
                onClick={() => {
                  setPackagesDialogOpen(false);
                  setSelectedPackages([]);
                  setViewMode('browse');
                }}
                color="secondary"
              >
                Cancel
              </Button>

              <Button
                onClick={shareSelectedPackages}
                variant="contained"
                color="primary"
                disabled={selectedPackages.length === 0 || isSharingPackages}
                sx={{
                  minWidth: 200,
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow:
                    selectedPackages.length > 0 && !isSharingPackages
                      ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                      : "none",
                  background:
                    selectedPackages.length > 0 && !isSharingPackages
                      ? "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)"
                      : undefined,
                  "&:hover": {
                    background:
                      selectedPackages.length > 0 && !isSharingPackages
                        ? "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)"
                        : undefined,
                    boxShadow: !isSharingPackages ? "0 6px 16px rgba(25, 118, 210, 0.4)" : "none",
                    transform: !isSharingPackages ? "translateY(-2px)" : "none",
                  },
                  "&:disabled": {
                    background: "rgba(0, 0, 0, 0.12)",
                    color: "rgba(0, 0, 0, 0.26)",
                  },
                  transition: "all 0.3s ease",
                }}
                startIcon={isSharingPackages ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSharingPackages
                  ? `${sharingProgress.toFixed(0)}% - ${sharingStatus}`
                  : selectedPackages.length === 0
                    ? "Select Packages to Share"
                    : `Share ${selectedPackages.length} Package${selectedPackages.length > 1 ? "s" : ""}`}
              </Button>
            </DialogActions>
          )}

          {viewMode === 'shared' && (
            <DialogActions
              sx={{
                p: 3,
                bgcolor: "grey.50",
                position: "sticky",
                bottom: 0,
                borderTop: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Button
                onClick={() => {
                  setPackagesDialogOpen(false);
                  setViewMode('browse');
                }}
                color="secondary"
              >
                Close
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log("🔄 Switching to browse mode from shared view");
                  setViewMode('browse');
                  setSelectedPackages([]);
                }}
                sx={{
                  fontWeight: "bold",
                }}
              >
                Browse & Share More Packages
              </Button>
            </DialogActions>
          )}
        </Dialog>
      )}
      <TourComparisonModal
        open={isComparisonOpen}
        onClose={() => {
          closeComparison();
          broadcastComparisonModalState(false);
        }}
        compareList={compareList}
        onRemoveFromCompare={removeFromCompare}
        onClearComparison={clearComparison}
        getBestValue={getBestValue}
        userType="agent"
        sharedPackages={sharedPackages}
        sendComparisonAction={sendComparisonAction}
      />

      {/* Shared Packages Comparison Modal */}
      <Dialog
        open={sharedComparisonOpen}
        onClose={() => setSharedComparisonOpen(false)}
        maxWidth="xl"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "90vh",
            maxHeight: "95vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <CompareIcon />
          Shared Packages Comparison ({sharedPackages.length} packages)
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: '80vh' }}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {sharedPackages.map((pkg) => (
                <Grid sx={{ width: "250px" }} item xs={3} md={3} lg={3} key={pkg.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={pkg.image}
                      alt={pkg.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {pkg.name}
                      </Typography>
                      <Chip
                        label={pkg.type}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {pkg.description}
                      </Typography>
                      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                        ${pkg.price.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
          <Button
            onClick={() => setSharedComparisonOpen(false)}
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MeetingPage;

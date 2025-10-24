import React, { useState, useRef, useEffect, useMemo } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import CobrowseIO from "cobrowse-sdk-js";
import { getPackagesByIds } from "../../utils/packageLookup";
import { syncManager } from '../../sync/syncManager';

import {
  Box,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Fade,
  Backdrop,
} from "@mui/material";

// Components
import ErrorBoundary from "./components/ErrorBoundary";
import WaitingRoom from "./components/WaitingRoom";
import VideoControls from "./components/VideoControls";
import FilePreviewDialog from "./components/dialogs/FilePreviewDialog";
import FileUploadDialog from "./components/dialogs/FileUploadDialog";
import LoadingDialog from "./components/dialogs/LoadingDialog";
import AgentLeftDialog from "./components/dialogs/AgentLeftDialog";
import PackageShareDialog from "./components/dialogs/PackageShareDialog";
import ChunkedDataProgressDialog from "./components/dialogs/ChunkedDataProgressDialog";
import TourComparisonModal from "../../components/Compare/TourComparisonModal";

// Hooks
import { useVideoCall } from "./hooks/useVideoCall";
import { useChunkedPackageShare } from "../../hooks/useChunkedPackageShare";
import { useChunkedComparisonSync } from "../../hooks/useChunkedComparisonSync";
import { useComparePackages } from "../../hooks/useComparePackages";

// Utils and Constants
import { getFileType, generateSignedFilename } from "./utils/fileUtils";
import { CONFIG, FILE_TYPES } from "./constants";

// Services
import { openTokSessionSingleton } from "../../services/OpenTokSessionManager";
// import { scrollSyncManager } from "../../services/ScrollSyncManager"; // Disabled - using useCoBrowseScrollSync hook instead
import { packageDetailsCoBrowseSingleton } from "../../services/PackageDetailsCoBrowseManager";
// Note: comparisonSyncService is used in PackageShareDialog component

const CustomerPage = ({
  name,
  email,
  onEndCall,
  userId,
  setUserId,
  setCallStarted,
}) => {
  // File and dialog states
  const [fileUploadRequested, setFileUploadRequested] = useState(false);
  const [showUploadedDialog, setShowUploadedDialog] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [filePreviewName, setFilePreviewName] = useState(null);
  const [signatureDocUrl, setSignatureDocUrl] = useState(null);
  const [signatureDocName, setSignatureDocName] = useState(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sharedPackages, setSharedPackages] = useState([]);
  const [showPackagesDialog, setShowPackagesDialog] = useState(false);
  const [packageDetailsToOpen, setPackageDetailsToOpen] = useState(null);

  // Chunked package sharing states
  const [showChunkedProgressDialog, setShowChunkedProgressDialog] =
    useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const sigPadRef = useRef(null);

  // Create a ref to always have access to the latest signal handlers
  const signalHandlersRef = useRef(null);

  // Package details co-browsing singleton will be initialized when session is available
  // See the effect below that initializes both scroll sync and package details co-browsing

  // Chunked package sharing logic (using singleton)
  const {
    isReceiving,
    receivingProgress,
    receivingDetails,
    error: chunkedError,
    cleanup: cleanupChunkedShare,
    handleChunkMetadata,
    handleChunk,
  } = useChunkedPackageShare();

  // Chunked comparison sync logic
  const {
    handleChunkMetadata: handleComparisonChunkMetadata,
    handleChunk: handleComparisonChunk,
  } = useChunkedComparisonSync();

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
    closeComparison
  } = useComparePackages('customer');

  // Signal handlers for the video call (memoized to prevent unnecessary re-renders)
  const signalHandlers = useMemo(
    () => ({
      "signal:video-assist": (event) => {
        const data = event.data;
        if (data === "enable-video") {
          setActiveFeature("Video Assist");
        } else {
          setActiveFeature("");
        }
      },
      "signal:file-request": () => {
        setFileUploadRequested(true);
      },
      "signal:file-share": (event) => {
        console.log("📄 Customer received file-share signal:", event);
        try {
          const parsed = JSON.parse(event.data);
          console.log("📄 Customer parsed file-share data:", parsed);
          setFilePreviewUrl(parsed.url);
          setFilePreviewName(parsed.name);
          setShowUploadedDialog(true);
          console.log("📄 Customer set file preview dialog to open from file-share");
        } catch (err) {
          console.error("📄 Customer failed to parse file-share signal:", err);
        }
      },
      "signal:file-preview": (event) => {
        console.log("📄 Customer received file-preview signal:", event);
        try {
          const parsed = JSON.parse(event.data);
          console.log("📄 Customer parsed file data:", parsed);
          setFilePreviewUrl(parsed.url);
          setFilePreviewName(parsed.name);
          setShowUploadedDialog(true);
          console.log("📄 Customer set file preview dialog to open");
        } catch (err) {
          console.error("📄 Customer failed to parse file signal:", err);
        }
      },
      "signal:file-preview-closed": () => {
        setShowUploadedDialog(false);
        setFilePreviewUrl(null);
        setFilePreviewName(null);
      },
      "signal:file-for-signing": (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setSignatureDocUrl(parsed.url);
          setSignatureDocName(parsed.name);
          setSignatureModalOpen(true);
        } catch (err) {
          console.error("Failed to parse file-for-signing signal data:", err);
        }
      },
      "signal:package-share": (event) => {
        console.log("📦 Package share signal received! Data:", event.data);
        console.log("📦 Package share signal event:", event);
        console.log("📦 Package share signal event type:", event.type);

        try {
          const parsed = JSON.parse(event.data);
          console.log("📦 Parsed data:", parsed);
          console.log("📦 Parsed data type:", typeof parsed);
          console.log("📦 Parsed data keys:", Object.keys(parsed));

          if (parsed.packages && Array.isArray(parsed.packages)) {
            console.log(
              `📦 Successfully received ${parsed.packages.length} packages from agent`
            );
            console.log("📦 Packages data:", parsed.packages);
            console.log("📦 Package IDs received:", parsed.packages.map(p => p.id));

            const mergedPackages = [...parsed.packages];
            setSharedPackages(mergedPackages);
            setShowPackagesDialog(true);
          } else {
            console.error("📦 Invalid package data structure:", parsed);
            console.log(
              "📦 Expected 'packages' array, got:",
              typeof parsed.packages,
              parsed.packages
            );
          }
        } catch (err) {
          console.error("📦 Failed to parse package share signal:", err);
          console.error("📦 Raw data that failed to parse:", event.data);
        }
      },
      "signal:request-cobrowsing-url": async () => {
        try {
          const res = await axios.post(
            `${CONFIG.BACKEND_URL}/api/cobrowse-token`
          );
          const token = res.data?.token;

          CobrowseIO.license = CONFIG.COBROWSE_LICENSE_KEY;
          CobrowseIO.debug = true;
          await CobrowseIO.client();

          CobrowseIO.start({ allowIFrameStart: true });

          const cobrowseSession = await CobrowseIO.createSession();
          const sessionId = cobrowseSession.id();
          const sessionUrl = `https://cobrowse.io/session/${sessionId}/?token=${token}&end_action=none&navigation=none&messages=none`;

          // Use the session from singleton
          if (sessionUrl) {
            openTokSessionSingleton.sendSignal(
              {
                type: "cobrowsing-url",
                data: JSON.stringify({ action: "start", sessionUrl }),
              },
              (err) => {
                if (err) {
                  console.error("❌ Signal error:", err);
                }
              }
            );
          }
        } catch (error) {
          console.error("❌ Failed to parse cobrowsing signal:", error);
        }
      },
      "signal:agent-request-shared-packages": (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(
            "🎭 Agent requested to open shared packages dialog:",
            data
          );
          if (data.action === "open-shared-packages-dialog") {
            console.log("📦 Opening shared packages dialog for customer");
            setShowPackagesDialog(true);
          }
        } catch (err) {
          console.error(
            "Failed to parse agent-request-shared-packages signal:",
            err
          );
        }
      },
      "signal:shared-comparison-open": (event) => {
        console.log("🎭 Customer received shared-comparison-open signal from agent:", event);
        try {
          const data = JSON.parse(event.data);
          console.log("🎭 Customer parsed shared-comparison-open data:", data);

          if (data.action === "agent-opened-comparison") {
            console.log("🎭 Agent opened comparison modal - customer should open comparison");
            // This will be handled by the PackageShareDialog component
          }
        } catch (err) {
          console.error("🎭 Customer failed to parse shared-comparison-open signal:", err);
        }
      },
      "signal:package-share-chunk-metadata": (event) => {
        console.log(
          "📦 CUSTOMER: Signal handler triggered for package-share-chunk-metadata"
        );
        console.log("📦 CUSTOMER: Chunk metadata event:", event);
        handleChunkMetadata(event);
      },
      "signal:package-share-chunk": (event) => {
        console.log(
          "📦 CUSTOMER: Signal handler triggered for package-share-chunk"
        );
        console.log("📦 CUSTOMER: Chunk event:", event);
        handleChunk(event);
      },
      "signal:comparison-sync-chunk-metadata": (event) => {
        console.log(
          "🎭 CUSTOMER: Signal handler triggered for comparison-sync-chunk-metadata"
        );
        console.log("🎭 CUSTOMER: Comparison chunk metadata event:", event);
        handleComparisonChunkMetadata(event);
      },
      "signal:comparison-sync-chunk": (event) => {
        console.log(
          "🎭 CUSTOMER: Signal handler triggered for comparison-sync-chunk"
        );
        console.log("🎭 CUSTOMER: Comparison chunk event:", event);
        handleComparisonChunk(event);
      },
      "signal:open-package-details": (event) => {
        console.log("🎭 Customer received open-package-details signal:", event);
        try {
          const data = JSON.parse(event.data);
          if (data.action === "open-modal" && data.packageData) {
            // Only open modal if the package is in the shared packages list
            const isPackageShared = sharedPackages.some(pkg => pkg.id === data.packageData.id);
            if (isPackageShared) {
              console.log("🎭 Agent requested to open package details modal for shared package:", data.packageData.id);
              setPackageDetailsToOpen(data.packageData);
            } else {
              console.log("🎭 Agent requested to open package details but package is not shared - ignoring");
            }
          }
        } catch (err) {
          console.error("🎭 Customer failed to parse open-package-details signal:", err);
        }
      },
      "signal:close-package-details": (event) => {
        console.log("🎭 Customer received close-package-details signal:", event);
        try {
          const data = JSON.parse(event.data);
          if (data.action === "close-modal") {
            console.log("🎭 Agent requested to close package details modal");
            // This will be handled by the CustomerCatalogView component
            setPackageDetailsToOpen(null);
          }
        } catch (err) {
          console.error("🎭 Customer failed to parse close-package-details signal:", err);
        }
      },
      "signal:package-details-modal-action": (event) => {
        console.log("📦 Customer received package details modal action:", event);
        try {
          const data = JSON.parse(event.data);

          // Ignore signals from same user type
          if (data.userType === 'customer') {
            return;
          }

          console.log("📦 Customer received package details action:", data.action);

          if (data.action === 'agent-opened-package-details' && data.packageId) {
            console.log("📦 Customer received package details action with ID:", data.packageId);
            // Find package by ID from local packages array
            const packageData = getPackagesByIds([data.packageId])[0];
            if (packageData) {
              console.log("📦 Customer found package data for ID:", data.packageId);
              // Only open modal if the package is in the shared packages list
              const isPackageShared = sharedPackages.some(pkg => pkg.id === data.packageId);
              if (isPackageShared) {
                console.log("📦 Agent opened package details - opening customer modal with shared package:", data.packageId);
                setPackageDetailsToOpen(packageData);
              } else {
                console.log("📦 Agent opened package details but package is not shared - ignoring");
              }
            } else {
              console.error("📦 Customer could not find package data for ID:", data.packageId);
            }
          } else if (data.action === 'close-package-details') {
            console.log("📦 Agent closed package details - closing customer modal");
            setPackageDetailsToOpen(null);
          }
        } catch (err) {
          console.error("📦 Customer failed to parse package details modal action signal:", err);
        }
      },
      "signal:comparison-action": (event) => {
        console.log("🎭 Customer received comparison action signal:", event);
        try {
          const data = JSON.parse(event.data);

          // Ignore signals from same user type
          // if (data.userType === 'customer') {
          //   return;
          // }

          console.log("🎭 Customer received comparison action:", data.action);

          if (data.action === 'clear-comparison') {
            console.log("🎭 Agent cleared comparison - clearing customer comparison");
            clearComparison();
          } else if (data.action === 'close-comparison') {
            console.log("🎭 Agent closed comparison - closing customer comparison modal");
            closeComparison();
          } else if (data.action === 'agent-opened-comparison') {
            console.log("🎭 Agent opened comparison - opening customer comparison modal");
            
            // If agent sent comparison data, update customer's comparison list (ID-based)
            let packagesToAdd = [];
            
            if (data.packageIds && data.packageIds.length > 0) {
              console.log("🎭 Customer received package IDs from agent:", data.packageIds);
              // Reconstruct packages from IDs
              packagesToAdd = getPackagesByIds(data.packageIds);
              console.log(`🎭 Customer reconstructed ${packagesToAdd.length} packages from IDs`);
            } else if (data.compareList && data.compareList.length > 0) {
              // Backward compatibility: support old format
              console.log("🎭 Customer received comparison data from agent (legacy format):", data.compareList.length, "packages");
              packagesToAdd = data.compareList;
            }

            if (packagesToAdd.length > 0) {
              console.log("🎭 Customer syncing comparison packages from agent:", packagesToAdd.map(p => ({id: p.id, name: p.name})));
              batchAddToCompare(packagesToAdd);
            } else if (sharedPackages.length > 0) {
              console.log("🎭 Falling back to shared packages for comparison sync");
              batchAddToCompare(sharedPackages);
            }

            openComparison();
          }
        } catch (err) {
          console.error("🎭 Customer failed to parse comparison action signal:", err);
        }
      },
      // "signal:package-details-fullscreen-toggle": (event) => {
      //   console.log("🎭 Customer received fullscreen toggle signal:", event);
      //   try {
      //     const data = JSON.parse(event.data);
      //     console.log("🎭 Customer parsed fullscreen toggle data:", data);
      //   } catch (err) {
      //     console.error("🎭 Customer failed to parse fullscreen toggle signal:", err);
      //   }
      // },
    }),
    [handleChunk, handleChunkMetadata, handleComparisonChunkMetadata, handleComparisonChunk, sharedPackages, clearComparison, closeComparison, batchAddToCompare, openComparison]
  );

  // Update the ref whenever signal handlers change
  signalHandlersRef.current = signalHandlers;

  // Video call logic
  const {
    error,
    setError,
    joined,
    waitingForAgent,
    publisherHasVideo,
    subscriberHasVideo,
    agentLeft,
    setAgentLeft,
    isVideoEnabled,
    isAudioEnabled,
    publisherRef,
    subscriberRef,
    publisher,
    toggleVideo,
    toggleAudio,
  } = useVideoCall({
    name,
    email,
    setUserId,
    setCallStarted,
    onEndCall,
    signalHandlers,
  });

  // Initialize package details co-browsing when session is available
  useEffect(() => {
    if (openTokSessionSingleton.isSessionAvailable()) {
      // Note: Scroll synchronization is now handled by the useCoBrowseScrollSync hook in individual components
      // No need to initialize the global ScrollSyncManager service

      console.log('📦 Initializing package details co-browsing manager for customer');
      packageDetailsCoBrowseSingleton.initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTokSessionSingleton.isSessionAvailable()]);

  // Re-register signal handlers after singleton is initialized
  // useEffect(() => {
  //   if (openTokSessionSingleton.isSessionAvailable() && signalHandlers) {
  //     console.log('🔌 Re-registering signal handlers after singleton initialization:', Object.keys(signalHandlers));
  //     openTokSessionSingleton.registerSignalHandlers(signalHandlers);

  //     // Add a general signal listener for debugging
  //     openTokSessionSingleton.registerGeneralSignalListener((event) => {
  //       console.log("🔌 Customer received general signal:", event.type, event.data);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [signalHandlers, openTokSessionSingleton.isSessionAvailable()]);

  // Set up global callback for chunked package reception and progress dialog management
  useEffect(() => {
    // Register global callback for chunked package reception
    window.chunkedPackageReceived = (syntheticEvent) => {
      console.log('📦 CUSTOMER: chunkedPackageReceived called with:', syntheticEvent);
      console.log('📦 CUSTOMER: Synthetic event data:', syntheticEvent.data);
      console.log('📦 CUSTOMER: Synthetic event type:', syntheticEvent.type);
      console.log('📦 CUSTOMER: Available signal handlers:', signalHandlersRef.current ? Object.keys(signalHandlersRef.current) : 'none');

      // This will trigger the existing package-share signal handler
      const existingHandler = signalHandlersRef.current?.["signal:package-share"];
      if (existingHandler) {
        console.log('📦 CUSTOMER: Calling package-share handler with synthetic event');
        existingHandler(syntheticEvent);
      } else {
        console.error('📦 CUSTOMER: No package-share handler found!', signalHandlersRef.current);
        console.error('📦 CUSTOMER: signalHandlersRef.current:', signalHandlersRef.current);
      }
    };

    // Cleanup on unmount
    return () => {
      if (window.chunkedPackageReceived) {
        delete window.chunkedPackageReceived;
      }
    };
  }, [signalHandlers]); // Add signalHandlers dependency to ensure callback is updated

  // Show progress dialog when receiving chunks
  useEffect(() => {
    if (isReceiving) {
      setShowChunkedProgressDialog(true);
    } else {
      // Hide progress dialog when reception is complete or stopped
      setTimeout(() => setShowChunkedProgressDialog(false), 1000); // Small delay to show completion
    }
  }, [isReceiving]);

  // Cleanup chunked share on unmount
  useEffect(() => {
    return () => {
      cleanupChunkedShare();
      // Note: Scroll sync cleanup is handled by the useCoBrowseScrollSync hook
    };
  }, [cleanupChunkedShare]);

  // Render fallback avatar when video is disabled
  const renderFallbackAvatar = (label = "You") => {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.800",
          zIndex: 9999,
          borderRadius: 2,
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
  };

  // File upload and sharing
  const uploadAndShareFile = async (file) => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const res = await axios.post(
        `${CONFIG.BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileData = {
        name: res.data.name,
        url: res.data.url,
        type: file.type,
      };

      openTokSessionSingleton.sendSignal(
        {
          type: "file-share",
          data: JSON.stringify(fileData),
        },
        (err) => {
          if (err) {
            console.error("❌ File signal send error:", err);
            setError("Failed to share file.");
          } else {
            setFilePreviewUrl(res.data.url);
            setFilePreviewName(res.data.name);
            setShowUploadedDialog(true);
          }
        }
      );
    } catch (err) {
      console.error("❌ File upload failed:", err);
      setError("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file && openTokSessionSingleton.isSessionAvailable()) {
      await uploadAndShareFile(file);
    }
  };

  // Handle close file preview
  const handleCloseFilePreviewDialog = () => {
    setShowUploadedDialog(false);
    setFilePreviewUrl(null);
    setFilePreviewName(null);
  };

  // Handle signature document
  const handleSendSignedDocument = async (signatureDataUrl) => {
    if (!openTokSessionSingleton.isSessionAvailable() || !signatureDocUrl || !signatureDocName) {
      setError("Session or file not available for signing.");
      return;
    }

    const fileType = getFileType(signatureDocUrl, signatureDocName);
    let finalBlob;

    try {
      if (fileType === FILE_TYPES.PDF) {
        const pdfBytes = await fetch(signatureDocUrl).then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const sigImageBytes = await fetch(signatureDataUrl).then((res) =>
          res.arrayBuffer()
        );
        const pngImage = await pdfDoc.embedPng(sigImageBytes);
        const pngDims = pngImage.scale(0.5);

        const lastPage = pdfDoc.getPages().at(-1);
        const { width } = lastPage.getSize();

        lastPage.drawImage(pngImage, {
          x: width - pngDims.width - 40,
          y: 40,
          width: pngDims.width,
          height: pngDims.height,
        });

        const modifiedPdfBytes = await pdfDoc.save();
        finalBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      } else if (fileType === FILE_TYPES.IMAGE) {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = signatureDocUrl;

        await new Promise((res) => (image.onload = res));

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);

        const sigImg = new Image();
        sigImg.src = signatureDataUrl;

        await new Promise((res) => (sigImg.onload = res));

        const scale = 0.3;
        const sigWidth = sigImg.width * scale;
        const sigHeight = sigImg.height * scale;

        ctx.drawImage(
          sigImg,
          canvas.width - sigWidth - 20,
          canvas.height - sigHeight - 20,
          sigWidth,
          sigHeight
        );

        const mergedDataUrl = canvas.toDataURL("image/png");
        finalBlob = await (await fetch(mergedDataUrl)).blob();
      } else {
        alert(
          "This file type can't be signed directly. Please upload a PDF or image."
        );
        return;
      }

      const formData = new FormData();
      const finalFileName = generateSignedFilename(signatureDocName, fileType);
      formData.append("file", finalBlob, finalFileName);

      const res = await axios.post(
        `${CONFIG.BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const signalData = {
        name: finalFileName,
        url: res.data.url,
      };

      openTokSessionSingleton.sendSignal(
        {
          type: "signed-document",
          data: JSON.stringify(signalData),
        },
        (err) => {
          if (err) {
            console.error("Signal error:", err);
            setError("Failed to send signed document.");
          } else {
            setSignatureModalOpen(false);
            setSignatureDocUrl(null);
            setSignatureDocName(null);
          }
        }
      );
    } catch (err) {
      console.error("❌ Error signing document:", err);
      setError("Failed to sign document.");
    }
  };

  // Signal sending functions for child components
  const sendPackageDetailsAction = (action, packageData = null) => {
    const session = openTokSessionSingleton.getSession();
    if (!session) return;

    const signalData = {
      action,
      userType: 'customer',
      timestamp: new Date().toISOString(),
    };

    if (packageData) {
      // Only send package ID to minimize signal payload
      signalData.packageId = packageData.id;
      console.log("📦 Customer sending package details action with ID only:", packageData.id);
    }

    openTokSessionSingleton.sendSignal(
      {
        type: "package-details-modal-action",
        data: JSON.stringify(signalData),
      },
      (err) => {
        if (err) {
          console.error("Failed to send package details action signal:", err);
        } else {
          console.log("📦 Customer sent package details action:", action, packageData ? `for package ID: ${packageData.id}` : "");
        }
      }
    );
  };

  const sendComparisonAction = (action) => {
    const session = openTokSessionSingleton.getSession();
    if (!session) return;

    openTokSessionSingleton.sendSignal(
      {
        type: "comparison-action",
        data: JSON.stringify({
          action,
          userType: 'customer',
          timestamp: new Date().toISOString(),
        }),
      },
      (err) => {
        if (err) {
          console.error("Failed to send comparison action signal:", err);
        }
      }
    );
  };

  // Waiting room view
  if (joined && waitingForAgent) {
    return (
      <ErrorBoundary>
        <WaitingRoom
          userId={userId}
          onEndCall={onEndCall}
          setError={setError}
        />
      </ErrorBoundary>
    );
  }

  // Main video call interface
  return (
    <ErrorBoundary>
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          color: "#fff",
          flexDirection: "column",
        }}
      >
        {/* Error Display */}
        {error && (
          <Box
            sx={{
              position: "fixed",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <Chip
              label={error}
              color="error"
              onDelete={() => setError("")}
              sx={{
                boxShadow: 3,
                animation: "fadeIn 0.3s ease-in-out",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(-20px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            />
          </Box>
        )}

        {/* Active Feature Display */}
        {activeFeature && activeFeature !== "" && (
          <Typography variant="h6" textAlign="center" mb={2}>
            {activeFeature}
          </Typography>
        )}

        {/* Video Layout */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 2,
              bgcolor: "#000",
              overflow: "hidden",
            }}
          >
            {/* Main Video: Subscriber (Agent) if available */}
            <Box
              ref={subscriberRef}
              sx={{
                width: subscriberHasVideo ? "100%" : "0%",
                height: subscriberHasVideo ? "100%" : "0%",
                opacity: subscriberHasVideo ? 1 : 0,
                transition: "all 0.3s ease-in-out",
                "& video, & div": {
                  width: "100% !important",
                  height: "100% !important",
                  objectFit: "cover",
                  borderRadius: 2,
                },
              }}
            />

            {/* Picture-in-Picture or Fullscreen Publisher */}
            <Box
              sx={{
                position: "absolute",
                bottom: subscriberHasVideo ? 16 : 0,
                right: subscriberHasVideo ? 16 : 0,
                width: subscriberHasVideo ? "25%" : "100%",
                height: subscriberHasVideo ? "25%" : "100%",
                borderRadius: 2,
                bgcolor: "#1a1a1a",
                overflow: "hidden",
                boxShadow: subscriberHasVideo ? 6 : 0,
                transition: "all 0.3s ease-in-out",
              }}
            >
              {(!isVideoEnabled || !publisherHasVideo) &&
                renderFallbackAvatar(name || "You")}
              <Box
                ref={publisherRef}
                sx={{
                  width: "100%",
                  height: "100%",
                  opacity: isVideoEnabled && publisherHasVideo ? 1 : 0,
                  "& video, & div": {
                    width: "100% !important",
                    height: "100% !important",
                    objectFit: "cover",
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Video Controls */}
        <VideoControls
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          sharedPackages={sharedPackages}
          publisher={publisher.current}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          onShowPackages={() => {
            console.log("🎭 Customer clicked 'View Shared Packages'");
            setShowPackagesDialog(true);
            setPackageDetailsToOpen(null);
            // Send signal to agent to open their packages dialog
            const session = openTokSessionSingleton.getSession();
            if (session) {
              console.log("📡 Sending signal to agent to open packages dialog");
              openTokSessionSingleton.sendSignal({
                type: "customer-request-packages",
                data: JSON.stringify({
                  action: "open-packages-dialog",
                  timestamp: new Date().toISOString(),
                }),
              });
            } else {
              console.log("❌ No session available");
            }
          }}
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="*/*"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />

        {/* Dialogs */}
        <FileUploadDialog
          open={fileUploadRequested}
          onClose={() => setFileUploadRequested(false)}
          onUpload={() => fileInputRef.current?.click()}
        />

        <FilePreviewDialog
          open={showUploadedDialog}
          onClose={handleCloseFilePreviewDialog}
          filePreviewUrl={filePreviewUrl}
          filePreviewName={filePreviewName}
        />

        <Dialog
          open={signatureModalOpen}
          onClose={() => setSignatureModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Sign Document: {signatureDocName}</DialogTitle>
          <DialogContent
            dividers
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {signatureDocUrl && (
              <iframe
                src={signatureDocUrl}
                title="Document to Sign"
                width="100%"
                height="400px"
                style={{ border: "none" }}
              />
            )}

            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                height: 200,
              }}
            >
              <SignatureCanvas
                penColor="black"
                ref={sigPadRef}
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: "sigCanvas",
                  style: {
                    width: "100%",
                    height: "200px",
                    borderRadius: 8,
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                if (sigPadRef.current) sigPadRef.current.clear();
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
                  alert("Please provide your signature.");
                  return;
                }
                const dataUrl = sigPadRef.current
                  .getCanvas()
                  .toDataURL("image/png");

                handleSendSignedDocument(dataUrl);
              }}
              variant="contained"
              color="primary"
            >
              Send Signed Document
            </Button>
          </DialogActions>
        </Dialog>

        <LoadingDialog
          open={isUploading}
          title="Uploading File..."
          message="Please wait while the file is being uploaded."
        />

        <AgentLeftDialog
          open={agentLeft}
          onClose={() => {
            setAgentLeft(false);
            console.log("👤 Agent left dialog closed by user");
          }}
          onRequestNewCall={() => {
            console.log("🔄 Requesting new call - reloading page");
            window.location.reload();
          }}
        />

        {/* Package Share Dialog */}
        <PackageShareDialog
          open={showPackagesDialog}
          onClose={() => setShowPackagesDialog(false)}
          sharedPackages={sharedPackages}
          userType="customer"
          packageDetailsToOpen={packageDetailsToOpen}
          onPackageDetailsOpened={() => setPackageDetailsToOpen(null)}
          sendPackageDetailsAction={sendPackageDetailsAction}
          sendComparisonAction={sendComparisonAction}
        />

        {/* Simple test dialog to verify MUI Dialog works */}
        <Dialog open={false}>
          <DialogTitle>Test Dialog</DialogTitle>
        </Dialog>

        {/* Chunked Data Progress Dialog */}
        <ChunkedDataProgressDialog
          open={showChunkedProgressDialog}
          isReceiving={isReceiving}
          receivingProgress={receivingProgress}
          receivingDetails={receivingDetails}
          error={chunkedError}
          onClose={() => setShowChunkedProgressDialog(false)}
        />



        {/* Bottom Line Loader for Chunked Package Reception */}
        <Fade in={isReceiving}>
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderTop: "1px solid",
              borderColor: "divider",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    minWidth: "fit-content",
                  }}
                >
                  📦 Receiving packages...
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.85rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {receivingDetails?.status ||
                    `${receivingProgress?.toFixed(1) || 0}% complete`}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    minWidth: "fit-content",
                  }}
                >
                  {receivingProgress?.toFixed(0) || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={receivingProgress || 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(0, 0, 0, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {receivingDetails?.chunksReceived || 0} of{" "}
                  {receivingDetails?.totalChunks || 0} chunks
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {receivingDetails?.estimatedSize
                    ? `~${(receivingDetails.estimatedSize / 1024).toFixed(1)}KB`
                    : ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Tour Comparison Modal */}
        <TourComparisonModal
          open={isComparisonOpen}
          onClose={closeComparison}
          compareList={compareList}
          onRemoveFromCompare={removeFromCompare}
          onClearComparison={clearComparison}
          getBestValue={getBestValue}
          userType="customer"
          sharedPackages={sharedPackages}
          sendComparisonAction={null} // Customer doesn't send comparison actions
        />
      </Paper>
    </ErrorBoundary>
  );
};

export default CustomerPage;

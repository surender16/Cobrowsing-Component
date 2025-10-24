export const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://192.168.8.96:3000",
  COBROWSE_LICENSE_KEY: import.meta.env.VITE_COBROWSE_LICENSE_KEY,
};

export const FILE_TYPES = {
  IMAGE: "image",
  VIDEO: "video", 
  AUDIO: "audio",
  PDF: "pdf",
  UNKNOWN: "unknown",
};

export const SUPPORTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
export const SUPPORTED_VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "avi"];
export const SUPPORTED_AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "m4a"];
export const SUPPORTED_PDF_EXTENSIONS = ["pdf"];

export const PUBLISHER_CONFIG = {
  insertMode: "append",
  width: "100%",
  height: "100%",
  publishAudio: true,
  publishVideo: true,
  showControls: false,
  style: {
    buttonDisplayMode: 'off'
  }
};

export const SUBSCRIBER_CONFIG = {
  insertMode: "append",
  width: "100%",
  height: "100%",
  showControls: false,
  style: {
    buttonDisplayMode: 'off'
  }
};

export const ANIMATIONS = {
  SLIDE_UP: {
    "@keyframes slideUp": {
      "0%": { 
        opacity: 0,
        transform: "translateX(-50%) translateY(20px)",
      },
      "100%": { 
        opacity: 1,
        transform: "translateX(-50%) translateY(0)",
      },
    },
  },
  BOUNCE: {
    "@keyframes bounce": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-10px)" },
    },
  },
  PULSE: {
    "@keyframes pulse": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.5 },
      "100%": { opacity: 1 },
    },
  },
  SCALE: {
    "@keyframes scale": {
      "0%, 80%, 100%": { transform: "scale(0.5)", opacity: 0.5 },
      "40%": { transform: "scale(1)", opacity: 1 },
    },
  },
};

export const BREAKPOINTS = {
  MOBILE: "@media (max-width: 600px)",
  TABLET: "@media (max-width: 960px)",
  DESKTOP: "@media (min-width: 961px)",
};

export const ERROR_MESSAGES = {
  CAMERA_MIC_ACCESS: "Camera/Mic access denied or API error.",
  SESSION_CONNECT: "Could not connect to session.",
  PUBLISHING_FAILED: "Publishing to session failed.",
  PUBLISHER_INIT: "Could not access camera/mic.",
  FILE_UPLOAD_FAILED: "File upload failed. Please try again.",
  SIGN_DOCUMENT_FAILED: "Failed to sign document.",
  END_CALL_FAILED: "Failed to end call. Please try again.",
  NO_NAME: "Please enter your name.",
  NO_FILE_SELECTED: "No file selected.",
  SESSION_NOT_AVAILABLE: "Session or file not available for signing.",
};

export const SUCCESS_MESSAGES = {
  PERMISSIONS_GRANTED: "Permissions granted",
  FILE_UPLOADED: "File uploaded successfully",
  DOCUMENT_SIGNED: "Document signed successfully",
}; 
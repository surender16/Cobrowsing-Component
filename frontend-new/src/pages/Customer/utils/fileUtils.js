import {
  FILE_TYPES,
  SUPPORTED_IMAGE_EXTENSIONS,
  SUPPORTED_VIDEO_EXTENSIONS,
  SUPPORTED_AUDIO_EXTENSIONS,
  SUPPORTED_PDF_EXTENSIONS,
} from "../constants";

/**
 * Determines the file type based on URL and filename
 * @param {string} url - File URL
 * @param {string} name - File name
 * @returns {string} - File type (image, video, audio, pdf, unknown)
 */
export const getFileType = (url, name) => {
  const extension = name?.split(".").pop()?.toLowerCase();

  if (!extension) return FILE_TYPES.UNKNOWN;

  if (SUPPORTED_IMAGE_EXTENSIONS.includes(extension)) return FILE_TYPES.IMAGE;
  if (SUPPORTED_VIDEO_EXTENSIONS.includes(extension)) return FILE_TYPES.VIDEO;
  if (SUPPORTED_AUDIO_EXTENSIONS.includes(extension)) return FILE_TYPES.AUDIO;
  if (SUPPORTED_PDF_EXTENSIONS.includes(extension)) return FILE_TYPES.PDF;

  return FILE_TYPES.UNKNOWN;
};

/**
 * Validates if a file is supported for upload
 * @param {File} file - File object
 * @returns {boolean} - Whether the file is supported
 */
export const isFileSupported = (file) => {
  if (!file) return false;
  
  const extension = file.name?.split(".").pop()?.toLowerCase();
  if (!extension) return false;

  const allSupportedExtensions = [
    ...SUPPORTED_IMAGE_EXTENSIONS,
    ...SUPPORTED_VIDEO_EXTENSIONS,
    ...SUPPORTED_AUDIO_EXTENSIONS,
    ...SUPPORTED_PDF_EXTENSIONS,
  ];

  return allSupportedExtensions.includes(extension);
};

/**
 * Formats file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validates file size against maximum allowed size
 * @param {File} file - File object
 * @param {number} maxSizeMB - Maximum size in MB (default: 50MB)
 * @returns {boolean} - Whether file size is valid
 */
export const isFileSizeValid = (file, maxSizeMB = 50) => {
  if (!file) return false;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Creates a preview URL for a file
 * @param {File} file - File object
 * @returns {string} - Preview URL
 */
export const createFilePreviewUrl = (file) => {
  if (!file) return null;
  
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating preview URL:", error);
    return null;
  }
};

/**
 * Cleans up a preview URL
 * @param {string} url - Preview URL to revoke
 */
export const cleanupPreviewUrl = (url) => {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error revoking preview URL:", error);
    }
  }
};

/**
 * Checks if a file can be signed (PDF or image)
 * @param {string} url - File URL
 * @param {string} name - File name
 * @returns {boolean} - Whether file can be signed
 */
export const isFileSignable = (url, name) => {
  const fileType = getFileType(url, name);
  return fileType === FILE_TYPES.PDF || fileType === FILE_TYPES.IMAGE;
};

/**
 * Generates a signed filename
 * @param {string} originalName - Original filename
 * @param {string} fileType - File type
 * @returns {string} - Signed filename
 */
export const generateSignedFilename = (originalName, fileType) => {
  const nameBase = originalName.split(".")[0];
  const extension = fileType === FILE_TYPES.PDF ? "pdf" : "png";
  return `${nameBase}-signed.${extension}`;
}; 
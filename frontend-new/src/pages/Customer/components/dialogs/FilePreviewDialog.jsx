import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { getFileType } from "../../utils/fileUtils";
import { FILE_TYPES } from "../../constants";

const FilePreviewDialog = ({
  open,
  onClose,
  filePreviewUrl,
  filePreviewName,
}) => {
  const renderFilePreview = () => {
    if (!filePreviewUrl) {
      return (
        <Typography color="error">
          Preview not available.
        </Typography>
      );
    }

    const fileType = getFileType(filePreviewUrl, filePreviewName);

    switch (fileType) {
      case FILE_TYPES.IMAGE:
        return (
          <img
            src={filePreviewUrl}
            alt={filePreviewName}
            style={{
              width: "100%",
              maxHeight: 600,
              objectFit: "contain",
            }}
          />
        );
      
      case FILE_TYPES.VIDEO:
        return (
          <video
            src={filePreviewUrl}
            controls
            style={{ width: "100%", maxHeight: 600 }}
          />
        );
      
      case FILE_TYPES.AUDIO:
        return (
          <audio
            src={filePreviewUrl}
            controls
            style={{ width: "100%" }}
          />
        );
      
      case FILE_TYPES.PDF:
        return (
          <iframe
            src={filePreviewUrl}
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
              href={filePreviewUrl}
              target="_blank"
              rel="noreferrer"
            >
              Click here to download.
            </a>
          </Typography>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="uploaded-file-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="uploaded-file-dialog-title">
        File Preview
      </DialogTitle>
      <DialogContent dividers>
        {renderFilePreview()}
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog; 
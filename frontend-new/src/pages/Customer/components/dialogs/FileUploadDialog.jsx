import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const FileUploadDialog = ({ open, onClose, onUpload }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="file-upload-dialog-title"
      aria-describedby="file-upload-dialog-description"
    >
      <DialogTitle id="file-upload-dialog-title">
        File Upload Requested
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="file-upload-dialog-description">
          The agent has requested you to upload a file. Please select a
          file to share.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onUpload();
            onClose();
          }}
          variant="contained"
          color="primary"
          autoFocus
        >
          Upload File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog; 
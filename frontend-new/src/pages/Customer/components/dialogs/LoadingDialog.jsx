import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
} from "@mui/material";

const LoadingDialog = ({ 
  open, 
  title = "Loading...", 
  message = "Please wait while the operation is being processed." 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={() => {}} 
      disableEscapeKeyDown
      aria-labelledby="loading-dialog-title"
    >
      <DialogTitle id="loading-dialog-title">{title}</DialogTitle>
      <DialogContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
        <CircularProgress />
        <Typography>
          {message}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog; 
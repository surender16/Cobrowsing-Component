import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const AgentLeftDialog = ({ open, onClose, onRequestNewCall }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="agent-left-dialog-title"
      aria-describedby="agent-left-dialog-description"
    >
      <DialogTitle id="agent-left-dialog-title">Agent Left</DialogTitle>
      <DialogContent>
        <DialogContentText id="agent-left-dialog-description">
          The agent has left the call.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            onRequestNewCall();
          }}
          variant="contained"
          color="primary"
          autoFocus
        >
          Request New Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentLeftDialog; 
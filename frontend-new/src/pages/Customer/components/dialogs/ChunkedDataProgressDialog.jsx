import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { CloudDownload, Error as ErrorIcon, CheckCircle } from '@mui/icons-material';

/**
 * Dialog component for showing progress of chunked data transfer
 * Displays progress bar, chunk information, and status updates
 */
const ChunkedDataProgressDialog = ({
  open,
  isReceiving,
  receivingProgress,
  receivingDetails,
  error,
  onClose
}) => {
  const { chunksReceived, totalChunks, formattedSize, messageId } = receivingDetails;
  
  // Determine dialog state
  const isComplete = receivingProgress >= 100 && !isReceiving;
  const hasError = !!error;
  
  // Progress color based on state
  const getProgressColor = () => {
    if (hasError) return 'error';
    if (isComplete) return 'success';
    return 'primary';
  };

  // Status icon based on state
  const getStatusIcon = () => {
    if (hasError) {
      return <ErrorIcon color="error" sx={{ fontSize: 40 }} />;
    }
    if (isComplete) {
      return <CheckCircle color="success" sx={{ fontSize: 40 }} />;
    }
    return <CircularProgress size={40} />;
  };

  // Status text based on state
  const getStatusText = () => {
    if (hasError) {
      return 'Transfer Failed';
    }
    if (isComplete) {
      return 'Transfer Complete';
    }
    if (isReceiving) {
      return 'Receiving Package Data...';
    }
    return 'Preparing Transfer...';
  };

  // Progress text
  const getProgressText = () => {
    if (totalChunks > 0) {
      return `${chunksReceived}/${totalChunks} chunks received`;
    }
    return 'Initializing...';
  };

  return (
    <Dialog
      open={open}
      onClose={hasError || isComplete ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={!hasError && !isComplete}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          minHeight: 300
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <CloudDownload color="primary" />
          <Typography variant="h6" component="span">
            Packages List
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3} alignItems="center">
          {/* Status Icon */}
          <Box>
            {getStatusIcon()}
          </Box>

          {/* Status Text */}
          <Typography
            variant="h6"
            color={hasError ? 'error' : isComplete ? 'success.main' : 'text.primary'}
            textAlign="center"
          >
            {getStatusText()}
          </Typography>

          {/* Progress Bar */}
          {(isReceiving || isComplete) && (
            <Box width="100%" px={2}>
              <LinearProgress
                variant="determinate"
                value={receivingProgress}
                color={getProgressColor()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  {receivingProgress.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getProgressText()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Transfer Details */}
          {(formattedSize || totalChunks > 0) && (
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              {formattedSize && (
                <Chip
                  label={`Size: ${formattedSize}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
              {totalChunks > 0 && (
                <Chip
                  label={`Chunks: ${totalChunks}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Stack>
          )}

          {/* Error Message */}
          {hasError && (
            <Alert
              severity="error"
              sx={{ width: '100%', textAlign: 'left' }}
              action={
                <Chip
                  label="Retry Available"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              }
            >
              <Typography variant="body2">
                <strong>Transfer Error:</strong> {error.message || 'Unknown error occurred'}
              </Typography>
            </Alert>
          )}

          {/* Success Message */}
          {isComplete && !hasError && (
            <Alert severity="success" sx={{ width: '100%' }}>
              <Typography variant="body2">
                Package data received successfully! The packages will open automatically.
              </Typography>
            </Alert>
          )}

          {/* Transfer Info */}
          {isReceiving && !hasError && (
            <Box
              sx={{
                backgroundColor: 'grey.50',
                borderRadius: 1,
                p: 2,
                width: '100%',
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Transfer Information:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Large package data is being transferred in chunks for optimal performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • This ensures reliable delivery even with poor network conditions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • You can continue using other features during transfer
              </Typography>
            </Box>
          )}

          {/* Debug Info (in development) */}
          {import.meta.env.DEV && messageId && (
            <Typography variant="caption" color="text.disabled" textAlign="center">
              Transfer ID: {messageId}
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ChunkedDataProgressDialog; 
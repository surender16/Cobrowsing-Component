import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Phone,
  Person,
  Email,
  Videocam,
  ArrowBack,
  Cancel,
} from "@mui/icons-material";
import CustomerPage from "../Customer/CustomerPage";
import axios from "axios";

const VideoCallDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const [userId, setUserId] = useState("");
  const [requestDeclined, setRequestDeclined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomerPage, setShowCustomerPage] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!userInfo.name.trim()) newErrors.name = "Name is required";
    if (!userInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call or processing
    setTimeout(() => {
      setShowCustomerPage(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const fetchCalls = useCallback(async () => {
    if (!userId && callStarted) return; // Don't fetch if no userId

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/call-status/${userId}`
      );
      if (!response.data.success) {
        setRequestDeclined(true);
        setShowCustomerPage(false);
      }
      return response.data; // Return data for potential use
    } catch (err) {
      console.error("Failed to fetch call requests", err);
      setShowCustomerPage(false);
      onClose();
    }
  }, [callStarted, onClose, userId]); // Add userId as dependency

  useEffect(() => {
    if (!showCustomerPage) return; // Only poll when in customer page view

    let isMounted = true;

    // Set up interval
    const interval = setInterval(() => {
      if (isMounted) {
        fetchCalls();
      }
    }, 5000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchCalls, showCustomerPage]); // Add showCustomerPage as dependency

  const handleReset = () => {
    setRequestDeclined(false);
    setShowCustomerPage(false);
    setUserId("");
  };

  const handleClose = (event, reason) => {
    // Don't close if clicking backdrop during customer page view or when declined
    if ((showCustomerPage || requestDeclined) && reason === "backdropClick") {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: "50vw",
          boxShadow: theme.shadows[10],
          minHeight: showCustomerPage || requestDeclined ? "50vw" : "auto",
        },
      }}
    >
      {showCustomerPage ? (
        <>
          <DialogTitle
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              py: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box flexGrow={1} textAlign="center">
              Video Call Session
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                overflow: "auto",
              }}
            >
              <CustomerPage
                name={userInfo.name}
                email={userInfo.email}
                onEndCall={() => {
                  setShowCustomerPage(false);
                  handleClose();
                }}
                userId={userId}
                setUserId={setUserId}
                setCallStarted={setCallStarted}
              />
            </Box>
          </DialogContent>
        </>
      ) : requestDeclined ? (
        <>
          <DialogTitle
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cancel sx={{ mr: 1 }} />
            Call Declined
          </DialogTitle>
          <DialogContent sx={{ py: 4, textAlign: "center" }}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your call request has been declined
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Our travel expert is currently unavailable. Please try again
                later.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReset}
                  size="large"
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  Start New Request
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              py: 2,
              textAlign: "center",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Videocam sx={{ mr: 1 }} />
              {"Video Consultation"}
            </Box>
          </DialogTitle>

          <DialogContent sx={{ py: 4 }}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                Please provide your information to start the video call with our
                travel expert.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  required
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  required
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={onClose}
              sx={{
                mr: 2,
                px: 3,
                borderRadius: 2,
                color: theme.palette.text.secondary,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
              size="large"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Phone />
                )
              }
              onClick={handleSubmit}
              disabled={!userInfo.name || !userInfo.email || isSubmitting}
              size="large"
              sx={{
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {isSubmitting ? "Connecting..." : "Start Call"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default VideoCallDialog;

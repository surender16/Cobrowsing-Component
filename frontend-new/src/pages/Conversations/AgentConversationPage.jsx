import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Alert, CircularProgress, Tooltip, IconButton, Snackbar } from "@mui/material";
import { ArrowBack, VideoCall, ContentCopy } from "@mui/icons-material";
import MeetingPage from "../OpenTok/MeetingPage";
import { useConversation } from "../../contexts/ConversationContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AgentConversationPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { endSession, currentSession } = useConversation();
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
  const [customerJoined, setCustomerJoined] = useState(false);
  // Handler for MeetingPage to notify when customer joins/leaves
  const handleCustomerJoinState = (joined) => {
    setCustomerJoined(joined);
  };
  // Copy customer URL to clipboard
  const handleCopyCustomerUrl = () => {
    if (currentSession && currentSession.customerUrl) {
      navigator.clipboard.writeText(currentSession.customerUrl);
      setCopySnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setCopySnackbarOpen(false);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionValid, setSessionValid] = useState(false);
  const [, setSessionData] = useState(null);

  useEffect(() => {
    const initializeAgentSession = async () => {
      try {
        // Validate session exists
        const sessionResponse = await axios.get(`${backendUrl}/api/opentok/session/${sessionId}`);
        if (!sessionResponse.data.success) {
          setError("Invalid session ID");
          setLoading(false);
          return;
        }

        // Generate agent token
        const tokenResponse = await axios.post(`${backendUrl}/api/opentok/generate-token`, {
          sessionId,
          userType: "publisher",
          userData: {
            name: "Agent",
            userType: "agent",
            sessionId,
          },
        });

        if (tokenResponse.data.success) {
          setSessionData(tokenResponse.data);
          setSessionValid(true);
        } else {
          setError("Failed to generate agent token");
        }
      } catch (err) {
        console.error("Error initializing agent session:", err);
        setError("Failed to initialize session");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      initializeAgentSession();
    } else {
      setError("No session ID provided");
      setLoading(false);
    }
  }, [sessionId]);

  const handleBackToConversations = () => {
    endSession();
    navigate("/conversations");
  };

  const handleCallEnd = () => {
    endSession();
    handleBackToConversations();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Initializing session...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            maxWidth: 500,
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleBackToConversations}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Back to Conversations
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!sessionValid) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            maxWidth: 500,
          }}
        >
          <Alert severity="warning" sx={{ mb: 3 }}>
            Session not found or invalid
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleBackToConversations}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Back to Conversations
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 0,
          background: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToConversations}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,
              borderColor: (theme) => theme.palette.primary.light,
              "&:hover": {
                borderColor: (theme) => theme.palette.primary.contrastText,
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }}
          >
            Back
          </Button>
          <VideoCall sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Agent Video Call
            </Typography>
          </Box>
          {currentSession && currentSession.customerUrl && (
            <Tooltip title="Copy customer invite URL">
              <IconButton
                onClick={handleCopyCustomerUrl}
                sx={{
                  color: (theme) => theme.palette.secondary.main,
                  ml: 2,
                  bgcolor: (theme) => theme.palette.background.paper,
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.secondary.light,
                  },
                }}
                size="large"
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Alert
          severity={customerJoined ? "success" : "info"}
          sx={{
            bgcolor: (theme) => customerJoined ? theme.palette.success.light : theme.palette.secondary.light,
            color: (theme) => customerJoined ? theme.palette.success.contrastText : theme.palette.secondary.contrastText,
            border: (theme) => `1px solid ${customerJoined ? theme.palette.success.contrastText : theme.palette.secondary.contrastText}`,
            "& .MuiAlert-icon": { color: (theme) => customerJoined ? theme.palette.success.contrastText : theme.palette.secondary.contrastText },
          }}
        >
          {customerJoined ? "Customer joined the session" : "Waiting for customer to join..."}
        </Alert>
        <Snackbar
          open={copySnackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message="Customer invite URL copied!"
        />
      </Paper>

      {/* Video Call Interface */}
      <Box sx={{ flex: 1, position: "relative" }}>
        <MeetingPage
          sessionId={sessionId}
          activeCallId={sessionId} // Use sessionId as callId
          onCallEnd={handleCallEnd}
          onRemoteJoinStateChange={handleCustomerJoinState}
        />
      </Box>
    </Box>
  );
};

export default AgentConversationPage;

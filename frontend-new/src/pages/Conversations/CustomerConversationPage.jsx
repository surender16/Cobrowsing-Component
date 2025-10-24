import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Alert, CircularProgress } from "@mui/material";
import { ArrowBack, VideoCall, Person } from "@mui/icons-material";
import CustomerConversationWrapper from "./CustomerConversationWrapper";
import { useConversation } from "../../contexts/ConversationContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CustomerConversationPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { endSession } = useConversation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionData, setSessionData] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    userId: null,
  });
  const [callEnded, setCallEnded] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  // Handler for CustomerConversationWrapper to notify when agent joins/leaves
  const handleAgentJoinState = (joined) => {
    setAgentJoined(joined);
  };

  useEffect(() => {
    const initializeCustomerSession = async () => {
      try {
        // Validate session exists
        const sessionResponse = await axios.get(`${backendUrl}/api/opentok/session/${sessionId}`);
        if (!sessionResponse.data.success) {
          setError("Invalid session ID");
          setLoading(false);
          return;
        }

        // Generate customer token (publisher role for video/audio)
        const tokenResponse = await axios.post(`${backendUrl}/api/opentok/generate-token`, {
          sessionId,
          userType: "publisher",
          userData: {
            name: "Customer",
            userType: "customer",
            sessionId,
          },
        });

        if (tokenResponse.data.success) {
          setSessionData(tokenResponse.data);
          setCustomerData({
            name: "Customer",
            email: "customer@example.com", // This could be extracted from token data
            userId: sessionId, // Use sessionId as userId
          });
        } else {
          setError("Failed to generate customer token");
        }
      } catch (err) {
        console.error("Error initializing customer session:", err);
        setError("Failed to initialize session");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      initializeCustomerSession();
    } else {
      setError("No session ID provided");
      setLoading(false);
    }
  }, [sessionId]);

  const handleEndCall = () => {
    endSession();
    setCallEnded(true);
  };

  const handleBackToHome = () => {
    endSession();
    navigate("/");
  };

  if (loading) {
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
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Connecting to session...
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
        </Paper>
      </Box>
    );
  }

  if (callEnded) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: (theme) => theme.palette.secondary.main,
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
          <Alert severity="success" sx={{ mb: 3 }}>
            Call ended successfully. Thank you for your time!
          </Alert>
        </Paper>
      </Box>
    );
  }

  // Pass session data to CustomerPage through props
  // We need to modify the CustomerPage to accept session data directly
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Person sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Customer Video Call
            </Typography>
          </Box>
        </Box>

        <Alert
          severity={agentJoined ? "success" : "info"}
          sx={{
            bgcolor: (theme) => agentJoined ? theme.palette.success.light : theme.palette.secondary.light,
            color: (theme) => agentJoined ? theme.palette.success.contrastText : theme.palette.secondary.contrastText,
            border: (theme) => `1px solid ${agentJoined ? theme.palette.success.contrastText : theme.palette.secondary.contrastText}`,
            "& .MuiAlert-icon": { color: (theme) => agentJoined ? theme.palette.success.contrastText : theme.palette.secondary.contrastText },
          }}
        >
          {agentJoined ? "Agent joined the session" : "Connected to agent session"}
        </Alert>
      </Paper>

      {/* Customer Video Call Interface */}
      <Box sx={{ flex: 1, position: "relative" }}>
        <CustomerConversationWrapper
          name={customerData.name}
          sessionData={sessionData} // Pass session data for direct connection
          autoConnect={true} // Auto-connect to the session
          onEndCall={handleEndCall}
          onRemoteJoinStateChange={handleAgentJoinState}
        />
      </Box>
    </Box>
  );
};

export default CustomerConversationPage;

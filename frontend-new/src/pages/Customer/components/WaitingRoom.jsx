import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { CallEnd, Person } from "@mui/icons-material";
import axios from "axios";
import { openTokSessionSingleton } from "../../../services/OpenTokSessionManager";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://192.168.8.96:3000";

const WaitingRoom = ({ userId, onEndCall, setError }) => {
  const [isEndingCall, setIsEndingCall] = useState(false);

  const handleEndCall = async () => {
    setIsEndingCall(true);
    try {
      if (userId) {
        await axios.post(`${backendUrl}/api/call-request/${userId}/decline`);
      }
      if (openTokSessionSingleton.isSessionAvailable()) {
        openTokSessionSingleton.getSession().disconnect();
      }
      onEndCall?.();
    } catch (err) {
      console.error("Error ending call:", err);
      setError("Failed to end call. Please try again.");
    } finally {
      setIsEndingCall(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
        width: "100%",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Main content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 500,
          width: "100%",
        }}
      >
        {/* Avatar with animation */}
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: 3,
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        >
          <Person sx={{ fontSize: 48, color: "common.white" }} />
        </Box>

        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Connecting you to an agent
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Please hold while we find the perfect specialist to assist you.
          <br />
        </Typography>

        {/* Enhanced loading indicator */}
        <Box sx={{ position: "relative", width: "100%", mb: 4 }}>
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 0,
              top: -24,
              color: "text.secondary",
            }}
          >
            Searching agents...
          </Typography>
        </Box>

        {/* Enhanced animated dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 6,
            "& > div": {
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "primary.main",
              animation: "scale 1.4s infinite ease-in-out",
              "&:nth-of-type(1)": { animationDelay: "0s" },
              "&:nth-of-type(2)": { animationDelay: "0.2s" },
              "&:nth-of-type(3)": { animationDelay: "0.4s" },
              "@keyframes scale": {
                "0%, 80%, 100%": { transform: "scale(0.5)", opacity: 0.5 },
                "40%": { transform: "scale(1)", opacity: 1 },
              },
            },
          }}
        >
          {[1, 2, 3].map((i) => (
            <Box key={i} />
          ))}
        </Box>

        {/* Enhanced End Call Button */}
        <Button
          variant="contained"
          color="error"
          startIcon={<CallEnd />}
          onClick={handleEndCall}
          sx={{
            borderRadius: 50,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
            minWidth: 180,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
              bgcolor: "error.dark",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
          disabled={isEndingCall}
        >
          {isEndingCall ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Ending...
            </>
          ) : (
            "End Call"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default WaitingRoom; 
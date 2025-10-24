// AgentPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { Box, Divider, Paper, Typography } from "@mui/material";
import AgentHeader from "./AgentHeader";
import CallRequestList from "./CallRequestList";
import VideoCallPanel from "./VideoCallPanel";
import { syncManager } from '../../sync/syncManager';

const AgentPage = () => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://192.168.8.96:3000";
  const [activeCallId, setActiveCallId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  const handleAcceptCall = async (data) => {
    setActiveCallId(data.id);
    setSessionId(data.sessionId);
    setShowSidebar(false);
    requestMediaPermissions();
    try {
      await axios.post(`${backendUrl}/api/call-request/${data.id}/joined`);
      console.log(`Call ${data.id} joined`);
      // Initialize syncManager for agent after call accept
      try {
        syncManager.init({ otSession: null, localUserId: 'agent-' + (data.id || Date.now()), role: 'agent', sessionId: data.sessionId });
        console.log('[sync] Agent syncManager initialized');
      } catch(e){ console.error('[sync] init error', e); }
    } catch (err) {
      console.error("Failed to joined call:", err);
    }
  };

  async function requestMediaPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Permissions granted");
      // Stop tracks to release camera & mic immediately
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  const handleDeclineCall = async (callData) => {
    try {
      await axios.post(`${backendUrl}/api/call-request/${callData.id}/decline`);
      console.log(`Call ${callData.id} declined`);
    } catch (err) {
      console.error("Failed to decline call:", err);
    }
  };

  const handleCallEnd = () => {
    console.log("🚀 ~ handleCallEnd ~ activeCallId:", activeCallId);
    console.log("Call ended handle function");
    handleDeclineCall({ id: activeCallId });
    setActiveCallId(null);
    setSessionId(null);
    setShowSidebar(true);
    // Shutdown syncManager when call ends
    try { syncManager.shutdown(); } catch(e){ console.warn('[sync] shutdown issue', e); }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AgentHeader />
      <Divider />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", p: 2, gap: 2 }}>
        {showSidebar && (
          <Paper
            elevation={3}
            sx={{ width: 300, borderRadius: 2, overflowY: "auto", p: 2 }}
          >
            <CallRequestList
              onAccept={handleAcceptCall}
              onDecline={handleDeclineCall}
            />
          </Paper>
        )}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {sessionId ? (
            <VideoCallPanel
              activeCallId={activeCallId}
              sessionId={sessionId}
              onCallEnd={handleCallEnd}
            />
          ) : (
            <Paper
              elevation={2}
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a call to start video
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AgentPage;

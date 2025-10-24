import React from "react";
import { Box, Tooltip, Typography, IconButton } from "@mui/material";
import { Videocam, VideocamOff, Mic, MicOff, CardTravel } from "@mui/icons-material";
import { openTokSessionSingleton } from "../../../services/OpenTokSessionManager";

const VideoControls = ({
  isVideoEnabled,
  isAudioEnabled,
  sharedPackages,
  publisher,
  onToggleVideo,
  onToggleAudio,
  onShowPackages,
}) => {
  const isSessionAvailable = openTokSessionSingleton.isSessionAvailable();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(216, 216, 216, 0.6)",
        borderRadius: 3,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        gap: 1,
        p: 1,
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Video Control */}
      <Tooltip title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}>
        <span>
          <IconButton
            onClick={onToggleVideo}
            sx={{ color: "white" }}
          >
            {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </span>
      </Tooltip>

      {/* Audio Control */}
      <Tooltip title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}>
        <span>
          <IconButton
            onClick={onToggleAudio}
            sx={{ color: "white" }}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </IconButton>
        </span>
      </Tooltip>

      {/* Packages Control */}
      {sharedPackages.length > 0 && (
        <Tooltip title="View Shared Packages">
          <Box
            onClick={onShowPackages}
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              bgcolor: "#4caf50",
              border: "2px solid #4caf50",
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                transform: "scale(1.05)",
                bgcolor: "#388e3c",
                borderColor: "#388e3c",
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
              },
              "&::after": {
                content: `"${sharedPackages.length}"`,
                position: "absolute",
                top: -2,
                right: -2,
                width: 16,
                height: 16,
                bgcolor: "#ff5722",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "white",
                fontWeight: "bold",
              },
              "@media (max-width: 600px)": {
                width: 48,
                height: 48,
              },
            }}
          >
            <CardTravel sx={{ fontSize: 24, color: "white" }} />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default VideoControls; 
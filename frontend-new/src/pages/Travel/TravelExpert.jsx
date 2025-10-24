import { useState } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { Chat, VideoCall } from "@mui/icons-material";
import VideoCallDialog from "./VideoCallDialog";

const TravelExpert = () => {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const handleClose = (reason) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setVideoDialogOpen(false);
  };

  return (
    <Box
      sx={{
        py: 8,
        minHeight: "100vh",
        background: `url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80) no-repeat center center/cover`,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for readability
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
      id="travelExpert"
    >
      {/* Overlay for better text contrast */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 800,
          mx: "auto",
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "white",
            mb: 4,
            fontWeight: 700,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Adds depth
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: 100,
              height: 5,
              background: "#ffeb3b", // Travel gradient
              margin: "15px auto",
              borderRadius: 2.5,
            },
          }}
        >
          Talk to a Travel Expert
        </Typography>

        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency
            p: 6,
            maxWidth: 600,
            mx: "auto",
            boxShadow: 6,
            color: "#333",
            border: "2px solid rgba(255, 235, 59, 0.5)", // Yellowish border for travel vibe
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Avatar
            src="/expert-avatar.jpg"
            sx={{
              width: 180,
              height: 180,
              mx: "auto",
              mb: 4,
              border: "6px solid #ffeb3b", // Yellow border for travel theme
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: 600, color: "#2ecc71" }}
          >
            Travel Expert
          </Typography>
          <Typography
            color="primary"
            sx={{ mb: 3, fontWeight: 500, color: "#3498db" }}
          >
            Senior Travel Consultant
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 5, fontSize: "1.1rem", color: "#666" }}
          >
            With over 15 years of experience, our expert has guided thousands of
            travelers to their dream destinations with personalized itineraries.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Uncomment and style Chat button if needed */}
            {/* <Button
              variant="contained"
              color="success"
              startIcon={<Chat />}
              sx={{
                px: 4,
                py: 2,
                fontWeight: 600,
                backgroundColor: "#2ecc71",
                "&:hover": { backgroundColor: "#27ae60", transform: "translateY(-3px)" },
              }}
            >
              Chat Now
            </Button> */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<VideoCall />}
              onClick={() => setVideoDialogOpen(true)}
              sx={{
                px: 4,
                py: 2,
                fontWeight: 700,
                backgroundColor: "#ed6c60",
                color: "white",
                "&:hover": {
                  backgroundColor: "#ed6c60",
                  transform: "translateY(-3px)",
                },
                textTransform: "uppercase",
                borderRadius: 5,
              }}
            >
              Video Call
            </Button>
          </Box>
        </Box>
      </Box>

      <VideoCallDialog open={videoDialogOpen} onClose={handleClose} />
    </Box>
  );
};

export default TravelExpert;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Avatar } from "@mui/material";
import { VideoCall } from "@mui/icons-material";
import StartCallModal from "./components/StartCallModal";

const ConversationsLandingPage = () => {
    const navigate = useNavigate();
    const [startCallModalOpen, setStartCallModalOpen] = useState(false);

    const handleStartCall = (sessionData) => {
        // Navigate to the agent interface
        navigate(`/conversations/${sessionData.sessionId}`);
    };

    // modern minimal landing - no cards

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
                <Box
                    sx={{
                        minHeight: 'calc(100vh - 64px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                        color: 'white',
                        gap: 3,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        Start a Conversation
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ opacity: 0.9, maxWidth: 720, mx: 'auto' }}
                    >
                        Seamless video meetings with screen sharing, package comparison, and co‑browsing.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<VideoCall />}
                        onClick={() => setStartCallModalOpen(true)}
                        sx={{
                            mt: 2,
                            px: 5,
                            py: 1.75,
                            fontSize: '1.1rem',
                            borderRadius: 999,
                            background: '#ed6c60',
                            boxShadow: '0 12px 30px rgba(237, 108, 96, 0.35)',
                            '&:hover': {
                                background: '#ff7b72',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 18px 40px rgba(237, 108, 96, 0.45)'
                            },
                            transition: 'all 0.25s ease',
                        }}
                    >
                        Start New Call
                    </Button>
                </Box>
            </Container>

            {/* Start Call Modal */}
            <StartCallModal
                open={startCallModalOpen}
                onClose={() => setStartCallModalOpen(false)}
                onStartCall={handleStartCall}
            />
        </Box>
    );
};

export default ConversationsLandingPage;

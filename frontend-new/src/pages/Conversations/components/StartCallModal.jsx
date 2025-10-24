import React, { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Paper,
    Avatar,
} from "@mui/material";
import {
    Close as CloseIcon,
    VideoCall,
    Email,
    Person,
} from "@mui/icons-material";
import { useConversation } from "../../../contexts/ConversationContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const StartCallModal = ({ open, onClose, onStartCall }) => {
    const { startSession } = useConversation();
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    const validateForm = () => {
        if (!formData.customerName.trim()) {
            setError("Customer name is required");
            return false;
        }
        if (!formData.customerEmail.trim()) {
            setError("Customer email is required");
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.customerEmail)) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${backendUrl}/api/opentok/create-session`, {
                customerName: formData.customerName.trim(),
                customerEmail: formData.customerEmail.trim(),
            });

            console.log("Session created:", response.data);
            const { sessionId, agentToken: token, customerUrl } = response.data;

            // Start session in context
            startSession({
                sessionId,
                token,
                customerUrl,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
            });

            // Call the onStartCall callback with session data
            onStartCall({ sessionId, token, customerName: formData.customerName, customerUrl });

            // Reset form and close modal
            setFormData({ customerName: "", customerEmail: "" });
            onClose();

        } catch (err) {
            console.error("Error creating session:", err);
            setError(
                err.response?.data?.message ||
                "Failed to create session. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({ customerName: "", customerEmail: "" });
            setError("");
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    background: "rgba(255, 255, 255, 0.9)",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                        }}
                    >
                        <VideoCall />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Start New Call
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover" },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Paper
                    sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            mb: 3,
                            textAlign: "center",
                            fontStyle: "italic",
                        }}
                    >
                        Enter your customer's details to start a new video call session.
                        An email invite will be sent to them automatically.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            label="Customer Name"
                            value={formData.customerName}
                            onChange={handleInputChange("customerName")}
                            fullWidth
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <Person
                                        sx={{
                                            color: "action.active",
                                            mr: 1,
                                            fontSize: 20,
                                        }}
                                    />
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                        />

                        <TextField
                            label="Customer Email"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleInputChange("customerEmail")}
                            fullWidth
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <Email
                                        sx={{
                                            color: "action.active",
                                            mr: 1,
                                            fontSize: 20,
                                        }}
                                    />
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                        />
                        <TextField
                            label="Customer Phone"
                            type="tel"
                            value={formData.customerPhone}
                            onChange={handleInputChange("customerPhone")}
                            fullWidth
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <Email
                                        sx={{
                                            color: "action.active",
                                            mr: 1,
                                            fontSize: 20,
                                        }}
                                    />
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                        />
                    </Box>
                </Paper>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 3,
                    pt: 1,
                    background: "rgba(255, 255, 255, 0.9)",
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                }}
            >
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        textTransform: "none",
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !formData.customerName.trim() || !formData.customerEmail.trim()}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VideoCall />}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        textTransform: "none",
                        background: "#ed6c60",
                        "&:hover": {
                            background: "#ff7b72",
                        },
                        "&:disabled": {
                            background: "rgba(0, 0, 0, 0.12)",
                        },
                    }}
                >
                    {loading ? "Creating Session..." : "Start Call"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StartCallModal;

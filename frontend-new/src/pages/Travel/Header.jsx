import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Select,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon,
  VideoCall,
} from "@mui/icons-material";
import AnimatedLogo from "../Logo/AnimatedLogo";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          minHeight: "64px",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AnimatedLogo />
        </Box>

        {/* Search or Icon */}
        {!isMobile ? (
          <Box sx={{ flex: 1, maxWidth: 600, mx: 2 }}>
            <TextField
              fullWidth
              placeholder="Search or Ask a Question"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "20px",
                  backgroundColor: "#f4f7fdff",
                  height: "40px",
                  transition: "all 0.3s ease",
                  "&:hover": { backgroundColor: "#f4f7fdff" },
                  "&.Mui-focused": {
                    background:
                      "linear-gradient(to right, #f4f7fdff, #f4f7fdff)",
                  },
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>
        ) : (
          <IconButton onClick={() => setShowMobileSearch((prev) => !prev)}>
            {showMobileSearch ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        )}

        {/* Right Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Conversations Button */}
          <Tooltip title="Start Video Call" arrow>
            <Button
              variant="contained"
              onClick={() => navigate("/conversations")}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                padding: isMobile ? "6px" : "6px 16px",
                fontSize: "0.85rem",
                background: "#ed6c60",
                minWidth: isMobile ? "40px" : undefined,
                width: isMobile ? "40px" : "auto",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976D2, #00BCD4)",
                },
              }}
              aria-label="Start Video Call"
            >
              {isMobile ? (
                <VideoCall />
              ) : (
                <>
                  <VideoCall sx={{ mr: 1 }} />
                  Start Call
                </>
              )}
            </Button>
          </Tooltip>

          {!isMobile && (
            <Select
              value="English"
              variant="standard"
              disableUnderline
              IconComponent={ArrowDownIcon}
              sx={{
                fontSize: "0.95rem",
                "& .MuiSelect-select": {
                  paddingRight: "24px !important",
                },
              }}
            >
              <MenuItem value="English">English</MenuItem>
            </Select>
          )}

          {/* Login Button */}
          <Tooltip title="Login" arrow>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                padding: isMobile ? "6px" : "6px 16px",
                fontSize: "0.85rem",
                borderColor: "#e0e0e0",
                color: "text.primary",
                minWidth: isMobile ? "40px" : undefined,
                width: isMobile ? "40px" : "auto",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Login"
            >
              {isMobile ? (
                <PersonIcon />
              ) : (
                <>
                  <PersonIcon sx={{ mr: 1 }} />
                  Login / Register
                </>
              )}
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Mobile Search Collapse */}
      <Collapse in={showMobileSearch && isMobile}>
        <Box sx={{ px: 2, pb: 1 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search or Ask a Question"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "20px",
                backgroundColor: "#f5f5f5",
                height: "40px",
                "& fieldset": { border: "none" },
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") setShowMobileSearch(false);
            }}
          />
        </Box>
      </Collapse>
    </AppBar>
  );
};

export default Header;

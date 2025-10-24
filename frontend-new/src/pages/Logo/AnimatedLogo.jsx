import React from "react";
import { Box, Typography } from "@mui/material";
import { Flight } from "@mui/icons-material";

const AnimatedLogo = () => (
  <Box sx={{ display: "flex", alignItems: "center", height: "100%", width: "100%", cursor: "pointer" }}>
    <img
      src="https://www.ocean-holidays.co.uk/wp-content/uploads/2023/02/oh-logo.png"
      alt="Ocean Holidays Logo"
      style={{ height: 40, marginRight: 12 }}
    />
  </Box>
);

export default AnimatedLogo;

import { Paper, Typography, Box, IconButton, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import CardComp from "./CardComp"; // Assuming CardComp is in the same directory

const PackageCard = ({ title, packageData }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState({
    left: false,
    right: true,
  });

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isAtStart = scrollLeft === 0;
      // Added a small tolerance (1px) for isAtEnd to account for potential sub-pixel rendering issues.
      const isAtEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) < 1;

      setShowArrows({
        left: !isAtStart,
        right: !isAtEnd,
      });
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Adjusted scroll amount for smoother feel
      const newPosition =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;

    // Initial check
    checkScrollPosition();

    // Add event listener
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollPosition);
      // Re-check scroll position on window resize
      window.addEventListener("resize", checkScrollPosition);
    }

    // Cleanup
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      }
    };
  }, [packageData]); // Dependency on packageData to re-evaluate arrows if data changes

  return (
    <Paper
      elevation={4}
      sx={{
        py: { xs: 3, md: 4 }, // Responsive padding
        px: { xs: 1, md: 2 }, // Responsive padding
        mb: { xs: 3, md: 4 },
        position: "relative",
        overflow: "hidden", // Ensures no overflow issues from children
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightSemiBold, // Use theme fontWeight
          px: { xs: 2, md: 3 }, // Responsive padding
          pb: { xs: 1, md: 2 }, // Add padding below title
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: "relative" }}>
        {showArrows.left && (
          <IconButton
            onClick={() => handleScroll("left")}
            aria-label="scroll left"
            sx={{
              position: "absolute",
              left: theme.spacing(1),
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: theme.palette.background.paper,
              "&:hover": { backgroundColor: theme.palette.action.hover }, // More subtle hover
              boxShadow: theme.shadows[3], // Lighter shadow for arrows
              width: 44, // Slightly smaller
              height: 44,
              display: { xs: "none", sm: "flex" }, // Hide on extra small, show on small and up
              color: theme.palette.text.primary, // Ensure arrow color is visible
            }}
          >
            <ChevronLeft fontSize="medium" /> {/* Medium size icon */}
          </IconButton>
        )}

        {showArrows.right && (
          <IconButton
            onClick={() => handleScroll("right")}
            aria-label="scroll right"
            sx={{
              position: "absolute",
              right: theme.spacing(1),
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: theme.palette.background.paper,
              "&:hover": { backgroundColor: theme.palette.action.hover },
              boxShadow: theme.shadows[3],
              width: 44,
              height: 44,
              display: { xs: "none", sm: "flex" },
              color: theme.palette.text.primary,
            }}
          >
            <ChevronRight fontSize="medium" />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: theme.spacing(3),
            px: { xs: 2, md: 3 }, // Responsive padding
            py: theme.spacing(1),
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory", // Enable scroll snapping
            "& > *": {
              scrollSnapAlign: "start", // Align items to the start of the scroll area
            },
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none", // For Firefox
            overflowY: "hidden",
            willChange: "transform",
          }}
        >
          {packageData.map((pkg, index) => (
            <CardComp key={pkg.id || index} pkg={pkg} /> // Use a unique ID if available
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default PackageCard;

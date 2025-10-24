import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { styled, keyframes, useTheme } from "@mui/system";

// Animations
const slideInFromRight = keyframes`
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.4); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedVideoBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  transition: "opacity 1.2s ease, transform 1.2s ease, filter 1.2s ease",
  opacity: active ? 1 : 0,
  transform: active ? "scale(1)" : "scale(1.03)",
  filter: active ? "blur(0px)" : "blur(4px)",
  zIndex: 1,
  "& video": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
}));

const HomeBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const slides = [
    {
      title: "Himalayan Trekking Adventure",
      description:
        "Conquer high-altitude trails, explore remote villages, and witness breathtaking mountain vistas on our guided treks.",
      link: "/tours/himalayas",
      // This is a direct video URL from Pexels - may break in the future
      videoUrl:
        "https://videos.pexels.com/video-files/18869373/18869373-uhd_2560_1440_60fps.mp4",
    },
    {
      title: "Caribbean Beach Cruise",
      description:
        "Sail to pristine islands, snorkel vibrant reefs, and relax on white sand beaches with our luxury cruise packages.",
      link: "/tours/caribbean-cruise",
      // This is a direct video URL from Pexels - may break in the future
      videoUrl:
        "https://videos.pexels.com/video-files/15267266/15267266-uhd_2560_1440_30fps.mp4",
    },
    {
      title: "African Safari Expedition",
      description:
        "Track the Big Five, witness the Great Migration, and experience authentic bush camps on our premium safaris.",
      link: "/tours/african-safari",
      // This is a direct video URL from Pexels - may break in the future
      videoUrl:
        "https://videos.pexels.com/video-files/6168935/6168935-sd_640_360_30fps.mp4",
    },
    {
      title: "European Cultural Tour",
      description:
        "Explore historic cities, sample world-class cuisine, and discover hidden gems across Europe's most iconic destinations.",
      link: "/tours/europe-culture",
      // This is a direct video URL from Pexels - may break in the future
      videoUrl:
        "https://videos.pexels.com/video-files/6523735/6523735-sd_640_360_30fps.mp4",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const videoRefs = useRef(slides.map(() => React.createRef()));

  useEffect(() => {
    videoRefs.current.forEach((ref, index) => {
      if (ref.current) {
        if (index === activeIndex) {
          ref.current
            .play()
            .then()
            .catch((error) =>
              console.error(`Video ${index + 1} play failed:`, error)
            );
        } else {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      }
    });

    const interval = setInterval(() => {
      setDirection("right");
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [activeIndex, slides.length]);

  const goToNextSlide = useCallback(() => {
    setDirection("right");
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setDirection("left");
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  }, [slides.length]);

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? "right" : "left");
    setActiveIndex(index);
  };

  const getContentAnimation = () =>
    direction === "right"
      ? `${slideInFromRight} 0.8s ease both`
      : `${slideInFromLeft} 0.8s ease both`;

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
        minHeight: { xs: "400px", sm: "500px", md: "600px", lg: "700px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      {slides.map((slide, index) => (
        <AnimatedVideoBox
          key={slide.title + "-video"}
          active={index === activeIndex}
          aria-hidden={index !== activeIndex}
        >
          <video
            ref={videoRefs.current[index]}
            src={slide.videoUrl}
            poster={slide.posterUrl}
            autoPlay={index === activeIndex}
            muted
            loop
            playsInline
            onError={(e) =>
              console.error(`Error loading video ${index + 1}:`, e)
            }
          />
        </AnimatedVideoBox>
      ))}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          zIndex: 2,
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "90%", sm: "85%", md: "55%", lg: "50%" },
            textAlign: { xs: "center", md: "left" },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, sm: 4, md: 5 },
            backgroundColor: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            animation: getContentAnimation(),
            willChange: "transform, opacity",
          }}
        >
          <Typography
            variant="h6"
            color="#FFD700"
            sx={{
              mb: 1.5,
              textTransform: "uppercase",
              letterSpacing: 1.3,
              fontWeight: 700,
            }}
          >
            Adventure
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "rgba(255,255,255,0.95)",
              fontSize: {
                xs: "1.8rem",
                sm: "2.4rem",
                md: "3rem",
                lg: "3.5rem",
                xl: "4rem",
              },
              lineHeight: 1.15,
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            {slides[activeIndex].title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "rgba(255,255,255,0.9)",
              textShadow: "1px 1px 3px rgba(0,0,0,0.85)",
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
            }}
          >
            {slides[activeIndex].description}
          </Typography>
          <Button
            variant="contained"
            href={"#travelExpert"}
            sx={{
              backgroundColor: "#FF8C00",
              color: "white",
              "&:hover": {
                backgroundColor: "#E67300",
                transform: "scale(1.07)",
                boxShadow: "0 0 15px rgba(255, 140, 0, 0.7)",
              },
              py: { xs: 1.2, sm: 1.5, md: 1.8 },
              px: { xs: 3, sm: 4, md: 5 },
              borderRadius: "60px",
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              animation: `${pulse} 3s infinite`,
            }}
          >
            Book Your Trip
          </Button>
        </Box>
      </Box>

      {/* Arrows */}
      {(isMobile || isTablet ? [true] : [false]).map((mobileView, idx) =>
        mobileView ? (
          <React.Fragment key={`mobile-arrows-${idx}`}>
            <IconButton
              onClick={goToPrevSlide}
              sx={{
                ...arrowStyle,
                left: 10,
                top: "50%",
              }}
            >
              <ArrowBackIosNew sx={{ fontSize: "1.5rem" }} />
            </IconButton>
            <IconButton
              onClick={goToNextSlide}
              sx={{
                ...arrowStyle,
                right: 10,
                top: "50%",
              }}
            >
              <ArrowForwardIos sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </React.Fragment>
        ) : (
          <React.Fragment key={`desktop-arrows-${idx}`}>
            <IconButton
              onClick={goToPrevSlide}
              sx={{
                ...arrowStyle,
                left: 30,
                animation: `${fadeIn} 1s ease-out 0.2s both`,
              }}
            >
              <ArrowBackIosNew sx={{ fontSize: "2rem" }} />
            </IconButton>
            <IconButton
              onClick={goToNextSlide}
              sx={{
                ...arrowStyle,
                right: 30,
                animation: `${fadeIn} 1s ease-out 0.2s both`,
              }}
            >
              <ArrowForwardIos sx={{ fontSize: "2rem" }} />
            </IconButton>
          </React.Fragment>
        )
      )}

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 15, sm: 20, md: 30 },
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 3,
        }}
      >
        {slides.map((slide, index) => (
          <Button
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 10,
              height: 10,
              minWidth: 0,
              p: 0,
              borderRadius: "50%",
              backgroundColor:
                index === activeIndex ? "white" : "rgba(255,255,255,0.4)",
              animation:
                index === activeIndex ? `${bounce} 0.5s ease-in-out` : "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "white",
                transform: "scale(1.3)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const arrowStyle = {
  position: "absolute",
  transform: "translateY(-50%)",
  color: "white",
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 3,
  width: 54,
  height: 54,
  p: 1.5,
  borderRadius: "50%",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.75)",
    transform: "translateY(-50%) scale(1.1)",
  },
};

export default HomeBanner;

import React from "react";
import {
  Container,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Actual image URLs from your provided images
const images = {
  travelPackage: "http://googleusercontent.com/file_content/3", // Corresponds to image_538148.png / image_53814c.png (Travel Package)
  carRentals: "http://googleusercontent.com/file_content/3", // Corresponds to image_538148.png / image_53814c.png (Car Rentals)
  destinations: "http://googleusercontent.com/file_content/0", // Corresponds to image_53812e.png / image_538130.png (Explore Destinations)
  hotels: "http://googleusercontent.com/file_content/0", // Corresponds to image_53812e.png / image_538130.png (Hotels)
  events: "http://googleusercontent.com/file_content/0", // Corresponds to image_53812e.png / image_538130.png (Events)
};

// Slider settings
const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

// Data for the carousel items with specific background colors and adjusted content
const carouselItems = [
  {
    title: "Book your",
    subtitle: "Travel package",
    link: "/booking-tour-package",
    image: images.travelPackage,
    backgroundColor: "#ede7f6", // Light purple from image_538148.png
    buttonText: "BOOK NOW",
    titleColor: "#311b92", // Darker purple for title
    subtitleColor: "#311b92", // Darker purple for subtitle
  },
  {
    title: "Book your",
    subtitle: "Car Rentals",
    link: "/booking-car-rentals",
    image: images.carRentals,
    backgroundColor: "#fce4ec", // Light pink from image_538148.png
    buttonText: "BOOK NOW",
    titleColor: "#880e4f", // Darker pink for title
    subtitleColor: "#880e4f", // Darker pink for subtitle
  },
  {
    title: "Explore",
    subtitle: "Destinations",
    link: "/destinations",
    image: images.destinations,
    backgroundColor: "#f1f8e9", // Light beige/off-white from image_53812e.png
    buttonText: "EXPLORE",
    titleColor: "#424242", // Dark grey
    subtitleColor: "#424242", // Dark grey
  },
  {
    title: "Over 30,000+",
    subtitle: "Hotels",
    link: "/hotels-list",
    image: images.hotels,
    backgroundColor: "#e8f5e9", // Light green from image_53812e.png
    buttonText: "BOOK NOW",
    titleColor: "#1b5e20", // Dark green
    subtitleColor: "#1b5e20", // Dark green
  },
  {
    title: "Travel Events",
    subtitle: "Events",
    link: "/events",
    image: images.events,
    backgroundColor: "#fffde7", // Light yellow from image_53812e.png
    buttonText: "EXPLORE",
    titleColor: "#f57f17", // Dark yellow/orange
    subtitleColor: "#f57f17", // Dark yellow/orange
  },
];

const HomeSlider = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Slider {...sliderSettings}>
        {carouselItems.map((item, index) => (
          <Box key={index} sx={{ px: 1 }}>
            <Card
              sx={{
                maxWidth: 290,
                mx: "auto",
                boxShadow: "none", // Remove default Material-UI shadow
                borderRadius: 4, // More rounded corners
                position: "relative",
                overflow: "hidden",
                height: 400, // Fixed height for consistent card size
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              backgroundColor: theme => theme.palette.background.paper,
              }}
            >
              <CardContent sx={{ textAlign: "center", pt: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontFamily: "Georgia, serif", // Matching font style
                    fontWeight: "bold",
                    color: theme => theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    fontFamily: "Georgia, serif", // Matching font style
                    fontWeight: "bold",
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  {item.subtitle}
                </Typography>
              </CardContent>
              {/* Image positioned at the bottom of the card */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "auto", // Adjust height automatically
                  minHeight: 150, // Minimum height for the image area
                  display: "flex",
                  alignItems: "flex-end", // Align image to the bottom
                  justifyContent: "center",
                  pb: 2, // Padding at the bottom
                }}
              >
                <img
                  src={
                    item.subtitle === "Travel package"
                      ? "https://i.imgur.com/eQ7jM6f.png" // Specific image for Travel package
                      : item.subtitle === "Car Rentals"
                      ? "https://i.imgur.com/8Q9jN5i.png" // Specific image for Car Rentals
                      : item.subtitle === "Destinations"
                      ? "https://i.imgur.com/Z5y2R5T.png" // Specific image for Destinations
                      : item.subtitle === "Hotels"
                      ? "https://i.imgur.com/vH1rE2z.png" // Specific image for Hotels
                      : item.subtitle === "Events"
                      ? "https://i.imgur.com/r3S1C4T.png" // Specific image for Events
                      : item.image // Fallback to provided image if no specific match
                  }
                  alt={item.subtitle}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "contain", // Ensure the entire image is visible
                  }}
                />
              </Box>

              {/* Button positioned over the image area, slightly above the bottom */}
              <Button
                variant="contained"
                href={item.link}
                sx={{
                  position: "absolute",
                  bottom: 120, // Adjust this value to move the button up/down
                  left: "50%",
                  transform: "translateX(-50%)",
                  textTransform: "uppercase",
                  borderRadius: 20, // Pill shape
                  minWidth: 150, // Ensure a good button width
                  padding: "10px 20px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  backgroundColor: theme => theme.palette.primary.main,
                  color: theme => theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme => theme.palette.secondary.main,
                    color: theme => theme.palette.secondary.contrastText,
                  },
                }}
              >
                {item.buttonText}
              </Button>
            </Card>
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default HomeSlider;

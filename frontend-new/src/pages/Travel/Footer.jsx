// src/components/Footer.tsx
import { Container, Typography, Box, Grid, Link, Divider } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  EmojiEvents,
  LocalOffer,
  CompareArrows,
} from "@mui/icons-material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 8,
      }}
    >
      <Container>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              icon: <EmojiEvents sx={{ fontSize: 40, color: "#1976d2" }} />,
              title: "India's #1",
              description: "Largest Travel portal",
            },
            {
              icon: (
                <TravelExploreIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              ),
              title: "Explore Plan",
              description: "Every 4 minute",
            },
            {
              icon: <LocalOffer sx={{ fontSize: 40, color: "#1976d2" }} />,
              title: "Offers",
              description: "Stay updated pay less",
            },
            {
              icon: <CompareArrows sx={{ fontSize: 40, color: "#1976d2" }} />,
              title: "Compare",
              description: "Decode the right plan",
            },
          ].map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ position: "relative", pb: 1 }}
            >
              About Trip Planner
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 50,
                  height: 2,
                  backgroundColor: "var(--secondary)",
                }}
              />
            </Typography>
            <Typography variant="body2" color="#959595" sx={{ mb: 2 }}>
              We're dedicated to creating unforgettable travel experiences that
              go beyond the ordinary. Our expert team crafts personalized
              journeys to the world's most amazing destinations.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    color: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "var(--secondary)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ position: "relative", pb: 1 }}
            >
              Quick Links
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 50,
                  height: 2,
                  backgroundColor: "var(--secondary)",
                }}
              />
            </Typography>
            {[
              "Home",
              "Destinations",
              "Special Offers",
              "Travel Guides",
              "About Us",
            ].map((item) => (
              <Typography
                key={item}
                component={Link}
                href="#"
                variant="body2"
                color="#959595"
                display="block"
                sx={{ mb: 1, "&:hover": { color: "var(--secondary)" } }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ position: "relative", pb: 1 }}
            >
              Support
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 50,
                  height: 2,
                  backgroundColor: "var(--secondary)",
                }}
              />
            </Typography>
            {[
              "FAQs",
              "Contact Us",
              "Booking Conditions",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((item) => (
              <Typography
                key={item}
                component={Link}
                href="#"
                variant="body2"
                color="#959595"
                display="block"
                sx={{ mb: 1, "&:hover": { color: "var(--secondary)" } }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ position: "relative", pb: 1 }}
            >
              Contact Info
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 50,
                  height: 2,
                  backgroundColor: "var(--secondary)",
                }}
              />
            </Typography>
            <Typography variant="body2" color="#959595" sx={{ mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                📍
              </Box>{" "}
              123 Travel Street, Suite 100
              <br />
              New York, NY 10001
            </Typography>
            <Typography variant="body2" color="#959595" sx={{ mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                📞
              </Box>{" "}
              +1 (555) 123-4567
            </Typography>
            <Typography variant="body2" color="#959595">
              <Box component="span" sx={{ mr: 1 }}>
                ✉️
              </Box>{" "}
              info@tripPlanner.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <Typography variant="body2" color="#959595" textAlign="center">
          &copy; {new Date().getFullYear()} Trip Planner. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

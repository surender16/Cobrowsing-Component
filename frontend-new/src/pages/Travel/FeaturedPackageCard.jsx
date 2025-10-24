import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating,
  useTheme,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Close, LocationOn, Star } from "@mui/icons-material";
import PaymentSection from "./PaymentSection";

const FeaturedPackageCard = ({ packageData }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          mb: 6,
          position: "relative",
          overflow: "hidden",
          boxShadow: theme.shadows[4],

          "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
          },
        }}
      >
        {packageData.discount && (
          <Chip
            label={packageData.discount}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
              fontWeight: "bold",
            }}
          />
        )}
        <CardMedia
          component="img"
          height="400"
          image={packageData.image}
          alt={packageData.title}
        />
        <CardContent
          sx={{
            position: "relative",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: theme.spacing(4),
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)",
              zIndex: 0,
            },
          }}
        >
          <Box position="relative" zIndex={1}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              {packageData.title}
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOn fontSize="small" />
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {packageData.location}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {packageData.description}
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
              <Rating
                value={packageData.rating}
                precision={0.1}
                readOnly
                emptyIcon={
                  <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {packageData.rating} ({packageData.reviews} reviews)
              </Typography>
            </Box>

            <Grid container spacing={2} mb={3}>
              {packageData.highlights.map((highlight, index) => (
                <Grid size={{ xs: 6 }} key={index}>
                  <Box display="flex" alignItems="center">
                    <Star
                      fontSize="small"
                      sx={{ color: theme.palette.secondary.main, mr: 1 }}
                    />
                    <Typography variant="body2">{highlight}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {packageData.price}{" "}
                <Typography component="span" variant="body2">
                  for {packageData.duration}
                </Typography>
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                // href={"#travelExpert"}
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 50,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ position: "relative", p: 3 }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <PaymentSection onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeaturedPackageCard;

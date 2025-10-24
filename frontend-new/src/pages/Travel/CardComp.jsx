import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  Divider,
  Rating,
  Skeleton,
  useTheme,
} from "@mui/material";
import { LocationOn, Star } from "@mui/icons-material";

const CardComp = ({ pkg }) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      sx={{
        minWidth: 280,
        maxWidth: 320, // Add a max-width for better control
        boxShadow: theme.shadows[4], // Consistent shadow
        transition: "transform 0.3s, box-shadow 0.3s",
        flexShrink: 0,
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[8],
        },
        display: "flex",
        flexDirection: "column",
        height: "100%", // Ensures all cards in a row have equal height
      }}
    >
      <Box sx={{ position: "relative" }}>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={180}
            animation="wave"
            sx={{
              borderTopLeftRadius: theme.shape.borderRadius,
              borderTopRightRadius: theme.shape.borderRadius,
            }}
          />
        )}
        <CardMedia
          component="img"
          height="180"
          image={pkg.image}
          alt={pkg.destination}
          onLoad={() => setImageLoaded(true)}
          sx={{
            objectFit: "cover",
            display: imageLoaded ? "block" : "none",
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }}
        />
        {pkg.isNew && (
          <Chip
            label="NEW"
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: theme.spacing(1),
              left: theme.spacing(1),
              fontWeight: theme.typography.fontWeightBold,
              fontSize: "0.75rem",
            }}
          />
        )}
        {pkg.discount && (
          <Chip
            label={pkg.discount}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: theme.spacing(1),
              right: theme.spacing(1),
              fontWeight: theme.typography.fontWeightBold,
              fontSize: "0.75rem",
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          p: theme.spacing(2),
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
          <LocationOn fontSize="small" color="action" />{" "}
          {/* Use 'action' color for subtlety */}
          <Typography variant="body2" color="text.secondary">
            {pkg.location}
          </Typography>
        </Stack>

        <Typography
          variant="h6"
          sx={{ fontWeight: theme.typography.fontWeightSemiBold, mb: 1 }}
        >
          {pkg.destination}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating
            value={pkg.rating}
            precision={0.5}
            readOnly
            size="small"
            emptyIcon={
              <Star
                style={{ opacity: 0.55 }}
                fontSize="inherit"
                color="disabled"
              />
            }
          />
          <Typography
            variant="caption"
            sx={{ ml: 1, color: theme.palette.text.secondary }}
          >
            ({pkg.reviews} reviews)
          </Typography>
        </Box>

        <Divider sx={{ my: theme.spacing(1.5) }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mt: "auto" }} // Pushes content to the bottom
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Starting from
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: theme.typography.fontWeightBold }}
            >
              {pkg.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pkg.duration}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary" // Use primary color for main action
            size="medium" // Medium size button
            href={"#travelExpert"} // Consider making this dynamic if it links to a specific package page
            sx={{
              borderRadius: theme.shape.borderRadius,
              textTransform: "none",
              fontWeight: theme.typography.fontWeightSemiBold,
              px: theme.spacing(2.5),
              py: theme.spacing(1),
            }}
          >
            View Deal
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default React.memo(CardComp);

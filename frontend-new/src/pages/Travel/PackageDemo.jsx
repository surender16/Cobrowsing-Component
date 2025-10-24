import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import PackageCard from './PackageCard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const packages = [
  {
    destination: "Grand Tour of Rajasthan",
    duration: "9 Days / 8 Nights",
    price: "£350",
    description: "Experience the royal heritage of Rajasthan with visits to Jaipur, Jaisalmer, Jodhpur, and Udaipur. Enjoy camel rides, palace tours, and cultural shows.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=250&fit=crop"
  },
  {
    destination: "Kerala Backwaters",
    duration: "6 Days / 5 Nights",
    price: "£260",
    description: "Discover the serene backwaters of Kerala with houseboat stays, spice plantations, and traditional Ayurvedic treatments.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop"
  },
  {
    destination: "Goa Beach Paradise",
    duration: "4 Days / 3 Nights",
    price: "£199",
    description: "Relax on pristine beaches, enjoy water sports, explore Portuguese architecture, and experience vibrant nightlife in Goa.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop"
  },
  {
    destination: "Himalayan Adventure",
    duration: "12 Days / 11 Nights",
    price: "£470",
    description: "Trek through the majestic Himalayas, visit ancient monasteries, and experience the culture of mountain communities.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
  }
];

const PackageDemo = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Travel Package Gallery
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Click on any package card to view detailed information
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {packages.map((pkg, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <PackageCard
                destination={pkg.destination}
                duration={pkg.duration}
                price={pkg.price}
                description={pkg.description}
                image={pkg.image}
              />
            </Grid>
          ))}
        </Grid>

        <Box mt={8} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            The modal demonstrates a comprehensive package details view with:
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            • Interactive image gallery with thumbnails<br/>
            • Package highlights and activity badges<br/>
            • Detailed day-wise itinerary with timeline<br/>
            • Hotel information with ratings and amenities<br/>
            • Flight and transfer details<br/>
            • Coupon and pricing section<br/>
            • Responsive design with sticky sidebar<br/>
            • Tab navigation for different content sections
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PackageDemo; 
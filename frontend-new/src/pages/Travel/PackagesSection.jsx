import React from "react";
import { Container } from "@mui/material";
import FeaturedPackageCard from "./FeaturedPackageCard.jsx"; // Corrected import path
import PackageCard from "./PackageCard"; // Corrected import path
import {
  adventureData,
  featuredPackage,
  luxuryData,
  popularTravelData,
} from "../../constants/packagesData"; // Verify this path

const PackageSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <FeaturedPackageCard packageData={featuredPackage} />
      {/* Popular Packages Section */}
      <PackageCard
        title="Popular Travel Packages"
        packageData={popularTravelData}
      />
      {/* Adventure Packages Section */}
      <PackageCard title="Adventure Packages" packageData={adventureData} />
      {/* Luxury Packages Section */}
      <PackageCard title="Luxury Escapes" packageData={luxuryData} />
    </Container>
  );
};

export default PackageSection;

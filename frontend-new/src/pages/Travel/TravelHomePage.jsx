// src/components/Travel/TravelHomePage.jsx
import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Banner from "./Banner";
import PackagesSection from "./PackagesSection";
import TravelExpert from "./TravelExpert";
import Footer from "./Footer";
import "./travel-styles.css";

const TravelHomePage = () => {
  return (
    <div className="travel-container">
      <Header className="travel-header" />

      <Banner />
      <PackagesSection />
      <TravelExpert />

      <Footer />
    </div>
  );
};

export default TravelHomePage;

// Centralized package data for all components - used in MeetingPage, AgentCatalog, and Customer components
export const samplePackageData = [
  {
    id: "pkg_raj_001",
    name: "Grand Tour of Rajasthan - Book Now Pay Later",
    title: "Grand Tour of Rajasthan - Book Now Pay Later",
    type: "Cultural",
    currency: "USD",
    description: "Experience the royal heritage of Rajasthan with visits to Jaipur, Jaisalmer, Jodhpur, and Udaipur. Enjoy camel rides, palace tours, and cultural shows.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=400&fit=crop",
    
    // Fields for AgentCatalog
    rating: 4.6,
    location: "Rajasthan, India",
    difficulty: "Easy",
    groupSize: "8-16 people",
    includes: ["Heritage Hotels", "Palace Tours", "Cultural Shows", "Camel Safari", "All Meals"],
    badges: ["Heritage", "Royal Experience", "Cultural"],
    
    // Fields for PackageDetailsModal
    route: ["2N Jaipur", "1N Bikaner", "2N Jaisalmer", "1N Jodhpur", "2N Udaipur"],
    duration: "9D/8N",
    highlights: [
      "Camel Ride at Sam Sand Dunes - Jaisalmer",
      "Dance Show at Bagore Ki Haveli - Udaipur",
      "City Palace Visit - Udaipur",
      "Hawa Mahal Tour - Jaipur",
      "Mehrangarh Fort - Jodhpur"
    ],
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1455894127589-22f75500213a?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1524469645768-b4b9a5c739b1?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1580804499897-f9b17e9c1c13?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1569650685186-2e3b4109f456?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1200,
      discounted: 1140,
      currency: "USD",
      per: "Adult",
      emi: "$380/mo",
      notes: "Excluding applicable taxes"
    },
    coupons: [
      { code: "RAJASTHAN10", desc: "Special Rajasthan Package Discount", value: -60, applied: true },
      { code: "HERITAGE15", desc: "Heritage Tour Exclusive Offer", value: -90, applied: false }
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "18 Sep, Thu",
        city: "Jaipur",
        transfers: [{ type: "Private Transfer", details: "3 seater | AC | 2 luggage bags | First Aid" }],
        flightNote: "Please Note: You need to reach Jaipur on your own",
        hotel: {
          name: "Crestmont Ashapurna Jaipur",
          stars: 3,
          location: "Bani Park",
          stay: "2 Nights - 18 Sep to 20 Sep",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        options: { addActivityText: "Add Activities to your day", moreHotelOptions: true }
      },
      {
        day: "Day 2",
        date: "19 Sep, Fri",
        city: "Jaipur",
        activities: ["City Palace Tour", "Hawa Mahal Visit", "Local Market Shopping"],
        hotel: {
          name: "Crestmont Ashapurna Jaipur",
          stars: 3,
          location: "Bani Park",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included", "Dinner included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      }
    ],
    sidebar: {
      days: ["18 Sep", "19 Sep", "20 Sep", "21 Sep", "22 Sep", "23 Sep", "24 Sep", "25 Sep", "26 Sep"],
      bestDeals: {
        message: "For maximum benefits",
        actions: ["Login now", "Get special deals", "Book faster", "Continue in any device"]
      }
    }
  },
  {
    id: "pkg_kerala_002",
    name: "Kerala Backwaters Escape",
    title: "Kerala Backwaters Escape - Monsoon Special",
    type: "Relaxation",
    currency: "USD",
    description: "Peaceful 5-day houseboat journey through Kerala's serene backwaters with traditional cuisine and spa treatments.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    
    // Fields for AgentCatalog
    rating: 4.7,
    location: "Kerala, India",
    difficulty: "Easy",
    groupSize: "2-8 people",
    includes: ["Houseboat", "Traditional Cuisine", "Spa Treatments", "Local Tours", "Pick-up/Drop"],
    badges: ["Romantic", "Peaceful", "Cultural"],
    
    // Fields for PackageDetailsModal
    route: ["2N Kochi", "2N Alleppey", "1N Kumarakom"],
    duration: "5D/4N",
    highlights: [
      "Traditional Houseboat Experience",
      "Ayurvedic Spa Treatments",
      "Backwater Village Tours",
      "Traditional Kerala Cuisine",
      "Kathakali Dance Performance"
    ],
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 920,
      discounted: 840,
      currency: "USD",
      per: "Adult",
      emi: "$280/mo",
      notes: "Excluding applicable taxes"
    },
    coupons: [
      { code: "MONSOON20", desc: "Monsoon Season Special", value: -80, applied: true },
      { code: "BACKWATER15", desc: "Backwater Package Discount", value: -60, applied: false }
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "22 Sep, Mon",
        city: "Kochi",
        transfers: [{ type: "Airport Transfer", details: "AC sedan | Professional driver" }],
        flightNote: "Arrival at Kochi International Airport",
        hotel: {
          name: "Grand Hyatt Kochi Bolgatty",
          stars: 5,
          location: "Bolgatty Island",
          stay: "2 Nights - 22 Sep to 24 Sep",
          type: "Island View Room",
          inclusions: ["Breakfast included", "Welcome drink"],
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 2",
        date: "23 Sep, Tue",
        city: "Kochi",
        activities: ["Chinese Fishing Nets", "Spice Market Tour", "Fort Kochi Walk"],
        hotel: {
          name: "Grand Hyatt Kochi Bolgatty",
          stars: 5,
          location: "Bolgatty Island",
          stay: "Continued Stay",
          type: "Island View Room",
          inclusions: ["Breakfast included", "City tour"],
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      }
    ],
    sidebar: {
      days: ["22 Sep", "23 Sep", "24 Sep", "25 Sep", "26 Sep"],
      bestDeals: {
        message: "Monsoon Special Offers",
        actions: ["Book within 24 hours", "Get monsoon discounts", "Free ayurvedic massage", "Complimentary room upgrade"]
      }
    }
  },
  {
    id: "pkg_goa_003",
    name: "Goa Beach Party Extravaganza",
    title: "Goa Beach Party Extravaganza - Ultimate Fun",
    type: "Party",
    currency: "USD",
    description: "3-day beach party experience with DJ nights, water sports, luxury beach resort, and vibrant nightlife.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    
    // Fields for AgentCatalog
    rating: 4.5,
    location: "Goa, India",
    difficulty: "Easy",
    groupSize: "10-20 people",
    includes: ["Beach Resort", "DJ Events", "Water Sports", "Breakfast", "Airport Transfer"],
    badges: ["Popular", "Nightlife", "Beach Access"],
    
    // Fields for PackageDetailsModal
    route: ["3N North Goa"],
    duration: "4D/3N",
    highlights: [
      "Beach Club Access",
      "Water Sports Adventure",
      "Sunset Cruise Party",
      "DJ Nights at Tito's",
      "Luxury Beach Resort Stay"
    ],
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 750,
      discounted: 660,
      currency: "USD",
      per: "Adult",
      emi: "$220/mo",
      notes: "Excluding applicable taxes"
    },
    coupons: [
      { code: "BEACHPARTY", desc: "Beach Party Special Discount", value: -90, applied: true },
      { code: "NIGHTLIFE25", desc: "Nightlife Package Offer", value: -50, applied: false }
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "15 Oct, Thu",
        city: "North Goa",
        transfers: [{ type: "Airport Transfer", details: "AC vehicle | Beach resort transfer" }],
        flightNote: "Arrival at Dabolim Airport",
        activities: ["Beach check-in", "Welcome party", "Sunset viewing"],
        hotel: {
          name: "Grand Hyatt Goa",
          stars: 5,
          location: "Bambolim Beach",
          stay: "3 Nights - 15 Oct to 18 Oct",
          type: "Ocean View Room",
          inclusions: ["All meals", "Beach access", "Pool access"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      }
    ],
    sidebar: {
      days: ["15 Oct", "16 Oct", "17 Oct", "18 Oct"],
      bestDeals: {
        message: "Party Season Special",
        actions: ["Group booking discounts", "Free club entries", "Complimentary drinks", "Beach activity vouchers"]
      }
    }
  },
  {
    id: "pkg_ladakh_004",
    name: "Ladakh Bike Adventure",
    title: "Ladakh Bike Adventure - Royal Enfield Expedition",
    type: "Adventure",
    currency: "USD",
    description: "Epic 10-day motorcycle adventure through the rugged landscapes of Ladakh with high-altitude passes and monasteries.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    
    // Fields for AgentCatalog
    rating: 4.8,
    location: "Ladakh, India",
    difficulty: "Challenging",
    groupSize: "6-12 people",
    includes: ["Royal Enfield Bike", "Professional Guide", "Accommodation", "Meals", "Fuel"],
    badges: ["Best Seller", "Adventure", "Expert Guide"],
    
    // Fields for PackageDetailsModal
    route: ["2N Delhi", "2N Manali", "3N Leh", "2N Nubra Valley", "1N Pangong"],
    duration: "10D/9N",
    highlights: [
      "Royal Enfield Bike Ride",
      "Khardung La Pass - World's Highest Motorable Road",
      "Pangong Tso Lake Experience",
      "Monastery Visits",
      "Nubra Valley Desert Safari"
    ],
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1600,
      discounted: 1440,
      currency: "USD",
      per: "Adult",
      emi: "$480/mo",
      notes: "Excluding applicable taxes and bike rental"
    },
    coupons: [
      { code: "BIKEADV20", desc: "Adventure Bike Tour Special", value: -160, applied: true },
      { code: "LADAKH25", desc: "Ladakh Expedition Discount", value: -200, applied: false }
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "05 Jun, Sat",
        city: "Delhi",
        transfers: [{ type: "Airport Transfer", details: "AC vehicle to hotel" }],
        flightNote: "Arrival in Delhi, bike briefing session",
        activities: ["Bike allocation", "Safety briefing", "Route planning"],
        hotel: {
          name: "The Lalit New Delhi",
          stars: 5,
          location: "Connaught Place",
          stay: "2 Nights - 05 Jun to 07 Jun",
          type: "Executive Room",
          inclusions: ["Breakfast included", "Bike storage"],
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      }
    ],
    sidebar: {
      days: ["05 Jun", "06 Jun", "07 Jun", "08 Jun", "09 Jun", "10 Jun", "11 Jun", "12 Jun", "13 Jun", "14 Jun"],
      bestDeals: {
        message: "Adventure Season Special",
        actions: ["Early bird pricing", "Group discounts available", "Free gear rental", "Travel insurance included"]
      }
    }
  },
  {
    id: "pkg_himalaya_005",
    name: "Himalayan Adventure Trek",
    title: "Himalayan Adventure Trek - Mountain Explorer",
    type: "Adventure",
    currency: "USD",
    description: "Experience the breathtaking beauty of the Himalayas with expert guides, comfortable lodges, and stunning mountain views on this 8-day adventure trek.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90",
    
    // Fields for AgentCatalog
    rating: 4.8,
    location: "Nepal, Himalayas",
    difficulty: "Moderate",
    groupSize: "6-12 people",
    includes: ["Accommodation", "Meals", "Guide", "Transportation", "Equipment"],
    badges: ["Best Seller", "Eco-Friendly", "Expert Guide"],
    
    // Fields for PackageDetailsModal
    route: ["2N Kathmandu", "3N Lukla", "2N Namche Bazaar", "1N Tengboche"],
    duration: "8D/7N",
    highlights: [
      "Mount Everest Base Camp Views",
      "Sherpa Culture Experience",
      "Buddhist Monastery Visits",
      "Alpine Flora and Fauna",
      "Professional Mountain Guide"
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1350,
      discounted: 1200,
      currency: "USD",
      per: "Adult",
      emi: "$400/mo",
      notes: "Excluding applicable taxes and international flights"
    },
    coupons: [
      { code: "MOUNTAIN20", desc: "Mountain Adventure Special", value: -150, applied: true },
      { code: "TREKKING15", desc: "Trekking Package Discount", value: -120, applied: false }
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "10 Apr, Sat",
        city: "Kathmandu",
        transfers: [{ type: "Airport Transfer", details: "Private vehicle | English speaking guide" }],
        flightNote: "Arrival at Tribhuvan International Airport",
        activities: ["Welcome briefing", "Gear check", "Cultural tour"],
        hotel: {
          name: "Hotel Shanker",
          stars: 4,
          location: "Thamel, Kathmandu",
          stay: "2 Nights - 10 Apr to 12 Apr",
          type: "Deluxe Room",
          inclusions: ["Breakfast included", "Airport transfer"],
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      }
    ],
    sidebar: {
      days: ["10 Apr", "11 Apr", "12 Apr", "13 Apr", "14 Apr", "15 Apr", "16 Apr", "17 Apr"],
      bestDeals: {
        message: "Trekking Season Special",
        actions: ["Free equipment rental", "Group discounts", "Professional guide included", "Emergency evacuation insurance"]
      }
    }
  }
];

export default samplePackageData; 
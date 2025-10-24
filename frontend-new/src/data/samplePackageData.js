// Centralized package data for all components with comprehensive filters
// Holiday Types: Cruise & Stay, Hotels & Stay, Multi-Centre
// Regions: Asia, North America, South America, Europe, Africa
// All prices in GBP (£)

export const samplePackageData = [
  // ASIA - Hotels & Stay
  {
    id: "pkg_asia_hotels_001",
    name: "Golden Triangle Heritage",
    title: "Delhi, Agra & Jaipur Luxury Experience",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Experience India's rich heritage with luxury hotel stays in Delhi, Agra, and Jaipur. Visit the Taj Mahal, Amber Fort, and more.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Delhi", "1N Agra", "3N Jaipur"],
    duration: "7D/6N",
    highlights: ["Taj Mahal Sunrise Tour", "Amber Fort Visit", "City Palace Tour", "Local markets"],
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 850,
      discounted: 750,
      currency: "GBP",
      per: "Adult",
      emi: "£250/mo",
      notes: "Includes luxury hotels and local transfers"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Mon, 15 Jan",
        city: "Delhi",
        transfers: [{ type: "Airport Pickup", details: "AC sedan | Professional driver | Welcome kit" }],
        flightNote: "Arrival at Indira Gandhi International Airport",
        hotel: {
          name: "The LaLiT New Delhi",
          stars: 5,
          location: "Connaught Place",
          stay: "2 Nights - 15 Jan to 17 Jan",
          type: "Deluxe Room",
          inclusions: ["Breakfast included", "Welcome drink"],
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Check-in", "Evening visit to India Gate", "Welcome dinner"]
      },
      {
        day: "Day 2",
        date: "Tue, 16 Jan",
        city: "Delhi",
        activities: ["Red Fort Tour", "Jama Masjid Visit", "Chandni Chowk Shopping", "Qutub Minar"],
        hotel: {
          name: "The LaLiT New Delhi",
          stars: 5,
          location: "Connaught Place",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast & dinner included"],
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Wed, 17 Jan",
        city: "Agra",
        transfers: [{ type: "Private Transfer", details: "Delhi to Agra | AC sedan | 4 hours journey" }],
        activities: ["Taj Mahal Sunrise Tour", "Agra Fort Visit"],
        hotel: {
          name: "Trident Agra",
          stars: 5,
          location: "Near Taj Mahal",
          stay: "1 Night - 17 Jan to 18 Jan",
          type: "Premium Room",
          inclusions: ["Breakfast & dinner", "Taj view"],
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 4",
        date: "Thu, 18 Jan",
        city: "Jaipur",
        transfers: [{ type: "Private Transfer", details: "Agra to Jaipur | AC sedan | 5 hours via Fatehpur Sikri" }],
        activities: ["Fatehpur Sikri en route", "Evening at Jaipur local market"],
        hotel: {
          name: "Trident Jaipur",
          stars: 5,
          location: "MI Road",
          stay: "3 Nights - 18 Jan to 21 Jan",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 5",
        date: "Fri, 19 Jan",
        city: "Jaipur",
        activities: ["Amber Fort with Elephant Ride", "City Palace", "Jantar Mantar", "Hawa Mahal photo stop"],
        hotel: {
          name: "Trident Jaipur",
          stars: 5,
          location: "MI Road",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast & dinner"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 6",
        date: "Sat, 20 Jan",
        city: "Jaipur",
        activities: ["Jaigarh Fort", "Nahargarh Fort", "Local handicraft shopping", "Cultural evening show"],
        hotel: {
          name: "Trident Jaipur",
          stars: 5,
          location: "MI Road",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast & dinner"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 7",
        date: "Sun, 21 Jan",
        city: "Departure",
        transfers: [{ type: "Airport Drop", details: "Hotel to Jaipur Airport | AC sedan" }],
        flightNote: "Departure from Jaipur International Airport",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["15 Jan", "16 Jan", "17 Jan", "18 Jan", "19 Jan", "20 Jan", "21 Jan"],
      bestDeals: {
        message: "Book now for exclusive benefits",
        actions: ["Free upgrade to premium room", "Complimentary cultural show tickets", "Free airport transfers", "10% off on next booking"]
      }
    }
  },
  {
    id: "pkg_asia_hotels_002",
    name: "Tokyo & Kyoto Discovery",
    title: "Japan Cultural Experience",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Discover the perfect blend of tradition and modernity in Japan with stays in Tokyo and Kyoto's finest hotels.",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Tokyo", "3N Kyoto", "1N Osaka"],
    duration: "8D/7N",
    highlights: ["Tea Ceremony", "Bullet Train", "Tsukiji Market", "Temples Visit"],
    images: [
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1200,
      discounted: 1050,
      currency: "GBP",
      per: "Adult",
      emi: "£350/mo",
      notes: "Includes JR Pass and luxury hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Fri, 22 Mar",
        city: "Tokyo",
        transfers: [{ type: "Airport Pickup", details: "Narita Express train tickets included" }],
        flightNote: "Arrival at Narita International Airport",
        hotel: {
          name: "Park Hyatt Tokyo",
          stars: 5,
          location: "Shinjuku",
          stay: "3 Nights - 22 Mar to 25 Mar",
          type: "Deluxe Room with City View",
          inclusions: ["Breakfast included", "Welcome tea ceremony"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Check-in", "Evening stroll in Shinjuku"]
      },
      {
        day: "Day 2",
        date: "Sat, 23 Mar",
        city: "Tokyo",
        activities: ["Tsukiji Outer Market", "Senso-ji Temple in Asakusa", "Tokyo Skytree", "Evening in Shibuya"],
        hotel: {
          name: "Park Hyatt Tokyo",
          stars: 5,
          location: "Shinjuku",
          stay: "Continued Stay",
          type: "Deluxe Room with City View",
          inclusions: ["Breakfast included"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Sun, 24 Mar",
        city: "Tokyo",
        activities: ["Meiji Shrine", "Harajuku fashion street", "Akihabara electronics district", "Imperial Palace gardens"],
        hotel: {
          name: "Park Hyatt Tokyo",
          stars: 5,
          location: "Shinjuku",
          stay: "Continued Stay",
          type: "Deluxe Room with City View",
          inclusions: ["Breakfast included"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 4",
        date: "Mon, 25 Mar",
        city: "Kyoto",
        transfers: [{ type: "Bullet Train", details: "JR Pass - Shinkansen from Tokyo to Kyoto" }],
        activities: ["Travel to Kyoto", "Fushimi Inari Shrine", "Evening in Gion district"],
        hotel: {
          name: "Ritz-Carlton Kyoto",
          stars: 5,
          location: "Kamogawa River",
          stay: "3 Nights - 25 Mar to 28 Mar",
          type: "Garden View Room",
          inclusions: ["Breakfast included", "Traditional tea ceremony"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 5",
        date: "Tue, 26 Mar",
        city: "Kyoto",
        activities: ["Kinkaku-ji Golden Pavilion", "Ryoan-ji Zen Garden", "Arashiyama Bamboo Grove", "Monkey Park"],
        hotel: {
          name: "Ritz-Carlton Kyoto",
          stars: 5,
          location: "Kamogawa River",
          stay: "Continued Stay",
          type: "Garden View Room",
          inclusions: ["Breakfast included"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 6",
        date: "Wed, 27 Mar",
        city: "Kyoto",
        activities: ["Kiyomizu-dera Temple", "Nijo Castle", "Philosopher's Path", "Traditional kaiseki dinner"],
        hotel: {
          name: "Ritz-Carlton Kyoto",
          stars: 5,
          location: "Kamogawa River",
          stay: "Continued Stay",
          type: "Garden View Room",
          inclusions: ["Breakfast & kaiseki dinner"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 7",
        date: "Thu, 28 Mar",
        city: "Osaka",
        transfers: [{ type: "Train Transfer", details: "JR Pass - Train from Kyoto to Osaka" }],
        activities: ["Osaka Castle", "Dotonbori entertainment district", "Street food tour"],
        hotel: {
          name: "St. Regis Osaka",
          stars: 5,
          location: "Midosuji Boulevard",
          stay: "1 Night - 28 Mar to 29 Mar",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 8",
        date: "Fri, 29 Mar",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Hotel to Kansai International Airport" }],
        flightNote: "Departure from Kansai International Airport",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["22 Mar", "23 Mar", "24 Mar", "25 Mar", "26 Mar", "27 Mar", "28 Mar", "29 Mar"],
      bestDeals: {
        message: "Japan Special Offers",
        actions: ["Free JR Pass upgrade", "Traditional tea ceremony included", "Complimentary kaiseki dinner", "Cherry blossom season special"]
      }
    }
  },
  {
    id: "pkg_asia_hotels_003",
    name: "Bali Tropical Paradise",
    title: "Indonesia Beach & Culture",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Relax in beautiful Bali with beachfront hotels, cultural experiences, and tropical adventures.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Ubud", "4N Seminyak"],
    duration: "8D/7N",
    highlights: ["Rice Terraces", "Beach Clubs", "Temple Visits", "Spa Treatments"],
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 950,
      discounted: 850,
      currency: "GBP",
      per: "Adult",
      emi: "£280/mo",
      notes: "Includes beachfront hotels and breakfast"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Mon, 10 Apr",
        city: "Ubud",
        transfers: [{ type: "Airport Transfer", details: "Ngurah Rai Airport to Ubud | Private car" }],
        flightNote: "Arrival at Ngurah Rai International Airport",
        hotel: {
          name: "Four Seasons Resort Bali at Sayan",
          stars: 5,
          location: "Sayan, Ubud",
          stay: "3 Nights - 10 Apr to 13 Apr",
          type: "Valley View Room",
          inclusions: ["Breakfast included", "Welcome spa treatment"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Check-in", "Evening walk in rice terraces"]
      },
      {
        day: "Day 2",
        date: "Tue, 11 Apr",
        city: "Ubud",
        activities: ["Tegalalang Rice Terrace", "Sacred Monkey Forest", "Ubud Palace", "Traditional dance show"],
        hotel: {
          name: "Four Seasons Resort Bali at Sayan",
          stars: 5,
          location: "Sayan, Ubud",
          stay: "Continued Stay",
          type: "Valley View Room",
          inclusions: ["Breakfast & dinner included"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Wed, 12 Apr",
        city: "Ubud",
        activities: ["Tirta Empul Temple", "Coffee plantation tour", "Balinese cooking class", "Spa treatment"],
        hotel: {
          name: "Four Seasons Resort Bali at Sayan",
          stars: 5,
          location: "Sayan, Ubud",
          stay: "Continued Stay",
          type: "Valley View Room",
          inclusions: ["Breakfast & dinner included"],
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 4",
        date: "Thu, 13 Apr",
        city: "Seminyak",
        transfers: [{ type: "Private Transfer", details: "Ubud to Seminyak | 1.5 hours" }],
        activities: ["Beach club arrival", "Sunset at Potato Head Beach Club"],
        hotel: {
          name: "The Legian Seminyak",
          stars: 5,
          location: "Seminyak Beach",
          stay: "4 Nights - 13 Apr to 17 Apr",
          type: "Ocean View Suite",
          inclusions: ["Breakfast included", "Beach club access"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 5",
        date: "Fri, 14 Apr",
        city: "Seminyak",
        activities: ["Beach relaxation", "Water sports", "Shopping at Seminyak Square", "Beachfront dinner"],
        hotel: {
          name: "The Legian Seminyak",
          stars: 5,
          location: "Seminyak Beach",
          stay: "Continued Stay",
          type: "Ocean View Suite",
          inclusions: ["Breakfast included"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 6",
        date: "Sat, 15 Apr",
        city: "Seminyak",
        activities: ["Tanah Lot Temple sunset tour", "Beach club hopping", "Spa day"],
        hotel: {
          name: "The Legian Seminyak",
          stars: 5,
          location: "Seminyak Beach",
          stay: "Continued Stay",
          type: "Ocean View Suite",
          inclusions: ["Breakfast included"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 7",
        date: "Sun, 16 Apr",
        city: "Seminyak",
        activities: ["Free day at beach", "Optional water activities", "Farewell dinner"],
        hotel: {
          name: "The Legian Seminyak",
          stars: 5,
          location: "Seminyak Beach",
          stay: "Continued Stay",
          type: "Ocean View Suite",
          inclusions: ["Breakfast & farewell dinner"],
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 8",
        date: "Mon, 17 Apr",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Hotel to Ngurah Rai Airport" }],
        flightNote: "Departure from Ngurah Rai International Airport",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["10 Apr", "11 Apr", "12 Apr", "13 Apr", "14 Apr", "15 Apr", "16 Apr", "17 Apr"],
      bestDeals: {
        message: "Tropical Paradise Special",
        actions: ["Free spa treatment daily", "Complimentary surf lesson", "Beach club membership", "Room upgrade available"]
      }
    }
  },
  {
    id: "pkg_asia_hotels_004",
    name: "Bangkok & Phuket Escape",
    title: "Thailand City & Beach",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Experience the vibrant culture of Bangkok before relaxing on Phuket's stunning beaches.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Bangkok", "4N Phuket"],
    duration: "8D/7N",
    highlights: ["Grand Palace", "Floating Markets", "Beach Resorts", "Island Hopping"],
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 900,
      discounted: 800,
      currency: "GBP",
      per: "Adult",
      emi: "£265/mo",
      notes: "Includes domestic flight and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // ASIA - Cruise & Stay
  {
    id: "pkg_asia_cruise_001",
    name: "Singapore & Malaysia Cruise",
    title: "Southeast Asia Cruise Adventure",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Cruise through Southeast Asia visiting Singapore, Kuala Lumpur, and tropical islands.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Singapore", "5N Cruise", "2N Kuala Lumpur"],
    duration: "10D/9N",
    highlights: ["Luxury Cruise Ship", "Island Excursions", "Onboard Entertainment", "City Tours"],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1500,
      discounted: 1350,
      currency: "GBP",
      per: "Adult",
      emi: "£450/mo",
      notes: "Includes cruise, hotels, and meals"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_asia_cruise_002",
    name: "Hong Kong & Vietnam Cruise",
    title: "East Asia Coastal Discovery",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Explore Hong Kong's skyline and Vietnam's Halong Bay on a luxury cruise with hotel stays.",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Hong Kong", "4N Cruise", "2N Hanoi"],
    duration: "9D/8N",
    highlights: ["Victoria Harbor", "Halong Bay", "Luxury Cruise", "Street Food Tours"],
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1400,
      discounted: 1250,
      currency: "GBP",
      per: "Adult",
      emi: "£415/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_asia_cruise_003",
    name: "Maldives Island Cruise",
    title: "Tropical Paradise Cruise",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Cruise between the stunning atolls of the Maldives with water villa stays.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Male", "5N Island Cruise", "2N Water Villa"],
    duration: "10D/9N",
    highlights: ["Island Hopping", "Snorkeling", "Water Sports", "Sunset Cruises"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2200,
      discounted: 1950,
      currency: "GBP",
      per: "Adult",
      emi: "£650/mo",
      notes: "Includes luxury cruise and water villa"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_asia_cruise_004",
    name: "Indian Ocean Cruise Experience",
    title: "Mumbai to Sri Lanka",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Asia",
    currency: "GBP",
    description: "Sail from Mumbai to Sri Lanka exploring the Indian Ocean coastline.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Mumbai", "4N Cruise", "2N Colombo"],
    duration: "9D/8N",
    highlights: ["Ocean Cruise", "Coastal Cities", "Beach Excursions", "Cultural Shows"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1350,
      discounted: 1200,
      currency: "GBP",
      per: "Adult",
      emi: "£400/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // ASIA - Multi-Centre
  {
    id: "pkg_asia_multi_001",
    name: "Asia Grand Tour",
    title: "Thailand, Vietnam & Cambodia",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Asia",
    currency: "GBP",
    description: "Explore multiple Southeast Asian countries with diverse cultural experiences.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Bangkok", "3N Hanoi", "3N Siem Reap"],
    duration: "10D/9N",
    highlights: ["Angkor Wat", "Halong Bay", "Bangkok Temples", "Local Cuisine"],
    images: [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1250,
      discounted: 1100,
      currency: "GBP",
      per: "Adult",
      emi: "£365/mo",
      notes: "Includes flights between cities"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_asia_multi_002",
    name: "China & Japan Explorer",
    title: "East Asia Cultural Journey",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Asia",
    currency: "GBP",
    description: "Experience the ancient cultures of China and Japan in one unforgettable journey.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Beijing", "2N Xi'an", "3N Tokyo", "2N Kyoto"],
    duration: "11D/10N",
    highlights: ["Great Wall", "Terracotta Warriors", "Tokyo Skyline", "Kyoto Temples"],
    images: [
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1650,
      discounted: 1450,
      currency: "GBP",
      per: "Adult",
      emi: "£480/mo",
      notes: "Includes international and domestic flights"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_asia_multi_003",
    name: "India & Nepal Spiritual Journey",
    title: "Himalayan Multi-Centre Adventure",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Asia",
    currency: "GBP",
    description: "Journey through India's spiritual cities and Nepal's mountain kingdom.",
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Delhi", "2N Agra", "2N Varanasi", "3N Kathmandu", "2N Pokhara"],
    duration: "12D/11N",
    highlights: ["Taj Mahal", "Ganges River", "Kathmandu Valley", "Mountain Views"],
    images: [
      "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1400,
      discounted: 1250,
      currency: "GBP",
      per: "Adult",
      emi: "£415/mo",
      notes: "Includes all domestic transfers"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_asia_multi_004",
    name: "Singapore, Bali & Hong Kong",
    title: "Asia City & Beach Multi-Centre",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Asia",
    currency: "GBP",
    description: "Combine cosmopolitan cities with tropical beaches in this multi-centre Asian adventure.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Singapore", "4N Bali", "3N Hong Kong"],
    duration: "11D/10N",
    highlights: ["Marina Bay", "Rice Terraces", "Victoria Peak", "Night Markets"],
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1550,
      discounted: 1400,
      currency: "GBP",
      per: "Adult",
      emi: "£465/mo",
      notes: "Includes flights and transfers"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // EUROPE - Hotels & Stay
  {
    id: "pkg_europe_hotels_001",
    name: "Paris Romantic Getaway",
    title: "City of Love Experience",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Experience the romance of Paris with luxury hotel stays near iconic landmarks.",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Paris"],
    duration: "7D/6N",
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Montmartre"],
    images: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1100,
      discounted: 950,
      currency: "GBP",
      per: "Adult",
      emi: "£315/mo",
      notes: "Includes central Paris hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_hotels_002",
    name: "Rome Historic Discovery",
    title: "Ancient Rome & Vatican",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Explore the eternal city with stays near the Colosseum and Vatican.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Rome"],
    duration: "7D/6N",
    highlights: ["Colosseum", "Vatican Museums", "Trevi Fountain", "Roman Forum"],
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1050,
      discounted: 900,
      currency: "GBP",
      per: "Adult",
      emi: "£300/mo",
      notes: "Includes historic district hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_hotels_003",
    name: "London Cultural Experience",
    title: "British Capital Heritage",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Discover London's rich history, culture, and modern attractions.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N London"],
    duration: "7D/6N",
    highlights: ["Tower of London", "British Museum", "West End Shows", "Thames Cruise"],
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1200,
      discounted: 1050,
      currency: "GBP",
      per: "Adult",
      emi: "£350/mo",
      notes: "Includes central London hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_hotels_004",
    name: "Barcelona Mediterranean Charm",
    title: "Gaudi & Beach Paradise",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Enjoy Barcelona's unique architecture, beaches, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Barcelona"],
    duration: "7D/6N",
    highlights: ["Sagrada Familia", "Park Güell", "La Rambla", "Beach Clubs"],
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1000,
      discounted: 850,
      currency: "GBP",
      per: "Adult",
      emi: "£280/mo",
      notes: "Includes beachfront hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // EUROPE - Cruise & Stay
  {
    id: "pkg_europe_cruise_001",
    name: "Mediterranean Grand Cruise",
    title: "Italy, Greece & Croatia",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Cruise the Mediterranean visiting multiple countries and ancient cities.",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Rome", "7N Cruise", "2N Athens"],
    duration: "12D/11N",
    highlights: ["Venice Canals", "Greek Islands", "Dubrovnik", "Onboard Luxury"],
    images: [
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1850,
      discounted: 1650,
      currency: "GBP",
      per: "Adult",
      emi: "£550/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_cruise_002",
    name: "Norwegian Fjords Cruise",
    title: "Scandinavia Natural Wonders",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Sail through Norway's stunning fjords with hotel stays in Bergen and Oslo.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Bergen", "5N Cruise", "2N Oslo"],
    duration: "10D/9N",
    highlights: ["Fjord Cruising", "Northern Lights", "Viking Heritage", "Mountain Views"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1750,
      discounted: 1550,
      currency: "GBP",
      per: "Adult",
      emi: "£515/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_cruise_003",
    name: "Greek Islands Cruise",
    title: "Aegean Sea Discovery",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Island-hop through Greece's most beautiful islands on a luxury cruise.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Athens", "6N Island Cruise", "2N Santorini"],
    duration: "11D/10N",
    highlights: ["Mykonos", "Santorini Sunset", "Ancient Ruins", "Island Beaches"],
    images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1650,
      discounted: 1450,
      currency: "GBP",
      per: "Adult",
      emi: "£480/mo",
      notes: "Includes cruise and island hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_cruise_004",
    name: "Baltic Sea Capitals Cruise",
    title: "Northern Europe Discovery",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Europe",
    currency: "GBP",
    description: "Cruise the Baltic visiting stunning capital cities and historic sites.",
    image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Stockholm", "7N Cruise", "2N Copenhagen"],
    duration: "12D/11N",
    highlights: ["St Petersburg", "Tallinn", "Helsinki", "Medieval Towns"],
    images: [
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1800,
      discounted: 1600,
      currency: "GBP",
      per: "Adult",
      emi: "£530/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // EUROPE - Multi-Centre
  {
    id: "pkg_europe_multi_001",
    name: "European Grand Tour",
    title: "Paris, Rome & Barcelona",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Europe",
    currency: "GBP",
    description: "Experience three of Europe's most iconic cities in one unforgettable trip.",
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Paris", "3N Rome", "3N Barcelona"],
    duration: "10D/9N",
    highlights: ["Eiffel Tower", "Colosseum", "Sagrada Familia", "Cultural Immersion"],
    images: [
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1450,
      discounted: 1250,
      currency: "GBP",
      per: "Adult",
      emi: "£415/mo",
      notes: "Includes flights between cities"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_multi_002",
    name: "UK & Ireland Explorer",
    title: "British Isles Discovery",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Europe",
    currency: "GBP",
    description: "Explore London, Edinburgh, and Dublin in one comprehensive tour.",
    image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N London", "3N Edinburgh", "3N Dublin"],
    duration: "10D/9N",
    highlights: ["British Museum", "Edinburgh Castle", "Guinness Storehouse", "Countryside"],
    images: [
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1350,
      discounted: 1200,
      currency: "GBP",
      per: "Adult",
      emi: "£400/mo",
      notes: "Includes rail passes and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_multi_003",
    name: "Central Europe Heritage",
    title: "Prague, Vienna & Budapest",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Europe",
    currency: "GBP",
    description: "Journey through Central Europe's most beautiful historic cities.",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Prague", "3N Vienna", "3N Budapest"],
    duration: "10D/9N",
    highlights: ["Prague Castle", "Opera Houses", "Danube River", "Thermal Baths"],
    images: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1300,
      discounted: 1150,
      currency: "GBP",
      per: "Adult",
      emi: "£380/mo",
      notes: "Includes train passes and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_europe_multi_004",
    name: "Swiss Alps & Italian Lakes",
    title: "Alpine Multi-Centre",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Europe",
    currency: "GBP",
    description: "Combine Switzerland's mountains with Italy's beautiful lake region.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Zurich", "3N Lucerne", "3N Lake Como"],
    duration: "10D/9N",
    highlights: ["Mountain Railways", "Alpine Villages", "Lake Como", "Swiss Chocolate"],
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1500,
      discounted: 1350,
      currency: "GBP",
      per: "Adult",
      emi: "£450/mo",
      notes: "Includes scenic train passes"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // NORTH AMERICA - Hotels & Stay
  {
    id: "pkg_namerica_hotels_001",
    name: "New York City Experience",
    title: "The Big Apple Adventure",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "North America",
    currency: "GBP",
    description: "Experience the excitement of New York with stays in Manhattan's best hotels.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Manhattan"],
    duration: "7D/6N",
    highlights: ["Statue of Liberty", "Central Park", "Broadway Shows", "Times Square"],
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1400,
      discounted: 1250,
      currency: "GBP",
      per: "Adult",
      emi: "£415/mo",
      notes: "Includes Manhattan hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_hotels_002",
    name: "San Francisco Bay Area",
    title: "Golden Gate Experience",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "North America",
    currency: "GBP",
    description: "Discover San Francisco's iconic landmarks and vibrant neighborhoods.",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N San Francisco"],
    duration: "7D/6N",
    highlights: ["Golden Gate Bridge", "Alcatraz", "Cable Cars", "Fisherman's Wharf"],
    images: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1350,
      discounted: 1200,
      currency: "GBP",
      per: "Adult",
      emi: "£400/mo",
      notes: "Includes downtown hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_hotels_003",
    name: "Las Vegas Entertainment",
    title: "Nevada Desert Oasis",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "North America",
    currency: "GBP",
    description: "Experience the entertainment capital with luxury hotel stays on the Strip.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["5N Las Vegas"],
    duration: "6D/5N",
    highlights: ["Casino Shows", "Cirque du Soleil", "Grand Canyon", "Nightlife"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1150,
      discounted: 1000,
      currency: "GBP",
      per: "Adult",
      emi: "£330/mo",
      notes: "Includes Strip hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_hotels_004",
    name: "Miami Beach Paradise",
    title: "Florida Sunshine Coast",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "North America",
    currency: "GBP",
    description: "Relax on Miami's beautiful beaches with oceanfront hotel stays.",
    image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Miami Beach"],
    duration: "7D/6N",
    highlights: ["South Beach", "Art Deco District", "Key West", "Water Sports"],
    images: [
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8e2?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1250,
      discounted: 1100,
      currency: "GBP",
      per: "Adult",
      emi: "£365/mo",
      notes: "Includes beachfront hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // NORTH AMERICA - Cruise & Stay
  {
    id: "pkg_namerica_cruise_001",
    name: "Caribbean Island Cruise",
    title: "Tropical Paradise Cruise",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "North America",
    currency: "GBP",
    description: "Cruise the Caribbean visiting multiple tropical islands with Miami stay.",
    image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Miami", "7N Caribbean Cruise", "1N Miami"],
    duration: "11D/10N",
    highlights: ["Island Hopping", "Beach Excursions", "Onboard Entertainment", "Snorkeling"],
    images: [
      "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1750,
      discounted: 1550,
      currency: "GBP",
      per: "Adult",
      emi: "£515/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_cruise_002",
    name: "Alaskan Glacier Cruise",
    title: "Inside Passage Adventure",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "North America",
    currency: "GBP",
    description: "Cruise Alaska's stunning Inside Passage viewing glaciers and wildlife.",
    image: "https://images.unsplash.com/photo-1518623001395-125242310d0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Seattle", "7N Alaska Cruise", "1N Anchorage"],
    duration: "11D/10N",
    highlights: ["Glacier Bay", "Wildlife Viewing", "Scenic Cruising", "Native Culture"],
    images: [
      "https://images.unsplash.com/photo-1518623001395-125242310d0c?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2000,
      discounted: 1800,
      currency: "GBP",
      per: "Adult",
      emi: "£600/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_cruise_003",
    name: "Mexican Riviera Cruise",
    title: "Pacific Coast Paradise",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "North America",
    currency: "GBP",
    description: "Cruise Mexico's Pacific coast with stays in Los Angeles.",
    image: "https://images.unsplash.com/photo-1548247666-5820004d2a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Los Angeles", "5N Mexico Cruise", "1N Los Angeles"],
    duration: "9D/8N",
    highlights: ["Cabo San Lucas", "Puerto Vallarta", "Beach Ports", "Mexican Cuisine"],
    images: [
      "https://images.unsplash.com/photo-1548247666-5820004d2a8d?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1450,
      discounted: 1300,
      currency: "GBP",
      per: "Adult",
      emi: "£430/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_cruise_004",
    name: "Bahamas Short Cruise",
    title: "Quick Caribbean Getaway",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "North America",
    currency: "GBP",
    description: "Short cruise to the Bahamas with Miami hotel stays.",
    image: "https://images.unsplash.com/photo-1571403054755-5e4c2e0e4998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Miami", "3N Bahamas Cruise", "1N Miami"],
    duration: "7D/6N",
    highlights: ["Nassau", "Paradise Island", "Beach Days", "Water Activities"],
    images: [
      "https://images.unsplash.com/photo-1571403054755-5e4c2e0e4998?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1100,
      discounted: 950,
      currency: "GBP",
      per: "Adult",
      emi: "£315/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // NORTH AMERICA - Multi-Centre
  {
    id: "pkg_namerica_multi_001",
    name: "USA East Coast Cities",
    title: "New York, Washington & Boston",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "North America",
    currency: "GBP",
    description: "Explore America's historic east coast cities in one trip.",
    image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N New York", "3N Washington DC", "2N Boston"],
    duration: "9D/8N",
    highlights: ["Statue of Liberty", "White House", "Freedom Trail", "Museums"],
    images: [
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1550,
      discounted: 1400,
      currency: "GBP",
      per: "Adult",
      emi: "£465/mo",
      notes: "Includes train passes and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_multi_002",
    name: "California Coast Adventure",
    title: "San Francisco, LA & San Diego",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "North America",
    currency: "GBP",
    description: "Road trip down California's stunning Pacific coastline.",
    image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N San Francisco", "3N Los Angeles", "2N San Diego"],
    duration: "9D/8N",
    highlights: ["Highway 1", "Hollywood", "Beaches", "Wine Country"],
    images: [
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1600,
      discounted: 1450,
      currency: "GBP",
      per: "Adult",
      emi: "£480/mo",
      notes: "Includes car rental and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_multi_003",
    name: "Canada Multi-City Tour",
    title: "Toronto, Montreal & Vancouver",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "North America",
    currency: "GBP",
    description: "Discover Canada's vibrant cities from coast to coast.",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Toronto", "2N Montreal", "3N Vancouver"],
    duration: "9D/8N",
    highlights: ["CN Tower", "Old Montreal", "Stanley Park", "Niagara Falls"],
    images: [
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1500,
      discounted: 1350,
      currency: "GBP",
      per: "Adult",
      emi: "£450/mo",
      notes: "Includes domestic flights and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_namerica_multi_004",
    name: "Southwest USA National Parks",
    title: "Las Vegas, Grand Canyon & Utah",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "North America",
    currency: "GBP",
    description: "Explore America's stunning southwest national parks.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Las Vegas", "2N Grand Canyon", "2N Zion", "2N Bryce Canyon"],
    duration: "9D/8N",
    highlights: ["Grand Canyon", "Zion NP", "Bryce Canyon", "Desert Landscapes"],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1400,
      discounted: 1250,
      currency: "GBP",
      per: "Adult",
      emi: "£415/mo",
      notes: "Includes car rental and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // SOUTH AMERICA - Hotels & Stay
  {
    id: "pkg_samerica_hotels_001",
    name: "Rio de Janeiro Beach Escape",
    title: "Brazilian Carnival City",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "South America",
    currency: "GBP",
    description: "Experience Rio's stunning beaches, mountains, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Rio de Janeiro"],
    duration: "7D/6N",
    highlights: ["Christ the Redeemer", "Copacabana Beach", "Sugarloaf Mountain", "Samba Shows"],
    images: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1200,
      discounted: 1050,
      currency: "GBP",
      per: "Adult",
      emi: "£350/mo",
      notes: "Includes beachfront hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_hotels_002",
    name: "Buenos Aires Tango Experience",
    title: "Argentine Capital Culture",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "South America",
    currency: "GBP",
    description: "Discover Buenos Aires' European charm and passionate tango culture.",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Buenos Aires"],
    duration: "7D/6N",
    highlights: ["Tango Shows", "La Boca", "Recoleta", "Argentine Steakhouses"],
    images: [
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1100,
      discounted: 950,
      currency: "GBP",
      per: "Adult",
      emi: "£315/mo",
      notes: "Includes city center hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_hotels_003",
    name: "Lima Culinary Journey",
    title: "Peru's Gastronomic Capital",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "South America",
    currency: "GBP",
    description: "Experience Lima's world-class cuisine and Pacific coastline.",
    image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Lima"],
    duration: "7D/6N",
    highlights: ["Peruvian Cuisine", "Miraflores", "Historic Center", "Coastal Views"],
    images: [
      "https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1000,
      discounted: 900,
      currency: "GBP",
      per: "Adult",
      emi: "£300/mo",
      notes: "Includes coastal hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_hotels_004",
    name: "Cartagena Colonial Charm",
    title: "Colombian Caribbean Jewel",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "South America",
    currency: "GBP",
    description: "Explore Cartagena's colonial architecture and Caribbean beaches.",
    image: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Cartagena"],
    duration: "7D/6N",
    highlights: ["Walled City", "Rosario Islands", "Colonial Architecture", "Caribbean Food"],
    images: [
      "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 950,
      discounted: 850,
      currency: "GBP",
      per: "Adult",
      emi: "£280/mo",
      notes: "Includes old town hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // SOUTH AMERICA - Cruise & Stay
  {
    id: "pkg_samerica_cruise_001",
    name: "Amazon River Cruise",
    title: "Rainforest Expedition",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "South America",
    currency: "GBP",
    description: "Cruise the Amazon River experiencing the world's largest rainforest.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Manaus", "5N Amazon Cruise", "1N Manaus"],
    duration: "9D/8N",
    highlights: ["Wildlife Spotting", "Jungle Expeditions", "Indigenous Villages", "River Dolphins"],
    images: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1650,
      discounted: 1450,
      currency: "GBP",
      per: "Adult",
      emi: "£480/mo",
      notes: "Includes river cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_cruise_002",
    name: "Galapagos Islands Cruise",
    title: "Ecuador Wildlife Paradise",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "South America",
    currency: "GBP",
    description: "Explore Darwin's paradise with an island-hopping cruise.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Quito", "6N Galapagos Cruise", "1N Quito"],
    duration: "10D/9N",
    highlights: ["Unique Wildlife", "Island Hopping", "Snorkeling", "Nature Walks"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2500,
      discounted: 2200,
      currency: "GBP",
      per: "Adult",
      emi: "£730/mo",
      notes: "Includes flights and cruise"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_cruise_003",
    name: "Patagonia Fjords Cruise",
    title: "Chilean & Argentine Coast",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "South America",
    currency: "GBP",
    description: "Cruise through Patagonia's dramatic fjords and glaciers.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Santiago", "5N Patagonia Cruise", "2N Buenos Aires"],
    duration: "10D/9N",
    highlights: ["Glaciers", "Wildlife", "Fjords", "Cape Horn"],
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2100,
      discounted: 1850,
      currency: "GBP",
      per: "Adult",
      emi: "£615/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_cruise_004",
    name: "Caribbean Coast Cruise",
    title: "Colombia & Panama",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "South America",
    currency: "GBP",
    description: "Cruise Colombia's Caribbean coast and the Panama Canal.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Cartagena", "5N Caribbean Cruise", "2N Panama City"],
    duration: "10D/9N",
    highlights: ["Panama Canal", "Island Beaches", "Colonial Towns", "Caribbean Culture"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1550,
      discounted: 1350,
      currency: "GBP",
      per: "Adult",
      emi: "£450/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // SOUTH AMERICA - Multi-Centre
  {
    id: "pkg_samerica_multi_001",
    name: "Peru Highlights Tour",
    title: "Lima, Cusco & Machu Picchu",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "South America",
    currency: "GBP",
    description: "Experience Peru's ancient wonders and colonial cities.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Lima", "3N Cusco", "2N Sacred Valley", "2N Machu Picchu"],
    duration: "10D/9N",
    highlights: ["Machu Picchu", "Sacred Valley", "Cusco", "Peruvian Cuisine"],
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1750,
      discounted: 1550,
      currency: "GBP",
      per: "Adult",
      emi: "£515/mo",
      notes: "Includes trains and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_multi_002",
    name: "Brazil Multi-City Experience",
    title: "Rio, Iguazu & Salvador",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "South America",
    currency: "GBP",
    description: "Explore Brazil's most iconic destinations from beaches to waterfalls.",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Rio de Janeiro", "3N Iguazu Falls", "3N Salvador"],
    duration: "10D/9N",
    highlights: ["Christ Statue", "Iguazu Falls", "Colonial Salvador", "Brazilian Culture"],
    images: [
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1650,
      discounted: 1450,
      currency: "GBP",
      per: "Adult",
      emi: "£480/mo",
      notes: "Includes domestic flights"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_multi_003",
    name: "Argentina & Chile Discovery",
    title: "Buenos Aires, Mendoza & Santiago",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "South America",
    currency: "GBP",
    description: "Explore two countries with wine regions and mountain scenery.",
    image: "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Buenos Aires", "3N Mendoza", "3N Santiago"],
    duration: "10D/9N",
    highlights: ["Tango Shows", "Wine Tours", "Andes Mountains", "Chilean Cuisine"],
    images: [
      "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1550,
      discounted: 1400,
      currency: "GBP",
      per: "Adult",
      emi: "£465/mo",
      notes: "Includes flights and transfers"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_samerica_multi_004",
    name: "Colombia Grand Tour",
    title: "Bogota, Medellin & Cartagena",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "South America",
    currency: "GBP",
    description: "Discover Colombia's diverse cities from mountains to Caribbean coast.",
    image: "https://images.unsplash.com/photo-1549925245-f20a6b753cd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Bogota", "3N Medellin", "3N Cartagena"],
    duration: "10D/9N",
    highlights: ["Gold Museum", "Coffee Region", "Colonial Cartagena", "Mountain Views"],
    images: [
      "https://images.unsplash.com/photo-1549925245-f20a6b753cd4?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1450,
      discounted: 1300,
      currency: "GBP",
      per: "Adult",
      emi: "£430/mo",
      notes: "Includes domestic flights"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // AFRICA - Hotels & Stay
  {
    id: "pkg_africa_hotels_001",
    name: "Cape Town Coastal Paradise",
    title: "South African Jewel",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Experience Cape Town's stunning beauty with Table Mountain and coastal hotels.",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Cape Town"],
    duration: "7D/6N",
    highlights: ["Table Mountain", "Cape of Good Hope", "Wine Lands", "Waterfront"],
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1250,
      discounted: 1100,
      currency: "GBP",
      per: "Adult",
      emi: "£365/mo",
      notes: "Includes coastal hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_hotels_002",
    name: "Marrakech Desert Oasis",
    title: "Moroccan Magic",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Discover Marrakech's vibrant souks and desert landscapes with riad stays.",
    image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["5N Marrakech", "1N Sahara Desert"],
    duration: "7D/6N",
    highlights: ["Medina", "Souks", "Desert Camp", "Atlas Mountains"],
    images: [
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1000,
      discounted: 900,
      currency: "GBP",
      per: "Adult",
      emi: "£300/mo",
      notes: "Includes riad and desert camp"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_hotels_003",
    name: "Cairo Pyramids Experience",
    title: "Ancient Egypt Discovery",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Explore ancient Egypt with luxury hotel stays near the pyramids.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Cairo"],
    duration: "7D/6N",
    highlights: ["Pyramids of Giza", "Egyptian Museum", "Nile Views", "Sphinx"],
    images: [
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1150,
      discounted: 1000,
      currency: "GBP",
      per: "Adult",
      emi: "£330/mo",
      notes: "Includes pyramid view hotel"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_hotels_004",
    name: "Zanzibar Beach Retreat",
    title: "Tanzania Island Paradise",
    type: "Hotels & Stay",
    holidayType: "Hotels & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Relax on Zanzibar's pristine beaches with luxury resort stays.",
    image: "https://images.unsplash.com/photo-1505881406933-d36aee19fb59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["6N Zanzibar"],
    duration: "7D/6N",
    highlights: ["White Sand Beaches", "Spice Tours", "Stone Town", "Snorkeling"],
    images: [
      "https://images.unsplash.com/photo-1505881406933-d36aee19fb59?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1100,
      discounted: 950,
      currency: "GBP",
      per: "Adult",
      emi: "£315/mo",
      notes: "Includes beachfront resort"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // AFRICA - Cruise & Stay
  {
    id: "pkg_africa_cruise_001",
    name: "Nile River Cruise",
    title: "Ancient Egypt by River",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Cruise the Nile visiting ancient temples with Cairo hotel stays.",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Cairo", "5N Nile Cruise", "2N Luxor"],
    duration: "10D/9N",
    highlights: ["Valley of Kings", "Karnak Temple", "Abu Simbel", "River Cruising"],
    images: [
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1600,
      discounted: 1400,
      currency: "GBP",
      per: "Adult",
      emi: "£465/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_cruise_002",
    name: "Cape Verde Islands Cruise",
    title: "Atlantic Island Paradise",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Island-hop through Cape Verde with beach resort stays.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Sal Island", "5N Island Cruise", "2N Boa Vista"],
    duration: "10D/9N",
    highlights: ["Island Hopping", "Water Sports", "Beach Resorts", "Local Culture"],
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1450,
      discounted: 1300,
      currency: "GBP",
      per: "Adult",
      emi: "£430/mo",
      notes: "Includes cruise and resorts"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_cruise_003",
    name: "Seychelles Island Cruise",
    title: "Indian Ocean Paradise",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Luxury cruise through the Seychelles with private island stays.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Mahe", "5N Island Cruise", "2N Praslin"],
    duration: "10D/9N",
    highlights: ["Pristine Beaches", "Island Hopping", "Wildlife", "Snorkeling"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2400,
      discounted: 2100,
      currency: "GBP",
      per: "Adult",
      emi: "£700/mo",
      notes: "Includes luxury cruise and resorts"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_cruise_004",
    name: "Madagascar Coast Cruise",
    title: "Unique Island Discovery",
    type: "Cruise & Stay",
    holidayType: "Cruise & Stay",
    region: "Africa",
    currency: "GBP",
    description: "Explore Madagascar's unique wildlife and coastal beauty by cruise.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["2N Antananarivo", "5N Coastal Cruise", "2N Nosy Be"],
    duration: "10D/9N",
    highlights: ["Unique Wildlife", "Baobab Avenue", "Beach Islands", "Lemurs"],
    images: [
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1750,
      discounted: 1550,
      currency: "GBP",
      per: "Adult",
      emi: "£515/mo",
      notes: "Includes cruise and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },

  // AFRICA - Multi-Centre
  {
    id: "pkg_africa_multi_001",
    name: "Kenya & Tanzania Safari",
    title: "East Africa Wildlife Adventure",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Africa",
    currency: "GBP",
    description: "Experience the best of East African safaris across two countries.",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Nairobi", "3N Masai Mara", "2N Serengeti", "2N Ngorongoro"],
    duration: "11D/10N",
    highlights: ["Big Five", "Great Migration", "Masai Culture", "Crater Views"],
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2200,
      discounted: 1950,
      currency: "GBP",
      per: "Adult",
      emi: "£650/mo",
      notes: "Includes safari lodges and game drives"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_multi_002",
    name: "South Africa & Botswana",
    title: "Safari & City Experience",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Africa",
    currency: "GBP",
    description: "Combine Cape Town's beauty with Botswana's wildlife paradise.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Cape Town", "2N Kruger NP", "3N Okavango Delta"],
    duration: "9D/8N",
    highlights: ["Table Mountain", "Big Five Safari", "Okavango Delta", "Wine Tours"],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 2100,
      discounted: 1850,
      currency: "GBP",
      per: "Adult",
      emi: "£615/mo",
      notes: "Includes flights and lodges"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_multi_003",
    name: "Morocco Grand Tour",
    title: "Marrakech, Fes & Sahara",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Africa",
    currency: "GBP",
    description: "Journey through Morocco's imperial cities and desert landscapes.",
    image: "https://images.unsplash.com/photo-1561213088-039e53143fdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Marrakech", "2N Sahara Desert", "3N Fes", "1N Casablanca"],
    duration: "10D/9N",
    highlights: ["Medinas", "Desert Camp", "Atlas Mountains", "Moroccan Cuisine"],
    images: [
      "https://images.unsplash.com/photo-1561213088-039e53143fdd?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1400,
      discounted: 1250,
      currency: "GBP",
      per: "Adult",
      emi: "£415/mo",
      notes: "Includes riads and desert camp"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  },
  {
    id: "pkg_africa_multi_004",
    name: "Egypt & Jordan Explorer",
    title: "Ancient Wonders Multi-Centre",
    type: "Multi-Centre",
    holidayType: "Multi-Centre",
    region: "Africa",
    currency: "GBP",
    description: "Discover two ancient civilizations with pyramids and Petra.",
    image: "https://images.unsplash.com/photo-1512813498716-c99b1ce0c685?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    route: ["3N Cairo", "2N Luxor", "3N Amman", "2N Petra"],
    duration: "11D/10N",
    highlights: ["Pyramids", "Valley of Kings", "Petra", "Dead Sea"],
    images: [
      "https://images.unsplash.com/photo-1512813498716-c99b1ce0c685?w=300&h=200&fit=crop"
    ],
    tabs: ["Itinerary", "Policies", "Summary"],
    price: {
      original: 1850,
      discounted: 1650,
      currency: "GBP",
      per: "Adult",
      emi: "£550/mo",
      notes: "Includes flights and hotels"
    },
    itinerary: [
      {
        day: "Day 1",
        date: "Day 1",
        city: "Destination",
        transfers: [{ type: "Airport Transfer", details: "Airport pickup included" }],
        flightNote: "Please arrive as per your flight schedule",
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Multiple Nights",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        },
        activities: ["Arrival", "Check-in", "City orientation"]
      },
      {
        day: "Day 2",
        date: "Day 2",
        city: "Destination",
        activities: ["City tour", "Local attractions", "Leisure time"],
        hotel: {
          name: "Premium Hotel",
          stars: 4,
          location: "City Center",
          stay: "Continued Stay",
          type: "Deluxe Room",
          inclusions: ["Breakfast included"],
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop"
        }
      },
      {
        day: "Day 3",
        date: "Day 3",
        city: "Departure",
        transfers: [{ type: "Airport Transfer", details: "Airport drop-off included" }],
        flightNote: "Departure as per your flight schedule",
        activities: ["Check-out", "Departure"]
      }
    ],
    sidebar: {
      days: ["Day 1", "Day 2", "Day 3"],
      bestDeals: {
        message: "Book now for special offers",
        actions: ["Early bird discount", "Free upgrades", "Complimentary meals", "Flexible cancellation"]
      }
    }
  }
];

export default samplePackageData;

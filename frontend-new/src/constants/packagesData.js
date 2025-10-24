// --- Popular Travel Packages ---
export const popularTravelData = [
  {
    id: 1,
    title: "Golden Triangle",
    location: "Delhi, Agra, Jaipur",
    price: "£599",
    duration: "6D/5N",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    rating: 4.7,
    reviews: 245,
    activities: [
      {
        id: 1,
        name: "Taj Mahal Sunrise Tour",
        description: "Experience the magical sunrise at the iconic Taj Mahal, one of the Seven Wonders of the World. This early morning tour offers the best lighting for photography and a peaceful atmosphere.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "3 hours",
        difficulty: "Easy",
        included: true
      },
      {
        id: 2,
        name: "Amber Fort Visit",
        description: "Explore the magnificent Amber Fort, a UNESCO World Heritage Site. Ride an elephant up to the fort entrance and discover the rich history and stunning architecture of this royal palace.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "4 hours",
        difficulty: "Moderate",
        included: true
      },
      {
        id: 3,
        name: "Chandni Chowk Food Walk",
        description: "Embark on a culinary journey through Delhi's oldest and busiest market. Taste authentic street food, visit historic spice markets, and learn about the city's rich food culture.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "2.5 hours",
        difficulty: "Easy",
        included: true
      }
    ],
  },
  {
    id: 2,
    title: "European Grand Tour",
    location: "Paris, Venice, Barcelona",
    price: "£1,850",
    duration: "12D/11N",
    image:
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3", // Replaced image
    rating: 4.9,
    reviews: 312,
    activities: [
      {
        id: 1,
        name: "Eiffel Tower Access",
        description: "Skip the lines and enjoy priority access to the iconic Eiffel Tower. Take in breathtaking panoramic views of Paris from the top level and learn about the tower's fascinating history.",
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "2 hours",
        difficulty: "Easy",
        included: true
      },
      {
        id: 2,
        name: "Gondola Ride",
        description: "Experience the romance of Venice with a traditional gondola ride through the city's enchanting canals. Glide past historic palaces and under charming bridges while listening to gondolier stories.",
        image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "1 hour",
        difficulty: "Easy",
        included: true
      },
      {
        id: 3,
        name: "Sagrada Familia Tour",
        description: "Discover Antoni Gaudí's masterpiece, the Sagrada Familia. Explore this architectural wonder with a guided tour, learning about its unique design and ongoing construction.",
        image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "2.5 hours",
        difficulty: "Easy",
        included: true
      }
    ],
  },
  {
    id: 3,
    title: "Japanese Cultural Journey",
    location: "Tokyo, Kyoto, Osaka",
    price: "£1,050",
    duration: "8D/7N",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3",
    rating: 4.8,
    reviews: 198,
    activities: [
      {
        id: 1,
        name: "Tea Ceremony",
        description: "Participate in an authentic Japanese tea ceremony in a traditional tea house. Learn the art of preparing matcha tea and understand the spiritual significance of this ancient ritual.",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "1.5 hours",
        difficulty: "Easy",
        included: true
      },
      {
        id: 2,
        name: "Bullet Train Experience",
        description: "Ride the world-famous Shinkansen bullet train from Tokyo to Kyoto. Experience Japan's efficient rail system and enjoy scenic views of the countryside at speeds up to 320 km/h.",
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "2.5 hours",
        difficulty: "Easy",
        included: true
      },
      {
        id: 3,
        name: "Tsukiji Market Visit",
        description: "Explore Tokyo's famous Tsukiji Outer Market, the world's largest fish market. Sample fresh sushi, discover unique Japanese ingredients, and witness the bustling morning auction atmosphere.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        duration: "3 hours",
        difficulty: "Easy",
        included: true
      }
    ],
  },
  {
    id: 4,
    title: "Egyptian Wonders",
    location: "Cairo, Luxor, Aswan",
    price: "£850",
    duration: "9D/8N",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
    rating: 4.7,
    reviews: 176,
    activities: ["Pyramids of Giza", "Nile Cruise", "Valley of the Kings"],
  },
  {
    id: 5,
    title: "Moroccan Adventure",
    location: "Marrakech, Sahara, Fes",
    price: "£780",
    duration: "10D/9N",
    image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260", // Replaced image
    rating: 4.8,
    reviews: 134,
    activities: [
      "Atlas Mountains Trek",
      "Desert Glamping",
      "Medina Exploration",
    ],
  },
  {
    id: 6,
    title: "Vietnam Highlights",
    location: "Hanoi, Halong Bay, Ho Chi Minh",
    price: "£600",
    duration: "11D/10N",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3", // Replaced image
    rating: 4.7,
    reviews: 156,
    activities: ["Halong Bay Cruise", "Cu Chi Tunnels", "Hoi An Ancient Town"],
  },
];

// --- Adventure Packages ---
export const adventureData = [
  {
    id: 1,
    title: "Amazon Rainforest Expedition",
    location: "Brazil",
    price: "£900",
    duration: "9D/8N",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b",
    rating: 4.8,
    reviews: 112,
    activities: [
      "Jungle Survival Training",
      "Pink Dolphin Spotting",
      "Night Canoeing",
    ],
  },
  {
    id: 2,
    title: "New Zealand Extreme",
    location: "Queenstown, Rotorua",
    price: "£1,550",
    duration: "14D/13N",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
    rating: 4.9,
    reviews: 187,
    activities: ["Bungee Jumping", "White Water Rafting", "Glacier Hiking"],
  },
  {
    id: 3,
    title: "African Wildlife Safari",
    location: "Kenya, Tanzania",
    price: "£1,150",
    duration: "10D/9N",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    rating: 4.9,
    reviews: 156,
    activities: [
      "Great Migration Viewing",
      "Hot Air Balloon Safari",
      "Maasai Village Visit",
    ],
  },
  {
    id: 4,
    title: "Himalayan Trekking Adventure",
    location: "Nepal",
    price: "£575",
    duration: "12D/11N",
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0",
    rating: 4.7,
    reviews: 89,
    activities: [
      "Everest Base Camp Trek",
      "Helicopter Tour",
      "Local Sherpa Culture Experience",
    ],
  },
  {
    id: 5,
    title: "Japanese Cultural Immersion",
    location: "Kyoto, Tokyo, Osaka",
    price: "£1,025",
    duration: "10D/9N",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3",
    rating: 4.8,
    reviews: 176,
    activities: [
      "Samurai Sword Training",
      "Tea Ceremony",
      "Bullet Train Experience",
    ],
  },
];

// --- Luxury Packages ---
export const luxuryData = [
  {
    id: 1,
    title: "Maldives Paradise",
    location: "Maldives",
    price: "£2,950",
    duration: "8D/7N",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 5.0,
    reviews: 124,
    highlights: ["Overwater Villa", "Private Chef", "Submarine Dining"],
  },
  {
    id: 2,
    title: "Greek Islands Luxury",
    location: "Santorini, Mykonos",
    price: "£2,600",
    duration: "9D/8N",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    rating: 4.9,
    reviews: 98,
    highlights: [
      "Sunset Catamaran Cruise",
      "Cave Pool Suite",
      "Private Wine Tasting",
    ],
  },
  {
    id: 3,
    title: "Dubai Royal Experience",
    location: "Dubai",
    price: "£2,250",
    duration: "6D/5N",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
    rating: 4.8,
    reviews: 145,
    highlights: [
      "Burj Khalifa Suite",
      "Private Yacht Charter",
      "Desert Glamping",
    ],
  },
  {
    id: 4,
    title: "Seychelles Private Retreat",
    location: "Seychelles",
    price: "£3,550",
    duration: "10D/9N",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    rating: 5.0,
    reviews: 87,
    highlights: [
      "Private Island Access",
      "Personal Concierge",
      "Helicopter Transfers",
    ],
  },
];

// --- Featured Package ---
export const featuredPackage = {
  id: 0,
  title: "Bali Premium Retreat",
  location: "Bali, Indonesia",
  price: "£1,650",
  duration: "8D/7N",
  image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
  description:
    "Indulge in ultimate Balinese luxury with private villas, personalized services, and exclusive cultural encounters in paradise.",
  rating: 4.9,
  reviews: 278,
  highlights: [
    "Cliffside Infinity Pool",
    "24/7 Personal Butler",
    "Volcano Sunrise Breakfast",
    "Traditional Healer Session",
    "Private Beach Dinner",
  ],
  discount: "20% OFF",
};

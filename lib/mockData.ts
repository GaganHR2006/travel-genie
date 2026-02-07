// lib/mockData.ts - EXPANDED WITH ALL DATA

export const MOCK_DESTINATIONS = [
    {
        name: "Tokyo, Japan",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        description: "Neon-lit streets meet ancient temples",
        bestMonths: ["Mar", "Apr", "Oct", "Nov"],
        avgBudget: 2500,
        highlights: ["Shibuya Crossing", "Senso-ji Temple", "Mount Fuji"],
        vibe: ["Urban", "Cultural", "Tech"],
        coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    {
        name: "Bali, Indonesia",
        country: "Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
        description: "Tropical paradise with spiritual vibes",
        bestMonths: ["Apr", "May", "Jun", "Sep"],
        avgBudget: 1200,
        highlights: ["Ubud Rice Terraces", "Beach Clubs", "Temples"],
        vibe: ["Beach", "Relaxation", "Spiritual"],
        coordinates: { lat: -8.3405, lng: 115.092 },
    },
    {
        name: "Paris, France",
        country: "France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        description: "The City of Light and romance",
        bestMonths: ["Apr", "May", "Sep", "Oct"],
        avgBudget: 3500,
        highlights: ["Eiffel Tower", "Louvre", "Notre-Dame"],
        vibe: ["Romantic", "Cultural", "Urban"],
        coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    {
        name: "Santorini, Greece",
        country: "Greece",
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
        description: "White-washed buildings against azure seas",
        bestMonths: ["Apr", "May", "Sep", "Oct"],
        avgBudget: 2800,
        highlights: ["Oia Sunset", "Red Beach", "Wine Tasting"],
        vibe: ["Romantic", "Beach", "Relaxation"],
        coordinates: { lat: 36.3932, lng: 25.4615 },
    },
    {
        name: "New York, USA",
        country: "USA",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
        description: "The city that never sleeps",
        bestMonths: ["Apr", "May", "Sep", "Oct"],
        avgBudget: 4000,
        highlights: ["Central Park", "Times Square", "Statue of Liberty"],
        vibe: ["Urban", "Fast-paced", "Cultural"],
        coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
        name: "Dubai, UAE",
        country: "UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        description: "Futuristic luxury meets desert adventure",
        bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
        avgBudget: 3200,
        highlights: ["Burj Khalifa", "Desert Safari", "Gold Souk"],
        vibe: ["Luxury", "Adventure", "Modern"],
        coordinates: { lat: 25.2048, lng: 55.2708 },
    },
];

export const MOCK_ITINERARY = (
    destination: string,
    days: number,
    budget: number
) => {
    const perDay = Math.floor(budget / days);

    const activityDatabase: Record<
        string,
        Array<{ time: string; activity: string; cost: number }>
    > = {
        Tokyo: [
            { time: "Morning", activity: "Visit Senso-ji Temple in Asakusa", cost: 0 },
            { time: "Afternoon", activity: "Explore Akihabara Electronics District", cost: 50 },
            { time: "Evening", activity: "Shibuya Crossing & Robot Restaurant Dinner", cost: 80 },
        ],
        Bali: [
            { time: "Morning", activity: "Sunrise at Tegallalang Rice Terraces", cost: 15 },
            { time: "Afternoon", activity: "Ubud Monkey Forest & Traditional Lunch", cost: 25 },
            { time: "Evening", activity: "Beach Club Sunset at Seminyak", cost: 60 },
        ],
        Paris: [
            { time: "Morning", activity: "Eiffel Tower Visit & Photos", cost: 30 },
            { time: "Afternoon", activity: "Louvre Museum Art Tour", cost: 20 },
            { time: "Evening", activity: "Seine River Cruise & French Dinner", cost: 75 },
        ],
        Santorini: [
            { time: "Morning", activity: "Oia Village Walking Tour", cost: 0 },
            { time: "Afternoon", activity: "Red Beach & Wine Tasting", cost: 45 },
            { time: "Evening", activity: "Sunset Dinner in Fira", cost: 65 },
        ],
        "New York": [
            { time: "Morning", activity: "Central Park Bike Tour", cost: 30 },
            { time: "Afternoon", activity: "Metropolitan Museum of Art", cost: 25 },
            { time: "Evening", activity: "Broadway Show & Times Square", cost: 120 },
        ],
        Dubai: [
            { time: "Morning", activity: "Burj Khalifa Observation Deck", cost: 40 },
            { time: "Afternoon", activity: "Dubai Mall Shopping & Aquarium", cost: 50 },
            { time: "Evening", activity: "Desert Safari with BBQ Dinner", cost: 90 },
        ],
    };

    const cityKey = destination.split(",")[0] as keyof typeof activityDatabase;
    const cityActivities = activityDatabase[cityKey] || activityDatabase.Tokyo;

    return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
        day: i + 1,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
            }
        ),
        budget: perDay,
        activities: cityActivities,
    }));
};

export const MOCK_HOTELS = [
    {
        name: "Grand Luxury Hotel",
        stars: 5,
        pricePerNight: 250,
        location: "City Center",
        amenities: ["Pool", "Spa", "Restaurant", "Gym", "Concierge"],
        rating: 4.8,
        reviews: 2847,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    },
    {
        name: "Boutique Comfort Inn",
        stars: 4,
        pricePerNight: 120,
        location: "Historic District",
        amenities: ["Breakfast", "WiFi", "Rooftop Bar", "Parking"],
        rating: 4.5,
        reviews: 1523,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    },
    {
        name: "Budget Traveler Hostel",
        stars: 3,
        pricePerNight: 45,
        location: "Near Station",
        amenities: ["WiFi", "Kitchen", "Common Area", "Lockers"],
        rating: 4.2,
        reviews: 892,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    },
];

export const MOCK_FLIGHTS = [
    {
        airline: "SkyHigh Airlines",
        logo: "✈️",
        departure: "08:00 AM",
        arrival: "10:30 PM",
        duration: "14h 30m",
        stops: 0,
        price: 850,
        class: "Economy",
        baggage: "2 checked bags",
    },
    {
        airline: "Global Wings",
        logo: "🛫",
        departure: "02:15 PM",
        arrival: "06:45 AM +1",
        duration: "16h 30m",
        stops: 1,
        price: 620,
        class: "Economy",
        baggage: "1 checked bag",
    },
    {
        airline: "Premium Air",
        logo: "🌟",
        departure: "11:00 PM",
        arrival: "03:30 PM +1",
        duration: "14h 30m",
        stops: 0,
        price: 2100,
        class: "Business",
        baggage: "3 checked bags",
    },
];

export const MOCK_TRANSPORT = {
    train: {
        name: "High-Speed Rail",
        duration: "2h 15m",
        price: 95,
        frequency: "Every 30 mins",
        comfort: "High",
        co2: "14 kg",
    },
    flight: {
        name: "Domestic Flight",
        duration: "1h 10m",
        price: 180,
        frequency: "6 daily",
        comfort: "Medium",
        co2: "85 kg",
    },
    car: {
        name: "Rental Car",
        duration: "3h 45m",
        price: 65,
        frequency: "Anytime",
        comfort: "High",
        co2: "45 kg",
    },
};

export const MOCK_WEATHER = {
    current: {
        temp: 24,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        feelsLike: 26,
        uvIndex: 6,
    },
    forecast: [
        { day: "Mon", high: 26, low: 18, condition: "Sunny", rain: 10, icon: "☀️" },
        { day: "Tue", high: 25, low: 19, condition: "Cloudy", rain: 30, icon: "☁️" },
        { day: "Wed", high: 23, low: 17, condition: "Rain", rain: 80, icon: "🌧️" },
        { day: "Thu", high: 27, low: 20, condition: "Sunny", rain: 5, icon: "☀️" },
        { day: "Fri", high: 28, low: 21, condition: "Sunny", rain: 0, icon: "☀️" },
    ],
};

export const MOCK_EXPENSES = [
    { category: "Accommodation", amount: 700, percentage: 35, color: "#10b981" },
    { category: "Food & Dining", amount: 500, percentage: 25, color: "#3b82f6" },
    { category: "Activities", amount: 400, percentage: 20, color: "#f59e0b" },
    { category: "Transportation", amount: 300, percentage: 15, color: "#ef4444" },
    { category: "Shopping", amount: 100, percentage: 5, color: "#8b5cf6" },
];

export const MOCK_VISA_INFO: Record<string, {
    required: boolean;
    type: string;
    duration: string;
    cost: number;
    processingDays: number;
    description: string;
    documents?: string[];
}> = {
    Thailand: {
        required: false,
        type: "Visa-Free",
        duration: "30 days",
        cost: 0,
        processingDays: 0,
        description: "US citizens can enter Thailand without a visa for tourism purposes.",
    },
    Japan: {
        required: true,
        type: "eVisa",
        duration: "90 days",
        cost: 30,
        processingDays: 5,
        description: "Electronic visa available online. Apply at least 1 week before travel.",
        documents: ["Valid passport", "Photo", "Flight itinerary", "Hotel booking"],
    },
    USA: {
        required: true,
        type: "Visa Required",
        duration: "180 days",
        cost: 160,
        processingDays: 30,
        description: "B-2 tourist visa required. Interview at US embassy mandatory.",
        documents: ["Valid passport", "DS-160 form", "Photo", "Financial proof", "Interview appointment"],
    },
    Indonesia: {
        required: false,
        type: "Visa on Arrival",
        duration: "30 days",
        cost: 35,
        processingDays: 0,
        description: "Visa available on arrival at Indonesian airports.",
    },
    France: {
        required: true,
        type: "Schengen Visa",
        duration: "90 days",
        cost: 80,
        processingDays: 15,
        description: "Schengen visa allows travel to 26 European countries.",
        documents: ["Valid passport", "Travel insurance", "Flight/hotel bookings", "Financial proof"],
    },
    Greece: {
        required: true,
        type: "Schengen Visa",
        duration: "90 days",
        cost: 80,
        processingDays: 15,
        description: "Schengen visa required for Greek islands and mainland.",
    },
    UAE: {
        required: false,
        type: "Visa on Arrival",
        duration: "30 days",
        cost: 0,
        processingDays: 0,
        description: "US citizens receive free visa on arrival for 30 days.",
    },
};

export const MOCK_PACKING_LIST: Record<string, string[]> = {
    Clothing: [
        "3x T-shirts",
        "2x Pants/Jeans",
        "1x Jacket/Sweater",
        "Underwear (5-7)",
        "Socks (5-7)",
        "Comfortable walking shoes",
        "Sandals/flip-flops",
    ],
    Tech: [
        "Phone charger",
        "Power bank",
        "Universal adapter",
        "Headphones",
        "Camera (optional)",
        "E-reader/tablet",
    ],
    Documents: [
        "Passport",
        "Visa/visa copy",
        "Travel insurance",
        "Hotel confirmations",
        "Flight tickets",
        "Emergency contacts list",
        "Credit cards",
    ],
    Toiletries: [
        "Toothbrush & toothpaste",
        "Shampoo/conditioner",
        "Sunscreen SPF 50+",
        "Medications",
        "First aid kit",
        "Hand sanitizer",
        "Lip balm",
    ],
    Essentials: [
        "Water bottle",
        "Daypack/backpack",
        "Sunglasses",
        "Hat/cap",
        "Portable umbrella",
        "Money belt",
        "Ziploc bags",
    ],
};

export const MOCK_PHRASES: Record<
    string,
    Array<{ english: string; local: string; pronunciation: string }>
> = {
    Greetings: [
        { english: "Hello", local: "こんにちは", pronunciation: "Konnichiwa" },
        { english: "Thank you", local: "ありがとう", pronunciation: "Arigatou" },
        { english: "Goodbye", local: "さようなら", pronunciation: "Sayonara" },
        { english: "Excuse me", local: "すみません", pronunciation: "Sumimasen" },
        { english: "Yes", local: "はい", pronunciation: "Hai" },
        { english: "No", local: "いいえ", pronunciation: "Iie" },
    ],
    Dining: [
        { english: "Menu please", local: "メニューをください", pronunciation: "Menyu wo kudasai" },
        { english: "Delicious!", local: "美味しい", pronunciation: "Oishii" },
        { english: "Check please", local: "お会計", pronunciation: "Okaikei" },
        { english: "Water please", local: "お水ください", pronunciation: "Omizu kudasai" },
        { english: "I'm vegetarian", local: "ベジタリアンです", pronunciation: "Bejitarian desu" },
    ],
    Emergency: [
        { english: "Help!", local: "助けて", pronunciation: "Tasukete" },
        { english: "Hospital", local: "病院", pronunciation: "Byouin" },
        { english: "Police", local: "警察", pronunciation: "Keisatsu" },
        { english: "I'm lost", local: "道に迷いました", pronunciation: "Michi ni mayoimashita" },
        { english: "Call an ambulance", local: "救急車を呼んで", pronunciation: "Kyuukyuusha wo yonde" },
    ],
    Shopping: [
        { english: "How much?", local: "いくらですか", pronunciation: "Ikura desu ka" },
        { english: "Too expensive", local: "高すぎます", pronunciation: "Takasugimasu" },
        { english: "Can I try this?", local: "試着できますか", pronunciation: "Shichaku dekimasu ka" },
        { english: "I'll take it", local: "これをください", pronunciation: "Kore wo kudasai" },
    ],
};

export const MOCK_SEASONAL_DATA: Record<
    string,
    Array<{
        month: string;
        score: number;
        weather: string;
        crowds: string;
        price: string;
        events: string[];
    }>
> = {
    "Tokyo, Japan": [
        { month: "Jan", score: 6, weather: "Cold", crowds: "Medium", price: "Medium", events: ["New Year"] },
        { month: "Feb", score: 6, weather: "Cold", crowds: "Low", price: "Low", events: [] },
        { month: "Mar", score: 9, weather: "Mild", crowds: "High", price: "High", events: ["Cherry Blossoms"] },
        { month: "Apr", score: 10, weather: "Perfect", crowds: "High", price: "High", events: ["Cherry Blossoms", "Golden Week"] },
        { month: "May", score: 8, weather: "Warm", crowds: "Medium", price: "Medium", events: ["Golden Week"] },
        { month: "Jun", score: 5, weather: "Rainy", crowds: "Low", price: "Low", events: [] },
        { month: "Jul", score: 6, weather: "Hot & Humid", crowds: "Medium", price: "Medium", events: ["Summer Festivals"] },
        { month: "Aug", score: 6, weather: "Hot & Humid", crowds: "Medium", price: "Medium", events: [] },
        { month: "Sep", score: 7, weather: "Warm", crowds: "Medium", price: "Medium", events: [] },
        { month: "Oct", score: 9, weather: "Perfect", crowds: "Medium", price: "Medium", events: ["Autumn Leaves"] },
        { month: "Nov", score: 9, weather: "Mild", crowds: "Medium", price: "Medium", events: ["Autumn Leaves"] },
        { month: "Dec", score: 7, weather: "Cold", crowds: "High", price: "High", events: ["New Year Prep"] },
    ],
    "Bali, Indonesia": [
        { month: "Jan", score: 7, weather: "Rainy", crowds: "Low", price: "Low", events: [] },
        { month: "Feb", score: 7, weather: "Rainy", crowds: "Low", price: "Low", events: [] },
        { month: "Mar", score: 8, weather: "Transitional", crowds: "Medium", price: "Medium", events: ["Nyepi Day"] },
        { month: "Apr", score: 10, weather: "Perfect", crowds: "Medium", price: "Medium", events: [] },
        { month: "May", score: 10, weather: "Perfect", crowds: "Medium", price: "Medium", events: [] },
        { month: "Jun", score: 9, weather: "Dry & Cool", crowds: "High", price: "High", events: [] },
        { month: "Jul", score: 8, weather: "Dry", crowds: "Peak", price: "Peak", events: [] },
        { month: "Aug", score: 8, weather: "Dry", crowds: "Peak", price: "Peak", events: [] },
        { month: "Sep", score: 10, weather: "Perfect", crowds: "Medium", price: "Medium", events: [] },
        { month: "Oct", score: 8, weather: "Transitional", crowds: "Medium", price: "Medium", events: [] },
        { month: "Nov", score: 6, weather: "Rainy", crowds: "Low", price: "Low", events: [] },
        { month: "Dec", score: 6, weather: "Rainy", crowds: "Medium", price: "High", events: ["New Year"] },
    ],
};

export const MOCK_LOCAL_GUIDE: Record<
    string,
    Array<{
        name: string;
        cuisine?: string;
        category?: string;
        price: string;
        rating: number;
        distance: string;
        highlight: string;
        duration?: string;
    }>
> = {
    restaurants: [
        { name: "Sushi Masterpiece", cuisine: "Japanese", price: "$$$", rating: 4.9, distance: "0.3 km", highlight: "Omakase experience" },
        { name: "Ramen House", cuisine: "Japanese", price: "$$", rating: 4.7, distance: "0.5 km", highlight: "Best tonkotsu in town" },
        { name: "Tempura Heaven", cuisine: "Japanese", price: "$$$$", rating: 4.8, distance: "0.8 km", highlight: "Michelin recommended" },
    ],
    attractions: [
        { name: "Historic Temple", category: "Culture", price: "Free", rating: 4.8, distance: "1.2 km", highlight: "1000 years old" },
        { name: "Modern Art Museum", category: "Art", price: "$20", rating: 4.6, distance: "2.0 km", highlight: "Contemporary exhibits" },
        { name: "Central Park", category: "Nature", price: "Free", rating: 4.9, distance: "0.7 km", highlight: "Perfect for picnics" },
    ],
    activities: [
        { name: "Cooking Class", category: "Experience", price: "$80", rating: 4.9, duration: "3 hours", distance: "1.0 km", highlight: "Learn local cuisine" },
        { name: "Bike Tour", category: "Adventure", price: "$45", rating: 4.7, duration: "4 hours", distance: "0.5 km", highlight: "See hidden gems" },
        { name: "Tea Ceremony", category: "Culture", price: "$50", rating: 4.8, duration: "90 mins", distance: "1.5 km", highlight: "Traditional experience" },
    ],
};

export const MOCK_CURRENCY_RATES: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    AUD: 1.52,
    CAD: 1.36,
    CNY: 7.24,
    INR: 83.12,
    THB: 35.8,
    IDR: 15680.0,
};

export const MOCK_EMERGENCY_CONTACTS: Record<string, {
    police: string;
    ambulance: string;
    embassy: string;
    embassyPhone: string;
    tourist_police?: string;
    insurance: string;
}> = {
    Japan: {
        police: "110",
        ambulance: "119",
        embassy: "US Embassy Tokyo",
        embassyPhone: "+81-3-3224-5000",
        tourist_police: "03-3501-0110",
        insurance: "+1-800-555-1234",
    },
    Indonesia: {
        police: "110",
        ambulance: "118",
        embassy: "US Embassy Jakarta",
        embassyPhone: "+62-21-5083-1000",
        tourist_police: "021-5210101",
        insurance: "+1-800-555-1234",
    },
    France: {
        police: "17",
        ambulance: "15",
        embassy: "US Embassy Paris",
        embassyPhone: "+33-1-43-12-22-22",
        insurance: "+1-800-555-1234",
    },
    Greece: {
        police: "100",
        ambulance: "166",
        embassy: "US Embassy Athens",
        embassyPhone: "+30-210-721-2951",
        tourist_police: "171",
        insurance: "+1-800-555-1234",
    },
    UAE: {
        police: "999",
        ambulance: "998",
        embassy: "US Embassy Abu Dhabi",
        embassyPhone: "+971-2-414-2200",
        tourist_police: "800-2438",
        insurance: "+1-800-555-1234",
    },
    USA: {
        police: "911",
        ambulance: "911",
        embassy: "N/A (Domestic)",
        embassyPhone: "N/A",
        insurance: "+1-800-555-1234",
    },
};


export const MOCK_TRIP_STATS = {
    totalDays: 7,
    placesVisited: 12,
    photosCount: 248,
    distanceTraveled: "156 km",
    topExperience: "Mount Fuji Sunrise",
    averageDailySpend: 285,
    mostVisitedCategory: "Cultural Sites",
};

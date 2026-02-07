"use client";
import { motion } from "framer-motion";
import { Hotel, Star, MapPin, Wifi, Coffee, Dumbbell, Waves, Utensils, Check } from "lucide-react";
import { MOCK_HOTELS } from "@/lib/mockData";

interface Props {
    destination: string;
    checkIn?: string | null;
    checkOut?: string | null;
    guests?: number | null;
    generatedHotels?: any[];
    currency?: string;
    currencySymbol?: string;
}

const amenityIcons: Record<string, React.ReactNode> = {
    Pool: <Waves className="w-3 h-3" />,
    Spa: <span>💆</span>,
    Restaurant: <Utensils className="w-3 h-3" />,
    Gym: <Dumbbell className="w-3 h-3" />,
    WiFi: <Wifi className="w-3 h-3" />,
    Breakfast: <Coffee className="w-3 h-3" />,
    Concierge: <span>🛎️</span>,
    "Room Service": <span>🍽️</span>,
    "Rooftop Bar": <span>🍸</span>,
    Kitchen: <span>🍳</span>,
    "Common Area": <span>👥</span>,
    Locker: <span>🔐</span>,
};

export default function HotelFinder({ destination, checkIn, checkOut, guests, generatedHotels, currency = "INR", currencySymbol = "₹" }: Props) {
    // Calculate nights with fallback
    const sanitizeDate = (date?: string | null) => {
        if (!date || date === "YYYY-MM-DD" || date.includes("YYYY")) return null;
        return date;
    };

    const validCheckIn = sanitizeDate(checkIn);
    const validCheckOut = sanitizeDate(checkOut);

    const nights = (validCheckIn && validCheckOut)
        ? Math.max(1, Math.ceil((new Date(validCheckOut).getTime() - new Date(validCheckIn).getTime()) / (1000 * 60 * 60 * 24)))
        : 1;

    const hotels = generatedHotels || MOCK_HOTELS;
    const safeGuests = guests || 2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-purple-800 max-w-4xl"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                    >
                        <Hotel className="text-purple-600" />
                        Hotels in {destination}
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-sm">
                            {validCheckIn || "Check-in"} → {validCheckOut || "Check-out"}
                        </span>
                        <span className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded text-sm">
                            {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-sm">
                            {safeGuests} {safeGuests === 1 ? "guest" : "guests"}
                        </span>
                    </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {hotels.length} properties found
                </div>
            </div>

            {/* Hotel Cards */}
            <div className="space-y-4">
                {hotels.map((hotel, idx) => {
                    const totalPrice = hotel.pricePerNight * nights;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col sm:flex-row">
                                {/* Image */}
                                <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {idx === 0 && (
                                        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                            ⭐ Best Value
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        {/* Name & Stars */}
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                                    {hotel.name}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {Array.from({ length: hotel.stars }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4 fill-amber-400 text-amber-400"
                                                        />
                                                    ))}
                                                    {Array.from({ length: 5 - hotel.stars }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4 text-gray-300 dark:text-gray-600"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <MapPin className="w-4 h-4 text-purple-500" />
                                            {hotel.location}
                                        </div>

                                        {/* Amenities */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {hotel.amenities.slice(0, 5).map((amenity: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                                                >
                                                    {amenityIcons[amenity] || <Check className="w-3 h-3" />}
                                                    {amenity}
                                                </span>
                                            ))}
                                            {hotel.amenities.length > 5 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                                    +{hotel.amenities.length - 5} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-600 text-white px-2 py-1 rounded font-bold text-sm">
                                                {hotel.rating}
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Excellent • {hotel.reviews.toLocaleString()} reviews
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-center gap-2 sm:min-w-[140px] sm:border-l sm:border-gray-200 dark:sm:border-gray-700 sm:pl-4">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                {currencySymbol}{Math.floor(hotel.pricePerNight * 1.2).toLocaleString()}/night
                                            </div>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {currencySymbol}{hotel.pricePerNight.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                per night
                                            </div>
                                            <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                                Total: {currencySymbol}{totalPrice.toLocaleString()}
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
                                        >
                                            Book Now
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
            >
                <button className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                    Show all properties →
                </button>
            </motion.div>
        </motion.div>
    );
}

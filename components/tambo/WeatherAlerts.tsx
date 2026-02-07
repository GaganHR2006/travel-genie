"use client";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, Umbrella } from "lucide-react";
import { MOCK_WEATHER } from "@/lib/mockData";

interface Props {
    location: string;
}

const weatherIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    Sunny: { icon: <Sun className="w-full h-full" />, color: "text-amber-400" },
    Cloudy: { icon: <Cloud className="w-full h-full" />, color: "text-gray-400" },
    Rain: { icon: <CloudRain className="w-full h-full" />, color: "text-blue-400" },
    "Partly Cloudy": { icon: <Cloud className="w-full h-full" />, color: "text-gray-300" },
};

export default function WeatherAlerts({ location }: Props) {
    const { current, forecast } = MOCK_WEATHER;
    const currentWeather = weatherIcons[current.condition] || weatherIcons.Sunny;

    const getActivitySuggestion = () => {
        if (current.temp > 28) {
            return { emoji: "🏖️", text: "Perfect beach weather! Stay hydrated and wear sunscreen." };
        }
        if (current.temp < 15) {
            return { emoji: "☕", text: "Cool weather - great for museum visits and cozy cafes." };
        }
        if (current.condition === "Rain") {
            return { emoji: "🎭", text: "Rainy day - perfect for indoor activities and local cuisine." };
        }
        return { emoji: "🚶", text: "Ideal weather for sightseeing! Explore the city on foot." };
    };

    const activity = getActivitySuggestion();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 rounded-2xl p-6 shadow-xl border border-sky-200 dark:border-sky-800 max-w-2xl"
        >
            {/* Header */}
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4"
            >
                <Cloud className="text-sky-600" />
                Weather in {location}
            </motion.h2>

            {/* Current Weather Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl p-6 mb-4 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                    <div className={currentWeather.color}>
                        {currentWeather.icon}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-6xl font-bold">{current.temp}°</div>
                            <div className="text-xl text-sky-100 mt-1">{current.condition}</div>
                            <div className="text-sm text-sky-200 mt-1">
                                Feels like {current.feelsLike}°
                            </div>
                        </div>
                        <motion.div
                            animate={{
                                rotate: current.condition === "Sunny" ? [0, 10, -10, 0] : 0,
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`w-24 h-24 ${currentWeather.color}`}
                        >
                            {currentWeather.icon}
                        </motion.div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-sky-200" />
                            <div>
                                <div className="text-sm text-sky-200">Humidity</div>
                                <div className="font-semibold">{current.humidity}%</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wind className="w-5 h-5 text-sky-200" />
                            <div>
                                <div className="text-sm text-sky-200">Wind</div>
                                <div className="font-semibold">{current.windSpeed} km/h</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-sky-200" />
                            <div>
                                <div className="text-sm text-sky-200">UV Index</div>
                                <div className="font-semibold">{current.uvIndex}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 5-Day Forecast */}
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                5-Day Forecast
            </h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
                {forecast.map((day, idx) => {
                    const dayWeather = weatherIcons[day.condition] || weatherIcons.Sunny;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {day.day}
                            </div>
                            <div className={`w-10 h-10 mx-auto mb-2 ${dayWeather.color}`}>
                                {dayWeather.icon}
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                                {day.high}°
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {day.low}°
                            </div>
                            {day.rain > 30 && (
                                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-blue-500">
                                    <Umbrella className="w-3 h-3" />
                                    {day.rain}%
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Activity Recommendation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl p-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.emoji}</span>
                    <div>
                        <div className="font-semibold mb-1">Weather Recommendation</div>
                        <p className="text-sm text-sky-100">{activity.text}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

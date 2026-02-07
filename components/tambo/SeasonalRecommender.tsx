"use client";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Users, DollarSign, Sun, Cloud } from "lucide-react";
import { MOCK_SEASONAL_DATA } from "@/lib/mockData";

interface Props {
    destination: string;
}

export default function SeasonalRecommender({ destination }: Props) {
    const seasonalData =
        MOCK_SEASONAL_DATA[destination] || MOCK_SEASONAL_DATA["Tokyo, Japan"];

    const getScoreColor = (score: number) => {
        if (score >= 9) return "bg-emerald-500";
        if (score >= 7) return "bg-blue-500";
        if (score >= 5) return "bg-amber-500";
        return "bg-gray-400";
    };

    const getWeatherIcon = (weather: string) => {
        if (weather.includes("Cold") || weather.includes("Rainy")) return Cloud;
        if (weather.includes("Perfect") || weather.includes("Mild")) return Sun;
        return Cloud;
    };

    const bestMonths = seasonalData.filter((m) => m.score >= 9);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 rounded-2xl p-6 shadow-xl border border-teal-200 dark:border-teal-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Calendar className="text-teal-600" />
                Best Time to Visit {destination}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Plan your trip during the optimal months for weather, crowds, and
                pricing
            </p>

            {/* Best Months Highlight */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">Recommended Months</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {bestMonths.map((month, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold"
                        >
                            {month.month}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-teal-50 mt-2">
                    Perfect weather, manageable crowds, and good value for money
                </p>
            </div>

            {/* Monthly Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {seasonalData.map((month, idx) => {
                    const WeatherIcon = getWeatherIcon(month.weather);
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                            <div className="text-center">
                                <div className="font-bold text-gray-900 dark:text-white mb-2">
                                    {month.month}
                                </div>
                                <div
                                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-2 ${getScoreColor(month.score)}`}
                                >
                                    {month.score}
                                </div>
                                <WeatherIcon className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                                <div className="space-y-1 text-xs">
                                    <div className="text-gray-600 dark:text-gray-400">
                                        {month.weather}
                                    </div>
                                    {month.events.length > 0 && (
                                        <div className="text-teal-600 font-semibold truncate">
                                            {month.events[0]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Weather
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Temperature and rainfall patterns throughout the year
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Crowds
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tourist volume - avoid peak months for better experience
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Pricing
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Accommodation and flight costs vary by season
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

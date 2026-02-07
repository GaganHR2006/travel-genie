"use client";
import { motion } from "framer-motion";
import { BookOpen, Camera, DollarSign, MapPin, Calendar, Download, Share2, Heart, Star } from "lucide-react";
import { MOCK_EXPENSES, MOCK_TRIP_STATS } from "@/lib/mockData";

interface Props {
    destination: string;
    startDate: string;
    endDate: string;
    highlights: string[];
    totalExpenses: number;
}

export default function TripJournalGenerator({
    destination,
    startDate,
    endDate,
    highlights,
    totalExpenses
}: Props) {
    const stats = MOCK_TRIP_STATS;
    const expenses = MOCK_EXPENSES.map(exp => ({
        ...exp,
        amount: Math.floor((totalExpenses * exp.percentage) / 100),
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-2xl p-6 shadow-xl border border-amber-200 dark:border-amber-800 max-w-4xl"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm font-medium mb-2"
                    >
                        <Heart className="w-4 h-4 fill-amber-500" />
                        Trip Complete!
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                    >
                        <BookOpen className="text-amber-600" />
                        My {destination} Adventure
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {startDate} - {endDate}
                    </p>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-md transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </motion.button>
                </div>
            </div>

            {/* Hero Story */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700"
            >
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg first-letter:text-5xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                        What an incredible journey through <strong>{destination}</strong>! From the moment I stepped off the plane,
                        every day was filled with new discoveries, delicious food, and unforgettable experiences.
                        The blend of culture, cuisine, and adventure created memories that will last a lifetime.
                        Looking back at this trip fills me with gratitude and wanderlust for the next adventure...
                    </p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Highlights */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        Trip Highlights
                    </h3>
                    <div className="space-y-3">
                        {highlights.map((highlight, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-start gap-3 hover:shadow-md transition-shadow"
                            >
                                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
                                    {idx + 1}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{highlight}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Expense Summary */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-amber-500" />
                        Expense Summary
                    </h3>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="space-y-2 mb-4">
                            {expenses.map((expense, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                >
                                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: expense.color }}></span>
                                        {expense.category}
                                    </span>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900 dark:text-white">${expense.amount}</div>
                                        <div className="text-xs text-gray-500">{expense.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Total Spent</span>
                            <span className="text-2xl font-bold text-amber-600">${totalExpenses.toLocaleString()}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Fun Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6"
            >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    📊 Fun Trip Stats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">{stats.photosCount}</div>
                        <div className="text-sm text-amber-100">📸 Photos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{stats.placesVisited}</div>
                        <div className="text-sm text-amber-100">🗺️ Places</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{stats.distanceTraveled}</div>
                        <div className="text-sm text-amber-100">🚶 Distance</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{stats.totalDays}</div>
                        <div className="text-sm text-amber-100">📅 Days</div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 text-center">
                    <p className="text-amber-100 text-sm">
                        You averaged <strong>${stats.averageDailySpend}</strong> per day
                        with "{stats.topExperience}" as your top experience! 🌅
                    </p>
                </div>
            </motion.div>

            {/* Photo Gallery Placeholder */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-500" />
                    Memory Gallery
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((_, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                            className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                        >
                            <Camera className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </motion.div>
                    ))}
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Click to add your trip photos
                </p>
            </motion.div>
        </motion.div>
    );
}

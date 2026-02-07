"use client";
import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, Clock, TrendingUp } from "lucide-react";
import { MOCK_ITINERARY, MOCK_EXPENSES } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState } from "react";

interface Props {
    destination: string;
    days: number;
    budget: number;
    currency?: string;
    travelStyle?: "luxury" | "comfort" | "budget" | "backpacker";
    interests?: string[];
    generatedItinerary?: any[];
    generatedBudget?: any[];
}

export default function SmartItineraryPlanner({
    destination,
    days,
    budget,
    currency = "USD",
    travelStyle = "comfort",
    interests = [],
    generatedItinerary,
    generatedBudget,
}: Props) {
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const itinerary = generatedItinerary || MOCK_ITINERARY(destination, days, budget);
    const budgetData = generatedBudget || MOCK_EXPENSES;

    const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl p-4 md:p-6 shadow-xl border border-emerald-200 dark:border-emerald-800 w-full"
        >
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-3">
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                        <MapPin className="text-emerald-600 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                        <span className="truncate">{destination}</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        {days} Days • {currency} {budget.toLocaleString()} • {travelStyle}
                    </p>
                </div>
                <div className="bg-emerald-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">
                    {generatedItinerary ? "AI Generated ✨" : "Sample Plan"}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                {/* Day-by-Day Itinerary - Mobile Optimized */}
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                        Daily Plan
                    </h3>
                    <div className="space-y-3">
                        {itinerary.slice(0, 7).map((day: any, idx: number) => {
                            const isExpanded = expandedDay === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700"
                                >
                                    <button
                                        onClick={() => setExpandedDay(isExpanded ? null : idx)}
                                        className="w-full text-left"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-emerald-600 text-sm md:text-base">Day {day.day}</span>
                                            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                                {day.date || new Date(Date.now() + idx * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                    </button>

                                    <div className={`space-y-2 ${isExpanded ? "" : "max-h-20 overflow-hidden"}`}>
                                        {day.activities.map((act: any, actIdx: number) => (
                                            <div key={actIdx} className="flex items-start gap-2 text-xs md:text-sm">
                                                <Clock className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{act.time}:</span>{" "}
                                                    <span className="text-gray-600 dark:text-gray-400 break-words">{act.activity}</span>
                                                    {act.cost > 0 && (
                                                        <span className="ml-2 text-emerald-600 font-semibold whitespace-nowrap">${act.cost}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!isExpanded && (
                                        <button
                                            onClick={() => setExpandedDay(idx)}
                                            className="text-xs text-emerald-600 mt-2 hover:underline"
                                        >
                                            Show more
                                        </button>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Daily Budget:</span>
                                        <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                                            ${day.budget || Math.floor(budget / days)}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Budget Breakdown - Mobile Optimized */}
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                        Budget Allocation
                    </h3>

                    {/* Chart - Responsive */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
                        <ResponsiveContainer width="100%" height={200} className="md:!h-[250px]">
                            <PieChart>
                                <Pie
                                    data={budgetData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={false}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="amount"
                                    className="md:!outerRadius-80"
                                >
                                    {budgetData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Budget Details - Responsive */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700 space-y-2 md:space-y-3">
                        {budgetData.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                                    <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 truncate">{item.category}</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base whitespace-nowrap">${item.amount}</span>
                            </div>
                        ))}
                    </div>

                    {/* Travel Style Badge - Responsive */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                            <span className="font-semibold text-sm md:text-base">Travel Style: {travelStyle}</span>
                        </div>
                        <p className="text-xs md:text-sm text-emerald-50">
                            {generatedItinerary
                                ? "Created by AI for your preferences!"
                                : `Optimized for ${travelStyle} travelers`}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

"use client";
import { motion } from "framer-motion";
import { DollarSign, Sliders, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { useState, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
    totalBudget: number;
    destination: string;
    days: number;
}

type CategoryKey = "accommodation" | "food" | "activities" | "transport" | "shopping";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const ICONS = ["🏨", "🍽️", "🎭", "🚕", "🛍️"];

const categoryConfig: Record<CategoryKey, { label: string; icon: string; color: string }> = {
    accommodation: { label: "Accommodation", icon: "🏨", color: COLORS[0] },
    food: { label: "Food & Dining", icon: "🍽️", color: COLORS[1] },
    activities: { label: "Activities", icon: "🎭", color: COLORS[2] },
    transport: { label: "Transport", icon: "🚕", color: COLORS[3] },
    shopping: { label: "Shopping", icon: "🛍️", color: COLORS[4] },
};

export default function BudgetOptimizer({ totalBudget, destination, days }: Props) {
    const [allocation, setAllocation] = useState<Record<CategoryKey, number>>({
        accommodation: 35,
        food: 25,
        activities: 20,
        transport: 15,
        shopping: 5,
    });

    const categories = Object.keys(allocation) as CategoryKey[];
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    const remaining = 100 - total;

    const handleSliderChange = useCallback((category: CategoryKey, value: number) => {
        setAllocation(prev => ({ ...prev, [category]: value }));
    }, []);

    const chartData = categories.map((cat, idx) => ({
        name: categoryConfig[cat].label,
        value: allocation[cat],
        amount: Math.floor((totalBudget * allocation[cat]) / 100),
        color: COLORS[idx],
    }));

    const getRecommendation = () => {
        if (allocation.accommodation > 40) {
            return "💡 Consider reducing accommodation budget to explore more activities!";
        }
        if (allocation.activities < 15) {
            return "🎯 Increase activities budget to make the most of your destination!";
        }
        if (allocation.food < 20) {
            return "🍜 Food is a big part of travel - consider allocating more for local cuisine!";
        }
        if (total === 100) {
            return "✅ Perfect! Your budget is well-balanced and ready for an amazing trip!";
        }
        return "⚖️ Adjust the sliders to allocate your full budget.";
    };

    const perDay = Math.floor(totalBudget / days);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 shadow-xl border border-blue-200 dark:border-blue-800 max-w-4xl"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                    >
                        <Sliders className="text-blue-600" />
                        Budget Optimizer
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {destination} • {days} days • ~${perDay}/day
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Budget</div>
                    <div className="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</div>
                </div>
            </div>

            {/* Warning/Info Banner */}
            {total !== 100 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`rounded-lg p-3 mb-4 flex items-center gap-2 ${remaining > 0
                        ? "bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700"
                        : "bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700"
                        }`}
                >
                    <AlertCircle className={`w-5 h-5 ${remaining > 0 ? "text-amber-600" : "text-red-600"}`} />
                    <span className={`text-sm ${remaining > 0 ? "text-amber-800 dark:text-amber-200" : "text-red-800 dark:text-red-200"}`}>
                        {remaining > 0
                            ? `${remaining}% remaining - drag sliders to allocate`
                            : `${Math.abs(remaining)}% over budget - reduce allocations`
                        }
                    </span>
                </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Interactive Sliders */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Drag to Adjust
                    </h3>
                    {categories.map((category, idx) => {
                        const config = categoryConfig[category];
                        const amount = Math.floor((totalBudget * allocation[category]) / 100);

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-lg">{config.icon}</span>
                                        {config.label}
                                    </span>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 dark:text-white">${amount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">{allocation[category]}%</div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max="60"
                                        value={allocation[category]}
                                        onChange={(e) => handleSliderChange(category, parseInt(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all"
                                        style={{
                                            background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${(allocation[category] / 60) * 100}%, #e5e7eb ${(allocation[category] / 60) * 100}%, #e5e7eb 100%)`,
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>0%</span>
                                        <span>60%</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Live Chart & Recommendations */}
                <div className="space-y-4">
                    {/* Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                            Visual Breakdown
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={2}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Legend */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-2">
                            {chartData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Recommendation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`rounded-xl p-4 shadow-lg ${total === 100
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-semibold">AI Recommendation</span>
                        </div>
                        <p className="text-sm opacity-95">{getRecommendation()}</p>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-center">
                            <DollarSign className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                            <div className="text-lg font-bold text-gray-900 dark:text-white">${perDay}</div>
                            <div className="text-xs text-gray-500">per day</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-center">
                            <TrendingUp className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{total}%</div>
                            <div className="text-xs text-gray-500">allocated</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

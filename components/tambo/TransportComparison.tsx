"use client";
import { motion } from "framer-motion";
import { Train, Plane, Car, Clock, DollarSign, Leaf, TrendingUp } from "lucide-react";
import { MOCK_TRANSPORT } from "@/lib/mockData";

interface Props {
    origin: string;
    destination: string;
    date?: string;
}

export default function TransportComparison({ origin, destination, date }: Props) {
    const modes = [
        { ...MOCK_TRANSPORT.train, icon: Train, color: "blue", type: "train" },
        { ...MOCK_TRANSPORT.flight, icon: Plane, color: "purple", type: "flight" },
        { ...MOCK_TRANSPORT.car, icon: Car, color: "emerald", type: "car" },
    ];

    const bestValue = "car";
    const fastest = "flight";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="text-slate-600" />
                {origin} → {destination}
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {modes.map((mode, idx) => {
                    const Icon = mode.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg"
                        >
                            <div className="bg-blue-100 dark:bg-blue-900 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                <Icon className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{mode.name}</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Duration
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{mode.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" /> Price
                                    </span>
                                    <span className="font-bold text-blue-600">${mode.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Leaf className="w-4 h-4" /> CO₂
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{mode.co2}</span>
                                </div>
                            </div>
                            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                                Book Now
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Comparison</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>💰 Most Affordable: <span className="font-semibold">Car</span></div>
                    <div>⚡ Fastest: <span className="font-semibold">Flight</span></div>
                    <div>🌱 Most Eco-Friendly: <span className="font-semibold">Train</span></div>
                    <div>🎯 Most Flexible: <span className="font-semibold">Car</span></div>
                </div>
            </div>
        </motion.div>
    );
}

"use client";
import { motion } from "framer-motion";
import { Backpack, CheckSquare, Square } from "lucide-react";
import { useState } from "react";
import { MOCK_PACKING_LIST } from "@/lib/mockData";

interface Props {
    destination: string;
    days: number;
    season?: string;
}

export default function PackingListGenerator({
    destination,
    days,
    season = "Summer",
}: Props) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleItem = (item: string) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(item)) {
            newChecked.delete(item);
        } else {
            newChecked.add(item);
        }
        setCheckedItems(newChecked);
    };

    const categories = Object.keys(MOCK_PACKING_LIST);
    const totalItems = Object.values(MOCK_PACKING_LIST).flat().length;
    const checkedCount = checkedItems.size;
    const progress = Math.round((checkedCount / totalItems) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 rounded-2xl p-6 shadow-xl border border-rose-200 dark:border-rose-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Backpack className="text-rose-600" />
                Packing List for {destination}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {days} day trip • {season} season
            </p>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        Packing Progress
                    </span>
                    <span className="text-lg font-bold text-rose-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full"
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {checkedCount} of {totalItems} items packed
                </p>
            </div>

            {/* Packing Categories */}
            <div className="space-y-6">
                {categories.map((category, idx) => {
                    const items = MOCK_PACKING_LIST[category];
                    const categoryChecked = items.filter((item) =>
                        checkedItems.has(item)
                    ).length;

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {category}
                                </h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {categoryChecked}/{items.length}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, itemIdx) => {
                                    const isChecked = checkedItems.has(item);
                                    return (
                                        <motion.button
                                            key={itemIdx}
                                            onClick={() => toggleItem(item)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isChecked ? (
                                                <CheckSquare className="w-5 h-5 text-rose-600 flex-shrink-0" />
                                            ) : (
                                                <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                            <span
                                                className={`flex-1 ${isChecked ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                                            >
                                                {item}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Smart Recommendations */}
            <div className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl p-4">
                <h3 className="font-bold mb-2">✨ Smart Packing Tips</h3>
                <ul className="text-sm space-y-1 text-rose-50">
                    <li>
                        • Pack light - aim for carry-on only for trips under{" "}
                        {days <= 7 ? "7" : "14"} days
                    </li>
                    <li>• Roll clothes instead of folding to save space</li>
                    <li>• Bring a laundry bag for dirty clothes</li>
                    <li>• Leave room for souvenirs and purchases</li>
                </ul>
            </div>
        </motion.div>
    );
}

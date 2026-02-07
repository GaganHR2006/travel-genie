"use client";
import { motion } from "framer-motion";
import { Languages, Volume2 } from "lucide-react";
import { useState } from "react";
import { MOCK_PHRASES } from "@/lib/mockData";

type CategoryKey = keyof typeof MOCK_PHRASES;

interface Props {
    language: string;
    category?: CategoryKey;
}

export default function LanguageHelper({ language, category = "Greetings" }: Props) {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>(category);
    const categories = Object.keys(MOCK_PHRASES) as CategoryKey[];
    const phrases = MOCK_PHRASES[activeCategory];


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950 dark:to-fuchsia-950 rounded-2xl p-6 shadow-xl border border-violet-200 dark:border-violet-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Languages className="text-violet-600" />
                {language} Language Helper
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Essential phrases with pronunciation guide</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeCategory === cat
                            ? "bg-violet-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-50"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {phrases.map((phrase, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="grid md:grid-cols-3 gap-4 items-center">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">English</div>
                                <div className="font-semibold text-gray-900 dark:text-white">{phrase.english}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">{language}</div>
                                <div className="text-2xl font-bold text-violet-600">{phrase.local}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Pronunciation</div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300 italic">{phrase.pronunciation}</span>
                                    <button className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900 rounded-full">
                                        <Volume2 className="w-4 h-4 text-violet-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl p-4">
                <h3 className="font-bold mb-2">💡 Cultural Tip</h3>
                <p className="text-sm text-violet-50">
                    Locals appreciate when you try to speak their language. A smile and effort go a long way!
                </p>
            </div>
        </motion.div>
    );
}

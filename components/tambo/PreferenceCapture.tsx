"use client";
import { motion } from "framer-motion";
import { Brain, Check, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface Props {
    preferences: {
        dietary?: string[];
        budgetLevel?: "budget" | "mid" | "luxury";
        pacePreference?: "relaxed" | "moderate" | "packed";
        crowdTolerance?: "quiet" | "moderate" | "bustling";
        interests?: string[];
    };
}

export default function PreferenceCapture({ preferences }: Props) {
    useEffect(() => {
        // Save preferences to localStorage for future component customization
        if (typeof window !== "undefined") {
            const existing = localStorage.getItem("travelPreferences");
            const existingPrefs = existing ? JSON.parse(existing) : {};
            const merged = { ...existingPrefs, ...preferences };
            localStorage.setItem("travelPreferences", JSON.stringify(merged));
            console.log("Travel preferences saved:", merged);
        }
    }, [preferences]);

    const getPreferenceTags = () => {
        const tags: { icon: string; label: string }[] = [];

        if (preferences.dietary?.length) {
            preferences.dietary.forEach(d => tags.push({ icon: "🥗", label: d }));
        }
        if (preferences.budgetLevel) {
            const icons = { budget: "💰", mid: "💵", luxury: "💎" };
            tags.push({ icon: icons[preferences.budgetLevel], label: `${preferences.budgetLevel} budget` });
        }
        if (preferences.pacePreference) {
            const icons = { relaxed: "🧘", moderate: "🚶", packed: "🏃" };
            tags.push({ icon: icons[preferences.pacePreference], label: `${preferences.pacePreference} pace` });
        }
        if (preferences.crowdTolerance) {
            const icons = { quiet: "🤫", moderate: "👥", bustling: "🎉" };
            tags.push({ icon: icons[preferences.crowdTolerance], label: `${preferences.crowdTolerance} places` });
        }
        if (preferences.interests?.length) {
            preferences.interests.slice(0, 3).forEach(i => tags.push({ icon: "⭐", label: i }));
        }

        return tags;
    };

    const tags = getPreferenceTags();

    if (tags.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-xl p-4 shadow-lg max-w-md"
        >
            <div className="flex items-start gap-3">
                {/* Icon with animation */}
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                    className="bg-white/20 p-2 rounded-full flex-shrink-0"
                >
                    <Brain className="w-5 h-5" />
                </motion.div>

                <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                        Learning Your Preferences
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <Check className="w-5 h-5 text-green-300" />
                        </motion.div>
                    </div>
                    <p className="text-sm text-violet-100 mb-3">
                        I'll use these to personalize future recommendations!
                    </p>

                    {/* Preference Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                            >
                                <span>{tag.icon}</span>
                                <span>{tag.label}</span>
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Sparkle effect */}
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity
                    }}
                >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                </motion.div>
            </div>
        </motion.div>
    );
}

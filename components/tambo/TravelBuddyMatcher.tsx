"use client";
import { motion } from "framer-motion";
import { Users, ThumbsUp } from "lucide-react";

interface Props {
    groupSize?: number;
    tripType: string;
}

export default function TravelBuddyMatcher({ groupSize = 4, tripType }: Props) {
    const members = [
        { name: "Sarah", avatar: "👩", preferences: ["Adventure", "Food"], available: true },
        { name: "Mike", avatar: "👨", preferences: ["Culture", "Photography"], available: true },
        { name: "Emma", avatar: "👱‍♀️", preferences: ["Food", "Shopping"], available: false },
        { name: "James", avatar: "🧑", preferences: ["Adventure", "Nightlife"], available: true },
    ];

    const commonInterests = ["Food", "Culture"];
    const availableCount = members.filter(m => m.available).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-950 dark:to-green-950 rounded-2xl p-6 shadow-xl border border-lime-200 dark:border-lime-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Users className="text-lime-600" /> Group Trip Coordinator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{tripType} • {groupSize} travelers</p>

            <div className="bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2"><ThumbsUp className="w-5 h-5" /><span className="font-bold">Group Status</span></div>
                <p className="text-sm text-lime-50">{availableCount} of {groupSize} members confirmed • {commonInterests.length} shared interests</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                {members.map((member, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 ${member.available ? "border-lime-500" : "border-gray-200 dark:border-gray-700 opacity-60"}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="text-4xl">{member.avatar}</div>
                            <div className="flex-1">
                                <div className="font-bold text-gray-900 dark:text-white">{member.name}</div>
                                <div className={`text-xs font-semibold ${member.available ? "text-lime-600" : "text-gray-400"}`}>
                                    {member.available ? "✓ Available" : "Not confirmed"}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {member.preferences.map((pref, i) => (
                                <span key={i} className={`px-2 py-1 rounded text-xs font-semibold ${commonInterests.includes(pref) ? "bg-lime-100 dark:bg-lime-900 text-lime-700 dark:text-lime-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    }`}>{pref}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Polls</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred dates?</span>
                            <span className="text-xs text-gray-500">3/4 voted</span>
                        </div>
                        <div className="space-y-2">
                            {["June 15-22", "July 1-8"].map((option, idx) => (
                                <button key={idx} className="w-full text-left p-2 rounded-lg hover:bg-lime-50 dark:hover:bg-lime-900 flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                                    <span className="text-xs text-lime-600 font-semibold">{idx === 0 ? "75%" : "25%"}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

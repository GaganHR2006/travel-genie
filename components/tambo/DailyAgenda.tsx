"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Props {
    location: string;
    date?: string;
}

export default function DailyAgenda({ location, date }: Props) {
    const today = date || new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    const agenda = [
        { time: "09:00 AM", activity: "Breakfast at Hotel", location: "Hotel Restaurant", duration: "1h", status: "completed" },
        { time: "10:30 AM", activity: "Visit Historic Temple", location: "Old Town District", duration: "2h", status: "completed" },
        { time: "01:00 PM", activity: "Lunch at Local Market", location: "Central Market", duration: "1h", status: "current" },
        { time: "03:00 PM", activity: "Museum Tour", location: "National Museum", duration: "2.5h", status: "upcoming" },
        { time: "06:00 PM", activity: "Sunset Viewpoint", location: "Hilltop Overlook", duration: "1h", status: "upcoming" },
        { time: "07:30 PM", activity: "Dinner Reservation", location: "Rooftop Restaurant", duration: "2h", status: "upcoming" },
    ];

    const currentIndex = agenda.findIndex(item => item.status === "current");
    const nextActivity = agenda[currentIndex + 1];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950 dark:to-sky-950 rounded-2xl p-6 shadow-xl border border-cyan-200 dark:border-cyan-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Calendar className="text-cyan-600" /> Today&apos;s Agenda
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{today} • {location}</p>

            {nextActivity && (
                <div className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5" /><span className="font-bold">Up Next</span></div>
                    <h3 className="text-2xl font-bold mb-1">{nextActivity.activity}</h3>
                    <div className="flex items-center gap-4 text-sm text-cyan-50">
                        <span>⏰ {nextActivity.time}</span>
                        <span>📍 {nextActivity.location}</span>
                        <span>⌛ {nextActivity.duration}</span>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {agenda.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="relative pl-8 pb-6">
                        {idx < agenda.length - 1 && <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-300 dark:bg-gray-700" />}
                        <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 ${item.status === "completed" ? "bg-emerald-500 border-emerald-500"
                                : item.status === "current" ? "bg-cyan-500 border-cyan-500 animate-pulse"
                                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            }`} />
                        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border ${item.status === "current" ? "border-cyan-500 shadow-lg" : "border-gray-200 dark:border-gray-700"}`}>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className={`font-bold ${item.status === "completed" ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}>{item.activity}</div>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4" /><span>{item.time}</span><span>•</span><span>{item.duration}</span>
                                    </div>
                                </div>
                                {item.status === "current" && <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Now</span>}
                                {item.status === "completed" && <span className="text-emerald-500 text-xs">✓ Done</span>}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4" />{item.location}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

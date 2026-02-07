"use client";
import { motion } from "framer-motion";
import { LayoutDashboard, Plane, Hotel, Calendar, Cloud, DollarSign, MapPin, Clock, Bell } from "lucide-react";
import { MOCK_WEATHER } from "@/lib/mockData";

interface Props {
    destination: string;
    tripStartDate: string;
    daysRemaining: number;
    upcomingEvents: { title: string; time: string; type: "flight" | "hotel" | "activity" }[];
}

const eventIcons: Record<string, React.ReactNode> = {
    flight: <Plane className="w-4 h-4" />,
    hotel: <Hotel className="w-4 h-4" />,
    activity: <Calendar className="w-4 h-4" />,
};

const eventColors: Record<string, string> = {
    flight: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    hotel: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    activity: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
};

export default function TripDashboard({ destination, tripStartDate, daysRemaining, upcomingEvents }: Props) {
    const weather = MOCK_WEATHER.current;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 max-w-3xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="text-slate-600" />
                        Trip Dashboard
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{destination}</span>
                    </div>
                </motion.div>

                {/* Countdown */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg"
                >
                    <div className="text-3xl font-bold">{daysRemaining}</div>
                    <div className="text-xs text-indigo-100">days to go</div>
                </motion.div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {/* Weather */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                        <Cloud className="w-4 h-4" />
                        Weather
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{weather.temp}°C</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{weather.condition}</div>
                </motion.div>

                {/* Trip Start */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                        <Calendar className="w-4 h-4" />
                        Start Date
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{tripStartDate}</div>
                </motion.div>

                {/* Upcoming */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                        <Bell className="w-4 h-4" />
                        Events Today
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingEvents.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">scheduled</div>
                </motion.div>

                {/* Time Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                        <Clock className="w-4 h-4" />
                        Local Time
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">JST +9</div>
                </motion.div>
            </div>

            {/* Upcoming Events */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    Today's Schedule
                </h3>
                <div className="space-y-2">
                    {upcomingEvents.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className={`p-3 rounded-xl ${eventColors[event.type]}`}>
                                {eventIcons[event.type]}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{event.time}</div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${eventColors[event.type]}`}>
                                {event.type}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 grid grid-cols-3 gap-2"
            >
                {[
                    { icon: <Plane className="w-5 h-5" />, label: "Flights" },
                    { icon: <Hotel className="w-5 h-5" />, label: "Hotels" },
                    { icon: <Calendar className="w-5 h-5" />, label: "Itinerary" },
                ].map((action, idx) => (
                    <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center gap-1 py-3 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {action.icon}
                        <span className="text-xs font-medium">{action.label}</span>
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    );
}

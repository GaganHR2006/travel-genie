"use client";
import { motion } from "framer-motion";
import { Camera, Calendar, MapPin, Download } from "lucide-react";

interface Props {
    destination: string;
    photoCount?: number;
}

export default function PhotoGalleryOrganizer({ destination, photoCount = 124 }: Props) {
    const days = [
        { day: "Day 1", date: "March 15", location: "Tokyo Tower & Shibuya", photos: 28, thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
        { day: "Day 2", date: "March 16", location: "Senso-ji Temple & Asakusa", photos: 35, thumbnail: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400" },
        { day: "Day 3", date: "March 17", location: "Mount Fuji Day Trip", photos: 42, thumbnail: "https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=400" },
        { day: "Day 4", date: "March 18", location: "Harajuku & Shinjuku", photos: 19, thumbnail: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 rounded-2xl p-6 shadow-xl border border-pink-200 dark:border-pink-800"
        >
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Camera className="text-pink-600" /> Trip Photo Gallery
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{destination} • {photoCount} photos</p>
                </div>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
                    <Download className="w-4 h-4" /> Download All
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-3xl font-bold text-pink-600">{photoCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Photos</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-3xl font-bold text-pink-600">{days.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Days Covered</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-3xl font-bold text-pink-600">8</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Locations</div>
                </div>
            </div>

            <div className="space-y-4">
                {days.map((day, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="flex gap-4">
                            <img src={day.thumbnail} alt={day.location} className="w-32 h-32 object-cover" />
                            <div className="flex-1 p-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{day.day}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{day.date}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{day.location}</span>
                                    <span className="flex items-center gap-1"><Camera className="w-4 h-4" />{day.photos} photos</span>
                                </div>
                                <button className="text-sm text-pink-600 hover:text-pink-700 font-semibold">View Album →</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-4">
                <h3 className="font-bold mb-2">📸 Photo Highlight</h3>
                <p className="text-sm text-pink-50">Your most popular photo: Sunset at Mount Fuji (42 likes) - captured on Day 3</p>
            </div>
        </motion.div>
    );
}

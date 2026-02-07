"use client";
import { motion } from "framer-motion";
import { CheckCircle, Plane, Hotel, Calendar, MapPin, Download, QrCode, Clock } from "lucide-react";

interface Props {
    bookingType: "flight" | "hotel" | "activity";
    confirmationNumber: string;
    details: {
        title: string;
        date: string;
        time?: string;
        location?: string;
        passengers?: number;
        roomType?: string;
        checkIn?: string;
        checkOut?: string;
    };
    totalPrice: number;
}

export default function BookingConfirmation({ bookingType, confirmationNumber, details, totalPrice }: Props) {
    const getBookingIcon = () => {
        switch (bookingType) {
            case "flight": return <Plane className="w-6 h-6" />;
            case "hotel": return <Hotel className="w-6 h-6" />;
            default: return <Calendar className="w-6 h-6" />;
        }
    };

    const getGradient = () => {
        switch (bookingType) {
            case "flight": return "from-blue-500 to-indigo-500";
            case "hotel": return "from-purple-500 to-pink-500";
            default: return "from-amber-500 to-orange-500";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-md border border-gray-200 dark:border-gray-800"
        >
            {/* Success Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-gradient-to-r ${getGradient()} p-6 text-white text-center relative overflow-hidden`}
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="relative z-10"
                >
                    <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Booking Confirmed!</h2>
                    <p className="text-white/80 text-sm">Your {bookingType} has been booked successfully</p>
                </motion.div>
            </motion.div>

            {/* Confirmation Details */}
            <div className="p-6 space-y-4">
                {/* Confirmation Number */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center"
                >
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Confirmation Number
                    </div>
                    <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-widest">
                        {confirmationNumber}
                    </div>
                </motion.div>

                {/* Booking Details */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                >
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getGradient()} text-white`}>
                            {getBookingIcon()}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white text-lg">{details.title}</div>
                            {details.location && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {details.location}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                                <Calendar className="w-3 h-3" />
                                Date
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">{details.date}</div>
                        </div>
                        {details.time && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                                    <Clock className="w-3 h-3" />
                                    Time
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-white">{details.time}</div>
                            </div>
                        )}
                    </div>

                    {/* Hotel specific */}
                    {bookingType === "hotel" && details.checkIn && (
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex-1 text-center border-r border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Check-in</div>
                                <div className="font-semibold text-gray-900 dark:text-white">{details.checkIn}</div>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Check-out</div>
                                <div className="font-semibold text-gray-900 dark:text-white">{details.checkOut}</div>
                            </div>
                        </div>
                    )}

                    {details.roomType && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Room Type</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{details.roomType}</div>
                        </div>
                    )}

                    {details.passengers && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Passengers</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{details.passengers} travelers</div>
                        </div>
                    )}
                </motion.div>

                {/* Total Price */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                    <span className="text-gray-600 dark:text-gray-400">Total Paid</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${totalPrice.toLocaleString()}</span>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-3 pt-2"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <QrCode className="w-5 h-5" />
                        Show QR
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center gap-2 py-3 bg-gradient-to-r ${getGradient()} text-white font-semibold rounded-xl shadow-lg`}
                    >
                        <Download className="w-5 h-5" />
                        Download
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}

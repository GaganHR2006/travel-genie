"use client";
import { motion } from "framer-motion";
import {
    FileText,
    CheckCircle,
    AlertCircle,
    Clock,
    DollarSign,
    MapPin,
} from "lucide-react";
import { MOCK_VISA_INFO } from "@/lib/mockData";

interface Props {
    destination: string;
    nationality?: string;
}

export default function VisaRequirementChecker({
    destination,
    nationality = "US",
}: Props) {
    const countryKey = destination.split(",").pop()?.trim() || destination;
    const visaInfo = MOCK_VISA_INFO[countryKey] || MOCK_VISA_INFO["Japan"];

    const statusConfig: Record<
        string,
        { color: string; icon: typeof CheckCircle; badge: string }
    > = {
        "Visa-Free": {
            color: "emerald",
            icon: CheckCircle,
            badge: "✅ No Visa Required",
        },
        "Visa on Arrival": {
            color: "blue",
            icon: CheckCircle,
            badge: "✈️ Visa on Arrival",
        },
        eVisa: { color: "amber", icon: AlertCircle, badge: "📱 eVisa Required" },
        "Visa Required": {
            color: "red",
            icon: AlertCircle,
            badge: "📄 Visa Required",
        },
        "Schengen Visa": {
            color: "purple",
            icon: AlertCircle,
            badge: "🇪🇺 Schengen Visa",
        },
    };

    const config = statusConfig[visaInfo.type] || statusConfig["Visa Required"];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-6 shadow-xl border border-indigo-200 dark:border-indigo-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="text-indigo-600" />
                Visa Requirements for {destination}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                For {nationality} passport holders
            </p>

            {/* Status Badge */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-6 flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <div className="text-3xl font-bold mb-1">{config.badge}</div>
                    <p className="text-sm opacity-90">{visaInfo.description}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Duration
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                        {visaInfo.duration}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Stay period
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Cost
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                        {visaInfo.cost === 0 ? "Free" : `$${visaInfo.cost}`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Visa fee
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Processing
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                        {visaInfo.processingDays === 0
                            ? "Instant"
                            : `${visaInfo.processingDays} days`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Typical wait time
                    </p>
                </div>
            </div>

            {/* Required Documents */}
            {visaInfo.documents && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Required Documents
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        {visaInfo.documents.map((doc: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{doc}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Embassy Info */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Embassy Contact</span>
                </div>
                <p className="text-sm text-indigo-50">
                    Contact the {destination} embassy in your country for the most
                    up-to-date visa requirements and application process.
                </p>
            </div>
        </motion.div>
    );
}

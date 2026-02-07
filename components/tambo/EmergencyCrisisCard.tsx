"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, FileText, Shield, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { MOCK_EMERGENCY_CONTACTS } from "@/lib/mockData";

interface Props {
    emergencyType: "lost_passport" | "missed_flight" | "medical" | "theft" | "general";
    location?: string;
}

const emergencyData = {
    lost_passport: {
        title: "Lost Passport Emergency",
        subtitle: "Don't panic - follow these steps",
        color: "red",
        icon: FileText,
        steps: [
            "Report to local police station immediately - get a written report",
            "Contact your country's embassy or consulate",
            "File a passport loss report online (if available)",
            "Bring police report + 2 ID photos to embassy",
            "Apply for emergency travel document",
            "Keep digital copies of all documents safe",
        ],
    },
    missed_flight: {
        title: "Missed Flight Crisis",
        subtitle: "Time-sensitive - act quickly",
        color: "orange",
        icon: AlertTriangle,
        steps: [
            "Go to airline customer service desk immediately",
            "Check rebooking options on the next available flight",
            "Ask about standby possibilities (often free)",
            "Check if travel insurance covers rebooking fees",
            "Book nearby hotel if overnight wait is required",
            "Keep all receipts for potential reimbursement",
        ],
    },
    medical: {
        title: "Medical Emergency",
        subtitle: "Your health is the priority",
        color: "red",
        icon: Shield,
        steps: [
            "Call local emergency number for ambulance",
            "Contact travel insurance 24/7 hotline",
            "Go to nearest hospital (ask hotel concierge)",
            "Keep insurance documents readily accessible",
            "Contact embassy if situation is serious",
            "Document all medical care received",
        ],
    },
    theft: {
        title: "Theft / Robbery Report",
        subtitle: "Secure yourself, then report",
        color: "amber",
        icon: AlertTriangle,
        steps: [
            "Ensure your personal safety first",
            "Report to police immediately - get written report",
            "Cancel all stolen credit/debit cards",
            "Contact travel insurance to file claim",
            "Report passport theft to embassy if applicable",
            "Check with hotel security for CCTV footage",
        ],
    },
    general: {
        title: "Emergency Assistance",
        subtitle: "Help is available",
        color: "red",
        icon: AlertTriangle,
        steps: [
            "Stay calm and assess the situation",
            "Move to a safe location if needed",
            "Contact local emergency services",
            "Reach out to your embassy/consulate",
            "Contact travel insurance provider",
            "Inform family/friends of your situation",
        ],
    },
};

export default function EmergencyCrisisCard({ emergencyType, location = "Current Location" }: Props) {
    const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

    // Defensive check - fallback to 'general' if emergencyType isn't valid
    const emergency = emergencyData[emergencyType] || emergencyData.general;
    const Icon = emergency.icon;

    // Try to get country-specific contacts
    const getCountryFromLocation = (loc: string) => {
        if (loc.toLowerCase().includes("japan") || loc.toLowerCase().includes("tokyo")) return "Japan";
        if (loc.toLowerCase().includes("france") || loc.toLowerCase().includes("paris")) return "France";
        if (loc.toLowerCase().includes("indonesia") || loc.toLowerCase().includes("bali")) return "Indonesia";
        if (loc.toLowerCase().includes("greece") || loc.toLowerCase().includes("santorini")) return "Greece";
        if (loc.toLowerCase().includes("usa") || loc.toLowerCase().includes("new york")) return "USA";
        return "Japan"; // Default
    };

    const country = getCountryFromLocation(location);
    const contacts = MOCK_EMERGENCY_CONTACTS[country] || MOCK_EMERGENCY_CONTACTS.Japan;

    const handleCopyNumber = (number: string) => {
        navigator.clipboard.writeText(number);
        setCopiedNumber(number);
        setTimeout(() => setCopiedNumber(null), 2000);
    };

    const colorClasses = {
        red: {
            bg: "from-red-600 to-rose-700",
            border: "border-red-400",
            badge: "bg-red-500",
        },
        orange: {
            bg: "from-orange-500 to-amber-600",
            border: "border-orange-400",
            badge: "bg-orange-500",
        },
        amber: {
            bg: "from-amber-500 to-yellow-600",
            border: "border-amber-400",
            badge: "bg-amber-500",
        },
    };

    const colors = colorClasses[emergency.color as keyof typeof colorClasses];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className={`bg-gradient-to-br ${colors.bg} text-white rounded-2xl p-6 shadow-2xl border-2 ${colors.border} max-w-4xl`}
        >
            {/* Alert Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-4 mb-6"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 2
                    }}
                    className="bg-white/20 p-4 rounded-full backdrop-blur-sm"
                >
                    <Icon className="w-8 h-8" />
                </motion.div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`${colors.badge} px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider`}
                        >
                            🚨 Emergency
                        </motion.span>
                    </div>
                    <h2 className="text-2xl font-bold">{emergency.title}</h2>
                    <p className="text-white/80 text-sm">{emergency.subtitle}</p>
                </div>
            </motion.div>

            {/* Location Badge */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6 flex items-center gap-2"
            >
                <MapPin className="w-5 h-5 text-white/80" />
                <span className="font-medium">📍 {location}</span>
                <span className="text-white/60 text-sm ml-auto">Emergency services for {country}</span>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Steps */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Immediate Steps
                    </h3>
                    <div className="space-y-2">
                        {emergency.steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.08 }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-start gap-3 hover:bg-white/15 transition-colors"
                            >
                                <div className="bg-white text-red-600 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
                                    {idx + 1}
                                </div>
                                <p className="text-sm leading-relaxed">{step}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Emergency Contacts
                    </h3>
                    <div className="space-y-3">
                        {/* Police */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white text-gray-900 rounded-xl p-4 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm text-gray-600">🚔 Police</span>
                                <button
                                    onClick={() => handleCopyNumber(contacts.police)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {copiedNumber === contacts.police ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <a
                                href={`tel:${contacts.police}`}
                                className="text-3xl font-bold text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors"
                            >
                                <Phone className="w-6 h-6" />
                                {contacts.police}
                            </a>
                        </motion.div>

                        {/* Ambulance */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white text-gray-900 rounded-xl p-4 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm text-gray-600">🚑 Ambulance</span>
                                <button
                                    onClick={() => handleCopyNumber(contacts.ambulance)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {copiedNumber === contacts.ambulance ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <a
                                href={`tel:${contacts.ambulance}`}
                                className="text-3xl font-bold text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors"
                            >
                                <Phone className="w-6 h-6" />
                                {contacts.ambulance}
                            </a>
                        </motion.div>

                        {/* Embassy */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white text-gray-900 rounded-xl p-4 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm text-gray-600">🏛️ Embassy</span>
                                <button
                                    onClick={() => handleCopyNumber(contacts.embassy)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {copiedNumber === contacts.embassy ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <a
                                href={`tel:${contacts.embassy}`}
                                className="text-xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                {contacts.embassy}
                            </a>
                        </motion.div>

                        {/* Insurance Reminder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5" />
                                <span className="font-semibold">Travel Insurance 24/7</span>
                            </div>
                            <p className="text-sm opacity-90 mb-2">
                                Most policies provide emergency assistance around the clock
                            </p>
                            <a
                                href={`tel:${contacts.insurance}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                {contacts.insurance}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Alert */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-center"
            >
                <p className="text-sm opacity-90">
                    💡 <span className="font-semibold">Pro tip:</span> Take screenshots of this card for offline access
                </p>
            </motion.div>
        </motion.div>
    );
}

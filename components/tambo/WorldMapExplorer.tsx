"use client";
import React, { memo } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation,
} from "react-simple-maps";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

// URL to topojson file
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
    onDestinationClick?: (destination: string) => void;
}

const DESTINATIONS = [
    { name: "Tokyo", coordinates: [139.6917, 35.6895], country: "Japan" },
    { name: "Paris", coordinates: [2.3522, 48.8566], country: "France" },
    { name: "Santorini", coordinates: [25.4317, 36.3932], country: "Greece" },
    { name: "Dubai", coordinates: [55.2708, 25.2048], country: "UAE" },
    { name: "Bali", coordinates: [115.1889, -8.4095], country: "Indonesia" },
    { name: "New York", coordinates: [-74.006, 40.7128], country: "USA" },
];

// Earth tone palette for the wooden map look
const COLORS = [
    "#8B7355", // dark wood
    "#A67C52", // medium wood
    "#C9A66B", // light wood
    "#D4B896", // very light wood
    "#5D4037", // very dark wood
    "#3E2723", // almost black wood
];

// Consistent coloring based on geography name length
const getColor = (geo: any) => {
    const name = geo.properties.name || "Unknown";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
};

const WorldMapExplorer = ({ onDestinationClick }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d5] border border-[#d4b896]"
        >
            <div className="p-4 md:p-6 pb-0">
                <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🌍</div>
                    <div>
                        <h2 className="text-xl font-bold text-[#3E2723]">Explore the World</h2>
                        <p className="text-sm text-[#5D4037]">Click a destination to start planning</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-[300px] md:h-[450px] relative">
                {/* Amber Glow Background Filter */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: "radial-gradient(circle at center, rgba(245, 166, 35, 0.15) 0%, transparent 70%)"
                    }}
                />

                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 140,
                        center: [10, 30] // Focus on Europe/Africa/Asia/Americas roughly
                    }}
                    className="w-full h-full"
                    style={{ width: "100%", height: "100%" }}
                >
                    {/* Amber Glow SVG Filter */}
                    <defs>
                        <filter id="woodGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feFlood floodColor="#f59e0b" floodOpacity="0.4" result="color" />
                            <feComposite in="color" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const isHighlighted = ["United States of America", "Russia", "China", "Brazil", "Australia", "India"].includes(geo.properties.name);

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        filter="url(#woodGlow)"
                                        fill={getColor(geo)}
                                        stroke="#5D4037"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none", transition: "all 0.3s" },
                                            hover: { fill: "#f59e0b", outline: "none", filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))", transform: "scale(1.01)" },
                                            pressed: { fill: "#E42", outline: "none" },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {/* Major Country Labels */}
                    {[
                        { name: "RUSSIA", coordinates: [100, 60] },
                        { name: "USA", coordinates: [-100, 40] },
                        { name: "BRAZIL", coordinates: [-55, -10] },
                        { name: "CHINA", coordinates: [105, 35] },
                        { name: "AUSTRALIA", coordinates: [135, -25] },
                        { name: "AFRICA", coordinates: [20, 10] }, // Continent label approximate
                    ].map((label) => (
                        <Annotation
                            key={label.name}
                            subject={label.coordinates as [number, number]}
                            dx={0}
                            dy={0}
                            connectorProps={{ stroke: "none" }}
                        >
                            <text
                                x={0}
                                y={0}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fill="#3E2723" // Dark wood color
                                fontSize={10}
                                fontWeight="bold"
                                style={{ pointerEvents: "none", letterSpacing: "2px", opacity: 0.7 }}
                            >
                                {label.name}
                            </text>
                        </Annotation>
                    ))}

                    {/* Destination Markers */}
                    {DESTINATIONS.map(({ name, coordinates, country }) => (
                        <Marker key={name} coordinates={coordinates as [number, number]}>
                            <g
                                className="cursor-pointer group"
                                onClick={() => onDestinationClick?.(`${name}, ${country}`)}
                                style={{ transform: "translate(-12px, -24px)" }}
                            >
                                {/* Pulse Effect */}
                                <circle r={8} fill="#ef4444" opacity={0.3}>
                                    <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                                </circle>

                                {/* Pin Icon */}
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                    fill="#ef4444"
                                    stroke="#fff"
                                    strokeWidth={2}
                                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                                />
                                <circle cx="12" cy="9" r="2.5" fill="#fff" />

                                {/* Tooltip on Hover */}
                                <foreignObject x="-60" y="-45" width="150" height="50" style={{ overflow: "visible" }}>
                                    <div className="hidden group-hover:block bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-xs font-bold text-gray-800 border border-amber-200 text-center whitespace-nowrap absolute left-1/2 -translate-x-1/2 bottom-0 w-auto">
                                        {name}
                                        <div className="text-[10px] font-normal text-gray-600">{country}</div>
                                    </div>
                                </foreignObject>
                            </g>
                        </Marker>
                    ))}
                </ComposableMap>

                {/* Decorative Compass Rose */}
                <div className="absolute bottom-4 left-4 pointer-events-none opacity-60 scale-75 origin-bottom-left">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#5D4037" strokeWidth="1" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#5D4037" strokeWidth="0.5" />
                        <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#5D4037" />
                        <text x="50" y="8" textAnchor="middle" fontSize="10" fill="#3E2723" fontWeight="bold">N</text>
                        <text x="50" y="98" textAnchor="middle" fontSize="10" fill="#3E2723">S</text>
                        <text x="96" y="53" textAnchor="middle" fontSize="10" fill="#3E2723">E</text>
                        <text x="4" y="53" textAnchor="middle" fontSize="10" fill="#3E2723">W</text>
                    </svg>
                </div>
            </div>

            <div className="text-center pb-4 text-[#8B7355] text-xs">
                <p>✨ Select a destination to begin your journey</p>
            </div>
        </motion.div>
    );
};

export default memo(WorldMapExplorer);

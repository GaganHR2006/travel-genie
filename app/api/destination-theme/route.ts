// app/api/destination-theme/route.ts - WORKING IMAGE FETCHING
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

// Fallback images for popular destinations
const FALLBACK_IMAGES: Record<string, string> = {
    karnataka: "https://images.unsplash.com/photo-1588408708726-d3cd2d6e8ab8?w=1920&q=80", // Mysore Palace
    bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1920&q=80",
    mysore: "https://images.unsplash.com/photo-1588408708726-d3cd2d6e8ab8?w=1920&q=80",
    hampi: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1920&q=80",
    coorg: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1920&q=80",

    tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80",
    paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
    bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
    dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80",
    london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80",
    newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80",
    maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=80",
    santorini: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=80",

    kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
    goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80",
    rajasthan: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80",
    jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80",
    agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80",
    delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80",
    mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&q=80",

    default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
};

function getFallbackImage(destination: string): string {
    const normalized = destination.toLowerCase().trim();

    // Check direct matches
    for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return url;
        }
    }

    return FALLBACK_IMAGES.default;
}

export async function POST(request: NextRequest) {
    try {
        const { destination } = await request.json();

        // Generate theme with AI
        const themePrompt = `For destination "${destination}", provide a travel theme.

Respond with ONLY this JSON (no markdown, no code blocks):
{
  "searchQuery": "specific 2-3 word landmark (e.g., 'mysore palace', 'eiffel tower', 'tokyo shibuya')",
  "primaryColor": "#hexcode",
  "accentColor": "#hexcode",
  "gradient": "from-COLOR-600 via-COLOR-600 to-COLOR-600",
  "emojis": ["🏛️", "🕌"],
  "vibe": "3 descriptive words",
  "particleColor": "#hexcode"
}

Examples:
Karnataka → {"searchQuery": "mysore palace karnataka", "primaryColor": "#f59e0b", "accentColor": "#dc2626", "gradient": "from-amber-600 via-orange-600 to-red-600", "emojis": ["🕌", "🏛️"], "vibe": "historic temple serene", "particleColor": "#f59e0b"}
Tokyo → {"searchQuery": "tokyo tower shibuya", "primaryColor": "#ec4899", "accentColor": "#a855f7", "gradient": "from-pink-600 via-purple-600 to-indigo-600", "emojis": ["🗼", "🌸"], "vibe": "neon modern vibrant", "particleColor": "#ec4899"}`;

        const themeResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: themePrompt }],
            temperature: 0.7,
            max_tokens: 500,
        });

        const content = themeResponse.choices[0]?.message?.content || "{}";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        let theme;

        try {
            theme = JSON.parse(cleaned);
        } catch (e) {
            console.error("Theme parse error:", e);
            throw new Error("Failed to parse theme");
        }

        // Try Pexels API first (FREE, no credit card needed)
        let imageUrl = getFallbackImage(destination);

        if (process.env.PEXELS_API_KEY) {
            try {
                const pexelsResponse = await fetch(
                    `https://api.pexels.com/v1/search?query=${encodeURIComponent(theme.searchQuery)}&per_page=1&orientation=landscape`,
                    {
                        headers: {
                            Authorization: process.env.PEXELS_API_KEY,
                        },
                    }
                );

                if (pexelsResponse.ok) {
                    const data = await pexelsResponse.json();
                    if (data.photos && data.photos[0]) {
                        imageUrl = data.photos[0].src.large2x;
                    }
                }
            } catch (error) {
                console.log("Pexels failed, using fallback");
            }
        }

        // Try Unsplash as secondary option
        if (imageUrl === getFallbackImage(destination) && process.env.UNSPLASH_ACCESS_KEY) {
            try {
                const unsplashResponse = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(theme.searchQuery)}&per_page=1&orientation=landscape`,
                    {
                        headers: {
                            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
                        },
                    }
                );

                if (unsplashResponse.ok) {
                    const data = await unsplashResponse.json();
                    if (data.results && data.results[0]) {
                        imageUrl = data.results[0].urls.regular;
                    }
                }
            } catch (error) {
                console.log("Unsplash failed, using fallback");
            }
        }

        console.log(`Image for ${destination}:`, imageUrl);

        return NextResponse.json({
            ...theme,
            backgroundImage: imageUrl,
            destination: destination,
        });

    } catch (error: any) {
        console.error("Theme generation error:", error);

        // Complete fallback
        const destination = "World";
        return NextResponse.json({
            searchQuery: "world travel",
            primaryColor: "#6366f1",
            accentColor: "#a855f7",
            gradient: "from-indigo-600 via-purple-600 to-pink-600",
            emojis: ["🌍", "✈️"],
            vibe: "adventure exploration discovery",
            particleColor: "#6366f1",
            backgroundImage: FALLBACK_IMAGES.default,
            destination: destination,
        });
    }
}

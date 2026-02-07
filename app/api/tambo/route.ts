// app/api/tambo/route.ts - USING GROQ API with CURRENCY SUPPORT
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// Currency symbols map
const CURRENCY_SYMBOLS: Record<string, string> = {
  "INR": "₹", "USD": "$", "EUR": "€", "GBP": "£", "JPY": "¥",
  "AUD": "A$", "CAD": "C$", "AED": "د.إ", "SGD": "S$", "THB": "฿"
};

// Reliable hotel images from Unsplash
const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
];

async function callGroqWithRetry(prompt: string, retries = 0): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stream: false,
      stop: null
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error: any) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return callGroqWithRetry(prompt, retries + 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, registry, tripDetails } = await request.json();

    // Extract currency from trip details
    const currency = tripDetails?.currency || "INR";
    const currencySymbol = CURRENCY_SYMBOLS[currency] || "₹";
    const budget = tripDetails?.budget || 10000;
    const destination = tripDetails?.destination || "";
    const days = tripDetails?.days || 5;

    // Build conversation history for context
    const conversationHistory = context ? `Previous conversation:\n${context}\n\n` : "";

    // UNIFIED PROMPT - Always check for component triggers
    const unifiedPrompt = `You are Travel Genie AI. Analyze the user's message and decide which component(s) to render.

IMPORTANT: The user's currency is ${currency} (${currencySymbol}). ALL PRICES MUST BE IN ${currency} ONLY.
User's destination: ${destination}
User's budget: ${currencySymbol}${budget} ${currency}
Trip duration: ${days} days

${conversationHistory}USER MESSAGE: "${message}"

AVAILABLE COMPONENTS:
${registry.map((r: any) => `- ${r.name}: ${r.description}`).join("\n")}

CRITICAL COMPONENT TRIGGER RULES:
1. "show me hotels" / "find hotels" / "where to stay" / "accommodation" → HotelFinder
2. "show flights" / "find flights" / "book flight" → FlightFinder  
3. "weather" / "temperature" / "will it rain" → WeatherAlerts
4. "convert currency" / "exchange rate" / "how much is X in Y" → CurrencyConverter
5. "visa" / "do I need visa" / "visa requirements" → VisaRequirementChecker
6. "what to pack" / "packing list" → PackingListGenerator
7. "how to say" / "translate" / "language help" / "phrases" → LanguageHelper
8. "how to get from X to Y" / "transport" / "train vs flight" → TransportComparison
9. Initial trip planning (budget + days + destination) → SmartItineraryPlanner

IMPORTANT: 
- If user asks for hotels, you MUST use HotelFinder component
- If user asks for weather, you MUST use WeatherAlerts component
- If just chatting/asking general questions → conversational response only (no component)
- For trip planning questions → SmartItineraryPlanner component
- ALWAYS USE ${currency} for all prices!

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "message": "Brief response to user",
  "components": [
    {
      "name": "ComponentName",
      "needsGeneration": true/false,
      "props": { "required": "props", "from": "user message" }
    }
  ]
}

If no component needed, use empty array: "components": []`;

    const textResponse = await callGroqWithRetry(unifiedPrompt);

    let aiResponse;
    try {
      try {
        aiResponse = JSON.parse(textResponse);
      } catch (e) {
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in main response");
        }
      }

      console.log("AI Response:", JSON.stringify(aiResponse, null, 2));
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", textResponse);

      // Fallback to conversational response
      return NextResponse.json({
        message: textResponse || "I'm here to help! What would you like to know?",
        components: [],
      });
    }

    // PHASE 2: Generate dynamic content for components that need it
    if (aiResponse.components && aiResponse.components.length > 0) {
      for (let comp of aiResponse.components) {

        // Normalize SmartItineraryPlanner props
        if (comp.name === "SmartItineraryPlanner") {
          // Fix 'duration' -> 'days' and extract numeric values
          const rawDays = comp.props.days || comp.props.duration || days;
          const rawBudget = comp.props.budget || budget;

          // Extract numeric value from strings like "5 days" or "₹10000"
          const extractNumber = (val: any): number => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              const match = val.replace(/[^\d.]/g, '');
              return parseFloat(match) || 0;
            }
            return 0;
          };

          comp.props.days = extractNumber(rawDays) || days;
          comp.props.budget = extractNumber(rawBudget) || budget;
          comp.props.destination = comp.props.destination || destination;
          comp.props.currency = currency;
          comp.props.currencySymbol = currencySymbol;
          delete comp.props.duration; // Remove incorrect prop
        }

        // Normalize HotelFinder props
        if (comp.name === "HotelFinder") {
          comp.props.destination = comp.props.destination || destination;
          comp.props.currency = currency;
          comp.props.currencySymbol = currencySymbol;
        }

        // Generate itinerary if needed
        if (comp.needsGeneration && comp.name === "SmartItineraryPlanner") {
          const itineraryDays = comp.props.days;
          const itineraryBudget = comp.props.budget;
          const itineraryDestination = comp.props.destination;

          const itineraryPrompt = `Create a UNIQUE ${itineraryDays}-day itinerary for ${itineraryDestination} with ${currencySymbol}${itineraryBudget} ${currency} budget.

CRITICAL: ALL COSTS MUST BE IN ${currency} (${currencySymbol}) ONLY. NO OTHER CURRENCY.

Rules:
- Each day must have 3 COMPLETELY DIFFERENT activities (morning, afternoon, evening)
- NO REPEATED ACTIVITIES across all days
- Include REALISTIC costs in ${currency} for each activity
- Use actual place names when possible
- Costs should be reasonable for ${itineraryDestination} in ${currency}

Respond with ONLY this JSON (no markdown):
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "time": "Morning", "activity": "Activity name", "cost": 500 },
        { "time": "Afternoon", "activity": "Activity name", "cost": 800 },
        { "time": "Evening", "activity": "Activity name", "cost": 1200 }
      ]
    }
  ],
  "budgetBreakdown": [
    { "category": "Accommodation", "amount": ${Math.floor(itineraryBudget * 0.35)}, "percentage": 35 },
    { "category": "Food & Dining", "amount": ${Math.floor(itineraryBudget * 0.25)}, "percentage": 25 },
    { "category": "Activities", "amount": ${Math.floor(itineraryBudget * 0.20)}, "percentage": 20 },
    { "category": "Transportation", "amount": ${Math.floor(itineraryBudget * 0.15)}, "percentage": 15 },
    { "category": "Shopping", "amount": ${Math.floor(itineraryBudget * 0.05)}, "percentage": 5 }
  ]
}`;

          const itineraryText = await callGroqWithRetry(itineraryPrompt);

          try {
            let generated;
            try {
              generated = JSON.parse(itineraryText);
            } catch (e) {
              const jsonMatch = itineraryText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                generated = JSON.parse(jsonMatch[0]);
              } else {
                throw new Error("No JSON found in response");
              }
            }

            comp.props.generatedItinerary = generated.itinerary;
            comp.props.generatedBudget = generated.budgetBreakdown;
            comp.props.currency = currency;
            comp.props.currencySymbol = currencySymbol;
          } catch (e) {
            console.error("Itinerary generation error:", e);
          }
        }

        // Generate hotels if needed
        if (comp.name === "HotelFinder") {
          const hotelDestination = comp.props.destination || destination;

          const hotelPrompt = `Find 4 REAL and highly-rated hotels in ${hotelDestination}.

CRITICAL: ALL PRICES MUST BE IN ${currency} (${currencySymbol}) ONLY. 

For ${currency}, use REALISTIC local prices:
- Budget hotels: ${currency === "INR" ? "₹1500-3000" : currency === "USD" ? "$50-100" : "€50-100"} per night
- Mid-range: ${currency === "INR" ? "₹3000-6000" : currency === "USD" ? "$100-200" : "€100-200"} per night
- Luxury: ${currency === "INR" ? "₹8000-20000" : currency === "USD" ? "$200-500" : "€200-500"} per night

Rules:
- Provide a mix of luxury, boutique, and budget options
- REAL hotel names for ${hotelDestination}
- All prices in ${currency} ONLY
- 1 "Best Value" option
- 1 "Luxury" option

Respond with ONLY this JSON (no markdown):
{
  "hotels": [
    {
      "name": "Hotel Name",
      "stars": 4,
      "pricePerNight": 3500,
      "originalPrice": 4500,
      "location": "Area Name",
      "amenities": ["Pool", "WiFi", "Spa"],
      "rating": 4.5,
      "reviews": 1200
    }
  ]
}`;

          try {
            const hotelText = await callGroqWithRetry(hotelPrompt);
            let generated;
            try {
              generated = JSON.parse(hotelText);
            } catch (e) {
              const jsonMatch = hotelText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                generated = JSON.parse(jsonMatch[0]);
              } else {
                throw new Error("No JSON found");
              }
            }

            if (generated.hotels) {
              console.log(`Generated ${generated.hotels.length} hotels for ${hotelDestination}`);

              // Force reliable images and ensure currency
              generated.hotels = generated.hotels.map((h: any, i: number) => ({
                ...h,
                image: HOTEL_IMAGES[i % HOTEL_IMAGES.length],
                currency: currency,
                currencySymbol: currencySymbol,
              }));

              comp.props.generatedHotels = generated.hotels;
              comp.props.currency = currency;
              comp.props.currencySymbol = currencySymbol;
              comp.needsGeneration = false;
            }
          } catch (e) {
            console.error("Hotel generation error:", e);
          }
        }
      }
    }

    return NextResponse.json(aiResponse);

  } catch (error: any) {
    console.error("Tambo API error:", error);

    if (error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('limit')))) {
      return NextResponse.json(
        {
          message: "I'm receiving too many requests right now. Please give me a moment to catch my breath! 😅",
          components: [],
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        message: "Sorry, I encountered an error. Please try again!",
        components: [],
      },
      { status: 500 }
    );
  }
}

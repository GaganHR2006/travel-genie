// app/api/tambo/route.ts - MIGRATED TO GOOGLE GEMINI
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

async function callGeminiWithRetry(prompt: string, retries = 0): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    if (retries < MAX_RETRIES) {
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return callGeminiWithRetry(prompt, retries + 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, registry } = await request.json();

    // Build conversation history for context
    const conversationHistory = context ? `Previous conversation:\n${context}\n\n` : "";

    // UNIFIED PROMPT - Always check for component triggers
    const unifiedPrompt = `You are Travel Genie AI. Analyze the user's message and decide which component(s) to render.

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

If no component needed, use empty array: "components": []

Examples:

User: "show me hotels"
Response: {
  "message": "Here are some great hotel options for you!",
  "components": [{
    "name": "HotelFinder",
    "needsGeneration": false,
    "props": {
      "destination": "extracted location",
      "checkIn": "2026-02-15",
      "checkOut": "2026-02-20",
      "guests": 1
    }
  }]
}

User: "what's the best food to try?"
Response: {
  "message": "You should definitely try local delicacies like...",
  "components": []
}

User: "I have $2000 for 7 days in Tokyo"
Response: {
  "message": "Perfect! I've created a personalized 7-day itinerary for Tokyo.",
  "components": [{
    "name": "SmartItineraryPlanner",
    "needsGeneration": true,
    "props": {
      "destination": "Tokyo, Japan",
      "days": 7,
      "budget": 2000
    }
  }]
}`;

    const textResponse = await callGeminiWithRetry(unifiedPrompt);

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

        // Generate itinerary if needed
        if (comp.needsGeneration && comp.name === "SmartItineraryPlanner") {
          const { destination, days, budget } = comp.props;

          const itineraryPrompt = `Create a UNIQUE ${days}-day itinerary for ${destination} with $${budget} budget.

Rules:
- Each day must have 3 COMPLETELY DIFFERENT activities (morning, afternoon, evening)
- NO REPEATED ACTIVITIES across all days
- Include realistic costs for each activity
- Use actual place names when possible

Respond with ONLY this JSON (no markdown):
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "time": "Morning", "activity": "Unique activity 1", "cost": 0 },
        { "time": "Afternoon", "activity": "Unique activity 2", "cost": 50 },
        { "time": "Evening", "activity": "Unique activity 3", "cost": 80 }
      ]
    }
  ],
  "budgetBreakdown": [
    { "category": "Accommodation", "amount": ${Math.floor(budget * 0.35)}, "percentage": 35 },
    { "category": "Food & Dining", "amount": ${Math.floor(budget * 0.25)}, "percentage": 25 },
    { "category": "Activities", "amount": ${Math.floor(budget * 0.20)}, "percentage": 20 },
    { "category": "Transportation", "amount": ${Math.floor(budget * 0.15)}, "percentage": 15 },
    { "category": "Shopping", "amount": ${Math.floor(budget * 0.05)}, "percentage": 5 }
  ]
}`;

          const itineraryText = await callGeminiWithRetry(itineraryPrompt);

          try {
            // Robust JSON extraction
            let generated;
            try {
              // try standard parse
              generated = JSON.parse(itineraryText);
            } catch (e) {
              // try extracting from markdown or finding first { and last }
              const jsonMatch = itineraryText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                try {
                  generated = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                  console.error("Failed to parse extracted JSON:", e2);
                  throw e2;
                }
              } else {
                throw new Error("No JSON found in response");
              }
            }

            comp.props.generatedItinerary = generated.itinerary;
            comp.props.generatedBudget = generated.budgetBreakdown;
          } catch (e) {
            console.error("Itinerary generation error:", e);
            // Keep going without generated data - will use mock
          }
        }

        // Generate hotels if needed
        if (comp.name === "HotelFinder") {
          const { destination } = comp.props;

          const hotelPrompt = `Find 4 REAL and highly-rated hotels in ${destination}.
          
Rules:
- Provide a mix of luxury, boutique, and budget options
- REAL names, prices, and amenities
- 1 "Best Value" option
- 1 "Luxury" option

Respond with ONLY this JSON (no markdown):
{
  "hotels": [
    {
      "name": "Hotel Name",
      "stars": 4,
      "pricePerNight": 150,
      "location": "City Center",
      "amenities": ["Pool", "WiFi", "Spa"],
      "rating": 4.5,
      "reviews": 1200,
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    }
  ]
}`;

          try {
            const hotelText = await callGeminiWithRetry(hotelPrompt);
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
              console.log(`Generated ${generated.hotels.length} hotels for ${destination}`); // DEBUG LOG
              const hotelImages = [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
              ];

              generated.hotels = generated.hotels.map((h: any, i: number) => ({
                ...h,
                image: h.image?.startsWith("http") ? h.image : hotelImages[i % hotelImages.length]
              }));
              comp.props.generatedHotels = generated.hotels;
              comp.needsGeneration = false;
            } else {
              console.warn("Hotel generation returned no 'hotels' array:", generated);
            }
          } catch (e) {
            console.error("Hotel generation error:", e);
            // Log the raw text to see why parse failed
            // console.error("Raw Hotel Text:", hotelText); 
          }
        }
      }
    }

    return NextResponse.json(aiResponse);

  } catch (error: any) {
    console.error("Tambo API error:", error);

    // Rate limit handling (Google 429)
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

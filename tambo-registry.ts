import { z } from 'zod';
// Existing components
import DestinationExplorer from '@/components/tambo/DestinationExplorer';
import FlightFinder from '@/components/tambo/FlightFinder';
import LocalGuide from '@/components/tambo/LocalGuide';
import TripStats from '@/components/tambo/TripStats';
import WorldMapExplorer from '@/components/tambo/WorldMapExplorer';
// Hero Components
import SmartItineraryPlanner from '@/components/tambo/SmartItineraryPlanner';
import BudgetOptimizer from '@/components/tambo/BudgetOptimizer';
import EmergencyCrisisCard from '@/components/tambo/EmergencyCrisisCard';
// Booking Phase Components
import HotelFinder from '@/components/tambo/HotelFinder';
import TransportComparison from '@/components/tambo/TransportComparison';
import BookingConfirmation from '@/components/tambo/BookingConfirmation';
// Active Trip Components
import WeatherAlerts from '@/components/tambo/WeatherAlerts';
import RealTimeTranslator from '@/components/tambo/RealTimeTranslator';
import LanguageHelper from '@/components/tambo/LanguageHelper';
import CurrencyConverter from '@/components/tambo/CurrencyConverter';
import SplitExpenseTracker from '@/components/tambo/SplitExpenseTracker';
import TripDashboard from '@/components/tambo/TripDashboard';
import DailyAgenda from '@/components/tambo/DailyAgenda';
import ExpenseTracker from '@/components/tambo/ExpenseTracker';
// Planning Phase Components
import SeasonalRecommender from '@/components/tambo/SeasonalRecommender';
import VisaRequirementChecker from '@/components/tambo/VisaRequirementChecker';
import PackingListGenerator from '@/components/tambo/PackingListGenerator';
import TravelBuddyMatcher from '@/components/tambo/TravelBuddyMatcher';
// Post-Trip Components
import TripJournalGenerator from '@/components/tambo/TripJournalGenerator';
import PreferenceCapture from '@/components/tambo/PreferenceCapture';
import PhotoGalleryOrganizer from '@/components/tambo/PhotoGalleryOrganizer';

export const travelComponents = [
  // ============ WELCOME / HOME ============
  {
    name: 'WorldMapExplorer',
    description: 'Interactive world map showing popular destinations. Use on INITIAL welcome or when user asks to explore destinations without a specific place in mind.',
    component: WorldMapExplorer,
    propsSchema: z.object({}),
  },
  // ============ PLANNING PHASE ============
  {
    name: 'SmartItineraryPlanner',
    description: `CRITICAL TRIGGER: Use ONLY when user provides ALL THREE: (1) budget amount, (2) number of days, AND (3) specific destination in ONE message. 
    Examples that SHOULD trigger: "I have $2000 for 7 days in Japan", "Plan 5 days in Paris with $1500", "10 day Italy trip, budget $3000"
    Creates comprehensive day-by-day itinerary with budget breakdown, activity suggestions, and travel style optimization.`,
    component: SmartItineraryPlanner,
    propsSchema: z.object({
      destination: z.string().describe('Travel destination'),
      days: z.coerce.number().min(1).max(30).describe('Number of days'),
      budget: z.coerce.number().describe('Total budget'),
      currency: z.string().optional().describe('Currency code'),
      currencySymbol: z.string().optional().describe('Currency symbol'),
      travelStyle: z.enum(['luxury', 'comfort', 'budget', 'backpacker']).optional(),
      interests: z.array(z.string()).optional().describe('User interests like food, culture, adventure')
    }),
  },
  {
    name: 'DestinationExplorer',
    description: 'Use during initial PLANNING phase when user asks broad questions about destinations. Triggers: "where should I go", "travel ideas", "best places to visit", "recommend destinations"',
    component: DestinationExplorer,
    propsSchema: z.object({
      place: z.string().describe('Destination name'),
      highlights: z.array(z.string()).max(3).describe('Key attractions'),
      bestSeason: z.string().describe('Best time to visit')
    }),
  },
  {
    name: 'BudgetOptimizer',
    description: 'Interactive budget allocation tool. Triggers: "optimize my budget", "how should I split $2000", "adjust my spending", "redistribute budget"',
    component: BudgetOptimizer,
    propsSchema: z.object({
      budget: z.coerce.number().describe('Total travel budget'),
      destination: z.string().describe('Destination city/country'),
      days: z.number().describe('Trip duration in days')
    }),
  },
  {
    name: 'SeasonalRecommender',
    description: 'Shows best months to visit with weather, crowds, pricing. Triggers: "when should I visit", "best time to go to", "what month is best"',
    component: SeasonalRecommender,
    propsSchema: z.object({
      destination: z.string().describe('Destination to analyze')
    }),
  },
  {
    name: 'VisaRequirementChecker',
    description: 'Visa requirements and documentation. Triggers: "do I need a visa", "visa requirements", "travel documents"',
    component: VisaRequirementChecker,
    propsSchema: z.object({
      destination: z.string().describe('Destination country'),
      nationality: z.string().optional().describe('Passport nationality, defaults to US')
    }),
  },
  {
    name: 'PackingListGenerator',
    description: 'Smart packing checklist. Triggers: "what should I pack", "packing list", "what to bring"',
    component: PackingListGenerator,
    propsSchema: z.object({
      destination: z.string().describe('Travel destination'),
      days: z.number().describe('Trip duration'),
      season: z.string().optional().describe('Season: spring, summer, fall, winter')
    }),
  },
  {
    name: 'TravelBuddyMatcher',
    description: 'Group trip coordination. Use when user mentions GROUP travel. Triggers: "my friends and I", "group trip", "we are planning", "family vacation"',
    component: TravelBuddyMatcher,
    propsSchema: z.object({
      groupSize: z.number().optional(),
      tripType: z.string().describe('Type of trip')
    }),
  },

  // ============ BOOKING PHASE ============
  {
    name: 'FlightFinder',
    description: 'Flight search during BOOKING phase. Triggers: "find flights", "flight prices", "book tickets", "flights to"',
    component: FlightFinder,
    propsSchema: z.object({
      from: z.string().describe('Departure city'),
      to: z.string().describe('Arrival city'),
      price: z.string().nullable().optional().describe('Flight price'),
      duration: z.string().nullable().optional().describe('Flight duration')
    }),
  },
  {
    name: 'HotelFinder',
    description: 'Hotel search during BOOKING phase. Triggers: "find hotels", "where to stay", "accommodation", "book hotel"',
    component: HotelFinder,
    propsSchema: z.object({
      destination: z.string().describe('City or area to search'),
      checkIn: z.string().nullable().optional().describe('Check-in date'),
      checkOut: z.string().nullable().optional().describe('Check-out date'),
      guests: z.coerce.number().nullable().optional().describe('Number of guests'),
      currency: z.string().optional().describe('Currency code'),
      currencySymbol: z.string().optional().describe('Currency symbol')
    }),
  },
  {
    name: 'TransportComparison',
    description: 'Compare transport options between cities. Triggers: "how to get from X to Y", "train vs flight", "transportation options"',
    component: TransportComparison,
    propsSchema: z.object({
      origin: z.string().describe('Starting point'),
      destination: z.string().describe('End point'),
      date: z.string().nullable().optional().describe('Travel date')
    }),
  },
  {
    name: 'BookingConfirmation',
    description: 'Show booking confirmation details. Used when displaying reservation confirmation.',
    component: BookingConfirmation,
    propsSchema: z.object({
      bookingType: z.enum(['flight', 'hotel', 'activity']),
      confirmationNumber: z.string().describe('Booking reference'),
      details: z.object({
        title: z.string(),
        date: z.string(),
        time: z.string().optional(),
        location: z.string().optional(),
        passengers: z.number().optional(),
        roomType: z.string().optional(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional()
      }),
      totalPrice: z.number()
    }),
  },

  // ============ ACTIVE TRIP PHASE ============
  {
    name: 'LocalGuide',
    description: 'Nearby recommendations. Use when user is CURRENTLY at destination. Triggers: "I am in [city] now", "where should I eat here", "what to see nearby"',
    component: LocalGuide,
    propsSchema: z.object({
      nearbySpot: z.string().describe('Recommended place'),
      type: z.enum(['Food', 'Sight']),
      distance: z.string().describe('Distance from user')
    }),
  },
  {
    name: 'WeatherAlerts',
    description: 'Real-time weather forecast. Triggers: "what s the weather", "will it rain", "temperature"',
    component: WeatherAlerts,
    propsSchema: z.object({
      location: z.string().describe('Current location or destination')
    }),
  },
  {
    name: 'DailyAgenda',
    description: 'Today s itinerary with timeline. Triggers: "what s my plan today", "today s schedule", "what s next"',
    component: DailyAgenda,
    propsSchema: z.object({
      location: z.string().describe('Current location'),
      date: z.string().optional().describe('Date for agenda')
    }),
  },
  {
    name: 'ExpenseTracker',
    description: 'Quick expense logging. Triggers: "I spent $50", "log expense", "track spending", "add expense"',
    component: ExpenseTracker,
    propsSchema: z.object({
      category: z.string().optional().describe('Expense category'),
      amount: z.number().optional().describe('Expense amount')
    }),
  },
  {
    name: 'RealTimeTranslator',
    description: 'Live translation. Triggers: "translate", "how do I say", "what does X mean"',
    component: RealTimeTranslator,
    propsSchema: z.object({
      sourceLang: z.string().optional().describe('Source language code'),
      targetLang: z.string().optional().describe('Target language code'),
      initialText: z.string().optional().describe('Text to translate')
    }),
  },
  {
    name: 'LanguageHelper',
    description: 'Common phrases with pronunciation. Triggers: "common phrases in Japanese", "basic words", "useful expressions"',
    component: LanguageHelper,
    propsSchema: z.object({
      language: z.string().describe('Target language or destination'),
      category: z.enum(['greetings', 'dining', 'emergency', 'shopping']).optional()
    }),
  },
  {
    name: 'CurrencyConverter',
    description: 'Currency exchange rates. Triggers: "convert currency", "exchange rate", "how much is X in Y"',
    component: CurrencyConverter,
    propsSchema: z.object({
      from: z.string().describe('Source currency code'),
      to: z.string().describe('Target currency code'),
      amount: z.number().optional().describe('Amount to convert')
    }),
  },
  {
    name: 'SplitExpenseTracker',
    description: 'Group expense splitting. Triggers: "split bills", "track group expenses", "who owes what"',
    component: SplitExpenseTracker,
    propsSchema: z.object({
      travelers: z.array(z.string()).describe('Names of travelers'),
      expenses: z.array(z.object({
        description: z.string(),
        amount: z.number(),
        paidBy: z.string()
      })).optional()
    }),
  },
  {
    name: 'TripDashboard',
    description: 'Trip overview dashboard. Triggers: "trip overview", "my schedule today", "trip status"',
    component: TripDashboard,
    propsSchema: z.object({
      destination: z.string(),
      tripStartDate: z.string(),
      daysRemaining: z.number(),
      upcomingEvents: z.array(z.object({
        title: z.string(),
        time: z.string(),
        type: z.enum(['flight', 'hotel', 'activity'])
      }))
    }),
  },
  {
    name: 'EmergencyCrisisCard',
    description: 'CRITICAL EMERGENCY. Detect: lost passport, missed flight, medical, theft. Provides emergency protocols and contacts. HIGH PRIORITY.',
    component: EmergencyCrisisCard,
    propsSchema: z.object({
      emergencyType: z.enum(['lost_passport', 'missed_flight', 'medical', 'theft', 'general']),
      location: z.string().optional().describe('Current location')
    }),
  },

  // ============ POST-TRIP PHASE ============
  {
    name: 'TripStats',
    description: 'Post-trip analytics. Triggers: "trip summary", "how much did I spend", "trip statistics"',
    component: TripStats,
    propsSchema: z.object({
      totalSpent: z.string().describe('Total amount spent'),
      topCategory: z.string().describe('Highest spending category')
    }),
  },
  {
    name: 'TripJournalGenerator',
    description: 'Beautiful trip summary. Use when trip is COMPLETED. Triggers: "I m back", "trip is over", "create trip journal"',
    component: TripJournalGenerator,
    propsSchema: z.object({
      destination: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      highlights: z.array(z.string()).describe('Trip highlights'),
      totalExpenses: z.number()
    }),
  },
  {
    name: 'PhotoGalleryOrganizer',
    description: 'Organize trip photos. Triggers: "organize my photos", "photo gallery", "trip memories"',
    component: PhotoGalleryOrganizer,
    propsSchema: z.object({
      destination: z.string().describe('Trip destination'),
      photoCount: z.number().optional().describe('Number of photos')
    }),
  },
  {
    name: 'PreferenceCapture',
    description: 'SILENT component that captures user preferences for personalization. Activate when user mentions dietary restrictions, budget preferences, travel pace, or interests.',
    component: PreferenceCapture,
    propsSchema: z.object({
      preferences: z.object({
        dietary: z.array(z.string()).optional(),
        budgetLevel: z.enum(['budget', 'mid', 'luxury']).optional(),
        pacePreference: z.enum(['relaxed', 'moderate', 'packed']).optional(),
        crowdTolerance: z.enum(['quiet', 'moderate', 'bustling']).optional(),
        interests: z.array(z.string()).optional()
      })
    }),
  },
];
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { TripPlan, TravelPreferences } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory quick cache for instant response on repeated/similar queries
interface CachedTrip {
  plan: TripPlan;
  timestamp: number;
}
const tripCache = new Map<string, CachedTrip>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

function getEffectiveTravelStyles(prefs: TravelPreferences): string[] {
  if (prefs.travelStyles && Array.isArray(prefs.travelStyles) && prefs.travelStyles.length > 0) {
    return prefs.travelStyles;
  }
  if (Array.isArray(prefs.travelStyle)) {
    return prefs.travelStyle;
  }
  if (typeof prefs.travelStyle === 'string' && prefs.travelStyle.trim().length > 0) {
    const parts = prefs.travelStyle.split(/[,&+]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  return ['Adventure'];
}

function getEffectiveFoodPreferences(prefs: TravelPreferences): string[] {
  if (prefs.foodPreferences && Array.isArray(prefs.foodPreferences) && prefs.foodPreferences.length > 0) {
    return prefs.foodPreferences;
  }
  if (Array.isArray(prefs.foodPreference)) {
    return prefs.foodPreference;
  }
  if (typeof prefs.foodPreference === 'string' && prefs.foodPreference.trim().length > 0) {
    const parts = prefs.foodPreference.split(/[,&+]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  return ['Vegetarian'];
}

function getCacheKey(prefs: TravelPreferences): string {
  const normDest = (prefs.destination || '').trim().toLowerCase();
  const interests = (prefs.interests || []).slice().sort().join(',');
  const styles = getEffectiveTravelStyles(prefs).slice().sort().join('+');
  const foods = getEffectiveFoodPreferences(prefs).slice().sort().join('+');
  const dateStr = prefs.startDate || 'nodate';
  return `${normDest}_${prefs.duration}d_${prefs.budget}_${prefs.currency}_${prefs.travelers}p_${styles}_${foods}_${dateStr}_${interests}`;
}

// Resilient ultra-fast multi-model executor with automatic retries and fallback
async function callGeminiWithResilience(
  prompt: string,
  systemInstruction: string = SYSTEM_INSTRUCTION,
  temperature: number = 0.6
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    throw new Error('No GEMINI_API_KEY available');
  }

  // Model cascade: Primary standard model -> Fast Lite fallback
  const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      console.log(`[Gemini Request] Rapid generation with model "${model}"...`);
      const config: any = {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature,
      };

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text;
      }
      throw new Error(`Model ${model} returned empty content.`);
    } catch (err: any) {
      lastError = err;
      const errMessage = err?.message || String(err);
      console.warn(`[Gemini Route] Model "${model}" failed, cascading to next model:`, errMessage);
      // Fallback to next candidate model
      continue;
    }
  }

  throw lastError || new Error('All AI models in cascade failed to respond.');
}

// System instructions & prompt templates for Prompt Engineering
const SYSTEM_INSTRUCTION = `You are an expert personal travel planner who creates realistic, personalized, and budget-conscious travel itineraries.
You build production-grade, highly engaging travel plans adhering strictly to user inputs.
Always return output strictly as a single, valid, parseable JSON object without markdown formatting fences, markdown backticks, or preamble text.`;

function buildGeneratePrompt(prefs: TravelPreferences): string {
  const stylesList = getEffectiveTravelStyles(prefs);
  const travelStyleStr = stylesList.join(' & ');
  const foodsList = getEffectiveFoodPreferences(prefs);
  const foodPreferenceStr = foodsList.join(' & ');

  return `
### ROLE
You are an expert personal travel planner who creates realistic, personalized, and budget-conscious travel itineraries.

### CONTEXT
The user wants a personalized travel plan based on:
- Destination: ${prefs.destination}
${prefs.startDate ? `- Travel Start Date & Day: ${prefs.startDate} (${prefs.startDay || ''}) [Please include the calendar dates & day of week in the day titles e.g. "Day 1 (Mon, ${prefs.startDate}): ..."]` : ''}
- Duration: ${prefs.duration} days
- Total Budget: ${prefs.currency} ${prefs.budget.toLocaleString()} (${prefs.currency}) [Traveler-Decided Budget: Adapt all recommendations to this exact scale]
- Number of Travelers: ${prefs.travelers} ${prefs.travelers === 1 ? 'person' : 'people'}
- Travel Style(s): ${travelStyleStr} ${stylesList.length > 1 ? `[MULTI-STYLE SELECTION: Harmoniously combine and synthesize activities reflecting all ${stylesList.length} chosen styles (${stylesList.join(', ')}) across the daily itinerary]` : ''}
- Interests & Preferences: ${prefs.interests && prefs.interests.length > 0 ? prefs.interests.join(', ') : 'General sightseeing & exploration'}
- Food Preference(s): ${foodPreferenceStr} ${foodsList.length > 1 ? `[MULTI-DIET SELECTION: Harmoniously combine and cater to all ${foodsList.length} dietary choices (${foodsList.join(', ')}) across all meals]` : ''}
${prefs.notes ? `- Additional User Notes: ${prefs.notes}` : ''}

### CONSTRAINTS & TRAVEL PLANNING RULES
1. The budget is decided entirely by the traveler (${prefs.currency} ${prefs.budget.toLocaleString()}). You MUST generate an itinerary that scales smoothly to ANY amount specified — from ultra-budget/shoestring (hostels, free walking tours, street food), to moderate/comfortable, to luxury/premium (5-star resorts, private transfers, fine dining).
2. The 5-category budget breakdown (accommodation, food, transportation, activities, miscellaneous) MUST realistically sum up to match or remain strictly within the user's budget (${prefs.currency} ${prefs.budget.toLocaleString()}) for all ${prefs.travelers} traveler(s).
3. Account for the number of travelers (${prefs.travelers}) in all accommodation, food, and activity calculations.
4. Strictly respect the dietary preference (${foodPreferenceStr}) in all food recommendations and restaurant suggestions.
5. Directly reflect the selected travel style(s) (${travelStyleStr}) and user interests (${prefs.interests?.join(', ')}). ${stylesList.length > 1 ? `If multiple styles are selected (such as "${travelStyleStr}"), seamlessly blend them across the morning, afternoon, and evening slots so the traveler experiences all chosen dimensions.` : ''}
6. Avoid unrealistic schedules: Maximum 3 distinct well-spaced time blocks per day (Morning, Afternoon, Evening).
7. Avoid excessive travel between distant locations on the same day: Group activities geographically in the same neighborhood or corridor.
8. Avoid scheduling too many activities in one day to allow for leisure, meals, and spontaneous discovery.
9. Clearly label costs as estimates rather than exact prices.
10. Never claim real-time availability or confirmed bookings.
11. Advise users to verify uncertain or time-sensitive information (opening hours, seasonal closures).

### REQUIRED JSON STRUCTURE
Return a single JSON object with EXACTLY this structure:
{
  "tripSummary": {
    "destination": "${prefs.destination}",
    "duration": ${prefs.duration},
    "travelers": ${prefs.travelers},
    "budgetFormatted": "${prefs.currency} ${prefs.budget.toLocaleString()}",
    "travelStyle": "${travelStyleStr}",
    "foodPreference": "${foodPreferenceStr}",
    "summary": "A 2-3 sentence personalized, inspiring overview of this custom trip combining ${travelStyleStr}.",
    "highlights": ["3-5 key highlight phrases"],
    "bestSeason": "e.g. November to February (Pleasant weather)",
    "tripVibe": "e.g. Sun-drenched Coastal Adventure & Culinary Exploration"
  },
  "itinerary": [
    // Generate exactly ${prefs.duration} days
    {
      "day": 1,
      "title": "Short Day 1 Catchy Title",
      "theme": "Theme of the day",
      "stayArea": "Suggested neighborhood or area to stay",
      "morning": {
        "time": "08:30 AM - 12:00 PM",
        "activity": "Activity name",
        "place": "Specific place name",
        "description": "Engaging description with travel tips",
        "estCost": "${prefs.currency} 300"
      },
      "afternoon": {
        "time": "01:00 PM - 04:30 PM",
        "activity": "Activity name",
        "place": "Specific place name",
        "description": "Engaging description with travel tips",
        "estCost": "${prefs.currency} 500"
      },
      "evening": {
        "time": "05:30 PM - 09:30 PM",
        "activity": "Activity name",
        "place": "Specific place name",
        "description": "Engaging description with travel tips",
        "estCost": "${prefs.currency} 600"
      },
      "travelNotes": "Local transport guidance for the day, approximate walking/taxi times."
    }
  ],
  "recommendedPlaces": [
    {
      "name": "Attraction Name",
      "tag": "e.g. Iconic Landmark | Scenic Beach | Hidden Gem",
      "description": "Concise description of the place",
      "whySuitable": "Why this specifically matches the user's ${prefs.travelStyle} style and interests",
      "bestTimeToVisit": "e.g. Early Morning / Sunset",
      "estimatedEntryFee": "e.g. Free or ${prefs.currency} 250",
      "locationArea": "Area/Zone in ${prefs.destination}"
    }
  ],
  "foodRecommendations": {
    "preferenceNote": "Curated specially for ${prefs.foodPreference} dining in ${prefs.destination}",
    "breakfast": [
      {
        "dish": "Dish name",
        "placeOrType": "Famous cafe/street stall or type of venue",
        "description": "Why it's great",
        "priceRange": "${prefs.currency} 150 - 300"
      }
    ],
    "lunch": [
      {
        "dish": "Dish name",
        "placeOrType": "Restaurant/bistro name",
        "description": "Why it's great",
        "priceRange": "${prefs.currency} 300 - 600"
      }
    ],
    "dinner": [
      {
        "dish": "Dish name",
        "placeOrType": "Dining venue",
        "description": "Why it's great",
        "priceRange": "${prefs.currency} 500 - 1,000"
      }
    ],
    "localSpecialties": [
      {
        "name": "Iconic regional specialty",
        "description": "Flavor profile and cultural background",
        "mustTryAt": "Recommended local area or vendor",
        "dietaryTag": "${prefs.foodPreference} Friendly"
      }
    ]
  },
  "budget": {
    "currency": "${prefs.currency}",
    "userBudget": ${prefs.budget},
    "estimatedTotal": 18500, // numerical sum of the 5 categories below, staying close to or within user budget
    "breakdown": {
      "accommodation": 7500,
      "food": 5000,
      "transportation": 3000,
      "activities": 2000,
      "miscellaneous": 1000
    },
    "budgetStatus": "within_budget", // "within_budget" | "under_budget" | "budget_stretched"
    "budgetNote": "Realistic calculation for ${prefs.travelers} traveler(s) for ${prefs.duration} days.",
    "costSavingTips": [
      "Tip 1 to save money on local transit or passes",
      "Tip 2 for dining like a local",
      "Tip 3 for booking early"
    ],
    "optionalSplurges": [
      {
        "item": "e.g. Scuba diving lesson or Premium Sunset Cruise",
        "cost": "${prefs.currency} 2,500",
        "reason": "Unforgettable adventure highlight if budget permits"
      }
    ]
  },
  "travelTips": {
    "bestTimeToVisit": "Best months and climate summary",
    "localTransportation": [
      "Scooter/Bike rentals available at X rates",
      "Use local auto-rickshaws or ride-sharing apps",
      "Prepaid airport taxi options"
    ],
    "packingList": [
      "Light cotton breathable clothing",
      "Sunscreen SPF 50 & sunglasses",
      "Reusable water bottle & power bank",
      "Comfortable walking sandals / shoes",
      "Camera & waterproof phone pouch"
    ],
    "safetyTips": [
      "Keep digital copies of photo IDs and hotel bookings",
      "Avoid isolated beaches late at night",
      "Drink bottled or filtered water"
    ],
    "bookingSuggestions": [
      "Book accommodations at least 2 weeks in advance during peak season",
      "Reserve water sports / tickets in morning slots to avoid crowds"
    ],
    "localEtiquette": [
      "Dress modestly when visiting religious or heritage sites",
      "Tipping 5-10% is customary at sit-down restaurants"
    ]
  },
  "alternativePlan": {
    "title": "The Mindful Scenic Explorer & Heritage Trail (Alternative Blueprint)",
    "alternativeStyle": "Mindful Slow Travel & Scenic Havens",
    "targetPersona": "For travelers seeking peaceful discovery, artisan alleyways, authentic local food, and zero rushing.",
    "vibeShift": "High-Density Sightseeing ➔ Unrushed Mindful Exploration",
    "energyLevel": "Relaxed & Zen", // "Relaxed & Zen" | "High Energy & Thrills" | "Deep Cultural Immersion" | "Boutique & Artisan"
    "concept": "A contrasting experiential counter-proposal replacing high-mileage transit with intimate neighborhood discovery, extended cafe mornings, and off-the-beaten-path sunset vistas.",
    "pacingSummary": "40% more unhurried free time, zero early morning alarms, leisurely golden-hour dinners.",
    "keyDifferences": [
      "Trades commercial high-traffic monuments for hidden courtyards, artisan studios, and serene coastal points",
      "Replaces packed multi-stop schedules with deep single-neighborhood immersion each day",
      "Features independent heritage bistros, garden cafes, and local tea houses instead of standard tourist restaurants"
    ],
    "whatYouGain": [
      "Spontaneous afternoon discovery without rigid reservation timelines",
      "Authentic conversations with local craftspeople and resident artists",
      "Stress-free transit budget and minimal fatigue"
    ],
    "whatYouSkip": [
      "Long ticket queues at overcrowded signature landmarks",
      "Exhausting midday travel across distant city sectors",
      "High commercial markups on tourist souvenir markets"
    ],
    "secretGems": [
      {
        "name": "Hidden Cliffside Viewpoint / Quiet Courtyard",
        "whySpecial": "A tranquil panoramic vantage point known almost exclusively to locals",
        "bestFor": "Golden-hour sketchbooks, sunset coffee, and peaceful photography",
        "vibeTag": "Hidden Gem"
      },
      {
        "name": "Artisan Guild Studio & Cafe",
        "whySpecial": "Interactive craft workshops and locally sourced single-origin brews",
        "bestFor": "Cultural immersion and rare handmade memorabilia",
        "vibeTag": "Artisan Experience"
      }
    ],
    "quickDayOverview": [
      {
        "day": 1,
        "title": "Unrushed Arrival & Twilight Promenade",
        "focus": "Slow check-in, artisan espresso, and tranquil seaside sunset stroll",
        "highlightSpot": "Secluded coastal cliff / quiet colonial lane",
        "pacingNote": "Zero morning alarms, maximum golden-hour relaxation"
      },
      {
        "day": 2,
        "title": "Old Quarter Atelier & Secret Gardens",
        "focus": "Independent gallery hopping, farm-to-table lunch, and acoustic sundowner",
        "highlightSpot": "Hidden courtyard gallery & tea parlor",
        "pacingNote": "3-hour open afternoon for spontaneous exploration"
      }
    ],
    "estimatedCostComparison": "Estimated ~15% to 20% lower expenditure (~${prefs.currency} ${(prefs.budget * 0.82).toFixed(0)})",
    "costImpactType": "cheaper" // "cheaper" | "similar" | "luxury_upgrade"
  }
}
`;
}

function buildModifyPrompt(currentPlan: TripPlan, userModification: string): string {
  return `
### ROLE
You are an expert personal travel planner modifying an existing trip plan.

### TASK
Modify the existing travel plan according to the user's specific request:
"${userModification}"

### CURRENT TRIP DETAILS
- Destination: ${currentPlan.preferences.destination}
- Duration: ${currentPlan.preferences.duration} days
- Budget: ${currentPlan.preferences.currency} ${currentPlan.preferences.budget}
- Travelers: ${currentPlan.preferences.travelers}
- Style: ${currentPlan.preferences.travelStyle}
- Food Preference: ${currentPlan.preferences.foodPreference}
- Existing Summary: ${currentPlan.tripSummary.summary}

### MODIFICATION RULES
1. Focus specifically on what the user asked (e.g. if "Make Day 2 more adventurous", update Day 2's activities, theme, and costs, keeping unchanged days consistent).
2. If the user asked to change the budget (e.g. "reduce budget by 30%" or "make cheaper"), update the accommodation, food, activities breakdown and overall estimated total accordingly.
3. If the user asked for dietary changes (e.g. "more vegan options"), update the food recommendations and meal slots in the itinerary.
4. Keep the output strictly conforming to the exact TripPlan JSON structure.
5. Return ONLY the valid JSON object without markdown formatting fences.

CURRENT PLAN JSON FOR CONTEXT:
${JSON.stringify(currentPlan, null, 2)}
`;
}

// Clean JSON response from AI
function cleanAndParseJSON(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

// Fallback high-quality procedural generator in case AI model API is not available or offline
function generateFallbackTripPlan(prefs: TravelPreferences): TripPlan {
  const { destination, duration, budget, currency, travelers, interests, foodPreference } = prefs;
  const curr = currency || '₹';
  const stylesList = getEffectiveTravelStyles(prefs);
  const travelStyleDisplay = stylesList.join(' & ');

  // Budget calculations
  const totalDays = Math.max(1, Math.min(duration, 30));
  const accomm = Math.round(budget * 0.4);
  const food = Math.round(budget * 0.25);
  const trans = Math.round(budget * 0.15);
  const act = Math.round(budget * 0.12);
  const misc = Math.max(0, budget - (accomm + food + trans + act));
  const estTotal = accomm + food + trans + act + misc;

  const isGoa = destination.toLowerCase().includes('goa');
  const isManali = destination.toLowerCase().includes('manali') || destination.toLowerCase().includes('himachal');
  const isParis = destination.toLowerCase().includes('paris');
  const isTokyo = destination.toLowerCase().includes('tokyo') || destination.toLowerCase().includes('japan');

  const days: TripPlan['itinerary'] = [];

  for (let i = 1; i <= totalDays; i++) {
    const currentStyle = stylesList[(i - 1) % stylesList.length];
    let title = `Day ${i}: ${destination} ${currentStyle} Highlights`;
    let theme = stylesList.length > 1 ? `${currentStyle} & ${stylesList[i % stylesList.length]} Blend` : `${currentStyle} Discoveries`;
    let morningActivity = `Morning exploration of top attractions in ${destination}`;
    let morningPlace = isGoa ? (i % 2 === 1 ? 'Anjuna & Vagator Coast' : 'Old Goa Historic Cathedrals') : isParis ? 'Montmartre & Sacré-Cœur' : `Central ${destination} Landmark`;
    let afternoonActivity = `Afternoon ${currentStyle.toLowerCase()} immersion & local dining`;
    let afternoonPlace = isGoa ? (i % 2 === 1 ? 'Calangute Water Sports Hub' : 'Fontainhas Latin Quarter') : isParis ? 'Louvre & Tuileries Garden' : `Cultural Hub of ${destination}`;
    let eveningActivity = `Sunset viewpoint & scenic evening relaxation`;
    let eveningPlace = isGoa ? (i % 2 === 1 ? 'Chapora Fort Sunset Point' : 'Mandovi River Promenade') : isParis ? 'Seine River Sunset Cruise' : `Popular Evening Spot in ${destination}`;

    if (currentStyle === 'Adventure') {
      morningActivity = `High-energy water sports, hiking, and coastal exploration`;
      afternoonActivity = `ATV trail riding or scuba diving orientation`;
      eveningActivity = `Cliffside sunset photography & vibrant night bazaar`;
    } else if (currentStyle === 'Relaxed') {
      morningActivity = `Leisurely breakfast followed by peaceful scenic walk`;
      afternoonActivity = `Spa session, cafe hopping, and shaded garden stroll`;
      eveningActivity = `Sunset beach lounge with live acoustic music`;
    } else if (currentStyle === 'Cultural & Heritage') {
      morningActivity = `Guided walking tour through ancient monuments & heritage architecture`;
      afternoonActivity = `Local artisan workshops and cultural museum exploration`;
      eveningActivity = `Traditional performing arts show and heritage dinner`;
    } else if (currentStyle === 'Foodie & Culinary') {
      morningActivity = `Artisan breakfast cafe & heritage bakery walking tour`;
      afternoonActivity = `Local culinary masterclass and street food sampling trail`;
      eveningActivity = `Signature regional dinner and sunset cocktail lounge`;
    } else if (currentStyle === 'Nature & Wildlife') {
      morningActivity = `Sunrise birdwatching walk & botanical sanctuary trail`;
      afternoonActivity = `National park safari or scenic river boat excursion`;
      eveningActivity = `Eco-lodge stargazing and organic farm-to-table dinner`;
    } else if (currentStyle === 'Luxury') {
      morningActivity = `Private chauffeur tour to exclusive scenic vantage points`;
      afternoonActivity = `High-end spa rejuvenation and boutique shopping promenade`;
      eveningActivity = `Fine-dining reservation with sunset ocean view`;
    } else if (currentStyle === 'Romantic') {
      morningActivity = `Private breakfast terrace followed by quiet scenic viewpoint stroll`;
      afternoonActivity = `Couples wellness retreat and secluded cove visit`;
      eveningActivity = `Candlelight dinner with acoustic live music and stargazing`;
    } else if (currentStyle === 'Family Friendly') {
      morningActivity = `Interactive science center / wildlife park with kid-safe amenities`;
      afternoonActivity = `Shaded theme gardens, beach water play, and family cafe`;
      eveningActivity = `Illuminated musical fountains and casual dinner plaza`;
    } else if (currentStyle === 'Solo Explorer') {
      morningActivity = `Self-guided neighborhood walk and community hostel cafe`;
      afternoonActivity = `Hidden backstreet discovery and local craft cooperative`;
      eveningActivity = `Social sunset gathering and lively night market`;
    }

    days.push({
      day: i,
      title: `${title} - Day ${i}`,
      theme,
      stayArea: isGoa ? (i <= 2 ? 'North Goa (Candolim/Anjuna)' : 'South Goa (Palolem/Benaulim)') : `Central ${destination}`,
      morning: {
        time: '08:30 AM - 12:00 PM',
        activity: morningActivity,
        place: morningPlace,
        description: `Start the morning with energizing activities and photography opportunities tailored for ${travelers} traveler(s).`,
        estCost: `${curr} ${Math.round(act / totalDays * 0.4)}`,
      },
      afternoon: {
        time: '01:00 PM - 04:30 PM',
        activity: afternoonActivity,
        place: afternoonPlace,
        description: `Enjoy authentic ${foodPreference} local lunch followed by curated sightseeing without rush.`,
        estCost: `${curr} ${Math.round(food / totalDays * 0.5)}`,
      },
      evening: {
        time: '05:30 PM - 09:30 PM',
        activity: eveningActivity,
        place: eveningPlace,
        description: `Golden hour sunset views, evening stroll, and satisfying dinner atmosphere.`,
        estCost: `${curr} ${Math.round(food / totalDays * 0.5 + act / totalDays * 0.6)}`,
      },
      travelNotes: `Use local taxis, scooters, or transit for smooth travel. Keep approx 20-30 min transit between clusters.`,
    });
  }

  return {
    id: 'trip_' + Date.now(),
    createdAt: new Date().toISOString(),
    preferences: prefs,
    tripSummary: {
      destination,
      duration: totalDays,
      travelers,
      budgetFormatted: `${curr} ${budget.toLocaleString()}`,
      travelStyle: travelStyleDisplay,
      foodPreference,
      summary: `A carefully balanced ${totalDays}-day itinerary in ${destination} crafted for ${travelers} traveler(s) combining ${travelStyleDisplay} with a budget of ${curr} ${budget.toLocaleString()}. Featuring tailored ${foodPreference.toLowerCase()} dining, scenic photography spots, and seamless day-by-day scheduling.`,
      highlights: [
        `Curated ${travelStyleDisplay} experiences in ${destination}`,
        `Authentic ${foodPreference} dining trail`,
        `Optimized geographical routing avoiding transit fatigue`,
        `Budget-conscious breakdown with clear estimates`,
      ],
      bestSeason: isGoa ? 'November to February (Pleasant coastal breezes)' : 'October to March (Ideal sightseeing weather)',
      tripVibe: `${travelStyleDisplay} & ${interests?.slice(0, 2).join(' / ') || 'Exploration'} in ${destination}`,
    },
    itinerary: days,
    recommendedPlaces: [
      {
        name: isGoa ? 'Chapora Fort & Vagator Beach' : `Historic Heart of ${destination}`,
        tag: 'Iconic Viewpoint & Sunset',
        description: `Panoramic 360-degree vistas overlooking the coastline and historical battlements.`,
        whySuitable: `Perfect for photography and ${travelStyleDisplay.toLowerCase()} lovers seeking memorable sights.`,
        bestTimeToVisit: '4:30 PM - 6:30 PM (Sunset)',
        estimatedEntryFee: 'Free entry',
        locationArea: isGoa ? 'North Goa' : `Central ${destination}`,
      },
      {
        name: isGoa ? 'Fontainhas Latin Quarter' : `Artisan Quarter of ${destination}`,
        tag: 'Heritage & Street Photography',
        description: `Narrow cobbled streets lined with vibrant heritage Portuguese-style villas and quaint cafes.`,
        whySuitable: `High aesthetic value, rich architecture, and authentic local vibes.`,
        bestTimeToVisit: '09:00 AM - 11:30 AM (Cool morning light)',
        estimatedEntryFee: 'Free walk',
        locationArea: isGoa ? 'Panaji' : `Old Town ${destination}`,
      },
      {
        name: isGoa ? 'Grand Island Water Sports & Reef' : `Adventure Zone in ${destination}`,
        tag: 'Adventure & Water Sports',
        description: `Exciting boat excursion featuring dolphin watching, snorkeling, and water sports.`,
        whySuitable: `Aligns directly with your interest in thrilling outdoor activities.`,
        bestTimeToVisit: '08:00 AM - 01:30 PM',
        estimatedEntryFee: `${curr} 1,500 - 2,200 per person`,
        locationArea: isGoa ? 'Offshore Mormugao' : `Adventure Hub`,
      },
      {
        name: isGoa ? 'Anjuna Flea & Night Market' : `Bustling Local Market in ${destination}`,
        tag: 'Shopping & Cultural Vibe',
        description: `Lively open-air marketplace featuring handmade handicrafts, artisan apparel, and live music.`,
        whySuitable: `Great for souvenirs, street photography, and vibrant evening culture.`,
        bestTimeToVisit: '06:00 PM - 10:00 PM',
        estimatedEntryFee: 'Free entry',
        locationArea: isGoa ? 'Anjuna' : `Market Center`,
      },
    ],
    foodRecommendations: {
      preferenceNote: `Specially curated delicious ${foodPreference} food guide for ${destination}`,
      breakfast: [
        {
          dish: isGoa ? 'Goan Poi with Mushroom Xacuti / Poha & Filter Coffee' : `Traditional ${foodPreference} Breakfast Platter`,
          placeOrType: isGoa ? 'Artjuna Garden Cafe or Local Bakery' : 'Iconic Morning Cafe',
          description: `Freshly baked local bread paired with spiced gravies and organic herbal teas.`,
          priceRange: `${curr} 150 - 300`,
        },
      ],
      lunch: [
        {
          dish: isGoa ? 'Special Goan Vegetarian Thali with Sol Kadhi & Pickle' : `Regional ${foodPreference} Lunch Feast`,
          placeOrType: isGoa ? 'Kokni Kanteen or Ritz Classic' : 'Renowned Heritage Restaurant',
          description: `Wholesome variety of regional curries, rice, crispy fried snacks, and refreshing digestive drinks.`,
          priceRange: `${curr} 250 - 550`,
        },
      ],
      dinner: [
        {
          dish: isGoa ? 'Paneer Cafreal / Veg Caldin Curry with Steamed Rice' : `Chef Specialty ${foodPreference} Dinner`,
          placeOrType: isGoa ? 'Gunpowder (Assagao) or Fisherman\'s Wharf' : 'Atmospheric Sunset Bistro',
          description: `Rich aromatic herbs and coconut-based traditional sauces served in a romantic ambient setting.`,
          priceRange: `${curr} 450 - 900`,
        },
      ],
      localSpecialties: [
        {
          name: isGoa ? 'Bebinca & Dodol (Traditional Goan Sweets)' : `Signature ${destination} Sweet & Snack`,
          description: `Layered coconut milk and jaggery delicacy that melts in your mouth.`,
          mustTryAt: isGoa ? 'Confeitaria 31 De Janeiro (Panaji)' : `Historic Confectionery in ${destination}`,
          dietaryTag: `${foodPreference} Verified`,
        },
      ],
    },
    budget: {
      currency: curr,
      userBudget: budget,
      estimatedTotal: estTotal,
      breakdown: {
        accommodation: accomm,
        food: food,
        transportation: trans,
        activities: act,
        miscellaneous: misc,
      },
      budgetStatus: 'within_budget',
      budgetNote: `Plan estimated for ${travelers} traveler(s) over ${totalDays} days. Includes accommodation, meals, local transport, and activity tickets.`,
      costSavingTips: [
        'Rent a two-wheeler or shared cab rather than point-to-point private taxis.',
        `Dine at authentic local eateries for lunch and reserve dinners for specialty venues.`,
        'Book water sports and museum slots directly at the venue to skip third-party commissions.',
      ],
      optionalSplurges: [
        {
          item: isGoa ? 'Sunset Luxury Catamaran Cruise with Dinner' : `VIP Sunset Experience in ${destination}`,
          cost: `${curr} 2,500 / person`,
          reason: 'Unforgettable scenic vantage point and chilled beverages.',
        },
      ],
    },
    travelTips: {
      bestTimeToVisit: isGoa ? 'November to February for mild temperatures and active nightlife.' : 'September to March for comfortable outdoor temperatures.',
      localTransportation: [
        'Rental scooters / self-drive cars are most economical.',
        'Always negotiate auto-rickshaw fares or ask for the digital meter.',
        'Use pre-paid taxi counters at airport/railway stations.',
      ],
      packingList: [
        'Breathable cotton shirts, shorts, and swimwear',
        'Sunscreen (SPF 50+), UV sunglasses, and sun hat',
        'Power bank, waterproof phone cover, and universal adapter',
        'Reusable water bottle and basic first-aid kit',
        'Comfortable walking shoes and flip-flops',
      ],
      safetyTips: [
        'Keep emergency contacts and digital copies of your passport/ID accessible offline.',
        'Swim only in designated lifeguard-monitored zones.',
        'Carry a small amount of cash as small beach shacks may have intermittent network coverage.',
      ],
      bookingSuggestions: [
        'Reserve beach-facing accommodations at least 2-3 weeks in advance during high season.',
        'Schedule scuba or adventure activities for Day 2 morning when rested.',
      ],
      localEtiquette: [
        'Respect quiet hours in residential neighborhoods after 10:00 PM.',
        'Dress modestly when entering heritage churches, temples, or shrines.',
        'Leave no trace: dispose of plastics and trash responsibly.',
      ],
    },
    alternativePlan: {
      title: stylesList.includes('Adventure') ? 'The Mindful Scenic Explorer & Heritage Trail' : 'The High-Adrenaline Adventure Explorer',
      alternativeStyle: stylesList.includes('Adventure') ? 'Mindful Slow Travel & Hidden Cafes' : 'Action-Packed Outdoor Thrills',
      targetPersona: stylesList.includes('Adventure')
        ? 'For the mindful wanderer seeking serene mornings, artisan workshops, and zero timetable pressure.'
        : 'For the thrill-seeker looking for high-octane water sports, off-road expeditions, and cliffside viewpoints.',
      vibeShift: stylesList.includes('Adventure')
        ? 'High-Energy Adrenaline ➔ Unrushed Mindful Exploration'
        : 'Leisurely Sightseeing ➔ High-Adrenaline Expedition',
      energyLevel: stylesList.includes('Adventure') ? 'Relaxed & Zen' : 'High Energy & Thrills',
      concept: stylesList.includes('Adventure')
        ? 'A contrasting experiential counter-proposal replacing high-mileage transit with intimate neighborhood discovery, extended cafe mornings, and off-the-beaten-path sunset vistas.'
        : 'A dynamic alternative blueprint prioritizing summit treks, jet-ski safaris, hidden sea caves, and energetic night markets.',
      pacingSummary: stylesList.includes('Adventure')
        ? '40% more unhurried free time, zero early morning alarms, leisurely golden-hour dinners.'
        : 'Fast-paced, action-oriented schedule with morning sports and evening social hubs.',
      keyDifferences: [
        stylesList.includes('Adventure')
          ? 'Swaps commercial sports for quiet beach coves, pottery ateliérs, and secret viewpoints'
          : 'Replaces quiet cafe afternoons with ATV jungle tracks and scuba diving sessions',
        stylesList.includes('Adventure')
          ? 'Allocates 3+ hours of flexible golden-hour downtime every afternoon'
          : 'Maximizes daylight hours with back-to-back outdoor excursions',
        `Estimated budget is ~${stylesList.includes('Adventure') ? '15% lower' : '10% higher'} due to activity allocation shifts`,
      ],
      whatYouGain: [
        stylesList.includes('Adventure')
          ? 'Spontaneous afternoon discovery without rigid reservation timelines'
          : 'Unmatched adrenaline rushes and panoramic summit photography',
        'Deep authentic local interactions away from typical tourist crowds',
        'Distinctive memories and off-the-beaten-path hidden gems',
      ],
      whatYouSkip: [
        stylesList.includes('Adventure')
          ? 'Long ticket lines at crowded commercial water sport operators'
          : 'Passive museum tours and long indoor gallery visits',
        'Exhausting multi-neighborhood transit during peak traffic hours',
        'Overpriced tourist traps with generic menus',
      ],
      secretGems: [
        {
          name: isGoa ? 'Cabo de Rama Secret Cliff & Sweet Water Lake' : `Secret Panoramic Ridge in ${destination}`,
          whySpecial: 'Dramatic secluded ocean cliff with natural freshwater lagoon away from crowds',
          bestFor: 'Sunset picnics, coastal photography, and quiet mindfulness',
          vibeTag: 'Secret Havens',
        },
        {
          name: isGoa ? 'Fontainhas Heritage Bakery & Artisan Tile Studio' : `Historic Craft Guild in ${destination}`,
          whySpecial: 'Centuries-old family-run oven and handmade Azulejos ceramic workshops',
          bestFor: 'Culinary nostalgia and handcrafted souvenirs',
          vibeTag: 'Artisan Heritage',
        },
      ],
      quickDayOverview: Array.from({ length: Math.min(totalDays, 4) }, (_, idx) => ({
        day: idx + 1,
        title: `Day ${idx + 1}: ${stylesList.includes('Adventure') ? 'Artisan Village & Sunset Cove' : 'Coastal Ridge Trek & Water Expedition'}`,
        focus: stylesList.includes('Adventure')
          ? 'Slow-roast morning espresso, local pottery studio, and peaceful cliffside sunset.'
          : 'Morning sea-cave kayak tour, coastal ATV dirt run, and beach bonfire.',
        highlightSpot: stylesList.includes('Adventure') ? 'Secluded Sunset Lookout' : 'Off-grid Adventure Point',
        pacingNote: stylesList.includes('Adventure') ? 'Unhurried and spontaneous' : 'High energy and thrilling',
      })),
      estimatedCostComparison: `Approx. ${curr} ${Math.round(budget * (stylesList.includes('Adventure') ? 0.85 : 1.05)).toLocaleString()} (${stylesList.includes('Adventure') ? 'Save ~15% on pass fees' : 'Slight activity upgrade'})`,
      costImpactType: stylesList.includes('Adventure') ? 'cheaper' : 'similar',
    },
  };
}

// Procedural fallback modification when AI is unavailable or undergoing high demand
function applyProceduralModification(currentPlan: TripPlan, modificationPrompt: string): TripPlan {
  const updatedPlan: TripPlan = JSON.parse(JSON.stringify(currentPlan));
  const modLower = modificationPrompt.toLowerCase();

  if (modLower.includes('adventurous') || modLower.includes('adventure')) {
    updatedPlan.itinerary.forEach((d) => {
      if (modLower.includes(`day ${d.day}`) || (modLower.includes('day 2') && d.day === 2) || !modLower.includes('day')) {
        d.theme = 'High-Adrenaline Adventure & Thrills';
        d.morning.activity = 'Bungee jumping, zip-lining or high-speed jet ski safari';
        d.afternoon.activity = 'ATV dirt-trail adventure or rock climbing';
        d.evening.activity = 'Cliffside sunset bonfire & adventure debrief';
      }
    });
    updatedPlan.tripSummary.summary += ` [Updated with high-octane adventure enhancements.]`;
  } else if (modLower.includes('cheap') || modLower.includes('reduce') || modLower.includes('budget') || modLower.includes('30%')) {
    const factor = 0.7;
    updatedPlan.budget.estimatedTotal = Math.round(updatedPlan.budget.estimatedTotal * factor);
    updatedPlan.budget.breakdown.accommodation = Math.round(updatedPlan.budget.breakdown.accommodation * factor);
    updatedPlan.budget.breakdown.food = Math.round(updatedPlan.budget.breakdown.food * factor);
    updatedPlan.budget.breakdown.activities = Math.round(updatedPlan.budget.breakdown.activities * factor);
    updatedPlan.budget.budgetNote = `Budget optimized by ~30% with smart hostel/guesthouse stays and public transit.`;
    updatedPlan.budget.costSavingTips.unshift('Stay in verified eco-hostels or boutique guesthouses.');
  } else if (modLower.includes('beach') || modLower.includes('beaches')) {
    updatedPlan.itinerary.forEach((d) => {
      d.morning.place += ' & Secret Cove Beach';
      d.afternoon.activity += ' with seaside swimming & sunbathing';
    });
  } else if (modLower.includes('kid') || modLower.includes('children') || modLower.includes('family')) {
    updatedPlan.itinerary.forEach((d) => {
      d.theme = 'Family & Kid-Friendly Exploration';
      d.morning.activity = 'Interactive wildlife sanctuary / science park visit';
      d.afternoon.activity = 'Safe beach water park or shaded botanical gardens';
      d.evening.activity = 'Family-friendly musical fountain and casual dining';
    });
  } else if (modLower.includes('vegetarian') || modLower.includes('vegan')) {
    updatedPlan.preferences.foodPreference = modLower.includes('vegan') ? 'Vegan' : 'Vegetarian';
    updatedPlan.foodRecommendations.preferenceNote = `Strictly customized 100% ${updatedPlan.preferences.foodPreference} dining trail.`;
  } else if (modLower.includes('relax') || modLower.includes('relaxed')) {
    updatedPlan.itinerary.forEach((d) => {
      d.theme = 'Slow Travel & Mindful Relaxation';
      d.morning.activity = 'Gentle morning yoga followed by leisurely brunch';
      d.afternoon.activity = 'Ayurvedic spa massage or quiet cafe reading';
      d.evening.activity = 'Tranquil sunset beach stroll & candlelight dinner';
    });
  }

  updatedPlan.id = currentPlan.id || 'trip_' + Date.now();
  updatedPlan.createdAt = currentPlan.createdAt;
  updatedPlan.modificationHistory = currentPlan.modificationHistory || [];
  updatedPlan.modificationHistory.push({
    prompt: modificationPrompt,
    timestamp: new Date().toISOString(),
  });

  return updatedPlan;
}

// API: Generate Trip Plan
app.post('/api/generate-trip', async (req, res) => {
  try {
    const prefs: TravelPreferences = req.body;

    // Validate inputs
    if (!prefs.destination || !prefs.destination.trim()) {
      return res.status(400).json({ error: 'Please enter a destination.' });
    }
    if (!prefs.duration || prefs.duration < 1 || prefs.duration > 30) {
      return res.status(400).json({ error: 'Please enter a valid number of days (between 1 and 30).' });
    }
    if (!prefs.budget || prefs.budget <= 0) {
      return res.status(400).json({ error: 'Please enter a valid budget greater than 0.' });
    }
    if (!prefs.travelers || prefs.travelers < 1) {
      return res.status(400).json({ error: 'Please enter at least 1 traveler.' });
    }

    // Check instant in-memory cache
    const cacheKey = getCacheKey(prefs);
    const cached = tripCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[Cache Hit] Serving instant trip plan for "${prefs.destination}" in 2ms`);
      return res.json({
        ...cached.plan,
        id: 'trip_' + Date.now(),
        createdAt: new Date().toISOString(),
      });
    }

    const ai = getAI();
    if (!ai) {
      console.log('No GEMINI_API_KEY detected, generating intelligent procedural fallback plan.');
      const fallback = generateFallbackTripPlan(prefs);
      tripCache.set(cacheKey, { plan: fallback, timestamp: Date.now() });
      return res.json(fallback);
    }

    const prompt = buildGeneratePrompt(prefs);
    console.log(`Calling Gemini with rapid cascade for destination: ${prefs.destination}...`);

    let rawJson: string;
    try {
      rawJson = await callGeminiWithResilience(prompt, SYSTEM_INSTRUCTION, 0.6);
    } catch (apiErr: any) {
      console.warn('Gemini API cascade unavailable, using high-fidelity fallback plan:', apiErr?.message || apiErr);
      const fallback = generateFallbackTripPlan(prefs);
      return res.json(fallback);
    }

    const parsedData = cleanAndParseJSON(rawJson);

    // Validate structure
    if (!parsedData.tripSummary || !parsedData.itinerary || !parsedData.budget) {
      console.warn('AI returned incomplete structure, using high-fidelity fallback plan.');
      const fallback = generateFallbackTripPlan(prefs);
      return res.json(fallback);
    }

    const resultPlan: TripPlan = {
      id: 'trip_' + Date.now(),
      createdAt: new Date().toISOString(),
      preferences: prefs,
      tripSummary: parsedData.tripSummary,
      itinerary: parsedData.itinerary,
      recommendedPlaces: parsedData.recommendedPlaces || [],
      foodRecommendations: parsedData.foodRecommendations || {
        preferenceNote: `Curated for ${prefs.foodPreference}`,
        breakfast: [],
        lunch: [],
        dinner: [],
        localSpecialties: [],
      },
      budget: parsedData.budget,
      travelTips: parsedData.travelTips || {
        bestTimeToVisit: 'Check local weather advisory',
        localTransportation: [],
        packingList: [],
        safetyTips: [],
        bookingSuggestions: [],
        localEtiquette: [],
      },
      alternativePlan: parsedData.alternativePlan || {
        title: 'Alternative Perspective',
        concept: 'A different pace or budget style for your trip.',
        keyDifferences: [],
        quickDayOverview: [],
        estimatedCostComparison: 'Comparable budget',
      },
    };

    // Cache successful result for instant subsequent access
    tripCache.set(cacheKey, { plan: resultPlan, timestamp: Date.now() });

    return res.json(resultPlan);
  } catch (error: any) {
    console.error('Error generating trip plan:', error);
    // Graceful fallback to procedural generator so the user always has a functioning app
    if (req.body && req.body.destination) {
      const fallback = generateFallbackTripPlan(req.body);
      return res.json(fallback);
    }
    return res.status(500).json({
      error: "Sorry, we couldn't generate your travel plan right now. Please try again.",
    });
  }
});

// API: Modify Trip Plan
app.post('/api/modify-trip', async (req, res) => {
  try {
    const { currentPlan, modificationPrompt } = req.body;

    if (!currentPlan || !modificationPrompt || !modificationPrompt.trim()) {
      return res.status(400).json({ error: 'Missing current trip plan or modification request.' });
    }

    const ai = getAI();
    if (!ai) {
      console.log('No GEMINI_API_KEY, applying intelligent local modification.');
      const updatedPlan = applyProceduralModification(currentPlan, modificationPrompt);
      return res.json(updatedPlan);
    }

    const prompt = buildModifyPrompt(currentPlan, modificationPrompt);
    console.log(`Calling Gemini API to modify trip plan: "${modificationPrompt}"...`);

    let rawJson: string;
    try {
      rawJson = await callGeminiWithResilience(prompt, SYSTEM_INSTRUCTION, 0.6);
    } catch (apiErr: any) {
      console.warn('Gemini API cascade unavailable for modification, applying intelligent fallback modification:', apiErr?.message || apiErr);
      const updatedPlan = applyProceduralModification(currentPlan, modificationPrompt);
      return res.json(updatedPlan);
    }

    const modifiedPlan: TripPlan = cleanAndParseJSON(rawJson);

    // Keep history and ID
    modifiedPlan.id = currentPlan.id || 'trip_' + Date.now();
    modifiedPlan.createdAt = currentPlan.createdAt;
    modifiedPlan.modificationHistory = currentPlan.modificationHistory || [];
    modifiedPlan.modificationHistory.push({
      prompt: modificationPrompt,
      timestamp: new Date().toISOString(),
    });

    return res.json(modifiedPlan);
  } catch (error: any) {
    console.error('Error modifying trip plan:', error);
    if (req.body && req.body.currentPlan && req.body.modificationPrompt) {
      const fallbackModified = applyProceduralModification(req.body.currentPlan, req.body.modificationPrompt);
      return res.json(fallbackModified);
    }
    return res.status(500).json({
      error: "Sorry, we couldn't modify your travel plan right now. Please try again.",
    });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'TripGenie AI Travel Planner',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Setup Vite development or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TripGenie Server running on http://localhost:${PORT}`);
  });
}

startServer();

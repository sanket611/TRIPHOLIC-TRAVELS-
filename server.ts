import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { TripPlan, TravelPreferences } from './src/types.js';
import { generatePlan, modifyPlan, getEffectiveTravelStyles, getEffectiveFoodPreferences } from './src/plannerEngine.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS & Security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

// API: Generate Trip Plan (handles both with and without trailing slash)
app.all(['/api/generate-trip', '/api/generate-trip/'], async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const prefs: TravelPreferences = req.body || {};

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
      console.log('No GEMINI_API_KEY detected, generating intelligent procedural plan.');
      const plan = generatePlan(prefs);
      tripCache.set(cacheKey, { plan, timestamp: Date.now() });
      return res.json(plan);
    }

    const prompt = buildGeneratePrompt(prefs);
    console.log(`Calling Gemini with rapid cascade for destination: ${prefs.destination}...`);

    let rawJson: string;
    try {
      rawJson = await callGeminiWithResilience(prompt, SYSTEM_INSTRUCTION, 0.6);
    } catch (apiErr: any) {
      console.warn('Gemini API cascade unavailable, using high-fidelity procedural plan:', apiErr?.message || apiErr);
      const plan = generatePlan(prefs);
      return res.json(plan);
    }

    const parsedData = cleanAndParseJSON(rawJson);

    // Validate structure
    if (!parsedData.tripSummary || !parsedData.itinerary || !parsedData.budget) {
      console.warn('AI returned incomplete structure, using high-fidelity procedural plan.');
      const plan = generatePlan(prefs);
      return res.json(plan);
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
    if (req.body && req.body.destination) {
      const plan = generatePlan(req.body);
      return res.json(plan);
    }
    return res.status(500).json({
      error: "Sorry, we couldn't generate your travel plan right now. Please try again.",
    });
  }
});

// API: Modify Trip Plan (handles both with and without trailing slash)
app.all(['/api/modify-trip', '/api/modify-trip/'], async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { currentPlan, modificationPrompt } = req.body || {};

    if (!currentPlan || !modificationPrompt || !modificationPrompt.trim()) {
      return res.status(400).json({ error: 'Missing current trip plan or modification request.' });
    }

    const ai = getAI();
    if (!ai) {
      console.log('No GEMINI_API_KEY, applying intelligent local modification.');
      const updatedPlan = modifyPlan(currentPlan, modificationPrompt);
      return res.json(updatedPlan);
    }

    const prompt = buildModifyPrompt(currentPlan, modificationPrompt);
    console.log(`Calling Gemini API to modify trip plan: "${modificationPrompt}"...`);

    let rawJson: string;
    try {
      rawJson = await callGeminiWithResilience(prompt, SYSTEM_INSTRUCTION, 0.6);
    } catch (apiErr: any) {
      console.warn('Gemini API cascade unavailable for modification, applying intelligent fallback modification:', apiErr?.message || apiErr);
      const updatedPlan = modifyPlan(currentPlan, modificationPrompt);
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
      const fallbackModified = modifyPlan(req.body.currentPlan, req.body.modificationPrompt);
      return res.json(fallbackModified);
    }
    return res.status(500).json({
      error: "Sorry, we couldn't modify your travel plan right now. Please try again.",
    });
  }
});

// API: Health check
app.all(['/api/health', '/api/health/'], (req, res) => {
  res.json({
    status: 'ok',
    appName: 'TripGenie AI Travel Planner',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Fallback for any other API route
app.all('/api/*', (req, res) => {
  res.status(404).json({
    error: `API route ${req.path} not found`,
    status: 404,
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

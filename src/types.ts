export type TravelStyle =
  | 'Adventure'
  | 'Relaxed'
  | 'Cultural & Heritage'
  | 'Luxury'
  | 'Romantic'
  | 'Family Friendly'
  | 'Solo Explorer'
  | 'Foodie & Culinary'
  | 'Nature & Wildlife';

export type FoodPreference =
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Vegan'
  | 'Jain'
  | 'Eggetarian'
  | 'Halal'
  | 'Seafood Special';

export interface TravelPreferences {
  destination: string;
  duration: number; // 1 - 30 days
  budget: number;
  currency: string; // '₹', '$', '€', '£', etc.
  travelers: number;
  travelStyle: TravelStyle | string;
  travelStyles?: TravelStyle[];
  interests: string[];
  foodPreference: FoodPreference | string;
  foodPreferences?: FoodPreference[];
  startDate?: string; // YYYY-MM-DD
  startDay?: string; // e.g. "Friday"
  notes?: string;
}

export interface ActivitySlot {
  time: string;
  activity: string;
  place: string;
  description: string;
  estCost?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  morning: ActivitySlot;
  afternoon: ActivitySlot;
  evening: ActivitySlot;
  travelNotes: string;
  stayArea: string;
}

export interface RecommendedPlace {
  name: string;
  tag: string;
  description: string;
  whySuitable: string;
  bestTimeToVisit: string;
  estimatedEntryFee: string;
  locationArea: string;
}

export interface FoodDish {
  dish: string;
  placeOrType: string;
  description: string;
  priceRange: string;
}

export interface LocalSpecialty {
  name: string;
  description: string;
  mustTryAt: string;
  dietaryTag: string;
}

export interface FoodRecommendations {
  preferenceNote: string;
  breakfast: FoodDish[];
  lunch: FoodDish[];
  dinner: FoodDish[];
  localSpecialties: LocalSpecialty[];
}

export interface BudgetBreakdown {
  currency: string;
  userBudget: number;
  estimatedTotal: number;
  breakdown: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    miscellaneous: number;
  };
  budgetStatus: 'within_budget' | 'under_budget' | 'budget_stretched';
  budgetNote: string;
  costSavingTips: string[];
  optionalSplurges: Array<{ item: string; cost: string; reason: string }>;
}

export interface TravelTips {
  bestTimeToVisit: string;
  localTransportation: string[];
  packingList: string[];
  safetyTips: string[];
  bookingSuggestions: string[];
  localEtiquette: string[];
}

export interface AlternativeSecretGem {
  name: string;
  whySpecial: string;
  bestFor: string;
  vibeTag: string;
}

export interface AlternativeDayOverview {
  day: number;
  title?: string;
  focus: string;
  highlightSpot?: string;
  pacingNote?: string;
}

export interface AlternativePlan {
  title: string;
  alternativeStyle?: string;
  targetPersona?: string;
  vibeShift?: string;
  energyLevel?: 'Relaxed & Zen' | 'High Energy & Thrills' | 'Deep Cultural Immersion' | 'Boutique & Artisan';
  concept: string;
  keyDifferences: string[];
  whatYouGain?: string[];
  whatYouSkip?: string[];
  secretGems?: AlternativeSecretGem[];
  quickDayOverview: AlternativeDayOverview[];
  pacingSummary?: string;
  estimatedCostComparison: string;
  costImpactType?: 'cheaper' | 'similar' | 'luxury_upgrade';
}

export interface TripPlan {
  id: string;
  createdAt: string;
  preferences: TravelPreferences;
  tripSummary: {
    destination: string;
    duration: number;
    travelers: number;
    budgetFormatted: string;
    travelStyle: string;
    foodPreference: string;
    summary: string;
    highlights: string[];
    bestSeason: string;
    tripVibe: string;
  };
  itinerary: DayItinerary[];
  recommendedPlaces: RecommendedPlace[];
  foodRecommendations: FoodRecommendations;
  budget: BudgetBreakdown;
  travelTips: TravelTips;
  alternativePlan: AlternativePlan;
  modificationHistory?: Array<{ prompt: string; timestamp: string }>;
}

export interface TestScenarioResult {
  id: string;
  title: string;
  description: string;
  input: Partial<TravelPreferences>;
  status: 'passed' | 'failed' | 'running' | 'idle';
  notes: string;
  executionTimeMs?: number;
}

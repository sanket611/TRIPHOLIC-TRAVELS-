import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Compass,
  Sparkles,
  Utensils,
  Tag,
  AlertCircle,
  RotateCcw,
  Zap,
  Clock,
  Grid,
  Check,
  ArrowRight,
  ArrowLeft,
  Layers,
  List,
} from 'lucide-react';
import { TravelPreferences, TravelStyle, FoodPreference } from '../types';
import { ALL_AVAILABLE_DESTINATIONS, DestinationInfo } from '../data/destinations';

interface TripFormProps {
  onSubmit?: (prefs: TravelPreferences) => void;
  onGenerateTrip?: (prefs: TravelPreferences) => void;
  onReset?: () => void;
  onOpenDestinationsModal?: () => void;
  isLoading: boolean;
  initialValues?: Partial<TravelPreferences>;
  targetStep?: FormStep;
  onStepChange?: (step: FormStep) => void;
}

export type FormStep = 'logistics' | 'travel-style' | 'food-preference' | 'custom' | 'all' | 'preferences';

export interface TravelStyleOption {
  id: TravelStyle;
  label: string;
  icon: string;
  desc: string;
  category: 'Active & Outdoor' | 'Leisure & Comfort' | 'Culture & Heritage' | 'Social & Explorer' | 'Specialty';
  badge: string;
}

const TRAVEL_STYLES: TravelStyleOption[] = [
  {
    id: 'Adventure',
    label: 'Adventure & Thrill',
    icon: '🧗',
    desc: 'Treks, water sports, outdoor thrills & high adrenaline activities',
    category: 'Active & Outdoor',
    badge: 'High Adrenaline',
  },
  {
    id: 'Relaxed',
    label: 'Relaxed & Leisure',
    icon: '🏖️',
    desc: 'Scenic beaches, slow peaceful mornings, resorts & sunset lounges',
    category: 'Leisure & Comfort',
    badge: 'Slow Pace',
  },
  {
    id: 'Cultural & Heritage',
    label: 'Cultural & Heritage',
    icon: '🏛️',
    desc: 'UNESCO monuments, royal palaces, historic forts & museum trails',
    category: 'Culture & Heritage',
    badge: 'History & Art',
  },
  {
    id: 'Luxury',
    label: 'Luxury & Premium',
    icon: '✨',
    desc: '5-star boutique resorts, chauffeur transit, spas & fine dining',
    category: 'Leisure & Comfort',
    badge: 'VIP Comfort',
  },
  {
    id: 'Romantic',
    label: 'Romantic Getaway',
    icon: '🌹',
    desc: 'Intimate viewpoints, candlelit dinners, cozy suites & views',
    category: 'Leisure & Comfort',
    badge: 'Couples & Honeymoon',
  },
  {
    id: 'Family Friendly',
    label: 'Family Friendly',
    icon: '👨‍👩‍👧‍👦',
    desc: 'Safe kid-friendly parks, easy transfers & comfortable group stays',
    category: 'Leisure & Comfort',
    badge: 'All Ages Safe',
  },
  {
    id: 'Solo Explorer',
    label: 'Solo Explorer',
    icon: '🎒',
    desc: 'Vibrant hostels, social walking tours & authentic offbeat spots',
    category: 'Social & Explorer',
    badge: 'Independent',
  },
  {
    id: 'Foodie & Culinary',
    label: 'Foodie & Culinary',
    icon: '🍜',
    desc: 'Curated street food walks, chef tastings & iconic regional dishes',
    category: 'Culture & Heritage',
    badge: 'Local Flavor',
  },
  {
    id: 'Nature & Wildlife',
    label: 'Nature & Wildlife',
    icon: '🌿',
    desc: 'National parks, jungle jeep safaris, bird sanctuaries & waterfalls',
    category: 'Active & Outdoor',
    badge: 'Biodiversity',
  },
  {
    id: 'Backpacker & Budget',
    label: 'Backpacker & Budget',
    icon: '🥾',
    desc: 'Smart budget hostels, public transit trails & pocket-friendly travel',
    category: 'Social & Explorer',
    badge: 'Pocket Friendly',
  },
  {
    id: 'Road Trip & Scenic',
    label: 'Road Trip & Scenic',
    icon: '🚗',
    desc: 'Mountain passes, coastal highways, picturesque stops & drives',
    category: 'Active & Outdoor',
    badge: 'Scenic Routes',
  },
  {
    id: 'Spiritual & Wellness',
    label: 'Spiritual & Wellness',
    icon: '🧘',
    desc: 'Serene yoga ashrams, ancient temples, meditation & river ghats',
    category: 'Specialty',
    badge: 'Inner Peace',
  },
  {
    id: 'Photography & Sightseeing',
    label: 'Photography Spotter',
    icon: '📸',
    desc: 'Golden hour panoramic viewpoints, vibrant alleys & skyline spots',
    category: 'Culture & Heritage',
    badge: 'Golden Hour',
  },
  {
    id: 'Party & Nightlife',
    label: 'Nightlife & Social',
    icon: '🎉',
    desc: 'Beach clubs, live music pubs, rooftop lounges & night markets',
    category: 'Social & Explorer',
    badge: 'Late Night Vibe',
  },
];

const POPULAR_STYLE_COMBOS: Array<{ label: string; icon: string; styles: TravelStyle[] }> = [
  { label: 'Beach & Chill', icon: '🏖️', styles: ['Relaxed', 'Romantic'] },
  { label: 'Thrill & Nature', icon: '🧗', styles: ['Adventure', 'Nature & Wildlife'] },
  { label: 'Heritage & Photo', icon: '🏛️', styles: ['Cultural & Heritage', 'Photography & Sightseeing'] },
  { label: 'Luxury & Gourmet', icon: '✨', styles: ['Luxury', 'Foodie & Culinary'] },
  { label: 'Solo Backpacker', icon: '🎒', styles: ['Solo Explorer', 'Backpacker & Budget'] },
  { label: 'Spiritual Retreat', icon: '🧘', styles: ['Spiritual & Wellness', 'Relaxed'] },
];

const INTEREST_OPTIONS = [
  'Beaches',
  'Photography',
  'Nightlife',
  'History',
  'Trekking',
  'Shopping',
  'Temples & Shrines',
  'Water Sports',
  'Local Culture',
  'Art & Museums',
  'Wellness & Spa',
  'Architecture',
  'Street Food',
  'Scenic Drives',
  'Wildlife Safaris',
];

export interface FoodPreferenceOption {
  id: FoodPreference;
  label: string;
  icon: string;
  note: string;
  dietGroup: 'Pure Veg & Jain' | 'Non-Vegetarian' | 'Plant-Based' | 'Specialty & Dining';
  badge: string;
}

const FOOD_PREFERENCES: FoodPreferenceOption[] = [
  {
    id: 'Vegetarian',
    label: 'Pure Vegetarian',
    icon: '🥗',
    note: 'Zero meat, zero poultry, zero seafood. Fresh paneer & dairy permitted.',
    dietGroup: 'Pure Veg & Jain',
    badge: '100% Veg',
  },
  {
    id: 'Non-Vegetarian',
    label: 'Non-Vegetarian',
    icon: '🍗',
    note: 'Delicious poultry, tender mutton, fresh fish & regional gravies.',
    dietGroup: 'Non-Vegetarian',
    badge: 'Meat Friendly',
  },
  {
    id: 'Vegan',
    label: '100% Plant Vegan',
    icon: '🌱',
    note: 'Strictly plant-based. Zero dairy, zero honey, zero animal derivatives.',
    dietGroup: 'Plant-Based',
    badge: 'Plant Powered',
  },
  {
    id: 'Jain',
    label: 'Jain Friendly',
    icon: '🙏',
    note: 'Strict pure vegetarian without underground root vegetables (no onion, garlic, potato).',
    dietGroup: 'Pure Veg & Jain',
    badge: 'No Root Veg',
  },
  {
    id: 'Eggetarian',
    label: 'Eggetarian',
    icon: '🍳',
    note: 'Vegetarian staples plus breakfast eggs, omelettes, and baked goods.',
    dietGroup: 'Specialty & Dining',
    badge: 'Veg + Eggs',
  },
  {
    id: 'Halal',
    label: 'Halal Certified',
    icon: '🌙',
    note: 'Strictly 100% Halal certified meats, poultry & verified dining kitchens.',
    dietGroup: 'Non-Vegetarian',
    badge: 'Halal Only',
  },
  {
    id: 'Seafood Special',
    label: 'Seafood Lover',
    icon: '🦐',
    note: 'Fresh ocean catches, coastal fish thalis, tiger prawns & king crabs.',
    dietGroup: 'Non-Vegetarian',
    badge: 'Fresh Catch',
  },
  {
    id: 'Street Food Lover',
    label: 'Street Food Trail',
    icon: '🥘',
    note: 'Iconic local street stalls, authentic night bazaar chaats & quick bites.',
    dietGroup: 'Specialty & Dining',
    badge: 'Authentic Street',
  },
  {
    id: 'Organic & Healthy',
    label: 'Organic & Healthy',
    icon: '🥑',
    note: 'Gluten-conscious options, cold-pressed juices, farm salads & light bowls.',
    dietGroup: 'Plant-Based',
    badge: 'Clean Eating',
  },
  {
    id: 'Fine Dining Gourmet',
    label: 'Fine Dining Gourmet',
    icon: '🍷',
    note: 'Chef tasting menus, Michelin/award-winning bistros & wine pairings.',
    dietGroup: 'Specialty & Dining',
    badge: 'Gourmet Luxury',
  },
];

const POPULAR_FOOD_COMBOS: Array<{ label: string; prefs: FoodPreference[] }> = [
  { label: '🥗 + 🙏 Veg & Jain', prefs: ['Vegetarian', 'Jain'] },
  { label: '🍗 + 🦐 Non-Veg & Seafood', prefs: ['Non-Vegetarian', 'Seafood Special'] },
  { label: '🌱 + 🥑 Plant Vegan & Organic', prefs: ['Vegan', 'Organic & Healthy'] },
  { label: '🍗 + 🌙 Halal Non-Veg', prefs: ['Halal', 'Non-Vegetarian'] },
  { label: '🍳 + 🥘 Eggetarian & Street Food', prefs: ['Eggetarian', 'Street Food Lover'] },
  { label: '🍷 + 🦐 Gourmet Seafood', prefs: ['Fine Dining Gourmet', 'Seafood Special'] },
];

const CURRENCIES = [
  { code: '₹', name: 'INR (₹)' },
  { code: '$', name: 'USD ($)' },
  { code: '€', name: 'EUR (€)' },
  { code: '£', name: 'GBP (£)' },
  { code: 'A$', name: 'AUD (A$)' },
  { code: 'CA$', name: 'CAD (CA$)' },
  { code: 'AED', name: 'AED (د.إ)' },
  { code: '¥', name: 'JPY (¥)' },
];

function getTomorrowDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function formatDateAndDay(dateStr: string): { formatted: string; dayName: string } {
  if (!dateStr) return { formatted: '', dayName: '' };
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return { formatted, dayName };
    }
  } catch {}
  return { formatted: dateStr, dayName: '' };
}

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  onGenerateTrip,
  onReset,
  onOpenDestinationsModal,
  isLoading,
  initialValues,
  targetStep,
  onStepChange,
}) => {
  const getInitialTravelStyles = (): TravelStyle[] => {
    if (initialValues?.travelStyles && initialValues.travelStyles.length > 0) {
      return initialValues.travelStyles;
    }
    if (initialValues?.travelStyle) {
      if (Array.isArray(initialValues.travelStyle)) {
        return initialValues.travelStyle as TravelStyle[];
      }
      const raw = String(initialValues.travelStyle);
      const parts = raw.split(/[,&+]/).map((s) => s.trim().toLowerCase());
      const matched = TRAVEL_STYLES.filter((ts) =>
        parts.some((p) => ts.id.toLowerCase() === p || ts.label.toLowerCase() === p)
      ).map((ts) => ts.id);
      if (matched.length > 0) return matched;
      return [initialValues.travelStyle as TravelStyle];
    }
    // Start blank by default as requested by user
    return [];
  };

  const getInitialFoodPreferences = (): FoodPreference[] => {
    if (initialValues?.foodPreferences && initialValues.foodPreferences.length > 0) {
      return initialValues.foodPreferences;
    }
    if (initialValues?.foodPreference) {
      if (Array.isArray(initialValues.foodPreference)) {
        return initialValues.foodPreference as FoodPreference[];
      }
      const raw = String(initialValues.foodPreference);
      const parts = raw.split(/[,&+]/).map((s) => s.trim().toLowerCase());
      const matched = FOOD_PREFERENCES.filter((fp) =>
        parts.some((p) => fp.id.toLowerCase() === p || fp.label.toLowerCase() === p)
      ).map((fp) => fp.id);
      if (matched.length > 0) return matched;
      return [initialValues.foodPreference as FoodPreference];
    }
    // Start blank by default as requested by user
    return [];
  };

  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [startDate, setStartDate] = useState<string>(initialValues?.startDate || getTomorrowDateStr());
  const [duration, setDuration] = useState<number | string>(initialValues?.duration ?? 4);
  const [budget, setBudget] = useState<string>(initialValues?.budget ? initialValues.budget.toString() : '20000');
  const [currency, setCurrency] = useState(initialValues?.currency || '₹');
  const [travelers, setTravelers] = useState<number>(initialValues?.travelers || 2);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<TravelStyle[]>(getInitialTravelStyles);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialValues?.interests || []
  );
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState<FoodPreference[]>(getInitialFoodPreferences);
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);

  // Stepper / Individual option view mode
  const [activeStep, setActiveStep] = useState<FormStep>('logistics');

  // Filter categories for the individual Travel Style & Food Preference options
  const [styleCategoryFilter, setStyleCategoryFilter] = useState<string>('All');
  const [foodGroupFilter, setFoodGroupFilter] = useState<string>('All');

  // Prop-driven target step change
  useEffect(() => {
    if (targetStep) {
      if (targetStep === 'preferences') {
        setActiveStep('travel-style');
      } else {
        setActiveStep(targetStep);
      }
    }
  }, [targetStep]);

  const changeStep = (newStep: FormStep) => {
    setActiveStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  // Close destination dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDestinationSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPredefinedDestination = (dest: DestinationInfo) => {
    setDestination(dest.name);
    setDuration(dest.idealDuration);
    setCurrency(dest.currency);
    setBudget(dest.currency === '₹' ? dest.typicalBudgetINR.toString() : dest.typicalBudgetUSD.toString());
    if (dest.recommendedStyles && dest.recommendedStyles.length > 0) {
      setSelectedTravelStyles(dest.recommendedStyles);
    }
    if (dest.recommendedInterests && dest.recommendedInterests.length > 0) {
      setSelectedInterests(dest.recommendedInterests);
    }
    if (dest.foodPreference) {
      setSelectedFoodPreferences([dest.foodPreference]);
    }
    setShowDestinationSuggestions(false);
    if (errors.destination) {
      setErrors((prev) => ({ ...prev, destination: '' }));
    }
  };

  const matchingSuggestions = destination.trim()
    ? ALL_AVAILABLE_DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(destination.toLowerCase()) ||
          d.stateOrCountry.toLowerCase().includes(destination.toLowerCase()) ||
          d.famousFor.some((f) => f.toLowerCase().includes(destination.toLowerCase()))
      ).slice(0, 6)
    : ALL_AVAILABLE_DESTINATIONS.slice(0, 6);

  // Synchronize when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.destination !== undefined) setDestination(initialValues.destination);
      if (initialValues.startDate !== undefined) setStartDate(initialValues.startDate);
      if (initialValues.duration !== undefined) setDuration(initialValues.duration);
      if (initialValues.budget !== undefined) setBudget(initialValues.budget.toString());
      if (initialValues.currency !== undefined) setCurrency(initialValues.currency);
      if (initialValues.travelers !== undefined) setTravelers(initialValues.travelers);
      if (initialValues.travelStyles && initialValues.travelStyles.length > 0) {
        setSelectedTravelStyles(initialValues.travelStyles);
      } else if (initialValues.travelStyle) {
        if (Array.isArray(initialValues.travelStyle)) {
          setSelectedTravelStyles(initialValues.travelStyle as TravelStyle[]);
        } else {
          const raw = String(initialValues.travelStyle);
          const parts = raw.split(/[,&+]/).map((s) => s.trim().toLowerCase());
          const matched = TRAVEL_STYLES.filter((ts) =>
            parts.some((p) => ts.id.toLowerCase() === p || ts.label.toLowerCase() === p)
          ).map((ts) => ts.id);
          setSelectedTravelStyles(matched.length > 0 ? matched : [initialValues.travelStyle as TravelStyle]);
        }
      }
      if (initialValues.interests !== undefined) setSelectedInterests(initialValues.interests);
      if (initialValues.foodPreferences && initialValues.foodPreferences.length > 0) {
        setSelectedFoodPreferences(initialValues.foodPreferences);
      } else if (initialValues.foodPreference) {
        if (Array.isArray(initialValues.foodPreference)) {
          setSelectedFoodPreferences(initialValues.foodPreference as FoodPreference[]);
        } else {
          const raw = String(initialValues.foodPreference);
          const parts = raw.split(/[,&+]/).map((s) => s.trim().toLowerCase());
          const matched = FOOD_PREFERENCES.filter((fp) =>
            parts.some((p) => fp.id.toLowerCase() === p || fp.label.toLowerCase() === p)
          ).map((fp) => fp.id);
          setSelectedFoodPreferences(matched.length > 0 ? matched : [initialValues.foodPreference as FoodPreference]);
        }
      }
      if (initialValues.notes !== undefined) setNotes(initialValues.notes || '');
    }
  }, [initialValues]);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTryExample = () => {
    setDestination('Goa');
    setStartDate(getTomorrowDateStr());
    setDuration(4);
    setBudget('20000');
    setCurrency('₹');
    setTravelers(2);
    setSelectedTravelStyles(['Adventure', 'Foodie & Culinary']);
    setSelectedInterests(['Beaches', 'Photography', 'Street Food']);
    setSelectedFoodPreferences(['Vegetarian', 'Seafood Special']);
    setNotes('');
    setErrors({});
  };

  const handleTravelStyleToggle = (styleId: TravelStyle) => {
    setSelectedTravelStyles((prev) => {
      let updated: TravelStyle[];
      if (prev.includes(styleId)) {
        if (prev.length === 1) {
          updated = [];
        } else {
          updated = prev.filter((s) => s !== styleId);
        }
      } else {
        updated = [...prev, styleId];
      }

      if (errors.travelStyle && updated.length > 0) {
        setErrors((prevErr) => ({ ...prevErr, travelStyle: '' }));
      }
      return updated;
    });
  };

  const handleFoodPreferenceToggle = (foodId: FoodPreference) => {
    setSelectedFoodPreferences((prev) => {
      let updated: FoodPreference[];
      if (prev.includes(foodId)) {
        if (prev.length === 1) {
          updated = [];
        } else {
          updated = prev.filter((f) => f !== foodId);
        }
      } else {
        updated = [...prev, foodId];
      }

      if (errors.foodPreference && updated.length > 0) {
        setErrors((prevErr) => ({ ...prevErr, foodPreference: '' }));
      }
      return updated;
    });
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      let updated: string[];
      if (prev.includes(interest)) {
        updated = prev.filter((i) => i !== interest);
      } else {
        updated = [...prev, interest];
      }
      if (errors.interests && updated.length > 0) {
        setErrors((prevErr) => ({ ...prevErr, interests: '' }));
      }
      return updated;
    });
  };

  const handleClearForm = () => {
    setDestination('');
    setStartDate(getTomorrowDateStr());
    setDuration(3);
    setBudget('15000');
    setCurrency('₹');
    setTravelers(1);
    setSelectedTravelStyles([]);
    setSelectedInterests([]);
    setSelectedFoodPreferences([]);
    setNotes('');
    setErrors({});
    if (onReset) {
      onReset();
    }
  };

  const validateAndSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!destination || !destination.trim()) {
      newErrors.destination = 'Please enter a destination.';
    }

    const durationNum = Number(duration);
    if (!durationNum || isNaN(durationNum) || durationNum < 1 || durationNum > 30) {
      newErrors.duration = 'Please enter valid days (1 to 30).';
    }

    const budgetNum = Number(budget);
    if (!budgetNum || isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = 'Please enter a valid budget greater than 0.';
    }

    const travelersNum = Number(travelers);
    if (!travelersNum || isNaN(travelersNum) || travelersNum < 1) {
      newErrors.travelers = 'Please enter at least 1 traveler.';
    }

    if (selectedTravelStyles.length === 0) {
      newErrors.travelStyle = 'Please select at least 1 travel style option.';
    }

    if (selectedFoodPreferences.length === 0) {
      newErrors.foodPreference = 'Please select at least 1 food & dining preference.';
    }

    if (selectedInterests.length === 0) {
      newErrors.interests = 'Please select at least 1 activity or interest.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto switch to specific individual step with error
      if (newErrors.destination || newErrors.duration || newErrors.budget || newErrors.travelers) {
        if (activeStep !== 'all') changeStep('logistics');
      } else if (newErrors.travelStyle) {
        if (activeStep !== 'all') changeStep('travel-style');
      } else if (newErrors.foodPreference) {
        if (activeStep !== 'all') changeStep('food-preference');
      } else if (newErrors.interests) {
        if (activeStep !== 'all') changeStep('custom');
      }
      return;
    }

    setErrors({});

    const formattedTravelStyle = selectedTravelStyles.join(' & ');
    const formattedFoodPref = selectedFoodPreferences.join(' & ');
    const dateInfo = formatDateAndDay(startDate);

    const formData: TravelPreferences = {
      destination: destination.trim(),
      duration: durationNum,
      budget: budgetNum,
      currency,
      travelers: travelersNum,
      travelStyle: formattedTravelStyle,
      travelStyles: selectedTravelStyles,
      interests: selectedInterests,
      foodPreference: formattedFoodPref,
      foodPreferences: selectedFoodPreferences,
      startDate: startDate || undefined,
      startDay: dateInfo.dayName || undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    if (onSubmit) {
      onSubmit(formData);
    } else if (onGenerateTrip) {
      onGenerateTrip(formData);
    }
  };

  const { formatted: formattedStartDate, dayName: startDayName } = formatDateAndDay(startDate);

  return (
    <div
      id="planner-form-section"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.16)',
      }}
      className="rounded-[28px] overflow-hidden transition-all duration-300"
    >
      {/* Translucent Card Header with Quick Actions & Step Switcher */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          borderBottom: '2px solid #000000',
        }}
        className="px-4 py-4 sm:px-7 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="p-1.5 bg-gradient-to-tr from-violet-700 to-indigo-700 text-white rounded-xl shadow-md flex items-center justify-center border border-black">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-heading">
              Trip Preferences
            </h2>
            <span
              style={{ border: '1.5px solid #000000' }}
              className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-black hidden sm:inline-block"
            >
              Easy Compact Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-bold">
            Configure destination, budget, group size, and custom travel parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            id="try-example-btn"
            onClick={handleTryExample}
            style={{
              border: '1.5px solid #000000',
            }}
            className="flex-1 md:flex-none px-3.5 py-2 min-h-[42px] text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            title="Auto-fill with sample Goa Trip"
          >
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            <span>Try Example</span>
          </button>

          <button
            type="button"
            id="clear-form-btn"
            onClick={handleClearForm}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1.5px solid #000000',
            }}
            className="px-3.5 py-2 min-h-[42px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Low-Scroll Step Tab Bar */}
      <div
        style={{
          background: 'rgba(248, 250, 252, 0.95)',
          borderBottom: '1.5px solid #000000',
        }}
        className="px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            type="button"
            id="step-tab-logistics"
            onClick={() => changeStep('logistics')}
            style={{
              border: activeStep === 'logistics' ? '2px solid #000000' : '1.5px solid #000000',
              background: activeStep === 'logistics' ? '#000000' : '#ffffff',
              color: activeStep === 'logistics' ? '#ffffff' : '#000000',
            }}
            className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'logistics' ? 'bg-amber-300 text-black' : 'bg-slate-200 text-slate-900'
            }`}>
              1
            </span>
            <span>Where &amp; When</span>
            {(errors.destination || errors.duration || errors.budget || errors.travelers) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            id="step-tab-travel-style"
            onClick={() => changeStep('travel-style')}
            style={{
              border: (activeStep === 'travel-style' || activeStep === 'preferences') ? '2px solid #000000' : '1.5px solid #000000',
              background: (activeStep === 'travel-style' || activeStep === 'preferences') ? '#000000' : '#ffffff',
              color: (activeStep === 'travel-style' || activeStep === 'preferences') ? '#ffffff' : '#000000',
            }}
            className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              (activeStep === 'travel-style' || activeStep === 'preferences') ? 'bg-amber-300 text-black' : 'bg-slate-200 text-slate-900'
            }`}>
              2
            </span>
            <Compass className="w-3.5 h-3.5" />
            <span>Travel Style</span>
            {selectedTravelStyles.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                (activeStep === 'travel-style' || activeStep === 'preferences') ? 'bg-violet-700 text-white' : 'bg-slate-200 text-slate-900'
              }`}>
                {selectedTravelStyles.length}
              </span>
            )}
            {errors.travelStyle && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            id="step-tab-food-preference"
            onClick={() => changeStep('food-preference')}
            style={{
              border: activeStep === 'food-preference' ? '2px solid #000000' : '1.5px solid #000000',
              background: activeStep === 'food-preference' ? '#000000' : '#ffffff',
              color: activeStep === 'food-preference' ? '#ffffff' : '#000000',
            }}
            className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'food-preference' ? 'bg-amber-300 text-black' : 'bg-slate-200 text-slate-900'
            }`}>
              3
            </span>
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Preference</span>
            {selectedFoodPreferences.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                activeStep === 'food-preference' ? 'bg-amber-400 text-black' : 'bg-slate-200 text-slate-900'
              }`}>
                {selectedFoodPreferences.length}
              </span>
            )}
            {errors.foodPreference && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            id="step-tab-custom"
            onClick={() => changeStep('custom')}
            style={{
              border: activeStep === 'custom' ? '2px solid #000000' : '1.5px solid #000000',
              background: activeStep === 'custom' ? '#000000' : '#ffffff',
              color: activeStep === 'custom' ? '#ffffff' : '#000000',
            }}
            className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'custom' ? 'bg-amber-300 text-black' : 'bg-slate-200 text-slate-900'
            }`}>
              4
            </span>
            <Tag className="w-3.5 h-3.5" />
            <span>Activities &amp; Notes</span>
            {selectedInterests.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                activeStep === 'custom' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-900'
              }`}>
                {selectedInterests.length}
              </span>
            )}
          </button>
        </div>

        {/* Toggle between Step Mode (No Scroll) and All Steps Mode */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-mono font-bold">
          <button
            type="button"
            id="step-tab-all"
            onClick={() => changeStep(activeStep === 'all' ? 'logistics' : 'all')}
            style={{
              border: '1.5px solid #000000',
              background: activeStep === 'all' ? '#000000' : '#ffffff',
              color: activeStep === 'all' ? '#ffffff' : '#000000',
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
            title="Toggle between single step view or full page scroll view"
          >
            {activeStep === 'all' ? (
              <>
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>Single Step Mode</span>
              </>
            ) : (
              <>
                <List className="w-3.5 h-3.5" />
                <span>View All Steps</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={validateAndSubmit} className="p-3 sm:p-6 space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: DESTINATION, TIMELINE & BUDGET */}
        {/* ========================================================================= */}
        {(activeStep === 'logistics' || activeStep === 'all') && (
          <div
            id="form-step-logistics"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1.5px solid #000000',
            }}
            className="rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm backdrop-blur-md animate-fade-in"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black text-amber-300 font-mono font-black text-xs">
                  STEP 1 OF 4
                </span>
                <h3 className="text-base sm:text-lg font-black text-black font-heading">
                  Destination, Dates &amp; Budget
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                Core Travel Logistics
              </span>
            </div>

            {/* Row 1: Destination, Travel Date & Day, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
              {/* Destination Field with Autocomplete & Explorer */}
              <div className="md:col-span-5 relative" ref={destinationDropdownRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="destination-input">
                    Destination <span className="text-rose-600">*</span>
                  </label>
                  {onOpenDestinationsModal && (
                    <button
                      type="button"
                      onClick={onOpenDestinationsModal}
                      className="text-xs font-mono font-extrabold text-violet-800 hover:text-black flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>See All Places</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-violet-700">
                    <MapPin className="w-5 h-5 text-violet-700 font-bold" />
                  </div>
                  <input
                    id="destination-input"
                    type="text"
                    value={destination}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setShowDestinationSuggestions(true);
                      if (errors.destination) setErrors({ ...errors, destination: '' });
                    }}
                    placeholder="e.g. Goa, Manali, Kerala, Kashmir, Jaipur, Bali, Paris..."
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: errors.destination ? '2px solid #e11d48' : '1.5px solid #000000',
                    }}
                    className="w-full pl-11 pr-4 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 font-bold placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-black text-sm sm:text-base shadow-sm"
                  />

                  {/* Autocomplete Dropdown */}
                  {showDestinationSuggestions && matchingSuggestions.length > 0 && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        border: '2px solid #000000',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2)',
                      }}
                      className="absolute left-0 right-0 top-full mt-1 rounded-2xl p-2 z-50 backdrop-blur-xl animate-fade-in max-h-56 overflow-y-auto"
                    >
                      <div className="flex items-center justify-between px-2.5 py-1 mb-1 border-b border-black/10 text-[11px] font-mono font-extrabold text-slate-600">
                        <span>AVAILABLE DESTINATIONS</span>
                        {onOpenDestinationsModal && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowDestinationSuggestions(false);
                              onOpenDestinationsModal();
                            }}
                            className="text-violet-700 hover:underline cursor-pointer"
                          >
                            Catalog →
                          </button>
                        )}
                      </div>
                      <div className="space-y-1">
                        {matchingSuggestions.map((sug) => (
                          <button
                            key={sug.id}
                            type="button"
                            onClick={() => handleSelectPredefinedDestination(sug)}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-violet-50 transition-colors cursor-pointer border border-transparent hover:border-black/20 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={sug.image}
                                alt={sug.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-extrabold text-black truncate group-hover:text-violet-900">
                                  {sug.name}
                                </p>
                                <p className="text-[10px] text-slate-600 truncate font-semibold">
                                  {sug.stateOrCountry} • {sug.category}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black text-amber-300 shrink-0">
                              {sug.idealDuration}D
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.destination ? (
                  <p className="mt-1 text-xs text-rose-800 font-extrabold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.destination}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-700 font-bold">
                    Select verified destinations or type any city globally.
                  </p>
                )}
              </div>

              {/* Date & Day Column */}
              <div className="md:col-span-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="start-date-input">
                    Travel Date &amp; Day
                  </label>
                  {startDayName && (
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="text-xs font-mono font-extrabold px-2 py-0.5 text-black rounded-md shadow-2xs"
                    >
                      {startDayName}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-violet-700">
                    <Calendar className="w-4 h-4 text-violet-700 font-bold" />
                  </div>
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="w-full pl-10 pr-3 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-black text-sm sm:text-base shadow-sm"
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-800 font-bold">
                  <span>{formattedStartDate ? `Starts ${formattedStartDate}` : 'Select departure'}</span>
                  <button
                    type="button"
                    onClick={() => setStartDate(getTomorrowDateStr())}
                    className="text-indigo-950 hover:text-black font-extrabold cursor-pointer uppercase font-mono hover:underline"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>

              {/* Duration Field */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="duration-input">
                    Duration <span className="text-rose-600">*</span>
                  </label>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="text-xs font-mono font-extrabold px-2 py-0.5 text-black rounded-md shadow-2xs"
                  >
                    {duration}D
                  </span>
                </div>
                <div className="relative flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-700">
                      <Clock className="w-4 h-4 text-violet-700 font-bold" />
                    </div>
                    <input
                      id="duration-input"
                      type="number"
                      min="1"
                      max="30"
                      value={duration}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setDuration('');
                        } else {
                          const parsed = parseInt(val, 10);
                          if (!isNaN(parsed)) {
                            setDuration(Math.max(1, Math.min(30, parsed)));
                          }
                        }
                        if (errors.duration) setErrors({ ...errors, duration: '' });
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: errors.duration ? '2px solid #e11d48' : '1.5px solid #000000',
                      }}
                      className="w-full pl-9 pr-2 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-black text-sm sm:text-base shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setDuration((prev) => {
                          const num = typeof prev === 'number' ? prev : parseInt(prev, 10) || 1;
                          return Math.max(1, num - 1);
                        });
                        if (errors.duration) setErrors({ ...errors, duration: '' });
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl hover:bg-black hover:text-white text-black font-extrabold text-lg flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDuration((prev) => {
                          const num = typeof prev === 'number' ? prev : parseInt(prev, 10) || 0;
                          return Math.min(30, num + 1);
                        });
                        if (errors.duration) setErrors({ ...errors, duration: '' });
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl hover:bg-black hover:text-white text-black font-extrabold text-lg flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Day Chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[2, 3, 4, 5, 7, 10].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDuration(d);
                        if (errors.duration) setErrors({ ...errors, duration: '' });
                      }}
                      style={{
                        border: '1px solid #000000',
                      }}
                      className={`px-1.5 py-0.5 text-[11px] font-mono font-extrabold rounded-md transition-all cursor-pointer ${
                        Number(duration) === d
                          ? 'bg-black text-amber-300'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Budget & Travelers */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
              {/* Budget Field */}
              <div className="md:col-span-7">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="budget-input">
                    Total Budget <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    Any Amount Supported
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="w-24 sm:w-32 px-2 py-2.5 min-h-[44px] rounded-xl font-extrabold text-black focus:outline-hidden focus:ring-2 focus:ring-black text-xs sm:text-sm font-mono shrink-0 shadow-sm"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800 font-extrabold">
                      <DollarSign className="w-4 h-4 text-emerald-800 font-extrabold" />
                    </div>
                    <input
                      id="budget-input"
                      type="number"
                      min="1"
                      value={budget}
                      onChange={(e) => {
                        setBudget(e.target.value);
                        if (errors.budget) setErrors({ ...errors, budget: '' });
                      }}
                      placeholder="Budget amount..."
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: errors.budget ? '2px solid #e11d48' : '1.5px solid #000000',
                      }}
                      className="w-full pl-10 pr-3 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-black font-extrabold focus:outline-hidden focus:ring-2 focus:ring-black font-mono text-sm sm:text-base shadow-sm"
                    />
                  </div>
                </div>

                {/* Quick Budget Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-mono text-black font-extrabold uppercase mr-0.5">Quick:</span>
                  {(currency === '₹'
                    ? [
                        { label: 'Moderate', val: '15000' },
                        { label: 'Comfort', val: '25000' },
                        { label: 'Luxury', val: '60000' },
                      ]
                    : [
                        { label: 'Moderate', val: '800' },
                        { label: 'Comfort', val: '1600' },
                        { label: 'Luxury', val: '3500' },
                      ]
                  ).map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setBudget(preset.val);
                        if (errors.budget) setErrors({ ...errors, budget: '' });
                      }}
                      style={{
                        background: budget === preset.val ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                        budget === preset.val
                          ? 'bg-black text-white font-extrabold'
                          : 'text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {preset.label} ({currency}{Number(preset.val).toLocaleString()})
                    </button>
                  ))}
                </div>
              </div>

              {/* Travelers Field */}
              <div className="md:col-span-5">
                <label className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5" htmlFor="travelers-input">
                  Travelers <span className="text-rose-600">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-violet-700">
                      <Users className="w-4 h-4 text-violet-700 font-bold" />
                    </div>
                    <input
                      id="travelers-input"
                      type="number"
                      min="1"
                      max="20"
                      value={travelers}
                      onChange={(e) => {
                        setTravelers(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)));
                        if (errors.travelers) setErrors({ ...errors, travelers: '' });
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: errors.travelers ? '2px solid #e11d48' : '1.5px solid #000000',
                      }}
                      className="w-full pl-10 pr-2 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-black text-sm sm:text-base shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {[
                      { count: 1, label: 'Solo' },
                      { count: 2, label: 'Duo' },
                      { count: 4, label: '4+' },
                    ].map((p) => (
                      <button
                        key={p.count}
                        type="button"
                        onClick={() => setTravelers(p.count)}
                        style={{
                          background: travelers === p.count ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                          border: '1.5px solid #000000',
                        }}
                        className={`px-3 py-2 min-h-[40px] text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                          travelers === p.count
                            ? 'bg-black text-white'
                            : 'text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-700 font-bold">
                  {travelers === 1 ? 'Solo Trip' : travelers === 2 ? 'Couple / 2 Friends' : `${travelers} People Group`}
                </p>
              </div>
            </div>

            {/* Quick Step 1 Navigation Buttons (Avoids scrolling) */}
            {activeStep === 'logistics' && (
              <div className="pt-3 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  id="step1-next-btn"
                  onClick={() => changeStep('travel-style')}
                  style={{ border: '2px solid #000000' }}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black bg-white hover:bg-slate-100 text-black flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Customize Travel Style →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Fast Generate Button directly from Step 1 */}
                <button
                  type="button"
                  id="step1-fast-generate-btn"
                  onClick={() => validateAndSubmit()}
                  disabled={isLoading}
                  style={{ border: '2px solid #000000' }}
                  className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  title="Generate instantly with smart default preferences"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isLoading ? 'Calculating...' : 'Generate Trip (Fast)'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: TRAVEL STYLE OPTIONS (INDIVIDUAL & DISTINCT OPTION) */}
        {/* ========================================================================= */}
        {(activeStep === 'travel-style' || activeStep === 'preferences' || activeStep === 'all') && (
          <div
            id="form-step-travel-style"
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: errors.travelStyle ? '2.5px solid #e11d48' : '2px solid #000000',
            }}
            className="rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm backdrop-blur-md animate-fade-in"
          >
            {/* Step Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-violet-900 text-amber-300 font-mono font-black text-xs flex items-center gap-1 border border-black">
                  <Compass className="w-3.5 h-3.5" />
                  <span>STEP 2 OF 4: INDIVIDUAL OPTION</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-black font-heading">
                  Travel Style Options
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${
                  selectedTravelStyles.length === 0
                    ? 'bg-rose-100 text-rose-800 border-rose-400 font-black'
                    : 'bg-black text-amber-300 border-black'
                }`}>
                  {selectedTravelStyles.length > 0 ? `${selectedTravelStyles.length} Styles Selected` : 'None Selected (Pick at least 1)'}
                </span>
                {selectedTravelStyles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTravelStyles([])}
                    className="text-[11px] font-mono font-bold text-slate-600 hover:text-rose-600 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium">
              Select one or multiple vibes that match your journey. Activities and daily pacing will be curated around these styles.
            </p>

            {/* Category Filter Pills for Travel Styles */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono font-extrabold text-slate-700 uppercase mr-1 shrink-0">
                Filter:
              </span>
              {[
                { id: 'All', label: `All Styles (${TRAVEL_STYLES.length})` },
                { id: 'Active & Outdoor', label: 'Active & Outdoor' },
                { id: 'Leisure & Comfort', label: 'Leisure & Comfort' },
                { id: 'Culture & Heritage', label: 'Culture & Heritage' },
                { id: 'Social & Explorer', label: 'Social & Explorer' },
                { id: 'Specialty', label: 'Specialty' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setStyleCategoryFilter(cat.id)}
                  style={{
                    border: styleCategoryFilter === cat.id ? '1.5px solid #000000' : '1px solid #cbd5e1',
                    background: styleCategoryFilter === cat.id ? '#000000' : '#ffffff',
                    color: styleCategoryFilter === cat.id ? '#ffffff' : '#334155',
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all shadow-2xs"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Popular 1-Click Travel Style Combos */}
            <div className="p-3 bg-violet-50/80 border border-violet-200 rounded-xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-black text-violet-900 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Popular 1-Click Style Combos:</span>
                </span>
                <span className="text-[10px] text-slate-600 font-bold hidden sm:inline">Click to instantly apply</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_STYLE_COMBOS.map((combo) => {
                  const isFullyApplied = combo.styles.every((s) => selectedTravelStyles.includes(s));
                  return (
                    <button
                      key={combo.label}
                      type="button"
                      onClick={() => {
                        setSelectedTravelStyles((prev) => {
                          const set = new Set(prev);
                          combo.styles.forEach((s) => set.add(s));
                          return Array.from(set);
                        });
                        setErrors((prev) => ({ ...prev, travelStyle: undefined }));
                      }}
                      style={{
                        border: isFullyApplied ? '1.5px solid #000000' : '1px solid #c4b5fd',
                        background: isFullyApplied ? '#000000' : '#ffffff',
                        color: isFullyApplied ? '#fde047' : '#4338ca',
                      }}
                      className="px-2.5 py-1 text-xs font-extrabold rounded-lg hover:border-black cursor-pointer transition-all shadow-2xs flex items-center gap-1"
                    >
                      <span>{combo.label}</span>
                      {isFullyApplied && <span className="text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel Styles Grid (Individual Distinct Option Display) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {TRAVEL_STYLES.filter(
                (style) => styleCategoryFilter === 'All' || style.category === styleCategoryFilter
              ).map((style) => {
                const isSelected = selectedTravelStyles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    type="button"
                    id={`style-btn-${style.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleTravelStyleToggle(style.id)}
                    style={{
                      background: isSelected ? 'rgba(238, 242, 255, 0.98)' : '#ffffff',
                      border: isSelected ? '2px solid #000000' : '1.5px solid #cbd5e1',
                    }}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs hover:border-black hover:shadow-xs active:scale-98 ${
                      isSelected ? 'ring-2 ring-violet-600/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 p-1 bg-slate-100 rounded-lg border border-slate-200">
                          {style.icon}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-black text-black leading-tight">
                            {style.label}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-100 px-1.5 py-0.2 rounded border border-violet-200 inline-block mt-0.5">
                            {style.category}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-xs font-black flex items-center justify-center border border-black shadow-2xs">
                            ✓
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-semibold line-clamp-2 leading-relaxed">
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {errors.travelStyle && (
              <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-600 text-rose-950 text-xs font-black flex items-center gap-2 animate-bounce-slow">
                <AlertCircle className="w-4 h-4 text-rose-800 shrink-0" />
                <span>Please select at least 1 Travel Style to shape your itinerary.</span>
              </div>
            )}

            {/* Travel Style Step Stepper Navigation */}
            {(activeStep === 'travel-style' || activeStep === 'preferences') && (
              <div className="pt-3 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  id="travel-style-prev-btn"
                  onClick={() => changeStep('logistics')}
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full sm:w-auto px-4 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back: Where &amp; When</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id="travel-style-next-btn"
                    onClick={() => {
                      if (selectedTravelStyles.length === 0) {
                        setErrors((prev) => ({ ...prev, travelStyle: 'Please select at least 1 travel style.' }));
                      } else {
                        changeStep('food-preference');
                      }
                    }}
                    style={{ border: '2px solid #000000' }}
                    className="flex-1 sm:flex-none px-5 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-black text-black bg-amber-300 hover:bg-amber-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Next: Food Preference →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="travel-style-generate-btn"
                    onClick={() => validateAndSubmit()}
                    disabled={isLoading}
                    style={{ border: '2px solid #000000' }}
                    className="flex-1 sm:flex-none px-5 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Generate Fast</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: FOOD & DINING PREFERENCES (INDIVIDUAL & DISTINCT OPTION) */}
        {/* ========================================================================= */}
        {(activeStep === 'food-preference' || activeStep === 'all') && (
          <div
            id="form-step-food-preference"
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: errors.foodPreference ? '2.5px solid #e11d48' : '2px solid #000000',
            }}
            className="rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm backdrop-blur-md animate-fade-in"
          >
            {/* Step Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-black font-mono font-black text-xs flex items-center gap-1 border border-black">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>STEP 3 OF 4: INDIVIDUAL OPTION</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-black font-heading">
                  Food &amp; Dining Preferences
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${
                  selectedFoodPreferences.length === 0
                    ? 'bg-rose-100 text-rose-800 border-rose-400 font-black'
                    : 'bg-black text-amber-300 border-black'
                }`}>
                  {selectedFoodPreferences.length > 0 ? `${selectedFoodPreferences.length} Diets Selected` : 'None Selected (Pick at least 1)'}
                </span>
                {selectedFoodPreferences.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFoodPreferences([])}
                    className="text-[11px] font-mono font-bold text-slate-600 hover:text-rose-600 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium">
              Specify your culinary standards. Meal suggestions, breakfast spots, and signature dinner recommendations will strictly adhere to these choices.
            </p>

            {/* Dietary Group Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono font-extrabold text-slate-700 uppercase mr-1 shrink-0">
                Filter:
              </span>
              {[
                { id: 'All', label: `All Diets (${FOOD_PREFERENCES.length})` },
                { id: 'Pure Veg & Jain', label: 'Pure Veg & Jain' },
                { id: 'Non-Vegetarian', label: 'Non-Vegetarian & Halal' },
                { id: 'Plant-Based', label: 'Plant-Based & Healthy' },
                { id: 'Specialty & Dining', label: 'Specialty & Gourmet' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setFoodGroupFilter(grp.id)}
                  style={{
                    border: foodGroupFilter === grp.id ? '1.5px solid #000000' : '1px solid #cbd5e1',
                    background: foodGroupFilter === grp.id ? '#000000' : '#ffffff',
                    color: foodGroupFilter === grp.id ? '#ffffff' : '#334155',
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all shadow-2xs"
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Popular 1-Click Food Combos */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-black text-amber-950 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>Popular 1-Click Food Combos:</span>
                </span>
                <span className="text-[10px] text-slate-600 font-bold hidden sm:inline">Click to instantly apply</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_FOOD_COMBOS.map((combo) => {
                  const isFullyApplied = combo.prefs.every((p) => selectedFoodPreferences.includes(p));
                  return (
                    <button
                      key={combo.label}
                      type="button"
                      onClick={() => {
                        setSelectedFoodPreferences((prev) => {
                          const set = new Set(prev);
                          combo.prefs.forEach((p) => set.add(p));
                          return Array.from(set);
                        });
                        setErrors((prev) => ({ ...prev, foodPreference: undefined }));
                      }}
                      style={{
                        border: isFullyApplied ? '1.5px solid #000000' : '1px solid #fcd34d',
                        background: isFullyApplied ? '#000000' : '#ffffff',
                        color: isFullyApplied ? '#fde047' : '#78350f',
                      }}
                      className="px-2.5 py-1 text-xs font-extrabold rounded-lg hover:border-black cursor-pointer transition-all shadow-2xs flex items-center gap-1"
                    >
                      <span>{combo.label}</span>
                      {isFullyApplied && <span className="text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food Preferences Grid (Individual Distinct Option Display) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {FOOD_PREFERENCES.filter(
                (food) => foodGroupFilter === 'All' || food.dietGroup === foodGroupFilter
              ).map((food) => {
                const isSelected = selectedFoodPreferences.includes(food.id);
                return (
                  <button
                    key={food.id}
                    type="button"
                    id={`food-btn-${food.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleFoodPreferenceToggle(food.id)}
                    style={{
                      background: isSelected ? 'rgba(254, 243, 199, 0.95)' : '#ffffff',
                      border: isSelected ? '2px solid #000000' : '1.5px solid #cbd5e1',
                    }}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs hover:border-black hover:shadow-xs active:scale-98 ${
                      isSelected ? 'ring-2 ring-amber-500/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 p-1 bg-amber-100 rounded-lg border border-amber-200">
                          {food.icon}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-black text-black leading-tight">
                            {food.label}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 inline-block mt-0.5">
                            {food.badge}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-xs font-black flex items-center justify-center border border-black shadow-2xs">
                            ✓
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-semibold line-clamp-2 leading-relaxed">
                      {food.note}
                    </p>
                  </button>
                );
              })}
            </div>

            {errors.foodPreference && (
              <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-600 text-rose-950 text-xs font-black flex items-center gap-2 animate-bounce-slow">
                <AlertCircle className="w-4 h-4 text-rose-800 shrink-0" />
                <span>Please select at least 1 Food &amp; Dining preference to proceed.</span>
              </div>
            )}

            {/* Food Preference Step Stepper Navigation */}
            {activeStep === 'food-preference' && (
              <div className="pt-3 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  id="food-preference-prev-btn"
                  onClick={() => changeStep('travel-style')}
                  style={{ border: '1.5px solid #000000' }}
                  className="w-full sm:w-auto px-4 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back: Travel Style</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id="food-preference-next-btn"
                    onClick={() => {
                      if (selectedFoodPreferences.length === 0) {
                        setErrors((prev) => ({ ...prev, foodPreference: 'Please select at least 1 food preference.' }));
                      } else {
                        changeStep('custom');
                      }
                    }}
                    style={{ border: '2px solid #000000' }}
                    className="flex-1 sm:flex-none px-5 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-black text-black bg-amber-300 hover:bg-amber-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Next: Activities &amp; Notes →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="food-preference-generate-btn"
                    onClick={() => validateAndSubmit()}
                    disabled={isLoading}
                    style={{ border: '2px solid #000000' }}
                    className="flex-1 sm:flex-none px-5 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Generate Fast</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: INTERESTS & CUSTOM NOTES */}
        {/* ========================================================================= */}
        {(activeStep === 'custom' || activeStep === 'all') && (
          <div
            id="form-step-custom"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '2px solid #000000',
            }}
            className="rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm backdrop-blur-md animate-fade-in"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black text-amber-300 font-mono font-black text-xs">
                  STEP 4 OF 4
                </span>
                <h3 className="text-base sm:text-lg font-black text-black font-heading">
                  Activities &amp; Special Desires
                </h3>
              </div>
              <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                selectedInterests.length === 0
                  ? 'bg-rose-200 text-rose-900 border border-rose-400 font-black'
                  : 'bg-black text-amber-300'
              }`}>
                {selectedInterests.length > 0 ? `${selectedInterests.length} Chosen` : 'None Selected'}
              </span>
            </div>

            {/* Interests Chips Card with Red Background if Unselected */}
            <div
              id="interests-selection-card"
              style={{
                border: errors.interests ? '2.5px solid #e11d48' : '1.5px solid #000000',
                background: errors.interests ? '#ffe4e6' : 'rgba(255, 255, 255, 0.95)',
              }}
              className={`p-4 sm:p-5 rounded-2xl transition-all space-y-3 ${
                errors.interests
                  ? 'ring-4 ring-rose-500/40 shadow-md'
                  : 'shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-violet-700" />
                  <span>Activities &amp; Interests <span className="text-rose-600">*</span></span>
                </label>
                <span className={`text-xs font-mono font-extrabold ${selectedInterests.length === 0 ? 'text-rose-700' : 'text-slate-800'}`}>
                  Select what you enjoy
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      style={{
                        background: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                        isSelected
                          ? 'bg-black text-white shadow-xs'
                          : 'text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected && <span className="text-[10px] font-black text-amber-300">✓</span>}
                    </button>
                  );
                })}
              </div>

              {errors.interests && (
                <div className="p-2.5 rounded-xl bg-rose-200 border-2 border-rose-600 text-rose-950 text-xs font-black flex items-center gap-2 animate-bounce-slow">
                  <AlertCircle className="w-4 h-4 text-rose-800 shrink-0" />
                  <span>Please select at least 1 activity or interest.</span>
                </div>
              )}
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5 pt-3 border-t border-black/15">
              <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center justify-between" htmlFor="special-notes-input">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-700" />
                  <span>Custom Requests (Optional)</span>
                </span>
                <span className="text-slate-600 text-xs font-normal">pace, accessibility, celebration</span>
              </label>
              <input
                id="special-notes-input"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Easy walking pace, anniversary dinner, scenic photography spots..."
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #000000',
                }}
                className="w-full px-4 py-2.5 rounded-xl text-slate-950 font-bold placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-black text-sm shadow-sm"
              />
            </div>

            {/* Step 4 Stepper Navigation */}
            {activeStep === 'custom' && (
              <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="step4-prev-btn"
                  onClick={() => changeStep('food-preference')}
                  style={{ border: '1.5px solid #000000' }}
                  className="px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back: Food Preference</span>
                </button>

                <button
                  type="button"
                  id="step3-generate-btn"
                  onClick={() => validateAndSubmit()}
                  disabled={isLoading}
                  style={{ border: '2px solid #000000' }}
                  className="px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isLoading ? 'Calculating...' : 'Generate My Trip'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Global Submit Bar (Shown in All Steps Mode or as bottom anchor) */}
        {(activeStep === 'all' || activeStep === 'custom') && (
          <div
            style={{
              borderTop: '1.5px solid #000000',
            }}
            className="pt-4 flex flex-col sm:flex-row items-center gap-3"
          >
            <button
              type="submit"
              id="generate-my-trip-btn"
              disabled={isLoading}
              style={{
                border: '2px solid #000000',
              }}
              className={`flex-1 w-full py-3.5 min-h-[50px] px-6 sm:px-8 rounded-2xl font-black text-base sm:text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isLoading
                  ? 'bg-indigo-900/80 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 hover:from-violet-800 hover:via-indigo-800 hover:to-blue-800 active:scale-[0.99]'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>{isLoading ? 'Calculating Optimal Itinerary...' : 'Generate My Trip'}</span>
            </button>

            <button
              type="button"
              id="reset-all-bottom-btn"
              onClick={handleClearForm}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid #000000',
              }}
              className="w-full sm:w-auto px-5 py-3 min-h-[50px] rounded-2xl font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              title="Reset all form fields"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

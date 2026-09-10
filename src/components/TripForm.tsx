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
  const [startDate, setStartDate] = useState<string>(initialValues?.startDate || '');
  const [duration, setDuration] = useState<number | string>(initialValues?.duration !== undefined ? initialValues.duration : '');
  const [budget, setBudget] = useState<string>(initialValues?.budget !== undefined ? initialValues.budget.toString() : '');
  const [currency, setCurrency] = useState(initialValues?.currency || '₹');
  const [travelers, setTravelers] = useState<number | string>(initialValues?.travelers !== undefined ? initialValues.travelers : '');
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<TravelStyle[]>(getInitialTravelStyles);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialValues?.interests || []
  );
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState<FoodPreference[]>(getInitialFoodPreferences);
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);

  // "Let Me Think" draft state
  const [showThinkModal, setShowThinkModal] = useState<boolean>(false);
  const [hasSessionDraft, setHasSessionDraft] = useState<boolean>(false);

  // Clear any older drafts from session on mount to guarantee a fresh, blank start on every refresh or visit
  useEffect(() => {
    try {
      sessionStorage.removeItem('tripholic_form_think_draft');
      sessionStorage.removeItem('tripholic_booking_think_draft');
    } catch {}
  }, []);

  // Stepper / Individual option view mode
  const [activeStep, setActiveStep] = useState<FormStep>('logistics');

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
    // Keep travel styles, food preferences, and activities blank so user can select freely
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
    if (initialValues && Object.keys(initialValues).length > 0) {
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
      } else {
        setSelectedTravelStyles([]);
      }
      if (initialValues.interests !== undefined) {
        setSelectedInterests(initialValues.interests);
      } else {
        setSelectedInterests([]);
      }
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
      } else {
        setSelectedFoodPreferences([]);
      }
      if (initialValues.notes !== undefined) setNotes(initialValues.notes || '');
    } else {
      // When anyone visits website or starts a new trip:
      // Give them all blank columns of selection so they can use their own mind to select what they want
      setSelectedTravelStyles([]);
      setSelectedFoodPreferences([]);
      setSelectedInterests([]);
      setDestination('');
      setStartDate('');
      setDuration('');
      setBudget('');
      setCurrency('₹');
      setTravelers('');
      setNotes('');
      setErrors({});
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

  // Clear all selection columns to 100% blank
  const handleClearForm = () => {
    setDestination('');
    setStartDate('');
    setDuration('');
    setBudget('');
    setCurrency('₹');
    setTravelers('');
    setSelectedTravelStyles([]);
    setSelectedInterests([]);
    setSelectedFoodPreferences([]);
    setNotes('');
    setErrors({});
    if (onReset) {
      onReset();
    }
  };

  // "Let Me Think" option: saves current preferences to sessionStorage (active session only)
  const handleLetMeThink = () => {
    try {
      sessionStorage.setItem(
        'tripholic_form_think_draft',
        JSON.stringify({
          destination,
          startDate,
          duration,
          budget,
          currency,
          travelers,
          selectedTravelStyles,
          selectedFoodPreferences,
          selectedInterests,
          notes,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      );
      setHasSessionDraft(true);
    } catch {}
    setShowThinkModal(true);
  };

  // Restore choices saved during this session
  const handleRestoreDraft = () => {
    try {
      const raw = sessionStorage.getItem('tripholic_form_think_draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.destination !== undefined) setDestination(draft.destination);
        if (draft.startDate !== undefined) setStartDate(draft.startDate);
        if (draft.duration !== undefined) setDuration(draft.duration);
        if (draft.budget !== undefined) setBudget(draft.budget);
        if (draft.currency !== undefined) setCurrency(draft.currency);
        if (draft.travelers !== undefined) setTravelers(draft.travelers);
        if (Array.isArray(draft.selectedTravelStyles)) setSelectedTravelStyles(draft.selectedTravelStyles);
        if (Array.isArray(draft.selectedFoodPreferences)) setSelectedFoodPreferences(draft.selectedFoodPreferences);
        if (Array.isArray(draft.selectedInterests)) setSelectedInterests(draft.selectedInterests);
        if (draft.notes !== undefined) setNotes(draft.notes);
      }
    } catch {}
  };

  // Dismiss banner and keep current blank view
  const handleDismissDraft = () => {
    setHasSessionDraft(false);
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

    // Trip preferences (Travel Style, Food, Activities) are optional - user is free to pick any or none
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (activeStep !== 'all') changeStep('logistics');
      return;
    }

    setErrors({});

    const formattedTravelStyle = selectedTravelStyles.length > 0
      ? selectedTravelStyles.join(' & ')
      : 'Balanced Explorer';
    const formattedFoodPref = selectedFoodPreferences.length > 0
      ? selectedFoodPreferences.join(' & ')
      : 'All Cuisines & Local Delights';
    const dateInfo = formatDateAndDay(startDate);

    const formData: TravelPreferences = {
      destination: destination.trim(),
      duration: durationNum,
      budget: budgetNum,
      currency,
      travelers: travelersNum,
      travelStyle: formattedTravelStyle,
      travelStyles: selectedTravelStyles,
      interests: selectedInterests.length > 0 ? selectedInterests : ['Highlights & Local Culture'],
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
      className="rounded-3xl overflow-hidden transition-all duration-300 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.07)]"
    >
      {/* Executive Top Accent Ribbon */}
      <div className="h-1 bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 w-full" />

      {/* Official Business Statement Metadata Header Line */}
      <div className="px-4 py-2 sm:px-7 sm:py-2.5 bg-slate-900 text-slate-200 text-[10px] sm:text-xs font-mono flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 tracking-wider">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-black">
            STATEMENT REF: TS-2026-SPEC
          </span>
          <span className="text-slate-400 hidden sm:inline">
            // CONFIDENTIAL ITINERARY SPECIFICATION DIRECTIVE
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-400">SPECIFICATION DRAFT</span>
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">REV: 1.0</span>
        </div>
      </div>

      {/* Translucent Card Header with Quick Actions & Step Switcher */}
      <div className="px-4 py-4 sm:px-7 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="p-2 bg-slate-950 dark:bg-indigo-600 text-white rounded-xl shadow-xs flex items-center justify-center border border-slate-800 dark:border-indigo-500">
              <Compass className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-indigo-400 dark:text-amber-300" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white font-heading">
                Trip Preferences &amp; Logistics Statement
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium ml-0.5">
            Formalized travel parameters, dietary compliance directives, and experiential archetype constraints.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            id="try-example-btn"
            onClick={handleTryExample}
            className="flex-1 md:flex-none px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-800 dark:border-indigo-500"
            title="Auto-fill with sample Goa Trip"
          >
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            <span>Try Example</span>
          </button>

          <button
            type="button"
            id="clear-form-btn"
            onClick={handleClearForm}
            className="px-3 py-2 min-h-[40px] text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reset all fields to blank"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            id="think-form-header-btn"
            onClick={handleLetMeThink}
            className="px-3 py-2 min-h-[40px] text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Save your preferences to think about"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Let Me Think</span>
          </button>
        </div>
      </div>

      {/* "Let Me Think" Active Session Notification Banner */}
      {hasSessionDraft && (
        <div className="px-4 py-2.5 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              You have a saved <strong>'Let Me Think'</strong> draft in this browser session. Current columns remain blank so you can select with your own mind.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="restore-think-draft-btn"
              onClick={handleRestoreDraft}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-bold text-[11px] hover:bg-amber-100 cursor-pointer shadow-2xs"
            >
              Restore Selections
            </button>
            <button
              type="button"
              id="dismiss-think-draft-btn"
              onClick={handleDismissDraft}
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 cursor-pointer underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Low-Scroll Step Tab Bar - Executive Segmented Audit Ribbon */}
      <div className="px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            type="button"
            id="step-tab-logistics"
            onClick={() => changeStep('logistics')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 border ${
              activeStep === 'logistics'
                ? 'bg-slate-950 text-white dark:bg-indigo-600 dark:text-white border-slate-950 dark:border-indigo-500 shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'logistics' ? 'bg-amber-300 text-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
            className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 border ${
              (activeStep === 'travel-style' || activeStep === 'preferences')
                ? 'bg-slate-950 text-white dark:bg-indigo-600 dark:text-white border-slate-950 dark:border-indigo-500 shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              (activeStep === 'travel-style' || activeStep === 'preferences') ? 'bg-amber-300 text-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              2
            </span>
            <Compass className="w-3.5 h-3.5" />
            <span>Travel Style</span>
            {selectedTravelStyles.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                (activeStep === 'travel-style' || activeStep === 'preferences') ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {selectedTravelStyles.length}
              </span>
            )}
          </button>

          <button
            type="button"
            id="step-tab-food-preference"
            onClick={() => changeStep('food-preference')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 border ${
              activeStep === 'food-preference'
                ? 'bg-slate-950 text-white border-slate-950 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-400'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'food-preference' ? 'bg-amber-300 text-black' : 'bg-slate-100 text-slate-700'
            }`}>
              3
            </span>
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Preference</span>
            {selectedFoodPreferences.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                activeStep === 'food-preference' ? 'bg-amber-400 text-black' : 'bg-slate-100 text-slate-700'
              }`}>
                {selectedFoodPreferences.length}
              </span>
            )}
          </button>

          <button
            type="button"
            id="step-tab-custom"
            onClick={() => changeStep('custom')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 border ${
              activeStep === 'custom'
                ? 'bg-slate-950 text-white dark:bg-indigo-600 dark:text-white border-slate-950 dark:border-indigo-500 shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'custom' ? 'bg-amber-300 text-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              4
            </span>
            <Tag className="w-3.5 h-3.5" />
            <span>Activities &amp; Notes</span>
            {selectedInterests.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                activeStep === 'custom' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border ${
              activeStep === 'all'
                ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
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
      <form onSubmit={validateAndSubmit} autoComplete="off" className="p-3 sm:p-6 space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: DESTINATION, TIMELINE & BUDGET */}
        {/* ========================================================================= */}
        {(activeStep === 'logistics' || activeStep === 'all') && (
          <div
            id="form-step-logistics"
            className="rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 animate-fade-in"
          >
            {/* Step Header with Executive Directive Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-indigo-600 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px] tracking-wider uppercase">
                      SEC 01 // PARAMETERS
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white font-heading">
                      Geographic &amp; Schedule Logistics
                    </h3>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 hidden sm:inline">
                DIRECTIVE REF: LOG-SPEC-01
              </span>
            </div>

            {/* Row 1: Destination, Travel Date & Day, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
              {/* Destination Field with Autocomplete & Explorer */}
              <div className="md:col-span-5 relative" ref={destinationDropdownRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300" htmlFor="destination-input">
                    Target Destination <span className="text-rose-500">*</span>
                  </label>
                  {onOpenDestinationsModal && (
                    <button
                      type="button"
                      onClick={onOpenDestinationsModal}
                      className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Browse Catalog</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-4 h-4" />
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
                    placeholder="e.g. Goa, Manali, Kerala, Kashmir, Jaipur, Bali..."
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 dark:text-white bg-white dark:bg-slate-850 font-semibold placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base shadow-2xs border transition-colors ${
                      errors.destination
                        ? 'border-rose-500 dark:border-rose-500 focus:border-rose-600'
                        : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
                    }`}
                  />

                  {/* Autocomplete Dropdown */}
                  {showDestinationSuggestions && matchingSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl p-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_16px_36px_rgba(15,23,42,0.15)] backdrop-blur-xl animate-fade-in max-h-56 overflow-y-auto">
                      <div className="flex items-center justify-between px-2.5 py-1 mb-1 border-b border-slate-100 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-500">
                        <span>AVAILABLE DESTINATIONS</span>
                        {onOpenDestinationsModal && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowDestinationSuggestions(false);
                              onOpenDestinationsModal();
                            }}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
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
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={sug.image}
                                alt={sug.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                  {sug.name}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {sug.stateOrCountry} • {sug.category}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
                              {sug.idealDuration}D
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.destination ? (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.destination}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Select verified destinations or enter any global location.
                  </p>
                )}
              </div>

              {/* Date & Day Column */}
              <div className="md:col-span-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300" htmlFor="start-date-input">
                    Travel Date &amp; Day
                  </label>
                  {startDayName && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 rounded-md border border-indigo-200 dark:border-indigo-800/80 shadow-2xs">
                      {startDayName}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600 dark:text-indigo-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 dark:text-white bg-white dark:bg-slate-850 font-semibold border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm sm:text-base shadow-2xs"
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{formattedStartDate ? `Starts ${formattedStartDate}` : 'Select departure'}</span>
                  <button
                    type="button"
                    onClick={() => setStartDate(getTomorrowDateStr())}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-bold cursor-pointer uppercase font-mono hover:underline"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>

              {/* Duration Field */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300" htmlFor="duration-input">
                    Duration <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {duration}D
                  </span>
                </div>
                <div className="relative flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-4 h-4" />
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
                      className={`w-full pl-9 pr-2 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 dark:text-white bg-white dark:bg-slate-850 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base shadow-2xs border transition-colors ${
                        errors.duration
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
                      }`}
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
                      className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
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
                      className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
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
                      className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer border ${
                        Number(duration) === d
                          ? 'bg-slate-950 dark:bg-indigo-600 text-white border-slate-950 dark:border-indigo-500'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
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
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300" htmlFor="budget-input">
                    Total Target Budget <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Supported globally
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-24 sm:w-32 px-2 py-2.5 min-h-[44px] rounded-xl font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs sm:text-sm font-mono shrink-0 shadow-2xs"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400 font-bold">
                      <DollarSign className="w-4 h-4" />
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
                      placeholder="Enter budget..."
                      className={`w-full pl-10 pr-3 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 dark:text-white bg-white dark:bg-slate-850 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm sm:text-base shadow-2xs border transition-colors ${
                        errors.budget
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Budget Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase mr-0.5">Presets:</span>
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
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer border ${
                        budget === preset.val
                          ? 'bg-slate-950 dark:bg-indigo-600 text-white font-bold border-slate-950 dark:border-indigo-500 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {preset.label} ({currency}{Number(preset.val).toLocaleString()})
                    </button>
                  ))}
                </div>
              </div>

              {/* Travelers Field */}
              <div className="md:col-span-5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="travelers-input">
                  Travelers <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600 dark:text-indigo-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <input
                      id="travelers-input"
                      type="number"
                      min="1"
                      max="20"
                      value={travelers}
                      placeholder="e.g. 2"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setTravelers('');
                        } else {
                          const parsed = parseInt(val, 10);
                          if (!isNaN(parsed)) {
                            setTravelers(Math.max(1, Math.min(20, parsed)));
                          }
                        }
                        if (errors.travelers) setErrors({ ...errors, travelers: '' });
                      }}
                      className={`w-full pl-10 pr-2 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-slate-950 dark:text-white bg-white dark:bg-slate-850 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base shadow-2xs border transition-colors ${
                        errors.travelers
                          ? 'border-rose-500 dark:border-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
                      }`}
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
                        onClick={() => {
                          setTravelers(p.count);
                          if (errors.travelers) setErrors({ ...errors, travelers: '' });
                        }}
                        className={`px-3 py-2 min-h-[40px] text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                          Number(travelers) === p.count
                            ? 'bg-slate-950 dark:bg-indigo-600 text-white border-slate-950 dark:border-indigo-500 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {!travelers ? 'Choose group size or enter number' : Number(travelers) === 1 ? 'Solo Trip' : Number(travelers) === 2 ? 'Couple / 2 Friends' : `${travelers} People Group`}
                </p>
              </div>
            </div>

            {/* Quick Step 1 Navigation Buttons (Avoids scrolling) */}
            {activeStep === 'logistics' && (
              <div className="pt-3 border-t border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  id="step1-next-btn"
                  onClick={() => changeStep('travel-style')}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Specify Travel Style →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Fast Generate Button directly from Step 1 */}
                <button
                  type="button"
                  id="step1-fast-generate-btn"
                  onClick={() => validateAndSubmit()}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-slate-800 dark:border-indigo-500"
                  title="Generate instantly with smart default preferences"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isLoading ? 'Compiling Directive...' : 'Generate Itinerary (Fast)'}</span>
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
            className="rounded-2xl p-4 sm:p-6 space-y-5 shadow-xs bg-white border border-slate-200/90 transition-colors animate-fade-in"
          >
            {/* Step Header with Executive Directive Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/90">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-indigo-600 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px] tracking-wider uppercase">
                      SEC 02 // DIRECTIVE
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 font-heading">
                      Travel Style Archetypes
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any style to customize your pace, or leave open for a balanced journey.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                  {selectedTravelStyles.length > 0 ? `${selectedTravelStyles.length} Selected` : 'Optional • Any'}
                </span>
                {selectedTravelStyles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTravelStyles([])}
                    className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Active Selected Styles Tray */}
            {selectedTravelStyles.length > 0 ? (
              <div
                className="p-3 sm:p-3.5 rounded-xl border border-indigo-200/90 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-indigo-950/30 space-y-2 shadow-2xs animate-fade-in"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Specified Directives ({selectedTravelStyles.length}):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTravelStyles([])}
                    className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 underline cursor-pointer"
                  >
                    Unselect All
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTravelStyles.map((styleId) => {
                    const styleObj = TRAVEL_STYLES.find((s) => s.id === styleId);
                    return (
                      <span
                        key={styleId}
                        className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-bold text-xs border border-indigo-200 dark:border-indigo-800 shadow-2xs hover:border-rose-400 transition-colors"
                      >
                        <span className="text-sm">{styleObj?.icon || '🧭'}</span>
                        <span>{styleObj?.label || styleId}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTravelStyleToggle(styleId);
                          }}
                          className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-400 text-[10px] font-bold flex items-center justify-center cursor-pointer transition-colors"
                          title={`Remove ${styleObj?.label || styleId}`}
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-base">🧭</span>
                  <span>No styles selected yet. All options are ready to click below.</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded self-start sm:self-auto">
                  Click cards below
                </span>
              </div>
            )}

            {/* Travel Styles Grid - Direct Clean Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {TRAVEL_STYLES.map((style) => {
                const isSelected = selectedTravelStyles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    type="button"
                    id={`style-btn-${style.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleTravelStyleToggle(style.id)}
                    className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 shadow-2xs hover:shadow-xs active:scale-98 ${
                      isSelected
                        ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-gradient-to-b from-indigo-50/70 to-white dark:from-indigo-950/40 dark:to-slate-900 ring-2 ring-indigo-500/15'
                        : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                          {style.icon}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white leading-tight">
                            {style.label}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-1.5 py-0.2 rounded border border-indigo-200/80 dark:border-indigo-800/80 inline-block mt-0.5">
                            {style.category}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-2xs">
                            <span>✓</span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-slate-700 flex items-center gap-0.5">
                            <span>+ Add</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Travel Style Step Stepper Navigation */}
            {(activeStep === 'travel-style' || activeStep === 'preferences') && (
              <div className="pt-3 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  id="travel-style-prev-btn"
                  onClick={() => changeStep('logistics')}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back: Logistics</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id="travel-style-next-btn"
                    onClick={() => changeStep('food-preference')}
                    className="flex-1 sm:flex-none px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-slate-800"
                  >
                    <span>Next: Food Preference →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="travel-style-generate-btn"
                    onClick={() => validateAndSubmit()}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-indigo-500"
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
            className="rounded-2xl p-4 sm:p-6 space-y-5 shadow-xs bg-white border border-slate-200/90 transition-colors animate-fade-in"
          >
            {/* Step Header with Executive Directive Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/90">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px] tracking-wider uppercase">
                      SEC 03 // PROTOCOL
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 font-heading">
                      Food &amp; Dining Directives
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any diet or cuisine, or leave open to experience all local culinary options.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                  {selectedFoodPreferences.length > 0
                    ? `${selectedFoodPreferences.length} ${selectedFoodPreferences.length === 1 ? 'Diet' : 'Diets'} Selected`
                    : 'Optional • Any'}
                </span>
                {selectedFoodPreferences.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFoodPreferences([])}
                    className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                    title="Unselect all food preferences to start fresh"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Active Selected Diets Tray (Chips with remove button) */}
            {selectedFoodPreferences.length > 0 ? (
              <div
                className="p-3 sm:p-3.5 rounded-xl border border-amber-200/90 dark:border-amber-800/80 bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-50/70 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/30 space-y-2 shadow-2xs animate-fade-in"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Specified Dietary Directives ({selectedFoodPreferences.length}):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFoodPreferences([])}
                    className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 underline cursor-pointer"
                  >
                    Unselect All
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedFoodPreferences.map((foodId) => {
                    const foodObj = FOOD_PREFERENCES.find((f) => f.id === foodId);
                    return (
                      <span
                        key={foodId}
                        className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-bold text-xs border border-amber-200 dark:border-amber-800 shadow-2xs hover:border-rose-400 transition-colors"
                      >
                        <span className="text-sm">{foodObj?.icon || '🍽️'}</span>
                        <span>{foodObj?.label || foodId}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFoodPreferenceToggle(foodId);
                          }}
                          className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-400 text-[10px] font-bold flex items-center justify-center cursor-pointer transition-colors"
                          title={`Remove ${foodObj?.label || foodId}`}
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-base">🥗</span>
                  <span>No diets selected yet. All options are ready to click — pick 1, 2, or more!</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded self-start sm:self-auto">
                  Click cards below
                </span>
              </div>
            )}

            {/* Food Preferences Grid - Direct Clean Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {FOOD_PREFERENCES.map((food) => {
                const isSelected = selectedFoodPreferences.includes(food.id);
                return (
                  <button
                    key={food.id}
                    type="button"
                    id={`food-btn-${food.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleFoodPreferenceToggle(food.id)}
                    className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 shadow-2xs hover:shadow-xs active:scale-98 ${
                      isSelected
                        ? 'border-2 border-amber-600 dark:border-amber-500 bg-gradient-to-b from-amber-50/70 to-white dark:from-amber-950/40 dark:to-slate-900 ring-2 ring-amber-500/15'
                        : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 p-1.5 bg-amber-50/70 dark:bg-slate-800 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-2xs">
                          {food.icon}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white leading-tight">
                            {food.label}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-300/80 dark:border-amber-800/80 inline-block mt-0.5">
                            {food.badge}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-2xs">
                            <span>✓</span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-slate-700 flex items-center gap-0.5">
                            <span>+ Add</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                      {food.note}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* End-of-card selection counter */}
            {selectedFoodPreferences.length > 0 && (
              <div className="pt-2 px-1 flex items-center justify-end text-xs text-slate-500 font-medium border-t border-slate-200/80">
                <span className="font-mono font-bold text-slate-700">
                  {selectedFoodPreferences.length} chosen
                </span>
              </div>
            )}

            {/* Food Preference Step Stepper Navigation */}
            {activeStep === 'food-preference' && (
              <div className="pt-3 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  id="food-preference-prev-btn"
                  onClick={() => changeStep('travel-style')}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back: Travel Style</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id="food-preference-next-btn"
                    onClick={() => changeStep('custom')}
                    className="flex-1 sm:flex-none px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-slate-800"
                  >
                    <span>Next: Activities &amp; Notes →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="food-preference-generate-btn"
                    onClick={() => validateAndSubmit()}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-indigo-500"
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
            className="rounded-2xl p-4 sm:p-6 space-y-5 shadow-xs bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 animate-fade-in"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-slate-900 dark:bg-slate-300 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px] tracking-wider uppercase">
                      SEC 04 // PROTOCOL
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white font-heading">
                      Activities &amp; Special Desires
                    </h3>
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                {selectedInterests.length > 0 ? `${selectedInterests.length} Chosen` : 'Optional • Any'}
              </span>
            </div>

            {/* Interests Chips Card */}
            <div
              id="interests-selection-card"
              className="p-4 sm:p-5 rounded-2xl transition-all space-y-3 border bg-slate-50/50 border-slate-200/90"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span>Activities &amp; Interests <span className="text-slate-500 text-xs font-normal lowercase tracking-normal">(optional)</span></span>
                </label>
                {selectedInterests.length > 0 && (
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {selectedInterests.length} selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        isSelected
                          ? 'bg-slate-950 text-white border-2 border-slate-950 shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected && <span className="text-[10px] font-bold text-amber-300">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5 pt-3 border-t border-slate-200/90 dark:border-slate-800">
              <label className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between" htmlFor="special-notes-input">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Custom Requests (Optional)</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">pace, accessibility, celebration</span>
              </label>
              <input
                id="special-notes-input"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Easy walking pace, anniversary dinner, scenic photography spots..."
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 text-sm shadow-2xs transition-all"
              />
            </div>

            {/* Step 4 Stepper Navigation */}
            {activeStep === 'custom' && (
              <div className="pt-3 border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="step4-prev-btn"
                  onClick={() => changeStep('food-preference')}
                  className="px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back: Food Preference</span>
                </button>

                <button
                  type="button"
                  id="step3-generate-btn"
                  onClick={() => validateAndSubmit()}
                  disabled={isLoading}
                  className="px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 cursor-pointer shadow-xs border border-indigo-500"
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
            className="pt-4 border-t border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3"
          >
            <button
              type="submit"
              id="generate-my-trip-btn"
              disabled={isLoading}
              className={`flex-1 w-full py-3.5 min-h-[50px] px-6 sm:px-8 rounded-2xl font-bold text-base sm:text-lg text-white shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-indigo-500 ${
                isLoading
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>{isLoading ? 'Calculating Optimal Itinerary...' : 'Generate My Trip'}</span>
            </button>

            <button
              type="button"
              id="reset-all-bottom-btn"
              onClick={handleClearForm}
              className="w-full sm:w-auto px-5 py-3 min-h-[50px] rounded-2xl font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              title="Reset all form fields to blank"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              id="think-bottom-btn"
              onClick={handleLetMeThink}
              className="w-full sm:w-auto px-5 py-3 min-h-[50px] rounded-2xl font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              title="Save current choices to think about later"
            >
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Let Me Think</span>
            </button>
          </div>
        )}
      </form>

      {/* "Let Me Think" Preference Snapshot Modal - Executive Docket Dialog */}
      {showThinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden text-center border border-slate-200/90 dark:border-slate-800 shadow-2xl animate-fade-in"
          >
            {/* Top Accent Ribbon */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 w-full" />

            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <div
                  className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shadow-2xs"
                >
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-1">
                <span
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold inline-flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>TRAVEL SPECIFICATION DOSSIER • SAVED</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-heading">
                  Take All The Time You Need
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Your customized choices are saved securely for this browser session.
                </p>
              </div>

              {/* Multi-Tile Selections Snapshot */}
              <div
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800 text-left text-xs font-mono space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Session Audit Snapshot
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Saved in Browser
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="text-[10px] text-slate-500 font-medium block uppercase">Destination</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                      {destination || '(Blank)'}
                    </strong>
                  </div>

                  <div
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="text-[10px] text-slate-500 font-medium block uppercase">Duration</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      {duration ? `${duration} Days` : '(Blank)'}
                    </strong>
                  </div>

                  <div
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="text-[10px] text-slate-500 font-medium block uppercase">Target Budget</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      {budget ? `${currency}${budget}` : '(Blank)'}
                    </strong>
                  </div>

                  <div
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="text-[10px] text-slate-500 font-medium block uppercase">Travelers</span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                      {travelers ? `${travelers} Person(s)` : '(Blank)'}
                    </strong>
                  </div>
                </div>

                {/* Diets and Styles Badges */}
                <div className="space-y-1.5 pt-1">
                  {selectedTravelStyles.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-bold">Styles:</span>
                      {selectedTravelStyles.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md text-[10px] font-bold"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedFoodPreferences.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-bold">Food:</span>
                      {selectedFoodPreferences.map((fp) => (
                        <span
                          key={fp}
                          className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md text-[10px] font-bold"
                        >
                          {fp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reassurance Banner with Executive Neutral Tone */}
              <div
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 text-left font-medium leading-relaxed flex items-start gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Fresh Session State:</strong> Whenever you refresh or visit again in the future, all fields default to pristine blank state so you can construct your itinerary from scratch.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  id="close-think-modal-btn"
                  onClick={() => setShowThinkModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-xs"
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  id="reset-from-think-modal-btn"
                  onClick={() => {
                    handleClearForm();
                    setShowThinkModal(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer shadow-2xs transition-all"
                >
                  Reset All to Blank
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

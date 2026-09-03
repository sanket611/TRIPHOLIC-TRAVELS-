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
}

const TRAVEL_STYLES: Array<{ id: TravelStyle; label: string; icon: string; desc: string }> = [
  { id: 'Adventure', label: 'Adventure', icon: '🧗', desc: 'Treks, outdoor thrills & activities' },
  { id: 'Relaxed', label: 'Relaxed', icon: '🏖️', desc: 'Scenic beaches, spas & slow pace' },
  { id: 'Cultural & Heritage', label: 'Cultural & Heritage', icon: '🏛️', desc: 'Museums, monuments & history' },
  { id: 'Luxury', label: 'Luxury', icon: '✨', desc: '5-star comfort, fine dining & stays' },
  { id: 'Romantic', label: 'Romantic', icon: '🌹', desc: 'Sunsets, cozy dinners & views' },
  { id: 'Family Friendly', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦', desc: 'Kid-safe parks & comfortable transit' },
  { id: 'Solo Explorer', label: 'Solo Explorer', icon: '🎒', desc: 'Social spots, hostels & hidden gems' },
  { id: 'Foodie & Culinary', label: 'Foodie', icon: '🍜', desc: 'Street food trails & local delicacies' },
  { id: 'Nature & Wildlife', label: 'Nature & Wildlife', icon: '🌿', desc: 'National parks, lakes & safaris' },
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

const FOOD_PREFERENCES: Array<{ id: FoodPreference; label: string; icon: string; note: string }> = [
  { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗', note: 'Dairy OK, no meat or seafood' },
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian', icon: '🍗', note: 'Poultry, meats & local dishes' },
  { id: 'Vegan', label: '100% Vegan', icon: '🌱', note: 'Strictly plant-based' },
  { id: 'Jain', label: 'Jain Friendly', icon: '🙏', note: 'Pure veg without root vegetables' },
  { id: 'Eggetarian', label: 'Eggetarian', icon: '🍳', note: 'Vegetarian plus egg dishes' },
  { id: 'Halal', label: 'Halal Certified', icon: '🌙', note: 'Halal compliant dining' },
  { id: 'Seafood Special', label: 'Seafood Lover', icon: '🦐', note: 'Coastal fresh catch & fish curries' },
];

const POPULAR_FOOD_COMBOS: Array<{ label: string; prefs: FoodPreference[] }> = [
  { label: '🥗 + 🙏 Veg & Jain', prefs: ['Vegetarian', 'Jain'] },
  { label: '🍗 + 🦐 Non-Veg & Seafood', prefs: ['Non-Vegetarian', 'Seafood Special'] },
  { label: '🌱 + 🥗 Vegan & Veg', prefs: ['Vegan', 'Vegetarian'] },
  { label: '🍗 + 🌙 Halal & Non-Veg', prefs: ['Halal', 'Non-Vegetarian'] },
  { label: '🍳 + 🥗 Eggetarian & Veg', prefs: ['Eggetarian', 'Vegetarian'] },
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

export type FormStep = 'logistics' | 'preferences' | 'custom' | 'all';

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  onGenerateTrip,
  onReset,
  onOpenDestinationsModal,
  isLoading,
  initialValues,
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
    return ['Adventure'];
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
    return ['Vegetarian'];
  };

  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [startDate, setStartDate] = useState<string>(initialValues?.startDate || getTomorrowDateStr());
  const [duration, setDuration] = useState<number | string>(initialValues?.duration ?? 4);
  const [budget, setBudget] = useState<string>(initialValues?.budget ? initialValues.budget.toString() : '20000');
  const [currency, setCurrency] = useState(initialValues?.currency || '₹');
  const [travelers, setTravelers] = useState<number>(initialValues?.travelers || 2);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<TravelStyle[]>(getInitialTravelStyles);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialValues?.interests || ['Beaches', 'Photography']
  );
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState<FoodPreference[]>(getInitialFoodPreferences);
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);

  // Stepper / No-scroll view mode for options
  const [activeStep, setActiveStep] = useState<FormStep>('logistics');

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
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleClearForm = () => {
    setDestination('');
    setStartDate(getTomorrowDateStr());
    setDuration(3);
    setBudget('15000');
    setCurrency('₹');
    setTravelers(1);
    setSelectedTravelStyles(['Adventure']);
    setSelectedInterests([]);
    setSelectedFoodPreferences(['Vegetarian']);
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
      newErrors.travelStyle = 'Please select at least 1 travel style.';
    }

    if (selectedFoodPreferences.length === 0) {
      newErrors.foodPreference = 'Please select at least 1 food preference.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto switch to step with error to avoid scrolling
      if (newErrors.destination || newErrors.duration || newErrors.budget || newErrors.travelers) {
        if (activeStep !== 'all') setActiveStep('logistics');
      } else if (newErrors.travelStyle || newErrors.foodPreference) {
        if (activeStep !== 'all') setActiveStep('preferences');
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
            onClick={() => setActiveStep('logistics')}
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
            id="step-tab-preferences"
            onClick={() => setActiveStep('preferences')}
            style={{
              border: activeStep === 'preferences' ? '2px solid #000000' : '1.5px solid #000000',
              background: activeStep === 'preferences' ? '#000000' : '#ffffff',
              color: activeStep === 'preferences' ? '#ffffff' : '#000000',
            }}
            className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
              activeStep === 'preferences' ? 'bg-amber-300 text-black' : 'bg-slate-200 text-slate-900'
            }`}>
              2
            </span>
            <span>Style &amp; Food</span>
            {(errors.travelStyle || errors.foodPreference) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            id="step-tab-custom"
            onClick={() => setActiveStep('custom')}
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
              3
            </span>
            <span>Activities &amp; Notes</span>
          </button>
        </div>

        {/* Toggle between Step Mode (No Scroll) and All Steps Mode */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-mono font-bold">
          <button
            type="button"
            id="step-tab-all"
            onClick={() => setActiveStep(activeStep === 'all' ? 'logistics' : 'all')}
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
                  STEP 1 OF 3
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
                  onClick={() => setActiveStep('preferences')}
                  style={{ border: '2px solid #000000' }}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-black bg-white hover:bg-slate-100 text-black flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Customize Style &amp; Food →</span>
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
        {/* STEP 2: TRAVEL STYLES & FOOD (COMPACT DESIGN) */}
        {/* ========================================================================= */}
        {(activeStep === 'preferences' || activeStep === 'all') && (
          <div
            id="form-step-preferences"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '2px solid #000000',
            }}
            className="rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm backdrop-blur-md animate-fade-in"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-violet-900 text-amber-300 font-mono font-black text-xs flex items-center gap-1 border border-black">
                  <Sparkles className="w-3 h-3 fill-amber-300" />
                  <span>STEP 2 OF 3</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-black font-heading">
                  Travel Styles &amp; Food Options
                </h3>
              </div>
              <span className="text-xs font-mono font-extrabold text-violet-900 bg-violet-100 px-2.5 py-0.5 rounded border border-violet-300">
                Multi-Select Allowed
              </span>
            </div>

            {/* Travel Styles Compact Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-violet-700" />
                  <span>Travel Style <span className="text-rose-600">*</span></span>
                </label>
                <span className="text-xs font-mono font-extrabold text-black">
                  {selectedTravelStyles.length} Selected
                </span>
              </div>

              {/* Compact Travel Style Cards (3 cols desktop, 2 cols mobile) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                {TRAVEL_STYLES.map((style) => {
                  const isSelected = selectedTravelStyles.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      type="button"
                      id={`style-btn-${style.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => handleTravelStyleToggle(style.id)}
                      style={{
                        background: isSelected ? 'rgba(238, 242, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #000000',
                      }}
                      className="p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:border-black active:scale-98"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{style.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-black text-black truncate">
                            {style.label}
                          </p>
                          <p className="text-[10px] text-slate-700 truncate font-semibold">
                            {style.desc}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-black text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.travelStyle && (
                <p className="text-xs text-rose-800 font-extrabold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.travelStyle}
                </p>
              )}
            </div>

            {/* Food & Dining Preference Compact Grid */}
            <div className="space-y-2.5 pt-3 border-t border-black/15">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-violet-700" />
                  <span>Food &amp; Dining Preference <span className="text-rose-600">*</span></span>
                </label>
                <span className="text-xs font-mono font-extrabold text-black">
                  {selectedFoodPreferences.length} Selected
                </span>
              </div>

              {/* Compact Dietary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {FOOD_PREFERENCES.map((food) => {
                  const isSelected = selectedFoodPreferences.includes(food.id);
                  return (
                    <button
                      key={food.id}
                      type="button"
                      id={`food-btn-${food.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => handleFoodPreferenceToggle(food.id)}
                      style={{
                        background: isSelected ? 'rgba(238, 242, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #000000',
                      }}
                      className="p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:border-black active:scale-98"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{food.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-black text-black truncate">
                            {food.label}
                          </p>
                          <p className="text-[10px] text-slate-700 truncate font-semibold">
                            {food.note}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-black text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.foodPreference && (
                <p className="text-xs text-rose-800 font-extrabold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.foodPreference}
                </p>
              )}
            </div>

            {/* Step 2 Stepper Navigation */}
            {activeStep === 'preferences' && (
              <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="step2-prev-btn"
                  onClick={() => setActiveStep('logistics')}
                  style={{ border: '1.5px solid #000000' }}
                  className="px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="step2-next-btn"
                    onClick={() => setActiveStep('custom')}
                    style={{ border: '1.5px solid #000000' }}
                    className="px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Activities &amp; Notes →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="step2-generate-btn"
                    onClick={() => validateAndSubmit()}
                    disabled={isLoading}
                    style={{ border: '2px solid #000000' }}
                    className="px-5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: INTERESTS & CUSTOM NOTES */}
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
                  STEP 3 OF 3
                </span>
                <h3 className="text-base sm:text-lg font-black text-black font-heading">
                  Activities, Interests &amp; Special Desires
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                {selectedInterests.length} Interests Chosen
              </span>
            </div>

            {/* Interests Chips */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-violet-700" />
                <span>Activities &amp; Interests (Optional)</span>
              </label>
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

            {/* Step 3 Stepper Navigation */}
            {activeStep === 'custom' && (
              <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="step3-prev-btn"
                  onClick={() => setActiveStep('preferences')}
                  style={{ border: '1.5px solid #000000' }}
                  className="px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back</span>
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

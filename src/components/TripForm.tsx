import React, { useState } from 'react';
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
  Info,
  Clock,
} from 'lucide-react';
import { TravelPreferences, TravelStyle, FoodPreference } from '../types';

interface TripFormProps {
  onSubmit?: (prefs: TravelPreferences) => void;
  onGenerateTrip?: (prefs: TravelPreferences) => void;
  onReset?: () => void;
  isLoading: boolean;
  initialValues?: Partial<TravelPreferences>;
}

const TRAVEL_STYLES: Array<{ id: TravelStyle; label: string; icon: string; desc: string }> = [
  { id: 'Adventure', label: 'Adventure', icon: '🧗', desc: 'Thrills, treks, outdoor excursions' },
  { id: 'Relaxed', label: 'Relaxed', icon: '🏖️', desc: 'Slow mornings, spas, scenic beaches' },
  { id: 'Cultural & Heritage', label: 'Cultural & Heritage', icon: '🏛️', desc: 'Museums, monuments, traditions' },
  { id: 'Luxury', label: 'Luxury', icon: '✨', desc: '5-star comfort, fine dining, cruises' },
  { id: 'Romantic', label: 'Romantic', icon: '🌹', desc: 'Scenic sunsets, candlelight dinners' },
  { id: 'Family Friendly', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦', desc: 'Kid-safe parks, easy transit' },
  { id: 'Solo Explorer', label: 'Solo Explorer', icon: '🎒', desc: 'Hostels, hidden gems, social spots' },
  { id: 'Foodie & Culinary', label: 'Foodie', icon: '🍜', desc: 'Street food trails, culinary classes' },
  { id: 'Nature & Wildlife', label: 'Nature & Wildlife', icon: '🌿', desc: 'National parks, birdwatching, lakes' },
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
  { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗', note: 'No meat or seafood, dairy OK' },
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian', icon: '🍗', note: 'All poultry, meats & local specialties' },
  { id: 'Vegan', label: '100% Vegan', icon: '🌱', note: 'Strictly plant-based, no dairy/eggs' },
  { id: 'Jain', label: 'Jain Friendly', icon: '🙏', note: 'Pure veg without root vegetables' },
  { id: 'Eggetarian', label: 'Eggetarian', icon: '🍳', note: 'Vegetarian plus egg dishes' },
  { id: 'Halal', label: 'Halal Certified', icon: '🌙', note: 'Strictly Halal compliant dining' },
  { id: 'Seafood Special', label: 'Seafood Lover', icon: '🦐', note: 'Coastal fresh catch & fish curries' },
];

const POPULAR_FOOD_COMBOS: Array<{ label: string; prefs: FoodPreference[] }> = [
  { label: '🥗 + 🙏 Pure Veg & Jain', prefs: ['Vegetarian', 'Jain'] },
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

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  onGenerateTrip,
  onReset,
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
  const [duration, setDuration] = useState<number>(initialValues?.duration || 4);
  const [budget, setBudget] = useState<string>(initialValues?.budget ? initialValues.budget.toString() : '20000');
  const [currency, setCurrency] = useState(initialValues?.currency || '₹');
  const [travelers, setTravelers] = useState<number>(initialValues?.travelers || 2);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<TravelStyle[]>(getInitialTravelStyles);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialValues?.interests || ['Beaches', 'Photography']
  );
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState<FoodPreference[]>(getInitialFoodPreferences);
  const [notes, setNotes] = useState(initialValues?.notes || '');

  // Synchronize when initialValues change (e.g. from preset buttons or test suite)
  React.useEffect(() => {
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

  // Populate example preset with combined travel styles
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // 1. Destination validation
    if (!destination || !destination.trim()) {
      newErrors.destination = 'Please enter a destination.';
    }

    // 2. Duration validation
    const durationNum = Number(duration);
    if (!durationNum || isNaN(durationNum) || durationNum < 1 || durationNum > 30) {
      newErrors.duration = 'Please enter a valid number of days (1 to 30).';
    }

    // 3. Budget validation
    const budgetNum = Number(budget);
    if (!budgetNum || isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = 'Please enter a valid budget greater than 0.';
    }

    // 4. Travelers validation
    const travelersNum = Number(travelers);
    if (!travelersNum || isNaN(travelersNum) || travelersNum < 1) {
      newErrors.travelers = 'Please enter at least 1 traveler.';
    }

    // 5. Travel Style validation
    if (selectedTravelStyles.length === 0) {
      newErrors.travelStyle = 'Please select at least 1 travel style.';
    }

    // 6. Food Preference validation
    if (selectedFoodPreferences.length === 0) {
      newErrors.foodPreference = 'Please select at least 1 food preference.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] overflow-hidden transition-all duration-300"
    >
      {/* Translucent Card Header with Quick Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
        }}
        className="px-4 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="p-1.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Travel Preferences
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Define destination, travel date, duration, financial constraints, group size, and dietary parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="try-example-btn"
            onClick={handleTryExample}
            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl transition-all shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 flex items-center justify-center gap-1.5 cursor-pointer"
            title="Auto-fill with Academic Goa Example"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Try Example (Goa)</span>
          </button>

          <button
            type="button"
            id="clear-form-btn"
            onClick={handleClearForm}
            style={{
              background: 'rgba(255, 255, 255, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.40)',
            }}
            className="px-3.5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-900 hover:text-blue-900 hover:bg-white/50 active:bg-white/70 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs backdrop-blur-md"
            title="Reset form and hide generated results"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Row 1: Destination, Travel Date & Day Column, Duration */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Destination Field */}
          <div className="md:col-span-5">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2" htmlFor="destination-input">
              Destination <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-700">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <input
                id="destination-input"
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (errors.destination) setErrors({ ...errors, destination: '' });
                }}
                placeholder="e.g. Goa, Manali, Paris, Tokyo, Bali, Kerala, Rajasthan..."
                style={{
                  background: 'rgba(255, 255, 255, 0.30)',
                  border: errors.destination ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className={`w-full pl-11 pr-4 py-3 min-h-[44px] rounded-xl text-slate-900 font-semibold placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 hover:bg-white/40 focus:bg-white/60 transition-all text-base sm:text-sm shadow-xs`}
              />
            </div>
            {errors.destination ? (
              <p className="mt-1.5 text-xs text-rose-700 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.destination}
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-800 font-medium">City, state, country, or specific travel region.</p>
            )}
          </div>

          {/* Date & Day Column (Dedicated travel date column) */}
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900" htmlFor="start-date-input">
                Travel Date & Day <span className="text-blue-800 font-normal text-[10px]">(Optional)</span>
              </label>
              {startDayName && (
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(255, 255, 255, 0.50)',
                  }}
                  className="text-[11px] font-mono font-bold px-2 py-0.5 text-blue-950 rounded-md backdrop-blur-md shadow-2xs"
                >
                  {startDayName}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-700">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.30)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="w-full pl-10 pr-3 py-3 min-h-[44px] rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 hover:bg-white/40 focus:bg-white/60 transition-all text-base sm:text-sm shadow-xs"
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-800 font-medium">
              <span>{formattedStartDate ? `Starts on ${formattedStartDate}` : 'Select your departure date'}</span>
              <button
                type="button"
                onClick={() => setStartDate(getTomorrowDateStr())}
                className="text-blue-800 hover:text-blue-950 font-bold cursor-pointer text-[10px] uppercase font-mono hover:underline"
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Duration Field */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900" htmlFor="duration-input">
                Days <span className="text-rose-600">*</span>
              </label>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.40)',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                }}
                className="text-xs font-mono font-bold px-2 py-0.5 text-slate-900 rounded-md backdrop-blur-md shadow-2xs"
              >
                {duration} {duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <div className="relative flex items-center gap-1.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  id="duration-input"
                  type="number"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => {
                    setDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)));
                    if (errors.duration) setErrors({ ...errors, duration: '' });
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.30)',
                    border: errors.duration ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  className="w-full pl-9 pr-2 py-3 min-h-[44px] rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 hover:bg-white/40 focus:bg-white/60 transition-all text-base sm:text-sm shadow-xs"
                />
              </div>

              {/* Stepper buttons with >= 44px touch targets */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setDuration((prev) => Math.max(1, prev - 1))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="w-10 h-11 min-h-[44px] min-w-[40px] rounded-xl hover:bg-white/55 active:bg-blue-100 text-slate-900 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer select-none shadow-2xs backdrop-blur-md"
                  aria-label="Decrease days"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setDuration((prev) => Math.min(30, prev + 1))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="w-10 h-11 min-h-[44px] min-w-[40px] rounded-xl hover:bg-white/55 active:bg-blue-100 text-slate-900 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer select-none shadow-2xs backdrop-blur-md"
                  aria-label="Increase days"
                >
                  +
                </button>
              </div>
            </div>
            {errors.duration ? (
              <p className="mt-1.5 text-xs text-rose-700 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.duration}
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-800 font-medium">1 to 30 days.</p>
            )}
          </div>
        </div>

        {/* Row 2: Budget & Travelers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Budget Field with Currency selector */}
          <div className="md:col-span-7">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-900" htmlFor="budget-input">
                Total Budget <span className="text-rose-600">*</span>
              </label>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.18)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
                className="text-[10px] font-mono font-bold text-emerald-950 px-2 py-0.5 rounded-md backdrop-blur-md"
              >
                ANY AMOUNT SUPPORTED
              </span>
            </div>
            <div className="flex gap-2">
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="w-28 sm:w-32 px-2.5 sm:px-3 py-3 min-h-[44px] rounded-xl font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 hover:bg-white/45 transition-all cursor-pointer text-sm font-mono shrink-0 shadow-xs"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white text-slate-900 font-sans">
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                  <DollarSign className="w-4 h-4 text-emerald-700 font-bold" />
                </div>
                <input
                  id="budget-input"
                  type="number"
                  min="1"
                  step="any"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    if (errors.budget) setErrors({ ...errors, budget: '' });
                  }}
                  placeholder="Enter any budget amount..."
                  style={{
                    background: 'rgba(255, 255, 255, 0.30)',
                    border: errors.budget ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl text-slate-900 font-bold placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 hover:bg-white/40 focus:bg-white/60 transition-all font-mono text-base sm:text-sm shadow-xs"
                />
              </div>
            </div>

            {/* Quick Budget Suggestion Tier Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[10px] font-mono text-slate-800 font-bold uppercase mr-0.5">Quick Scale:</span>
              {(currency === '₹'
                ? [
                    { label: 'Backpacker', val: '5000' },
                    { label: 'Moderate', val: '15000' },
                    { label: 'Comfort', val: '35000' },
                    { label: 'Luxury', val: '80000' },
                  ]
                : currency === '$' || currency === '€' || currency === '£' || currency === 'A$'
                ? [
                    { label: 'Backpacker', val: '300' },
                    { label: 'Moderate', val: '800' },
                    { label: 'Comfort', val: '1800' },
                    { label: 'Luxury', val: '4000' },
                  ]
                : [
                    { label: 'Backpacker', val: '30000' },
                    { label: 'Moderate', val: '80000' },
                    { label: 'Comfort', val: '180000' },
                    { label: 'Luxury', val: '400000' },
                  ]
              ).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setBudget(preset.val);
                    if (errors.budget) setErrors({ ...errors, budget: '' });
                  }}
                  style={
                    budget === preset.val
                      ? {}
                      : {
                          background: 'rgba(255, 255, 255, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                        }
                  }
                  className={`px-2.5 py-1.5 min-h-[36px] text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center backdrop-blur-md ${
                    budget === preset.val
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-900 hover:bg-white/55 active:bg-blue-100 hover:text-blue-950'
                  }`}
                >
                  {preset.label} ({currency}{Number(preset.val).toLocaleString()})
                </button>
              ))}
            </div>

            {errors.budget ? (
              <p className="mt-1.5 text-xs text-rose-700 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.budget}
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-800 font-medium">
                You decide the total budget: enter any amount. AI dynamically scales stay, dining, and activities to fit your exact figure.
              </p>
            )}
          </div>

          {/* Travelers Field */}
          <div className="md:col-span-5">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2" htmlFor="travelers-input">
              Number of Travelers <span className="text-rose-600">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-700">
                  <Users className="w-4 h-4 text-blue-600" />
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
                    background: 'rgba(255, 255, 255, 0.30)',
                    border: errors.travelers ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  className="w-full pl-10 pr-3 py-3 min-h-[44px] rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 hover:bg-white/40 focus:bg-white/60 transition-all text-base sm:text-sm shadow-xs"
                />
              </div>

              {/* Quick Group Presets with >= 44px touch targets */}
              <div className="flex items-center gap-1.5 shrink-0">
                {[
                  { count: 1, label: 'Solo' },
                  { count: 2, label: 'Duo' },
                  { count: 4, label: 'Group' },
                ].map((p) => (
                  <button
                    key={p.count}
                    type="button"
                    onClick={() => setTravelers(p.count)}
                    style={
                      travelers === p.count
                        ? {}
                        : {
                            background: 'rgba(255, 255, 255, 0.35)',
                            border: '1px solid rgba(255, 255, 255, 0.45)',
                          }
                    }
                    className={`px-3 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center backdrop-blur-md ${
                      travelers === p.count
                        ? 'bg-blue-600 text-white border border-blue-600 shadow-md shadow-blue-600/30'
                        : 'text-slate-900 hover:bg-white/55 active:bg-blue-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {errors.travelers ? (
              <p className="mt-1.5 text-xs text-rose-700 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.travelers}
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-800 font-medium">
                {travelers === 1 ? 'Solo Trip' : travelers === 2 ? 'Couple / 2 Friends' : `${travelers} People Group`}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Travel Style Multi-Selection */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Travel Style <span className="text-rose-600">*</span>
              </label>
              <span
                style={{
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.30)',
                }}
                className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full text-blue-950 backdrop-blur-md"
              >
                Select 1, 2 or more options
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">
              {selectedTravelStyles.length === 0
                ? 'None selected'
                : selectedTravelStyles.length === 1
                ? '1 style active'
                : `${selectedTravelStyles.length} styles combined`}
            </span>
          </div>

          {/* Quick Combo Presets */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[10px] font-mono text-slate-800 font-bold uppercase mr-0.5">Popular Combos:</span>
            {[
              { label: '🧗 + 🍜 Adventure & Foodie', styles: ['Adventure', 'Foodie & Culinary'] as TravelStyle[] },
              { label: '🏛️ + 🏖️ Cultural & Relaxed', styles: ['Cultural & Heritage', 'Relaxed'] as TravelStyle[] },
              { label: '🌿 + 🧗 Nature & Adventure', styles: ['Nature & Wildlife', 'Adventure'] as TravelStyle[] },
              { label: '✨ + 🌹 Luxury & Romantic', styles: ['Luxury', 'Romantic'] as TravelStyle[] },
            ].map((combo) => {
              const isComboActive =
                combo.styles.length === selectedTravelStyles.length &&
                combo.styles.every((s) => selectedTravelStyles.includes(s));
              return (
                <button
                  key={combo.label}
                  type="button"
                  onClick={() => {
                    setSelectedTravelStyles(combo.styles);
                    if (errors.travelStyle) setErrors({ ...errors, travelStyle: '' });
                  }}
                  style={
                    isComboActive
                      ? {}
                      : {
                          background: 'rgba(255, 255, 255, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                        }
                  }
                  className={`px-2.5 py-1 min-h-[32px] text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center backdrop-blur-md ${
                    isComboActive
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-900 hover:bg-blue-50/80 hover:text-blue-950 hover:border-blue-300'
                  }`}
                >
                  {combo.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = selectedTravelStyles.includes(style.id);
              const selectionIndex = selectedTravelStyles.indexOf(style.id);
              return (
                <button
                  key={style.id}
                  type="button"
                  id={`style-btn-${style.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleTravelStyleToggle(style.id)}
                  aria-pressed={isSelected}
                  style={
                    isSelected
                      ? {
                          background: 'rgba(239, 246, 255, 0.90)',
                          border: '2px solid rgb(37, 99, 235)',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.18)',
                        }
                      : {
                          background: 'rgba(255, 255, 255, 0.30)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                        }
                  }
                  className="p-3 min-h-[64px] text-left rounded-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between active:scale-[0.98] backdrop-blur-md hover:bg-white/50"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{style.icon}</span>
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                        {style.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {selectedTravelStyles.length > 1 ? selectionIndex + 1 : '✓'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-800 font-medium line-clamp-1">{style.desc}</p>
                </button>
              );
            })}
          </div>

          {errors.travelStyle ? (
            <p className="mt-2 text-xs text-rose-700 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.travelStyle}
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-slate-800 font-medium">
              {selectedTravelStyles.length > 1
                ? `AI will cross-optimize your itinerary to blend all ${selectedTravelStyles.length} chosen styles (${selectedTravelStyles.join(' + ')}).`
                : 'You can select multiple styles simultaneously to combine outdoor thrills, relaxation, dining, and culture.'}
            </p>
          )}
        </div>

        {/* Row 4: Food Preferences (Multiple Selection Option) */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-blue-600" />
                <span>Food Preference <span className="text-rose-600">*</span></span>
              </label>
              <span
                style={{
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.30)',
                }}
                className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full text-blue-950 backdrop-blur-md"
              >
                Multi-select enabled
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">
              {selectedFoodPreferences.length === 0
                ? 'None selected'
                : selectedFoodPreferences.length === 1
                ? '1 preference chosen'
                : `${selectedFoodPreferences.length} dietary choices combined`}
            </span>
          </div>

          {/* Quick Dietary Combos */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[10px] font-mono text-slate-800 font-bold uppercase mr-0.5">Popular Combos:</span>
            {POPULAR_FOOD_COMBOS.map((combo) => {
              const isComboActive =
                combo.prefs.length === selectedFoodPreferences.length &&
                combo.prefs.every((p) => selectedFoodPreferences.includes(p));
              return (
                <button
                  key={combo.label}
                  type="button"
                  onClick={() => {
                    setSelectedFoodPreferences(combo.prefs);
                    if (errors.foodPreference) setErrors({ ...errors, foodPreference: '' });
                  }}
                  style={
                    isComboActive
                      ? {}
                      : {
                          background: 'rgba(255, 255, 255, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                        }
                  }
                  className={`px-2.5 py-1 min-h-[32px] text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center backdrop-blur-md ${
                    isComboActive
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-900 hover:bg-blue-50/80 hover:text-blue-950 hover:border-blue-300'
                  }`}
                >
                  {combo.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {FOOD_PREFERENCES.map((food) => {
              const isSelected = selectedFoodPreferences.includes(food.id);
              const selectionIndex = selectedFoodPreferences.indexOf(food.id);
              return (
                <button
                  key={food.id}
                  type="button"
                  id={`food-btn-${food.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleFoodPreferenceToggle(food.id)}
                  aria-pressed={isSelected}
                  style={
                    isSelected
                      ? {
                          background: 'rgba(239, 246, 255, 0.90)',
                          border: '2px solid rgb(37, 99, 235)',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.18)',
                        }
                      : {
                          background: 'rgba(255, 255, 255, 0.30)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                        }
                  }
                  className="p-3 min-h-[58px] text-left rounded-2xl transition-all cursor-pointer active:scale-[0.98] relative backdrop-blur-md hover:bg-white/50"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{food.icon}</span>
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                        {food.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {selectedFoodPreferences.length > 1 ? selectionIndex + 1 : '✓'}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-800 font-medium">{food.note}</p>
                </button>
              );
            })}
          </div>

          {errors.foodPreference ? (
            <p className="mt-2 text-xs text-rose-700 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.foodPreference}
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-slate-800 font-medium">
              {selectedFoodPreferences.length > 1
                ? `AI will strictly match menus catering to all chosen preferences (${selectedFoodPreferences.join(' + ')}).`
                : 'Select 1 or more options (e.g. Vegetarian + Jain, or Non-Veg + Halal + Seafood).'}
            </p>
          )}
        </div>

        {/* Row 5: Interests and Preferences (Multi-Select) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Interests & Activities (Optional)</span>
            </label>
            <span className="text-xs font-mono font-bold text-slate-900">{selectedInterests.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  style={
                    isSelected
                      ? {}
                      : {
                          background: 'rgba(255, 255, 255, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                        }
                  }
                  className={`px-3 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 backdrop-blur-md ${
                    isSelected
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-900 hover:bg-white/55 active:bg-blue-100'
                  }`}
                >
                  <span>{interest}</span>
                  {isSelected && <span className="text-[10px] font-bold text-white">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit CTA */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.30)',
          }}
          className="pt-5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              id="generate-my-trip-btn"
              disabled={isLoading}
              className={`flex-1 w-full py-4 min-h-[50px] px-6 sm:px-8 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg shadow-blue-600/35 hover:shadow-xl hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-3 cursor-pointer ${
                isLoading
                  ? 'bg-blue-400/80 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:-translate-y-0.5 active:translate-y-0 border border-blue-400'
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
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
              }}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] rounded-2xl font-mono font-semibold text-xs uppercase tracking-wider text-slate-900 hover:text-blue-950 hover:bg-white/55 active:bg-white/70 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs backdrop-blur-md"
              title="Reset all form fields and hide generated trip plan"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3.5 text-[11px] sm:text-xs text-slate-900 font-mono font-medium text-center">
            <Info className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Structured JSON verification with realistic transit clustering and budget clamping.</span>
          </div>
        </div>
      </form>
    </div>
  );
};

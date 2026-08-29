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
  Info,
  Clock,
  Grid,
  Check,
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
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);

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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] overflow-hidden transition-all duration-300"
    >
      {/* Translucent Card Header with Quick Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          borderBottom: '1.5px solid #000000',
        }}
        className="px-4 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="p-1.5 bg-gradient-to-tr from-violet-700 to-indigo-700 text-white rounded-xl shadow-md flex items-center justify-center border border-black">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
              Travel Preferences
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-950 font-bold">
            Define destination, travel date, duration, financial constraints, group size, and dietary parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="try-example-btn"
            onClick={handleTryExample}
            style={{
              border: '1.5px solid #000000',
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            title="Auto-fill with Academic Goa Example"
          >
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            <span>Try Example (Goa)</span>
          </button>

          <button
            type="button"
            id="clear-form-btn"
            onClick={handleClearForm}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white active:bg-slate-900 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm backdrop-blur-md"
            title="Reset form and hide generated results"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8">
        {/* ========================================================================= */}
        {/* SECTION 1: TRIP DESTINATION, TIMELINE & BUDGET */}
        {/* ========================================================================= */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.70)',
            border: '1.5px solid #000000',
          }}
          className="rounded-2xl p-4 sm:p-6 space-y-6 shadow-sm backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black text-amber-300 font-mono font-black text-xs">
                STEP 1
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-black font-heading">
                Destination, Dates &amp; Budget
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">
              Core Logistics
            </span>
          </div>

          {/* Row 1: Destination, Travel Date & Day Column, Duration */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            {/* Destination Field with Autocomplete & Explorer */}
            <div className="md:col-span-5 relative" ref={destinationDropdownRef}>
              <div className="flex items-center justify-between mb-2">
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
                    <span>See All Available Places</span>
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
                  placeholder="e.g. Goa, Manali, Kerala, Kashmir, Jaipur, Paris, Bali..."
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: errors.destination ? '2px solid #e11d48' : '1.5px solid #000000',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  className={`w-full pl-11 pr-4 py-3 min-h-[46px] rounded-xl text-slate-950 font-bold placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-black hover:bg-white focus:bg-white transition-all text-base shadow-sm`}
                />

                {/* Live Autocomplete Dropdown */}
                {showDestinationSuggestions && matchingSuggestions.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.98)',
                      border: '2px solid #000000',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2)',
                    }}
                    className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl p-2 z-50 backdrop-blur-xl animate-fade-in max-h-64 overflow-y-auto"
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
                          Browse Full Catalog →
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
                              className="w-9 h-9 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
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
                          <div className="text-right shrink-0 pl-2">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black text-amber-300">
                              {sug.idealDuration}D
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.destination ? (
                <p className="mt-1.5 text-xs sm:text-sm text-rose-800 font-extrabold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.destination}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-950 font-bold flex items-center justify-between">
                  <span>Select from 25+ verified destinations or enter any custom city.</span>
                </p>
              )}
            </div>

            {/* Date & Day Column (Dedicated travel date column) */}
            <div className="md:col-span-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="start-date-input">
                  Travel Date &amp; Day <span className="text-slate-800 font-normal text-xs">(Optional)</span>
                </label>
                {startDayName && (
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="text-xs font-mono font-extrabold px-2.5 py-0.5 text-black rounded-md backdrop-blur-md shadow-xs"
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
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  className="w-full pl-10 pr-3 py-3 min-h-[46px] rounded-xl text-slate-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-black hover:bg-white focus:bg-white transition-all text-base shadow-sm"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs text-slate-950 font-bold">
                <span>{formattedStartDate ? `Starts on ${formattedStartDate}` : 'Select departure date'}</span>
                <button
                  type="button"
                  onClick={() => setStartDate(getTomorrowDateStr())}
                  className="text-indigo-950 hover:text-black font-extrabold cursor-pointer text-xs uppercase font-mono hover:underline"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Duration Field */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="duration-input">
                  Duration <span className="text-rose-600">*</span>
                </label>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs font-mono font-extrabold px-2.5 py-0.5 text-black rounded-md backdrop-blur-md shadow-xs"
                >
                  {duration} {duration === 1 ? 'Day' : 'Days'}
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
                      setDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)));
                      if (errors.duration) setErrors({ ...errors, duration: '' });
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: errors.duration ? '2px solid #e11d48' : '1.5px solid #000000',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    className="w-full pl-9 pr-2 py-3 min-h-[46px] rounded-xl text-slate-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-black hover:bg-white focus:bg-white transition-all text-base shadow-sm"
                  />
                </div>

                {/* Stepper buttons with >= 44px touch targets */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDuration((prev) => Math.max(1, prev - 1))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl hover:bg-black hover:text-white active:bg-slate-900 text-black font-extrabold text-xl flex items-center justify-center transition-colors cursor-pointer select-none shadow-sm backdrop-blur-md"
                    aria-label="Decrease days"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration((prev) => Math.min(30, prev + 1))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl hover:bg-black hover:text-white active:bg-slate-900 text-black font-extrabold text-xl flex items-center justify-center transition-colors cursor-pointer select-none shadow-sm backdrop-blur-md"
                    aria-label="Increase days"
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.duration ? (
                <p className="mt-1.5 text-xs sm:text-sm text-rose-800 font-extrabold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.duration}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-950 font-bold">1 to 30 days.</p>
              )}
            </div>
          </div>

          {/* Row 2: Budget & Travelers */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            {/* Budget Field with Currency selector */}
            <div className="md:col-span-7">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black" htmlFor="budget-input">
                  Total Budget <span className="text-rose-600">*</span>
                </label>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs font-mono font-extrabold text-black px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs"
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  className="w-28 sm:w-36 px-3 py-3 min-h-[46px] rounded-xl font-extrabold text-black focus:outline-hidden focus:ring-2 focus:ring-black hover:bg-white transition-all cursor-pointer text-sm sm:text-base font-mono shrink-0 shadow-sm"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-white text-black font-sans font-bold">
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800 font-extrabold">
                    <DollarSign className="w-5 h-5 text-emerald-800 font-extrabold" />
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
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: errors.budget ? '2px solid #e11d48' : '1.5px solid #000000',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    className="w-full pl-11 pr-4 py-3 min-h-[46px] rounded-xl text-black font-extrabold placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-black hover:bg-white focus:bg-white transition-all font-mono text-base shadow-sm"
                  />
                </div>
              </div>

              {/* Quick Budget Suggestion Tier Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="text-xs font-mono text-black font-extrabold uppercase mr-0.5">Quick Scale:</span>
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
                    style={{
                      background: budget === preset.val ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className={`px-3 py-1.5 min-h-[38px] text-xs sm:text-sm font-mono rounded-xl transition-all cursor-pointer flex items-center backdrop-blur-md shadow-sm ${
                      budget === preset.val
                        ? 'bg-black text-white font-extrabold shadow-md'
                        : 'text-black font-bold hover:bg-black hover:text-white active:bg-slate-900'
                    }`}
                  >
                    {preset.label} ({currency}{Number(preset.val).toLocaleString()})
                  </button>
                ))}
              </div>

              {errors.budget ? (
                <p className="mt-1.5 text-xs sm:text-sm text-rose-800 font-extrabold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.budget}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-950 font-bold">
                  Enter any figure. AI scales stay, dining, and activities to fit your budget.
                </p>
              )}
            </div>

            {/* Travelers Field */}
            <div className="md:col-span-5">
              <label className="block text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-2" htmlFor="travelers-input">
                Number of Travelers <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-violet-700">
                    <Users className="w-5 h-5 text-violet-700 font-bold" />
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
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    className="w-full pl-11 pr-3 py-3 min-h-[46px] rounded-xl text-slate-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-black hover:bg-white focus:bg-white transition-all text-base shadow-sm"
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
                      style={{
                        background: travelers === p.count ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className={`px-3.5 py-2.5 min-h-[46px] text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center backdrop-blur-md shadow-sm ${
                        travelers === p.count
                          ? 'bg-black text-white shadow-md'
                          : 'text-black hover:bg-black hover:text-white active:bg-slate-900'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {errors.travelers ? (
                <p className="mt-1.5 text-xs sm:text-sm text-rose-800 font-extrabold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.travelers}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-950 font-bold">
                  {travelers === 1 ? 'Solo Trip' : travelers === 2 ? 'Couple / 2 Friends' : `${travelers} People Group`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: DEDICATED TRAVEL PREFERENCES & EXPERIENCE CUSTOMIZATION AREA  */}
        {/* ========================================================================= */}
        <div
          id="travel-preferences-section"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            border: '2px solid #000000',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }}
          className="rounded-2xl p-4 sm:p-7 space-y-7 backdrop-blur-md"
        >
          {/* Section 2 Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-violet-900 text-amber-300 font-mono font-black text-xs flex items-center gap-1.5 border border-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                <span>STEP 2</span>
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-black font-heading leading-tight">
                  Travel Preferences &amp; Experience
                </h3>
                <p className="text-xs text-slate-700 font-bold">
                  Select your travel styles, food choices, activity interests, and specific desires.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                style={{
                  background: '#000000',
                  color: '#ffffff',
                }}
                className="text-xs font-mono font-black px-3 py-1 rounded-lg"
              >
                {selectedTravelStyles.length} Style{selectedTravelStyles.length === 1 ? '' : 's'}
              </span>
              <span
                style={{
                  background: '#fef08a',
                  border: '1.5px solid #000000',
                  color: '#000000',
                }}
                className="text-xs font-mono font-black px-3 py-1 rounded-lg"
              >
                {selectedFoodPreferences.length} Dietary Option{selectedFoodPreferences.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Travel Style Multi-Selection Area */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-violet-700" />
                  <span>Travel Style <span className="text-rose-600">*</span></span>
                </label>
                <span
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #000000',
                  }}
                  className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full text-black"
                >
                  Multi-Select Allowed
                </span>
              </div>
              <span className="text-xs font-mono font-extrabold text-violet-900 bg-violet-100 px-2.5 py-1 rounded-md border border-violet-300">
                {selectedTravelStyles.length === 0
                  ? 'Please select at least 1 style'
                  : selectedTravelStyles.join(' + ')}
              </span>
            </div>

            {/* Quick Combo Presets */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-black/5 border border-black/15">
              <span className="text-xs font-mono text-black font-extrabold uppercase shrink-0">Popular Combos:</span>
              {[
                { label: '🧗 + 🍜 Adventure & Foodie', styles: ['Adventure', 'Foodie & Culinary'] as TravelStyle[] },
                { label: '🏛️ + 🏖️ Cultural & Relaxed', styles: ['Cultural & Heritage', 'Relaxed'] as TravelStyle[] },
                { label: '🌿 + 🧗 Nature & Adventure', styles: ['Nature & Wildlife', 'Adventure'] as TravelStyle[] },
                { label: '✨ + 🌹 Luxury & Romantic', styles: ['Luxury', 'Romantic'] as TravelStyle[] },
                { label: '👨‍👩‍👧‍👦 + 🏖️ Family & Leisure', styles: ['Family Friendly', 'Relaxed'] as TravelStyle[] },
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
                    style={{
                      background: isComboActive ? '#000000' : '#ffffff',
                      border: '1.5px solid #000000',
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center shadow-2xs ${
                      isComboActive
                        ? 'bg-black text-white font-extrabold'
                        : 'text-black font-bold hover:bg-black hover:text-white'
                    }`}
                  >
                    {combo.label}
                  </button>
                );
              })}
            </div>

            {/* 3x3 Perfectly Sized Travel Style Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    style={{
                      background: isSelected ? 'rgba(238, 242, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                      border: isSelected ? '2.5px solid #000000' : '1.5px solid #000000',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.18)' : '0 2px 4px rgba(0,0,0,0.04)',
                    }}
                    className="p-3.5 h-full min-h-[78px] text-left rounded-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between active:scale-[0.98] hover:border-black group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{style.icon}</span>
                        <span className="text-sm font-black text-black">
                          {style.label}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-xs font-black flex items-center justify-center shrink-0 shadow-xs border border-white">
                          {selectedTravelStyles.length > 1 ? selectionIndex + 1 : '✓'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 font-bold leading-tight line-clamp-2">{style.desc}</p>
                  </button>
                );
              })}
            </div>

            {errors.travelStyle && (
              <p className="mt-1 text-xs sm:text-sm text-rose-800 font-extrabold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.travelStyle}
              </p>
            )}
          </div>

          {/* Food & Dietary Preferences Area */}
          <div className="space-y-3 pt-3 border-t border-black/15">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-violet-700" />
                  <span>Food &amp; Dining Preference <span className="text-rose-600">*</span></span>
                </label>
                <span
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #000000',
                  }}
                  className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full text-black"
                >
                  Multi-Diet Supported
                </span>
              </div>
              <span className="text-xs font-mono font-extrabold text-violet-900 bg-violet-100 px-2.5 py-1 rounded-md border border-violet-300">
                {selectedFoodPreferences.length === 0
                  ? 'Please select at least 1 dietary preference'
                  : selectedFoodPreferences.join(' + ')}
              </span>
            </div>

            {/* Quick Dietary Combos */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-black/5 border border-black/15">
              <span className="text-xs font-mono text-black font-extrabold uppercase shrink-0">Popular Dietary Combos:</span>
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
                    style={{
                      background: isComboActive ? '#000000' : '#ffffff',
                      border: '1.5px solid #000000',
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center shadow-2xs ${
                      isComboActive
                        ? 'bg-black text-white font-extrabold'
                        : 'text-black font-bold hover:bg-black hover:text-white'
                    }`}
                  >
                    {combo.label}
                  </button>
                );
              })}
            </div>

            {/* 4-Column Food Preferences Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    style={{
                      background: isSelected ? 'rgba(238, 242, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                      border: isSelected ? '2.5px solid #000000' : '1.5px solid #000000',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.18)' : '0 2px 4px rgba(0,0,0,0.04)',
                    }}
                    className="p-3.5 h-full min-h-[74px] text-left rounded-2xl transition-all cursor-pointer active:scale-[0.98] relative flex flex-col justify-between hover:border-black group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{food.icon}</span>
                        <span className="text-sm font-black text-black">
                          {food.label}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-black text-amber-300 text-xs font-black flex items-center justify-center shrink-0 shadow-xs border border-white">
                          {selectedFoodPreferences.length > 1 ? selectionIndex + 1 : '✓'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 font-bold leading-tight">{food.note}</p>
                  </button>
                );
              })}
            </div>

            {errors.foodPreference && (
              <p className="mt-1 text-xs sm:text-sm text-rose-800 font-extrabold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.foodPreference}
              </p>
            )}
          </div>

          {/* Interests & Activities Sub-Area */}
          <div className="space-y-3 pt-3 border-t border-black/15">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-violet-700" />
                <span>Interests &amp; Activities <span className="text-slate-600 font-normal text-xs">(Optional)</span></span>
              </label>
              <span className="text-xs font-mono font-extrabold text-black bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                {selectedInterests.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
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
                    className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-2xs ${
                      isSelected
                        ? 'bg-black text-white shadow-md'
                        : 'text-black hover:bg-black hover:text-white active:bg-slate-900'
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected && <span className="text-xs font-black text-amber-300">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes & Custom Requests Sub-Area */}
          <div className="space-y-2 pt-3 border-t border-black/15">
            <label className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black flex items-center justify-between" htmlFor="special-notes-input">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-700" />
                <span>Custom Notes &amp; Special Desires (Optional)</span>
              </span>
              <span className="text-slate-600 text-xs font-normal">e.g. pace, accessibility, celebration</span>
            </label>
            <input
              id="special-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Senior-friendly walking pace, celebration dinner on day 2, scenic photo stops..."
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid #000000',
              }}
              className="w-full px-4 py-3 rounded-xl text-slate-950 font-bold placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-black text-sm shadow-sm"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBMIT CTA ACTIONS */}
        {/* ========================================================================= */}
        <div
          style={{
            borderTop: '1.5px solid #000000',
          }}
          className="pt-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              id="generate-my-trip-btn"
              disabled={isLoading}
              style={{
                border: '1.5px solid #000000',
              }}
              className={`flex-1 w-full py-4 min-h-[54px] px-6 sm:px-8 rounded-2xl font-black text-base sm:text-lg text-white shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
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
              className="w-full sm:w-auto px-6 py-3.5 min-h-[54px] rounded-2xl font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider text-black hover:bg-black hover:text-white active:bg-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm backdrop-blur-md"
              title="Reset all form fields and hide generated trip plan"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3.5 text-xs sm:text-sm text-black font-mono font-bold text-center">
            <Info className="w-4 h-4 text-violet-700 shrink-0" />
            <span>Structured JSON verification with realistic transit clustering and budget clamping.</span>
          </div>
        </div>
      </form>
    </div>
  );
};

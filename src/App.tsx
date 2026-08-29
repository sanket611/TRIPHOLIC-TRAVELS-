import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TripForm } from './components/TripForm';
import { LoadingState } from './components/LoadingState';
import { TripSummaryCard } from './components/TripSummaryCard';
import { ItineraryView } from './components/ItineraryView';
import { RecommendedPlaces } from './components/RecommendedPlaces';
import { FoodRecommendations } from './components/FoodRecommendations';
import { BudgetBreakdown } from './components/BudgetBreakdown';
import { TravelTips } from './components/TravelTips';
import { SeatBookingSection } from './components/SeatBookingSection';
import { ModifyTrip } from './components/ModifyTrip';
import { SavedTripsModal } from './components/SavedTripsModal';
import { PromptDocsModal } from './components/PromptDocsModal';
import { TestSuiteModal } from './components/TestSuiteModal';
import { AvailableDestinationsModal } from './components/AvailableDestinationsModal';
import { BackgroundWallpaper } from './components/BackgroundWallpaper';
import { Footer } from './components/Footer';
import { TravelPreferences, TripPlan } from './types';
import { getRandomWallpaper, Wallpaper } from './wallpapers';
import { generatePlan, modifyPlan } from './plannerEngine';
import { AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_SAVED_KEY = 'tripgenie_saved_trips_v1';

export function App() {
  // Scenic Nature & Trip Wallpaper State (picks a random nature spot on every page open/refresh)
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => getRandomWallpaper());

  // Application State
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [currentModificationPrompt, setCurrentModificationPrompt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form initial prefill state
  const [formPrefill, setFormPrefill] = useState<Partial<TravelPreferences> | null>(null);

  // Modals state
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isPromptDocsOpen, setIsPromptDocsOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
  const [isDestinationsModalOpen, setIsDestinationsModalOpen] = useState(false);

  // Saved Trips Collection in localStorage
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Sync saved trips with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedTrips));
    } catch (e) {
      console.error('Failed to sync saved trips with localStorage', e);
    }
  }, [savedTrips]);

  // Handle Form Submission -> Generate Trip
  const handleGenerateTrip = async (prefs: TravelPreferences) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let data: TripPlan | null = null;

      try {
        const response = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prefs),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          console.warn(`Backend responded with status ${response.status}. Using resilient planner engine.`);
        }
      } catch (networkErr) {
        console.warn('Network or API route unavailable. Using resilient planner engine.', networkErr);
      }

      // If backend was unreachable or returned 404/non-200, use robust client-side generation
      if (!data || !data.tripSummary || !data.itinerary) {
        data = generatePlan(prefs);
      }

      setCurrentPlan(data);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating trip plan:', err);
      // Even in worst case, generate local plan
      const fallback = generatePlan(prefs);
      setCurrentPlan(fallback);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Modify & Regenerate Delta update
  const handleModifyTrip = async (modificationPrompt: string) => {
    if (!currentPlan) return;

    setIsModifying(true);
    setCurrentModificationPrompt(modificationPrompt);
    setErrorMessage(null);

    try {
      let updatedPlan: TripPlan | null = null;

      try {
        const response = await fetch('/api/modify-trip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPlan,
            modificationPrompt,
          }),
        });

        if (response.ok) {
          updatedPlan = await response.json();
        } else {
          console.warn(`Backend modify responded with status ${response.status}. Using resilient modifier engine.`);
        }
      } catch (networkErr) {
        console.warn('Network or API route unavailable. Using resilient modifier engine.', networkErr);
      }

      // If backend was unreachable or returned 404/non-200, use robust client-side modification
      if (!updatedPlan || !updatedPlan.tripSummary || !updatedPlan.itinerary) {
        updatedPlan = modifyPlan(currentPlan, modificationPrompt);
      }

      setCurrentPlan(updatedPlan);

      // If this trip was already saved, update it in saved collection too
      setSavedTrips((prev) =>
        prev.map((t) => (t.id === updatedPlan!.id ? updatedPlan! : t))
      );
    } catch (err: any) {
      console.error('Error modifying trip plan:', err);
      const fallback = modifyPlan(currentPlan, modificationPrompt);
      setCurrentPlan(fallback);
    } finally {
      setIsModifying(false);
      setCurrentModificationPrompt('');
    }
  };

  // Save Trip toggle
  const handleSaveTrip = (plan: TripPlan) => {
    setSavedTrips((prev) => {
      const exists = prev.some((t) => t.id === plan.id);
      if (exists) {
        return prev.filter((t) => t.id !== plan.id);
      } else {
        return [plan, ...prev];
      }
    });
  };

  // Delete saved trip
  const handleDeleteSavedTrip = (id: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== id));
  };

  // Clear all saved trips
  const handleClearAllSavedTrips = () => {
    if (window.confirm('Are you sure you want to delete all saved trips?')) {
      setSavedTrips([]);
    }
  };

  // Load a saved trip
  const handleLoadTrip = (trip: TripPlan) => {
    setCurrentPlan(trip);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Start new trip / Reset All
  const handleStartNewTrip = () => {
    setCurrentPlan(null);
    setFormPrefill(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply Quick-Start preset from Hero or Test Suite
  const handleSelectPreset = (preset: Partial<TravelPreferences>) => {
    setFormPrefill(preset);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Change wallpaper to specific or randomized destination
  const handleWallpaperChange = (wallpaper?: Wallpaper) => {
    if (wallpaper) {
      setCurrentWallpaper(wallpaper);
    } else {
      setCurrentWallpaper((prev) => getRandomWallpaper(prev.id));
    }
  };

  const isCurrentPlanSaved = currentPlan
    ? savedTrips.some((t) => t.id === currentPlan.id)
    : false;

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Dynamic Scenic Nature & Trip Ambient Wallpaper */}
      <BackgroundWallpaper
        currentWallpaper={currentWallpaper}
        onChangeWallpaper={handleWallpaperChange}
      />

      {/* Header */}
      <Header
        savedTripsCount={savedTrips.length}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        onOpenDocs={() => setIsPromptDocsOpen(true)}
        onOpenTests={() => setIsTestSuiteOpen(true)}
        onStartNewTrip={handleStartNewTrip}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full relative z-10">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Trip Planning Notice</p>
                <p className="text-rose-700 text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 text-xs font-bold px-2 py-1 rounded-md cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Section (Show on main landing) */}
        {!currentPlan && !isLoading && (
          <Hero
            onSelectPreset={handleSelectPreset}
            currentWallpaper={currentWallpaper}
            onChangeWallpaper={handleWallpaperChange}
            onOpenDestinationsModal={() => setIsDestinationsModalOpen(true)}
          />
        )}

        {/* Form Container */}
        <div ref={formRef}>
          <TripForm
            onGenerateTrip={handleGenerateTrip}
            onReset={handleStartNewTrip}
            isLoading={isLoading}
            initialValues={formPrefill || undefined}
            onOpenDestinationsModal={() => setIsDestinationsModalOpen(true)}
          />
        </div>

        {/* Loading Indicator */}
        {(isLoading || isModifying) && (
          <LoadingState
            destination={currentPlan?.tripSummary.destination}
            isModifying={isModifying}
            modificationPrompt={currentModificationPrompt}
          />
        )}

        {/* Generated Trip Plan Results */}
        {currentPlan && !isLoading && (
          <div ref={resultsRef} className="mt-6 sm:mt-8 space-y-6 sm:space-y-8 animate-fade-in">
            {/* 1. Trip Summary & Action Card */}
            <TripSummaryCard
              plan={currentPlan}
              onSaveTrip={handleSaveTrip}
              isSaved={isCurrentPlanSaved}
              onStartNewTrip={handleStartNewTrip}
            />

            {/* 2. Day-by-Day Itinerary */}
            <ItineraryView
              itinerary={currentPlan.itinerary}
              destination={currentPlan.tripSummary.destination}
            />

            {/* 3. Recommended Places */}
            <RecommendedPlaces
              places={currentPlan.recommendedPlaces}
              destination={currentPlan.tripSummary.destination}
              travelStyle={currentPlan.tripSummary.travelStyle}
            />

            {/* 4. Food Recommendations */}
            <FoodRecommendations
              foodRecommendations={currentPlan.foodRecommendations}
              foodPreference={currentPlan.tripSummary.foodPreference}
            />

            {/* 5. Budget Breakdown */}
            <BudgetBreakdown
              budget={currentPlan.budget}
              duration={currentPlan.tripSummary.duration}
              travelers={currentPlan.tripSummary.travelers}
            />

            {/* 6. Travel Tips & Checkable Packing List */}
            <TravelTips travelTips={currentPlan.travelTips} />

            {/* 7. Confirm Your Seat Now & Booking Reservation */}
            <SeatBookingSection plan={currentPlan} />

            {/* 8. Modify Your Trip Section */}
            <ModifyTrip
              currentPlan={currentPlan}
              onModify={handleModifyTrip}
              isModifying={isModifying}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenDocs={() => setIsPromptDocsOpen(true)}
        onOpenTests={() => setIsTestSuiteOpen(true)}
      />

      {/* Modals */}
      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        savedTrips={savedTrips}
        onLoadTrip={handleLoadTrip}
        onDeleteTrip={handleDeleteSavedTrip}
        onClearAll={handleClearAllSavedTrips}
      />

      <PromptDocsModal
        isOpen={isPromptDocsOpen}
        onClose={() => setIsPromptDocsOpen(false)}
      />

      <TestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
        onApplyTestScenarioToForm={handleSelectPreset}
      />

      <AvailableDestinationsModal
        isOpen={isDestinationsModalOpen}
        onClose={() => setIsDestinationsModalOpen(false)}
        onSelectDestination={(dest) => {
          setFormPrefill({
            destination: dest.name,
            duration: dest.suggestedDuration,
            budget: dest.estimatedBudgetRange,
            travelStyle: dest.style,
          });
          setIsDestinationsModalOpen(false);
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
}

export default App;

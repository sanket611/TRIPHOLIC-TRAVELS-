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
import { ContactSection } from './components/ContactSection';
import { SavedTripsModal } from './components/SavedTripsModal';
import { PromptDocsModal } from './components/PromptDocsModal';
import { TestSuiteModal } from './components/TestSuiteModal';
import { AvailableDestinationsModal } from './components/AvailableDestinationsModal';
import { Footer } from './components/Footer';
import { SectionNav, ResultSectionId, SECTIONS_CONFIG } from './components/SectionNav';
import { CompactPreferencesBar } from './components/CompactPreferencesBar';
import { QuickDock } from './components/QuickDock';
import { LeftNavigationSidebar, MainNavId } from './components/LeftNavigationSidebar';
import { TravelPreferences, TripPlan } from './types';
import { generatePlan, modifyPlan } from './plannerEngine';
import { AlertCircle, ArrowLeft, ArrowRight, Armchair, Compass } from 'lucide-react';

const LOCAL_STORAGE_SAVED_KEY = 'tripgenie_saved_trips_v1';

const SECTION_ORDER: ResultSectionId[] = [
  'itinerary',
  'places',
  'food',
  'budget',
  'tips',
  'seat-booking',
  'modify',
];

export function App() {
  // Application State
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [currentModificationPrompt, setCurrentModificationPrompt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Left Sidebar & Navigation State
  const [activeNav, setActiveNav] = useState<MainNavId>('explore');
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  // Navigation and No-Scroll Layout State
  const [activeSection, setActiveSection] = useState<ResultSectionId>('itinerary');
  const [viewMode, setViewMode] = useState<'tabbed' | 'all'>('tabbed');
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);

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
      setIsFormExpanded(false);
      setActiveSection('itinerary');
      setActiveNav('itinerary');
      setSelectedDay('all');

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating trip plan:', err);
      // Even in worst case, generate local plan
      const fallback = generatePlan(prefs);
      setCurrentPlan(fallback);
      setIsFormExpanded(false);
      setActiveSection('itinerary');
      setActiveNav('itinerary');
      setSelectedDay('all');
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
    setIsFormExpanded(false);
    setActiveSection('itinerary');
    setActiveNav('itinerary');
    setSelectedDay('all');
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Start new trip / Reset All
  const handleStartNewTrip = () => {
    setCurrentPlan(null);
    setFormPrefill(null);
    setErrorMessage(null);
    setIsFormExpanded(true);
    setActiveNav('explore');
    setSelectedDay('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply Quick-Start preset from Hero or Test Suite
  const handleSelectPreset = (preset: Partial<TravelPreferences>) => {
    setFormPrefill(preset);
    setIsFormExpanded(true);
    setActiveNav('preferences');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle section selection (Tabbed mode switch or All mode smooth scroll)
  const handleSelectSection = (sectionId: ResultSectionId) => {
    setActiveSection(sectionId);
    setActiveNav(sectionId as MainNavId);
    if (viewMode === 'all') {
      const el = document.getElementById(`section-${sectionId}`) || document.getElementById(`${sectionId}-section`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // In tabbed mode, ensure user is nicely positioned right below the header
      const navEl = document.getElementById('results-section-nav');
      if (navEl) {
        navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Handle option selection from Left Navigation Sidebar
  const handleSelectNav = (id: MainNavId, dayNumber?: number) => {
    setActiveNav(id);

    if (id === 'explore') {
      const exploreEl = document.getElementById('explore-section');
      if (exploreEl) {
        exploreEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (id === 'preferences') {
      setIsFormExpanded(true);
      setTimeout(() => {
        const formEl = document.getElementById('trip-preferences-section') || formRef.current;
        formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }

    if (id === 'overview') {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (id === 'itinerary') {
      setActiveSection('itinerary');
      if (dayNumber !== undefined) {
        setSelectedDay(dayNumber);
      } else {
        setSelectedDay('all');
      }

      setTimeout(() => {
        if (viewMode === 'all') {
          const el = document.getElementById('section-itinerary');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          const navEl = document.getElementById('results-section-nav') || document.getElementById('section-itinerary');
          navEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return;
    }

    if (id === 'contact') {
      const contactBtn = document.getElementById('btn-reveal-contact-us');
      if (contactBtn) {
        contactBtn.click();
      }
      const contactEl = document.getElementById('contact-us-section') || document.getElementById('contact-section');
      contactEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Direct result sections: places, food, budget, tips, seat-booking, modify
    if (SECTION_ORDER.includes(id as ResultSectionId)) {
      handleSelectSection(id as ResultSectionId);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentPlanSaved = currentPlan
    ? savedTrips.some((t) => t.id === currentPlan.id)
    : false;

  // Active section index and neighbors for stepper
  const currentSectionIndex = SECTION_ORDER.indexOf(activeSection);
  const prevSectionId = currentSectionIndex > 0 ? SECTION_ORDER[currentSectionIndex - 1] : null;
  const nextSectionId = currentSectionIndex < SECTION_ORDER.length - 1 ? SECTION_ORDER[currentSectionIndex + 1] : null;
  const prevSectionConfig = prevSectionId ? SECTIONS_CONFIG.find((s) => s.id === prevSectionId) : null;
  const nextSectionConfig = nextSectionId ? SECTIONS_CONFIG.find((s) => s.id === nextSectionId) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Header */}
      <Header
        savedTripsCount={savedTrips.length}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        onOpenDocs={() => setIsPromptDocsOpen(true)}
        onOpenTests={() => setIsTestSuiteOpen(true)}
        onStartNewTrip={handleStartNewTrip}
      />

      {/* Main Container with Permanent Left Sidebar */}
      <main className="flex-1 max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6 w-full relative z-10">
        <div className="flex flex-row items-start gap-2.5 sm:gap-4 md:gap-6">
          {/* Left Column: Direct Permanent Trip Menu Navigation Sidebar - ALWAYS visible on left side! */}
          <div className="w-16 xs:w-20 sm:w-72 md:w-80 lg:w-84 shrink-0 sticky top-3 sm:top-4 z-20">
            <LeftNavigationSidebar
              hasPlan={Boolean(currentPlan)}
              plan={currentPlan}
              activeNav={activeNav}
              onSelectNav={handleSelectNav}
              selectedDay={selectedDay}
              savedTripsCount={savedTrips.length}
              onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
              onOpenDestinationsModal={() => setIsDestinationsModalOpen(true)}
              onStartNewTrip={handleStartNewTrip}
            />
          </div>

          {/* Right Column: Main App Content */}
          <div className="flex-1 min-w-0 w-full space-y-5">
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
            onOpenDestinationsModal={() => setIsDestinationsModalOpen(true)}
          />
        )}

        {/* Compact Trip Preferences Bar (shown when a plan exists to avoid 1200px of scrolling) */}
        {currentPlan && !isLoading && (
          <CompactPreferencesBar
            plan={currentPlan}
            isFormExpanded={isFormExpanded}
            onToggleForm={() => setIsFormExpanded(!isFormExpanded)}
            onStartNewTrip={handleStartNewTrip}
          />
        )}

        {/* Form Container (Expanded or when no plan exists) */}
        {(!currentPlan || isFormExpanded) && (
          <div ref={formRef} id="trip-preferences-section" className="mb-6 animate-fade-in">
            <TripForm
              onGenerateTrip={handleGenerateTrip}
              onReset={handleStartNewTrip}
              isLoading={isLoading}
              initialValues={formPrefill || undefined}
              onOpenDestinationsModal={() => setIsDestinationsModalOpen(true)}
            />
          </div>
        )}

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
          <div ref={resultsRef} className="mt-4 sm:mt-6 space-y-5 animate-fade-in">
            {/* 1. Trip Summary & Action Card with 1-click Quick Jump Chips */}
            <TripSummaryCard
              plan={currentPlan}
              onSaveTrip={handleSaveTrip}
              isSaved={isCurrentPlanSaved}
              onStartNewTrip={handleStartNewTrip}
              onSelectSection={handleSelectSection}
            />

            {/* Sticky Navigation Bar (Tabbed View avoids scrolling entirely) */}
            <SectionNav
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
            />

            {/* TABBED NO-SCROLL VIEW MODE */}
            {viewMode === 'tabbed' && (
              <div className="space-y-6">
                {activeSection === 'itinerary' && (
                  <div id="section-itinerary" className="animate-fade-in">
                    <ItineraryView
                      itinerary={currentPlan.itinerary}
                      destination={currentPlan.tripSummary.destination}
                      selectedDay={selectedDay}
                      onSelectDay={(day) => setSelectedDay(day)}
                    />
                  </div>
                )}

                {activeSection === 'places' && (
                  <div id="section-places" className="animate-fade-in">
                    <RecommendedPlaces
                      places={currentPlan.recommendedPlaces}
                      destination={currentPlan.tripSummary.destination}
                      travelStyle={currentPlan.tripSummary.travelStyle}
                    />
                  </div>
                )}

                {activeSection === 'food' && (
                  <div id="section-food" className="animate-fade-in">
                    <FoodRecommendations
                      foodRecommendations={currentPlan.foodRecommendations}
                      foodPreference={currentPlan.tripSummary.foodPreference}
                    />
                  </div>
                )}

                {activeSection === 'budget' && (
                  <div id="section-budget" className="animate-fade-in">
                    <BudgetBreakdown
                      budget={currentPlan.budget}
                      duration={currentPlan.tripSummary.duration}
                      travelers={currentPlan.tripSummary.travelers}
                    />
                  </div>
                )}

                {activeSection === 'tips' && (
                  <div id="section-tips" className="animate-fade-in">
                    <TravelTips travelTips={currentPlan.travelTips} />
                  </div>
                )}

                {activeSection === 'seat-booking' && (
                  <div id="section-seat-booking" className="animate-fade-in">
                    <SeatBookingSection plan={currentPlan} />
                  </div>
                )}

                {activeSection === 'modify' && (
                  <div id="section-modify" className="animate-fade-in">
                    <ModifyTrip
                      currentPlan={currentPlan}
                      onModify={handleModifyTrip}
                      isModifying={isModifying}
                    />
                  </div>
                )}

                {/* Convenient Tab Stepper (Next / Previous / Seat Booking) */}
                <div
                  id="tabbed-stepper-bar"
                  style={{
                    border: '2px solid #000000',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                  className="p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 backdrop-blur-md"
                >
                  <div>
                    {prevSectionConfig ? (
                      <button
                        type="button"
                        id="stepper-prev-btn"
                        onClick={() => handleSelectSection(prevSectionConfig.id)}
                        style={{ border: '1.5px solid #000000' }}
                        className="px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous: {prevSectionConfig.label}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-500">
                        First Section
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeSection !== 'seat-booking' && (
                      <button
                        type="button"
                        id="stepper-book-seat-btn"
                        onClick={() => handleSelectSection('seat-booking')}
                        style={{ border: '1.5px solid #000000' }}
                        className="px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold bg-indigo-50 hover:bg-indigo-100 text-indigo-950 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        <Armchair className="w-4 h-4 text-indigo-700" />
                        <span>Book Seat (₹250)</span>
                      </button>
                    )}

                    {nextSectionConfig && (
                      <button
                        type="button"
                        id="stepper-next-btn"
                        onClick={() => handleSelectSection(nextSectionConfig.id)}
                        style={{ border: '2px solid #000000' }}
                        className="px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-black text-white bg-black hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        <span>Next: {nextSectionConfig.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SHOW ALL CONTINUOUS SCROLL MODE */}
            {viewMode === 'all' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                {/* 2. Day-by-Day Itinerary */}
                <div id="section-itinerary">
                  <ItineraryView
                    itinerary={currentPlan.itinerary}
                    destination={currentPlan.tripSummary.destination}
                    selectedDay={selectedDay}
                    onSelectDay={(day) => setSelectedDay(day)}
                  />
                </div>

                {/* 3. Recommended Places */}
                <div id="section-places">
                  <RecommendedPlaces
                    places={currentPlan.recommendedPlaces}
                    destination={currentPlan.tripSummary.destination}
                    travelStyle={currentPlan.tripSummary.travelStyle}
                  />
                </div>

                {/* 4. Food Recommendations */}
                <div id="section-food">
                  <FoodRecommendations
                    foodRecommendations={currentPlan.foodRecommendations}
                    foodPreference={currentPlan.tripSummary.foodPreference}
                  />
                </div>

                {/* 5. Budget Breakdown */}
                <div id="section-budget">
                  <BudgetBreakdown
                    budget={currentPlan.budget}
                    duration={currentPlan.tripSummary.duration}
                    travelers={currentPlan.tripSummary.travelers}
                  />
                </div>

                {/* 6. Travel Tips & Checkable Packing List */}
                <div id="section-tips">
                  <TravelTips travelTips={currentPlan.travelTips} />
                </div>

                {/* 7. Confirm Your Seat Now & Booking Reservation */}
                <div id="section-seat-booking">
                  <SeatBookingSection plan={currentPlan} />
                </div>

                {/* 8. Modify Your Trip Section */}
                <div id="section-modify">
                  <ModifyTrip
                    currentPlan={currentPlan}
                    onModify={handleModifyTrip}
                    isModifying={isModifying}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Quick Dock for 1-Click Navigation */}
        {currentPlan && !isLoading && (
          <QuickDock
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            onScrollToTop={handleScrollToTop}
            destination={currentPlan.tripSummary.destination}
          />
        )}

            {/* Contact Us Section at End of Page */}
            <div className="mt-8 sm:mt-10">
              <ContactSection />
            </div>
          </div>
        </div>
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

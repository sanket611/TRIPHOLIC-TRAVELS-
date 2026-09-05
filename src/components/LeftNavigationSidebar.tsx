import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Utensils,
  DollarSign,
  Lightbulb,
  Armchair,
  Edit3,
  Bookmark,
  Grid,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { TripPlan } from '../types';
import { SocialJoinUs } from './SocialJoinUs';

export type MainNavId =
  | 'explore'
  | 'preferences'
  | 'overview'
  | 'itinerary'
  | 'places'
  | 'food'
  | 'budget'
  | 'tips'
  | 'seat-booking'
  | 'modify'
  | 'contact';

interface LeftNavigationSidebarProps {
  hasPlan: boolean;
  plan: TripPlan | null;
  activeNav: MainNavId;
  onSelectNav: (id: MainNavId, dayNumber?: number) => void;
  selectedDay?: number | 'all';
  savedTripsCount: number;
  onOpenSavedTrips: () => void;
  onOpenDestinationsModal: () => void;
  onStartNewTrip: () => void;
}

export const LeftNavigationSidebar: React.FC<LeftNavigationSidebarProps> = ({
  hasPlan,
  plan,
  activeNav,
  onSelectNav,
  selectedDay = 'all',
  savedTripsCount,
  onOpenSavedTrips,
  onOpenDestinationsModal,
  onStartNewTrip,
}) => {
  const [isDaysSubmenuOpen, setIsDaysSubmenuOpen] = useState(true);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const tripOptionsRef = useRef<HTMLDivElement>(null);

  // Auto scroll the sidebar to trip options when plan is generated
  useEffect(() => {
    if (hasPlan && plan) {
      setTimeout(() => {
        tripOptionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  }, [hasPlan, plan?.id]);

  const handleNavClick = (id: MainNavId, dayNumber?: number) => {
    onSelectNav(id, dayNumber);
    // If mobile expanded overlay was open, close it after choosing an option
    if (isMobileExpanded) {
      setIsMobileExpanded(false);
    }
  };

  return (
    <>
      {/* Backdrop when expanded on mobile */}
      {isMobileExpanded && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
          onClick={() => setIsMobileExpanded(false)}
        />
      )}

      <aside
        id="left-navigation-sidebar"
        aria-label="Trip Planner Navigation"
        style={{
          border: '2px solid #000000',
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 10px 32px rgba(0, 0, 0, 0.12)',
        }}
        className={`rounded-2xl sm:rounded-3xl transition-all duration-200 backdrop-blur-xl flex flex-col justify-between max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin z-30 ${
          isMobileExpanded
            ? 'fixed top-3 left-2 bottom-3 w-72 p-3.5 sm:p-4 z-40 bg-white shadow-2xl'
            : 'w-full p-2 sm:p-4 sticky top-3 sm:top-4'
        }`}
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-black/10">
            <div className="flex items-center gap-2 min-w-0">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-black text-amber-300 flex items-center justify-center font-black shadow-xs shrink-0"
              >
                <Compass className="w-4 h-4" />
              </div>
              <div className={`min-w-0 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                <p className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 leading-none">
                  Trip Menu
                </p>
                <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5">
                  {hasPlan ? plan?.tripSummary.destination : 'Start Planning'}
                </p>
              </div>
            </div>

            {/* Mobile Expand / Collapse Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              style={{ border: '1.5px solid #000000' }}
              className="p-1 rounded-lg bg-slate-100 hover:bg-black hover:text-white transition-all sm:hidden cursor-pointer shrink-0"
              title={isMobileExpanded ? 'Collapse Menu' : 'Expand Menu'}
              aria-label={isMobileExpanded ? 'Collapse Menu' : 'Expand Menu'}
            >
              {isMobileExpanded ? (
                <ChevronLeft className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* SECTION 1: FIRST PAGE OPTIONS (Always available) */}
          <div>
            <div
              className={`flex items-center justify-between mb-1.5 px-1 ${
                isMobileExpanded ? 'flex' : 'hidden sm:flex'
              }`}
            >
              <span className="text-[10px] font-mono font-extrabold text-slate-700 uppercase tracking-wider">
                {hasPlan ? 'Base Navigation' : 'Step 1: Get Started'}
              </span>
              <span
                style={{ border: '1px solid #000000' }}
                className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-slate-900"
              >
                Direct
              </span>
            </div>

            <div className="space-y-1">
              {/* 1. Explore Places Option */}
              <button
                type="button"
                id="sidebar-nav-explore"
                onClick={() => handleNavClick('explore')}
                style={{
                  border: activeNav === 'explore' ? '2px solid #000000' : '1.5px solid transparent',
                  background: activeNav === 'explore' ? '#000000' : 'transparent',
                  color: activeNav === 'explore' ? '#ffffff' : '#0f172a',
                }}
                className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[40px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer font-bold text-xs sm:text-sm group ${
                  activeNav === 'explore'
                    ? 'shadow-xs font-black'
                    : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                }`}
                title="1. Explore Places & Hotspots"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Compass
                    className={`w-4 h-4 shrink-0 ${
                      activeNav === 'explore' ? 'text-amber-300' : 'text-indigo-600'
                    }`}
                  />
                  <div className={`min-w-0 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                    <div className="leading-tight font-black">1. Explore</div>
                    <div
                      className={`text-[10px] font-medium leading-none mt-0.5 truncate ${
                        activeNav === 'explore' ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      Presets &amp; Destinations
                    </div>
                  </div>
                </div>
                <Sparkles
                  className={`w-3.5 h-3.5 shrink-0 ${
                    activeNav === 'explore' ? 'text-amber-300' : 'text-slate-400'
                  } ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}
                />
              </button>

              {/* 2. Trip Preferences Option */}
              <button
                type="button"
                id="sidebar-nav-preferences"
                onClick={() => handleNavClick('preferences')}
                style={{
                  border:
                    activeNav === 'preferences' ? '2px solid #000000' : '1.5px solid transparent',
                  background: activeNav === 'preferences' ? '#000000' : 'transparent',
                  color: activeNav === 'preferences' ? '#ffffff' : '#0f172a',
                }}
                className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[40px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer font-bold text-xs sm:text-sm group ${
                  activeNav === 'preferences'
                    ? 'shadow-xs font-black'
                    : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                }`}
                title="2. Trip Preferences Form"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <SlidersHorizontal
                    className={`w-4 h-4 shrink-0 ${
                      activeNav === 'preferences' ? 'text-amber-300' : 'text-indigo-600'
                    }`}
                  />
                  <div className={`min-w-0 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                    <div className="leading-tight font-black">2. Trip Preferences</div>
                    <div
                      className={`text-[10px] font-medium leading-none mt-0.5 truncate ${
                        activeNav === 'preferences' ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      Dates, budget, food
                    </div>
                  </div>
                </div>
                <span
                  style={{ border: '1px solid #000000' }}
                  className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded shrink-0 ${
                    isMobileExpanded ? 'inline' : 'hidden sm:inline'
                  } ${
                    activeNav === 'preferences'
                      ? 'bg-amber-300 text-black'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  Form
                </span>
              </button>

              {/* Places Catalog Link */}
              <button
                type="button"
                id="sidebar-nav-destinations-modal"
                onClick={() => {
                  onOpenDestinationsModal();
                  if (isMobileExpanded) setIsMobileExpanded(false);
                }}
                style={{ border: '1.5px solid transparent' }}
                className="w-full text-left p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center sm:justify-between hover:bg-slate-100 hover:border-black/20 transition-all cursor-pointer text-slate-700 hover:text-black text-xs font-bold"
                title="Browse Places Catalog"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-violet-600 shrink-0" />
                  <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                    Places Catalog
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold text-violet-700 ${
                    isMobileExpanded ? 'block' : 'hidden sm:block'
                  }`}
                >
                  Browse →
                </span>
              </button>

              {/* Saved Trips Link */}
              <button
                type="button"
                id="sidebar-nav-saved-trips"
                onClick={() => {
                  onOpenSavedTrips();
                  if (isMobileExpanded) setIsMobileExpanded(false);
                }}
                style={{ border: '1.5px solid transparent' }}
                className="w-full text-left p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center sm:justify-between hover:bg-slate-100 hover:border-black/20 transition-all cursor-pointer text-slate-700 hover:text-black text-xs font-bold"
                title="Saved Trips"
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                    Saved Trips
                  </span>
                </div>
                <span
                  style={{ border: '1px solid #000000' }}
                  className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-md bg-black text-white ${
                    isMobileExpanded ? 'block' : 'hidden sm:block'
                  }`}
                >
                  {savedTripsCount}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 2: AFTER GENERATE OPTIONS (Directly available after clicking Generate) */}
          {hasPlan && plan ? (
            <div
              ref={tripOptionsRef}
              id="trip-generated-menu-section"
              className="pt-2 sm:pt-3 border-t border-black/10 space-y-2 animate-fade-in"
            >
              <div
                className={`flex items-center justify-between px-1 ${
                  isMobileExpanded ? 'flex' : 'hidden sm:flex'
                }`}
              >
                <span className="text-[10px] font-mono font-extrabold text-indigo-950 uppercase tracking-wider truncate">
                  {plan.tripSummary.destination}
                </span>
                <span
                  style={{ border: '1px solid #000000' }}
                  className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded-md bg-emerald-300 text-black uppercase"
                >
                  Generated
                </span>
              </div>

              <div className="space-y-1">
                {/* 1. Trip Overview Option */}
                <button
                  type="button"
                  id="sidebar-nav-overview"
                  onClick={() => handleNavClick('overview')}
                  style={{
                    border:
                      activeNav === 'overview' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'overview' ? '#000000' : 'transparent',
                    color: activeNav === 'overview' ? '#ffffff' : '#0f172a',
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    activeNav === 'overview'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                  }`}
                  title="Trip Overview"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        activeNav === 'overview' ? 'text-amber-300' : 'text-emerald-600'
                      }`}
                    />
                    <span
                      className={`truncate ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}
                    >
                      Trip Overview
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold shrink-0 ${
                      isMobileExpanded ? 'block' : 'hidden sm:block'
                    }`}
                  >
                    {plan.tripSummary.duration}D
                  </span>
                </button>

                {/* 2. Day by Day Option */}
                <div
                  style={{
                    border:
                      activeNav === 'itinerary' ? '2px solid #000000' : '1.5px solid #00000020',
                    background: activeNav === 'itinerary' ? '#f8fafc' : 'transparent',
                  }}
                  className="rounded-xl overflow-hidden transition-all"
                >
                  <div className="flex items-center justify-between pr-1">
                    <button
                      type="button"
                      id="sidebar-nav-itinerary"
                      onClick={() => handleNavClick('itinerary')}
                      style={{
                        background: activeNav === 'itinerary' ? '#000000' : 'transparent',
                        color: activeNav === 'itinerary' ? '#ffffff' : '#0f172a',
                      }}
                      className={`flex-1 text-left p-2 sm:px-3 sm:py-2 min-h-[38px] flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                        activeNav === 'itinerary' ? 'font-black' : 'text-slate-800'
                      }`}
                      title="Day by Day Schedule"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar
                          className={`w-4 h-4 shrink-0 ${
                            activeNav === 'itinerary' ? 'text-amber-300' : 'text-indigo-600'
                          }`}
                        />
                        <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                          Day by Day
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDaysSubmenuOpen(!isDaysSubmenuOpen)}
                      className={`p-1 rounded-lg hover:bg-slate-200 cursor-pointer text-slate-600 ${
                        isMobileExpanded ? 'block' : 'hidden sm:block'
                      }`}
                      title={isDaysSubmenuOpen ? 'Hide days' : 'Show days'}
                    >
                      {isDaysSubmenuOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Day-by-Day Child Option Buttons */}
                  {isDaysSubmenuOpen && (
                    <div
                      className={`px-2 pb-2 pt-1 border-t border-black/10 bg-slate-50/90 space-y-1 ${
                        isMobileExpanded ? 'block' : 'hidden sm:block'
                      }`}
                    >
                      <div className="flex items-center justify-between px-1 text-[10px] font-mono font-bold text-slate-600">
                        <span>SELECT DAY:</span>
                        <button
                          type="button"
                          onClick={() => handleNavClick('itinerary', undefined)}
                          className={`hover:underline cursor-pointer ${
                            selectedDay === 'all' && activeNav === 'itinerary'
                              ? 'font-black text-black'
                              : 'text-slate-500'
                          }`}
                        >
                          All ({plan.itinerary.length})
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1">
                        {plan.itinerary.map((dayItem) => {
                          const isThisDayActive =
                            activeNav === 'itinerary' && selectedDay === dayItem.day;
                          return (
                            <button
                              key={dayItem.day}
                              type="button"
                              id={`sidebar-day-btn-${dayItem.day}`}
                              onClick={() => handleNavClick('itinerary', dayItem.day)}
                              style={{
                                border: isThisDayActive
                                  ? '1.5px solid #000000'
                                  : '1px solid #cbd5e1',
                                background: isThisDayActive ? '#000000' : '#ffffff',
                                color: isThisDayActive ? '#ffffff' : '#000000',
                              }}
                              className="px-2 py-1.5 rounded-lg text-left text-xs font-extrabold flex items-center justify-between cursor-pointer hover:border-black transition-all shadow-2xs group"
                              title={`Day ${dayItem.day}: ${dayItem.title}`}
                            >
                              <span className="font-mono">Day {dayItem.day}</span>
                              <span
                                className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                  isThisDayActive
                                    ? 'bg-amber-300 text-black font-black'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                D{dayItem.day}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Food & Dining Option (Placed after Day by Day as requested) */}
                <button
                  type="button"
                  id="sidebar-nav-food"
                  onClick={() => handleNavClick('food')}
                  style={{
                    border: activeNav === 'food' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'food' ? '#000000' : 'transparent',
                    color: activeNav === 'food' ? '#ffffff' : '#0f172a',
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    activeNav === 'food'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                  }`}
                  title="Food Recommendations"
                >
                  <div className="flex items-center gap-2.5">
                    <Utensils
                      className={`w-4 h-4 shrink-0 ${
                        activeNav === 'food' ? 'text-amber-300' : 'text-amber-600'
                      }`}
                    />
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Food &amp; Dining
                    </span>
                  </div>
                  <span
                    style={{ border: '1px solid #000000' }}
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isMobileExpanded ? 'block' : 'hidden sm:block'
                    } ${
                      activeNav === 'food'
                        ? 'bg-amber-300 text-black'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {plan.foodRecommendations.length}
                  </span>
                </button>

                {/* 4. Places to Visit Option (After Day by Day as requested) */}
                <button
                  type="button"
                  id="sidebar-nav-places"
                  onClick={() => handleNavClick('places')}
                  style={{
                    border: activeNav === 'places' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'places' ? '#000000' : 'transparent',
                    color: activeNav === 'places' ? '#ffffff' : '#0f172a',
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    activeNav === 'places'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                  }`}
                  title="Places to Visit"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin
                      className={`w-4 h-4 shrink-0 ${
                        activeNav === 'places' ? 'text-amber-300' : 'text-indigo-600'
                      }`}
                    />
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Places to Visit
                    </span>
                  </div>
                  <span
                    style={{ border: '1px solid #000000' }}
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isMobileExpanded ? 'block' : 'hidden sm:block'
                    } ${
                      activeNav === 'places'
                        ? 'bg-amber-300 text-black'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {plan.recommendedPlaces.length}
                  </span>
                </button>

                {/* 5. Book Seat Now Option (Prominent High-Contrast Button, after Places to Visit as requested) */}
                <div className="pt-1">
                  <button
                    type="button"
                    id="sidebar-nav-seat-booking"
                    onClick={() => handleNavClick('seat-booking')}
                    style={{
                      border: '2px solid #000000',
                      background:
                        activeNav === 'seat-booking'
                          ? '#312e81'
                          : 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(67, 56, 202, 0.25)',
                    }}
                    className={`w-full text-left p-2 sm:p-2.5 min-h-[44px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer font-black text-xs sm:text-sm active:scale-98 ${
                      activeNav === 'seat-booking'
                        ? 'ring-2 ring-amber-300'
                        : 'hover:scale-[1.02]'
                    }`}
                    title="Book Seat Now - ₹250 Advance Reservation"
                  >
                    <div className="flex items-center gap-2">
                      <Armchair className="w-4 h-4 text-amber-300 fill-amber-300/30 shrink-0" />
                      <div className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                        <div className="leading-tight">Book Seat Now</div>
                        <div className="text-[10px] text-amber-200 font-mono font-normal">
                          Advance reservation
                        </div>
                      </div>
                    </div>
                    <span
                      style={{ border: '1px solid #000000' }}
                      className={`text-[11px] font-mono font-black px-1.5 sm:px-2 py-0.5 rounded bg-amber-400 text-black shrink-0 ${
                        isMobileExpanded ? 'inline' : 'hidden sm:inline'
                      }`}
                    >
                      ₹250
                    </span>
                  </button>
                </div>

                {/* 6. Budget Breakdown Option */}
                <button
                  type="button"
                  id="sidebar-nav-budget"
                  onClick={() => handleNavClick('budget')}
                  style={{
                    border:
                      activeNav === 'budget' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'budget' ? '#000000' : 'transparent',
                    color: activeNav === 'budget' ? '#ffffff' : '#0f172a',
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    activeNav === 'budget'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                  }`}
                  title="Budget Breakdown"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign
                      className={`w-4 h-4 shrink-0 ${
                        activeNav === 'budget' ? 'text-amber-300' : 'text-emerald-600'
                      }`}
                    />
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Budget Cost
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-extrabold text-emerald-800 shrink-0 ${
                      isMobileExpanded ? 'block' : 'hidden sm:block'
                    }`}
                  >
                    {plan.tripSummary.budgetFormatted}
                  </span>
                </button>

                {/* 7. Travel Tips Option */}
                <button
                  type="button"
                  id="sidebar-nav-tips"
                  onClick={() => handleNavClick('tips')}
                  style={{
                    border: activeNav === 'tips' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'tips' ? '#000000' : 'transparent',
                    color: activeNav === 'tips' ? '#ffffff' : '#0f172a',
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    activeNav === 'tips'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                  }`}
                  title="Travel Tips & Packing"
                >
                  <div className="flex items-center gap-2.5">
                    <Lightbulb
                      className={`w-4 h-4 shrink-0 ${
                        activeNav === 'tips' ? 'text-amber-300' : 'text-amber-500'
                      }`}
                    />
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Travel Tips
                    </span>
                  </div>
                </button>

                {/* 8. Modify Trip Option */}
                <button
                  type="button"
                  id="sidebar-nav-modify"
                  onClick={() => handleNavClick('modify')}
                  style={{
                    border:
                      activeNav === 'modify' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'modify' ? '#000000' : 'transparent',
                    color: activeNav === 'modify' ? '#ffffff' : '#0f172a',
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    activeNav === 'modify'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 hover:border-black/20 text-slate-800'
                  }`}
                  title="Modify & Regenerate with AI"
                >
                  <div className="flex items-center gap-2.5">
                    <Edit3
                      className={`w-4 h-4 shrink-0 ${
                        activeNav === 'modify' ? 'text-amber-300' : 'text-violet-600'
                      }`}
                    />
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Modify Trip
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono text-slate-500 ${
                      isMobileExpanded ? 'block' : 'hidden sm:block'
                    }`}
                  >
                    AI Tweak
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Prompt to fill form and click generate */
            <div
              style={{
                border: '1.5px dashed #00000040',
                background: 'rgba(248, 250, 252, 0.7)',
              }}
              className={`p-2.5 rounded-2xl text-center space-y-1 mt-2 ${
                isMobileExpanded ? 'block' : 'hidden sm:block'
              }`}
            >
              <p className="text-xs font-mono font-black text-slate-800">
                ⚡ Plan Options Unlock Here
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Click <strong>Generate Trip</strong> to reveal Day-by-Day &amp; Seat Booking menu.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-2 sm:pt-3 mt-3 sm:mt-4 border-t border-black/10 space-y-2">
          {hasPlan && (
            <button
              type="button"
              id="sidebar-new-trip-btn"
              onClick={() => {
                onStartNewTrip();
                if (isMobileExpanded) setIsMobileExpanded(false);
              }}
              style={{ border: '1.5px solid #000000' }}
              className="w-full p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl text-xs font-extrabold text-black bg-white hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
              title="Start Fresh Trip"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span className={isMobileExpanded ? 'inline' : 'hidden sm:inline'}>
                Start Fresh Trip
              </span>
            </button>
          )}

          <button
            type="button"
            id="sidebar-nav-contact"
            onClick={() => handleNavClick('contact')}
            style={{ border: '1.5px solid transparent' }}
            className="w-full text-left p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center sm:justify-between hover:bg-slate-100 hover:border-black/20 text-slate-600 hover:text-black transition-all cursor-pointer text-xs font-bold"
            title="Contact & WhatsApp Support"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span className={isMobileExpanded ? 'inline' : 'hidden sm:inline'}>
                Contact Support
              </span>
            </div>
            <span
              className={`text-[10px] font-mono ${isMobileExpanded ? 'inline' : 'hidden sm:inline'}`}
            >
              Help →
            </span>
          </button>

          {/* End of the menu: Join Us on WhatsApp, Instagram, Facebook, and X (logos only) */}
          <SocialJoinUs variant="sidebar" isMobileExpanded={isMobileExpanded} />
        </div>
      </aside>
    </>
  );
};

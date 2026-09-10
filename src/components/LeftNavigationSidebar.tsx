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
  Eye,
  Search,
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
  const [menuFilter, setMenuFilter] = useState('');
  const tripOptionsRef = useRef<HTMLDivElement>(null);
  const isDark = false;

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

  const matchesFilter = (text: string) => {
    if (!menuFilter.trim()) return true;
    return text.toLowerCase().includes(menuFilter.toLowerCase().trim());
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
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-black/10 dark:border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-black text-amber-300 flex items-center justify-center font-black shadow-xs shrink-0 dark:bg-indigo-950 dark:border-slate-700"
              >
                <Compass className="w-4 h-4 text-amber-300" />
              </div>
              <div className={`min-w-0 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                <p className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 leading-none">
                  Trip Menu
                </p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                  {hasPlan ? plan?.tripSummary.destination : 'Start Planning'}
                </p>
              </div>
            </div>

            {/* Mobile Expand / Collapse Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              style={{ border: '1.5px solid #000000' }}
              className="p-1 rounded-lg bg-slate-100 hover:bg-black hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition-all sm:hidden cursor-pointer shrink-0"
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

          {/* Quick Menu Search / Filter & Dark Mode Toggle Bar */}
          <div className={`space-y-2 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
            {/* Quick Filter Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                placeholder="Quick jump (e.g. food, day 2)..."
                className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
              />
              {menuFilter && (
                <button
                  type="button"
                  onClick={() => setMenuFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* SECTION 1: FIRST PAGE OPTIONS (Always available) */}
          <div>
            <div
              className={`flex items-center justify-between mb-1.5 px-1 ${
                isMobileExpanded ? 'flex' : 'hidden sm:flex'
              }`}
            >
              <span className="text-[10px] font-mono font-extrabold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                {hasPlan ? 'Base Navigation' : 'Step 1: Get Started'}
              </span>
              <span
                style={{ border: '1px solid #000000' }}
                className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 dark:text-amber-200 text-slate-900 dark:border-amber-800"
              >
                Direct
              </span>
            </div>

            <div className="space-y-1">
              {/* 1. Explore Places Option */}
              {matchesFilter('explore places presets destinations') && (
                <button
                  type="button"
                  id="sidebar-nav-explore"
                  onClick={() => handleNavClick('explore')}
                  style={{
                    border: activeNav === 'explore' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'explore' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                    color: activeNav === 'explore' ? '#ffffff' : undefined,
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[40px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer font-bold text-xs sm:text-sm group ${
                    activeNav === 'explore'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                  title="1. Explore Places & Hotspots"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center shrink-0 border border-indigo-200/70 dark:border-indigo-800">
                      <Compass
                        className={`w-3.5 h-3.5 ${
                          activeNav === 'explore' ? 'text-amber-300' : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      />
                    </div>
                    <div className={`min-w-0 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                      <div className="leading-tight font-black">1. Explore</div>
                      <div
                        className={`text-[10px] font-medium leading-none mt-0.5 truncate ${
                          activeNav === 'explore' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Presets &amp; Destinations
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      activeNav === 'explore'
                        ? 'bg-amber-300 text-black font-black'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800'
                    } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>See</span>
                  </span>
                </button>
              )}

              {/* 2. Trip Preferences Option */}
              {matchesFilter('preferences form dates budget food journey') && (
                <button
                  type="button"
                  id="sidebar-nav-preferences"
                  onClick={() => handleNavClick('preferences')}
                  style={{
                    border:
                      activeNav === 'preferences' ? '2px solid #000000' : '1.5px solid transparent',
                    background: activeNav === 'preferences' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                    color: activeNav === 'preferences' ? '#ffffff' : undefined,
                  }}
                  className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[40px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer font-bold text-xs sm:text-sm group ${
                    activeNav === 'preferences'
                      ? 'shadow-xs font-black'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                  title="2. Trip Preferences Form"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/80 flex items-center justify-center shrink-0 border border-sky-200/70 dark:border-sky-800">
                      <SlidersHorizontal
                        className={`w-3.5 h-3.5 ${
                          activeNav === 'preferences' ? 'text-amber-300' : 'text-sky-600 dark:text-sky-400'
                        }`}
                      />
                    </div>
                    <div className={`min-w-0 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                      <div className="leading-tight font-black">2. Trip Preferences</div>
                      <div
                        className={`text-[10px] font-medium leading-none mt-0.5 truncate ${
                          activeNav === 'preferences' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Dates, budget, food
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      activeNav === 'preferences'
                        ? 'bg-amber-300 text-black font-black'
                        : 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800'
                    } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>See Form</span>
                  </span>
                </button>
              )}

              {/* Places Catalog Link */}
              {matchesFilter('catalog places browse destinations explore') && (
                <button
                  type="button"
                  id="sidebar-nav-destinations-modal"
                  onClick={() => {
                    onOpenDestinationsModal();
                    if (isMobileExpanded) setIsMobileExpanded(false);
                  }}
                  style={{ border: '1.5px solid transparent' }}
                  className="w-full text-left p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center sm:justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-700 dark:text-slate-300 text-xs font-bold"
                  title="Browse Places Catalog"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-950/80 flex items-center justify-center shrink-0 border border-violet-200/70 dark:border-violet-800">
                      <Grid className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Places Catalog
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 ${
                      isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Browse</span>
                  </span>
                </button>
              )}

              {/* Saved Trips Link */}
              {matchesFilter('saved trips bookmarks itineraries') && (
                <button
                  type="button"
                  id="sidebar-nav-saved-trips"
                  onClick={() => {
                    onOpenSavedTrips();
                    if (isMobileExpanded) setIsMobileExpanded(false);
                  }}
                  style={{ border: '1.5px solid transparent' }}
                  className="w-full text-left p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center sm:justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-700 dark:text-slate-300 text-xs font-bold"
                  title="Saved Trips"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center shrink-0 border border-amber-200/70 dark:border-amber-800">
                      <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
                      Saved Trips
                    </span>
                  </div>
                  <span
                    style={{ border: '1px solid #000000' }}
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-md bg-black text-white dark:bg-amber-400 dark:text-black ${
                      isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{savedTripsCount}</span>
                  </span>
                </button>
              )}
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
                {matchesFilter('overview summary duration destination') && (
                  <button
                    type="button"
                    id="sidebar-nav-overview"
                    onClick={() => handleNavClick('overview')}
                    style={{
                      border:
                        activeNav === 'overview' ? '2px solid #000000' : '1.5px solid transparent',
                      background: activeNav === 'overview' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                      color: activeNav === 'overview' ? '#ffffff' : undefined,
                    }}
                    className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                      activeNav === 'overview'
                        ? 'shadow-xs font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Trip Overview"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center shrink-0 border border-emerald-200/70 dark:border-emerald-800">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            activeNav === 'overview' ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`truncate font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}
                      >
                        Trip Overview
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        activeNav === 'overview'
                          ? 'bg-amber-300 text-black font-black'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800'
                      } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>See {plan.tripSummary.duration}D</span>
                    </span>
                  </button>
                )}

                {/* 2. Day by Day Option */}
                {matchesFilter('day itinerary schedule activity timing') && (
                  <div
                    style={{
                      border:
                        activeNav === 'itinerary' ? '2px solid #000000' : '1.5px solid #00000020',
                      background: activeNav === 'itinerary' ? (isDark ? '#1e293b' : '#f8fafc') : 'transparent',
                    }}
                    className="rounded-xl overflow-hidden transition-all dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between pr-1">
                      <button
                        type="button"
                        id="sidebar-nav-itinerary"
                        onClick={() => handleNavClick('itinerary')}
                        style={{
                          background: activeNav === 'itinerary' ? (isDark ? '#0f172a' : '#000000') : 'transparent',
                          color: activeNav === 'itinerary' ? '#ffffff' : undefined,
                        }}
                        className={`flex-1 text-left p-2 sm:px-3 sm:py-2 min-h-[38px] flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                          activeNav === 'itinerary' ? 'font-black' : 'text-slate-800 dark:text-slate-200'
                        }`}
                        title="Day by Day Schedule"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/80 flex items-center justify-center shrink-0 border border-sky-200/70 dark:border-sky-800">
                            <Calendar
                              className={`w-3.5 h-3.5 ${
                                activeNav === 'itinerary' ? 'text-amber-300' : 'text-sky-600 dark:text-sky-400'
                              }`}
                            />
                          </div>
                          <span className={`font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                            Day by Day
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            activeNav === 'itinerary'
                              ? 'bg-amber-300 text-black font-black'
                              : 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800'
                          } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>See Days</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsDaysSubmenuOpen(!isDaysSubmenuOpen)}
                        className={`p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-300 ${
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
                        className={`px-2 pb-2 pt-1 border-t border-black/10 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 space-y-1 ${
                          isMobileExpanded ? 'block' : 'hidden sm:block'
                        }`}
                      >
                        <div className="flex items-center justify-between px-1 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                          <span>SEE INDIVIDUAL DAY:</span>
                          <button
                            type="button"
                            onClick={() => handleNavClick('itinerary', undefined)}
                            className={`hover:underline cursor-pointer flex items-center gap-0.5 ${
                              selectedDay === 'all' && activeNav === 'itinerary'
                                ? 'font-black text-black dark:text-amber-300'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Eye className="w-2.5 h-2.5" />
                            <span>See All ({plan.itinerary.length})</span>
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
                                  background: isThisDayActive ? '#000000' : (isDark ? '#1e293b' : '#ffffff'),
                                  color: isThisDayActive ? '#ffffff' : undefined,
                                }}
                                className="px-2 py-1.5 rounded-lg text-left text-xs font-extrabold flex items-center justify-between cursor-pointer hover:border-black transition-all shadow-2xs group dark:border-slate-700"
                                title={`Day ${dayItem.day}: ${dayItem.title}`}
                              >
                                <span className="font-mono">Day {dayItem.day}</span>
                                <span
                                  className={`text-[9px] font-mono px-1 py-0.2 rounded flex items-center gap-0.5 ${
                                    isThisDayActive
                                      ? 'bg-amber-300 text-black font-black'
                                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                  }`}
                                >
                                  <Eye className="w-2 h-2" />
                                  <span>D{dayItem.day}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Food & Dining Option (Placed after Day by Day as requested) */}
                {matchesFilter('food dining restaurant cafe eat meal drink cuisine') && (
                  <button
                    type="button"
                    id="sidebar-nav-food"
                    onClick={() => handleNavClick('food')}
                    style={{
                      border: activeNav === 'food' ? '2px solid #000000' : '1.5px solid transparent',
                      background: activeNav === 'food' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                      color: activeNav === 'food' ? '#ffffff' : undefined,
                    }}
                    className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                      activeNav === 'food'
                        ? 'shadow-xs font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Food Recommendations"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center shrink-0 border border-amber-200/70 dark:border-amber-800">
                        <Utensils
                          className={`w-3.5 h-3.5 ${
                            activeNav === 'food' ? 'text-amber-300' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        />
                      </div>
                      <span className={`font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                        Food &amp; Dining
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        activeNav === 'food'
                          ? 'bg-amber-300 text-black font-black'
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800'
                      } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>See {plan.foodRecommendations.length} Food</span>
                    </span>
                  </button>
                )}

                {/* 4. Places to Visit Option (After Day by Day as requested) */}
                {matchesFilter('places visit attractions sights monuments spots travel') && (
                  <button
                    type="button"
                    id="sidebar-nav-places"
                    onClick={() => handleNavClick('places')}
                    style={{
                      border: activeNav === 'places' ? '2px solid #000000' : '1.5px solid transparent',
                      background: activeNav === 'places' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                      color: activeNav === 'places' ? '#ffffff' : undefined,
                    }}
                    className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                      activeNav === 'places'
                        ? 'shadow-xs font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Places to Visit"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center shrink-0 border border-teal-200/70 dark:border-teal-800">
                        <MapPin
                          className={`w-3.5 h-3.5 ${
                            activeNav === 'places' ? 'text-amber-300' : 'text-teal-600 dark:text-teal-400'
                          }`}
                        />
                      </div>
                      <span className={`font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                        Places to Visit
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        activeNav === 'places'
                          ? 'bg-amber-300 text-black font-black'
                          : 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800'
                      } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>See {plan.recommendedPlaces.length} Places</span>
                    </span>
                  </button>
                )}

                {/* 5. Book Seat Now Option (Prominent High-Contrast Button, after Places to Visit as requested) */}
                {matchesFilter('book seat advance reservation pay booking ₹250') && (
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
                        className={`inline-flex items-center gap-1 text-[11px] font-mono font-black px-1.5 sm:px-2 py-0.5 rounded bg-amber-400 text-black shrink-0 ${
                          isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>₹250</span>
                      </span>
                    </button>
                  </div>
                )}

                {/* 6. Budget Breakdown Option */}
                {matchesFilter('budget cost price estimate expense rupee') && (
                  <button
                    type="button"
                    id="sidebar-nav-budget"
                    onClick={() => handleNavClick('budget')}
                    style={{
                      border:
                        activeNav === 'budget' ? '2px solid #000000' : '1.5px solid transparent',
                      background: activeNav === 'budget' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                      color: activeNav === 'budget' ? '#ffffff' : undefined,
                    }}
                    className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                      activeNav === 'budget'
                        ? 'shadow-xs font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Budget Breakdown"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center shrink-0 border border-emerald-200/70 dark:border-emerald-800">
                        <DollarSign
                          className={`w-3.5 h-3.5 ${
                            activeNav === 'budget' ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        />
                      </div>
                      <span className={`font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                        Budget Cost
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md ${
                        activeNav === 'budget'
                          ? 'bg-amber-300 text-black font-black'
                          : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800'
                      } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{plan.tripSummary.budgetFormatted}</span>
                    </span>
                  </button>
                )}

                {/* 7. Travel Tips Option */}
                {matchesFilter('tips packing advisory guide emergency advice') && (
                  <button
                    type="button"
                    id="sidebar-nav-tips"
                    onClick={() => handleNavClick('tips')}
                    style={{
                      border: activeNav === 'tips' ? '2px solid #000000' : '1.5px solid transparent',
                      background: activeNav === 'tips' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                      color: activeNav === 'tips' ? '#ffffff' : undefined,
                    }}
                    className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                      activeNav === 'tips'
                        ? 'shadow-xs font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Travel Tips & Packing"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center shrink-0 border border-amber-200/70 dark:border-amber-800">
                        <Lightbulb
                          className={`w-3.5 h-3.5 ${
                            activeNav === 'tips' ? 'text-amber-300' : 'text-amber-500 dark:text-amber-400'
                          }`}
                        />
                      </div>
                      <span className={`font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                        Travel Tips
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        activeNav === 'tips'
                          ? 'bg-amber-300 text-black font-black'
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800'
                      } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>See Tips</span>
                    </span>
                  </button>
                )}

                {/* 8. Modify Trip Option */}
                {matchesFilter('modify regenerate ai tweak change edit') && (
                  <button
                    type="button"
                    id="sidebar-nav-modify"
                    onClick={() => handleNavClick('modify')}
                    style={{
                      border:
                        activeNav === 'modify' ? '2px solid #000000' : '1.5px solid transparent',
                      background: activeNav === 'modify' ? (isDark ? '#1e293b' : '#000000') : 'transparent',
                      color: activeNav === 'modify' ? '#ffffff' : undefined,
                    }}
                    className={`w-full text-left p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl flex items-center justify-center sm:justify-between transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                      activeNav === 'modify'
                        ? 'shadow-xs font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Modify & Regenerate with AI"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center shrink-0 border border-purple-200/70 dark:border-purple-800">
                        <Edit3
                          className={`w-3.5 h-3.5 ${
                            activeNav === 'modify' ? 'text-amber-300' : 'text-purple-600 dark:text-purple-400'
                          }`}
                        />
                      </div>
                      <span className={`font-black ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
                        Modify Trip
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        activeNav === 'modify'
                          ? 'bg-amber-300 text-black font-black'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800'
                      } ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
                    >
                      <span>AI Tweak</span>
                    </span>
                  </button>
                )}
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
        <div className="pt-2 sm:pt-3 mt-3 sm:mt-4 border-t border-black/10 dark:border-slate-800 space-y-2">
          {hasPlan && (
            <button
              type="button"
              id="sidebar-new-trip-btn"
              onClick={() => {
                onStartNewTrip();
                if (isMobileExpanded) setIsMobileExpanded(false);
              }}
              style={{ border: '1.5px solid #000000' }}
              className="w-full p-2 sm:px-3 sm:py-2 min-h-[38px] rounded-xl text-xs font-extrabold text-black bg-white hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs dark:border-slate-700"
              title="Start Fresh Trip"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
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
            className="w-full text-left p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center sm:justify-between hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-black/20 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-all cursor-pointer text-xs font-bold"
            title="Contact & WhatsApp Support"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <span className={isMobileExpanded ? 'inline' : 'hidden sm:inline'}>
                Contact Support
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono ${isMobileExpanded ? 'inline-flex' : 'hidden sm:inline-flex'}`}
            >
              <Eye className="w-2.5 h-2.5" />
              <span>Help →</span>
            </span>
          </button>

          {/* End of the menu: Join Us on WhatsApp, Instagram, Facebook, and X (logos only) */}
          <SocialJoinUs variant="sidebar" isMobileExpanded={isMobileExpanded} />
        </div>
      </aside>
    </>
  );
};

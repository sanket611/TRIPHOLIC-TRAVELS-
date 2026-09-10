import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Utensils,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { TripPlan } from '../types';

interface CompactPreferencesBarProps {
  plan: TripPlan;
  isFormExpanded: boolean;
  onToggleForm: () => void;
  onStartNewTrip: () => void;
}

export const CompactPreferencesBar: React.FC<CompactPreferencesBarProps> = ({
  plan,
  isFormExpanded,
  onToggleForm,
  onStartNewTrip,
}) => {
  const { tripSummary } = plan;

  return (
    <div
      id="compact-trip-preferences-bar"
      className="rounded-2xl p-3.5 sm:p-4 mb-5 transition-all backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden"
    >
      {/* Executive Statement Top Line */}
      <div className="h-[2px] bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 -mx-3.5 -mt-3.5 sm:-mx-4 sm:-mt-4 mb-3" />

      {/* Statement Meta Header Line */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-slate-200 tracking-wider">
            STATEMENT SPECIFICATION // ACTIVE
          </span>
          <span className="hidden sm:inline">OFFICIAL ITINERARY BRIEF</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PROPOSAL COMPILED</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Quick Parameter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{tripSummary.destination}</span>
          </span>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{tripSummary.duration} Days</span>
          </span>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{tripSummary.budgetFormatted}</span>
          </span>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{tripSummary.travelers} {tripSummary.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
          </span>

          <span
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/70 text-indigo-950 dark:text-indigo-200 text-xs font-medium truncate max-w-xs"
            title={tripSummary.travelStyle}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">{tripSummary.travelStyle}</span>
          </span>

          <span
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/70 text-amber-950 dark:text-amber-200 text-xs font-medium max-w-sm truncate"
            title={`Dietary Preferences: ${tripSummary.foodPreference}`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">{tripSummary.foodPreference}</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            id="toggle-edit-preferences-btn"
            onClick={onToggleForm}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
              isFormExpanded
                ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-500 hover:bg-slate-800'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            {isFormExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Specification Form</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Modify Parameters</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="bar-new-trip-btn"
            onClick={onStartNewTrip}
            className="px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Start a new trip planner"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>New Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};

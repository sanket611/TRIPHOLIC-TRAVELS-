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
      style={{
        border: '2px solid #000000',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-2xl p-3 sm:p-4 mb-5 transition-all backdrop-blur-md"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Quick Parameter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-black">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white font-extrabold text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{tripSummary.destination}</span>
          </span>

          <span
            style={{ border: '1.5px solid #000000' }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-black text-xs font-mono font-bold"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-700" />
            <span>{tripSummary.duration} Days</span>
          </span>

          <span
            style={{ border: '1.5px solid #000000' }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-black text-xs font-mono font-bold"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span>{tripSummary.budgetFormatted}</span>
          </span>

          <span
            style={{ border: '1.5px solid #000000' }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-black text-xs font-mono font-bold"
          >
            <Users className="w-3.5 h-3.5 text-indigo-700" />
            <span>{tripSummary.travelers} {tripSummary.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
          </span>

          <span
            style={{ border: '1.5px solid #000000' }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-50 text-violet-950 text-xs font-bold truncate max-w-xs"
            title={tripSummary.travelStyle}
          >
            <Compass className="w-3.5 h-3.5 text-violet-700 shrink-0" />
            <span className="truncate">{tripSummary.travelStyle}</span>
          </span>

          <span
            style={{ border: '1.5px solid #000000' }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-950 text-xs font-bold"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-700" />
            <span>{tripSummary.foodPreference}</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            id="toggle-edit-preferences-btn"
            onClick={onToggleForm}
            style={{
              border: '1.5px solid #000000',
            }}
            className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isFormExpanded
                ? 'bg-black text-white hover:bg-slate-800'
                : 'bg-white hover:bg-slate-100 text-black'
            }`}
          >
            {isFormExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Form</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Edit Trip Options</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="bar-new-trip-btn"
            onClick={onStartNewTrip}
            style={{
              border: '1.5px solid #000000',
            }}
            className="px-3 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Start a new trip planner"
          >
            <RotateCcw className="w-4 h-4 text-slate-700" />
            <span>New Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};

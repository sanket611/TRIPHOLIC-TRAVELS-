import React, { useState } from 'react';
import {
  Calendar,
  Sun,
  Sunset,
  Moon,
  MapPin,
  Clock,
  Navigation,
  DollarSign,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Compass,
} from 'lucide-react';
import { DayItinerary } from '../types';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [expandedDays, setExpandedDays] = useState<{ [day: number]: boolean }>(() => {
    // Default expand all days
    const map: { [day: number]: boolean } = {};
    itinerary.forEach((d) => {
      map[d.day] = true;
    });
    return map;
  });

  const toggleDayExpand = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const displayedDays =
    activeDayFilter === 'all'
      ? itinerary
      : itinerary.filter((d) => d.day === activeDayFilter);

  return (
    <section
      id="itinerary-section"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Section Title */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
        }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-600/15 text-blue-700 border border-blue-500/30">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              Day-by-Day Itinerary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Geographically clustered schedules with morning, afternoon, and evening slots.
          </p>
        </div>

        {/* Day Filter Pills - Touch-friendly horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none font-mono">
          <button
            onClick={() => setActiveDayFilter('all')}
            style={{
              background: activeDayFilter === 'all' ? '#2563eb' : 'rgba(255, 255, 255, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
            }}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center shadow-xs backdrop-blur-md ${
              activeDayFilter === 'all'
                ? 'text-white'
                : 'text-slate-900 hover:bg-white/60 active:bg-blue-100'
            }`}
          >
            All Days ({itinerary.length})
          </button>
          {itinerary.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDayFilter(d.day)}
              style={{
                background: activeDayFilter === d.day ? '#2563eb' : 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
              }}
              className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center shadow-xs backdrop-blur-md ${
                activeDayFilter === d.day
                  ? 'text-white'
                  : 'text-slate-900 hover:bg-white/60 active:bg-blue-100'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4 sm:space-y-5 mt-5 sm:mt-6">
        {displayedDays.map((dayPlan) => {
          const isExpanded = expandedDays[dayPlan.day] ?? true;

          return (
            <div
              key={dayPlan.day}
              style={{
                background: 'rgba(255, 255, 255, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.40)',
              }}
              className="rounded-2xl backdrop-blur-md overflow-hidden shadow-xs transition-all"
            >
              {/* Day Header Bar */}
              <div
                onClick={() => toggleDayExpand(dayPlan.day)}
                style={{
                  background: 'rgba(255, 255, 255, 0.35)',
                  borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.35)' : 'none',
                }}
                className="p-3.5 sm:p-5 min-h-[52px] flex items-center justify-between cursor-pointer select-none hover:bg-white/50 active:bg-white/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 pr-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    D{dayPlan.day}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {dayPlan.title || `Day ${dayPlan.day}`}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.45)',
                          border: '1px solid rgba(255, 255, 255, 0.55)',
                        }}
                        className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-900 px-2 py-0.5 rounded-lg shadow-2xs"
                      >
                        {dayPlan.theme}
                      </span>
                      {dayPlan.stayArea && (
                        <span
                          style={{
                            background: 'rgba(255, 255, 255, 0.45)',
                            border: '1px solid rgba(255, 255, 255, 0.55)',
                          }}
                          className="text-[10px] sm:text-[11px] font-semibold text-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <BedDouble className="w-3 h-3 text-slate-700 shrink-0" />
                          <span className="truncate">Stay: {dayPlan.stayArea}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 shrink-0">
                  <span className="text-xs font-mono font-bold hidden sm:inline text-slate-700">
                    {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-700" /> : <ChevronDown className="w-5 h-5 text-slate-700" />}
                </div>
              </div>

              {/* Day Body with 3 Time Slots */}
              {isExpanded && (
                <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-4">
                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                    {/* Morning Slot */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.45)',
                      }}
                      className="rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between backdrop-blur-md shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-lg border border-amber-300">
                            <Sun className="w-3 h-3 text-amber-700" />
                            <span>MORNING</span>
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dayPlan.morning.time}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                          {dayPlan.morning.activity}
                        </h4>

                        <div className="flex items-center gap-1 text-xs font-bold text-blue-700 mb-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{dayPlan.morning.place}</span>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-normal">
                          {dayPlan.morning.description}
                        </p>
                      </div>

                      {dayPlan.morning.estCost && (
                        <div
                          style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.40)',
                          }}
                          className="mt-3 pt-2.5 flex items-center justify-between text-[11px] font-mono font-semibold"
                        >
                          <span className="text-slate-700">Est. Cost:</span>
                          <span className="font-bold text-slate-900">{dayPlan.morning.estCost}</span>
                        </div>
                      )}
                    </div>

                    {/* Afternoon Slot */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.45)',
                      }}
                      className="rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between backdrop-blur-md shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-900 bg-sky-200/80 px-2 py-0.5 rounded-lg border border-sky-300">
                            <Sunset className="w-3 h-3 text-sky-700" />
                            <span>AFTERNOON</span>
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dayPlan.afternoon.time}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                          {dayPlan.afternoon.activity}
                        </h4>

                        <div className="flex items-center gap-1 text-xs font-bold text-blue-700 mb-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{dayPlan.afternoon.place}</span>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-normal">
                          {dayPlan.afternoon.description}
                        </p>
                      </div>

                      {dayPlan.afternoon.estCost && (
                        <div
                          style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.40)',
                          }}
                          className="mt-3 pt-2.5 flex items-center justify-between text-[11px] font-mono font-semibold"
                        >
                          <span className="text-slate-700">Est. Cost:</span>
                          <span className="font-bold text-slate-900">{dayPlan.afternoon.estCost}</span>
                        </div>
                      )}
                    </div>

                    {/* Evening Slot */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.45)',
                      }}
                      className="rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between backdrop-blur-md shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-900 bg-indigo-200/80 px-2 py-0.5 rounded-lg border border-indigo-300">
                            <Moon className="w-3 h-3 text-indigo-700" />
                            <span>EVENING</span>
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dayPlan.evening.time}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                          {dayPlan.evening.activity}
                        </h4>

                        <div className="flex items-center gap-1 text-xs font-bold text-blue-700 mb-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{dayPlan.evening.place}</span>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-normal">
                          {dayPlan.evening.description}
                        </p>
                      </div>

                      {dayPlan.evening.estCost && (
                        <div
                          style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.40)',
                          }}
                          className="mt-3 pt-2.5 flex items-center justify-between text-[11px] font-mono font-semibold"
                        >
                          <span className="text-slate-700">Est. Cost:</span>
                          <span className="font-bold text-slate-900">{dayPlan.evening.estCost}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Travel & Transit Notes Banner */}
                  {dayPlan.travelNotes && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.45)',
                      }}
                      className="p-3 sm:p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-slate-800 backdrop-blur-md shadow-2xs"
                    >
                      <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-slate-900">Transit & Logistics Note: </span>
                        <span>{dayPlan.travelNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

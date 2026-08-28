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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Section Title */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-violet-700 to-indigo-700 text-white shadow-md border border-black">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Day-by-Day Itinerary
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-950 font-bold">
            Geographically clustered schedules with morning, afternoon, and evening slots.
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none font-mono">
          <button
            onClick={() => setActiveDayFilter('all')}
            style={{
              background: activeDayFilter === 'all' ? '#000000' : 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className={`px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center shadow-sm backdrop-blur-md ${
              activeDayFilter === 'all'
                ? 'bg-black text-white shadow-md'
                : 'text-black hover:bg-black hover:text-white active:bg-slate-900'
            }`}
          >
            All Days ({itinerary.length})
          </button>
          {itinerary.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDayFilter(d.day)}
              style={{
                background: activeDayFilter === d.day ? '#000000' : 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className={`px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center shadow-sm backdrop-blur-md ${
                activeDayFilter === d.day
                  ? 'bg-black text-white shadow-md'
                  : 'text-black hover:bg-black hover:text-white active:bg-slate-900'
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
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1.5px solid #000000',
              }}
              className="rounded-2xl backdrop-blur-md overflow-hidden shadow-sm transition-all"
            >
              {/* Day Header Bar */}
              <div
                onClick={() => toggleDayExpand(dayPlan.day)}
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  borderBottom: isExpanded ? '1.5px solid #000000' : 'none',
                }}
                className="p-3.5 sm:p-5 min-h-[52px] flex items-center justify-between cursor-pointer select-none hover:bg-white active:bg-violet-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 pr-2">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-700 to-indigo-700 text-white font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs border border-black">
                    D{dayPlan.day}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-lg font-extrabold text-black truncate">
                        {dayPlan.title || `Day ${dayPlan.day}`}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1.5px solid #000000',
                        }}
                        className="text-xs font-mono font-extrabold text-black px-2.5 py-0.5 rounded-lg shadow-xs"
                      >
                        {dayPlan.theme}
                      </span>
                      {dayPlan.stayArea && (
                        <span
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1.5px solid #000000',
                          }}
                          className="text-xs font-extrabold text-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-violet-700 shrink-0" />
                          <span className="truncate">Stay: {dayPlan.stayArea}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-black shrink-0">
                  <span className="text-xs font-mono font-extrabold hidden sm:inline text-black">
                    {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-black font-extrabold" /> : <ChevronDown className="w-5 h-5 text-black font-extrabold" />}
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
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: '1.5px solid #000000',
                      }}
                      className="rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            style={{
                              border: '1.5px solid #000000',
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-black bg-amber-300 px-2.5 py-1 rounded-lg"
                          >
                            <Sun className="w-3.5 h-3.5 text-amber-900" />
                            <span>MORNING</span>
                          </span>
                          <span className="text-xs font-mono font-extrabold text-black flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {dayPlan.morning.time}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-black mb-1.5">
                          {dayPlan.morning.activity}
                        </h4>

                        <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-violet-800 mb-2">
                          <MapPin className="w-4 h-4 shrink-0 text-violet-700" />
                          <span className="truncate">{dayPlan.morning.place}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-950 leading-relaxed font-semibold">
                          {dayPlan.morning.description}
                        </p>
                      </div>

                      {dayPlan.morning.estCost && (
                        <div
                          style={{
                            borderTop: '1.5px solid #000000',
                          }}
                          className="mt-3.5 pt-2.5 flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold"
                        >
                          <span className="text-black">Est. Cost:</span>
                          <span className="font-extrabold text-black">{dayPlan.morning.estCost}</span>
                        </div>
                      )}
                    </div>

                    {/* Afternoon Slot */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: '1.5px solid #000000',
                      }}
                      className="rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            style={{
                              border: '1.5px solid #000000',
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-black bg-sky-300 px-2.5 py-1 rounded-lg"
                          >
                            <Sunset className="w-3.5 h-3.5 text-sky-900" />
                            <span>AFTERNOON</span>
                          </span>
                          <span className="text-xs font-mono font-extrabold text-black flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {dayPlan.afternoon.time}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-black mb-1.5">
                          {dayPlan.afternoon.activity}
                        </h4>

                        <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-violet-800 mb-2">
                          <MapPin className="w-4 h-4 shrink-0 text-violet-700" />
                          <span className="truncate">{dayPlan.afternoon.place}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-950 leading-relaxed font-semibold">
                          {dayPlan.afternoon.description}
                        </p>
                      </div>

                      {dayPlan.afternoon.estCost && (
                        <div
                          style={{
                            borderTop: '1.5px solid #000000',
                          }}
                          className="mt-3.5 pt-2.5 flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold"
                        >
                          <span className="text-black">Est. Cost:</span>
                          <span className="font-extrabold text-black">{dayPlan.afternoon.estCost}</span>
                        </div>
                      )}
                    </div>

                    {/* Evening Slot */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: '1.5px solid #000000',
                      }}
                      className="rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            style={{
                              border: '1.5px solid #000000',
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-white bg-indigo-900 px-2.5 py-1 rounded-lg"
                          >
                            <Moon className="w-3.5 h-3.5 text-indigo-200" />
                            <span>EVENING</span>
                          </span>
                          <span className="text-xs font-mono font-extrabold text-black flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {dayPlan.evening.time}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-black mb-1.5">
                          {dayPlan.evening.activity}
                        </h4>

                        <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-violet-800 mb-2">
                          <MapPin className="w-4 h-4 shrink-0 text-violet-700" />
                          <span className="truncate">{dayPlan.evening.place}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-950 leading-relaxed font-semibold">
                          {dayPlan.evening.description}
                        </p>
                      </div>

                      {dayPlan.evening.estCost && (
                        <div
                          style={{
                            borderTop: '1.5px solid #000000',
                          }}
                          className="mt-3.5 pt-2.5 flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold"
                        >
                          <span className="text-black">Est. Cost:</span>
                          <span className="font-extrabold text-black">{dayPlan.evening.estCost}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Travel & Transit Notes Banner */}
                  {dayPlan.travelNotes && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        border: '1.5px solid #000000',
                      }}
                      className="p-3.5 sm:p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-slate-950 backdrop-blur-md shadow-sm"
                    >
                      <Navigation className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-extrabold uppercase tracking-wider text-xs sm:text-sm text-black">Transit & Logistics Note: </span>
                        <span className="font-bold">{dayPlan.travelNotes}</span>
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

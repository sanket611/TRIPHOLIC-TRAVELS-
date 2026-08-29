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
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Eye,
  X,
} from 'lucide-react';
import { DayItinerary } from '../types';
import { getDayScenicPhoto } from '../data/destinationImages';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  destination?: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, destination = '' }) => {
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<{
    url: string;
    title: string;
    caption: string;
    day: number;
    theme: string;
  } | null>(null);
  const [expandedDays, setExpandedDays] = useState<{ [day: number]: boolean }>(() => {
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

  const handleExpandAll = () => {
    const map: { [day: number]: boolean } = {};
    itinerary.forEach((d) => {
      map[d.day] = true;
    });
    setExpandedDays(map);
  };

  const handleCollapseAll = () => {
    setExpandedDays({});
  };

  const handleCopyDay = async (dayPlan: DayItinerary, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const text = `📅 DAY ${dayPlan.day}: ${dayPlan.title} (${dayPlan.theme})
• Morning (${dayPlan.morning.time}): ${dayPlan.morning.activity} at ${dayPlan.morning.place} (Est: ${dayPlan.morning.estCost || 'Free'})
  Notes: ${dayPlan.morning.description}
• Afternoon (${dayPlan.afternoon.time}): ${dayPlan.afternoon.activity} at ${dayPlan.afternoon.place} (Est: ${dayPlan.afternoon.estCost || 'Free'})
  Notes: ${dayPlan.afternoon.description}
• Evening (${dayPlan.evening.time}): ${dayPlan.evening.activity} at ${dayPlan.evening.place} (Est: ${dayPlan.evening.estCost || 'Free'})
  Notes: ${dayPlan.evening.description}
• Stay Area: ${dayPlan.stayArea || 'Central'}
• Transit: ${dayPlan.travelNotes}`;

      await navigator.clipboard.writeText(text);
      setCopiedDay(dayPlan.day);
      setTimeout(() => setCopiedDay(null), 2000);
    } catch (err) {
      console.error('Failed to copy day schedule', err);
    }
  };

  const openGoogleMaps = (placeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const displayedDays =
    activeDayFilter === 'all'
      ? itinerary
      : itinerary.filter((d) => d.day === activeDayFilter);

  const allExpanded = Object.keys(expandedDays).length === itinerary.length && Object.values(expandedDays).every(Boolean);

  return (
    <section
      id="itinerary-section"
      style={{
        background: 'rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid #000000',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[32px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Section Title & Global Controls */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 sm:pb-6"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-black text-amber-300 shadow-sm border border-black">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Day-by-Day Travel Blueprint
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-950 font-bold">
            Geographically clustered morning, afternoon, and evening slots with direct map navigation.
          </p>
        </div>

        {/* Global Expand & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={allExpanded ? handleCollapseAll : handleExpandAll}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-extrabold text-black hover:bg-black hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title={allExpanded ? 'Collapse all days' : 'Expand all days'}
          >
            {allExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}</span>
          </button>

          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveDayFilter('all')}
              style={{
                background: activeDayFilter === 'all' ? '#000000' : 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className={`px-3.5 py-1.5 min-h-[38px] rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center shadow-sm ${
                activeDayFilter === 'all'
                  ? 'bg-black text-white shadow-md'
                  : 'text-black hover:bg-black hover:text-white'
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
                className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center shadow-sm ${
                  activeDayFilter === d.day
                    ? 'bg-black text-white shadow-md'
                    : 'text-black hover:bg-black hover:text-white'
                }`}
              >
                D{d.day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4 sm:space-y-5 mt-6">
        {displayedDays.map((dayPlan) => {
          const isExpanded = expandedDays[dayPlan.day] ?? true;

          return (
            <div
              key={dayPlan.day}
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1.5px solid #000000',
              }}
              className="rounded-2xl backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Day Header Bar */}
              <div
                onClick={() => toggleDayExpand(dayPlan.day)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderBottom: isExpanded ? '1.5px solid #000000' : 'none',
                }}
                className="p-4 sm:p-5 min-h-[56px] flex items-center justify-between cursor-pointer select-none hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 pr-2 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-black text-amber-300 font-mono font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs border border-black">
                    D{dayPlan.day}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-lg font-extrabold text-black truncate">
                        {dayPlan.title || `Day ${dayPlan.day}`}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #000000',
                        }}
                        className="text-xs font-mono font-extrabold text-black px-2.5 py-0.5 rounded-lg shadow-2xs"
                      >
                        {dayPlan.theme}
                      </span>
                      {dayPlan.stayArea && (
                        <span
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #000000',
                          }}
                          className="text-xs font-extrabold text-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-violet-700 shrink-0" />
                          <span className="truncate">Base: {dayPlan.stayArea}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Scenic Photo View Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const scenicPhoto = getDayScenicPhoto(destination, dayPlan.day, dayPlan.theme);
                      setViewingPhoto({
                        url: scenicPhoto.url,
                        title: scenicPhoto.title,
                        caption: scenicPhoto.caption,
                        day: dayPlan.day,
                        theme: dayPlan.theme,
                      });
                    }}
                    style={{
                      background: '#000000',
                      border: '1.5px solid #000000',
                    }}
                    className="p-2 sm:px-3 text-xs font-mono font-extrabold rounded-xl text-amber-300 hover:bg-violet-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="View destination scenic photo"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black hidden sm:inline">VIEW PICTURE</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyDay(dayPlan, e)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #000000',
                    }}
                    className="p-2 text-xs font-mono font-extrabold rounded-xl text-black hover:bg-black hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Copy Day Schedule to Clipboard"
                  >
                    {copiedDay === dayPlan.day ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-600 hidden sm:inline">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold hidden sm:inline">COPY</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 text-black">
                    {isExpanded ? <ChevronUp className="w-5 h-5 font-extrabold" /> : <ChevronDown className="w-5 h-5 font-extrabold" />}
                  </div>
                </div>
              </div>

              {/* Day Body with Scenic Picture Column & 3 Time Slots */}
              {isExpanded && (() => {
                const scenicPhoto = getDayScenicPhoto(destination, dayPlan.day, dayPlan.theme);
                return (
                  <div className="p-4 sm:p-6 space-y-4">
                    {/* Grid with Picture Column (left) and 3 Time Slots (right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                      {/* Compact Picture Column */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.96)',
                          border: '1.5px solid #000000',
                        }}
                        className="lg:col-span-3 rounded-2xl p-3 flex flex-col justify-between shadow-sm group hover:border-black transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-black text-amber-300 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              <span>DAY {dayPlan.day} PHOTO</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-600">Click to view</span>
                          </div>

                          {/* Clickable Scenic Thumbnail */}
                          <div
                            onClick={() =>
                              setViewingPhoto({
                                url: scenicPhoto.url,
                                title: scenicPhoto.title,
                                caption: scenicPhoto.caption,
                                day: dayPlan.day,
                                theme: dayPlan.theme,
                              })
                            }
                            className="relative h-36 sm:h-44 rounded-xl overflow-hidden cursor-pointer border border-black group/img shadow-2xs"
                          >
                            <img
                              src={scenicPhoto.url}
                              alt={scenicPhoto.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-black truncate drop-shadow-sm">{scenicPhoto.title}</p>
                                <span className="p-1 rounded-md bg-white/30 backdrop-blur-xs text-white">
                                  <Eye className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-800 font-bold leading-tight line-clamp-2">
                            {scenicPhoto.caption}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setViewingPhoto({
                              url: scenicPhoto.url,
                              title: scenicPhoto.title,
                              caption: scenicPhoto.caption,
                              day: dayPlan.day,
                              theme: dayPlan.theme,
                            })
                          }
                          style={{
                            border: '1px solid #000000',
                          }}
                          className="mt-2.5 w-full py-1.5 px-2 bg-black text-amber-300 hover:bg-violet-900 text-xs font-mono font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Full Picture</span>
                        </button>
                      </div>

                      {/* 3 Time Slots */}
                      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {/* Morning Slot */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1.5px solid #000000',
                          }}
                          className="rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span
                                style={{
                                  border: '1px solid #000000',
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

                            <div className="flex items-center justify-between gap-1 text-xs sm:text-sm font-extrabold text-violet-800 mb-2.5 bg-violet-50 p-1.5 rounded-lg border border-violet-200">
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-700" />
                                <span className="truncate">{dayPlan.morning.place}</span>
                              </div>
                              <button
                                onClick={(e) => openGoogleMaps(dayPlan.morning.place, e)}
                                className="text-[10px] font-bold text-violet-700 hover:text-black flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                title="Open in Google Maps"
                              >
                                Maps <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">
                              {dayPlan.morning.description}
                            </p>
                          </div>

                          {dayPlan.morning.estCost && (
                            <div
                              style={{
                                borderTop: '1px solid #e2e8f0',
                              }}
                              className="mt-3.5 pt-2.5 flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold"
                            >
                              <span className="text-slate-600">Est. Cost:</span>
                              <span className="font-extrabold text-black bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                {dayPlan.morning.estCost}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Afternoon Slot */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1.5px solid #000000',
                          }}
                          className="rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span
                                style={{
                                  border: '1px solid #000000',
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

                            <div className="flex items-center justify-between gap-1 text-xs sm:text-sm font-extrabold text-violet-800 mb-2.5 bg-violet-50 p-1.5 rounded-lg border border-violet-200">
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-700" />
                                <span className="truncate">{dayPlan.afternoon.place}</span>
                              </div>
                              <button
                                onClick={(e) => openGoogleMaps(dayPlan.afternoon.place, e)}
                                className="text-[10px] font-bold text-violet-700 hover:text-black flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                title="Open in Google Maps"
                              >
                                Maps <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">
                              {dayPlan.afternoon.description}
                            </p>
                          </div>

                          {dayPlan.afternoon.estCost && (
                            <div
                              style={{
                                borderTop: '1px solid #e2e8f0',
                              }}
                              className="mt-3.5 pt-2.5 flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold"
                            >
                              <span className="text-slate-600">Est. Cost:</span>
                              <span className="font-extrabold text-black bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                {dayPlan.afternoon.estCost}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Evening Slot */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1.5px solid #000000',
                          }}
                          className="rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span
                                style={{
                                  border: '1px solid #000000',
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

                            <div className="flex items-center justify-between gap-1 text-xs sm:text-sm font-extrabold text-violet-800 mb-2.5 bg-violet-50 p-1.5 rounded-lg border border-violet-200">
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-700" />
                                <span className="truncate">{dayPlan.evening.place}</span>
                              </div>
                              <button
                                onClick={(e) => openGoogleMaps(dayPlan.evening.place, e)}
                                className="text-[10px] font-bold text-violet-700 hover:text-black flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                title="Open in Google Maps"
                              >
                                Maps <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">
                              {dayPlan.evening.description}
                            </p>
                          </div>

                          {dayPlan.evening.estCost && (
                            <div
                              style={{
                                borderTop: '1px solid #e2e8f0',
                              }}
                              className="mt-3.5 pt-2.5 flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold"
                            >
                              <span className="text-slate-600">Est. Cost:</span>
                              <span className="font-extrabold text-black bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                {dayPlan.evening.estCost}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Travel & Transit Notes Banner */}
                    {dayPlan.travelNotes && (
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.92)',
                          border: '1.5px solid #000000',
                        }}
                        className="p-3.5 sm:p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-slate-950 backdrop-blur-md shadow-xs"
                      >
                        <Navigation className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-mono font-extrabold uppercase tracking-wider text-xs text-black">Transit &amp; Logistics Note: </span>
                          <span className="font-bold">{dayPlan.travelNotes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* High-Resolution Picture Viewer Modal */}
      {viewingPhoto && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setViewingPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
            }}
            className="w-full max-w-3xl rounded-3xl overflow-hidden relative max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/15 bg-white">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-black text-amber-300 font-mono font-extrabold text-xs">
                  DAY {viewingPhoto.day}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-black leading-tight">
                    {viewingPhoto.title}
                  </h3>
                  <p className="text-xs font-mono font-bold text-slate-600">
                    Theme: {viewingPhoto.theme}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingPhoto(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-black hover:text-white flex items-center justify-center transition-all cursor-pointer border border-black"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden max-h-[55vh]">
              <img
                src={viewingPhoto.url}
                alt={viewingPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[55vh]"
              />
            </div>

            {/* Modal Caption & Details */}
            <div className="p-4 sm:p-6 bg-white space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {viewingPhoto.caption}
                  </p>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Visual photography preview curated for {destination || 'your destination'}.
                  </p>
                </div>
                <button
                  onClick={() => setViewingPhoto(null)}
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="px-4 py-2 bg-black text-white hover:bg-slate-800 text-xs font-mono font-extrabold rounded-xl transition-all cursor-pointer shrink-0"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


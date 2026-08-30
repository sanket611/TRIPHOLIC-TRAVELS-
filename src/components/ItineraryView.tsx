import React, { useState } from 'react';
import {
  Calendar,
  Sun,
  Sunset,
  Moon,
  MapPin,
  Clock,
  Navigation,
  ChevronDown,
  ChevronUp,
  BedDouble,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
} from 'lucide-react';
import { DayItinerary } from '../types';
import {
  getDayPhotoGallery,
  getDaySlotPhoto,
  ScenicPhotoInfo,
} from '../data/destinationImages';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  destination?: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, destination = '' }) => {
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [selectedPhotoSlot, setSelectedPhotoSlot] = useState<{ [day: number]: 'hero' | 'morning' | 'afternoon' | 'evening' }>({});

  // Full-screen / Modal photo viewer state with carousel capabilities
  const [modalPhoto, setModalPhoto] = useState<{
    url: string;
    title: string;
    caption: string;
    day: number;
    theme: string;
    slotName: string;
    galleryIndex: number;
    galleryList: ScenicPhotoInfo[];
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

  const openPhotoModal = (
    photo: ScenicPhotoInfo,
    day: number,
    theme: string,
    slotName: string,
    galleryList: ScenicPhotoInfo[]
  ) => {
    const idx = galleryList.findIndex((p) => p.url === photo.url);
    setModalPhoto({
      url: photo.url,
      title: photo.title,
      caption: photo.caption,
      day,
      theme,
      slotName,
      galleryIndex: idx >= 0 ? idx : 0,
      galleryList,
    });
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalPhoto || !modalPhoto.galleryList.length) return;
    const nextIdx = (modalPhoto.galleryIndex + 1) % modalPhoto.galleryList.length;
    const nextPhoto = modalPhoto.galleryList[nextIdx];
    const slotNames = ['Day Highlight', 'Morning Spot', 'Afternoon Spot', 'Evening Spot'];
    setModalPhoto({
      ...modalPhoto,
      url: nextPhoto.url,
      title: nextPhoto.title,
      caption: nextPhoto.caption,
      galleryIndex: nextIdx,
      slotName: slotNames[nextIdx % slotNames.length] || 'Scenic View',
    });
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalPhoto || !modalPhoto.galleryList.length) return;
    const prevIdx = (modalPhoto.galleryIndex - 1 + modalPhoto.galleryList.length) % modalPhoto.galleryList.length;
    const prevPhoto = modalPhoto.galleryList[prevIdx];
    const slotNames = ['Day Highlight', 'Morning Spot', 'Afternoon Spot', 'Evening Spot'];
    setModalPhoto({
      ...modalPhoto,
      url: prevPhoto.url,
      title: prevPhoto.title,
      caption: prevPhoto.caption,
      galleryIndex: prevIdx,
      slotName: slotNames[prevIdx % slotNames.length] || 'Scenic View',
    });
  };

  return (
    <section
      id="itinerary-section"
      className="rounded-3xl p-4 sm:p-7 mb-8 transition-all bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      {/* Section Title & Global Controls */}
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-100"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs border border-indigo-100">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2">
              <span>Day-by-Day Travel Blueprint</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 hidden sm:inline-flex items-center gap-1">
                <Camera className="w-3 h-3 text-indigo-600" />
                <span>Distinct Photos Per Day</span>
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Curated morning, afternoon, and evening slots with rich photos for every day and direct Google Maps navigation.
          </p>
        </div>

        {/* Global Expand & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={allExpanded ? handleCollapseAll : handleExpandAll}
            className="px-3.5 py-1.5 min-h-[36px] rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title={allExpanded ? 'Collapse all days' : 'Expand all days'}
          >
            {allExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>

          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveDayFilter('all')}
              className={`px-3 py-1 min-h-[30px] rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center ${
                activeDayFilter === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({itinerary.length})
            </button>
            {itinerary.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDayFilter(d.day)}
                className={`px-2.5 py-1 min-h-[30px] rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center ${
                  activeDayFilter === d.day
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
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
          const dayGallery = getDayPhotoGallery(destination, dayPlan.day, dayPlan.theme);
          const currentSlotSelection = selectedPhotoSlot[dayPlan.day] || 'hero';
          const displayedHeroPhoto = dayGallery[currentSlotSelection];

          return (
            <div
              key={dayPlan.day}
              className="rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all"
            >
              {/* Day Header Bar */}
              <div
                onClick={() => toggleDayExpand(dayPlan.day)}
                className={`p-4 sm:p-5 min-h-[56px] flex items-center justify-between cursor-pointer select-none transition-colors ${
                  isExpanded ? 'border-b border-slate-100 bg-slate-50/40 hover:bg-slate-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 pr-2 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100">
                    D{dayPlan.day}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {dayPlan.title || `Day ${dayPlan.day}`}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full"
                      >
                        {dayPlan.theme}
                      </span>
                      {dayPlan.stayArea && (
                        <span
                          className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">Base: {dayPlan.stayArea}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Quick Photo Preview Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPhotoModal(
                        displayedHeroPhoto,
                        dayPlan.day,
                        dayPlan.theme,
                        `Day ${dayPlan.day} Highlights`,
                        dayGallery.all
                      );
                    }}
                    className="p-2 sm:px-3 text-xs font-semibold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="View Day Pictures Gallery"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold hidden sm:inline">Photos ({dayGallery.all.length})</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyDay(dayPlan, e)}
                    className="p-2 text-xs font-semibold rounded-xl text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Copy Day Schedule to Clipboard"
                  >
                    {copiedDay === dayPlan.day ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-600 hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 text-slate-500">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Day Body with Multi-Photo Gallery Column (left) & 3 Time Slot Cards (right) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-4 bg-slate-50/30">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Left Column: Interactive Multi-Photo Showcase */}
                    <div
                      className="lg:col-span-4 rounded-2xl p-3.5 flex flex-col justify-between bg-white border border-slate-200/90 shadow-2xs group hover:border-indigo-300 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1 shadow-2xs">
                            <Camera className="w-3 h-3 text-indigo-600" />
                            <span>Day {dayPlan.day} Gallery</span>
                          </span>
                          <span className="text-[10px] font-medium text-slate-500">
                            {dayGallery.all.length} Distinct Photos
                          </span>
                        </div>

                        {/* Clickable Featured Day Photo with Instant Fullscreen */}
                        <div
                          onClick={() =>
                            openPhotoModal(
                              displayedHeroPhoto,
                              dayPlan.day,
                              dayPlan.theme,
                              `${currentSlotSelection.toUpperCase()} PHOTO`,
                              dayGallery.all
                            )
                          }
                          className="relative h-44 sm:h-52 rounded-xl overflow-hidden cursor-pointer border border-slate-200 group/img shadow-2xs"
                        >
                          <img
                            src={displayedHeroPhoto.url}
                            alt={displayedHeroPhoto.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-2.5 text-white">
                            <div className="flex justify-end">
                              <span className="p-1 rounded-md bg-slate-900/60 backdrop-blur-xs text-white border border-white/20 text-xs">
                                <Maximize2 className="w-3.5 h-3.5" />
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-300 bg-slate-900/70 px-1.5 py-0.5 rounded backdrop-blur-xs">
                                {currentSlotSelection === 'hero' ? 'Highlight' : currentSlotSelection}
                              </span>
                              <p className="text-xs font-bold truncate drop-shadow-sm mt-0.5">
                                {displayedHeroPhoto.title}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Thumbnail Selector Tabs for Day-to-Day Exploration */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            Explore Day {dayPlan.day} Vantage Points:
                          </p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(['hero', 'morning', 'afternoon', 'evening'] as const).map((slotKey) => {
                              const photo = dayGallery[slotKey];
                              const isSelected = currentSlotSelection === slotKey;
                              const slotLabels: Record<string, string> = {
                                hero: 'Spot',
                                morning: 'Morn',
                                afternoon: 'Noon',
                                evening: 'Eve',
                              };
                              return (
                                <button
                                  key={slotKey}
                                  type="button"
                                  onClick={() =>
                                    setSelectedPhotoSlot((prev) => ({
                                      ...prev,
                                      [dayPlan.day]: slotKey,
                                    }))
                                  }
                                  className={`relative h-12 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                                    isSelected ? 'border-2 border-indigo-600 ring-2 ring-indigo-200 shadow-2xs' : 'border border-slate-200 opacity-75 hover:opacity-100'
                                  }`}
                                  title={`View ${slotKey} photo`}
                                >
                                  <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-semibold text-white text-center py-0.5 truncate">
                                    {slotLabels[slotKey]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 font-normal leading-tight line-clamp-2">
                          {displayedHeroPhoto.caption}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openPhotoModal(
                            displayedHeroPhoto,
                            dayPlan.day,
                            dayPlan.theme,
                            `Day ${dayPlan.day} — ${displayedHeroPhoto.title}`,
                            dayGallery.all
                          )
                        }
                        className="mt-3 w-full py-2 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enlarge Day {dayPlan.day} Photos</span>
                      </button>
                    </div>

                    {/* Right Column: 3 Time Slots (Morning, Afternoon, Evening) with Distinct Photos */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Morning Slot */}
                      {(() => {
                        const morningPhoto = getDaySlotPhoto(destination, dayPlan.day, 'morning', dayPlan.morning.place);
                        return (
                          <div
                            className="rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all group overflow-hidden"
                          >
                            <div>
                              {/* Slot Photo Thumbnail Banner */}
                              <div
                                onClick={() =>
                                  openPhotoModal(
                                    morningPhoto,
                                    dayPlan.day,
                                    dayPlan.theme,
                                    `Morning: ${dayPlan.morning.place}`,
                                    dayGallery.all
                                  )
                                }
                                className="relative h-24 sm:h-28 -mx-3.5 -mt-3.5 mb-3 overflow-hidden cursor-pointer border-b border-slate-100 group/morn shadow-2xs"
                              >
                                <img
                                  src={morningPhoto.url}
                                  alt={morningPhoto.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/morn:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2 text-white">
                                  <span className="text-[10px] font-bold truncate max-w-[80%] drop-shadow-xs">
                                    {dayPlan.morning.place}
                                  </span>
                                  <span className="p-0.5 rounded bg-slate-900/60 text-white">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md"
                                >
                                  <Sun className="w-3 h-3 text-amber-600" />
                                  <span>MORNING</span>
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {dayPlan.morning.time}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                                {dayPlan.morning.activity}
                              </h4>

                              <div className="flex items-center justify-between gap-1 text-xs font-semibold text-indigo-700 mb-2 bg-indigo-50/60 p-1.5 rounded-lg border border-indigo-100">
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-indigo-600" />
                                  <span className="truncate">{dayPlan.morning.place}</span>
                                </div>
                                <button
                                  onClick={(e) => openGoogleMaps(dayPlan.morning.place, e)}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                  title="Open in Google Maps"
                                >
                                  Map <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                {dayPlan.morning.description}
                              </p>
                            </div>

                            {dayPlan.morning.estCost && (
                              <div
                                className="mt-3 pt-2 flex items-center justify-between text-xs border-t border-slate-100"
                              >
                                <span className="text-slate-500 text-[11px]">Est. Cost:</span>
                                <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                  {dayPlan.morning.estCost}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Afternoon Slot */}
                      {(() => {
                        const noonPhoto = getDaySlotPhoto(destination, dayPlan.day, 'afternoon', dayPlan.afternoon.place);
                        return (
                          <div
                            className="rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all group overflow-hidden"
                          >
                            <div>
                              {/* Slot Photo Thumbnail Banner */}
                              <div
                                onClick={() =>
                                  openPhotoModal(
                                    noonPhoto,
                                    dayPlan.day,
                                    dayPlan.theme,
                                    `Afternoon: ${dayPlan.afternoon.place}`,
                                    dayGallery.all
                                  )
                                }
                                className="relative h-24 sm:h-28 -mx-3.5 -mt-3.5 mb-3 overflow-hidden cursor-pointer border-b border-slate-100 group/noon shadow-2xs"
                              >
                                <img
                                  src={noonPhoto.url}
                                  alt={noonPhoto.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/noon:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2 text-white">
                                  <span className="text-[10px] font-bold truncate max-w-[80%] drop-shadow-xs">
                                    {dayPlan.afternoon.place}
                                  </span>
                                  <span className="p-0.5 rounded bg-slate-900/60 text-white">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md"
                                >
                                  <Sunset className="w-3 h-3 text-sky-600" />
                                  <span>AFTERNOON</span>
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {dayPlan.afternoon.time}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                                {dayPlan.afternoon.activity}
                              </h4>

                              <div className="flex items-center justify-between gap-1 text-xs font-semibold text-indigo-700 mb-2 bg-indigo-50/60 p-1.5 rounded-lg border border-indigo-100">
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-indigo-600" />
                                  <span className="truncate">{dayPlan.afternoon.place}</span>
                                </div>
                                <button
                                  onClick={(e) => openGoogleMaps(dayPlan.afternoon.place, e)}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                  title="Open in Google Maps"
                                >
                                  Map <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                {dayPlan.afternoon.description}
                              </p>
                            </div>

                            {dayPlan.afternoon.estCost && (
                              <div
                                className="mt-3 pt-2 flex items-center justify-between text-xs border-t border-slate-100"
                              >
                                <span className="text-slate-500 text-[11px]">Est. Cost:</span>
                                <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                  {dayPlan.afternoon.estCost}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Evening Slot */}
                      {(() => {
                        const evePhoto = getDaySlotPhoto(destination, dayPlan.day, 'evening', dayPlan.evening.place);
                        return (
                          <div
                            className="rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all group overflow-hidden"
                          >
                            <div>
                              {/* Slot Photo Thumbnail Banner */}
                              <div
                                onClick={() =>
                                  openPhotoModal(
                                    evePhoto,
                                    dayPlan.day,
                                    dayPlan.theme,
                                    `Evening: ${dayPlan.evening.place}`,
                                    dayGallery.all
                                  )
                                }
                                className="relative h-24 sm:h-28 -mx-3.5 -mt-3.5 mb-3 overflow-hidden cursor-pointer border-b border-slate-100 group/eve shadow-2xs"
                              >
                                <img
                                  src={evePhoto.url}
                                  alt={evePhoto.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/eve:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2 text-white">
                                  <span className="text-[10px] font-bold truncate max-w-[80%] drop-shadow-xs">
                                    {dayPlan.evening.place}
                                  </span>
                                  <span className="p-0.5 rounded bg-slate-900/60 text-white">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md"
                                >
                                  <Moon className="w-3 h-3 text-purple-600" />
                                  <span>EVENING</span>
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {dayPlan.evening.time}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                                {dayPlan.evening.activity}
                              </h4>

                              <div className="flex items-center justify-between gap-1 text-xs font-semibold text-indigo-700 mb-2 bg-indigo-50/60 p-1.5 rounded-lg border border-indigo-100">
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-indigo-600" />
                                  <span className="truncate">{dayPlan.evening.place}</span>
                                </div>
                                <button
                                  onClick={(e) => openGoogleMaps(dayPlan.evening.place, e)}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                  title="Open in Google Maps"
                                >
                                  Map <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                {dayPlan.evening.description}
                              </p>
                            </div>

                            {dayPlan.evening.estCost && (
                              <div
                                className="mt-3 pt-2 flex items-center justify-between text-xs border-t border-slate-100"
                              >
                                <span className="text-slate-500 text-[11px]">Est. Cost:</span>
                                <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                  {dayPlan.evening.estCost}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Travel & Transit Notes Banner */}
                  {dayPlan.travelNotes && (
                    <div
                      className="p-3 sm:p-3.5 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm bg-white border border-slate-200/80 shadow-2xs"
                    >
                      <Navigation className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 text-xs">Transit &amp; Route Logistics: </span>
                        <span className="text-slate-600">{dayPlan.travelNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* High-Resolution Picture Viewer Modal with Prev / Next Navigation */}
      {modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setModalPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-3xl overflow-hidden relative max-h-[92vh] flex flex-col bg-white border border-slate-200 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono font-bold text-xs">
                  DAY {modalPhoto.day}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {modalPhoto.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="text-indigo-600 font-semibold">{modalPhoto.slotName}</span>
                    <span>•</span>
                    <span>Photo {modalPhoto.galleryIndex + 1} of {modalPhoto.galleryList.length}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Display with Carousel Arrows */}
            <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[58vh]">
              <img
                src={modalPhoto.url}
                alt={modalPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[58vh]"
              />

              {modalPhoto.galleryList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Caption & Details */}
            <div className="p-4 sm:p-5 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm font-normal text-slate-700 leading-relaxed">
                    {modalPhoto.caption}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Curated high-resolution photography for {destination || 'your destination'}.</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {modalPhoto.galleryList.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const slotNames = ['Day Highlight', 'Morning Spot', 'Afternoon Spot', 'Evening Spot'];
                        setModalPhoto({
                          ...modalPhoto,
                          url: thumb.url,
                          title: thumb.title,
                          caption: thumb.caption,
                          galleryIndex: idx,
                          slotName: slotNames[idx % slotNames.length] || 'Scenic View',
                        });
                      }}
                      className={`w-10 h-10 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                        idx === modalPhoto.galleryIndex ? 'ring-2 ring-indigo-600 border border-indigo-600' : 'border border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

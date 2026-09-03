import React, { useState, useEffect } from 'react';
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
  selectedDay?: number | 'all';
  onSelectDay?: (day: number | 'all') => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  destination = '',
  selectedDay = 'all',
  onSelectDay,
}) => {
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>(selectedDay);
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [selectedPhotoSlot, setSelectedPhotoSlot] = useState<{ [day: number]: 'hero' | 'morning' | 'afternoon' | 'evening' }>({});

  // Sync with prop when changed from left sidebar or outside
  useEffect(() => {
    if (selectedDay !== undefined) {
      setActiveDayFilter(selectedDay);
    }
  }, [selectedDay]);

  const handleFilterDay = (day: number | 'all') => {
    setActiveDayFilter(day);
    if (onSelectDay) {
      onSelectDay(day);
    }
  };

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
      style={{
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-4 sm:p-7 mb-8 transition-all bg-white"
    >
      {/* Section Title & Global Controls */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 sm:pb-6"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-2 rounded-xl bg-indigo-50 text-indigo-800 shadow-2xs"
            >
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading flex items-center gap-2">
              <span>Day-by-Day Travel Blueprint</span>
              <span
                style={{ border: '1.5px solid #000000' }}
                className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 hidden sm:inline-flex items-center gap-1"
              >
                <Camera className="w-3 h-3 text-indigo-800" />
                <span>Distinct Photos Per Day</span>
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Curated morning, afternoon, and evening slots with rich photos for every day and direct Google Maps navigation.
          </p>
        </div>

        {/* Global Expand & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={allExpanded ? handleCollapseAll : handleExpandAll}
            style={{ border: '1.5px solid #000000' }}
            className="px-3.5 py-1.5 min-h-[36px] rounded-xl text-xs font-extrabold text-black bg-white hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title={allExpanded ? 'Collapse all days' : 'Expand all days'}
          >
            {allExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>

          {/* Day Filter Pills */}
          <div
            style={{ border: '1.5px solid #000000' }}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-slate-100 p-1 rounded-xl"
          >
            <button
              onClick={() => handleFilterDay('all')}
              style={{ border: activeDayFilter === 'all' ? '1.5px solid #000000' : 'none' }}
              className={`px-3 py-1 min-h-[30px] rounded-lg text-xs transition-all shrink-0 cursor-pointer flex items-center ${
                activeDayFilter === 'all'
                  ? 'bg-black text-white font-extrabold shadow-2xs'
                  : 'text-slate-700 hover:text-black font-bold'
              }`}
            >
              All ({itinerary.length})
            </button>
            {itinerary.map((d) => (
              <button
                key={d.day}
                onClick={() => handleFilterDay(d.day)}
                style={{ border: activeDayFilter === d.day ? '1.5px solid #000000' : 'none' }}
                className={`px-2.5 py-1 min-h-[30px] rounded-lg text-xs transition-all shrink-0 cursor-pointer flex items-center ${
                  activeDayFilter === d.day
                    ? 'bg-black text-white font-extrabold shadow-2xs'
                    : 'text-slate-700 hover:text-black font-bold'
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
              style={{
                border: '2px solid #000000',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              }}
              className="rounded-2xl overflow-hidden bg-white transition-all"
            >
              {/* Day Header Bar */}
              <div
                onClick={() => toggleDayExpand(dayPlan.day)}
                style={{
                  borderBottom: isExpanded ? '1.5px solid #000000' : 'none',
                }}
                className={`p-4 sm:p-5 min-h-[56px] flex items-center justify-between cursor-pointer select-none transition-colors ${
                  isExpanded ? 'bg-slate-50 hover:bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 pr-2 min-w-0">
                  <span
                    style={{ border: '1.5px solid #000000' }}
                    className="w-10 h-10 rounded-xl bg-amber-300 text-black font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-2xs"
                  >
                    D{dayPlan.day}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-950 truncate">
                        {dayPlan.title || `Day ${dayPlan.day}`}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        style={{ border: '1.5px solid #000000' }}
                        className="text-xs font-mono font-extrabold text-black bg-indigo-100 px-2.5 py-0.5 rounded-full"
                      >
                        {dayPlan.theme}
                      </span>
                      {dayPlan.stayArea && (
                        <span
                          style={{ border: '1.5px solid #000000' }}
                          className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-0.5 rounded-full flex items-center gap-1"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
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
                    style={{ border: '1.5px solid #000000' }}
                    className="p-2 sm:px-3 text-xs font-extrabold rounded-xl text-black bg-white hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="View Day Pictures Gallery"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold hidden sm:inline">Photos ({dayGallery.all.length})</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyDay(dayPlan, e)}
                    style={{ border: '1.5px solid #000000' }}
                    className="p-2 text-xs font-extrabold rounded-xl text-black bg-white hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Copy Day Schedule to Clipboard"
                  >
                    {copiedDay === dayPlan.day ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-[11px] font-bold text-emerald-800 hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 text-black">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Day Body with Multi-Photo Gallery Column (left) & 3 Time Slot Cards (right) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Left Column: Interactive Multi-Photo Showcase */}
                    <div
                      style={{ border: '1.5px solid #000000' }}
                      className="lg:col-span-4 rounded-2xl p-3.5 flex flex-col justify-between bg-white shadow-2xs"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span
                            style={{ border: '1.5px solid #000000' }}
                            className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-black flex items-center gap-1 shadow-2xs"
                          >
                            <Camera className="w-3 h-3 text-indigo-700" />
                            <span>Day {dayPlan.day} Gallery</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-600">
                            {dayGallery.all.length} Photos
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
                          style={{ border: '1.5px solid #000000' }}
                          className="relative h-44 sm:h-52 rounded-xl overflow-hidden cursor-pointer group/img shadow-2xs"
                        >
                          <img
                            src={displayedHeroPhoto.url}
                            alt={displayedHeroPhoto.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-2.5 text-white">
                            <div className="flex justify-end">
                              <span
                                style={{ border: '1px solid rgba(255,255,255,0.4)' }}
                                className="p-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-xs"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ border: '1px solid rgba(255,255,255,0.4)' }}
                                className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded"
                              >
                                {currentSlotSelection === 'hero' ? 'Highlight' : currentSlotSelection}
                              </span>
                              <p className="text-xs font-black truncate drop-shadow-sm mt-0.5 text-white">
                                {displayedHeroPhoto.title}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Thumbnail Selector Tabs for Day-to-Day Exploration */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono font-extrabold text-slate-700 uppercase tracking-wider">
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
                                  style={{
                                    border: isSelected ? '2px solid #000000' : '1px solid #64748b',
                                  }}
                                  className={`relative h-12 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                                    isSelected ? 'ring-2 ring-amber-400 shadow-xs' : 'opacity-80 hover:opacity-100'
                                  }`}
                                  title={`View ${slotKey} photo`}
                                >
                                  <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] font-bold text-white text-center py-0.5 truncate font-mono">
                                    {slotLabels[slotKey]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-700 font-medium leading-tight line-clamp-2">
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
                        style={{ border: '1.5px solid #000000' }}
                        className="mt-3 w-full py-2 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
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
                            style={{ border: '1.5px solid #000000' }}
                            className="rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-white shadow-2xs hover:shadow-md transition-all group overflow-hidden"
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
                                style={{ borderBottom: '1.5px solid #000000' }}
                                className="relative h-24 sm:h-28 -mx-3.5 -mt-3.5 mb-3 overflow-hidden cursor-pointer group/morn shadow-2xs"
                              >
                                <img
                                  src={morningPhoto.url}
                                  alt={morningPhoto.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/morn:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2 text-white">
                                  <span className="text-[10px] font-black truncate max-w-[80%] drop-shadow-xs">
                                    {dayPlan.morning.place}
                                  </span>
                                  <span className="p-0.5 rounded bg-slate-900/80 text-white">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span
                                  style={{ border: '1px solid #000000' }}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-black bg-amber-200 px-2 py-0.5 rounded-md"
                                >
                                  <Sun className="w-3 h-3 text-amber-700" />
                                  <span>MORNING</span>
                                </span>
                                <span className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-600" />
                                  {dayPlan.morning.time}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-slate-950 mb-1.5 leading-snug">
                                {dayPlan.morning.activity}
                              </h4>

                              <div
                                style={{ border: '1px solid #000000' }}
                                className="flex items-center justify-between gap-1 text-xs font-bold text-black mb-2 bg-indigo-50 p-1.5 rounded-lg"
                              >
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-indigo-700" />
                                  <span className="truncate">{dayPlan.morning.place}</span>
                                </div>
                                <button
                                  onClick={(e) => openGoogleMaps(dayPlan.morning.place, e)}
                                  className="text-[10px] font-extrabold text-indigo-800 hover:text-black flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                  title="Open in Google Maps"
                                >
                                  Map <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {dayPlan.morning.description}
                              </p>
                            </div>

                            {dayPlan.morning.estCost && (
                              <div
                                style={{ borderTop: '1px solid #000000' }}
                                className="mt-3 pt-2 flex items-center justify-between text-xs"
                              >
                                <span className="text-slate-600 text-[11px] font-bold">Est. Cost:</span>
                                <span
                                  style={{ border: '1px solid #000000' }}
                                  className="font-mono font-extrabold text-black bg-slate-100 px-2 py-0.5 rounded text-[11px]"
                                >
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
                            style={{ border: '1.5px solid #000000' }}
                            className="rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-white shadow-2xs hover:shadow-md transition-all group overflow-hidden"
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
                                style={{ borderBottom: '1.5px solid #000000' }}
                                className="relative h-24 sm:h-28 -mx-3.5 -mt-3.5 mb-3 overflow-hidden cursor-pointer group/noon shadow-2xs"
                              >
                                <img
                                  src={noonPhoto.url}
                                  alt={noonPhoto.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/noon:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2 text-white">
                                  <span className="text-[10px] font-black truncate max-w-[80%] drop-shadow-xs">
                                    {dayPlan.afternoon.place}
                                  </span>
                                  <span className="p-0.5 rounded bg-slate-900/80 text-white">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span
                                  style={{ border: '1px solid #000000' }}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-black bg-sky-200 px-2 py-0.5 rounded-md"
                                >
                                  <Sunset className="w-3 h-3 text-sky-700" />
                                  <span>AFTERNOON</span>
                                </span>
                                <span className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-600" />
                                  {dayPlan.afternoon.time}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-slate-950 mb-1.5 leading-snug">
                                {dayPlan.afternoon.activity}
                              </h4>

                              <div
                                style={{ border: '1px solid #000000' }}
                                className="flex items-center justify-between gap-1 text-xs font-bold text-black mb-2 bg-sky-50 p-1.5 rounded-lg"
                              >
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-sky-700" />
                                  <span className="truncate">{dayPlan.afternoon.place}</span>
                                </div>
                                <button
                                  onClick={(e) => openGoogleMaps(dayPlan.afternoon.place, e)}
                                  className="text-[10px] font-extrabold text-sky-800 hover:text-black flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                  title="Open in Google Maps"
                                >
                                  Map <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {dayPlan.afternoon.description}
                              </p>
                            </div>

                            {dayPlan.afternoon.estCost && (
                              <div
                                style={{ borderTop: '1px solid #000000' }}
                                className="mt-3 pt-2 flex items-center justify-between text-xs"
                              >
                                <span className="text-slate-600 text-[11px] font-bold">Est. Cost:</span>
                                <span
                                  style={{ border: '1px solid #000000' }}
                                  className="font-mono font-extrabold text-black bg-slate-100 px-2 py-0.5 rounded text-[11px]"
                                >
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
                            style={{ border: '1.5px solid #000000' }}
                            className="rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between bg-white shadow-2xs hover:shadow-md transition-all group overflow-hidden"
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
                                style={{ borderBottom: '1.5px solid #000000' }}
                                className="relative h-24 sm:h-28 -mx-3.5 -mt-3.5 mb-3 overflow-hidden cursor-pointer group/eve shadow-2xs"
                              >
                                <img
                                  src={evePhoto.url}
                                  alt={evePhoto.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/eve:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2 text-white">
                                  <span className="text-[10px] font-black truncate max-w-[80%] drop-shadow-xs">
                                    {dayPlan.evening.place}
                                  </span>
                                  <span className="p-0.5 rounded bg-slate-900/80 text-white">
                                    <Eye className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span
                                  style={{ border: '1px solid #000000' }}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-black bg-purple-200 px-2 py-0.5 rounded-md"
                                >
                                  <Moon className="w-3 h-3 text-purple-700" />
                                  <span>EVENING</span>
                                </span>
                                <span className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-600" />
                                  {dayPlan.evening.time}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-slate-950 mb-1.5 leading-snug">
                                {dayPlan.evening.activity}
                              </h4>

                              <div
                                style={{ border: '1px solid #000000' }}
                                className="flex items-center justify-between gap-1 text-xs font-bold text-black mb-2 bg-purple-50 p-1.5 rounded-lg"
                              >
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-purple-700" />
                                  <span className="truncate">{dayPlan.evening.place}</span>
                                </div>
                                <button
                                  onClick={(e) => openGoogleMaps(dayPlan.evening.place, e)}
                                  className="text-[10px] font-extrabold text-purple-800 hover:text-black flex items-center gap-0.5 shrink-0 hover:underline cursor-pointer"
                                  title="Open in Google Maps"
                                >
                                  Map <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {dayPlan.evening.description}
                              </p>
                            </div>

                            {dayPlan.evening.estCost && (
                              <div
                                style={{ borderTop: '1px solid #000000' }}
                                className="mt-3 pt-2 flex items-center justify-between text-xs"
                              >
                                <span className="text-slate-600 text-[11px] font-bold">Est. Cost:</span>
                                <span
                                  style={{ border: '1px solid #000000' }}
                                  className="font-mono font-extrabold text-black bg-slate-100 px-2 py-0.5 rounded text-[11px]"
                                >
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
                      style={{ border: '1.5px solid #000000' }}
                      className="p-3 sm:p-3.5 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm bg-white shadow-2xs"
                    >
                      <Navigation className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-extrabold text-black text-xs">Transit &amp; Route Logistics: </span>
                        <span className="text-slate-800 font-medium">{dayPlan.travelNotes}</span>
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
            style={{ border: '2px solid #000000' }}
            className="w-full max-w-4xl rounded-3xl overflow-hidden relative max-h-[92vh] flex flex-col bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div
              style={{ borderBottom: '1.5px solid #000000' }}
              className="flex items-center justify-between p-3.5 sm:p-4 bg-white"
            >
              <div className="flex items-center gap-2.5">
                <span
                  style={{ border: '1.5px solid #000000' }}
                  className="px-2.5 py-1 rounded-lg bg-amber-300 text-black font-mono font-extrabold text-xs"
                >
                  DAY {modalPhoto.day}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
                    {modalPhoto.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                    <span className="text-indigo-800">{modalPhoto.slotName}</span>
                    <span>•</span>
                    <span>Photo {modalPhoto.galleryIndex + 1} of {modalPhoto.galleryList.length}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalPhoto(null)}
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-black flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Display with Carousel Arrows */}
            <div
              style={{ borderBottom: '1.5px solid #000000' }}
              className="relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[58vh]"
            >
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
                    style={{ border: '1.5px solid #ffffff' }}
                    className="absolute left-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-lg hover:scale-105"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextPhoto}
                    style={{ border: '1.5px solid #ffffff' }}
                    className="absolute right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-lg hover:scale-105"
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
                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                    {modalPhoto.caption}
                  </p>
                  <p className="text-xs text-slate-700 font-mono font-bold mt-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600" />
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
                      style={{
                        border: idx === modalPhoto.galleryIndex ? '2px solid #000000' : '1px solid #94a3b8',
                      }}
                      className={`w-10 h-10 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                        idx === modalPhoto.galleryIndex ? 'ring-2 ring-amber-400' : 'opacity-60 hover:opacity-100'
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

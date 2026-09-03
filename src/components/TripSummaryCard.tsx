import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Utensils,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Sparkles,
  Sun,
  Share2,
  Armchair,
  Clock,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TripPlan } from '../types';

interface TripSummaryCardProps {
  plan: TripPlan;
  onSaveTrip: (plan: TripPlan) => void;
  isSaved: boolean;
  onStartNewTrip: () => void;
  onSelectSection?: (sectionId: string) => void;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  plan,
  onSaveTrip,
  isSaved,
  onStartNewTrip,
  onSelectSection,
}) => {
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const { tripSummary, budget } = plan;

  const perPersonPerDay =
    tripSummary.travelers > 0 && tripSummary.duration > 0
      ? Math.round(budget.estimatedTotal / (tripSummary.travelers * tripSummary.duration))
      : 0;

  const handleShare = async () => {
    const shareData = {
      title: `Trip Plan: ${tripSummary.destination}`,
      text: `Check out my ${tripSummary.duration}-day travel plan to ${tripSummary.destination} with a budget of ${tripSummary.budgetFormatted}!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to copy text
      }
    }

    handleCopy();
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  const handleCopy = async () => {
    try {
      const summaryText = `✈️ TRIPGENIE TRAVEL PLAN: ${tripSummary.destination.toUpperCase()}
Duration: ${tripSummary.duration} Days | Travelers: ${tripSummary.travelers} | Budget: ${tripSummary.budgetFormatted}
Style: ${tripSummary.travelStyle} | Food: ${tripSummary.foodPreference}
Best Season: ${tripSummary.bestSeason}

OVERVIEW:
${tripSummary.summary}

DAY-BY-DAY ITINERARY:
${plan.itinerary
  .map(
    (d) => `Day ${d.day}: ${d.title} (${d.theme})
- Morning (${d.morning.time}): ${d.morning.activity} at ${d.morning.place} (Est: ${d.morning.estCost || 'Free'})
- Afternoon (${d.afternoon.time}): ${d.afternoon.activity} at ${d.afternoon.place} (Est: ${d.afternoon.estCost || 'Free'})
- Evening (${d.evening.time}): ${d.evening.activity} at ${d.evening.place} (Est: ${d.evening.estCost || 'Free'})
- Transit Notes: ${d.travelNotes}`
  )
  .join('\n\n')}

BUDGET BREAKDOWN:
- Accommodation: ${budget.currency} ${budget.breakdown.accommodation}
- Food: ${budget.currency} ${budget.breakdown.food}
- Transportation: ${budget.currency} ${budget.breakdown.transportation}
- Activities: ${budget.currency} ${budget.breakdown.activities}
- Miscellaneous: ${budget.currency} ${budget.breakdown.miscellaneous}
Estimated Total: ${budget.currency} ${budget.estimatedTotal.toLocaleString()} (Budget: ${tripSummary.budgetFormatted})

RECOMMENDED PLACES:
${plan.recommendedPlaces.map((p) => `• ${p.name} [${p.tag}]: ${p.description} (Best time: ${p.bestTimeToVisit})`).join('\n')}

Plan generated with Tripholic AI Travel Planner.`;

      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy itinerary', err);
    }
  };

  const handleSave = () => {
    onSaveTrip(plan);
    setJustSaved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div
      id="trip-summary-card"
      style={{
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl overflow-hidden mb-8 transition-all duration-300 bg-white"
    >
      {/* Light Clean Top Banner with Destination & Actions */}
      <div
        style={{
          borderBottom: '2px solid #000000',
        }}
        className="p-5 sm:p-7 bg-gradient-to-r from-amber-50/60 via-indigo-50/50 to-purple-50/60 relative"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                style={{ border: '1.5px solid #000000' }}
                className="px-3 py-1 text-xs font-mono font-extrabold uppercase tracking-wider text-black bg-white rounded-full flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-indigo-600" />
                <span>AI ITINERARY GENERATED</span>
              </span>
              <span
                style={{ border: '1.5px solid #000000' }}
                className="px-3 py-1 text-xs font-mono font-extrabold text-black bg-amber-200 rounded-full flex items-center gap-1.5 shadow-2xs"
              >
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                <span>{tripSummary.bestSeason}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 mb-1 font-heading">
              {tripSummary.destination}
            </h1>
            <p className="text-sm sm:text-base text-slate-700 max-w-2xl font-semibold">
              {tripSummary.tripVibe}
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              id="jump-to-seat-booking-btn"
              onClick={() => {
                if (onSelectSection) {
                  onSelectSection('seat-booking');
                } else {
                  const el = document.getElementById('seat-booking-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{ border: '2px solid #000000' }}
              className="px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Confirm your seat reservation now"
            >
              <Armchair className="w-4 h-4 text-amber-300" />
              <span>Confirm Seat</span>
            </button>

            <button
              id="save-trip-btn"
              onClick={handleSave}
              style={{ border: '2px solid #000000' }}
              className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isSaved || justSaved
                  ? 'bg-amber-400 hover:bg-amber-500 text-black'
                  : 'bg-white hover:bg-slate-100 text-black'
              }`}
              title="Save to local browser storage"
            >
              {isSaved || justSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-black" />
                  <span>{justSaved ? 'Saved!' : 'Saved in Trips'}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-black" />
                  <span>Save Trip</span>
                </>
              )}
            </button>

            <button
              id="share-trip-btn"
              onClick={handleShare}
              style={{ border: '2px solid #000000' }}
              className="px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold text-black hover:bg-slate-100 bg-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Share or copy itinerary link"
            >
              {sharedToast || copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-indigo-700" />
                  <span>Share Plan</span>
                </>
              )}
            </button>

            <button
              id="print-plan-btn"
              onClick={() => window.print()}
              style={{ border: '2px solid #000000' }}
              className="px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold text-black hover:bg-slate-100 bg-white flex items-center justify-center gap-1.5 transition-all cursor-pointer print:hidden shadow-2xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Print / PDF</span>
            </button>

            <button
              id="start-new-trip-btn"
              onClick={onStartNewTrip}
              style={{ border: '2px solid #000000' }}
              className="px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-extrabold text-black hover:bg-slate-100 bg-white flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Create a new trip plan"
            >
              <RotateCcw className="w-4 h-4 text-slate-700" />
              <span>New Trip</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div
          style={{ borderTop: '1.5px solid #000000' }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5"
        >
          <div
            style={{ border: '1.5px solid #000000' }}
            className="rounded-2xl p-3.5 bg-white shadow-2xs"
          >
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-600 block">Duration</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-4 h-4 text-indigo-700 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-black">
                {tripSummary.duration} {tripSummary.duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          <div
            style={{ border: '1.5px solid #000000' }}
            className="rounded-2xl p-3.5 bg-white shadow-2xs"
          >
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-600 block">Travelers</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Users className="w-4 h-4 text-indigo-700 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-black truncate">
                {tripSummary.travelers} {tripSummary.travelers === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div
            style={{ border: '1.5px solid #000000' }}
            className="rounded-2xl p-3.5 bg-white shadow-2xs"
          >
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-600 block">Budget Cap</span>
            <div className="flex items-center gap-1.5 mt-1">
              <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-black truncate">{tripSummary.budgetFormatted}</span>
            </div>
            {perPersonPerDay > 0 && (
              <span className="text-[11px] font-mono font-bold text-slate-600 block mt-0.5">
                ~{budget.currency}{perPersonPerDay.toLocaleString()}/person/day
              </span>
            )}
          </div>

          <div
            style={{ border: '1.5px solid #000000' }}
            className="rounded-2xl p-3.5 bg-white shadow-2xs"
          >
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-600 block">Style & Diet</span>
            <div className="flex items-center gap-1.5 mt-1" title={`Style: ${tripSummary.travelStyle} | Food: ${tripSummary.foodPreference}`}>
              <Compass className="w-4 h-4 text-indigo-700 shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-black truncate">
                {tripSummary.travelStyle} • {tripSummary.foodPreference}
              </span>
            </div>
          </div>
        </div>

        {/* Quick 1-Click Jump Chips - Zero Scrolling Needed */}
        {onSelectSection && (
          <div
            style={{ borderTop: '1.5px solid #000000' }}
            className="mt-5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
          >
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-700 shrink-0">
              ⚡ Instant Jump (Avoid Scrolling):
            </span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: 'itinerary', label: '📅 Itinerary' },
                { id: 'places', label: '📍 Sights' },
                { id: 'food', label: '🍽️ Food & Dining' },
                { id: 'budget', label: '💰 Budget Breakdown' },
                { id: 'tips', label: '💡 Travel Tips' },
                { id: 'seat-booking', label: '🎟️ Reserve Seat (₹250)', highlight: true },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => onSelectSection(chip.id)}
                  style={{
                    border: '1.5px solid #000000',
                    background: chip.highlight ? '#eef2ff' : '#ffffff',
                    color: chip.highlight ? '#3730a3' : '#000000',
                  }}
                  className={`px-2.5 py-1 text-xs font-extrabold rounded-lg hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs ${
                    chip.highlight ? 'font-black border-indigo-700' : ''
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Narrative & Highlights */}
      <div className="p-5 sm:p-7">
        <div className="mb-5">
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-black mb-2">
            Trip Narrative & AI Synthesis
          </h3>
          <p
            style={{ border: '1.5px solid #000000' }}
            className="text-slate-900 text-sm sm:text-base leading-relaxed font-medium p-4 sm:p-5 rounded-2xl bg-slate-50 shadow-2xs"
          >
            {tripSummary.summary}
          </p>
        </div>

        {/* Highlights Pills */}
        {tripSummary.highlights && tripSummary.highlights.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-black mb-2.5">
              Key Itinerary Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {tripSummary.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{ border: '1.5px solid #000000' }}
                  className="px-3.5 py-1.5 rounded-xl text-black text-xs sm:text-sm font-bold flex items-center gap-2 bg-white shadow-2xs"
                >
                  <span className="text-indigo-700 font-black">▪</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


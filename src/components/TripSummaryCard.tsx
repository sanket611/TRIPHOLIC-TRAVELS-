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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TripPlan } from '../types';

interface TripSummaryCardProps {
  plan: TripPlan;
  onSaveTrip: (plan: TripPlan) => void;
  isSaved: boolean;
  onStartNewTrip: () => void;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  plan,
  onSaveTrip,
  isSaved,
  onStartNewTrip,
}) => {
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const { tripSummary, budget } = plan;

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
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] overflow-hidden mb-8 transition-all duration-300"
    >
      {/* Translucent Glass Top Banner with Destination & Actions */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.20)',
        }}
        className="p-4 sm:p-8 text-white relative"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
              <span className="px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-blue-500/25 text-blue-200 border border-blue-400/40 rounded-full flex items-center gap-1.5 shadow-2xs backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>AI ITINERARY GENERATED</span>
              </span>
              <span className="px-2.5 py-1 text-[11px] sm:text-xs font-mono font-semibold bg-white/20 text-white rounded-full border border-white/30 flex items-center gap-1 backdrop-blur-md">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>{tripSummary.bestSeason}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 font-heading drop-shadow-sm">
              {tripSummary.destination}
            </h1>
            <p className="text-xs sm:text-sm text-slate-100 max-w-2xl font-normal drop-shadow-xs">
              {tripSummary.tripVibe}
            </p>
          </div>

          {/* Quick Actions Row - Optimized with 44px+ touch targets on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              id="jump-to-seat-booking-btn"
              onClick={() => {
                const el = document.getElementById('seat-booking-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 border border-blue-400/40"
              title="Confirm your seat reservation now"
            >
              <Armchair className="w-4 h-4 text-amber-300" />
              <span>Confirm Seat</span>
            </button>

            <button
              id="save-trip-btn"
              onClick={handleSave}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isSaved || justSaved
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-white/25 hover:bg-white/40 text-white border border-white/30 backdrop-blur-md'
              }`}
              title="Save to local browser storage"
            >
              {isSaved || justSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{justSaved ? 'Saved!' : 'Saved in Trips'}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Trip</span>
                </>
              )}
            </button>

            <button
              id="copy-trip-btn"
              onClick={handleCopy}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-white/25 hover:bg-white/40 active:bg-white/50 text-white border border-white/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              title="Copy formatted itinerary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Plan</span>
                </>
              )}
            </button>

            <button
              id="print-plan-btn"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-white/25 hover:bg-white/40 active:bg-white/50 text-white border border-white/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer print:hidden backdrop-blur-md"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              id="start-new-trip-btn"
              onClick={onStartNewTrip}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold bg-white/25 hover:bg-white/40 active:bg-white/50 text-white border border-white/30 flex items-center justify-center gap-1 transition-all cursor-pointer backdrop-blur-md"
              title="Create a new trip plan"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Trip</span>
            </button>
          </div>
        </div>

        {/* Translucent Key Metrics Strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.20)',
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6"
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.20)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
            }}
            className="rounded-2xl p-3 backdrop-blur-md"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold block">Duration</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-xs sm:text-base font-bold text-white">
                {tripSummary.duration} {tripSummary.duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.20)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
            }}
            className="rounded-2xl p-3 backdrop-blur-md"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold block">Travelers</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-xs sm:text-base font-bold text-white truncate">
                {tripSummary.travelers} {tripSummary.travelers === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.20)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
            }}
            className="rounded-2xl p-3 backdrop-blur-md"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold block">Budget Cap</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-xs sm:text-base font-bold text-white truncate">{tripSummary.budgetFormatted}</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.20)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
            }}
            className="rounded-2xl p-3 backdrop-blur-md"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold block">Style & Diet</span>
            <div className="flex items-center gap-1.5 mt-0.5" title={`Style: ${tripSummary.travelStyle} | Food: ${tripSummary.foodPreference}`}>
              <Compass className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-white truncate">
                {tripSummary.travelStyle} • {tripSummary.foodPreference}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Narrative & Highlights */}
      <div className="p-4 sm:p-8">
        <div className="mb-5 sm:mb-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2">
            Trip Narrative & AI Synthesis
          </h3>
          <p
            style={{
              background: 'rgba(255, 255, 255, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
            }}
            className="text-slate-900 text-xs sm:text-sm leading-relaxed font-medium p-3.5 sm:p-5 rounded-2xl backdrop-blur-md shadow-xs"
          >
            {tripSummary.summary}
          </p>
        </div>

        {/* Highlights Pills */}
        {tripSummary.highlights && tripSummary.highlights.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Key Itinerary Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {tripSummary.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="px-3 py-1.5 rounded-xl text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs backdrop-blur-md"
                >
                  <span className="text-blue-600 font-bold">▪</span>
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

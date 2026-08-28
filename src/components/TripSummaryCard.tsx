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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] overflow-hidden mb-8 transition-all duration-300"
    >
      {/* Translucent Glass Top Banner with Destination & Actions */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.80) 50%, rgba(49, 46, 129, 0.78) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1.5px solid #000000',
        }}
        className="p-4 sm:p-8 text-white relative"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="px-3 py-1 text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 fill-current text-violet-700" />
                <span>AI ITINERARY GENERATED</span>
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="px-3 py-1 text-xs sm:text-sm font-mono font-extrabold text-black rounded-full flex items-center gap-1 backdrop-blur-md shadow-sm"
              >
                <Sun className="w-4 h-4 text-amber-600" />
                <span>{tripSummary.bestSeason}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 font-heading drop-shadow-md">
              {tripSummary.destination}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-2xl font-medium drop-shadow-sm">
              {tripSummary.tripVibe}
            </p>
          </div>

          {/* Quick Actions Row - Optimized with 44px+ touch targets */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              id="jump-to-seat-booking-btn"
              onClick={() => {
                const el = document.getElementById('seat-booking-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                border: '1.5px solid #000000',
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 active:scale-95 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Confirm your seat reservation now"
            >
              <Armchair className="w-4 h-4 text-amber-300" />
              <span>Confirm Seat</span>
            </button>

            <button
              id="save-trip-btn"
              onClick={handleSave}
              style={{
                background: isSaved || justSaved ? '#f59e0b' : 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 text-black ${
                isSaved || justSaved ? 'hover:bg-amber-400' : 'hover:bg-black hover:text-white'
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
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white active:bg-slate-900 flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-sm"
              title="Copy formatted itinerary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800 font-extrabold">Copied!</span>
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
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white active:bg-slate-900 flex items-center justify-center gap-1.5 transition-all cursor-pointer print:hidden backdrop-blur-md shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              id="start-new-trip-btn"
              onClick={onStartNewTrip}
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white active:bg-slate-900 flex items-center justify-center gap-1 transition-all cursor-pointer backdrop-blur-md shadow-sm"
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
            borderTop: '1.5px solid rgba(255, 255, 255, 0.30)',
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6"
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-sm"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-black font-extrabold block">Duration</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-violet-700 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-black">
                {tripSummary.duration} {tripSummary.duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-sm"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-black font-extrabold block">Travelers</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users className="w-4 h-4 text-violet-700 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-black truncate">
                {tripSummary.travelers} {tripSummary.travelers === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-sm"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-black font-extrabold block">Budget Cap</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-black truncate">{tripSummary.budgetFormatted}</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-sm"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-black font-extrabold block">Style & Diet</span>
            <div className="flex items-center gap-1.5 mt-0.5" title={`Style: ${tripSummary.travelStyle} | Food: ${tripSummary.foodPreference}`}>
              <Compass className="w-4 h-4 text-violet-700 shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-black truncate">
                {tripSummary.travelStyle} • {tripSummary.foodPreference}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Narrative & Highlights */}
      <div className="p-4 sm:p-8">
        <div className="mb-5 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-2">
            Trip Narrative & AI Synthesis
          </h3>
          <p
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1.5px solid #000000',
            }}
            className="text-slate-950 text-sm sm:text-base leading-relaxed font-semibold p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-sm"
          >
            {tripSummary.summary}
          </p>
        </div>

        {/* Highlights Pills */}
        {tripSummary.highlights && tripSummary.highlights.length > 0 && (
          <div>
            <h4 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-2.5">
              Key Itinerary Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {tripSummary.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="px-3.5 py-2 rounded-xl text-black text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm backdrop-blur-md"
                >
                  <span className="text-violet-700 font-bold">▪</span>
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

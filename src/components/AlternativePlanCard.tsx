import React, { useState } from 'react';
import {
  Shuffle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Sparkles,
  Compass,
  Zap,
  MapPin,
  Clock,
  UserCheck,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { AlternativePlan } from '../types';

interface AlternativePlanCardProps {
  alternativePlan: AlternativePlan;
  primaryStyle: string;
  onAdoptPlan?: (modificationPrompt: string) => void;
  isAdopting?: boolean;
}

export const AlternativePlanCard: React.FC<AlternativePlanCardProps> = ({
  alternativePlan,
  primaryStyle,
  onAdoptPlan,
  isAdopting = false,
}) => {
  const {
    title,
    alternativeStyle,
    targetPersona,
    vibeShift,
    energyLevel = 'Relaxed & Zen',
    concept,
    keyDifferences = [],
    whatYouGain = [],
    whatYouSkip = [],
    secretGems = [],
    quickDayOverview = [],
    pacingSummary,
    estimatedCostComparison,
    costImpactType = 'cheaper',
  } = alternativePlan;

  const [activeTab, setActiveTab] = useState<'overview' | 'dayByDay' | 'secretGems'>('overview');

  const handleAdopt = () => {
    if (onAdoptPlan) {
      const adoptPrompt = `Switch and fully transform the entire trip itinerary into the alternative perspective: "${title}". Style: ${
        alternativeStyle || 'Alternative Contrast'
      }. Core concept: ${concept}. Incorporate the alternative daily focus, pace, and secret gems.`;
      onAdoptPlan(adoptPrompt);
    }
  };

  return (
    <section
      id="alternative-plan-section"
      className="rounded-3xl p-5 sm:p-8 mb-8 overflow-hidden relative transition-all bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div
        className="pb-5 sm:pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10 border-b border-slate-200"
      >
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              THE COUNTER-PROPOSAL BLUEPRINT
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 shadow-2xs"
            >
              CONTRASTS WITH: {primaryStyle.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
              <Shuffle className="w-5 h-5" />
            </span>
            {title}
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-normal mt-1">
            A radical perspective shift designed with unique phrasing, contrasting pacing, and curated off-grid discoveries.
          </p>
        </div>

        {/* Adopt Button Call-To-Action */}
        {onAdoptPlan && (
          <button
            type="button"
            id="adopt-alternative-plan-btn"
            onClick={handleAdopt}
            disabled={isAdopting}
            className={`w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs active:scale-95 ${
              isAdopting
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
            title="Convert your active trip plan to this alternative blueprint"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isAdopting ? 'Transforming Itinerary...' : 'Adopt This Blueprint'}</span>
            <ArrowUpRight className="w-4 h-4 text-amber-300" />
          </button>
        )}
      </div>

      {/* Vibe Shift & Persona Transformation Bar */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 relative z-10">
        {/* Vibe Shift Gauge */}
        <div
          className="md:col-span-7 p-5 rounded-2xl bg-indigo-900 text-white flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-indigo-200 uppercase tracking-wider text-xs font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              Paradigm Shift Dynamic
            </span>
            <span
              className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-semibold"
            >
              {energyLevel}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-amber-300">
            {vibeShift || `${primaryStyle} ➔ ${alternativeStyle || 'Alternative Experiential Flow'}`}
          </p>
          {pacingSummary && (
            <p className="text-xs sm:text-sm text-indigo-100 mt-2 flex items-center gap-1.5 font-normal">
              <Clock className="w-4 h-4 text-indigo-200 shrink-0" />
              <span>{pacingSummary}</span>
            </p>
          )}
        </div>

        {/* Target Persona Archetype */}
        <div
          className="md:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between shadow-2xs"
        >
          <span className="text-slate-800 uppercase tracking-wider text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            Crafted For This Traveler Persona
          </span>
          <p className="text-xs sm:text-base text-slate-700 leading-snug mt-1.5 italic font-medium">
            "{targetPersona || 'For travelers seeking a distinctive counter-rhythm and authentic local surprises.'}"
          </p>
          <span className="text-xs text-indigo-600 font-semibold mt-2">
            Alternative Archetype: {alternativeStyle || 'Artisan & Scenic Immersion'}
          </span>
        </div>
      </div>

      {/* Core Narrative / Concept */}
      <div
        className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl relative z-10 bg-slate-50 border border-slate-200/90 shadow-2xs"
      >
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" />
          Blueprint Philosophy & Core Concept
        </h4>
        <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-normal">
          {concept}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        className="mt-5 sm:mt-6 flex flex-wrap gap-2 pb-3 relative z-10 border-b border-slate-200"
      >
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center shadow-2xs border ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Key Contrast & Tradeoffs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dayByDay')}
          className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center shadow-2xs border ${
            activeTab === 'dayByDay'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Daily Flow Progression ({quickDayOverview.length} Days)
        </button>
        {secretGems.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('secretGems')}
            className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border ${
              activeTab === 'secretGems'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Curated Off-Grid Gems ({secretGems.length})
          </button>
        )}
      </div>

      {/* Tab Content 1: Overview & Direct Contrast */}
      {activeTab === 'overview' && (
        <div className="mt-4 sm:mt-5 space-y-4 sm:space-y-5 relative z-10 animate-fade-in">
          {/* Side-by-side: What You Gain vs What You Skip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* What You Gain */}
            <div
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs"
            >
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What You Gain in This Blueprint</span>
              </h4>
              <ul className="space-y-2">
                {(whatYouGain.length > 0 ? whatYouGain : keyDifferences).map((gain, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl flex items-start gap-2 border border-slate-200/80 shadow-2xs leading-relaxed"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{gain}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Skip & Trade Off */}
            <div
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs"
            >
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What You Intentionally Skip & Bypass</span>
              </h4>
              <ul className="space-y-2">
                {(whatYouSkip.length > 0
                  ? whatYouSkip
                  : [
                      'Overcrowded commercial tourist ticket queues during peak heat',
                      'Rushed inter-neighborhood transit sprints',
                      'Rigid multi-stop itineraries with no room for spontaneous discovery',
                    ]
                ).map((skip, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl flex items-start gap-2 border border-slate-200/80 shadow-2xs leading-relaxed"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{skip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Differences Bulletins */}
          {keyDifferences.length > 0 && (
            <div
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                Structural Execution Differences
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {keyDifferences.map((diff, i) => (
                  <div
                    key={i}
                    className="text-xs sm:text-sm text-slate-700 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs leading-relaxed"
                  >
                    <span className="font-bold text-indigo-600 mr-1.5">#{i + 1}</span>
                    {diff}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Day by Day Progression */}
      {activeTab === 'dayByDay' && (
        <div className="mt-4 sm:mt-5 space-y-3 relative z-10 animate-fade-in">
          {quickDayOverview.map((d) => (
            <div
              key={d.day}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all"
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                >
                  D{d.day}
                </span>
                <div>
                  <h5 className="text-xs sm:text-base font-bold text-slate-900">
                    {d.title || `Day ${d.day} Alternative Trajectory`}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed font-normal">
                    {d.focus}
                  </p>
                </div>
              </div>

              {(d.highlightSpot || d.pacingNote) && (
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1 shrink-0 text-xs">
                  {d.highlightSpot && (
                    <span
                      className="px-2.5 py-1 rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-100 font-medium flex items-center gap-1 shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{d.highlightSpot}</span>
                    </span>
                  )}
                  {d.pacingNote && (
                    <span className="text-slate-500 text-xs font-normal">
                      {d.pacingNote}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Curated Secret Gems */}
      {activeTab === 'secretGems' && secretGems.length > 0 && (
        <div className="mt-4 sm:mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 relative z-10 animate-fade-in">
          {secretGems.map((gem, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100"
                  >
                    {gem.vibeTag || 'Secret Haven'}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <h5 className="text-sm sm:text-base font-bold text-slate-900 font-heading">{gem.name}</h5>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{gem.whySpecial}</p>
              </div>

              <div
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs"
              >
                <span className="text-slate-500 font-medium">Best For:</span>
                <span className="text-slate-900 font-semibold">{gem.bestFor}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Comparison Bar */}
      {estimatedCostComparison && (
        <div
          className="mt-5 sm:mt-6 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm relative z-10 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <TrendingDown className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-200 uppercase tracking-wider text-xs block font-bold">
                Alternative Financial Dynamics
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {costImpactType === 'cheaper'
                  ? 'Optimized for smart savings & local vendor pricing'
                  : 'Tailored for boutique bespoke experiences'}
              </span>
            </div>
          </div>
          <span className="font-bold text-amber-300 text-base sm:text-lg">
            {estimatedCostComparison}
          </span>
        </div>
      )}
    </section>
  );
};

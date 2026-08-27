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
      className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-4 sm:p-8 mb-8 overflow-hidden relative"
    >
      {/* Decorative Blueprint Grid Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50/60 to-purple-50/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="pb-5 sm:pb-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              THE COUNTER-PROPOSAL BLUEPRINT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              CONTRASTS WITH: {primaryStyle.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
              <Shuffle className="w-5 h-5" />
            </span>
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            A radical perspective shift designed with unique phrasing, contrasting pacing, and curated off-grid discoveries.
          </p>
        </div>

        {/* Adopt Button Call-To-Action - Touch friendly on mobile */}
        {onAdoptPlan && (
          <button
            type="button"
            id="adopt-alternative-plan-btn"
            onClick={handleAdopt}
            disabled={isAdopting}
            className={`w-full sm:w-auto px-5 py-3 min-h-[48px] rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs active:scale-98 ${
              isAdopting
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
            title="Convert your active trip plan to this alternative blueprint"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isAdopting ? 'Transforming Itinerary...' : 'Adopt This Blueprint'}</span>
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </button>
        )}
      </div>

      {/* Vibe Shift & Persona Transformation Bar */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 relative z-10">
        {/* Vibe Shift Gauge */}
        <div className="md:col-span-7 p-4 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Paradigm Shift Dynamic
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-400/30">
              {energyLevel}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-amber-300 font-mono">
            {vibeShift || `${primaryStyle} ➔ ${alternativeStyle || 'Alternative Experiential Flow'}`}
          </p>
          {pacingSummary && (
            <p className="text-xs text-slate-300 mt-2 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{pacingSummary}</span>
            </p>
          )}
        </div>

        {/* Target Persona Archetype */}
        <div className="md:col-span-5 p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex flex-col justify-between">
          <span className="text-indigo-900 font-mono uppercase tracking-wider text-[10px] font-bold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            Crafted For This Traveler Persona
          </span>
          <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-snug mt-1.5 italic">
            "{targetPersona || 'For travelers seeking a distinctive counter-rhythm and authentic local surprises.'}"
          </p>
          <span className="text-[10px] font-mono text-indigo-600 mt-2">
            Alternative Archetype: {alternativeStyle || 'Artisan & Scenic Immersion'}
          </span>
        </div>
      </div>

      {/* Core Narrative / Concept */}
      <div className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 relative z-10">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Blueprint Philosophy & Core Concept
        </h4>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
          {concept}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
          }`}
        >
          Key Contrast & Tradeoffs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dayByDay')}
          className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center ${
            activeTab === 'dayByDay'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
          }`}
        >
          Daily Flow Progression ({quickDayOverview.length} Days)
        </button>
        {secretGems.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('secretGems')}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'secretGems'
                ? 'bg-purple-900 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 active:bg-purple-200 border border-purple-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
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
            <div className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What You Gain in This Blueprint</span>
              </h4>
              <ul className="space-y-2">
                {(whatYouGain.length > 0 ? whatYouGain : keyDifferences).map((gain, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-emerald-100 flex items-start gap-2 shadow-2xs leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{gain}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Skip & Trade Off */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-slate-500" />
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
                    className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{skip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Differences Bulletins */}
          {keyDifferences.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Structural Execution Differences
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {keyDifferences.map((diff, i) => (
                  <div
                    key={i}
                    className="text-xs text-slate-700 p-2.5 rounded-lg bg-white border border-slate-200 leading-relaxed"
                  >
                    <span className="font-mono font-bold text-indigo-600 mr-1.5">#{i + 1}</span>
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
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  D{d.day}
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 font-mono">
                    {d.title || `Day ${d.day} Alternative Trajectory`}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">
                    {d.focus}
                  </p>
                </div>
              </div>

              {(d.highlightSpot || d.pacingNote) && (
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1 shrink-0 text-[11px] font-mono">
                  {d.highlightSpot && (
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{d.highlightSpot}</span>
                    </span>
                  )}
                  {d.pacingNote && (
                    <span className="text-slate-400 text-[10px]">
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
              className="p-3.5 sm:p-4 rounded-xl bg-purple-50/40 border border-purple-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    {gem.vibeTag || 'Secret Haven'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                </div>
                <h5 className="text-sm font-bold text-purple-950 font-heading">{gem.name}</h5>
                <p className="text-xs text-purple-900/80 mt-1 leading-relaxed">{gem.whySpecial}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-purple-700 font-bold">Best For:</span>
                <span className="text-slate-600">{gem.bestFor}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Comparison Bar */}
      {estimatedCostComparison && (
        <div className="mt-5 sm:mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-mono text-slate-300 uppercase tracking-wider text-[10px] block">
                Alternative Financial Dynamics
              </span>
              <span className="text-[11px] text-slate-400">
                {costImpactType === 'cheaper'
                  ? 'Optimized for smart savings & local vendor pricing'
                  : 'Tailored for boutique bespoke experiences'}
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-amber-300 text-sm sm:text-base">
            {estimatedCostComparison}
          </span>
        </div>
      )}
    </section>
  );
};

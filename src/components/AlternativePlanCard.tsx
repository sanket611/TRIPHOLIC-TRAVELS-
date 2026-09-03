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
      style={{
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-5 sm:p-8 mb-8 overflow-hidden relative transition-all bg-white"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="pb-5 sm:pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10"
      >
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span
              style={{ border: '1px solid #000000' }}
              className="px-3 py-1 rounded-full text-xs font-mono font-extrabold text-black bg-amber-200 flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              THE COUNTER-PROPOSAL BLUEPRINT
            </span>
            <span
              style={{ border: '1px solid #000000' }}
              className="px-3 py-1 rounded-full text-xs font-mono font-bold text-black bg-slate-100 shadow-2xs"
            >
              CONTRASTS WITH: {primaryStyle.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading flex items-center gap-2">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs shrink-0"
            >
              <Shuffle className="w-5 h-5" />
            </span>
            {title}
          </h2>

          <p className="text-xs sm:text-base text-slate-700 font-medium mt-1">
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
            style={{ border: '1.5px solid #000000' }}
            className={`w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md active:scale-95 ${
              isAdopting
                ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                : 'bg-amber-300 hover:bg-amber-400'
            }`}
            title="Convert your active trip plan to this alternative blueprint"
          >
            <Zap className="w-4 h-4 text-black" />
            <span>{isAdopting ? 'Transforming Itinerary...' : 'Adopt This Blueprint'}</span>
            <ArrowUpRight className="w-4 h-4 text-black" />
          </button>
        )}
      </div>

      {/* Vibe Shift & Persona Transformation Bar */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 relative z-10">
        {/* Vibe Shift Gauge */}
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
          className="md:col-span-7 p-5 rounded-2xl bg-black text-white flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-amber-300 uppercase tracking-wider text-xs font-mono font-extrabold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-300" />
              Paradigm Shift Dynamic
            </span>
            <span
              style={{ border: '1px solid #444444' }}
              className="px-2.5 py-0.5 rounded-md bg-white/15 text-amber-300 text-xs font-mono font-bold"
            >
              {energyLevel}
            </span>
          </div>
          <p className="text-sm sm:text-base font-black text-amber-300">
            {vibeShift || `${primaryStyle} ➔ ${alternativeStyle || 'Alternative Experiential Flow'}`}
          </p>
          {pacingSummary && (
            <p className="text-xs sm:text-sm text-slate-300 mt-2 flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{pacingSummary}</span>
            </p>
          )}
        </div>

        {/* Target Persona Archetype */}
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="md:col-span-5 p-5 rounded-2xl bg-slate-50 flex flex-col justify-between"
        >
          <span className="text-black uppercase tracking-wider text-xs font-mono font-black flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-black" />
            Crafted For This Traveler Persona
          </span>
          <p className="text-xs sm:text-base text-slate-800 leading-snug mt-1.5 italic font-medium">
            &ldquo;{targetPersona || 'For travelers seeking a distinctive counter-rhythm and authentic local surprises.'}&rdquo;
          </p>
          <span className="text-xs text-black font-mono font-extrabold mt-2">
            Alternative Archetype: {alternativeStyle || 'Artisan & Scenic Immersion'}
          </span>
        </div>
      </div>

      {/* Core Narrative / Concept */}
      <div
        style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
        className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl relative z-10 bg-slate-50"
      >
        <h4 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" />
          Blueprint Philosophy &amp; Core Concept
        </h4>
        <p className="text-xs sm:text-base text-slate-800 leading-relaxed font-medium">
          {concept}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="mt-5 sm:mt-6 flex flex-wrap gap-2 pb-3 relative z-10"
      >
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{ border: '1.5px solid #000000' }}
          className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-mono font-extrabold transition-all cursor-pointer flex items-center shadow-2xs ${
            activeTab === 'overview'
              ? 'bg-amber-300 text-black'
              : 'bg-white text-slate-800 hover:bg-slate-100'
          }`}
        >
          Key Contrast &amp; Tradeoffs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dayByDay')}
          style={{ border: '1.5px solid #000000' }}
          className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-mono font-extrabold transition-all cursor-pointer flex items-center shadow-2xs ${
            activeTab === 'dayByDay'
              ? 'bg-amber-300 text-black'
              : 'bg-white text-slate-800 hover:bg-slate-100'
          }`}
        >
          Daily Flow Progression ({quickDayOverview.length} Days)
        </button>
        {secretGems.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('secretGems')}
            style={{ border: '1.5px solid #000000' }}
            className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-mono font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              activeTab === 'secretGems'
                ? 'bg-amber-300 text-black'
                : 'bg-white text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
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
              style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50"
            >
              <h4 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What You Gain in This Blueprint</span>
              </h4>
              <ul className="space-y-2">
                {(whatYouGain.length > 0 ? whatYouGain : keyDifferences).map((gain, idx) => (
                  <li
                    key={idx}
                    style={{ border: '1px solid #000000' }}
                    className="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{gain}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Skip & Trade Off */}
            <div
              style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50"
            >
              <h4 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What You Intentionally Skip &amp; Bypass</span>
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
                    style={{ border: '1px solid #000000' }}
                    className="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-medium"
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
              style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              className="p-4 rounded-2xl bg-slate-50"
            >
              <span className="text-xs font-mono font-black uppercase tracking-wider text-black block mb-2">
                Structural Execution Differences
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {keyDifferences.map((diff, i) => (
                  <div
                    key={i}
                    style={{ border: '1px solid #000000' }}
                    className="text-xs sm:text-sm text-slate-800 p-3 rounded-xl bg-white shadow-2xs leading-relaxed font-medium"
                  >
                    <span className="font-mono font-black text-black mr-1.5">#{i + 1}</span>
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
              style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-start gap-3">
                <span
                  style={{ border: '1.5px solid #000000' }}
                  className="w-9 h-9 rounded-xl bg-amber-300 text-black font-mono font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                >
                  D{d.day}
                </span>
                <div>
                  <h5 className="text-xs sm:text-base font-bold text-slate-950">
                    {d.title || `Day ${d.day} Alternative Trajectory`}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 mt-0.5 leading-relaxed font-medium">
                    {d.focus}
                  </p>
                </div>
              </div>

              {(d.highlightSpot || d.pacingNote) && (
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1 shrink-0 text-xs">
                  {d.highlightSpot && (
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="px-2.5 py-1 rounded-lg text-black bg-amber-100 font-mono font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>{d.highlightSpot}</span>
                    </span>
                  )}
                  {d.pacingNote && (
                    <span className="text-slate-600 text-xs font-medium">
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
              style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
              className="p-4 sm:p-5 rounded-2xl bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    style={{ border: '1px solid #000000' }}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-black bg-amber-100"
                  >
                    {gem.vibeTag || 'Secret Haven'}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <h5 className="text-sm sm:text-base font-bold text-slate-950 font-heading">{gem.name}</h5>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-medium">{gem.whySpecial}</p>
              </div>

              <div
                style={{ borderTop: '1px solid #e2e8f0' }}
                className="mt-3 pt-2.5 flex items-center justify-between text-xs font-medium"
              >
                <span className="text-slate-600">Best For:</span>
                <span className="text-black font-bold">{gem.bestFor}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Comparison Bar */}
      {estimatedCostComparison && (
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
          className="mt-5 sm:mt-6 p-5 rounded-2xl bg-black text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm relative z-10"
        >
          <div className="flex items-center gap-2.5">
            <TrendingDown className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-amber-300 uppercase tracking-wider text-xs block font-mono font-extrabold">
                Alternative Financial Dynamics
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {costImpactType === 'cheaper'
                  ? 'Optimized for smart savings & local vendor pricing'
                  : 'Tailored for boutique bespoke experiences'}
              </span>
            </div>
          </div>
          <span className="font-mono font-black text-amber-300 text-base sm:text-lg">
            {estimatedCostComparison}
          </span>
        </div>
      )}
    </section>
  );
};

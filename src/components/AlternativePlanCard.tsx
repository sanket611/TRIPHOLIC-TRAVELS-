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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 overflow-hidden relative transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="pb-5 sm:pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10"
      >
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="px-3 py-1 rounded-full text-xs font-mono font-extrabold text-black flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              THE COUNTER-PROPOSAL BLUEPRINT
            </span>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="px-3 py-1 rounded-full text-xs font-mono font-extrabold text-black shadow-xs"
            >
              CONTRASTS WITH: {primaryStyle.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading flex items-center gap-2">
            <span className="p-2 rounded-xl bg-black text-amber-300 border border-black shadow-sm shrink-0">
              <Shuffle className="w-5 h-5" />
            </span>
            {title}
          </h2>

          <p className="text-xs sm:text-base text-slate-950 font-bold mt-1">
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
            style={{
              border: '1.5px solid #000000',
            }}
            className={`w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md active:scale-98 ${
              isAdopting
                ? 'bg-slate-500 cursor-not-allowed'
                : 'bg-black hover:bg-slate-900 active:bg-slate-950'
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
          style={{
            border: '1.5px solid #000000',
          }}
          className="md:col-span-7 p-5 rounded-2xl bg-black text-white flex flex-col justify-between shadow-md"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-200 font-mono uppercase tracking-wider text-xs font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-300" />
              Paradigm Shift Dynamic
            </span>
            <span
              style={{
                border: '1px solid #ffffff',
              }}
              className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-extrabold"
            >
              {energyLevel}
            </span>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-amber-300 font-mono">
            {vibeShift || `${primaryStyle} ➔ ${alternativeStyle || 'Alternative Experiential Flow'}`}
          </p>
          {pacingSummary && (
            <p className="text-xs sm:text-sm text-slate-200 mt-2 font-mono flex items-center gap-1.5 font-bold">
              <Clock className="w-4 h-4 text-slate-300 shrink-0" />
              <span>{pacingSummary}</span>
            </p>
          )}
        </div>

        {/* Target Persona Archetype */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.90)',
            border: '1.5px solid #000000',
          }}
          className="md:col-span-5 p-5 rounded-2xl flex flex-col justify-between shadow-sm"
        >
          <span className="text-black font-mono uppercase tracking-wider text-xs font-extrabold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-black" />
            Crafted For This Traveler Persona
          </span>
          <p className="text-xs sm:text-base text-black font-bold leading-snug mt-1.5 italic">
            "{targetPersona || 'For travelers seeking a distinctive counter-rhythm and authentic local surprises.'}"
          </p>
          <span className="text-xs font-mono text-black font-extrabold mt-2">
            Alternative Archetype: {alternativeStyle || 'Artisan & Scenic Immersion'}
          </span>
        </div>
      </div>

      {/* Core Narrative / Concept */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.90)',
          border: '1.5px solid #000000',
        }}
        className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl relative z-10 shadow-sm"
      >
        <h4 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" />
          Blueprint Philosophy & Core Concept
        </h4>
        <p className="text-xs sm:text-base text-black leading-relaxed font-bold">
          {concept}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="mt-5 sm:mt-6 flex flex-wrap gap-2 pb-3 relative z-10"
      >
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{
            border: '1.5px solid #000000',
          }}
          className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-mono font-extrabold transition-all cursor-pointer flex items-center shadow-xs ${
            activeTab === 'overview'
              ? 'bg-black text-white'
              : 'bg-white/90 text-black hover:bg-black hover:text-white'
          }`}
        >
          Key Contrast & Tradeoffs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dayByDay')}
          style={{
            border: '1.5px solid #000000',
          }}
          className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-mono font-extrabold transition-all cursor-pointer flex items-center shadow-xs ${
            activeTab === 'dayByDay'
              ? 'bg-black text-white'
              : 'bg-white/90 text-black hover:bg-black hover:text-white'
          }`}
        >
          Daily Flow Progression ({quickDayOverview.length} Days)
        </button>
        {secretGems.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('secretGems')}
            style={{
              border: '1.5px solid #000000',
            }}
            className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-mono font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              activeTab === 'secretGems'
                ? 'bg-black text-white'
                : 'bg-white/90 text-black hover:bg-black hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-4 sm:p-5 rounded-2xl shadow-sm"
            >
              <h4 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>What You Gain in This Blueprint</span>
              </h4>
              <ul className="space-y-2">
                {(whatYouGain.length > 0 ? whatYouGain : keyDifferences).map((gain, idx) => (
                  <li
                    key={idx}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="text-xs sm:text-sm text-black bg-white p-3 rounded-xl flex items-start gap-2 shadow-xs leading-relaxed font-bold"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{gain}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Skip & Trade Off */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-4 sm:p-5 rounded-2xl shadow-sm"
            >
              <h4 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-700" />
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
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="text-xs sm:text-sm text-black bg-white p-3 rounded-xl flex items-start gap-2 shadow-xs leading-relaxed font-bold"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                    <span>{skip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Differences Bulletins */}
          {keyDifferences.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-4 rounded-2xl shadow-sm"
            >
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-black block mb-2">
                Structural Execution Differences
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {keyDifferences.map((diff, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="text-xs sm:text-sm text-black p-3 rounded-xl bg-white leading-relaxed font-bold"
                  >
                    <span className="font-mono font-extrabold text-black mr-1.5">#{i + 1}</span>
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
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <span
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="w-9 h-9 rounded-xl bg-black text-white font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                >
                  D{d.day}
                </span>
                <div>
                  <h5 className="text-xs sm:text-base font-extrabold text-black font-mono">
                    {d.title || `Day ${d.day} Alternative Trajectory`}
                  </h5>
                  <p className="text-xs sm:text-sm text-black mt-0.5 leading-relaxed font-bold">
                    {d.focus}
                  </p>
                </div>
              </div>

              {(d.highlightSpot || d.pacingNote) && (
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1 shrink-0 text-xs font-mono">
                  {d.highlightSpot && (
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="px-2.5 py-1 rounded-lg text-black font-extrabold flex items-center gap-1 shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>{d.highlightSpot}</span>
                    </span>
                  )}
                  {d.pacingNote && (
                    <span className="text-black text-xs font-extrabold">
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
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-4 sm:p-5 rounded-2xl flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid #000000',
                    }}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold text-black"
                  >
                    {gem.vibeTag || 'Secret Haven'}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <h5 className="text-sm sm:text-base font-extrabold text-black font-heading">{gem.name}</h5>
                <p className="text-xs sm:text-sm text-black mt-1 leading-relaxed font-bold">{gem.whySpecial}</p>
              </div>

              <div
                style={{
                  borderTop: '1.5px solid #000000',
                }}
                className="mt-3 pt-2.5 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-black font-extrabold">Best For:</span>
                <span className="text-black font-bold">{gem.bestFor}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Comparison Bar */}
      {estimatedCostComparison && (
        <div
          style={{
            border: '1.5px solid #000000',
          }}
          className="mt-5 sm:mt-6 p-5 rounded-2xl bg-black text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm relative z-10 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <TrendingDown className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-mono text-slate-200 uppercase tracking-wider text-xs block font-bold">
                Alternative Financial Dynamics
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {costImpactType === 'cheaper'
                  ? 'Optimized for smart savings & local vendor pricing'
                  : 'Tailored for boutique bespoke experiences'}
              </span>
            </div>
          </div>
          <span className="font-mono font-extrabold text-amber-300 text-base sm:text-lg">
            {estimatedCostComparison}
          </span>
        </div>
      )}
    </section>
  );
};

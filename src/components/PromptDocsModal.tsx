import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, XCircle, Sparkles, Copy, Check } from 'lucide-react';

interface PromptDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptDocsModal: React.FC<PromptDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'iterations' | 'comparison' | 'architecture'>('iterations');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const version3Text = `### ROLE
You are an expert personal travel planner who creates realistic, personalized, and budget-conscious travel itineraries.

### CONTEXT
The user wants a personalized travel plan based on:
- Destination: {destination}
- Duration: {duration} days
- Total Budget: {currency} {budget}
- Number of Travelers: {travelers}
- Travel Style: {travelStyle}
- Interests & Preferences: {interests}
- Food Preference: {foodPreference}
{notes}

### CONSTRAINTS & TRAVEL PLANNING RULES
1. Respect the user's budget ({currency} {budget}) as much as reasonably possible for {travelers} traveler(s).
2. Account for the number of travelers in accommodation, food, and ticket calculations.
3. Strictly respect dietary preference ({foodPreference}) in all food and dining recommendations.
4. Reflect the selected travel style ({travelStyle}) and user interests.
5. Avoid unrealistic schedules: Maximum 3 distinct well-spaced time blocks per day (Morning, Afternoon, Evening).
6. Avoid excessive travel between distant locations on the same day: Group activities geographically.
7. Avoid scheduling too many activities in one day to allow for leisure and dining.
8. Clearly label costs as estimates rather than exact prices.
9. Never claim real-time availability or confirmed bookings.
10. Advise users to verify uncertain or time-sensitive information.

### REQUIRED JSON STRUCTURE
{
  "tripSummary": { "destination": "", "duration": 0, "travelers": 0, "budgetFormatted": "", "travelStyle": "", "foodPreference": "", "summary": "", "highlights": [], "bestSeason": "", "tripVibe": "" },
  "itinerary": [
    { "day": 1, "title": "", "theme": "", "stayArea": "", "morning": { "time": "", "activity": "", "place": "", "description": "", "estCost": "" }, "afternoon": { ... }, "evening": { ... }, "travelNotes": "" }
  ],
  "recommendedPlaces": [ { "name": "", "tag": "", "description": "", "whySuitable": "", "bestTimeToVisit": "", "estimatedEntryFee": "", "locationArea": "" } ],
  "foodRecommendations": { "preferenceNote": "", "breakfast": [], "lunch": [], "dinner": [], "localSpecialties": [] },
  "budget": { "currency": "", "userBudget": 0, "estimatedTotal": 0, "breakdown": { "accommodation": 0, "food": 0, "transportation": 0, "activities": 0, "miscellaneous": 0 }, "budgetStatus": "", "budgetNote": "", "costSavingTips": [], "optionalSplurges": [] },
  "travelTips": { "bestTimeToVisit": "", "localTransportation": [], "packingList": [], "safetyTips": [], "bookingSuggestions": [], "localEtiquette": [] },
  "alternativePlan": { "title": "", "concept": "", "keyDifferences": [], "quickDayOverview": [], "estimatedCostComparison": "" }
}`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(version3Text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold leading-tight">AI Prompt Documentation</h3>
              <p className="text-[11px] sm:text-xs text-slate-300">
                Academic Mini-Project Prompt Iteration History
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-3 sm:px-6 pt-2 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('iterations')}
            className={`px-3 py-2 min-h-[40px] text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'iterations'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3 Prompt Iterations
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-2 min-h-[40px] text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Comparative Matrix
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 min-h-[40px] text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Schema & Delta Architecture
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
          {activeTab === 'iterations' && (
            <div className="space-y-5">
              {/* Version 1 */}
              <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-800 rounded border border-rose-200">
                    V1 (NAIVE BASELINE)
                  </span>
                  <span className="text-xs font-mono font-semibold text-rose-700 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> FLAWED & UNPREDICTABLE
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-rose-200 font-mono text-xs text-slate-800 mb-3 shadow-2xs">
                  "Plan my trip to Goa."
                </div>
                <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
                  <p className="font-bold text-rose-900 font-heading">Why Version 1 is Insufficient:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>No Duration:</strong> LLM guesses arbitrary 3 or 5 days without temporal boundaries.</li>
                    <li><strong>No Budget Constraint:</strong> Mixes $500 luxury yacht clubs with ₹50 street stalls indiscriminately.</li>
                    <li><strong>No Dietary or Preference Awareness:</strong> Fails to respect vegetarian/vegan needs or travel styles.</li>
                    <li><strong>Unparseable Output:</strong> Returns arbitrary prose paragraphs with unpredictable headings that break programmatic frontend rendering.</li>
                  </ul>
                </div>
              </div>

              {/* Version 2 */}
              <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded border border-amber-200">
                    V2 (PARAMETRIC PROMPT)
                  </span>
                  <span className="text-xs font-mono font-semibold text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> PARTIALLY FUNCTIONAL
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200 font-mono text-xs text-slate-800 mb-3 shadow-2xs">
                  "Plan a 4-day Goa trip for 2 people with a ₹20,000 budget. Include places, food, and activities."
                </div>
                <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
                  <p className="font-bold text-amber-900 font-heading">Improvements & Remaining Gaps:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong className="text-emerald-700">✓ Improvements:</strong> Added explicit duration (4 days), group size (2 travelers), and budget ceiling (₹20,000).</li>
                    <li><strong className="text-rose-700">✗ Remaining Gaps:</strong> Over-schedules activities (e.g. 8 spots per day with impossible travel distances); output formatting is still fragile text/tables; lacks alternative contingency plans and categorized budget math.</li>
                  </ul>
                </div>
              </div>

              {/* Version 3 */}
              <div className="p-5 rounded-xl border border-emerald-300 bg-emerald-50/20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                    V3 (PRODUCTION SPECIFICATION)
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DETERMINISTIC JSON SCHEMA
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-emerald-900 font-bold font-heading">
                    Complete Structured System Prompt (Role + Context + Rules + JSON Schema)
                  </p>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
                  {version3Text}
                </pre>
                <div className="mt-3 text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-emerald-950 font-heading">Why Version 3 Succeeds:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-1">
                    <li><strong>Deterministic JSON Hydration:</strong> Guaranteed parseable structure matching TypeScript interfaces.</li>
                    <li><strong>Geographical Clustering:</strong> Enforces morning/afternoon/evening slots grouped by zone, preventing unrealistic travel.</li>
                    <li><strong>Mathematical Financial Balance:</strong> Categorizes accommodation, food, transport, activities, and misc within the user budget.</li>
                    <li><strong>100% Dietary Compliance:</strong> Prevents non-veg suggestions on vegetarian/vegan trips.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Evaluation Matrix Across Iterations
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-mono text-[11px] font-bold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Evaluation Criteria</th>
                      <th className="p-3">Version 1 (Naive)</th>
                      <th className="p-3">Version 2 (Parametric)</th>
                      <th className="p-3 text-slate-900 bg-indigo-50/60">Version 3 (Tripholic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">Output Structure</td>
                      <td className="p-3 text-rose-600">❌ Free-form unstructured prose</td>
                      <td className="p-3 text-amber-600">⚠️ Mixed Markdown tables</td>
                      <td className="p-3 text-emerald-700 font-bold bg-indigo-50/20 font-mono">✅ Validated JSON Schema</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Budget Adherence</td>
                      <td className="p-3 text-rose-600">❌ None (hallucinated)</td>
                      <td className="p-3 text-amber-600">⚠️ Single total estimate</td>
                      <td className="p-3 text-emerald-700 font-bold bg-indigo-50/20 font-mono">✅ 5-Category Math + Buffer</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Dietary Compliance</td>
                      <td className="p-3 text-rose-600">❌ Random / Unchecked</td>
                      <td className="p-3 text-amber-600">⚠️ Generic suggestions</td>
                      <td className="p-3 text-emerald-700 font-bold bg-indigo-50/20 font-mono">✅ 100% Strict Filtering</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Schedule Realism</td>
                      <td className="p-3 text-rose-600">❌ Impossible cross-city rush</td>
                      <td className="p-3 text-amber-600">⚠️ Overcrowded activities</td>
                      <td className="p-3 text-emerald-700 font-bold bg-indigo-50/20 font-mono">✅ Morning/Aft/Eve Clusters</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Modifiability</td>
                      <td className="p-3 text-rose-600">❌ Full regeneration only</td>
                      <td className="p-3 text-rose-600">❌ Full regeneration only</td>
                      <td className="p-3 text-emerald-700 font-bold bg-indigo-50/20 font-mono">✅ Delta & Targeted Updates</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Modify & Regenerate Delta Prompting Architecture
              </h4>
              <p>
                When a user requests a modification (e.g. <em>"Make Day 2 more adventurous"</em> or <em>"Reduce budget by 30%"</em>), Tripholic executes a stateful context injection:
              </p>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 border border-slate-800">
                <p className="text-amber-300">1. Current Plan State Serialization: JSON.stringify(currentPlan)</p>
                <p className="text-sky-300">2. Delta Prompt Construction: Inject existing days + targeted modification rule</p>
                <p className="text-emerald-300">3. Schema Validation & Safe UI Patching</p>
              </div>
              <p>
                This ensures that days that did not require changes remain consistent and unchanged, preserving the traveler's preferred bookings while updating only the target segment.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

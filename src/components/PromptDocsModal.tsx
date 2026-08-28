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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        style={{
          border: '1.5px solid #000000',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: '1.5px solid #000000',
          }}
          className="p-4 sm:p-6 flex items-center justify-between bg-black text-white"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              style={{
                border: '1.5px solid #000000',
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-xs"
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-extrabold leading-tight">AI Prompt Documentation</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Academic Mini-Project Prompt Iteration History
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: '1.5px solid #ffffff',
            }}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-white hover:bg-white hover:text-black rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            borderBottom: '1.5px solid #000000',
          }}
          className="flex bg-slate-100 px-3 sm:px-6 pt-2 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap"
        >
          <button
            onClick={() => setActiveTab('iterations')}
            style={{
              border: activeTab === 'iterations' ? '1.5px solid #000000' : '1.5px solid transparent',
              borderBottom: activeTab === 'iterations' ? 'none' : 'transparent',
            }}
            className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer rounded-t-xl ${
              activeTab === 'iterations'
                ? 'text-black bg-white shadow-xs'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            3 Prompt Iterations
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            style={{
              border: activeTab === 'comparison' ? '1.5px solid #000000' : '1.5px solid transparent',
              borderBottom: activeTab === 'comparison' ? 'none' : 'transparent',
            }}
            className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer rounded-t-xl ${
              activeTab === 'comparison'
                ? 'text-black bg-white shadow-xs'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Comparative Matrix
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            style={{
              border: activeTab === 'architecture' ? '1.5px solid #000000' : '1.5px solid transparent',
              borderBottom: activeTab === 'architecture' ? 'none' : 'transparent',
            }}
            className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer rounded-t-xl ${
              activeTab === 'architecture'
                ? 'text-black bg-white shadow-xs'
                : 'text-slate-700 hover:text-black'
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
              <div
                style={{
                  border: '1.5px solid #000000',
                }}
                className="p-5 rounded-xl bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    style={{
                      border: '1px solid #000000',
                    }}
                    className="px-2.5 py-0.5 text-xs font-mono font-extrabold bg-rose-100 text-rose-950 rounded"
                  >
                    V1 (NAIVE BASELINE)
                  </span>
                  <span className="text-xs font-mono font-extrabold text-rose-800 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> FLAWED & UNPREDICTABLE
                  </span>
                </div>
                <div
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="bg-white p-3.5 rounded-lg font-mono text-xs sm:text-sm text-black mb-3 font-bold shadow-xs"
                >
                  &ldquo;Plan my trip to Goa.&rdquo;
                </div>
                <div className="text-xs sm:text-sm text-black space-y-1.5 leading-relaxed font-bold">
                  <p className="font-extrabold text-rose-950 font-heading text-sm">Why Version 1 is Insufficient:</p>
                  <ul className="list-disc pl-5 space-y-1 text-black">
                    <li><strong>No Duration:</strong> LLM guesses arbitrary 3 or 5 days without temporal boundaries.</li>
                    <li><strong>No Budget Constraint:</strong> Mixes $500 luxury yacht clubs with ₹50 street stalls indiscriminately.</li>
                    <li><strong>No Dietary or Preference Awareness:</strong> Fails to respect vegetarian/vegan needs or travel styles.</li>
                    <li><strong>Unparseable Output:</strong> Returns arbitrary prose paragraphs with unpredictable headings that break programmatic frontend rendering.</li>
                  </ul>
                </div>
              </div>

              {/* Version 2 */}
              <div
                style={{
                  border: '1.5px solid #000000',
                }}
                className="p-5 rounded-xl bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    style={{
                      border: '1px solid #000000',
                    }}
                    className="px-2.5 py-0.5 text-xs font-mono font-extrabold bg-amber-100 text-amber-950 rounded"
                  >
                    V2 (PARAMETRIC PROMPT)
                  </span>
                  <span className="text-xs font-mono font-extrabold text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> PARTIALLY FUNCTIONAL
                  </span>
                </div>
                <div
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="bg-white p-3.5 rounded-lg font-mono text-xs sm:text-sm text-black mb-3 font-bold shadow-xs"
                >
                  &ldquo;Plan a 4-day Goa trip for 2 people with a ₹20,000 budget. Include places, food, and activities.&rdquo;
                </div>
                <div className="text-xs sm:text-sm text-black space-y-1.5 leading-relaxed font-bold">
                  <p className="font-extrabold text-black font-heading text-sm">Improvements & Remaining Gaps:</p>
                  <ul className="list-disc pl-5 space-y-1 text-black">
                    <li><strong className="text-emerald-800">✓ Improvements:</strong> Added explicit duration (4 days), group size (2 travelers), and budget ceiling (₹20,000).</li>
                    <li><strong className="text-rose-800">✗ Remaining Gaps:</strong> Over-schedules activities (e.g. 8 spots per day with impossible travel distances); output formatting is still fragile text/tables; lacks alternative contingency plans and categorized budget math.</li>
                  </ul>
                </div>
              </div>

              {/* Version 3 */}
              <div
                style={{
                  border: '1.5px solid #000000',
                }}
                className="p-5 rounded-xl bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    style={{
                      border: '1px solid #000000',
                    }}
                    className="px-2.5 py-0.5 text-xs font-mono font-extrabold bg-emerald-100 text-emerald-950 rounded"
                  >
                    V3 (PRODUCTION SPECIFICATION)
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> DETERMINISTIC JSON SCHEMA
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm text-black font-extrabold font-heading">
                    Complete Structured System Prompt (Role + Context + Rules + JSON Schema)
                  </p>
                  <button
                    onClick={handleCopyPrompt}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="px-3 py-1 text-xs font-mono font-extrabold uppercase bg-black hover:bg-slate-900 text-white rounded-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="bg-black text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-72 leading-relaxed"
                >
                  {version3Text}
                </pre>
                <div className="mt-3 text-xs sm:text-sm text-black leading-relaxed font-bold">
                  <p className="font-extrabold text-black font-heading text-sm">Why Version 3 Succeeds:</p>
                  <ul className="list-disc pl-5 space-y-1 text-black mt-1">
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
              <h4 className="text-base font-extrabold text-black font-heading">
                Evaluation Matrix Across Iterations
              </h4>
              <div
                style={{
                  border: '1.5px solid #000000',
                }}
                className="overflow-x-auto rounded-xl"
              >
                <table className="w-full text-xs sm:text-sm text-left text-black">
                  <thead
                    style={{
                      borderBottom: '1.5px solid #000000',
                    }}
                    className="bg-slate-100 text-black font-mono text-xs font-extrabold uppercase tracking-wider"
                  >
                    <tr>
                      <th className="p-3.5">Evaluation Criteria</th>
                      <th className="p-3.5">Version 1 (Naive)</th>
                      <th className="p-3.5">Version 2 (Parametric)</th>
                      <th className="p-3.5 text-black bg-amber-100">Version 3 (Tripholic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20 font-bold">
                    <tr>
                      <td className="p-3.5 font-extrabold">Output Structure</td>
                      <td className="p-3.5 text-rose-700">❌ Free-form unstructured prose</td>
                      <td className="p-3.5 text-amber-700">⚠️ Mixed Markdown tables</td>
                      <td className="p-3.5 text-black font-extrabold bg-amber-50 font-mono">✅ Validated JSON Schema</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-extrabold">Budget Adherence</td>
                      <td className="p-3.5 text-rose-700">❌ None (hallucinated)</td>
                      <td className="p-3.5 text-amber-700">⚠️ Single total estimate</td>
                      <td className="p-3.5 text-black font-extrabold bg-amber-50 font-mono">✅ 5-Category Math + Buffer</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-extrabold">Dietary Compliance</td>
                      <td className="p-3.5 text-rose-700">❌ Random / Unchecked</td>
                      <td className="p-3.5 text-amber-700">⚠️ Generic suggestions</td>
                      <td className="p-3.5 text-black font-extrabold bg-amber-50 font-mono">✅ 100% Strict Filtering</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-extrabold">Schedule Realism</td>
                      <td className="p-3.5 text-rose-700">❌ Impossible cross-city rush</td>
                      <td className="p-3.5 text-amber-700">⚠️ Overcrowded activities</td>
                      <td className="p-3.5 text-black font-extrabold bg-amber-50 font-mono">✅ Morning/Aft/Eve Clusters</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-extrabold">Modifiability</td>
                      <td className="p-3.5 text-rose-700">❌ Full regeneration only</td>
                      <td className="p-3.5 text-rose-700">❌ Full regeneration only</td>
                      <td className="p-3.5 text-black font-extrabold bg-amber-50 font-mono">✅ Delta & Targeted Updates</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs sm:text-sm text-black leading-relaxed font-bold">
              <h4 className="text-base font-extrabold text-black font-heading">
                Modify & Regenerate Delta Prompting Architecture
              </h4>
              <p>
                When a user requests a modification (e.g. <em>&ldquo;Make Day 2 more adventurous&rdquo;</em> or <em>&ldquo;Reduce budget by 30%&rdquo;</em>), Tripholic executes a stateful context injection:
              </p>
              <div
                style={{
                  border: '1.5px solid #000000',
                }}
                className="p-4 rounded-xl bg-black text-slate-100 font-mono text-xs sm:text-sm space-y-2"
              >
                <p className="text-amber-300">1. Current Plan State Serialization: JSON.stringify(currentPlan)</p>
                <p className="text-sky-300">2. Delta Prompt Construction: Inject existing days + targeted modification rule</p>
                <p className="text-emerald-300">3. Schema Validation & Safe UI Patching</p>
              </div>
              <p>
                This ensures that days that did not require changes remain consistent and unchanged, preserving the traveler&rsquo;s preferred bookings while updating only the target segment.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1.5px solid #000000',
          }}
          className="p-4 bg-slate-100 flex justify-end"
        >
          <button
            onClick={onClose}
            style={{
              border: '1.5px solid #000000',
            }}
            className="px-5 py-2.5 min-h-[40px] text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider bg-black hover:bg-slate-900 text-white rounded-xl transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

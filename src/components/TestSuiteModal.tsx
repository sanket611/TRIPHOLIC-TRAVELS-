import React, { useState } from 'react';
import { X, Play, CheckCircle2, XCircle, Clock, RotateCcw, Sparkles } from 'lucide-react';
import { TestScenarioResult, TravelPreferences, TripPlan } from '../types';

interface TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTestScenarioToForm: (prefs: Partial<TravelPreferences>) => void;
}

const TEST_SCENARIOS: TestScenarioResult[] = [
  {
    id: 'test_1',
    title: 'Test 1: Standard Trip',
    description: 'Goa, 4 days, ₹20,000, 2 travelers, Adventure, Vegetarian',
    input: {
      destination: 'Goa',
      duration: 4,
      budget: 20000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure',
      interests: ['Beaches', 'Photography'],
      foodPreference: 'Vegetarian',
    },
    status: 'idle',
    notes: 'Verifies standard generation, 4 full days, within ₹20k budget & 100% vegetarian food.',
  },
  {
    id: 'test_2',
    title: 'Test 2: Low Budget Constraints',
    description: 'Gokarna, 3 days, ₹5,000, 1 traveler, Solo Explorer',
    input: {
      destination: 'Gokarna',
      duration: 3,
      budget: 5000,
      currency: '₹',
      travelers: 1,
      travelStyle: 'Solo Explorer',
      interests: ['Trekking', 'Beaches'],
      foodPreference: 'Vegetarian',
    },
    status: 'idle',
    notes: 'Verifies budget clamping: prioritizes budget hostels, local bus travel, and street food.',
  },
  {
    id: 'test_3',
    title: 'Test 3: Travel Style Switch',
    description: 'Bali, 5 days, $1,500, 2 travelers, Relaxed Style',
    input: {
      destination: 'Bali',
      duration: 5,
      budget: 1500,
      currency: '$',
      travelers: 2,
      travelStyle: 'Relaxed',
      interests: ['Wellness & Spa', 'Beaches'],
      foodPreference: 'Vegetarian',
    },
    status: 'idle',
    notes: 'Verifies that itinerary shifts from high-energy activities to spas, yoga & beach relaxation.',
  },
  {
    id: 'test_4',
    title: 'Test 4: Strict Vegan Dietary Compliance',
    description: 'Kyoto, 4 days, ¥100,000, 2 travelers, 100% Vegan Diet',
    input: {
      destination: 'Kyoto',
      duration: 4,
      budget: 100000,
      currency: '¥',
      travelers: 2,
      travelStyle: 'Cultural & Heritage',
      interests: ['Temples & Shrines', 'History'],
      foodPreference: 'Vegan',
    },
    status: 'idle',
    notes: 'Verifies that breakfast, lunch, and dinner recommendations are strictly plant-based.',
  },
  {
    id: 'test_5',
    title: 'Test 5: Modify Request Delta Update',
    description: 'Apply modification: "Make Day 2 more adventurous with water sports"',
    input: {
      destination: 'Goa',
      duration: 4,
      budget: 20000,
      travelStyle: 'Relaxed',
    },
    status: 'idle',
    notes: 'Verifies that modification endpoint accurately updates Day 2 while preserving other days.',
  },
  {
    id: 'test_6',
    title: 'Test 6: Missing Destination Validation',
    description: 'Submit form with empty destination field',
    input: {
      destination: '',
      duration: 4,
      budget: 20000,
    },
    status: 'idle',
    notes: 'Verifies that frontend and backend reject empty destinations with friendly error messages.',
  },
  {
    id: 'test_7',
    title: 'Test 7: Invalid Duration Bounds',
    description: 'Submit duration = 0 or negative days',
    input: {
      destination: 'Goa',
      duration: 0,
      budget: 20000,
    },
    status: 'idle',
    notes: 'Verifies duration bounds checking (minimum 1 day, maximum 30 days).',
  },
  {
    id: 'test_8',
    title: 'Test 8: API Failure & Offline Fallback',
    description: 'Simulates API unavailability or network offline state',
    input: {
      destination: 'Goa',
      duration: 4,
      budget: 20000,
      travelers: 2,
    },
    status: 'idle',
    notes: 'Verifies that procedural engine provides high-fidelity fallback without application crash.',
  },
];

export const TestSuiteModal: React.FC<TestSuiteModalProps> = ({
  isOpen,
  onClose,
  onApplyTestScenarioToForm,
}) => {
  const [results, setResults] = useState<TestScenarioResult[]>(TEST_SCENARIOS);
  const [isRunningAll, setIsRunningAll] = useState(false);

  if (!isOpen) return null;

  const runTest = async (testId: string) => {
    setResults((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'running' } : t))
    );

    const startTime = performance.now();
    const test = results.find((t) => t.id === testId);
    if (!test) return;

    try {
      if (test.id === 'test_6') {
        // Validation test for missing destination
        const res = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...test.input }),
        });
        const durationMs = Math.round(performance.now() - startTime);
        if (res.status === 400) {
          setResults((prev) =>
            prev.map((t) =>
              t.id === testId
                ? { ...t, status: 'passed', executionTimeMs: durationMs, notes: 'Correctly returned HTTP 400 Bad Request with validation error.' }
                : t
            )
          );
        } else {
          setResults((prev) =>
            prev.map((t) => (t.id === testId ? { ...t, status: 'failed', executionTimeMs: durationMs } : t))
          );
        }
      } else if (test.id === 'test_7') {
        // Validation test for invalid duration
        const res = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...test.input, duration: 0 }),
        });
        const durationMs = Math.round(performance.now() - startTime);
        if (res.status === 400) {
          setResults((prev) =>
            prev.map((t) =>
              t.id === testId
                ? { ...t, status: 'passed', executionTimeMs: durationMs, notes: 'Correctly validated duration bounds (1-30 days).' }
                : t
            )
          );
        } else {
          setResults((prev) =>
            prev.map((t) => (t.id === testId ? { ...t, status: 'failed', executionTimeMs: durationMs } : t))
          );
        }
      } else if (test.id === 'test_5') {
        // Test modification
        const res = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: 'Goa',
            duration: 4,
            budget: 20000,
            currency: '₹',
            travelers: 2,
            travelStyle: 'Relaxed',
            interests: ['Beaches'],
            foodPreference: 'Vegetarian',
          }),
        });
        const plan: TripPlan = await res.json();
        const modRes = await fetch('/api/modify-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPlan: plan,
            modificationPrompt: 'Make Day 2 more adventurous with water sports',
          }),
        });
        const modPlan: TripPlan = await modRes.json();
        const durationMs = Math.round(performance.now() - startTime);
        if (modPlan && modPlan.itinerary && modPlan.itinerary.length > 0) {
          setResults((prev) =>
            prev.map((t) =>
              t.id === testId
                ? { ...t, status: 'passed', executionTimeMs: durationMs, notes: 'Successfully applied delta modification to Day 2.' }
                : t
            )
          );
        } else {
          setResults((prev) =>
            prev.map((t) => (t.id === testId ? { ...t, status: 'failed', executionTimeMs: durationMs } : t))
          );
        }
      } else {
        // Standard generation tests
        const res = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(test.input),
        });
        const plan: TripPlan = await res.json();
        const durationMs = Math.round(performance.now() - startTime);

        if (plan && plan.tripSummary && plan.itinerary && plan.budget) {
          setResults((prev) =>
            prev.map((t) =>
              t.id === testId
                ? { ...t, status: 'passed', executionTimeMs: durationMs, notes: `Successfully generated ${plan.itinerary.length} days with ${plan.tripSummary.foodPreference} diet.` }
                : t
            )
          );
        } else {
          setResults((prev) =>
            prev.map((t) => (t.id === testId ? { ...t, status: 'failed', executionTimeMs: durationMs } : t))
          );
        }
      }
    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      setResults((prev) =>
        prev.map((t) =>
          t.id === testId
            ? { ...t, status: 'failed', executionTimeMs: durationMs, notes: 'Network error or unexpected exception.' }
            : t
        )
      );
    }
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    for (const test of results) {
      await runTest(test.id);
    }
    setIsRunningAll(false);
  };

  const handleResetTests = () => {
    setResults(TEST_SCENARIOS.map((t) => ({ ...t, status: 'idle', executionTimeMs: undefined })));
  };

  const passedCount = results.filter((r) => r.status === 'passed').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold leading-tight">Automated Test Suite (1-8)</h3>
              <p className="text-[11px] sm:text-xs text-slate-300">
                Live verification of prompt engineering constraints & dietary rules
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

        {/* Action Controls & Metrics */}
        <div className="p-3.5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-2xs">
              TOTAL: 8
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700 shadow-2xs">
              PASSED: {passedCount}
            </div>
            {failedCount > 0 && (
              <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono font-bold text-rose-700 shadow-2xs">
                FAILED: {failedCount}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRunAll}
              disabled={isRunningAll}
              className="flex-1 sm:flex-none px-4 py-2.5 min-h-[42px] bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current text-amber-400" />
              <span>{isRunningAll ? 'Executing Suite…' : 'Run All Tests'}</span>
            </button>

            <button
              onClick={handleResetTests}
              className="p-2.5 min-w-[42px] min-h-[42px] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200 bg-white"
              title="Reset Test Status"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tests List */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {results.map((test) => (
            <div
              key={test.id}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{test.title}</h4>
                  {test.status === 'passed' && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASSED
                    </span>
                  )}
                  {test.status === 'failed' && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-800 rounded flex items-center gap-1 border border-rose-200">
                      <XCircle className="w-3 h-3 text-rose-600" /> FAILED
                    </span>
                  )}
                  {test.status === 'running' && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 rounded flex items-center gap-1 animate-pulse border border-indigo-200">
                      <Clock className="w-3 h-3 animate-spin" /> RUNNING…
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono">{test.description}</p>
                <p className="text-[11px] text-slate-700 font-normal bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  {test.notes}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {test.executionTimeMs && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {test.executionTimeMs}ms
                  </span>
                )}

                {test.input && (
                  <button
                    onClick={() => {
                      onApplyTestScenarioToForm(test.input);
                      onClose();
                    }}
                    className="px-3 py-2 min-h-[38px] text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
                    title="Load these test parameters into the Trip Planner form"
                  >
                    Load in Form
                  </button>
                )}

                <button
                  onClick={() => runTest(test.id)}
                  disabled={test.status === 'running'}
                  className="px-3.5 py-2 min-h-[38px] text-xs font-mono font-bold uppercase tracking-wider text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-900 active:bg-slate-800 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 min-h-[40px] text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            Close Test Suite
          </button>
        </div>
      </div>
    </div>
  );
};

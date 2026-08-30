import React, { useState } from 'react';
import { Edit3, Sparkles, Send, History, Check, AlertCircle } from 'lucide-react';
import { TripPlan } from '../types';

interface ModifyTripProps {
  currentPlan: TripPlan;
  onModify: (modificationPrompt: string) => void;
  isModifying: boolean;
}

const PRESET_MODIFICATIONS = [
  'Make Day 2 more adventurous.',
  'Reduce the budget by 30%.',
  'Make this trip cheaper with budget stays.',
  'Add more beaches and sunset viewpoints.',
  'Make the trip suitable for children & family.',
  'Provide more vegetarian street food options.',
  'Make the itinerary more relaxed and slow-paced.',
  'Replace Day 3 with cultural heritage & artisan walks.',
  'Remove shopping and focus on nature trails.',
];

export const ModifyTrip: React.FC<ModifyTripProps> = ({
  currentPlan,
  onModify,
  isModifying,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) {
      setError('Please enter what you would like to modify.');
      return;
    }
    setError('');
    onModify(promptInput.trim());
    setPromptInput('');
  };

  const handleSelectPreset = (preset: string) => {
    setPromptInput(preset);
    setError('');
  };

  const history = currentPlan.modificationHistory || [];

  return (
    <section
      id="modify-trip-section"
      className="rounded-3xl p-5 sm:p-8 mb-8 relative overflow-hidden transition-all bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div
        className="pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Edit3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Modify Your Trip
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-600 font-normal">
            Instruct AI to adjust specific days, tweak budget targets, swap activities, or alter dining preferences.
          </p>
        </div>

        {history.length > 0 && (
          <span
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span>{history.length} {history.length === 1 ? 'MODIFICATION' : 'MODIFICATIONS'}</span>
          </span>
        )}
      </div>

      {/* Preset Quick Chips */}
      <div className="mt-4 sm:mt-5">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
          Quick Suggestion Presets
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESET_MODIFICATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-3.5 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200/90 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 active:scale-98 transition-all cursor-pointer text-left shadow-2xs"
            >
              ▪ {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3">
        <div className="relative">
          <textarea
            id="modify-trip-input"
            rows={3}
            value={promptInput}
            onChange={(e) => {
              setPromptInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. 'Make Day 2 more adventurous with water sports', 'Reduce the budget by 30%', 'Add more scenic spots'..."
            className={`w-full p-4 rounded-xl text-slate-900 bg-white border border-slate-300 font-normal placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-base sm:text-sm shadow-2xs ${
              error
                ? 'border-rose-500 focus:ring-rose-200'
                : ''
            }`}
          />
        </div>

        {error && (
          <p className="text-xs sm:text-sm text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 sm:pt-2">
          <p className="text-xs sm:text-sm text-slate-500 font-normal text-center sm:text-left">
            Tripholic updates target parameters while preserving unaffected schedule points.
          </p>

          <button
            type="submit"
            id="apply-ai-modification-btn"
            disabled={isModifying || !promptInput.trim()}
            className={`w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              isModifying || !promptInput.trim()
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isModifying ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Applying Changes…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Apply AI Modification</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {history.length > 0 && (
        <div
          className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-200"
        >
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-600" />
            <span>Applied Change Log</span>
          </h4>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-2 shadow-2xs font-normal"
              >
                <span className="truncate">&ldquo;{h.prompt}&rdquo;</span>
                <span className="text-xs text-slate-500 shrink-0 font-medium">
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

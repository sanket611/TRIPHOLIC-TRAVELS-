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
      style={{
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-5 sm:p-8 mb-8 relative overflow-hidden transition-all bg-white"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs"
            >
              <Edit3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading">
              Modify Your Trip
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-700 font-medium">
            Instruct AI to adjust specific days, tweak budget targets, swap activities, or alter dining preferences.
          </p>
        </div>

        {history.length > 0 && (
          <span
            style={{ border: '1.5px solid #000000' }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold text-black bg-amber-100 flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <History className="w-4 h-4 text-black" />
            <span>{history.length} {history.length === 1 ? 'MODIFICATION' : 'MODIFICATIONS'}</span>
          </span>
        )}
      </div>

      {/* Preset Quick Chips */}
      <div className="mt-4 sm:mt-5">
        <p className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-2">
          Quick Suggestion Presets
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESET_MODIFICATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{ border: '1px solid #000000', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
              className="px-3.5 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 hover:bg-amber-100 hover:text-black active:scale-98 transition-all cursor-pointer text-left"
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
            style={{ border: '1.5px solid #000000' }}
            className={`w-full p-4 rounded-xl text-slate-900 bg-white font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none text-base sm:text-sm shadow-2xs ${
              error
                ? 'border-rose-500 ring-2 ring-rose-200'
                : ''
            }`}
          />
        </div>

        {error && (
          <p className="text-xs sm:text-sm text-rose-600 font-bold flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 sm:pt-2">
          <p className="text-xs sm:text-sm text-slate-600 font-medium text-center sm:text-left">
            Tripholic updates target parameters while preserving unaffected schedule points.
          </p>

          <button
            type="submit"
            id="apply-ai-modification-btn"
            disabled={isModifying || !promptInput.trim()}
            style={{ border: '1.5px solid #000000' }}
            className={`w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isModifying || !promptInput.trim()
                ? 'bg-slate-200 cursor-not-allowed text-slate-400 border-slate-300'
                : 'bg-amber-300 hover:bg-amber-400 active:scale-95'
            }`}
          >
            {isModifying ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-black" />
                <span>Applying Changes…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Apply AI Modification</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {history.length > 0 && (
        <div
          style={{ borderTop: '1.5px solid #000000' }}
          className="mt-5 sm:mt-6 pt-4 sm:pt-5"
        >
          <h4 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
            <History className="w-4 h-4 text-black" />
            <span>Applied Change Log</span>
          </h4>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                style={{ border: '1px solid #000000' }}
                className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-xl flex items-center justify-between gap-2 shadow-2xs font-medium"
              >
                <span className="truncate">&ldquo;{h.prompt}&rdquo;</span>
                <span className="text-xs text-slate-600 shrink-0 font-mono font-bold">
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

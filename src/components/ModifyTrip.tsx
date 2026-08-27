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
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 relative overflow-hidden transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
        }}
        className="pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-700 border border-blue-500/30">
              <Edit3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              Modify Your Trip
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Instruct AI to adjust specific days, tweak budget targets, swap activities, or alter dining preferences.
          </p>
        </div>

        {history.length > 0 && (
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-blue-900 flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs backdrop-blur-xs"
          >
            <History className="w-3.5 h-3.5" />
            <span>{history.length} {history.length === 1 ? 'MODIFICATION' : 'MODIFICATIONS'}</span>
          </span>
        )}
      </div>

      {/* Preset Quick Chips */}
      <div className="mt-4 sm:mt-5">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 mb-2">
          Quick Suggestion Presets
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESET_MODIFICATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
              }}
              className="px-3 py-2 min-h-[38px] rounded-xl text-xs font-semibold text-slate-800 hover:bg-white/60 hover:text-blue-900 active:bg-white/80 transition-all cursor-pointer text-left shadow-2xs backdrop-blur-xs"
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
            style={{
              background: 'rgba(255, 255, 255, 0.40)',
              border: '1px solid rgba(255, 255, 255, 0.50)',
            }}
            className={`w-full p-3.5 rounded-xl text-slate-900 font-medium placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all resize-none text-base sm:text-sm shadow-2xs backdrop-blur-xs ${
              error
                ? 'border-rose-400 focus:ring-rose-200'
                : 'focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 sm:pt-2">
          <p className="text-xs text-slate-700 font-medium text-center sm:text-left">
            Tripholic precision updates target parameters while preserving unaffected schedule points.
          </p>

          <button
            type="submit"
            id="apply-ai-modification-btn"
            disabled={isModifying || !promptInput.trim()}
            className={`w-full sm:w-auto px-6 py-3 sm:py-2.5 min-h-[48px] rounded-xl font-bold text-xs font-mono tracking-wider uppercase text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg ${
              isModifying || !promptInput.trim()
                ? 'bg-slate-400/50 cursor-not-allowed text-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
            }`}
          >
            {isModifying ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Applying Changes…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply AI Modification</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>

      {history.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.30)',
          }}
          className="mt-5 sm:mt-6 pt-4 sm:pt-5"
        >
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>Applied Change Log</span>
          </h4>
          <div className="space-y-1.5">
            {history.map((h, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                }}
                className="text-xs text-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-2xs backdrop-blur-xs"
              >
                <span className="font-semibold text-slate-900 truncate">&ldquo;{h.prompt}&rdquo;</span>
                <span className="text-[10px] font-mono text-slate-600 shrink-0 font-medium">
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

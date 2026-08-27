import React, { useEffect, useState } from 'react';
import { Sparkles, MapPin, Compass, Utensils, DollarSign, Calendar } from 'lucide-react';

interface LoadingStateProps {
  destination?: string;
  isModifying?: boolean;
  modificationPrompt?: string;
}

const STEPS = [
  { icon: Sparkles, text: 'Analyzing destination and travel vibe...' },
  { icon: Calendar, text: 'Structuring realistic day-by-day morning, afternoon & evening slots...' },
  { icon: Utensils, text: 'Filtering authentic dietary-compliant food recommendations...' },
  { icon: DollarSign, text: 'Calculating accommodation, transport & activity budget breakdown...' },
  { icon: Compass, text: 'Formulating alternative travel plan and local travel tips...' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  destination,
  isModifying,
  modificationPrompt,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="loading-state-container"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="my-12 p-8 sm:p-12 rounded-[28px] max-w-3xl mx-auto text-center relative overflow-hidden transition-all"
    >
      <div className="max-w-md mx-auto">
        {/* Geometric Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md border border-blue-400">
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
        </div>

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight font-heading">
          {isModifying ? 'Modifying Your Travel Plan…' : 'Creating your personalized travel plan…'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-800 font-medium mb-8">
          {isModifying && modificationPrompt ? (
            <span>Applying AI modification: <span className="font-semibold text-blue-900 italic">&ldquo;{modificationPrompt}&rdquo;</span></span>
          ) : (
            <span>Crafting an optimized, budget-structured plan for <span className="font-bold text-slate-900">{destination || 'your destination'}</span>.</span>
          )}
        </p>

        {/* Step Progress List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.45)',
          }}
          className="space-y-3 text-left p-4 sm:p-5 rounded-2xl mb-6 shadow-xs backdrop-blur-md"
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'text-emerald-950 font-bold'
                    : isCurrent
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white/60 text-slate-500 border-white/80'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-spin text-blue-600' : ''}`} />
                  <span className="text-xs">{step.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skeleton Preview Lines */}
        <div className="space-y-2 opacity-50">
          <div className="h-2 bg-white/60 rounded-full w-5/6 mx-auto animate-pulse" />
          <div className="h-2 bg-white/60 rounded-full w-3/4 mx-auto animate-pulse delay-75" />
        </div>
      </div>
    </div>
  );
};

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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      }}
      className="my-12 p-8 sm:p-12 rounded-[24px] max-w-3xl mx-auto text-center relative overflow-hidden transition-all"
    >
      <div className="max-w-md mx-auto">
        {/* Geometric Icon */}
        <div
          style={{
            border: '1.5px solid #000000',
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6 rounded-2xl bg-black flex items-center justify-center text-white shadow-md"
        >
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
        </div>

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-black mb-2 tracking-tight font-heading">
          {isModifying ? 'Modifying Your Travel Plan…' : 'Creating your personalized travel plan…'}
        </h3>

        <p className="text-sm sm:text-base text-black font-extrabold mb-8">
          {isModifying && modificationPrompt ? (
            <span>Applying AI modification: <span className="font-extrabold text-black italic">&ldquo;{modificationPrompt}&rdquo;</span></span>
          ) : (
            <span>Crafting an optimized, budget-structured plan for <span className="font-extrabold text-black underline decoration-2">{destination || 'your destination'}</span>.</span>
          )}
        </p>

        {/* Step Progress List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.90)',
            border: '1.5px solid #000000',
          }}
          className="space-y-3 text-left p-4 sm:p-5 rounded-2xl mb-6 shadow-xs"
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
                    ? 'text-black font-extrabold'
                    : isCurrent
                    ? 'text-black font-extrabold'
                    : 'text-slate-600 font-bold'
                }`}
              >
                <div
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className={`w-6 h-6 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-300 text-black'
                      : isCurrent
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-white text-black'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Icon className={`w-4 h-4 text-black ${isCurrent ? 'animate-spin' : ''}`} />
                  <span className="text-xs sm:text-sm">{step.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skeleton Preview Lines */}
        <div className="space-y-2 opacity-60">
          <div className="h-2.5 bg-black rounded-full w-5/6 mx-auto animate-pulse" />
          <div className="h-2.5 bg-black rounded-full w-3/4 mx-auto animate-pulse delay-75" />
        </div>
      </div>
    </div>
  );
};

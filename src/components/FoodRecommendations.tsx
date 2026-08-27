import React from 'react';
import { Utensils, Coffee, Sun, Moon, Sparkles, CheckCircle2, DollarSign } from 'lucide-react';
import { FoodRecommendations as FoodRecsType } from '../types';

interface FoodRecommendationsProps {
  foodRecommendations: FoodRecsType;
  foodPreference: string;
}

export const FoodRecommendations: React.FC<FoodRecommendationsProps> = ({
  foodRecommendations,
  foodPreference,
}) => {
  const { preferenceNote, breakfast, lunch, dinner, localSpecialties } = foodRecommendations;

  return (
    <section
      id="food-recommendations-section"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
        }}
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-700 border border-amber-500/30">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              Food & Culinary Guide
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            {preferenceNote || `100% curated recommendations for ${foodPreference} dining.`}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.40)',
            border: '1px solid rgba(255, 255, 255, 0.50)',
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-amber-950 text-xs font-mono font-bold self-start sm:self-auto shrink-0 shadow-2xs backdrop-blur-md"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
          <span>DIET: {foodPreference.toUpperCase()}</span>
        </div>
      </div>

      {/* Meal Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6">
        {/* Breakfast */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Breakfast Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {breakfast.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.dish}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.55)',
                      }}
                      className="text-[10px] font-mono font-bold text-slate-900 px-1.5 py-0.5 rounded-lg shrink-0 shadow-2xs"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 mb-1">{item.placeOrType}</p>
                  <p className="text-xs text-slate-800 font-normal leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lunch */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Lunch Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {lunch.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.dish}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.55)',
                      }}
                      className="text-[10px] font-mono font-bold text-slate-900 px-1.5 py-0.5 rounded-lg shrink-0 shadow-2xs"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 mb-1">{item.placeOrType}</p>
                  <p className="text-xs text-slate-800 font-normal leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dinner */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <Moon className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Dinner Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {dinner.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.dish}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.55)',
                      }}
                      className="text-[10px] font-mono font-bold text-slate-900 px-1.5 py-0.5 rounded-lg shrink-0 shadow-2xs"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 mb-1">{item.placeOrType}</p>
                  <p className="text-xs text-slate-800 font-normal leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Local Specialties & Iconic Street Dishes */}
      {localSpecialties && localSpecialties.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.30)',
          }}
          className="mt-6 sm:mt-8 pt-5 sm:pt-6"
        >
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3.5 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Must-Try Local Specialties & Street Flavors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {localSpecialties.map((spec, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.30)',
                  border: '1px solid rgba(255, 255, 255, 0.40)',
                }}
                className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-md hover:bg-white/40 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{spec.name}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/25 text-emerald-950 rounded-lg border border-emerald-500/35 shrink-0">
                      {spec.dietaryTag || foodPreference}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 mb-3 leading-relaxed font-normal">{spec.description}</p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.35)',
                  }}
                  className="pt-2 text-xs"
                >
                  <span className="text-slate-600 font-mono text-[11px]">Recommended at: </span>
                  <span className="font-bold text-slate-900">{spec.mustTryAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

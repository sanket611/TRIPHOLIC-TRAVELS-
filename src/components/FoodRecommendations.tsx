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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-black text-amber-300 border border-black shadow-sm">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Food & Culinary Guide
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-950 font-bold">
            {preferenceNote || `100% curated recommendations for ${foodPreference} dining.`}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.90)',
            border: '1.5px solid #000000',
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-black text-xs sm:text-sm font-mono font-extrabold self-start sm:self-auto shrink-0 shadow-sm backdrop-blur-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>DIET: {foodPreference.toUpperCase()}</span>
        </div>
      </div>

      {/* Meal Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6">
        {/* Breakfast */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500 border border-black text-white flex items-center justify-center shadow-xs">
                <Coffee className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Breakfast Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {breakfast.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-base font-extrabold text-black">{item.dish}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="text-xs font-mono font-extrabold text-black px-2 py-0.5 rounded-lg shrink-0 shadow-2xs"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-violet-900 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-black font-bold leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lunch */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-500 border border-black text-white flex items-center justify-center shadow-xs">
                <Sun className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Lunch Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {lunch.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-base font-extrabold text-black">{item.dish}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="text-xs font-mono font-extrabold text-black px-2 py-0.5 rounded-lg shrink-0 shadow-2xs"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-violet-900 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-black font-bold leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dinner */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-700 border border-black text-white flex items-center justify-center shadow-xs">
                <Moon className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Dinner Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {dinner.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-base font-extrabold text-black">{item.dish}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="text-xs font-mono font-extrabold text-black px-2 py-0.5 rounded-lg shrink-0 shadow-2xs"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-violet-900 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-black font-bold leading-relaxed">{item.description}</p>
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
            borderTop: '1.5px solid #000000',
          }}
          className="mt-6 sm:mt-8 pt-5 sm:pt-6"
        >
          <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-3.5 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Must-Try Local Specialties & Street Flavors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {localSpecialties.map((spec, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1.5px solid #000000',
                }}
                className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-md hover:bg-white shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-base font-extrabold text-black">{spec.name}</h4>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1.5px solid #000000',
                      }}
                      className="px-2.5 py-0.5 text-xs font-mono font-extrabold text-black rounded-lg shrink-0"
                    >
                      {spec.dietaryTag || foodPreference}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-black mb-3 leading-relaxed font-bold">{spec.description}</p>
                </div>

                <div
                  style={{
                    borderTop: '1.5px solid #000000',
                  }}
                  className="pt-2 text-xs sm:text-sm"
                >
                  <span className="text-slate-800 font-mono text-xs font-bold">Recommended at: </span>
                  <span className="font-extrabold text-black">{spec.mustTryAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

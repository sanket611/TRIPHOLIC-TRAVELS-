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
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Food & Culinary Guide
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-600 font-normal">
            {preferenceNote || `100% curated recommendations for ${foodPreference} dining.`}
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-indigo-700 bg-indigo-50 border border-indigo-100 text-xs sm:text-sm font-semibold self-start sm:self-auto shrink-0 shadow-2xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>DIET: {foodPreference.toUpperCase()}</span>
        </div>
      </div>

      {/* Meal Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6">
        {/* Breakfast */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between bg-slate-50 border border-slate-200/80 shadow-2xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shadow-2xs">
                <Coffee className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">Breakfast Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {breakfast.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-base font-bold text-slate-900">{item.dish}</h4>
                    <span
                      className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 border border-slate-200"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-indigo-600 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lunch */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between bg-slate-50 border border-slate-200/80 shadow-2xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center shadow-2xs">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">Lunch Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {lunch.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-base font-bold text-slate-900">{item.dish}</h4>
                    <span
                      className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 border border-slate-200"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-indigo-600 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dinner */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between bg-slate-50 border border-slate-200/80 shadow-2xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shadow-2xs">
                <Moon className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">Dinner Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {dinner.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-base font-bold text-slate-900">{item.dish}</h4>
                    <span
                      className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 border border-slate-200"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-indigo-600 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Local Specialties & Iconic Street Dishes */}
      {localSpecialties && localSpecialties.length > 0 && (
        <div
          className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200"
        >
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-3.5 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Must-Try Local Specialties & Street Flavors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {localSpecialties.map((spec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-base font-bold text-slate-900">{spec.name}</h4>
                    <span
                      className="px-2 py-0.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md shrink-0"
                    >
                      {spec.dietaryTag || foodPreference}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">{spec.description}</p>
                </div>

                <div
                  className="pt-2 border-t border-slate-100 text-xs"
                >
                  <span className="text-slate-500 font-medium">Recommended at: </span>
                  <span className="font-semibold text-slate-900">{spec.mustTryAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

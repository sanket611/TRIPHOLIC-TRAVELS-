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
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs"
            >
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading">
              Food &amp; Culinary Guide
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-700 font-medium">
            {preferenceNote || `100% curated recommendations for ${foodPreference} dining.`}
          </p>
        </div>

        <div
          style={{ border: '1.5px solid #000000' }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-black bg-amber-200 text-xs sm:text-sm font-mono font-black self-start sm:self-auto shrink-0 shadow-2xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
          <span>DIET: {foodPreference.toUpperCase()}</span>
        </div>
      </div>

      {/* Meal Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6">
        {/* Breakfast */}
        <div
          style={{
            border: '1.5px solid #000000',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between bg-slate-50"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-amber-300 text-black flex items-center justify-center shadow-2xs"
              >
                <Coffee className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Breakfast Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {breakfast.map((item, idx) => (
                <div
                  key={idx}
                  style={{ border: '1.5px solid #000000' }}
                  className="bg-white p-3.5 sm:p-4 rounded-xl shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-base font-black text-slate-950">{item.dish}</h4>
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="text-xs font-mono font-extrabold text-black bg-amber-100 px-2 py-0.5 rounded-md shrink-0"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-indigo-800 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lunch */}
        <div
          style={{
            border: '1.5px solid #000000',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between bg-slate-50"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-sky-300 text-black flex items-center justify-center shadow-2xs"
              >
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Lunch Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {lunch.map((item, idx) => (
                <div
                  key={idx}
                  style={{ border: '1.5px solid #000000' }}
                  className="bg-white p-3.5 sm:p-4 rounded-xl shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-base font-black text-slate-950">{item.dish}</h4>
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="text-xs font-mono font-extrabold text-black bg-sky-100 px-2 py-0.5 rounded-md shrink-0"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-sky-900 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dinner */}
        <div
          style={{
            border: '1.5px solid #000000',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
          }}
          className="rounded-2xl p-4 sm:p-5 flex flex-col justify-between bg-slate-50"
        >
          <div>
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-purple-300 text-black flex items-center justify-center shadow-2xs"
              >
                <Moon className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Dinner Options</h3>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              {dinner.map((item, idx) => (
                <div
                  key={idx}
                  style={{ border: '1.5px solid #000000' }}
                  className="bg-white p-3.5 sm:p-4 rounded-xl shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-base font-black text-slate-950">{item.dish}</h4>
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="text-xs font-mono font-extrabold text-black bg-purple-100 px-2 py-0.5 rounded-md shrink-0"
                    >
                      {item.priceRange}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-purple-900 mb-1">{item.placeOrType}</p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Local Specialties & Iconic Street Dishes */}
      {localSpecialties && localSpecialties.length > 0 && (
        <div
          style={{ borderTop: '1.5px solid #000000' }}
          className="mt-6 sm:mt-8 pt-5 sm:pt-6"
        >
          <h3 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black mb-3.5 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Must-Try Local Specialties &amp; Street Flavors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {localSpecialties.map((spec, idx) => (
              <div
                key={idx}
                style={{
                  border: '1.5px solid #000000',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                }}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-base font-black text-slate-950">{spec.name}</h4>
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="px-2 py-0.5 text-[11px] font-mono font-extrabold text-black bg-amber-100 rounded-md shrink-0"
                    >
                      {spec.dietaryTag || foodPreference}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed font-medium">{spec.description}</p>
                </div>

                <div
                  style={{ borderTop: '1px solid #000000' }}
                  className="pt-2 text-xs"
                >
                  <span className="text-slate-600 font-medium">Recommended at: </span>
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

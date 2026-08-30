import React from 'react';
import { MapPin, Sparkles, Clock, Ticket, Compass } from 'lucide-react';
import { RecommendedPlace } from '../types';

interface RecommendedPlacesProps {
  places: RecommendedPlace[];
  destination: string;
  travelStyle: string;
}

export const RecommendedPlaces: React.FC<RecommendedPlacesProps> = ({
  places,
  destination,
  travelStyle,
}) => {
  if (!places || places.length === 0) return null;

  return (
    <section
      id="recommended-places-section"
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Recommended Places & Attractions
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-600 font-normal">
            Handpicked spots curated for <span className="font-semibold text-slate-900">{destination}</span> aligned with your <span className="font-semibold text-slate-900">{travelStyle}</span> style.
          </p>
        </div>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mt-5 sm:mt-6">
        {places.map((place, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Tag and Location */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md"
                >
                  {place.tag || 'MUST VISIT'}
                </span>
                {place.locationArea && (
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{place.locationArea}</span>
                  </span>
                )}
              </div>

              {/* Place Name */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {place.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-4">
                {place.description}
              </p>

              {/* Why Suitable Box */}
              {place.whySuitable && (
                <div
                  className="p-3 rounded-xl mb-3 sm:mb-4 text-xs text-slate-700 bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center gap-1.5 font-semibold mb-0.5 text-indigo-700 text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Plan Alignment:</span>
                  </div>
                  <p className="text-slate-600 leading-normal">{place.whySuitable}</p>
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div
              className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              {place.bestTimeToVisit && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{place.bestTimeToVisit}</span>
                </div>
              )}
              {place.estimatedEntryFee && (
                <div
                  className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200"
                >
                  <Ticket className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{place.estimatedEntryFee}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

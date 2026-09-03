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
      style={{
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs"
            >
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading">
              Recommended Places &amp; Attractions
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-700 font-medium">
            Handpicked spots curated for <span className="font-black text-black">{destination}</span> aligned with your <span className="font-black text-black">{travelStyle}</span> style.
          </p>
        </div>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mt-5 sm:mt-6">
        {places.map((place, idx) => (
          <div
            key={idx}
            style={{
              border: '1.5px solid #000000',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
            }}
            className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/60 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Tag and Location */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  style={{ border: '1px solid #000000' }}
                  className="px-2.5 py-0.5 text-[11px] font-mono font-extrabold uppercase tracking-wider text-black bg-amber-200 rounded-md"
                >
                  {place.tag || 'MUST VISIT'}
                </span>
                {place.locationArea && (
                  <span
                    style={{ border: '1px solid #000000' }}
                    className="text-xs text-black font-bold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                    <span className="truncate">{place.locationArea}</span>
                  </span>
                )}
              </div>

              {/* Place Name */}
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-1">
                {place.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 sm:mb-4 font-medium">
                {place.description}
              </p>

              {/* Why Suitable Box */}
              {place.whySuitable && (
                <div
                  style={{ border: '1px solid #000000' }}
                  className="p-3 rounded-xl mb-3 sm:mb-4 text-xs text-slate-800 bg-indigo-50/70"
                >
                  <div className="flex items-center gap-1.5 font-extrabold mb-0.5 text-indigo-950 text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Plan Alignment:</span>
                  </div>
                  <p className="text-slate-800 leading-normal font-medium">{place.whySuitable}</p>
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div
              style={{ borderTop: '1px solid #000000' }}
              className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              {place.bestTimeToVisit && (
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{place.bestTimeToVisit}</span>
                </div>
              )}
              {place.estimatedEntryFee && (
                <div
                  style={{ border: '1px solid #000000' }}
                  className="flex items-center gap-1.5 text-black font-mono font-extrabold text-xs px-2.5 py-1 rounded-md bg-amber-100"
                >
                  <Ticket className="w-3.5 h-3.5 text-black shrink-0" />
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

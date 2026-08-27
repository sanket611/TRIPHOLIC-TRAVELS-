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
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-teal-600/15 text-teal-700 border border-teal-500/30">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              Recommended Places & Attractions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Handpicked spots curated for <span className="font-bold text-slate-950">{destination}</span> aligned with your <span className="font-bold text-slate-950">{travelStyle}</span> style.
          </p>
        </div>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mt-5 sm:mt-6">
        {places.map((place, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.30)',
              border: '1px solid rgba(255, 255, 255, 0.40)',
            }}
            className="p-4 sm:p-5 rounded-2xl backdrop-blur-md hover:bg-white/40 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Tag and Location */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-600/20 text-teal-950 rounded-lg border border-teal-600/30">
                  {place.tag || 'MUST VISIT'}
                </span>
                {place.locationArea && (
                  <span className="text-[11px] sm:text-xs text-slate-700 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">{place.locationArea}</span>
                  </span>
                )}
              </div>

              {/* Place Name */}
              <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1.5">
                {place.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-3 sm:mb-4 font-normal">
                {place.description}
              </p>

              {/* Why Suitable Box */}
              {place.whySuitable && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="p-3 rounded-xl mb-3.5 sm:mb-4 text-xs text-slate-900 backdrop-blur-xs"
                >
                  <div className="flex items-center gap-1.5 font-bold mb-0.5 text-blue-900 font-mono text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Plan Alignment:</span>
                  </div>
                  <p className="text-slate-800 leading-normal font-medium">{place.whySuitable}</p>
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.35)',
              }}
              className="pt-2.5 sm:pt-3 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              {place.bestTimeToVisit && (
                <div className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="text-xs">{place.bestTimeToVisit}</span>
                </div>
              )}
              {place.estimatedEntryFee && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.55)',
                  }}
                  className="flex items-center gap-1 text-slate-900 font-mono font-bold text-[11px] px-2 py-0.5 rounded-lg shadow-2xs"
                >
                  <Ticket className="w-3 h-3 text-slate-700 shrink-0" />
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

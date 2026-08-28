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
        className="pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-black text-amber-300 border border-black shadow-sm">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Recommended Places & Attractions
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-950 font-bold">
            Handpicked spots curated for <span className="font-extrabold text-black">{destination}</span> aligned with your <span className="font-extrabold text-black">{travelStyle}</span> style.
          </p>
        </div>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mt-5 sm:mt-6">
        {places.map((place, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="p-4 sm:p-5 rounded-2xl backdrop-blur-md hover:bg-white shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Tag and Location */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="px-3 py-0.5 text-xs font-mono font-extrabold uppercase tracking-wider text-black rounded-lg"
                >
                  {place.tag || 'MUST VISIT'}
                </span>
                {place.locationArea && (
                  <span className="text-xs sm:text-sm text-black font-extrabold flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-black shrink-0" />
                    <span className="truncate">{place.locationArea}</span>
                  </span>
                )}
              </div>

              {/* Place Name */}
              <h3 className="text-sm sm:text-lg font-extrabold text-black mb-1.5">
                {place.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-black leading-relaxed mb-3 sm:mb-4 font-bold">
                {place.description}
              </p>

              {/* Why Suitable Box */}
              {place.whySuitable && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="p-3.5 rounded-xl mb-3.5 sm:mb-4 text-xs sm:text-sm text-black shadow-xs"
                >
                  <div className="flex items-center gap-1.5 font-extrabold mb-1 text-black font-mono text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Plan Alignment:</span>
                  </div>
                  <p className="text-black leading-normal font-bold">{place.whySuitable}</p>
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div
              style={{
                borderTop: '1.5px solid #000000',
              }}
              className="pt-2.5 sm:pt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm"
            >
              {place.bestTimeToVisit && (
                <div className="flex items-center gap-1.5 text-black font-bold">
                  <Clock className="w-4 h-4 text-black shrink-0" />
                  <span className="text-xs sm:text-sm">{place.bestTimeToVisit}</span>
                </div>
              )}
              {place.estimatedEntryFee && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #000000',
                  }}
                  className="flex items-center gap-1.5 text-black font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-2xs"
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

import React from 'react';
import { Sparkles, MapPin, ShieldCheck, UtensilsCrossed, RefreshCw } from 'lucide-react';
import { TravelPreferences, TravelStyle } from '../types';
import { Wallpaper } from '../wallpapers';

interface HeroProps {
  onSelectPreset: (prefs: Partial<TravelPreferences>) => void;
  onScrollToForm?: () => void;
  currentWallpaper?: Wallpaper;
  onChangeWallpaper?: (wallpaper?: Wallpaper) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectPreset,
  currentWallpaper,
  onChangeWallpaper,
}) => {
  const quickPicks = [
    {
      label: '🏖️ Goa Coastal Escape',
      destination: 'Goa',
      duration: 4,
      budget: 20000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure & Relaxed',
      travelStyles: ['Adventure', 'Relaxed'] as TravelStyle[],
      interests: ['Beaches', 'Photography', 'Nightlife', 'Water Sports'],
      foodPreference: 'Vegetarian' as const,
    },
    {
      label: '🏔️ Manali Alpine Haven',
      destination: 'Manali',
      duration: 5,
      budget: 25000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure & Nature & Wildlife',
      travelStyles: ['Adventure', 'Nature & Wildlife'] as TravelStyle[],
      interests: ['Trekking', 'Photography', 'Nature & Wildlife'],
      foodPreference: 'Vegetarian' as const,
    },
    {
      label: '🗼 Paris Cultural & Foodie',
      destination: 'Paris',
      duration: 5,
      budget: 1500,
      currency: '$',
      travelers: 2,
      travelStyle: 'Cultural & Heritage & Foodie & Culinary',
      travelStyles: ['Cultural & Heritage', 'Foodie & Culinary'] as TravelStyle[],
      interests: ['History', 'Art & Museums', 'Street Food'],
      foodPreference: 'Non-Vegetarian' as const,
    },
    {
      label: '🌴 Bali Tropical Wellness',
      destination: 'Bali',
      duration: 6,
      budget: 1200,
      currency: '$',
      travelers: 2,
      travelStyle: 'Relaxed & Romantic',
      travelStyles: ['Relaxed', 'Romantic'] as TravelStyle[],
      interests: ['Beaches', 'Wellness & Spa', 'Photography'],
      foodPreference: 'Vegan' as const,
    },
  ];

  return (
    <section
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="relative overflow-hidden py-6 sm:py-10 mb-6 sm:mb-8 rounded-[28px] transition-all"
    >
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Geometric Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-5">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1.5px solid #000000',
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full text-black text-xs sm:text-sm font-mono font-extrabold shadow-sm backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-violet-700 shrink-0" />
              <span>AI TRAVEL ARCHITECTURE</span>
            </div>

            {currentWallpaper && onChangeWallpaper && (
              <button
                onClick={() => onChangeWallpaper()}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1.5px solid #000000',
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-black text-xs sm:text-sm font-bold hover:bg-white active:bg-violet-100 transition-colors cursor-pointer shadow-sm backdrop-blur-md"
                title="Click to randomize scenic nature backdrop"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span className="font-bold">{currentWallpaper.location}</span>
                <RefreshCw className="w-3 h-3 ml-0.5 text-violet-700 shrink-0" />
              </button>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.2] sm:leading-[1.15] mb-3 sm:mb-4 font-heading drop-shadow-sm">
            Intelligent Travel Itineraries, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700">Calculated with Precision.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-950 font-semibold leading-relaxed mb-5 sm:mb-8 max-w-2xl mx-auto drop-shadow-xs">
            Input your destination, duration, budget constraints, group size, and dietary requirements to generate a validated, geographically clustered day-by-day travel plan.
          </p>

          {/* Value props grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-2xl mx-auto text-left mb-6 sm:mb-8">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                border: '1.5px solid #000000',
              }}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl shadow-sm backdrop-blur-md"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-700 text-white flex items-center justify-center shrink-0 font-mono text-sm font-bold shadow-xs border border-black">
                $
              </div>
              <div>
                <p className="text-sm font-extrabold text-black">Budget Clamped</p>
                <p className="text-xs text-slate-900 font-bold">5-category cost model</p>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                border: '1.5px solid #000000',
              }}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl shadow-sm backdrop-blur-md"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs border border-black">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-black">Dietary Verified</p>
                <p className="text-xs text-slate-900 font-bold">Veg, Vegan, Jain or Non-Veg</p>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                border: '1.5px solid #000000',
              }}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl shadow-sm backdrop-blur-md"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs border border-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-black">Geographic Clusters</p>
                <p className="text-xs text-slate-900 font-bold">No cross-city transit rush</p>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black mb-2 sm:mb-2.5">
              Quick-Start Sample Scenarios
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick.destination}
                  onClick={() => onSelectPreset(pick)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1.5px solid #000000',
                  }}
                  className="px-3.5 py-2.5 min-h-[40px] text-xs sm:text-sm font-bold text-black hover:bg-black hover:text-white active:bg-slate-900 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm backdrop-blur-md"
                >
                  <MapPin className="w-4 h-4 text-violet-700 shrink-0" />
                  <span>{pick.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


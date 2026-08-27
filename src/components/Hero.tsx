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
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="relative overflow-hidden py-6 sm:py-10 mb-6 sm:mb-8 rounded-[28px] transition-all"
    >
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Geometric Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-5">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.40)',
                border: '1px solid rgba(255, 255, 255, 0.50)',
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-slate-900 text-[11px] sm:text-xs font-mono font-bold shadow-2xs backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>AI TRAVEL ARCHITECTURE</span>
            </div>

            {currentWallpaper && onChangeWallpaper && (
              <button
                onClick={() => onChangeWallpaper()}
                style={{
                  background: 'rgba(255, 255, 255, 0.40)',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-blue-950 text-[11px] sm:text-xs font-bold hover:bg-white/60 active:bg-blue-100 transition-colors cursor-pointer shadow-2xs backdrop-blur-md"
                title="Click to randomize scenic nature backdrop"
              >
                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="font-semibold">{currentWallpaper.location}</span>
                <RefreshCw className="w-2.5 h-2.5 ml-0.5 text-blue-500 shrink-0" />
              </button>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.15] mb-3 sm:mb-4 font-heading">
            Intelligent Travel Itineraries, <br className="hidden sm:inline" />
            <span className="text-blue-600">Calculated with Precision.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-slate-800 leading-relaxed mb-5 sm:mb-8 max-w-2xl mx-auto font-medium">
            Input your destination, duration, budget constraints, group size, and dietary requirements to generate a validated, geographically clustered day-by-day travel plan.
          </p>

          {/* Value props grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-2xl mx-auto text-left mb-6 sm:mb-8">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
              }}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl shadow-xs backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-mono text-xs font-bold shadow-2xs">
                $
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Budget Clamped</p>
                <p className="text-[11px] text-slate-700 font-medium">5-category cost model</p>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
              }}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl shadow-xs backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Dietary Verified</p>
                <p className="text-[11px] text-slate-700 font-medium">Veg, Vegan, Jain or Non-Veg</p>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
              }}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl shadow-xs backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Geographic Clusters</p>
                <p className="text-[11px] text-slate-700 font-medium">No cross-city transit rush</p>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 mb-2 sm:mb-2.5">
              Quick-Start Sample Scenarios
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick.destination}
                  onClick={() => onSelectPreset(pick)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}
                  className="px-3 py-2 min-h-[38px] text-xs font-bold text-slate-900 hover:bg-white/60 hover:text-blue-900 active:bg-blue-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs backdrop-blur-md"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
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


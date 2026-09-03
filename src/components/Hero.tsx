import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  UtensilsCrossed,
  TrendingUp,
  Compass,
  ArrowRight,
  Plane,
  Grid,
  Heart,
} from 'lucide-react';
import { TravelPreferences, TravelStyle } from '../types';

interface HeroProps {
  onSelectPreset: (prefs: Partial<TravelPreferences>) => void;
  onScrollToForm?: () => void;
  onOpenDestinationsModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectPreset,
  onScrollToForm,
  onOpenDestinationsModal,
}) => {
  const [destinationFilter, setDestinationFilter] = useState<'india' | 'all'>('india');

  const curatedDestinations = [
    // Top Indian Destinations
    {
      label: 'Goa Coastal Escape',
      destination: 'Goa',
      country: 'India',
      region: 'India',
      tag: 'Sun, Beach & Shacks',
      duration: 4,
      budget: 20000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure & Relaxed',
      travelStyles: ['Adventure', 'Relaxed'] as TravelStyle[],
      interests: ['Beaches', 'Photography', 'Nightlife', 'Water Sports'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Manali Snow Valleys',
      destination: 'Manali',
      country: 'India',
      region: 'India',
      tag: 'Snow Peaks & Rohtang',
      duration: 5,
      budget: 25000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure & Nature & Wildlife',
      travelStyles: ['Adventure', 'Nature & Wildlife'] as TravelStyle[],
      interests: ['Trekking', 'Photography', 'Nature & Wildlife', 'Scenic Drives'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Kerala Backwaters & Hills',
      destination: 'Kerala (Munnar & Alleppey)',
      country: 'India',
      region: 'India',
      tag: 'Houseboat & Tea Hills',
      duration: 5,
      budget: 26000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Relaxed & Romantic',
      travelStyles: ['Relaxed', 'Romantic'] as TravelStyle[],
      interests: ['Scenic Drives', 'Wellness & Spa', 'Photography'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Jaipur & Udaipur Royal',
      destination: 'Jaipur & Udaipur',
      country: 'India',
      region: 'India',
      tag: 'Palaces & Forts',
      duration: 5,
      budget: 24000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Cultural & Heritage & Luxury',
      travelStyles: ['Cultural & Heritage', 'Luxury'] as TravelStyle[],
      interests: ['History', 'Architecture', 'Shopping', 'Photography'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Kashmir Paradise Valley',
      destination: 'Kashmir (Srinagar & Gulmarg)',
      country: 'India',
      region: 'India',
      tag: 'Dal Lake & Gondola',
      duration: 5,
      budget: 30000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Romantic & Nature & Wildlife',
      travelStyles: ['Romantic', 'Nature & Wildlife'] as TravelStyle[],
      interests: ['Scenic Drives', 'Photography', 'Local Culture'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Ladakh High Passes',
      destination: 'Ladakh (Leh & Pangong)',
      country: 'India',
      region: 'India',
      tag: 'Pangong & Monasteries',
      duration: 6,
      budget: 35000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure & Solo Explorer',
      travelStyles: ['Adventure', 'Solo Explorer'] as TravelStyle[],
      interests: ['Trekking', 'Scenic Drives', 'Photography'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Andaman Coral Islands',
      destination: 'Andaman & Nicobar Islands',
      country: 'India',
      region: 'India',
      tag: 'Radhanagar & Scuba',
      duration: 5,
      budget: 35000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Adventure & Romantic',
      travelStyles: ['Adventure', 'Romantic'] as TravelStyle[],
      interests: ['Beaches', 'Water Sports', 'Photography'],
      foodPreference: 'Seafood Special' as const,
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Varanasi Ghats & Aarti',
      destination: 'Varanasi (Kashi)',
      country: 'India',
      region: 'India',
      tag: 'Sacred Ganga & Ghats',
      duration: 3,
      budget: 14000,
      currency: '₹',
      travelers: 2,
      travelStyle: 'Cultural & Heritage & Solo Explorer',
      travelStyles: ['Cultural & Heritage', 'Solo Explorer'] as TravelStyle[],
      interests: ['Temples & Shrines', 'Local Culture', 'History', 'Street Food'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Paris Art & Dining',
      destination: 'Paris',
      country: 'France',
      region: 'Global',
      tag: 'Culture & Romance',
      duration: 5,
      budget: 1500,
      currency: '$',
      travelers: 2,
      travelStyle: 'Cultural & Heritage & Foodie & Culinary',
      travelStyles: ['Cultural & Heritage', 'Foodie & Culinary'] as TravelStyle[],
      interests: ['History', 'Art & Museums', 'Street Food'],
      foodPreference: 'Non-Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Bali Tropical Wellness',
      destination: 'Bali',
      country: 'Indonesia',
      region: 'Global',
      tag: 'Zen Retreat',
      duration: 6,
      budget: 1200,
      currency: '$',
      travelers: 2,
      travelStyle: 'Relaxed & Romantic',
      travelStyles: ['Relaxed', 'Romantic'] as TravelStyle[],
      interests: ['Beaches', 'Wellness & Spa', 'Photography'],
      foodPreference: 'Vegan' as const,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Tokyo Neon & Shrines',
      destination: 'Tokyo',
      country: 'Japan',
      region: 'Global',
      tag: 'Modern & Tradition',
      duration: 6,
      budget: 2000,
      currency: '$',
      travelers: 2,
      travelStyle: 'Cultural & Heritage & Foodie & Culinary',
      travelStyles: ['Cultural & Heritage', 'Foodie & Culinary'] as TravelStyle[],
      interests: ['Local Culture', 'Street Food', 'Shopping', 'Architecture'],
      foodPreference: 'Non-Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Swiss Alps Panorama',
      destination: 'Swiss Alps',
      country: 'Switzerland',
      region: 'Global',
      tag: 'Alpine Luxury',
      duration: 5,
      budget: 3200,
      currency: '€',
      travelers: 2,
      travelStyle: 'Nature & Wildlife & Luxury',
      travelStyles: ['Nature & Wildlife', 'Luxury'] as TravelStyle[],
      interests: ['Scenic Drives', 'Photography', 'Wellness & Spa'],
      foodPreference: 'Vegetarian' as const,
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const displayedDestinations =
    destinationFilter === 'india'
      ? curatedDestinations.filter((d) => d.region === 'India')
      : curatedDestinations;

  return (
    <section
      id="explore-section"
      className="relative overflow-hidden py-8 sm:py-10 mb-8 rounded-3xl transition-all bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Welcome Badge with Distinct Background Color */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-indigo-900 bg-indigo-50 border border-indigo-200/80 text-xs sm:text-sm font-semibold shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Smart Travel &amp; Seat Booking Platform</span>
            </div>
          </div>

          {/* High-Impact Welcoming Hero Headline with Custom Background Highlight & Color */}
          <div className="mb-4 space-y-2">
            <div className="inline-block">
              <span
                className="inline-block px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading shadow-md shadow-indigo-500/20"
              >
                Welcome to <span className="text-amber-300 underline decoration-white/60 decoration-2">Tripholic</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-heading">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
                Plan Your Dream Trip &amp; Book Seats Instantly.
              </span>
            </h1>
          </div>

          {/* Clean Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed mb-6 max-w-3xl mx-auto">
            Explore curated Indian destinations and international getaways. Generate custom day-by-day itineraries with photos, budget breakdown, and reserve your seats with ease.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
            {onOpenDestinationsModal && (
              <button
                onClick={onOpenDestinationsModal}
                className="px-5 py-2.5 min-h-[42px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
              >
                <Grid className="w-4 h-4 text-amber-300" />
                <span>Browse All 25+ Available Places</span>
              </button>
            )}

            {onScrollToForm && (
              <button
                onClick={onScrollToForm}
                className="px-5 py-2.5 min-h-[42px] rounded-xl text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:border-slate-300"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Start Custom Trip Planner</span>
              </button>
            )}
          </div>

          {/* Trending Popular Destinations Header with Region Tabs & Crisp Thumbnails */}
          <div className="text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 px-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  Popular Destinations (1-Click Auto Fill)
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setDestinationFilter('india')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    destinationFilter === 'india' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇮🇳 India Places ({curatedDestinations.filter((d) => d.region === 'India').length})
                </button>
                <button
                  onClick={() => setDestinationFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    destinationFilter === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌍 All Destinations ({curatedDestinations.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
              {displayedDestinations.map((dest) => (
                <button
                  key={dest.destination}
                  onClick={() => {
                    onSelectPreset(dest);
                    if (onScrollToForm) onScrollToForm();
                  }}
                  className="group relative overflow-hidden rounded-2xl p-2.5 text-left hover:scale-[1.02] active:scale-98 transition-all cursor-pointer bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md flex flex-col justify-between h-44"
                >
                  {/* Crisp, clearly visible nature / destination picture */}
                  <img
                    src={dest.image}
                    alt={dest.destination}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 rounded-md shadow-2xs border border-white/40">
                      {dest.tag}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                      {dest.duration}D
                    </span>
                  </div>
                  <div className="relative z-10 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{dest.destination}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium truncate">
                      {dest.currency} {dest.budget.toLocaleString()} • {dest.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};




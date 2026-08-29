import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  UtensilsCrossed,
  RefreshCw,
  TrendingUp,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Plane,
  Grid,
  Heart,
} from 'lucide-react';
import { TravelPreferences, TravelStyle } from '../types';
import { Wallpaper, NATURE_TRIP_WALLPAPERS } from '../wallpapers';

interface HeroProps {
  onSelectPreset: (prefs: Partial<TravelPreferences>) => void;
  onScrollToForm?: () => void;
  onOpenDestinationsModal?: () => void;
  currentWallpaper?: Wallpaper;
  onChangeWallpaper?: (wallpaper?: Wallpaper) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectPreset,
  onScrollToForm,
  onOpenDestinationsModal,
  currentWallpaper,
  onChangeWallpaper,
}) => {
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
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
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid #000000',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="relative overflow-hidden py-8 sm:py-12 mb-8 rounded-[32px] transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Welcome Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid #000000',
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-black text-xs sm:text-sm font-mono font-extrabold shadow-sm backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-violet-700 shrink-0" />
              <span>WELCOME TO TRIPHOLIC • YOUR SMART TRAVEL &amp; BOOKING PLANNER</span>
            </div>

            {currentWallpaper && onChangeWallpaper && (
              <div className="relative">
                <button
                  onClick={() => setShowWallpaperPicker(!showWallpaperPicker)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1.5px solid #000000',
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black text-xs sm:text-sm font-bold hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm backdrop-blur-md"
                  title="Change scenic 4K nature background"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-bold">{currentWallpaper.location}</span>
                  <RefreshCw className="w-3 h-3 ml-0.5 text-violet-600 shrink-0" />
                </button>

                {/* Wallpaper Quick Switcher Dropdown */}
                {showWallpaperPicker && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.96)',
                      border: '1.5px solid #000000',
                    }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 sm:w-96 p-3 rounded-2xl shadow-2xl z-50 backdrop-blur-xl animate-fade-in"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10">
                      <span className="text-xs font-mono font-extrabold uppercase text-black">
                        Choose Scenic Wallpaper
                      </span>
                      <button
                        onClick={() => onChangeWallpaper()}
                        className="text-[11px] font-bold text-violet-700 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Randomize
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {NATURE_TRIP_WALLPAPERS.map((wp) => (
                        <button
                          key={wp.id}
                          onClick={() => {
                            onChangeWallpaper(wp);
                            setShowWallpaperPicker(false);
                          }}
                          style={{
                            border: currentWallpaper.id === wp.id ? '2px solid #000000' : '1px solid #e2e8f0',
                          }}
                          className="flex items-center gap-2 p-1.5 rounded-xl text-left hover:bg-slate-100 transition-all cursor-pointer group"
                        >
                          <img
                            src={wp.url}
                            alt={wp.location}
                            className="w-9 h-9 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-black truncate leading-tight">{wp.location}</p>
                            <p className="text-[10px] text-slate-600 truncate">{wp.country}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* High-Impact Welcoming Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 font-heading drop-shadow-sm">
            Welcome to <span className="text-black underline decoration-amber-400 decoration-4">Tripholic</span> <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-800 via-indigo-700 to-blue-700">
              Plan Your Dream Trip &amp; Book Seats Instantly.
            </span>
          </h1>

          {/* Clean Subtitle */}
          <p className="text-sm sm:text-lg text-slate-950 font-bold leading-relaxed mb-6 max-w-3xl mx-auto">
            Explore top Indian destinations and international getaways. Generate custom day-by-day itineraries with photos, budget breakdown, and reserve your seats with ease.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
            {onOpenDestinationsModal && (
              <button
                onClick={onOpenDestinationsModal}
                style={{
                  border: '2px solid #000000',
                }}
                className="px-6 py-3 min-h-[46px] rounded-2xl bg-black text-white hover:bg-violet-800 text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105"
              >
                <Grid className="w-4 h-4 text-amber-300" />
                <span>Browse All 25+ Available Places</span>
              </button>
            )}

            {onScrollToForm && (
              <button
                onClick={onScrollToForm}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #000000',
                }}
                className="px-6 py-3 min-h-[46px] rounded-2xl text-black hover:bg-black hover:text-white text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Compass className="w-4 h-4 text-violet-700" />
                <span>Start Custom Trip Planner</span>
              </button>
            )}
          </div>

          {/* Trending Popular Destinations Header with Region Tabs */}
          <div className="text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-700" />
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black">
                  Popular Destinations (1-Click Auto Fill)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDestinationFilter('india')}
                  style={{
                    border: '1px solid #000000',
                  }}
                  className={`px-3 py-1 text-xs font-mono font-extrabold rounded-lg cursor-pointer transition-all ${
                    destinationFilter === 'india' ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-slate-200'
                  }`}
                >
                  🇮🇳 India Places ({curatedDestinations.filter((d) => d.region === 'India').length})
                </button>
                <button
                  onClick={() => setDestinationFilter('all')}
                  style={{
                    border: '1px solid #000000',
                  }}
                  className={`px-3 py-1 text-xs font-mono font-extrabold rounded-lg cursor-pointer transition-all ${
                    destinationFilter === 'all' ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-slate-200'
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
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1.5px solid #000000',
                  }}
                  className="group relative overflow-hidden rounded-2xl p-2.5 text-left hover:scale-[1.03] active:scale-98 transition-all cursor-pointer shadow-sm backdrop-blur-md flex flex-col justify-between h-40"
                >
                  <img
                    src={dest.image}
                    alt={dest.destination}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-40 group-hover:opacity-50"
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold bg-black text-amber-300 rounded-md shadow-xs">
                      {dest.tag}
                    </span>
                    <span className="text-[10px] font-mono font-black text-black bg-white/95 px-1.5 py-0.5 rounded border border-black shadow-2xs">
                      {dest.duration}D
                    </span>
                  </div>
                  <div className="relative z-10 bg-white/95 p-2.5 rounded-xl border border-black shadow-xs">
                    <p className="text-xs sm:text-sm font-black text-black truncate flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-violet-700 shrink-0" />
                      <span className="truncate">{dest.destination}</span>
                    </p>
                    <p className="text-[11px] text-slate-800 font-extrabold truncate">
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




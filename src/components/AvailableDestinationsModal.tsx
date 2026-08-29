import React, { useState } from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Search,
  Check,
  Calendar,
  Compass,
  ArrowRight,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { ALL_AVAILABLE_DESTINATIONS, DestinationInfo } from '../data/destinations';
import { TravelPreferences } from '../types';

interface AvailableDestinationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: DestinationInfo) => void;
}

export const AvailableDestinationsModal: React.FC<AvailableDestinationsModalProps> = ({
  isOpen,
  onClose,
  onSelectDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const regions = [
    'All',
    'North India',
    'South India',
    'West India',
    'Islands & Himalayas',
    'East & North-East',
    'International',
  ];

  const categories = [
    'All',
    'Beach',
    'Hill Station',
    'Heritage & Culture',
    'Spiritual',
    'Adventure',
    'Wildlife & Nature',
  ];

  const filteredDestinations = ALL_AVAILABLE_DESTINATIONS.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.stateOrCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.famousFor.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = activeRegion === 'All' || dest.region === activeRegion;
    const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;

    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          border: '2px solid #000000',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
        }}
        className="w-full max-w-5xl max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col backdrop-blur-xl"
      >
        {/* Modal Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            borderBottom: '1.5px solid #000000',
          }}
          className="p-5 sm:p-6 text-white flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold bg-amber-400 text-black">
                EXPLORE 25+ CURATED PLACES
              </span>
              <span className="text-xs text-slate-300 font-mono">Special Indian &amp; Global Collection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              All Available Destinations for Booking &amp; Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Browse top verified destinations across India and the world. Click any place to plan instantly!
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: '1.5px solid #ffffff',
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black transition-all cursor-pointer shadow-sm shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 sm:p-5 border-b border-black/10 bg-slate-50 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination by city, state, beaches, snow, forts, temples..."
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white text-black border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono font-extrabold uppercase text-slate-700 mr-1 shrink-0">Region:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                style={{
                  border: '1px solid #000000',
                }}
                className={`px-3 py-1 text-xs font-extrabold rounded-xl shrink-0 transition-all cursor-pointer ${
                  activeRegion === reg
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-black hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono font-extrabold uppercase text-slate-700 mr-1 shrink-0">Vibe:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-0.5 text-xs font-bold rounded-lg shrink-0 transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-violet-700 text-white font-extrabold shadow-2xs'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid View */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[60vh]">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Compass className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
              <h3 className="text-base font-extrabold text-black">No destinations matched your filter</h3>
              <p className="text-xs text-slate-600">Try clearing the search or changing the region filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveRegion('All');
                  setActiveCategory('All');
                }}
                className="mt-2 px-4 py-2 bg-black text-white text-xs font-extrabold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-200 flex flex-col group"
                >
                  {/* Destination Cover Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Region badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 text-[11px] font-mono font-extrabold bg-white/95 text-black rounded-lg border border-black shadow-xs">
                        {dest.region}
                      </span>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-violet-900/90 text-white rounded-lg backdrop-blur-md">
                        {dest.category}
                      </span>
                    </div>

                    {/* Bottom Title overlay */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h3 className="text-lg font-extrabold font-heading text-white drop-shadow-sm leading-tight">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                        <span>{dest.stateOrCountry}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed mb-2">
                        {dest.description}
                      </p>

                      {/* Key highlights tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {dest.famousFor.slice(0, 3).map((spot, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 truncate"
                          >
                            ✓ {spot}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Footer */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between text-xs font-mono font-extrabold mb-2.5">
                        <span className="text-slate-600">Avg {dest.idealDuration} Days</span>
                        <span className="text-emerald-800">
                          ~{dest.currency === '₹' ? `₹${dest.typicalBudgetINR.toLocaleString()}` : `${dest.currency}${dest.typicalBudgetUSD}`}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onSelectDestination(dest);
                          onClose();
                        }}
                        style={{
                          border: '1.5px solid #000000',
                        }}
                        className="w-full py-2.5 bg-black hover:bg-violet-800 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group/btn"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-300 group-hover/btn:rotate-45 transition-transform" />
                        <span>Select &amp; Plan {dest.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Strip */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-black/10 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Showing {filteredDestinations.length} of {ALL_AVAILABLE_DESTINATIONS.length} available places</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-black rounded-lg text-black font-extrabold hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

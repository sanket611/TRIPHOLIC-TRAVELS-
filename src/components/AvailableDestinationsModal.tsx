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
        {/* Modal Top Header - Compact & Clean */}
        <div
          style={{
            background: '#0f172a',
            borderBottom: '1.5px solid #000000',
          }}
          className="px-4 py-3 sm:px-6 sm:py-3.5 text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              style={{ border: '1.5px solid #ffffff' }}
              className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center shrink-0"
            >
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black font-heading text-white truncate flex items-center gap-2">
                Places Catalog
                <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-white/15 text-slate-200">
                  {filteredDestinations.length} available
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ border: '1.5px solid #ffffff' }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black transition-all cursor-pointer shadow-sm shrink-0 ml-2"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters & Search Toolbar - Compact single/double row */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-b border-black/10 bg-slate-50 space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, state, beaches, snow, forts..."
                className="w-full pl-8 pr-4 py-1.5 text-xs sm:text-sm font-bold bg-white text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-0.5 scrollbar-none">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setActiveRegion(reg)}
                  style={{ border: '1px solid #000000' }}
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${
                    activeRegion === reg
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips - Compact */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0 mr-1">Vibe:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-md shrink-0 transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid View - Less scrollable, fits more cards */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 max-h-[64vh]">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Compass className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
              <h3 className="text-sm font-extrabold text-black">No destinations found</h3>
              <p className="text-xs text-slate-600">Try clearing filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveRegion('All');
                  setActiveCategory('All');
                }}
                className="mt-1 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  style={{ border: '1.5px solid #000000' }}
                  className="rounded-xl overflow-hidden bg-white hover:shadow-md transition-all flex flex-col group justify-between"
                >
                  {/* Image & Badges */}
                  <div>
                    <div className="relative h-28 overflow-hidden bg-slate-900">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                      {/* Top pills */}
                      <div className="absolute top-1.5 left-1.5 flex gap-1">
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-black bg-white/95 text-black rounded border border-black shadow-2xs">
                          {dest.region}
                        </span>
                      </div>

                      <div className="absolute top-1.5 right-1.5">
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-black/80 text-white rounded">
                          {dest.category}
                        </span>
                      </div>

                      {/* Bottom Title on Image */}
                      <div className="absolute bottom-1.5 left-2 right-2 text-white">
                        <h3 className="text-sm font-black font-heading text-white leading-tight drop-shadow-sm truncate">
                          {dest.name}
                        </h3>
                        <p className="text-[10px] text-slate-200 flex items-center gap-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                          <span className="truncate">{dest.stateOrCountry}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Content - Compact */}
                    <div className="p-2 space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        {dest.famousFor.slice(0, 2).map((spot, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1 py-0.2 rounded border border-slate-200 truncate max-w-[110px]"
                          >
                            ✓ {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Price & Select */}
                  <div className="p-2 pt-0">
                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
                      <span className="text-slate-600">{dest.idealDuration} Days</span>
                      <span className="text-emerald-800 font-black">
                        ~{dest.currency === '₹' ? `₹${dest.typicalBudgetINR.toLocaleString()}` : `${dest.currency}${dest.typicalBudgetUSD}`}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectDestination(dest);
                        onClose();
                      }}
                      style={{ border: '1.5px solid #000000' }}
                      className="w-full py-1.5 bg-black hover:bg-amber-400 hover:text-black text-white rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Plan {dest.name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Strip */}
        <div className="p-2.5 sm:p-3 bg-slate-100 border-t border-black/10 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="text-[11px]">Showing {filteredDestinations.length} places ready for instant planning</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-black rounded-lg text-black font-extrabold hover:bg-slate-200 cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

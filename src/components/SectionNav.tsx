import React from 'react';
import {
  Calendar,
  MapPin,
  Utensils,
  DollarSign,
  Lightbulb,
  Armchair,
  Edit3,
  Layers,
  List,
} from 'lucide-react';

export type ResultSectionId =
  | 'itinerary'
  | 'places'
  | 'food'
  | 'budget'
  | 'tips'
  | 'seat-booking'
  | 'modify';

export interface SectionItem {
  id: ResultSectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const SECTIONS_CONFIG: SectionItem[] = [
  { id: 'itinerary', label: 'Day Itinerary', icon: Calendar },
  { id: 'places', label: 'Places to Visit', icon: MapPin },
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'budget', label: 'Budget Cost', icon: DollarSign },
  { id: 'tips', label: 'Travel Tips', icon: Lightbulb },
  { id: 'seat-booking', label: 'Book Seat (₹250)', icon: Armchair, badge: 'Reserve', highlight: true },
  { id: 'modify', label: 'Modify Trip', icon: Edit3 },
];

interface SectionNavProps {
  activeSection: ResultSectionId;
  onSelectSection: (id: ResultSectionId) => void;
  viewMode: 'tabbed' | 'all';
  onToggleViewMode: (mode: 'tabbed' | 'all') => void;
}

export const SectionNav: React.FC<SectionNavProps> = ({
  activeSection,
  onSelectSection,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <div
      id="results-section-nav"
      style={{
        border: '2px solid #000000',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      }}
      className="sticky top-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 mb-6 transition-all"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Navigation Tabs - Horizontally scrollable without wrapping */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {SECTIONS_CONFIG.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                id={`nav-tab-${sec.id}`}
                onClick={() => onSelectSection(sec.id)}
                style={{
                  border: isActive ? '2px solid #000000' : '1.5px solid #000000',
                  background: isActive
                    ? sec.highlight
                      ? '#4338ca'
                      : '#000000'
                    : sec.highlight
                    ? '#eef2ff'
                    : '#ffffff',
                  color: isActive ? '#ffffff' : '#000000',
                }}
                className={`px-3 sm:px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-2xs ${
                  isActive
                    ? 'shadow-md scale-[1.02]'
                    : 'hover:bg-slate-100 hover:border-black'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? sec.highlight
                        ? 'text-amber-300'
                        : 'text-amber-300'
                      : sec.highlight
                      ? 'text-indigo-700'
                      : 'text-slate-800'
                  }`}
                />
                <span>{sec.label}</span>
                {sec.badge && (
                  <span
                    style={{
                      border: '1px solid #000000',
                    }}
                    className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-md uppercase ${
                      isActive ? 'bg-amber-300 text-black' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher: Tabbed (No Scroll) vs Show All */}
        <div className="flex items-center justify-end gap-1.5 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-200">
          <span className="text-[11px] font-mono font-bold text-slate-700 hidden lg:inline-block">
            View:
          </span>
          <div
            style={{ border: '1.5px solid #000000' }}
            className="flex items-center rounded-xl p-0.5 bg-slate-100"
          >
            <button
              id="view-mode-tabbed-btn"
              onClick={() => onToggleViewMode('tabbed')}
              style={{
                border: viewMode === 'tabbed' ? '1.5px solid #000000' : 'none',
              }}
              className={`px-2.5 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tabbed'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-slate-600 hover:text-black'
              }`}
              title="Avoid scrolling: view one section at a time"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-700" />
              <span>Tabbed (No-Scroll)</span>
            </button>

            <button
              id="view-mode-all-btn"
              onClick={() => onToggleViewMode('all')}
              style={{
                border: viewMode === 'all' ? '1.5px solid #000000' : 'none',
              }}
              className={`px-2.5 py-1 text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-slate-600 hover:text-black'
              }`}
              title="View all sections vertically stacked"
            >
              <List className="w-3.5 h-3.5 text-slate-700" />
              <span>Show All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Armchair, ArrowUp, Compass } from 'lucide-react';
import { ResultSectionId } from './SectionNav';

interface QuickDockProps {
  activeSection: ResultSectionId;
  onSelectSection: (id: ResultSectionId) => void;
  onScrollToTop: () => void;
  destination: string;
}

export const QuickDock: React.FC<QuickDockProps> = ({
  onSelectSection,
  onScrollToTop,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      aria-label="Quick Actions"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 print:hidden"
    >
      {/* 1-Click Seat Reservation Button */}
      <button
        type="button"
        id="quick-dock-seat-btn"
        onClick={() => onSelectSection('seat-booking')}
        style={{
          border: '2px solid #000000',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        }}
        className="px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-indigo-700 to-violet-800 text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Jump straight to seat booking reservation"
      >
        <Armchair className="w-4 h-4 text-amber-300 fill-amber-300/30" />
        <span className="hidden xs:inline">Book Seat</span>
        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-mono font-black text-[10px]">
          ₹250
        </span>
      </button>

      {/* Quick Jump to Itinerary */}
      <button
        type="button"
        id="quick-dock-itinerary-btn"
        onClick={() => onSelectSection('itinerary')}
        style={{
          border: '2px solid #000000',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
        }}
        className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl font-black text-xs sm:text-sm bg-white text-black hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md"
        title="View day-by-day itinerary"
      >
        <Compass className="w-4 h-4 text-indigo-700" />
      </button>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          id="quick-dock-scroll-top-btn"
          onClick={onScrollToTop}
          style={{
            border: '2px solid #000000',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
          }}
          className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl font-black text-xs sm:text-sm bg-white text-black hover:bg-black hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md animate-fade-in"
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
};

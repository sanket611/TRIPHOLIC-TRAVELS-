import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  FileText,
  CheckCircle2,
  Printer,
  PlusCircle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenSavedTrips: () => void;
  onOpenDocs: () => void;
  onOpenTests: () => void;
  onScrollToPlanner?: () => void;
  onStartNewTrip?: () => void;
  hasActiveTrip?: boolean;
  savedTripsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSavedTrips,
  onOpenDocs,
  onOpenTests,
  onScrollToPlanner,
  onStartNewTrip,
  hasActiveTrip,
  savedTripsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileAction = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1.5px solid #000000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      }}
      className="sticky top-0 z-40 transition-all"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Touch Target */}
        <div
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-h-[44px] min-w-[44px]"
          onClick={onScrollToPlanner || onStartNewTrip}
          id="brand-logo-btn"
        >
          <div
            style={{
              border: '1.5px solid #000000',
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition-transform"
          >
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-black font-sans">
                Trip<span className="text-violet-700">holic</span>
              </span>
              <span
                style={{
                  border: '1.5px solid #000000',
                }}
                className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider bg-white text-black rounded-md shadow-2xs"
              >
                AI Planner
              </span>
            </div>
            <p className="text-xs text-black hidden sm:block font-bold">Academic Travel Engine</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            id="nav-saved-btn"
            onClick={onOpenSavedTrips}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all relative cursor-pointer shadow-xs"
            title="View Saved Trips"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved Trips</span>
            {savedTripsCount > 0 && (
              <span
                style={{
                  border: '1px solid #000000',
                }}
                className="ml-1 px-1.5 py-0.5 text-xs font-mono font-extrabold bg-black text-white rounded-full leading-none"
              >
                {savedTripsCount}
              </span>
            )}
          </button>

          <button
            id="nav-prompt-docs-btn"
            onClick={onOpenDocs}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all cursor-pointer shadow-xs"
            title="Prompt Engineering Iteration Docs"
          >
            <FileText className="w-4 h-4 text-black" />
            <span>Prompt Docs</span>
          </button>

          <button
            id="nav-test-suite-btn"
            onClick={onOpenTests}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-extrabold text-black hover:bg-black hover:text-white rounded-xl transition-all cursor-pointer shadow-xs"
            title="Automated Test Scenarios"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Test Suite</span>
          </button>

          {hasActiveTrip && onStartNewTrip && (
            <button
              id="nav-new-trip-btn"
              onClick={onStartNewTrip}
              style={{
                border: '1.5px solid #000000',
              }}
              className="flex items-center gap-1.5 px-4 py-2 min-h-[40px] text-xs sm:text-sm font-extrabold text-white bg-black hover:bg-slate-900 rounded-xl transition-all ml-1 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>New Trip</span>
            </button>
          )}

          {hasActiveTrip && (
            <button
              id="nav-print-btn"
              onClick={() => window.print()}
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="p-2 min-h-[40px] min-w-[40px] text-black hover:bg-black hover:text-white rounded-xl transition-colors print:hidden cursor-pointer flex items-center justify-center shadow-xs"
              title="Print Itinerary / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}
        </nav>

        {/* Mobile Quick Action Strip + Hamburger Button */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick Saved Trips Button on Mobile */}
          <button
            id="mobile-nav-saved-btn"
            onClick={onOpenSavedTrips}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="flex items-center justify-center p-2 min-h-[44px] min-w-[44px] text-black rounded-xl relative cursor-pointer active:scale-98 shadow-xs"
            title="Saved Trips"
            aria-label="View Saved Trips"
          >
            <Bookmark className="w-5 h-5 text-amber-500" />
            {savedTripsCount > 0 && (
              <span
                style={{
                  border: '1px solid #000000',
                }}
                className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 text-xs font-mono font-extrabold bg-black text-white rounded-full flex items-center justify-center leading-none shadow-2xs"
              >
                {savedTripsCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1.5px solid #000000',
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-black active:scale-98 rounded-xl transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1.5px solid #000000',
            background: 'rgba(255, 255, 255, 0.95)',
          }}
          className="md:hidden shadow-xl animate-fade-in divide-y divide-black/20 backdrop-blur-xl"
        >
          <div className="p-3 space-y-2">
            <button
              id="mobile-drawer-saved-btn"
              onClick={() => handleMobileAction(onOpenSavedTrips)}
              style={{
                border: '1.5px solid #000000',
                background: 'rgba(255, 255, 255, 0.90)',
              }}
              className="w-full flex items-center justify-between p-3 min-h-[48px] rounded-xl text-left text-sm font-extrabold text-black hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black text-amber-300 flex items-center justify-center border border-black">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span>Saved Trips & Itineraries</span>
              </div>
              {savedTripsCount > 0 && (
                <span
                  style={{
                    border: '1px solid #000000',
                  }}
                  className="px-2 py-0.5 text-xs font-mono font-extrabold bg-black text-white rounded-full"
                >
                  {savedTripsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-drawer-docs-btn"
              onClick={() => handleMobileAction(onOpenDocs)}
              style={{
                border: '1.5px solid #000000',
                background: 'rgba(255, 255, 255, 0.90)',
              }}
              className="w-full flex items-center gap-3 p-3 min-h-[48px] rounded-xl text-left text-sm font-extrabold text-black hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center border border-black">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight font-extrabold">Prompt Engineering Docs</p>
                <p className="text-xs font-bold text-slate-700">Iteration history & comparative matrix</p>
              </div>
            </button>

            <button
              id="mobile-drawer-tests-btn"
              onClick={() => handleMobileAction(onOpenTests)}
              style={{
                border: '1.5px solid #000000',
                background: 'rgba(255, 255, 255, 0.90)',
              }}
              className="w-full flex items-center gap-3 p-3 min-h-[48px] rounded-xl text-left text-sm font-extrabold text-black hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-black text-emerald-400 flex items-center justify-center border border-black">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight font-extrabold">Automated Test Suite</p>
                <p className="text-xs font-bold text-slate-700">Run 6 verified test scenarios</p>
              </div>
            </button>
          </div>

          {(hasActiveTrip || onStartNewTrip) && (
            <div className="p-3 bg-white/80 flex items-center gap-2">
              {onStartNewTrip && (
                <button
                  id="mobile-drawer-new-trip-btn"
                  onClick={() => handleMobileAction(onStartNewTrip)}
                  style={{
                    border: '1.5px solid #000000',
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 min-h-[44px] px-4 bg-black text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-sm active:scale-98 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" />
                  <span>Start New Trip</span>
                </button>
              )}
              {hasActiveTrip && (
                <button
                  id="mobile-drawer-print-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => window.print(), 200);
                  }}
                  style={{
                    border: '1.5px solid #000000',
                    background: 'rgba(255, 255, 255, 0.90)',
                  }}
                  className="px-4 py-3 min-h-[44px] text-black rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};


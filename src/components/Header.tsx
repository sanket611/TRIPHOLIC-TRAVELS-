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
    <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-md border-b border-white/40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Touch Target */}
        <div
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-h-[44px] min-w-[44px]"
          onClick={onScrollToPlanner || onStartNewTrip}
          id="brand-logo-btn"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-950 transition-colors">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-sans">
                Trip<span className="text-indigo-600">holic</span>
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                AI Planner
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block font-medium">Academic Travel Engine</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <button
            id="nav-saved-btn"
            onClick={onOpenSavedTrips}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all relative cursor-pointer"
            title="View Saved Trips"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved Trips</span>
            {savedTripsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-white rounded-full leading-none">
                {savedTripsCount}
              </span>
            )}
          </button>

          <button
            id="nav-prompt-docs-btn"
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="Prompt Engineering Iteration Docs"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Prompt Docs</span>
          </button>

          <button
            id="nav-test-suite-btn"
            onClick={onOpenTests}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="Automated Test Scenarios"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Test Suite</span>
          </button>

          {hasActiveTrip && onStartNewTrip && (
            <button
              id="nav-new-trip-btn"
              onClick={onStartNewTrip}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all ml-1 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Trip</span>
            </button>
          )}

          {hasActiveTrip && (
            <button
              id="nav-print-btn"
              onClick={() => window.print()}
              className="p-2 min-h-[40px] min-w-[40px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-lg transition-colors print:hidden cursor-pointer flex items-center justify-center"
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
            className="flex items-center justify-center p-2 min-h-[44px] min-w-[44px] text-slate-700 hover:bg-slate-100 rounded-xl relative cursor-pointer active:bg-slate-200"
            title="Saved Trips"
            aria-label="View Saved Trips"
          >
            <Bookmark className="w-5 h-5 text-amber-500" />
            {savedTripsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold bg-amber-500 text-white rounded-full flex items-center justify-center leading-none shadow-2xs">
                {savedTripsCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-xl animate-fade-in divide-y divide-slate-100">
          <div className="p-3 space-y-1.5">
            <button
              id="mobile-drawer-saved-btn"
              onClick={() => handleMobileAction(onOpenSavedTrips)}
              className="w-full flex items-center justify-between p-3 min-h-[48px] rounded-xl text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span>Saved Trips & Itineraries</span>
              </div>
              {savedTripsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500 text-white rounded-full">
                  {savedTripsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-drawer-docs-btn"
              onClick={() => handleMobileAction(onOpenDocs)}
              className="w-full flex items-center gap-3 p-3 min-h-[48px] rounded-xl text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight">Prompt Engineering Docs</p>
                <p className="text-[11px] text-slate-500 font-normal">Iteration history & comparative matrix</p>
              </div>
            </button>

            <button
              id="mobile-drawer-tests-btn"
              onClick={() => handleMobileAction(onOpenTests)}
              className="w-full flex items-center gap-3 p-3 min-h-[48px] rounded-xl text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight">Automated Test Suite</p>
                <p className="text-[11px] text-slate-500 font-normal">Run 6 verified test scenarios</p>
              </div>
            </button>
          </div>

          {(hasActiveTrip || onStartNewTrip) && (
            <div className="p-3 bg-slate-50 flex items-center gap-2">
              {onStartNewTrip && (
                <button
                  id="mobile-drawer-new-trip-btn"
                  onClick={() => handleMobileAction(onStartNewTrip)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs active:bg-indigo-700 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
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
                  className="px-4 py-2.5 min-h-[44px] bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
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


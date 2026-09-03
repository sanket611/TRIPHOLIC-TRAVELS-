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
      className="sticky top-0 z-40 transition-all bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
        {/* Brand Logo with Touch Target - Compact status bar */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-h-[40px]"
          onClick={onScrollToPlanner || onStartNewTrip}
          id="brand-logo-btn"
        >
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
          >
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-sans">
                Trip<span className="text-indigo-600">holic</span>
              </span>
              <span
                className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full"
              >
                AI Planner
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            id="nav-saved-btn"
            onClick={onOpenSavedTrips}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all relative cursor-pointer shadow-2xs"
            title="View Saved Trips"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Saved</span>
            {savedTripsCount > 0 && (
              <span
                className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full leading-none"
              >
                {savedTripsCount}
              </span>
            )}
          </button>

          <button
            id="nav-prompt-docs-btn"
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Prompt Engineering Iteration Docs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Docs</span>
          </button>

          <button
            id="nav-test-suite-btn"
            onClick={onOpenTests}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Automated Test Scenarios"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Test Suite</span>
          </button>

          <button
            id="nav-contact-btn"
            onClick={() => {
              const el = document.getElementById('contact-us-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Contact Us on WhatsApp / Gmail"
          >
            <span>Contact Us</span>
          </button>

          {hasActiveTrip && onStartNewTrip && (
            <button
              id="nav-new-trip-btn"
              onClick={onStartNewTrip}
              className="flex items-center gap-1.5 px-3.5 py-1.5 min-h-[36px] text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all ml-0.5 cursor-pointer shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Trip</span>
            </button>
          )}

          {hasActiveTrip && (
            <button
              id="nav-print-btn"
              onClick={() => window.print()}
              className="p-2 min-h-[36px] min-w-[36px] text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-colors print:hidden cursor-pointer flex items-center justify-center shadow-2xs"
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
            className="flex items-center justify-center p-2 min-h-[40px] min-w-[40px] text-slate-700 bg-white border border-slate-200 rounded-xl relative cursor-pointer active:scale-98 shadow-xs"
            title="Saved Trips"
            aria-label="View Saved Trips"
          >
            <Bookmark className="w-5 h-5 text-indigo-600" />
            {savedTripsCount > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full flex items-center justify-center leading-none"
              >
                {savedTripsCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-700 bg-white border border-slate-200 active:scale-98 rounded-xl transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl animate-fade-in divide-y divide-slate-100"
        >
          <div className="p-3 space-y-2">
            <button
              id="mobile-drawer-saved-btn"
              onClick={() => handleMobileAction(onOpenSavedTrips)}
              className="w-full flex items-center justify-between p-3 min-h-[44px] rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span>Saved Trips & Itineraries</span>
              </div>
              {savedTripsCount > 0 && (
                <span
                  className="px-2 py-0.5 text-xs font-mono font-bold bg-indigo-600 text-white rounded-full"
                >
                  {savedTripsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-drawer-docs-btn"
              onClick={() => handleMobileAction(onOpenDocs)}
              className="w-full flex items-center gap-3 p-3 min-h-[44px] rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight font-bold text-slate-900">Prompt Engineering Docs</p>
                <p className="text-xs text-slate-500 font-normal">Iteration history & comparative matrix</p>
              </div>
            </button>

            <button
              id="mobile-drawer-tests-btn"
              onClick={() => handleMobileAction(onOpenTests)}
              className="w-full flex items-center gap-3 p-3 min-h-[44px] rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight font-bold text-slate-900">Automated Test Suite</p>
                <p className="text-xs text-slate-500 font-normal">Run 6 verified test scenarios</p>
              </div>
            </button>

            <button
              id="mobile-drawer-contact-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('contact-us-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full flex items-center gap-3 p-3 min-h-[44px] rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-black flex items-center justify-center border border-black">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight font-bold text-slate-900">Contact Us &amp; Support</p>
                <p className="text-xs text-slate-500 font-normal">WhatsApp &amp; Gmail direct lines</p>
              </div>
            </button>
          </div>

          {(hasActiveTrip || onStartNewTrip) && (
            <div className="p-3 bg-slate-50/80 flex items-center gap-2">
              {onStartNewTrip && (
                <button
                  id="mobile-drawer-new-trip-btn"
                  onClick={() => handleMobileAction(onStartNewTrip)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[42px] px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs active:scale-98 cursor-pointer"
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
                  className="px-4 py-2.5 min-h-[42px] text-slate-700 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:bg-slate-50"
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


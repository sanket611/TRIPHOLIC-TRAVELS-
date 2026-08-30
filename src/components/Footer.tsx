import React from 'react';
import { Sparkles, Shield, Compass, Code, Terminal, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  onOpenTests: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onOpenTests }) => {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-slate-200 bg-white/90 backdrop-blur-xl text-slate-700 print:hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                Trip<span className="text-indigo-600">holic</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                SMART PLANNER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md font-normal">
              An intelligent, full-stack AI travel planner demonstrating structured prompt engineering, strict JSON schema validation, budget optimization, and responsive web architecture.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] text-slate-500 font-medium">
              <span className="text-slate-400">STACK:</span>
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">React 19</span>
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">TypeScript</span>
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">Tailwind CSS</span>
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">Express API</span>
              <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-700">@google/genai</span>
            </div>
          </div>

          {/* Academic Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Academic & Design Docs
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDocs}
                  className="text-slate-600 hover:text-indigo-600 flex items-center gap-2 py-1.5 min-h-[36px] transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Prompt Iterations (V1, V2, V3)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTests}
                  className="text-slate-600 hover:text-indigo-600 flex items-center gap-2 py-1.5 min-h-[36px] transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated Test Suite (1-8)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Safety */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Disclaimer & Guidelines
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
              All financial estimates, transit times, and opening hours are AI-generated approximations. Travelers should verify local operating hours and entry requirements before making final bookings.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Tripholic AI Travel Planner. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GEMINI AI POWERED
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Sparkles, Shield, Compass, Code, Terminal, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  onOpenTests: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onOpenTests }) => {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md text-white print:hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-2xs">
                <Compass className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Trip<span className="text-indigo-400">holic</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-400/30">
                ACADEMIC DEMO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md font-normal">
              An intelligent, full-stack AI travel planner demonstrating structured prompt engineering, strict JSON schema validation, budget optimization, and responsive web architecture.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">STACK:</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">React 19</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">TypeScript</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">Tailwind CSS</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">Express API</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-amber-300">@google/genai</span>
            </div>
          </div>

          {/* Academic Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Academic & Design Docs
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDocs}
                  className="text-slate-300 hover:text-white flex items-center gap-2 py-1.5 min-h-[36px] transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Prompt Iterations (V1, V2, V3)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTests}
                  className="text-slate-300 hover:text-white flex items-center gap-2 py-1.5 min-h-[36px] transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated Test Suite (1-8)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Safety */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Disclaimer & Guidelines
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              All financial estimates, transit times, and opening hours are AI-generated approximations. Travelers should verify local operating hours and entry requirements before making final bookings.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Tripholic AI Travel Planner. Built for academic demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> GEMINI AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Sparkles, Compass, FileText, CheckCircle2, MessageCircle, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  onOpenTests: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onOpenTests }) => {
  const whatsappLink = 'https://wa.me/919876543210?text=Hi%20Tripholic%20Team%2C%20I%20have%20a%20query%20about%20my%20trip%20planning.';
  const emailAddress = 'tripholic.help@gmail.com';
  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent('Travel Planning Inquiry - Tripholic')}`;

  return (
    <footer className="mt-12 sm:mt-16 border-t-2 border-black bg-white text-slate-700 print:hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-lg bg-amber-300 flex items-center justify-center text-black shadow-2xs"
              >
                <Compass className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950 font-heading">
                Trip<span className="text-black underline decoration-amber-400">holic</span>
              </span>
              <span
                style={{ border: '1px solid #000000' }}
                className="px-2 py-0.5 text-[10px] font-mono font-extrabold bg-amber-200 text-black rounded"
              >
                SMART PLANNER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md font-medium">
              An intelligent, full-stack AI travel planner demonstrating structured prompt engineering, strict JSON schema validation, budget optimization, and responsive web architecture.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] font-mono font-bold text-slate-700">
              <span className="text-slate-500">STACK:</span>
              <span style={{ border: '1px solid #000' }} className="bg-slate-100 px-2 py-0.5 rounded text-black">React 19</span>
              <span style={{ border: '1px solid #000' }} className="bg-slate-100 px-2 py-0.5 rounded text-black">TypeScript</span>
              <span style={{ border: '1px solid #000' }} className="bg-slate-100 px-2 py-0.5 rounded text-black">Tailwind CSS</span>
              <span style={{ border: '1px solid #000' }} className="bg-amber-100 px-2 py-0.5 rounded text-black">Gemini AI</span>
            </div>
          </div>

          {/* Contact Us - WhatsApp & Gmail */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-black">
              Contact Us &amp; Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ border: '1px solid #000000' }}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-black font-medium flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-500" />
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">WhatsApp Support</span>
                      <span className="text-[11px] font-mono text-slate-600">+91 98765 43210</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-black shrink-0 mr-1" />
                </a>
              </li>
              <li>
                <a
                  href={gmailWebLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ border: '1px solid #000000' }}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-black font-medium flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      style={{ border: '1px solid #000000' }}
                      className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block leading-tight">Gmail Support</span>
                      <span className="text-[11px] font-mono text-slate-600 truncate block">tripholic.help@gmail.com</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-black shrink-0 mr-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Links & Docs */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-black">
              Docs &amp; Validation
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDocs}
                  className="text-slate-800 hover:text-black font-medium flex items-center gap-2 py-1 min-h-[32px] transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-black shrink-0" />
                  <span>Prompt Iterations (V1, V2, V3)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTests}
                  className="text-slate-800 hover:text-black font-medium flex items-center gap-2 py-1 min-h-[32px] transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Automated Test Suite (1-8)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{ borderTop: '1px solid #000000' }}
          className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-700 text-center sm:text-left font-medium"
        >
          <p>© {new Date().getFullYear()} Tripholic AI Travel Planner. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-black text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GEMINI AI ENGINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Headphones,
  ExternalLink,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface ContactSectionProps {
  initialOpen?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialOpen = false }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialOpen);
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'email' | null>(null);

  const whatsappNumber = '+91 98765 43210';
  const whatsappLink = 'https://wa.me/919876543210?text=Hi%20Tripholic%20Team%2C%20I%20have%20a%20query%20about%20my%20trip%20planning%20and%20itinerary%20customization.';
  const emailAddress = 'tripholic.help@gmail.com';
  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent('Travel Planning Assistance - Tripholic')}&body=${encodeURIComponent('Hi Tripholic Support Team,\n\nI need assistance with my itinerary planning:\n- Destination:\n- Travel Dates:\n- Questions:\n\nThank you!')}`;
  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent('Travel Planning Assistance - Tripholic')}`;

  const handleCopy = (text: string, type: 'whatsapp' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section
      id="contact-us-section"
      style={{
        border: '2px solid #000000',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-4 sm:p-6 mb-12 transition-all bg-white"
    >
      {/* Collapsed State: Only show "Contact Us" Option */}
      {!isExpanded ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="w-10 h-10 rounded-xl bg-amber-300 text-black flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Headphones className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-heading">
                Need Help with Your Trip?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Our support desk is available 24/7 for booking inquiries, itinerary tweaks, and custom routes.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-reveal-contact-us"
            onClick={() => setIsExpanded(true)}
            style={{ border: '2px solid #000000' }}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-amber-400 hover:text-black text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Expanded State: Displays full contact information */
        <div className="animate-fade-in">
          {/* Section Header with Close/Hide option */}
          <div
            style={{ borderBottom: '1.5px solid #000000' }}
            className="pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  style={{ border: '1.5px solid #000000' }}
                  className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs"
                >
                  <Headphones className="w-4 h-4" />
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-heading">
                  Contact Us
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Have questions about your itinerary, group reservations, or custom bookings? Connect with our dedicated travel desk.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                style={{ border: '1px solid #000000' }}
                className="text-xs font-mono font-extrabold text-black bg-emerald-200 px-3 py-1 rounded-lg shadow-2xs flex items-center gap-1.5"
              >
                <Clock className="w-3 h-3 text-emerald-900 shrink-0" />
                24/7 Response Desk
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs font-mono font-bold text-slate-600 hover:text-black px-2.5 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 cursor-pointer"
              >
                Hide
              </button>
            </div>
          </div>

      {/* Main 2 Cards: WhatsApp & Gmail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-6">
        {/* 1. WhatsApp Card */}
        <div
          style={{
            border: '1.5px solid #000000',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.07)',
          }}
          className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-emerald-50/60 to-white flex flex-col justify-between transition-all hover:translate-y-[-2px]"
        >
          <div>
            {/* Top Label & Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div
                  style={{ border: '1.5px solid #000000' }}
                  className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-2xs"
                >
                  <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
                </div>
                <div>
                  <span
                    style={{ border: '1px solid #000000' }}
                    className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-black bg-emerald-200 px-2 py-0.5 rounded-md"
                  >
                    Instant Chat
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
                    WhatsApp Support
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
              Connect directly on WhatsApp for real-time itinerary modifications, on-ground driver contacts, seat bookings, and urgent trip inquiries.
            </p>

            {/* Direct Number Box */}
            <div
              style={{ border: '1px solid #000000' }}
              className="p-3 rounded-xl bg-white flex items-center justify-between gap-2 mb-5 shadow-2xs"
            >
              <div>
                <span className="text-[11px] font-mono font-extrabold uppercase text-slate-500 block">
                  Official WhatsApp Line
                </span>
                <span className="text-sm sm:text-base font-mono font-black text-slate-950">
                  {whatsappNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(whatsappNumber, 'whatsapp')}
                style={{ border: '1px solid #000000' }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-black bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy phone number"
              >
                {copiedType === 'whatsapp' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-700" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ border: '1.5px solid #000000' }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-100" />
          </a>
        </div>

        {/* 2. Gmail Card */}
        <div
          style={{
            border: '1.5px solid #000000',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.07)',
          }}
          className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-rose-50/60 to-white flex flex-col justify-between transition-all hover:translate-y-[-2px]"
        >
          <div>
            {/* Top Label & Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div
                  style={{ border: '1.5px solid #000000' }}
                  className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs"
                >
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span
                    style={{ border: '1px solid #000000' }}
                    className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-black bg-rose-200 px-2 py-0.5 rounded-md"
                  >
                    Formal Inquiries
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
                    Gmail &amp; Email Support
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
              Send us an email for tailored corporate packages, detailed cost vouchers, custom multi-destination routes, and feedback.
            </p>

            {/* Direct Email Box */}
            <div
              style={{ border: '1px solid #000000' }}
              className="p-3 rounded-xl bg-white flex items-center justify-between gap-2 mb-5 shadow-2xs"
            >
              <div className="min-w-0">
                <span className="text-[11px] font-mono font-extrabold uppercase text-slate-500 block">
                  Official Support Email
                </span>
                <span className="text-sm sm:text-base font-mono font-black text-slate-950 truncate block">
                  {emailAddress}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(emailAddress, 'email')}
                style={{ border: '1px solid #000000' }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-black bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Copy email address"
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-700" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={gmailWebLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ border: '1.5px solid #000000' }}
              className="py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Open in Gmail</span>
              <ExternalLink className="w-3 h-3 text-rose-200" />
            </a>
            <a
              href={mailtoLink}
              style={{ border: '1.5px solid #000000' }}
              className="py-3 px-3 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-700" />
              <span>Mail App</span>
            </a>
          </div>
        </div>
      </div>

        {/* Bottom Trust Guarantee */}
        <div
          style={{ border: '1px solid #000000' }}
          className="mt-6 p-4 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-slate-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Average response time: &lt; 15 minutes on WhatsApp • &lt; 2 hours on Gmail</span>
          </div>
          <span className="font-mono font-extrabold text-black bg-amber-200 px-2.5 py-1 rounded-lg border border-black text-[11px]">
            100% Free Travel Advisory
          </span>
        </div>
      </div>
    )}
  </section>
  );
};

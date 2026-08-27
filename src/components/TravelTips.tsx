import React, { useState } from 'react';
import {
  Lightbulb,
  Sun,
  Car,
  CheckSquare,
  Square,
  ShieldCheck,
  CalendarCheck,
  HeartHandshake,
  Armchair,
  ArrowDown,
} from 'lucide-react';
import { TravelTips as TravelTipsType } from '../types';

interface TravelTipsProps {
  travelTips: TravelTipsType;
}

export const TravelTips: React.FC<TravelTipsProps> = ({ travelTips }) => {
  const {
    bestTimeToVisit,
    localTransportation,
    packingList,
    safetyTips,
    bookingSuggestions,
    localEtiquette,
  } = travelTips;

  const [checkedItems, setCheckedItems] = useState<{ [item: string]: boolean }>({});

  const togglePackingItem = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <section
      id="travel-tips-section"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
        }}
        className="pb-5 sm:pb-6 flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-700 border border-amber-500/30">
              <Lightbulb className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              Practical Travel Tips & Essentials
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Logistics, interactive packing checklist, safety advisories, and local customs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 mt-5 sm:mt-6">
        {/* 1. Best Time & Climate */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Optimal Season</h3>
            </div>
            <p
              style={{
                background: 'rgba(255, 255, 255, 0.40)',
                border: '1px solid rgba(255, 255, 255, 0.50)',
              }}
              className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal p-3.5 rounded-xl shadow-2xs"
            >
              {bestTimeToVisit}
            </p>
          </div>
        </div>

        {/* 2. Local Transportation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <Car className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Local Transit</h3>
            </div>
            <ul className="space-y-2">
              {localTransportation.map((transit, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(255, 255, 255, 0.50)',
                  }}
                  className="text-xs text-slate-800 p-2.5 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-blue-600 font-bold shrink-0">▪</span>
                  <span>{transit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Checkable Packing List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between md:row-span-2 lg:row-span-1 shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Packing List</h3>
              </div>
              <span
                style={{
                  background: 'rgba(236, 253, 245, 0.75)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
                className="text-[11px] font-mono font-bold text-emerald-950 px-2 py-0.5 rounded-lg shadow-2xs"
              >
                {Object.values(checkedItems).filter(Boolean).length}/{packingList.length} PACKED
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {packingList.map((item, idx) => {
                const isChecked = checkedItems[item] || false;
                return (
                  <div
                    key={idx}
                    onClick={() => togglePackingItem(item)}
                    style={{
                      background: isChecked ? 'rgba(236, 253, 245, 0.65)' : 'rgba(255, 255, 255, 0.40)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255, 255, 255, 0.50)',
                    }}
                    className={`p-3 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-xs select-none active:scale-[0.99] shadow-2xs backdrop-blur-xs ${
                      isChecked
                        ? 'text-emerald-950 line-through opacity-80'
                        : 'text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="font-semibold text-xs leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Safety Considerations */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Safety Advisories</h3>
            </div>
            <ul className="space-y-2">
              {safetyTips.map((tip, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(255, 255, 255, 0.50)',
                  }}
                  className="text-xs text-slate-800 p-2.5 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-rose-600 font-bold shrink-0">▪</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Booking Suggestions */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Advance Bookings</h3>
            </div>
            <ul className="space-y-2">
              {bookingSuggestions.map((sug, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(255, 255, 255, 0.50)',
                  }}
                  className="text-xs text-slate-800 p-2.5 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-blue-600 font-bold shrink-0">▪</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Relevant Local Etiquette */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.30)',
            border: '1px solid rgba(255, 255, 255, 0.40)',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Local Customs</h3>
            </div>
            <ul className="space-y-2">
              {localEtiquette.map((etiq, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(255, 255, 255, 0.50)',
                  }}
                  className="text-xs text-slate-800 p-2.5 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-teal-600 font-bold shrink-0">▪</span>
                  <span>{etiq}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Jump to Seat Confirmation */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
        }}
        className="mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl backdrop-blur-md shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Armchair className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Ready to lock in your travel dates and seats?
            </p>
            <p className="text-[11px] text-slate-700 font-medium">
              Reserve your priority seat slot with a 100% refundable ₹250 token.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="tips-to-booking-btn"
          onClick={() => {
            const el = document.getElementById('seat-booking-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full sm:w-auto px-5 py-2.5 min-h-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg shrink-0"
        >
          <span>Confirm Your Seat Now</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};

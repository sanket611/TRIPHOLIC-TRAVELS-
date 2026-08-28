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
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[28px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="pb-5 sm:pb-6 flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-black text-amber-300 border border-black shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Practical Travel Tips & Essentials
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-950 font-bold">
            Logistics, interactive packing checklist, safety advisories, and local customs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 mt-5 sm:mt-6">
        {/* 1. Best Time & Climate */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 border border-black text-white flex items-center justify-center shadow-xs">
                <Sun className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Optimal Season</h3>
            </div>
            <p
              style={{
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1.5px solid #000000',
              }}
              className="text-xs sm:text-sm text-black leading-relaxed font-bold p-3.5 rounded-xl shadow-xs"
            >
              {bestTimeToVisit}
            </p>
          </div>
        </div>

        {/* 2. Local Transportation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-black border border-black text-amber-300 flex items-center justify-center shadow-xs">
                <Car className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Local Transit</h3>
            </div>
            <ul className="space-y-2">
              {localTransportation.map((transit, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-xs leading-relaxed font-bold"
                >
                  <span className="text-black font-extrabold shrink-0">▪</span>
                  <span>{transit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Checkable Packing List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between md:row-span-2 lg:row-span-1 shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 border border-black text-white flex items-center justify-center shadow-xs">
                  <CheckSquare className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Packing List</h3>
              </div>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #000000',
                }}
                className="text-xs font-mono font-extrabold text-black px-2.5 py-0.5 rounded-lg shadow-2xs"
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
                      background: isChecked ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.90)',
                      border: '1.5px solid #000000',
                    }}
                    className={`p-3 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm select-none active:scale-[0.99] shadow-xs backdrop-blur-xs font-bold ${
                      isChecked
                        ? 'text-black line-through opacity-60'
                        : 'text-black hover:bg-white'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-black shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-black shrink-0" />
                    )}
                    <span className="font-bold text-xs sm:text-sm leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Safety Considerations */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 border border-black text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Safety Advisories</h3>
            </div>
            <ul className="space-y-2">
              {safetyTips.map((tip, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-xs leading-relaxed font-bold"
                >
                  <span className="text-rose-600 font-extrabold shrink-0">▪</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Booking Suggestions */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-black border border-black text-amber-300 flex items-center justify-center shadow-xs">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Advance Bookings</h3>
            </div>
            <ul className="space-y-2">
              {bookingSuggestions.map((sug, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-xs leading-relaxed font-bold"
                >
                  <span className="text-black font-extrabold shrink-0">▪</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Relevant Local Etiquette */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1.5px solid #000000',
          }}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-black border border-black text-amber-300 flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Local Customs</h3>
            </div>
            <ul className="space-y-2">
              {localEtiquette.map((etiq, idx) => (
                <li
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    border: '1.5px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-xs leading-relaxed font-bold"
                >
                  <span className="text-black font-extrabold shrink-0">▪</span>
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
          background: 'rgba(255, 255, 255, 0.90)',
          border: '1.5px solid #000000',
        }}
        className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-5 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-black border border-black text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <Armchair className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-base font-extrabold text-black">
              Ready to lock in your travel dates and seats?
            </p>
            <p className="text-xs sm:text-sm text-black font-bold">
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
          style={{
            border: '1.5px solid #000000',
          }}
          className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-black hover:bg-slate-900 active:bg-slate-950 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <span>Confirm Your Seat Now</span>
          <ArrowDown className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </section>
  );
};

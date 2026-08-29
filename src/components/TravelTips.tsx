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
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { TravelTips as TravelTipsType } from '../types';

interface TravelTipsProps {
  travelTips: TravelTipsType;
}

export const TravelTips: React.FC<TravelTipsProps> = ({ travelTips }) => {
  const {
    bestTimeToVisit,
    localTransportation,
    packingList: initialPackingList,
    safetyTips,
    bookingSuggestions,
    localEtiquette,
  } = travelTips;

  const [packingList, setPackingList] = useState<string[]>(initialPackingList);
  const [checkedItems, setCheckedItems] = useState<{ [item: string]: boolean }>({});
  const [newItemText, setNewItemText] = useState('');

  const togglePackingItem = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const trimmed = newItemText.trim();
    if (!packingList.includes(trimmed)) {
      setPackingList((prev) => [...prev, trimmed]);
    }
    setNewItemText('');
  };

  const handleCheckAll = () => {
    const map: { [item: string]: boolean } = {};
    packingList.forEach((item) => {
      map[item] = true;
    });
    setCheckedItems(map);
  };

  const handleResetChecklist = () => {
    setCheckedItems({});
  };

  const packedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = packingList.length > 0 ? Math.round((packedCount / packingList.length) * 100) : 0;

  return (
    <section
      id="travel-tips-section"
      style={{
        background: 'rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid #000000',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-[32px] p-4 sm:p-8 mb-8 transition-all"
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1.5px solid #000000',
        }}
        className="pb-5 sm:pb-6 flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-black text-amber-300 border border-black shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Practical Travel Essentials & Logistics
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-950 font-bold">
            Interactive packing progress tracker, transit tips, safety advisories, and local etiquette.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
        {/* 1. Best Time & Climate */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
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
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #000000',
              }}
              className="text-xs sm:text-sm text-black leading-relaxed font-bold p-3.5 rounded-xl shadow-2xs"
            >
              {bestTimeToVisit}
            </p>
          </div>
        </div>

        {/* 2. Local Transportation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-bold"
                >
                  <span className="text-violet-700 font-extrabold shrink-0">▪</span>
                  <span>{transit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Checkable Packing List with Interactive Progress & Add Custom Item */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
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
                <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Packing Tracker</h3>
              </div>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #000000',
                }}
                className="text-xs font-mono font-extrabold text-black px-2.5 py-0.5 rounded-lg shadow-2xs"
              >
                {packedCount}/{packingList.length} PACKED ({progressPercent}%)
              </span>
            </div>

            {/* Packing Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden border border-black/30">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {packingList.map((item, idx) => {
                const isChecked = checkedItems[item] || false;
                return (
                  <div
                    key={idx}
                    onClick={() => togglePackingItem(item)}
                    style={{
                      background: isChecked ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #000000',
                    }}
                    className={`p-2.5 min-h-[40px] rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm select-none active:scale-[0.99] shadow-2xs font-bold ${
                      isChecked
                        ? 'text-slate-600 line-through'
                        : 'text-black hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-700 shrink-0" />
                    )}
                    <span className="font-bold text-xs sm:text-sm leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Item Input */}
            <form onSubmit={handleAddItem} className="mt-3 flex items-center gap-1.5">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add custom packing item..."
                className="flex-1 px-3 py-1.5 text-xs font-bold bg-white text-black border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-black text-white text-xs font-extrabold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-700">
              <button
                type="button"
                onClick={handleCheckAll}
                className="hover:text-black hover:underline cursor-pointer"
              >
                Check All
              </button>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="hover:text-black hover:underline cursor-pointer"
              >
                Reset Checklist
              </button>
            </div>
          </div>
        </div>

        {/* 4. Safety Considerations */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-bold"
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
            background: 'rgba(255, 255, 255, 0.88)',
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-bold"
                >
                  <span className="text-violet-700 font-extrabold shrink-0">▪</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Relevant Local Etiquette */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #000000',
                  }}
                  className="text-xs sm:text-sm text-black p-3 rounded-xl flex items-start gap-2 shadow-2xs leading-relaxed font-bold"
                >
                  <span className="text-violet-700 font-extrabold shrink-0">▪</span>
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
          background: 'rgba(255, 255, 255, 0.92)',
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


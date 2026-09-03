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
        border: '2px solid #000000',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="rounded-3xl p-5 sm:p-8 mb-8 transition-all bg-white"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '1.5px solid #000000' }}
        className="pb-5 sm:pb-6 flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              style={{ border: '1.5px solid #000000' }}
              className="p-1.5 rounded-xl bg-amber-300 text-black shadow-2xs"
            >
              <Lightbulb className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-heading">
              Practical Travel Essentials &amp; Logistics
            </h2>
          </div>
          <p className="text-xs sm:text-base text-slate-700 font-medium">
            Interactive packing progress tracker, transit tips, safety advisories, and local etiquette.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
        {/* 1. Best Time & Climate */}
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-amber-300 text-black flex items-center justify-center shadow-2xs"
              >
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Optimal Season</h3>
            </div>
            <p
              style={{ border: '1px solid #000000' }}
              className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium p-3.5 rounded-xl bg-white shadow-2xs"
            >
              {bestTimeToVisit}
            </p>
          </div>
        </div>

        {/* 2. Local Transportation */}
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-sky-300 text-black flex items-center justify-center shadow-2xs"
              >
                <Car className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Local Transit</h3>
            </div>
            <ul className="space-y-2">
              {localTransportation.map((transit, idx) => (
                <li
                  key={idx}
                  style={{ border: '1px solid #000000' }}
                  className="text-xs sm:text-sm text-slate-800 p-3 rounded-xl flex items-start gap-2 bg-white shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-indigo-900 font-extrabold shrink-0">▪</span>
                  <span>{transit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Checkable Packing List with Interactive Progress & Add Custom Item */}
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 flex flex-col justify-between md:row-span-2 lg:row-span-1"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  style={{ border: '1.5px solid #000000' }}
                  className="w-8 h-8 rounded-xl bg-emerald-300 text-black flex items-center justify-center shadow-2xs"
                >
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Packing Tracker</h3>
              </div>
              <span
                style={{ border: '1px solid #000000' }}
                className="text-xs font-mono font-extrabold text-black bg-emerald-200 px-2.5 py-0.5 rounded-lg shadow-2xs"
              >
                {packedCount}/{packingList.length} ({progressPercent}%)
              </span>
            </div>

            {/* Packing Progress Bar */}
            <div
              style={{ border: '1px solid #000000' }}
              className="w-full bg-slate-200 rounded-full h-2.5 mb-3 overflow-hidden"
            >
              <div
                className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
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
                    style={{ border: '1px solid #000000' }}
                    className={`p-2.5 min-h-[40px] rounded-xl transition-all cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm select-none active:scale-[0.99] shadow-2xs ${
                      isChecked
                        ? 'bg-emerald-100/70 text-slate-500 line-through'
                        : 'bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
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
                style={{ border: '1.5px solid #000000' }}
                className="flex-1 px-3 py-1.5 text-xs bg-white text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-black shadow-2xs"
              />
              <button
                type="submit"
                style={{ border: '1.5px solid #000000' }}
                className="px-3 py-1.5 bg-amber-300 text-black text-xs font-mono font-extrabold rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
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
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-rose-200 text-black flex items-center justify-center shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Safety Advisories</h3>
            </div>
            <ul className="space-y-2">
              {safetyTips.map((tip, idx) => (
                <li
                  key={idx}
                  style={{ border: '1px solid #000000' }}
                  className="text-xs sm:text-sm text-slate-800 p-3 rounded-xl flex items-start gap-2 bg-white shadow-2xs leading-relaxed font-medium"
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
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-purple-200 text-black flex items-center justify-center shadow-2xs"
              >
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Advance Bookings</h3>
            </div>
            <ul className="space-y-2">
              {bookingSuggestions.map((sug, idx) => (
                <li
                  key={idx}
                  style={{ border: '1px solid #000000' }}
                  className="text-xs sm:text-sm text-slate-800 p-3 rounded-xl flex items-start gap-2 bg-white shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-indigo-900 font-extrabold shrink-0">▪</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Relevant Local Etiquette */}
        <div
          style={{ border: '1.5px solid #000000', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{ border: '1.5px solid #000000' }}
                className="w-8 h-8 rounded-xl bg-teal-200 text-black flex items-center justify-center shadow-2xs"
              >
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-black">Local Customs</h3>
            </div>
            <ul className="space-y-2">
              {localEtiquette.map((etiq, idx) => (
                <li
                  key={idx}
                  style={{ border: '1px solid #000000' }}
                  className="text-xs sm:text-sm text-slate-800 p-3 rounded-xl flex items-start gap-2 bg-white shadow-2xs leading-relaxed font-medium"
                >
                  <span className="text-teal-800 font-extrabold shrink-0">▪</span>
                  <span>{etiq}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Jump to Seat Confirmation */}
      <div
        style={{ border: '1.5px solid #000000' }}
        className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-5 rounded-2xl bg-amber-50 shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <div
            style={{ border: '1.5px solid #000000' }}
            className="w-9 h-9 rounded-xl bg-black text-amber-300 flex items-center justify-center shrink-0 shadow-2xs"
          >
            <Armchair className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-base font-black text-slate-950">
              Ready to lock in your travel dates and seats?
            </p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
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
          style={{ border: '1.5px solid #000000' }}
          className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-black hover:bg-slate-900 active:scale-95 text-amber-300 text-xs sm:text-sm font-mono font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <span>Confirm Your Seat Now</span>
          <ArrowDown className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </section>
  );
};


import React from 'react';
import { X, Bookmark, Trash2, Calendar, MapPin, DollarSign, Users, ArrowRight } from 'lucide-react';
import { TripPlan } from '../types';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: TripPlan[];
  onLoadTrip: (trip: TripPlan) => void;
  onDeleteTrip: (id: string) => void;
  onClearAll: () => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onLoadTrip,
  onDeleteTrip,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 border border-amber-300/60 shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Saved Trips & Itineraries</h3>
              <p className="text-xs text-slate-500 font-mono">
                {savedTrips.length} {savedTrips.length === 1 ? 'RECORD' : 'RECORDS'} IN STORAGE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bookmark className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
              <p className="text-sm font-bold text-slate-700">No Saved Trips Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Generate a trip and click "Save Trip" to store it for offline reference.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 mr-1">
                      {trip.tripSummary.destination}
                    </span>
                    {(trip.preferences?.travelStyles && trip.preferences.travelStyles.length > 0
                      ? trip.preferences.travelStyles
                      : trip.tripSummary.travelStyle.split(/[&,]/).map((s) => s.trim()).filter(Boolean)
                    ).map((style, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 rounded border border-indigo-200"
                      >
                        {style}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {trip.tripSummary.duration} Days
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {trip.tripSummary.travelers} Travelers
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      {trip.tripSummary.budgetFormatted}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {trip.tripSummary.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      onLoadTrip(trip);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2.5 min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {savedTrips.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-mono font-semibold text-rose-600 hover:text-rose-800 p-2 min-h-[40px] flex items-center transition-colors cursor-pointer"
            >
              CLEAR ALL
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 min-h-[40px] text-xs font-mono font-bold bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

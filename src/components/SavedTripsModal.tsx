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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        style={{
          border: '1.5px solid #000000',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            borderBottom: '1.5px solid #000000',
          }}
          className="p-4 sm:p-6 flex items-center justify-between bg-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                border: '1.5px solid #000000',
              }}
              className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-amber-300 shrink-0"
            >
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-black font-heading">Saved Trips & Itineraries</h3>
              <p className="text-xs text-black font-mono font-extrabold">
                {savedTrips.length} {savedTrips.length === 1 ? 'RECORD' : 'RECORDS'} IN STORAGE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: '1.5px solid #000000',
            }}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-black hover:bg-black hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-black stroke-1" />
              <p className="text-base font-extrabold text-black">No Saved Trips Yet</p>
              <p className="text-xs sm:text-sm text-black font-bold mt-1 max-w-xs mx-auto">
                Generate a trip and click &ldquo;Save Trip&rdquo; to store it for offline reference.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                style={{
                  border: '1.5px solid #000000',
                }}
                className="p-4 rounded-xl bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-base font-extrabold text-black mr-1">
                      {trip.tripSummary.destination}
                    </span>
                    {(trip.preferences?.travelStyles && trip.preferences.travelStyles.length > 0
                      ? trip.preferences.travelStyles
                      : trip.tripSummary.travelStyle.split(/[&,]/).map((s) => s.trim()).filter(Boolean)
                    ).map((style, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          border: '1px solid #000000',
                        }}
                        className="px-2 py-0.5 text-xs font-mono font-extrabold bg-white text-black rounded"
                      >
                        {style}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-black font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                      {trip.tripSummary.duration} Days
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-black shrink-0" />
                      {trip.tripSummary.travelers} Travelers
                    </span>
                    <span className="flex items-center gap-1 font-extrabold text-black">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      {trip.tripSummary.budgetFormatted}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-black font-bold line-clamp-1">
                    {trip.tripSummary.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/20">
                  <button
                    onClick={() => {
                      onLoadTrip(trip);
                      onClose();
                    }}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider bg-black hover:bg-slate-900 active:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    style={{
                      border: '1.5px solid #000000',
                    }}
                    className="p-2.5 min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl text-black hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
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
          <div
            style={{
              borderTop: '1.5px solid #000000',
            }}
            className="p-4 bg-slate-100 flex items-center justify-between"
          >
            <button
              onClick={onClearAll}
              style={{
                border: '1.5px solid #000000',
              }}
              className="text-xs font-mono font-extrabold text-rose-700 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              CLEAR ALL
            </button>
            <button
              onClick={onClose}
              style={{
                border: '1.5px solid #000000',
              }}
              className="px-5 py-2 min-h-[40px] text-xs sm:text-sm font-mono font-extrabold bg-black text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

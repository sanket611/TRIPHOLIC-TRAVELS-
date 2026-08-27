import React, { useState } from 'react';
import { Wallpaper, NATURE_TRIP_WALLPAPERS } from '../wallpapers';
import { MapPin, RefreshCw, Image as ImageIcon, ChevronRight, Sparkles } from 'lucide-react';

interface BackgroundWallpaperProps {
  currentWallpaper: Wallpaper;
  onChangeWallpaper: (wallpaper?: Wallpaper) => void;
  isCycling?: boolean;
}

export const BackgroundWallpaper: React.FC<BackgroundWallpaperProps> = ({
  currentWallpaper,
  onChangeWallpaper,
  isCycling = false,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      {/* Full-bleed fixed ambient background wallpaper */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-900">
        {/* Scenic Background Image (Vibrant & clearly visible behind translucent cards) */}
        <img
          key={currentWallpaper.id}
          src={currentWallpaper.url}
          alt={`${currentWallpaper.location}, ${currentWallpaper.country}`}
          referrerPolicy="no-referrer"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 transform scale-105 filter brightness-[0.96] contrast-[1.05] saturate-[1.15] ${
            isImageLoaded ? 'opacity-95' : 'opacity-30 blur-sm'
          }`}
        />

        {/* Soft, minimal ambient overlay that preserves vibrant colors while providing smooth contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-black/5 to-slate-950/30" />
      </div>

      {/* Floating Scenic Destination pill & interactive switcher control in bottom-right */}
      <div className="fixed bottom-4 right-4 z-40 print:hidden flex flex-col items-end gap-2">
        {/* Quick selection popover when opened */}
        {isOpenMenu && (
          <div className="mb-2 p-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl text-white w-[calc(100vw-2rem)] sm:w-80 max-w-sm max-h-96 overflow-y-auto animate-fade-in divide-y divide-slate-800/80">
            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 font-sans">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Nature & Trip Destinations</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {NATURE_TRIP_WALLPAPERS.length} Spots
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {NATURE_TRIP_WALLPAPERS.map((wp) => {
                const isSelected = wp.id === currentWallpaper.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      onChangeWallpaper(wp);
                      setIsOpenMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'hover:bg-slate-800/90 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className="w-8 h-8 rounded-lg bg-cover bg-center shrink-0 border border-white/20"
                        style={{ backgroundImage: `url(${wp.url})` }}
                      />
                      <div className="truncate">
                        <p className="truncate font-semibold">{wp.location}</p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {wp.country} • {wp.category}
                        </p>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-[10px] font-mono uppercase bg-white/20 px-1.5 py-0.5 rounded">Active</span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Persistent Pill showing current scenic spot & quick randomizer button */}
        <div className="flex items-center gap-1.5 p-1.5 pl-3 rounded-full bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 shadow-lg text-white transition-all text-xs">
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="flex items-center gap-2 text-left cursor-pointer hover:text-indigo-300 transition-colors pr-1"
            title="Click to view and choose scenic travel wallpapers"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-100 max-w-[140px] sm:max-w-[200px] truncate">
                {currentWallpaper.location}
              </span>
              <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">
                ({currentWallpaper.country})
              </span>
            </div>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          {/* Random shuffle button */}
          <button
            onClick={() => onChangeWallpaper()}
            disabled={isCycling}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Randomize nature & trip wallpaper"
            id="randomize-wallpaper-btn"
          >
            <RefreshCw className={`w-3 h-3 ${isCycling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Change Scene</span>
            <span className="sm:hidden">Change</span>
          </button>
        </div>
      </div>
    </>
  );
};

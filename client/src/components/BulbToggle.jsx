import React from 'react';
import { Lightbulb, LightbulbOff, Sparkles } from 'lucide-react';

const BulbToggle = ({ isLightOn, onToggle, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Visual Label (Hidden on extra small screens) */}
      <div className="hidden sm:flex flex-col items-end text-right">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
          Library Lights
        </span>
        <span className={`text-[10px] font-bold ${isLightOn ? 'text-[#F59E0B]' : 'text-gray-400'}`}>
          {isLightOn ? 'Warm Glow ON' : 'Study Dim OFF'}
        </span>
      </div>

      {/* Slider Toggle Button */}
      <button
        type="button"
        role="switch"
        aria-checked={isLightOn}
        aria-label="Toggle Library Background Lighting"
        onClick={onToggle}
        className={`relative inline-flex h-9 w-16 sm:h-10 sm:w-20 shrink-0 cursor-pointer items-center rounded-full p-1 transition-all duration-500 ease-in-out border backdrop-blur-md shadow-lg ${
          isLightOn
            ? 'bg-amber-950/70 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.45)]'
            : 'bg-black/70 border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Glow halo inside track when light is on */}
        {isLightOn && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/30 animate-pulse pointer-events-none" />
        )}

        {/* Sliding Knob */}
        <span
          className={`pointer-events-none relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-500 ease-out transform ${
            isLightOn
              ? 'translate-x-7 sm:translate-x-10 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.9)] rotate-12'
              : 'translate-x-0 bg-neutral-800 text-neutral-400 border border-neutral-700 shadow-md rotate-0'
          }`}
        >
          {isLightOn ? (
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-amber-300" />
          ) : (
            <LightbulbOff className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
          )}
        </span>
      </button>
    </div>
  );
};

export default BulbToggle;

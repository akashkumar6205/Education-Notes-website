import React from 'react';

const Logo = ({ className = '', showSubtitle = true, lightMode = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Vector Logo Icon */}
      <div className="relative w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(20,184,166,0.3)]"
        >
          {/* Background circular arc */}
          <path
            d="M 22 55 A 42 42 0 0 1 95 35"
            stroke="#14B8A6"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Plant Leaves / Growth Sprout */}
          <path
            d="M 58 45 C 50 35 44 25 56 18 C 66 22 64 35 58 45 Z"
            fill="#2DD4BF"
          />
          <path
            d="M 66 38 C 65 26 73 18 82 20 C 86 30 78 37 66 38 Z"
            fill="#10B981"
          />
          <path
            d="M 78 30 C 79 22 86 16 93 18 C 96 25 89 30 78 30 Z"
            fill="#34D399"
          />

          {/* Upward Growth Arrow */}
          <path
            d="M 52 52 C 60 40 70 28 88 18"
            stroke="#0D9488"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon
            points="84,12 98,17 91,29"
            fill="#0D9488"
          />

          {/* Open Book Left Pages */}
          <path
            d="M 20 85 C 20 62 20 52 20 52 C 28 50 42 47 56 56 L 56 94 C 42 86 28 83 20 85 Z"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <path
            d="M 16 88 C 16 66 16 56 16 56 C 24 54 38 51 52 60 L 52 97 C 38 89 24 86 16 88 Z"
            fill="#0F2F44"
          />
          {/* Book Page Lines */}
          <line x1="26" y1="62" x2="48" y2="67" stroke="#0F2F44" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="26" y1="70" x2="48" y2="75" stroke="#0F2F44" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="26" y1="78" x2="48" y2="83" stroke="#0F2F44" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* Right Book / Vault Cover */}
          <path
            d="M 56 56 C 70 47 88 50 96 52 L 96 85 C 88 83 70 86 56 94 Z"
            fill="#0F2F44"
            stroke="#0F172A"
            strokeWidth="2.5"
          />

          {/* Vault Door (Circle) */}
          <circle cx="80" cy="73" r="18" fill="#133D56" stroke="#0A1D2C" strokeWidth="2" />
          <circle cx="80" cy="73" r="14" fill="#0C2536" stroke="#D97706" strokeWidth="2.5" strokeDasharray="2 3" />

          {/* Vault Golden Rim & Handle Bars */}
          <circle cx="80" cy="73" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          {/* Keyhole */}
          <circle cx="80" cy="72" r="1.8" fill="#0F172A" />
          <polygon points="79,72 81,72 81.5,76 78.5,76" fill="#0F172A" />

          {/* Vault Spokes/Handles */}
          <line x1="80" y1="62" x2="80" y2="65" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="81" x2="80" y2="84" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="69" y1="73" x2="72" y2="73" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="88" y1="73" x2="91" y2="73" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="65" x2="74" y2="67" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="79" x2="88" y2="81" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Book Spine Center */}
          <path d="M 56 56 L 56 94" stroke="#0A1D2C" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center min-w-0">
        <span className={`text-base sm:text-2xl font-black tracking-tight leading-none ${lightMode ? 'text-slate-900' : 'text-white'}`}>
          Edu<span className="text-[#14B8A6]">Vault</span>
        </span>
        {showSubtitle && (
          <span className="text-[7.5px] sm:text-[10px] font-bold tracking-tight sm:tracking-[0.18em] text-teal-400/90 uppercase mt-0.5 leading-tight block whitespace-normal sm:whitespace-nowrap">
           Less searching, more studying
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;

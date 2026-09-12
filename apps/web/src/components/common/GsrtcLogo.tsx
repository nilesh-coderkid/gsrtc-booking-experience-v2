import React from 'react';

interface GsrtcEmblemProps {
  className?: string;
  size?: number;
}

export const GsrtcEmblem: React.FC<GsrtcEmblemProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md ${className}`}
    >
      <defs>
        {/* Outer Red Ring Gradient */}
        <linearGradient id="gsrtcRedGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#9A0007" />
        </linearGradient>

        {/* Navy Center Gradient */}
        <linearGradient id="gsrtcNavyGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1E33" />
          <stop offset="100%" stopColor="#001629" />
        </linearGradient>

        {/* Golden Star Gradient */}
        <linearGradient id="gsrtcGoldGrad" x1="32" y1="14" x2="32" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* 1. Outer Vermilion Rim */}
      <circle cx="32" cy="32" r="31" fill="url(#gsrtcRedGrad)" />

      {/* 2. White Structural Delineation Ring */}
      <circle cx="32" cy="32" r="28" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />

      {/* 3. Deep Royal Navy Field */}
      <circle cx="32" cy="32" r="26.5" fill="url(#gsrtcNavyGrad)" />

      {/* 4. Golden Emblem Star */}
      <path
        d="M32 15 L35.8 24.8 L46.5 25.4 L38.3 32.2 L40.8 42.6 L32 37 L23.2 42.6 L25.7 32.2 L17.5 25.4 L28.2 24.8 Z"
        fill="url(#gsrtcGoldGrad)"
        stroke="#FFFFFF"
        strokeWidth="0.5"
      />

      {/* 5. Center Core Seal */}
      <circle cx="32" cy="29.5" r="6" fill="#C62828" stroke="#FFFFFF" strokeWidth="1.75" />

      {/* 6. Saffron Highway Transit Arc */}
      <path
        d="M20 46 C25 51.5 39 51.5 44 46"
        stroke="#E8590C"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

interface GsrtcBrandmarkProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: number;
}

export const GsrtcBrandmark: React.FC<GsrtcBrandmarkProps> = ({
  className = '',
  variant = 'light',
  size = 46,
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer select-none ${className}`}>
      <GsrtcEmblem size={size} className="transition-transform duration-300 group-hover:scale-105" />

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-black text-[22px] tracking-tight leading-none font-serif ${
              isDark ? 'text-white' : 'text-[#0B1E33]'
            }`}
          >
            GSRTC
          </span>
          <span className="text-[10px] bg-red-500/15 text-[#D32F2F] border border-red-500/30 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            નિગમ
          </span>
        </div>
        <span
          className={`text-[11px] font-semibold mt-1 leading-tight whitespace-nowrap ${
            isDark ? 'text-white/80' : 'text-slate-500'
          }`}
        >
          ગુજરાત રાજ્ય માર્ગ વાહનવ્યવહાર નિગમ
        </span>
      </div>
    </div>
  );
};

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showTagline = true,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
  }[size];

  const brandTextSize = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Visual Logo Mark */}
      <div
        className={`relative ${iconDimensions} rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-1.5 flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ring-1 ring-white/20`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Mountain Contour */}
          <path
            d="M6 32 L16 18 L22 26 L28 17 L36 32 Z"
            fill="rgba(255,255,255,0.22)"
          />
          {/* Golden Sun / Horizon beacon */}
          <circle cx="28" cy="11" r="4" fill="#fbbf24" />
          {/* Stylized Jatriq Flow 'J' */}
          <path
            d="M13 11 H23 C28 11 30 13.5 30 17 C30 23 24 28 17 28 C13.5 28 11 26 11 23 C11 20.8 12.8 19.5 15 19.5 C17 19.5 18.2 21 17.5 22.8 C18.5 23.2 20 23.4 21.5 23.4 C25 23.4 26.8 20.8 26.8 17 C26.8 14.5 24.5 13.5 22 13.5 H13 V11 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Typography Branding */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-sans font-extrabold tracking-tight ${brandTextSize} ${
              isLight ? 'text-white' : 'text-stone-900'
            }`}
          >
            যাত্রিক
          </span>
          <span
            className={`text-xs font-semibold tracking-wider uppercase font-mono ${
              isLight ? 'text-emerald-400' : 'text-emerald-800'
            }`}
          >
            Jatriq
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] font-medium tracking-wide mt-0.5 ${
              isLight ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            ভ্রমণ হোক নিশ্চিন্ত ও সুন্দর
          </span>
        )}
      </div>
    </div>
  );
};

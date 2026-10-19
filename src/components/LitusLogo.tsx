import React from 'react';

interface LitusLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  interactive?: boolean;
}

export const LitusLogo: React.FC<LitusLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', badge: 'text-[11px]' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', badge: 'text-xs' },
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Mark: Fire (LIT) enveloped by Community Circle & Lotus petal (US) */}
      <div className={`relative ${icon} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="litFireGrad" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <linearGradient id="usCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="usDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Outer Community Arc (US) - Open embracing circular shield / lotus petal */}
          <circle
            cx="50"
            cy="52"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeDasharray="180 30"
            strokeLinecap="round"
            className="text-slate-800 dark:text-slate-200 opacity-90 transition-all duration-300"
          />

          {/* Inner Lotus Base Arc */}
          <path
            d="M 22 64 C 36 78, 64 78, 78 64"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Central Ascending Flame Core (LIT) */}
          <path
            d="M 50 18 C 55 35, 66 46, 66 58 C 66 69, 58 76, 50 76 C 42 76, 34 69, 34 58 C 34 46, 45 35, 50 18 Z"
            fill="url(#litFireGrad)"
            className="drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]"
          />

          {/* Center Inner White Spark */}
          <path
            d="M 50 36 C 52 46, 58 53, 58 60 C 58 65, 54 69, 50 69 C 46 69, 42 65, 42 60 C 42 53, 48 46, 50 36 Z"
            fill="#ffffff"
            className="opacity-95"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex items-baseline tracking-widest font-display font-extrabold">
          <span className={`${text} text-blue-600 dark:text-sky-400 transition-colors`}>
            LIT
          </span>
          <span className={`${text} text-slate-900 dark:text-white transition-colors`}>
            US
          </span>
        </div>
      )}
    </div>
  );
};

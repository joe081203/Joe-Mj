import React from 'react';

export type WaveVariant = 
  | 'editorial-to-collectibles' 
  | 'collectibles-to-campaign' 
  | 'campaign-to-products' 
  | 'products-to-story' 
  | 'story-to-footer'
  | 'hero-to-products';

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  variant?: WaveVariant;
  className?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  position = 'bottom',
  variant = 'editorial-to-collectibles',
  className = '',
}) => {
  const idPrefix = variant;

  const getTargetBg = () => {
    switch (variant) {
      case 'editorial-to-collectibles':
        return '#0c2069';
      case 'collectibles-to-campaign':
        return '#050508';
      case 'campaign-to-products':
        return '#070b14';
      case 'products-to-story':
        return '#060a12';
      case 'story-to-footer':
        return '#04070c';
      case 'hero-to-products':
      default:
        return '#070b14';
    }
  };

  const targetBg = getTargetBg();

  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none select-none ${
        position === 'top' ? 'rotate-180 -mb-1' : '-mt-1'
      } ${className}`}
      style={{ height: '70px' }}
      aria-hidden="true"
    >
      <svg
        className="relative block w-[200%] h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Layer 3 Background Wave Gradient */}
          <linearGradient id={`${idPrefix}-grad-back`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor={targetBg} stopOpacity="0.1" />
          </linearGradient>

          {/* Layer 2 Mid Wave Gradient */}
          <linearGradient id={`${idPrefix}-grad-mid`} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.4" />
            <stop offset="100%" stopColor={targetBg} stopOpacity="0.85" />
          </linearGradient>

          {/* Layer 1 Foreground Wave Gradient */}
          <linearGradient id={`${idPrefix}-grad-front`} x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
            <stop offset="30%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor={targetBg} stopOpacity="1" />
          </linearGradient>

          {/* Glowing Crest Highlight Gradient */}
          <linearGradient id={`${idPrefix}-crest`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Layer 3 (Background wave - Slow undulating with cyan glow) */}
        <path
          d="M0,10 C180,95 380,-30 520,50 C680,130 920,-10 1200,65 L1200,120 L0,120 Z"
          fill={`url(#${idPrefix}-grad-back)`}
          className="animate-wave-slow"
        />

        {/* Layer 2 (Mid wave - Reverse flowing with marine blue gradient) */}
        <path
          d="M0,25 C220,105 460,-5 670,70 C870,140 1060,15 1200,80 L1200,120 L0,120 Z"
          fill={`url(#${idPrefix}-grad-mid)`}
          stroke={`url(#${idPrefix}-crest)`}
          strokeWidth="0.75"
          className="animate-wave-flow-reverse"
        />

        {/* Layer 1 (Foreground primary solid gradient wave) */}
        <path
          d="M0,48 C160,122 360,15 560,78 C760,140 960,25 1200,92 L1200,120 L0,120 Z"
          fill={`url(#${idPrefix}-grad-front)`}
          stroke={`url(#${idPrefix}-crest)`}
          strokeWidth="1.2"
          className="animate-wave-flow drop-shadow-[0_-3px_8px_rgba(56,189,248,0.3)]"
        />
      </svg>
    </div>
  );
};

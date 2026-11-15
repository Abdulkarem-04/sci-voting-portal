import React from 'react';

export type CardPatternVariant = 'grid-nodes' | 'iso-waves' | 'honor-crest';

interface Props {
  variant?: CardPatternVariant;
  className?: string;
}

export const CardPatternBg: React.FC<Props> = ({
  variant = 'grid-nodes',
  className = '',
}) => {
  if (variant === 'honor-crest') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      >
        <svg
          className="absolute right-0 top-0 h-full w-72 text-emerald-500/20"
          viewBox="0 0 280 220"
          fill="none"
        >
          <circle cx="220" cy="60" r="88" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="220" cy="60" r="60" stroke="#A1A1AA" strokeOpacity="0.22" strokeWidth="1" />
          <circle cx="220" cy="60" r="32" stroke="currentColor" strokeWidth="1" />
          <path
            d="M220 18 L244 46 L220 102 L196 46 Z"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M170 60 L270 60 M220 10 L220 110"
            stroke="#A1A1AA"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <path
            d="M110 180 L280 110 M140 210 L280 152"
            stroke="#A1A1AA"
            strokeOpacity="0.16"
            strokeWidth="1"
          />
          <circle cx="220" cy="60" r="3" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (variant === 'iso-waves') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      >
        <svg
          className="absolute right-0 bottom-0 h-full w-64 text-zinc-300"
          viewBox="0 0 240 160"
          fill="none"
        >
          <path
            d="M40 160 C 90 120, 140 140, 240 72"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          <path
            d="M75 160 C 125 128, 165 144, 240 96"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <path
            d="M115 160 C 155 138, 190 148, 240 120"
            stroke="#10B981"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <circle cx="206" cy="112" r="2.5" fill="#10B981" fillOpacity="0.3" />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      <svg
        className="absolute right-0 top-0 h-44 w-48 text-zinc-300"
        viewBox="0 0 200 180"
        fill="none"
      >
        <path
          d="M40 0 V180 M80 0 V180 M120 0 V180 M160 0 V180"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="0.8"
        />
        <path
          d="M0 36 H200 M0 72 H200 M0 108 H200 M0 144 H200"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="0.8"
        />
        <path
          d="M80 72 L120 36 L160 36"
          stroke="#10B981"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <circle cx="80" cy="72" r="2.5" fill="#10B981" fillOpacity="0.35" />
        <circle cx="120" cy="36" r="2.5" fill="currentColor" fillOpacity="0.65" />
        <circle cx="160" cy="36" r="2.5" fill="#10B981" fillOpacity="0.35" />
      </svg>
    </div>
  );
};

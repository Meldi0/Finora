interface FinoraLogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  withGlow?: boolean;
}

export default function FinoraLogo({ size = 'md', className = '', withGlow = false }: FinoraLogoProps) {
  let pixelSize = 40;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'sm':
        pixelSize = 28;
        break;
      case 'md':
        pixelSize = 40;
        break;
      case 'lg':
        pixelSize = 56;
        break;
      case 'xl':
        pixelSize = 80;
        break;
      case 'hero':
        pixelSize = 110;
        break;
    }
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Optional ambient glow */}
      {withGlow && (
        <div
          className="absolute -inset-1.5 bg-gradient-to-tr from-[#FF6584] via-[#FFA94D] to-[#368F7B] rounded-[1.5rem] blur-md opacity-50 pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm relative"
      >
        <defs>
          {/* Main Background Squircle Gradient */}
          <linearGradient id="squircleGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF758C" />
            <stop offset="50%" stopColor="#FF6584" />
            <stop offset="100%" stopColor="#FFA94D" />
          </linearGradient>

          {/* White Glass Highlight */}
          <linearGradient id="glassShineClean" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Base Squircle Container ── */}
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="28"
          fill="url(#squircleGradClean)"
        />

        {/* Glass Highlight Rim */}
        <rect
          x="3.5"
          y="3.5"
          width="93"
          height="93"
          rx="26.5"
          stroke="url(#glassShineClean)"
          strokeWidth="3"
        />

        {/* ── Crisp Bold 'F' Emblem (High Legibility at All Scales) ── */}
        {/* Stem of F */}
        <rect
          x="26"
          y="24"
          width="16"
          height="52"
          rx="8"
          fill="#FFFFFF"
        />

        {/* Top Arm of F */}
        <rect
          x="26"
          y="24"
          width="48"
          height="16"
          rx="8"
          fill="#FFFFFF"
        />

        {/* Middle Arm of F */}
        <rect
          x="26"
          y="44"
          width="36"
          height="14"
          rx="7"
          fill="#FFFFFF"
        />

        {/* Sparkle Star / Growth Dot in Top Right */}
        <circle
          cx="76"
          cy="24"
          r="6"
          fill="#FFFFFF"
        />
        <circle
          cx="74"
          cy="70"
          r="8"
          fill="#FFFFFF"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
}

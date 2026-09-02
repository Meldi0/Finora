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
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Optional ambient glow */}
      {withGlow && (
        <div
          className="absolute -inset-2 bg-gradient-to-tr from-[#FF6584] via-[#FFA94D] to-[#368F7B] rounded-[2rem] blur-xl opacity-50 animate-pulse-soft pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md relative"
      >
        <defs>
          {/* Main Background Squircle Gradient */}
          <linearGradient id="squircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA07A" />
            <stop offset="45%" stopColor="#FF6584" />
            <stop offset="100%" stopColor="#7D7AFF" />
          </linearGradient>

          {/* Golden Ribbon Gradient */}
          <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#FFA94D" />
            <stop offset="100%" stopColor="#FF6584" />
          </linearGradient>

          {/* Mint Ribbon Gradient */}
          <linearGradient id="mintRibbon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#368F7B" />
            <stop offset="100%" stopColor="#70C1B3" />
          </linearGradient>

          {/* White Glass Highlight */}
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Drop shadow for 3D depth */}
          <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" floodColor="#1C1B18" />
          </filter>
        </defs>

        {/* ── Base Squircle Container ── */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="26"
          fill="url(#squircleGrad)"
        />

        {/* Inner Glass Highlight Curve */}
        <rect
          x="5.5"
          y="5.5"
          width="89"
          height="89"
          rx="24.5"
          stroke="url(#glassShine)"
          strokeWidth="3"
        />

        {/* ── Iconic Emblem: Modern Stylized Flowing Ribbon 'F' + Sparkle Core ── */}
        
        {/* Vertical Pillar / Stem of F (Curved rounded capsule) */}
        <path
          d="M 28 26 C 28 22 32 19 36 21 L 43 24 C 47 26 49 30 49 34 L 49 72 C 49 76 44 79 40 77 L 34 74 C 30 72 28 68 28 64 Z"
          fill="#FFFFFF"
          filter="url(#ribbonShadow)"
        />

        {/* Top Horizontal Arch / Wing */}
        <path
          d="M 38 21 C 48 18 64 19 74 25 C 79 28 80 34 76 38 C 72 42 66 41 61 38 C 54 34 46 34 40 37 Z"
          fill="url(#goldRibbon)"
          filter="url(#ribbonShadow)"
        />

        {/* Middle Cross Ribbon with Mint & Gold Accent */}
        <path
          d="M 39 44 C 48 42 60 43 68 48 C 72 51 71 57 66 59 C 62 61 57 58 52 55 C 47 52 42 53 38 56 Z"
          fill="#FFFFFF"
          filter="url(#ribbonShadow)"
        />

        {/* Emerald / Mint Growth Dot */}
        <circle
          cx="71"
          cy="69"
          r="9"
          fill="url(#mintRibbon)"
          filter="url(#ribbonShadow)"
        />

        {/* Sparkle 4-point Star Accent */}
        <path
          d="M 71 63 C 71 66 73 69 76 69 C 73 69 71 72 71 75 C 71 72 69 69 66 69 C 69 69 71 66 71 63 Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

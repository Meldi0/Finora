import { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

interface LiquidBlob {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
  pulsePhase: number;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);

  // ── 60 FPS Living Dynamic Liquid Blob & Aura Engine ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    // Cap dpr at 1.5 for ultra-fast mobile GPU performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = (canvas.width = Math.floor(window.innerWidth * dpr));
    let height = (canvas.height = Math.floor(window.innerHeight * dpr));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
    };
    window.addEventListener('resize', handleResize);

    // Rich, vibrant Apple pastel palette
    const blobColors = [
      { hex: '#FF6584' },
      { hex: '#FFA94D' },
      { hex: '#368F7B' },
      { hex: '#7D7AFF' },
      { hex: '#FF758C' },
      { hex: '#F4C56C' },
      { hex: '#70C1B3' },
      { hex: '#FF8E71' },
    ];

    // Create 6 optimized liquid blobs that float, wobble & morph
    const blobs: LiquidBlob[] = [
      {
        x: width * 0.25,
        y: height * 0.25,
        baseRadius: Math.min(width, height) * 0.42,
        radius: Math.min(width, height) * 0.42,
        vx: 0.7,
        vy: 0.5,
        color: blobColors[0].hex,
        wobbleSpeed: 0.02,
        wobbleOffset: 0,
        pulsePhase: 0,
      },
      {
        x: width * 0.78,
        y: height * 0.28,
        baseRadius: Math.min(width, height) * 0.45,
        radius: Math.min(width, height) * 0.45,
        vx: -0.6,
        vy: 0.4,
        color: blobColors[1].hex,
        wobbleSpeed: 0.018,
        wobbleOffset: Math.PI / 3,
        pulsePhase: 1.2,
      },
      {
        x: width * 0.82,
        y: height * 0.78,
        baseRadius: Math.min(width, height) * 0.48,
        radius: Math.min(width, height) * 0.48,
        vx: -0.5,
        vy: -0.6,
        color: blobColors[2].hex,
        wobbleSpeed: 0.015,
        wobbleOffset: Math.PI / 2,
        pulsePhase: 2.4,
      },
      {
        x: width * 0.2,
        y: height * 0.8,
        baseRadius: Math.min(width, height) * 0.44,
        radius: Math.min(width, height) * 0.44,
        vx: 0.6,
        vy: -0.5,
        color: blobColors[3].hex,
        wobbleSpeed: 0.022,
        wobbleOffset: Math.PI,
        pulsePhase: 3.6,
      },
      {
        x: width * 0.5,
        y: height * 0.48,
        baseRadius: Math.min(width, height) * 0.36,
        radius: Math.min(width, height) * 0.36,
        vx: -0.4,
        vy: 0.6,
        color: blobColors[4].hex,
        wobbleSpeed: 0.025,
        wobbleOffset: (3 * Math.PI) / 2,
        pulsePhase: 4.8,
      },
      {
        x: width * 0.62,
        y: height * 0.55,
        baseRadius: Math.min(width, height) * 0.32,
        radius: Math.min(width, height) * 0.32,
        vx: 0.5,
        vy: -0.4,
        color: blobColors[5].hex,
        wobbleSpeed: 0.019,
        wobbleOffset: Math.PI / 4,
        pulsePhase: 0.8,
      },
    ];

    // 15 Mobile-friendly Stardust Particles
    const particles = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 2 + 1.5) * dpr,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      color: blobColors[Math.floor(Math.random() * blobColors.length)].hex,
    }));

    let time = 0;

    const render = () => {
      time += 0.02;

      ctx.fillStyle = '#FAF5EF';
      ctx.fillRect(0, 0, width, height);

      blobs.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;

        const pad = b.radius * 0.3;
        if (b.x < -pad) {
          b.x = -pad;
          b.vx *= -1;
        } else if (b.x > width + pad) {
          b.x = width + pad;
          b.vx *= -1;
        }

        if (b.y < -pad) {
          b.y = -pad;
          b.vy *= -1;
        } else if (b.y > height + pad) {
          b.y = height + pad;
          b.vy *= -1;
        }

        b.radius =
          b.baseRadius +
          Math.sin(time * 2 + b.wobbleOffset) * (b.baseRadius * 0.14) +
          Math.cos(time * 3 + b.pulsePhase) * (b.baseRadius * 0.07);

        const grad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.05, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.6, b.color);
        grad.addColorStop(1, 'rgba(250, 245, 239, 0)');

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      });

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 3 + p.x));
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ── Timeline Control ──
  useEffect(() => {
    const drawnTimer = setTimeout(() => {
      setIsDrawn(true);
    }, 2400);

    const exitTimer = setTimeout(() => {
      handleEnterApp();
    }, 3800);

    return () => {
      clearTimeout(drawnTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleEnterApp = () => {
    setIsFadingOut(true);
    setTimeout(onFinish, 500);
  };

  return (
    <div
      onClick={handleEnterApp}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FAF5EF] overflow-hidden select-none cursor-pointer transition-all duration-500 ease-out gpu-layer ${
        isFadingOut
          ? 'opacity-0 scale-105 blur-md pointer-events-none'
          : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none filter blur-md"
      />

      <div className="absolute inset-0 bg-[#FAF5EF]/20 backdrop-blur-[4px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-6">
        <div className="absolute -inset-10 bg-gradient-to-r from-[#FF6584]/35 via-[#FFA94D]/35 to-[#368F7B]/35 rounded-full blur-2xl opacity-80" />

        <svg
          viewBox="0 0 560 190"
          className="w-72 sm:w-[460px] h-auto drop-shadow-[0_12px_30px_rgba(0,0,0,0.18)] overflow-visible relative"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="liveHelloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C1B18" />
              <stop offset="32%" stopColor="#FF6584" />
              <stop offset="68%" stopColor="#FFA94D" />
              <stop offset="100%" stopColor="#FF758C" />
            </linearGradient>

            <filter id="liveHelloShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.25" floodColor="#1C1B18" />
            </filter>
          </defs>

          <path
            d="M 50 140 C 55 120 75 40 90 25 C 100 15 112 20 108 42 C 102 78 95 130 95 150 C 95 150 106 98 126 86 C 144 75 160 86 150 118 C 144 136 130 148 155 148 C 178 148 196 112 196 98 C 196 82 176 86 176 114 C 176 142 198 150 220 144 C 238 138 248 88 254 40 C 260 22 272 22 272 44 C 272 82 260 134 266 150 C 272 156 290 150 302 130 C 314 108 320 62 326 40 C 332 22 344 22 344 44 C 344 82 332 134 338 150 C 344 156 360 150 376 130 C 394 106 416 94 428 112 C 440 128 426 152 402 150 C 378 148 382 122 402 106 C 420 92 454 100 472 110 C 496 124 514 136 530 136"
            stroke="url(#liveHelloGradient)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#liveHelloShadow)"
            style={{
              strokeDasharray: 1800,
              strokeDashoffset: 0,
              animation: 'drawLiveHello 2.2s cubic-bezier(0.42, 0, 0.22, 1) forwards',
            }}
          />

          <g
            className="transition-opacity duration-500"
            style={{ opacity: isDrawn ? 1 : 0 }}
          >
            <circle cx="530" cy="136" r="6.5" fill="#FF6584" />
          </g>
        </svg>

        <p className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-charcoal/35 mt-4 transition-opacity duration-700" style={{ opacity: isDrawn ? 1 : 0.4 }}>
          Finora
        </p>
      </div>

      <style>{`
        @keyframes drawLiveHello {
          0% {
            stroke-dashoffset: 1800;
            opacity: 0.1;
          }
          10% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

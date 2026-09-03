import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WeekDay } from '../../hooks/useWeekStrip';

interface WeekHeaderStripProps {
  title: string;
  gradientFromTo: string; // e.g. "from-[#FF9080] to-[#FF6584]"
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  weekDays: WeekDay[];
  isCurrentWeek: boolean;
  goBack: () => void;
  goForward: () => void;
  selectDay: (dateStr: string) => void;
}

export default function WeekHeaderStrip({
  title,
  gradientFromTo,
  leftElement,
  rightElement,
  weekDays,
  isCurrentWeek,
  goBack,
  goForward,
  selectDay,
}: WeekHeaderStripProps) {
  return (
    <header className={`bg-gradient-to-b ${gradientFromTo} text-white pt-6 pb-14 px-5 select-none relative overflow-hidden transition-colors duration-500`}>
      {/* Subtle Background Glow Animation */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Header Top Bar */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          {leftElement ? (
            leftElement
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center font-black text-sm border-2 border-white/30 shadow-sm">
              F
            </div>
          )}
        </div>

        <h1 className="text-[11px] font-black tracking-[0.2em] uppercase text-white/95 text-center drop-shadow-xs">
          {title}
        </h1>

        <div className="flex items-center gap-1.5">
          {rightElement}
        </div>
      </div>

      {/* Navigable Interactive Week Day Strip */}
      <div className="flex items-center gap-1.5 relative z-10">
        {/* Back Button */}
        <button
          type="button"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 active:scale-85 border-2 border-white/30 flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 shadow-xs"
          title="Minggu Sebelumnya"
          aria-label="Minggu Sebelumnya"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* 7 Days Pills */}
        <div className="flex-1 flex items-center justify-between gap-1">
          {weekDays.map((d) => {
            const active = d.isSelected || d.isToday;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => selectDay(d.dateStr)}
                className={`flex-1 text-center py-1.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 select-none ${
                  d.isSelected
                    ? 'bg-[#1C1B18] text-white ring-2 ring-white/50 scale-105 shadow-md font-black'
                    : d.isToday
                    ? 'bg-white/30 text-white ring-1 ring-white/60 font-black'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                }`}
                title={`${d.name} ${d.date}`}
              >
                <p className="text-[8px] font-black uppercase tracking-wider">{d.name}</p>
                <p className={`font-black mt-0.5 leading-none ${active ? 'text-sm' : 'text-xs'}`}>
                  {d.date}
                </p>
              </button>
            );
          })}
        </div>

        {/* Forward Button */}
        <button
          type="button"
          onClick={goForward}
          disabled={isCurrentWeek}
          className={`w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center transition-all duration-200 shrink-0 shadow-xs ${
            isCurrentWeek
              ? 'opacity-25 cursor-not-allowed border-white/10'
              : 'hover:bg-white/35 active:scale-85 cursor-pointer'
          }`}
          title={isCurrentWeek ? 'Minggu Saat Ini' : 'Minggu Berikutnya'}
          aria-label="Minggu Berikutnya"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}

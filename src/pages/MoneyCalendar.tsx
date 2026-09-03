import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, RefreshCw, Sparkles } from 'lucide-react';
import { formatRupiah, categories } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Transaction, RecurringTransaction } from '../types';

interface MoneyCalendarProps {
  transactions: Transaction[];
  recurring: RecurringTransaction[];
  onSelectTransaction?: (tx: Transaction) => void;
}

const DAYS_HEADER = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function MoneyCalendar({ transactions: txs, recurring, onSelectTransaction }: MoneyCalendarProps) {
  const { weekDays, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthYearLabel = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const dayMap = useMemo(() => {
    const map = new Map<number, { income: number; expense: number; txs: Transaction[]; recs: RecurringTransaction[] }>();
    for (let d = 1; d <= daysInMonth; d++) map.set(d, { income: 0, expense: 0, txs: [], recs: [] });

    txs.forEach(t => {
      if (t.date.startsWith(monthPrefix)) {
        const dNum = parseInt(t.date.split('-')[2], 10);
        if (map.has(dNum)) {
          const entry = map.get(dNum)!;
          entry.txs.push(t);
          if (t.type === 'income') entry.income += t.amount;
          if (t.type === 'expense') entry.expense += t.amount;
        }
      }
    });

    recurring.forEach(r => {
      if (r.active !== false && r.dayOfMonth && r.dayOfMonth <= daysInMonth) {
        if (map.has(r.dayOfMonth)) map.get(r.dayOfMonth)!.recs.push(r);
      }
    });
    return map;
  }, [txs, recurring, monthPrefix, daysInMonth]);

  const selectedData = dayMap.get(selectedDay) || { income: 0, expense: 0, txs: [], recs: [] };
  const monthIncome = [...dayMap.values()].reduce((s, d) => s + d.income, 0);
  const monthExpense = [...dayMap.values()].reduce((s, d) => s + d.expense, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="KALENDER KEUANGAN"
        gradientFromTo="from-[#6BB89E] to-[#368F7B]"
        rightElement={
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30">
            <CalendarDays size={14} />
          </div>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-40 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Month Overview Hero */}
        <div className="bg-[#EFFAF6] rounded-2xl p-4 border-2 border-[#368F7B]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#368F7B] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider capitalize">{monthYearLabel}</span>
            </div>
            {/* Month Navigator */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="w-7 h-7 rounded-full bg-white border-2 border-[#1C1B18]/10 flex items-center justify-center cursor-pointer hover:bg-[#F8F3ED] active:scale-90 transition-all"
                title="Bulan Lalu"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="w-7 h-7 rounded-full bg-white border-2 border-[#1C1B18]/10 flex items-center justify-center cursor-pointer hover:bg-[#F8F3ED] active:scale-90 transition-all"
                title="Bulan Depan"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] font-black text-[#368F7B] uppercase">TOTAL MASUK</p>
              <p className="text-lg font-black text-[#1C1B18]">+{formatRupiah(monthIncome)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-[#FF6584] uppercase">TOTAL KELUAR</p>
              <p className="text-lg font-black text-[#1C1B18]">-{formatRupiah(monthExpense)}</p>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[#1C1B18]/6">
            {DAYS_HEADER.map(d => (
              <div key={d} className="py-2 text-center text-[9px] font-black text-[#1C1B18]/40 uppercase">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-[#1C1B18]/5 border-t border-[#1C1B18]/5">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="bg-white h-14" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dData = dayMap.get(dayNum)!;
              const isSelected = dayNum === selectedDay;
              const today = new Date();
              const isToday = dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const hasIncome = dData.income > 0;
              const hasExpense = dData.expense > 0;
              const hasRec = dData.recs.length > 0;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDay(dayNum)}
                  className={`bg-white h-14 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-200 outline-none focus:outline-none ${
                    isSelected
                      ? 'bg-[#1C1B18] text-white shadow-md rounded-xl z-10 scale-102 font-black'
                      : isToday
                      ? 'bg-[#EFFAF6] text-[#368F7B] font-black'
                      : 'hover:bg-[#F8F3ED] text-[#1C1B18]'
                  }`}
                >
                  <span className={`text-xs font-black ${isSelected ? 'text-white' : isToday ? 'text-[#368F7B]' : 'text-[#1C1B18]'}`}>
                    {dayNum}
                  </span>
                  <div className="flex gap-0.5">
                    {hasIncome && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#368F7B]' : 'bg-[#368F7B]'}`} />}
                    {hasExpense && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FF6584]' : 'bg-[#FF6584]'}`} />}
                    {hasRec && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#7D7AFF]' : 'bg-[#7D7AFF]'}`} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#368F7B]" /><span className="text-[10px] font-bold text-[#1C1B18]/50">Pemasukan</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF6584]" /><span className="text-[10px] font-bold text-[#1C1B18]/50">Pengeluaran</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7D7AFF]" /><span className="text-[10px] font-bold text-[#1C1B18]/50">Tagihan Rutin</span></div>
        </div>

        {/* Selected Day Detail Panel */}
        <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden animate-slide-up">
          <div className="px-4 py-3 border-b border-[#1C1B18]/6 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">
              {selectedDay} {monthYearLabel}
            </h3>
            <div className="flex gap-3">
              {selectedData.income > 0 && (
                <span className="text-[10px] font-black text-[#368F7B]">+{formatRupiah(selectedData.income)}</span>
              )}
              {selectedData.expense > 0 && (
                <span className="text-[10px] font-black text-[#FF6584]">-{formatRupiah(selectedData.expense)}</span>
              )}
            </div>
          </div>

          <div className="divide-y divide-[#1C1B18]/6">
            {selectedData.txs.map(t => {
              const cat = categories.find(c => c.id === t.categoryId) || categories[0];
              const isIncome = t.type === 'income';
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTransaction?.(t)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F3ED] cursor-pointer transition-colors active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs" style={{ backgroundColor: cat.color }}>
                    <IconMapper name={cat.icon} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#1C1B18] truncate">{t.merchant || t.description}</p>
                    <p className="text-[9px] text-[#1C1B18]/40 font-bold">{cat.name}</p>
                  </div>
                  <span className={`text-xs font-black ${isIncome ? 'text-[#368F7B]' : 'text-[#FF6584]'}`}>
                    {isIncome ? '+' : '-'}{formatRupiah(t.amount)}
                  </span>
                </div>
              );
            })}

            {selectedData.recs.map(r => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-[#F2F0FF] border-2 border-[#7D7AFF]/20 flex items-center justify-center shrink-0">
                  <RefreshCw size={13} className="text-[#7D7AFF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#1C1B18] truncate">{r.name}</p>
                  <p className="text-[9px] text-[#7D7AFF] font-black">Tagihan Rutin Jatuh Tempo</p>
                </div>
                <span className="text-xs font-black text-[#FF6584]">-{formatRupiah(r.amount)}</span>
              </div>
            ))}

            {selectedData.txs.length === 0 && selectedData.recs.length === 0 && (
              <div className="px-4 py-8 text-center text-xs font-black text-[#1C1B18]/30">
                Tidak ada aktivitas di tanggal ini.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

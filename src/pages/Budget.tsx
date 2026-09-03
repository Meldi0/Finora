import { Plus, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { categories, formatRupiah } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Transaction, Budget as BudgetType } from '../types';

interface BudgetProps {
  transactions: Transaction[];
  budgets: BudgetType[];
  onAddBudget: () => void;
}

export default function Budget({ transactions: txs, budgets, onAddBudget }: BudgetProps) {
  const { weekDays, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay);
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const totalBudgetLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((s, b) => {
    const actual = txs
      .filter(t => t.date.startsWith(currentMonthStr) && t.categoryId === b.categoryId && t.type === 'expense')
      .reduce((s2, t) => s2 + t.amount, 0);
    return s + (actual > 0 ? actual : b.spent);
  }, 0);
  const totalPct = totalBudgetLimit > 0 ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100)) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="ANGGARAN BULANAN"
        gradientFromTo="from-[#FFB260] to-[#FF9F43]"
        rightElement={
          <button
            onClick={onAddBudget}
            className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs"
            title="Tambah Anggaran"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-40 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Hero Overview */}
        <div className="bg-[#FFF5ED] rounded-2xl p-4 border-2 border-[#FFA94D]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FFA94D] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">OVERVIEW ANGGARAN BULANAN</span>
            </div>
            <span className={`text-[10px] font-black px-3 py-0.5 rounded-full bg-white border-2 ${totalPct >= 100 ? 'border-[#FF6584]/30 text-[#FF6584]' : totalPct >= 75 ? 'border-[#FFA94D]/30 text-[#FFA94D]' : 'border-[#368F7B]/30 text-[#368F7B]'}`}>
              {totalPct >= 100 ? 'HABIS' : totalPct >= 75 ? 'RISIKO' : 'AMAN'}
            </span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight leading-none">{totalPct}%</h2>
            <span className="text-xs font-black text-[#1C1B18]/50 mb-1">{formatRupiah(totalBudgetSpent)} / {formatRupiah(totalBudgetLimit)}</span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border-2 border-[#1C1B18]/8">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${totalPct >= 100 ? 'bg-[#FF6584]' : totalPct >= 75 ? 'bg-gradient-to-r from-[#FFA94D] to-[#FF6584]' : 'bg-gradient-to-r from-[#FFB260] to-[#FFA94D]'}`}
              style={{ width: `${Math.min(100, totalPct)}%` }}
            />
          </div>
        </div>

        {/* Budget Category Cards */}
        <div className="space-y-3">
          {budgets.map(b => {
            const category = categories.find(c => c.id === b.categoryId) || categories[0];
            const actualSpent = txs
              .filter(t => t.date.startsWith(currentMonthStr) && t.categoryId === b.categoryId && t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0);
            const spent = actualSpent > 0 ? actualSpent : b.spent;
            const pct = Math.min(100, Math.round((spent / b.limit) * 100));
            const dailyRate = Math.round(spent / Math.max(1, currentDay));
            const projectedTotal = spent + dailyRate * remainingDays;
            const isOver = projectedTotal > b.limit;
            const isExceeded = spent >= b.limit;

            const statusBg = isExceeded ? 'bg-[#FFF0F3] border-[#FF6584]/20' : isOver ? 'bg-[#FFF5ED] border-[#FFA94D]/20' : 'bg-[#EFFAF6] border-[#368F7B]/20';
            const barColor = isExceeded ? '#FF6584' : isOver ? '#FFA94D' : '#368F7B';
            const statusLabel = isExceeded ? 'Habis' : isOver ? 'Risiko' : 'Aman';
            const statusTextColor = isExceeded ? 'text-[#FF6584]' : isOver ? 'text-[#FFA94D]' : 'text-[#368F7B]';

            return (
              <div key={b.categoryId} className={`rounded-2xl p-4 border-2 ${statusBg} interactive-card`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white border border-black/5 shadow-xs" style={{ backgroundColor: category.color }}>
                      <IconMapper name={category.icon} size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#1C1B18]">{category.name}</h3>
                      <p className="text-[9px] text-[#1C1B18]/40 font-bold">{pct}% terpakai</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black ${statusTextColor}`}>
                    {isExceeded ? <AlertTriangle size={12} /> : isOver ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                    {statusLabel}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-black text-[#1C1B18]">{formatRupiah(spent)}</span>
                    <span className="text-xs font-bold text-[#1C1B18]/40">/ {formatRupiah(b.limit)}</span>
                  </div>
                  <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#1C1B18]/8">
                    <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#1C1B18]/8">
                  <div>
                    <p className="text-[9px] text-[#1C1B18]/40 font-bold">Laju Harian</p>
                    <p className="text-xs font-black text-[#1C1B18]">{formatRupiah(dailyRate)}/hari</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#1C1B18]/40 font-bold">Proyeksi Akhir Bulan</p>
                    <p className={`text-xs font-black ${isOver ? 'text-[#FF6584]' : 'text-[#368F7B]'}`}>{formatRupiah(projectedTotal)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {budgets.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs font-black text-[#1C1B18]/30">Belum ada anggaran. Tap (+) untuk menambahkan!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

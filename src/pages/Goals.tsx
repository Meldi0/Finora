import { useState } from 'react';
import { Target, Plus, Sparkles } from 'lucide-react';
import { formatRupiah, formatRupiahFull } from '../data/mockData';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: () => void;
  onUpdateGoal: (id: string, delta: number) => void;
}

export default function Goals({ goals, onAddGoal, onUpdateGoal }: GoalsProps) {
  const { weekDays, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const now = new Date();

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleDeposit = () => {
    if (!selectedGoal || !depositAmount) return;
    const amt = parseInt(depositAmount.replace(/\D/g, ''), 10);
    if (amt > 0) {
      onUpdateGoal(selectedGoal.id, amt);
      setSelectedGoal(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="IMPIAN & TABUNGAN"
        gradientFromTo="from-[#FF85A1] to-[#FF6584]"
        rightElement={
          <button
            onClick={onAddGoal}
            className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs"
            title="Buat Impian Baru"
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

        {/* Overview Hero */}
        <div className="bg-[#FFF0F3] rounded-2xl p-4 border-2 border-[#FF6584]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FF6584] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">TOTAL TABUNGAN IMPIAN</span>
            </div>
            <span className="text-[10px] font-black text-[#1C1B18] bg-white border-2 border-[#1C1B18]/10 px-3 py-0.5 rounded-full">{goals.length} TARGET</span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight leading-none">{formatRupiahFull(totalSaved)}</h2>
            <span className="text-xs font-black text-[#368F7B] mb-1">{overallPct}% tercapai</span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border-2 border-[#1C1B18]/8">
            <div className="h-full bg-gradient-to-r from-[#FF85A1] to-[#FF6584] rounded-full transition-all duration-700 ease-out" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {/* Goal Cards */}
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);
            const deadline = g.deadline ? new Date(g.deadline) : new Date(now.getFullYear() + 1, 0, 1);
            const diffMonths = Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()));
            const requiredMonthly = Math.ceil(remaining / diffMonths);

            return (
              <div key={g.id} className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden interactive-card">
                <div className="h-2 rounded-t-2xl" style={{ backgroundColor: g.color }} />

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white border border-black/5 shadow-xs" style={{ backgroundColor: g.color }}>
                        <Target size={16} />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-[#1C1B18]">{g.name}</h3>
                        <p className="text-[9px] text-[#1C1B18]/40 font-bold">{pct}% tercapai</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${pct >= 100 ? 'bg-[#EFFAF6] text-[#368F7B]' : 'bg-[#F2F0FF] text-[#7D7AFF]'}`}>
                      {pct >= 100 ? 'Selesai ✓' : 'On Track'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-black text-[#1C1B18]">{formatRupiah(g.currentAmount)}</span>
                      <span className="text-xs font-bold text-[#1C1B18]/40">/ {formatRupiah(g.targetAmount)}</span>
                    </div>
                    <div className="w-full h-3 bg-[#F8F3ED] rounded-full overflow-hidden border border-[#1C1B18]/8">
                      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#1C1B18]/8">
                    <div>
                      <p className="text-[9px] text-[#1C1B18]/40 font-bold">Tabungan Wajib/Bulan</p>
                      <p className="text-xs font-black" style={{ color: g.color }}>{formatRupiah(requiredMonthly)}</p>
                    </div>
                    <button
                      onClick={() => setSelectedGoal(g)}
                      className="px-4 py-2 rounded-xl text-white text-xs font-black cursor-pointer active:scale-95 transition-all shadow-xs hover:opacity-90"
                      style={{ backgroundColor: g.color }}
                    >
                      + Tabung
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs font-black text-[#1C1B18]/30">Belum ada target. Tap (+) untuk membuat impian!</p>
            </div>
          )}
        </div>
      </main>

      {/* Deposit Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#1C1B18]/50 backdrop-blur-xs animate-fade-in" onClick={() => setSelectedGoal(null)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border-2 border-[#1C1B18]/10 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#1C1B18]/10 rounded-full mx-auto mb-4" />
            <h3 className="text-sm font-black text-[#1C1B18] mb-1">Tabung ke {selectedGoal.name}</h3>
            <p className="text-[10px] text-[#1C1B18]/40 font-bold mb-4">Sisa: {formatRupiah(Math.max(0, selectedGoal.targetAmount - selectedGoal.currentAmount))}</p>
            <input
              type="number"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              placeholder="Masukkan nominal (Rp)"
              autoFocus
              className="w-full px-4 py-3 text-sm font-black border-2 border-[#1C1B18]/10 rounded-xl focus:outline-none focus:border-[#FF6584] mb-3 bg-[#F8F3ED]"
            />
            <div className="flex gap-2">
              <button onClick={() => setSelectedGoal(null)} className="flex-1 py-2.5 text-xs font-black text-[#1C1B18]/50 border-2 border-[#1C1B18]/10 rounded-xl cursor-pointer hover:bg-[#F8F3ED]">Batal</button>
              <button onClick={handleDeposit} className="flex-1 py-2.5 text-xs font-black text-white rounded-xl cursor-pointer active:scale-95 transition-all shadow-xs" style={{ backgroundColor: selectedGoal.color }}>
                Simpan Setoran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

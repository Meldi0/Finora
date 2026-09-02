import { useState } from 'react';
import { Plus, Calendar, Minus, TrendingUp, Target } from 'lucide-react';
import { formatRupiah, formatRupiahFull } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import DepositGoalModal from '../components/DepositGoalModal';
import type { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: () => void;
  onUpdateGoal: (id: string, amount: number) => void;
}

function formatDeadline(dateStr: string) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Goals({ goals, onAddGoal, onUpdateGoal }: GoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalMode, setModalMode] = useState<'deposit' | 'withdraw'>('deposit');

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleOpenDeposit = (goal: Goal) => {
    setSelectedGoal(goal);
    setModalMode('deposit');
  };

  const handleOpenWithdraw = (goal: Goal) => {
    setSelectedGoal(goal);
    setModalMode('withdraw');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Seamless Floating Header */}
      <div className="sticky top-0 z-30 bg-[#FAF5EF]/80 backdrop-blur-xl px-3.5 sm:px-6 lg:px-10 py-2.5 border-b border-charcoal/5 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-charcoal tracking-tight">Impian Tabungan</h1>
              <span className="text-[9px] font-black text-[#7D7AFF] bg-[#7D7AFF]/15 px-2 py-0.5 rounded-full border border-[#7D7AFF]/20">
                {goals.length} Impian
              </span>
            </div>
          </div>
          <button
            onClick={onAddGoal}
            className="flex items-center gap-1 bg-[#7D7AFF] hover:bg-[#6865FF] text-white px-3 py-1.5 rounded-full shadow-xs font-black text-[11px] transition-all cursor-pointer active:scale-95"
          >
            <Plus size={13} strokeWidth={3} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="px-3.5 sm:px-6 lg:px-10 py-3.5 space-y-3.5 pb-20 lg:pb-10 max-w-7xl mx-auto w-full">
        {/* Overall Stats Hero Card */}
        <div className="rounded-[1.3rem] sm:rounded-[1.6rem] bg-gradient-to-br from-[#7371FC] to-[#8B89FF] p-3.5 sm:p-5 relative overflow-hidden shadow-md shadow-[#7371FC]/20 text-white">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-lg pointer-events-none" />

          <div className="flex items-center justify-between relative mb-1">
            <p className="text-white/75 text-[9px] font-extrabold uppercase tracking-wider">
              Total Tabungan Terkumpul
            </p>
            <span className="text-[10px] font-bold text-white bg-black/15 px-2 py-0.5 rounded-full">
              {overallPct}% tercapai
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-black tracking-tight leading-none my-2 relative">
            <AnimatedNumber value={totalSaved} formatter={formatRupiahFull} />
          </div>
          <p className="text-white/80 text-[11px] font-bold relative">
            dari total target impian {formatRupiahFull(totalTarget)}
          </p>
        </div>

        {/* Goals Cards Grid (3 cols on Desktop) */}
        {goals.length > 0 ? (
          <div>
            <h2 className="text-xs sm:text-sm font-black text-charcoal mb-2">Daftar Impian Tabungan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {goals.map(goal => {
                const pct = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
                const daysLeft = getDaysLeft(goal.deadline);
                const isFinished = pct >= 100;

                return (
                  <div
                    key={goal.id}
                    className="rounded-[1.3rem] overflow-hidden relative shadow-xs bg-white border border-charcoal/5 flex flex-col justify-between"
                  >
                    {/* Top Section with Goal Color */}
                    <div
                      className="p-3.5 text-white relative overflow-hidden"
                      style={{ backgroundColor: goal.color || '#368F7B' }}
                    >
                      <div className="flex items-start justify-between mb-2 relative">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white">
                            <IconMapper name={goal.icon} size={16} color="#ffffff" />
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-black leading-tight">{goal.name}</h3>
                            <span className="text-white/70 text-[9px] font-bold">
                              {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Selesai'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black leading-none">
                            <AnimatedNumber value={pct} suffix="%" />
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-black/15 rounded-full overflow-hidden mb-1.5 p-0.5 relative">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-white/90">
                        <span>{formatRupiah(goal.currentAmount)}</span>
                        <span>{formatRupiah(goal.targetAmount)}</span>
                      </div>
                    </div>

                    {/* Bottom Action Section */}
                    <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2 text-[10px]">
                        <span className="text-charcoal/40 font-bold">Target: {formatDeadline(goal.deadline)}</span>
                        <span className="text-charcoal/60 font-black">
                          Sisa: {formatRupiah(Math.max(0, goal.targetAmount - goal.currentAmount))}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenWithdraw(goal)}
                          disabled={goal.currentAmount <= 0}
                          className="flex-1 py-1.5 bg-[#FAF5EF] hover:bg-charcoal/10 rounded-lg text-[10px] font-black text-charcoal flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-40"
                        >
                          <Minus size={11} strokeWidth={2.5} />
                          <span>Tarik</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeposit(goal)}
                          disabled={isFinished}
                          className="flex-[1.4] py-1.5 rounded-lg text-[10px] font-black text-white flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                          style={{ backgroundColor: goal.color || '#368F7B' }}
                        >
                          <Plus size={12} strokeWidth={3} />
                          <span>Tabung</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Goal Button Card */}
              <button
                onClick={onAddGoal}
                className="w-full border-2 border-dashed border-charcoal/15 bg-white/70 rounded-[1.3rem] p-4 flex flex-col items-center justify-center gap-1.5 hover:border-[#7D7AFF] hover:bg-[#7D7AFF]/5 transition-all cursor-pointer min-h-[110px]"
              >
                <div className="w-7 h-7 bg-[#F8F3ED] rounded-full flex items-center justify-center">
                  <Plus size={14} className="text-charcoal/40" />
                </div>
                <span className="text-[11px] font-black text-charcoal/60">Tambah Impian Baru</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[1.3rem] p-8 text-center border border-charcoal/5 shadow-xs">
            <Target size={24} className="text-charcoal/30 mx-auto mb-1.5" />
            <h3 className="text-xs font-black text-charcoal">Belum Ada Tujuan Tabungan</h3>
            <p className="text-[10px] text-charcoal/40 mt-0.5 mb-3">
              Mulai rencanakan impian finansialmu seperti gadget, liburan, atau dana darurat.
            </p>
            <button
              onClick={onAddGoal}
              className="px-4 py-2 bg-[#7D7AFF] text-white rounded-full font-black text-[11px] shadow-xs active:scale-95 cursor-pointer"
            >
              + Buat Impian Pertama
            </button>
          </div>
        )}
      </div>

      {/* Manual Deposit/Withdraw Modal */}
      {selectedGoal && (
        <DepositGoalModal
          goal={selectedGoal}
          mode={modalMode}
          onClose={() => setSelectedGoal(null)}
          onConfirm={(goalId, amount) => onUpdateGoal(goalId, amount)}
        />
      )}
    </div>
  );
}

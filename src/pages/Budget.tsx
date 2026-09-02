import { useMemo } from 'react';
import { Plus, PiggyBank, AlertTriangle } from 'lucide-react';
import { getCategory, formatRupiah, formatRupiahFull } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import type { Budget as BudgetType, Transaction } from '../types';

interface BudgetProps {
  budgets: BudgetType[];
  transactions: Transaction[];
  onAddBudget: () => void;
}

export default function Budget({ budgets, transactions: txs, onAddBudget }: BudgetProps) {
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);

  const budgetsWithLiveSpent = useMemo(() => {
    return budgets.map(b => {
      const liveSpent = txs
        .filter(t => t.type === 'expense' && t.categoryId === b.categoryId && t.date.startsWith(currentMonthPrefix))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...b,
        spent: liveSpent > 0 ? liveSpent : b.spent,
      };
    });
  }, [budgets, txs, currentMonthPrefix]);

  const totalLimit = budgetsWithLiveSpent.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetsWithLiveSpent.reduce((s, b) => s + b.spent, 0);
  const totalPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const currentMonthLabel = new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Seamless Floating Header */}
      <div className="sticky top-0 z-30 bg-[#FAF5EF]/80 backdrop-blur-xl px-3.5 sm:px-6 lg:px-10 py-2.5 border-b border-charcoal/5 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-charcoal tracking-tight">Batas Anggaran</h1>
              <span className="text-[9px] font-black text-[#FF9F43] bg-[#FF9F43]/15 px-2 py-0.5 rounded-full border border-[#FF9F43]/20">
                {currentMonthLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onAddBudget}
            className="flex items-center gap-1 bg-[#FF9F43] hover:bg-[#FF8E71] text-white px-3 py-1.5 rounded-full shadow-xs font-black text-[11px] transition-all cursor-pointer active:scale-95"
          >
            <Plus size={13} strokeWidth={3} />
            <span>Atur</span>
          </button>
        </div>
      </div>

      <div className="px-3.5 sm:px-6 lg:px-10 py-3.5 space-y-3.5 pb-20 lg:pb-10 max-w-7xl mx-auto w-full">
        {/* Total Budget Card Hero */}
        <div className="rounded-[1.3rem] sm:rounded-[1.6rem] bg-gradient-to-br from-[#FF9F43] to-[#FFA94D] p-3.5 sm:p-5 relative overflow-hidden shadow-md shadow-[#FF9F43]/20 text-white">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-lg pointer-events-none" />

          <div className="flex items-center justify-between relative mb-1">
            <span className="text-white/75 text-[9px] font-extrabold uppercase tracking-wider">
              Total Pengeluaran Bulan Ini
            </span>
            <span className="text-[10px] font-bold text-white bg-black/15 px-2 py-0.5 rounded-full">
              {totalPct}% dari batas
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-black tracking-tight leading-none my-2 relative">
            <AnimatedNumber value={totalSpent} formatter={formatRupiahFull} />
          </div>
          <p className="text-white/80 text-[11px] font-bold mb-2.5 relative">
            dari total alokasi batas {formatRupiahFull(totalLimit)}
          </p>

          <div className="h-2 bg-black/15 rounded-full overflow-hidden p-0.5 relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                totalPct >= 100 ? 'bg-[#FF6584]' : 'bg-white'
              }`}
              style={{ width: `${Math.min(totalPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Categories Budget Grid (3 cols on Desktop) */}
        <div>
          <h2 className="text-xs sm:text-sm font-black text-charcoal mb-2">Batas Per Kategori</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {budgetsWithLiveSpent.map(b => {
              const cat = getCategory(b.categoryId);
              const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
              const isOver = b.spent > b.limit;
              const remaining = b.limit - b.spent;

              return (
                <div
                  key={b.categoryId}
                  className="bg-white rounded-[1.3rem] p-3.5 border border-charcoal/5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: cat?.color || '#FF6584' }}
                        >
                          <IconMapper name={cat?.icon || ''} size={15} color="#ffffff" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-black text-charcoal">{cat?.name}</h3>
                          <span className="text-[9px] font-bold text-charcoal/40">Batas Bulanan</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isOver ? 'bg-[#FF6584]/15 text-[#FF6584]' : 'bg-[#368F7B]/15 text-[#368F7B]'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>

                    <div className="my-2">
                      <div className="flex justify-between text-xs font-black mb-1">
                        <span className={isOver ? 'text-[#FF6584]' : 'text-charcoal'}>
                          {formatRupiah(b.spent)}
                        </span>
                        <span className="text-charcoal/40 font-bold">{formatRupiah(b.limit)}</span>
                      </div>
                      <div className="h-1.5 bg-[#F8F3ED] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver ? 'bg-[#FF6584]' : 'bg-[#368F7B]'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-charcoal/5 flex items-center justify-between text-[10px]">
                    <span className="text-charcoal/40 font-bold">
                      {isOver ? 'Melebihi batas' : 'Sisa kuota'}
                    </span>
                    <span
                      className={`font-black ${
                        isOver ? 'text-[#FF6584]' : 'text-[#368F7B]'
                      }`}
                    >
                      {formatRupiah(Math.abs(remaining))}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Add Budget Card Button */}
            <button
              onClick={onAddBudget}
              className="border-2 border-dashed border-charcoal/15 bg-white/70 rounded-[1.3rem] p-4 flex flex-col items-center justify-center gap-1.5 hover:border-[#FF9F43] hover:bg-[#FF9F43]/5 transition-all cursor-pointer min-h-[110px]"
            >
              <div className="w-7 h-7 bg-[#F8F3ED] rounded-full flex items-center justify-center">
                <Plus size={14} className="text-charcoal/40" />
              </div>
              <span className="text-[11px] font-black text-charcoal/60">Tambah Batas Anggaran</span>
            </button>
          </div>
        </div>

        {budgets.length === 0 && (
          <div className="bg-white rounded-[1.3rem] p-8 text-center border border-charcoal/5 shadow-xs">
            <PiggyBank size={24} className="text-charcoal/30 mx-auto mb-1.5" />
            <h3 className="text-xs font-black text-charcoal">Belum Ada Anggaran Kategori</h3>
            <p className="text-[10px] text-charcoal/40 mt-0.5 mb-3">
              Tentukan batas pengeluaran bulananmu agar finansial terkontrol.
            </p>
            <button
              onClick={onAddBudget}
              className="px-4 py-2 bg-[#FF9F43] text-white rounded-full font-black text-[11px] shadow-xs active:scale-95 cursor-pointer"
            >
              + Atur Anggaran Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

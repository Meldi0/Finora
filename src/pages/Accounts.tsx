import { ArrowRightLeft, Sparkles, Plus, Wallet, TrendingUp, ShieldCheck } from 'lucide-react';
import { formatRupiah, formatRupiahFull } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Account, Transaction } from '../types';

interface AccountsProps {
  transactions: Transaction[];
  accounts: Account[];
  onAddAccount: () => void;
  onOpenTransfer: () => void;
}

export default function Accounts({ transactions: txs, accounts, onAddAccount, onOpenTransfer }: AccountsProps) {
  const { weekDays, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();

  // 100% Real-time calculations
  const totalAccountBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const positiveAssets = accounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);
  const totalAssets = positiveAssets;
  const netWorth = totalAccountBalance;
  const netWorthPct = totalAssets > 0 ? Math.min(100, Math.max(0, Math.round((netWorth / totalAssets) * 100))) : (accounts.length > 0 ? 100 : 0);

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxs = txs.filter(t => t.date.startsWith(monthPrefix));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="DOMPET & NET WORTH"
        gradientFromTo="from-[#FFBA65] to-[#FFA94D]"
        rightElement={
          <div className="flex gap-1.5">
            <button
              onClick={onOpenTransfer}
              className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs"
              title="Transfer Antar Rekening"
            >
              <ArrowRightLeft size={14} />
            </button>
            <button
              onClick={onAddAccount}
              className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs"
              title="Tambah Rekening"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-40 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Net Worth Hero */}
        <div className="bg-[#FFF5ED] rounded-2xl p-4 border-2 border-[#FFA94D]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FFA94D] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">KEKAYAAN BERSIH</span>
            </div>
            <span className={`text-[10px] font-black px-3 py-0.5 rounded-full border-2 ${netWorth >= 0 ? 'text-[#368F7B] bg-[#EFFAF6] border-[#368F7B]/20' : 'text-[#FF6584] bg-[#FFF0F3] border-[#FF6584]/20'}`}>
              {netWorth >= 0 ? 'POSITIF' : 'NEGATIF'}
            </span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight leading-none">{formatRupiahFull(netWorth)}</h2>
            <span className="text-xs font-black text-[#368F7B] mb-1">{accounts.length} Dompet</span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border-2 border-[#1C1B18]/8">
            <div className="h-full bg-gradient-to-r from-[#FFBA65] to-[#FFA94D] rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.max(5, netWorthPct)}%` }} />
          </div>
        </div>

        {/* 3-Pod Breakdown */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#EFFAF6] rounded-2xl p-3.5 border-2 border-[#368F7B]/20 interactive-card">
            <ShieldCheck size={14} className="text-[#368F7B] mb-2" />
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">{formatRupiah(totalAssets)}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Total Aset</p>
          </div>
          <div className="bg-[#FFF0F3] rounded-2xl p-3.5 border-2 border-[#FF6584]/20 interactive-card">
            <TrendingUp size={14} className="text-[#FF6584] mb-2" />
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">{formatRupiah(totalLiabilities)}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Kewajiban</p>
          </div>
          <div className="bg-[#FFF5ED] rounded-2xl p-3.5 border-2 border-[#FFA94D]/20 interactive-card">
            <Wallet size={14} className="text-[#FFA94D] mb-2" />
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">{formatRupiah(netWorth)}</p>
            <p className="text-[9px] text-[#368F7B] font-black mt-1">Net Worth</p>
          </div>
        </div>

        {/* Account Cards */}
        <div className="space-y-2.5">
          {accounts.map(acc => {
            const accTxs = monthTxs.filter(t => t.accountId === acc.id || t.fromAccountId === acc.id || t.toAccountId === acc.id);
            const income = accTxs.filter(t => t.type === 'income' || t.toAccountId === acc.id).reduce((s, t) => s + t.amount, 0);
            const expense = accTxs.filter(t => t.type === 'expense' || t.fromAccountId === acc.id).reduce((s, t) => s + t.amount, 0);
            return (
              <div key={acc.id} className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden interactive-card">
                <div className="h-1.5" style={{ backgroundColor: acc.color }} />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 border border-black/5 shadow-sm"
                      style={{ backgroundColor: acc.color }}
                    >
                      <IconMapper name={acc.icon} size={17} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-[#1C1B18]">{acc.name}</p>
                      <p className="text-[10px] text-[#1C1B18]/40 font-bold capitalize">{acc.type || 'Dompet'}{acc.accountNumber ? ` · ${acc.accountNumber.slice(-4)}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-[#1C1B18]">{formatRupiah(acc.balance)}</p>
                      <p className="text-[10px] text-[#1C1B18]/40 font-bold">Saldo</p>
                    </div>
                  </div>
                  {(income > 0 || expense > 0) && (
                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#1C1B18]/8">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#368F7B]" />
                        <div>
                          <p className="text-[9px] text-[#1C1B18]/40 font-bold">Masuk Bulan Ini</p>
                          <p className="text-[10px] font-black text-[#368F7B]">+{formatRupiah(income)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6584]" />
                        <div>
                          <p className="text-[9px] text-[#1C1B18]/40 font-bold">Keluar Bulan Ini</p>
                          <p className="text-[10px] font-black text-[#FF6584]">-{formatRupiah(expense)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {accounts.length === 0 && (
            <div className="py-12 text-center">
              <Wallet size={32} className="mx-auto text-[#1C1B18]/15 mb-3" />
              <p className="text-xs font-black text-[#1C1B18]/30">Belum ada rekening. Tap (+) untuk menambahkan!</p>
            </div>
          )}
        </div>

        {/* Add Account Button */}
        <button
          onClick={onAddAccount}
          className="w-full py-3.5 bg-[#FFF5ED] hover:bg-[#FFEAD4] border-2 border-[#FFA94D]/30 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-[#FFA94D] cursor-pointer active:scale-98 transition-all shadow-xs"
        >
          <Plus size={15} />
          Tambah Rekening / Dompet
        </button>

        {/* Transfer Button */}
        <button
          onClick={onOpenTransfer}
          className="w-full py-3.5 bg-white border-2 border-[#1C1B18]/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-[#1C1B18]/50 cursor-pointer active:scale-98 transition-all shadow-xs"
        >
          <ArrowRightLeft size={15} />
          Transfer Antar Rekening
        </button>
      </main>
    </div>
  );
}

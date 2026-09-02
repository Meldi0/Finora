import { Plus, ArrowRightLeft, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { formatRupiah, formatRupiahFull } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import type { Account, Transaction } from '../types';

interface AccountsProps {
  accounts: Account[];
  transactions: Transaction[];
  onAddAccount: () => void;
  onOpenTransfer: () => void;
}

export default function Accounts({
  accounts,
  transactions,
  onAddAccount,
  onOpenTransfer,
}: AccountsProps) {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Seamless Floating Header */}
      <div className="sticky top-0 z-30 bg-[#FAF5EF]/80 backdrop-blur-xl px-3.5 sm:px-6 lg:px-10 py-2.5 border-b border-charcoal/5 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-charcoal tracking-tight">Rekening & Dompet</h1>
              <span className="text-[9px] font-black text-[#368F7B] bg-[#368F7B]/15 px-2 py-0.5 rounded-full border border-[#368F7B]/20">
                {accounts.length} Dompet
              </span>
            </div>
          </div>
          <button
            onClick={onAddAccount}
            className="flex items-center gap-1 bg-[#368F7B] hover:bg-[#2D6A4F] text-white px-3 py-1.5 rounded-full shadow-xs font-black text-[11px] transition-all cursor-pointer active:scale-95"
          >
            <Plus size={13} strokeWidth={3} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="px-3.5 sm:px-6 lg:px-10 py-3.5 space-y-3.5 pb-20 lg:pb-10 max-w-7xl mx-auto w-full">
        {/* Top Section: Hero (7 cols) + Transfer (5 cols) on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 items-stretch">
          {/* Left: Total Balance Hero */}
          <div className={`${accounts.length >= 2 ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col`}>
            <div className="rounded-[1.3rem] sm:rounded-[1.6rem] bg-gradient-to-br from-[#2D6A4F] to-[#368F7B] p-3.5 sm:p-5 relative overflow-hidden shadow-md shadow-[#368F7B]/20 text-white flex-1 flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-lg pointer-events-none" />

              <div>
                <p className="text-white/70 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                  Akumulasi Saldo Seluruh Dompet
                </p>
                <div className="text-xl sm:text-2xl font-black tracking-tight leading-none mb-2">
                  <AnimatedNumber value={totalBalance} formatter={formatRupiahFull} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px] text-white/80">
                <span>{accounts.length} Dompet Aktif</span>
                <span>Tersimpan Aman</span>
              </div>
            </div>
          </div>

          {/* Right: Transfer Button / Quick Card */}
          {accounts.length >= 2 && (
            <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-5 border border-charcoal/5 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#368F7B]/15 flex items-center justify-center text-[#368F7B]">
                    <ArrowRightLeft size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-charcoal">Pindah Saldo Antar Akun</h3>
                    <p className="text-[10px] text-charcoal/40 font-semibold">Transfer dari bank ke e-wallet</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenTransfer}
                className="w-full mt-2 py-2 bg-gradient-to-r from-[#368F7B] to-[#52B788] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <ArrowRightLeft size={13} strokeWidth={2.5} />
                <span>Mulai Transfer Sekarang</span>
              </button>
            </div>
          )}
        </div>

        {/* Accounts Grid (3 cols on Desktop) */}
        <div>
          <h2 className="text-xs sm:text-sm font-black text-charcoal mb-2">Daftar Dompet & Rekening</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {accounts.map(acc => {
              const accTxs = transactions.filter(t => t.accountId === acc.id);
              const accIncome = accTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
              const accExpense = accTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

              return (
                <div
                  key={acc.id}
                  className="bg-white rounded-[1.3rem] p-3.5 border border-charcoal/5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: acc.color || '#368F7B' }}
                        >
                          <IconMapper name={acc.icon} size={15} color="#ffffff" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-black text-charcoal">{acc.name}</h3>
                          <span className="text-[9px] font-bold text-charcoal/40 capitalize bg-[#F8F3ED] px-1.5 py-0.5 rounded-full">
                            {acc.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="my-2">
                      <p className="text-[9px] text-charcoal/40 font-bold uppercase tracking-wider">Saldo Saat Ini</p>
                      <p className="text-base sm:text-lg font-black text-charcoal">
                        <AnimatedNumber value={acc.balance} formatter={formatRupiah} />
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-charcoal/5 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-1 text-[#368F7B]">
                      <ArrowDownRight size={11} strokeWidth={2.5} />
                      <span className="font-bold">+{formatRupiah(accIncome)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#FF6584] justify-end">
                      <ArrowUpRight size={11} strokeWidth={2.5} />
                      <span className="font-bold">-{formatRupiah(accExpense)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Account Card Button */}
            <button
              onClick={onAddAccount}
              className="border-2 border-dashed border-charcoal/15 bg-white/70 rounded-[1.3rem] p-4 flex flex-col items-center justify-center gap-1.5 hover:border-[#368F7B] hover:bg-[#368F7B]/5 transition-all cursor-pointer min-h-[110px]"
            >
              <div className="w-7 h-7 bg-[#F8F3ED] rounded-full flex items-center justify-center">
                <Plus size={14} className="text-charcoal/40" />
              </div>
              <span className="text-[11px] font-black text-charcoal/60">Tambah Dompet Baru</span>
            </button>
          </div>
        </div>

        {accounts.length === 0 && (
          <div className="bg-white rounded-[1.3rem] p-8 text-center border border-charcoal/5 shadow-xs">
            <Wallet size={24} className="text-charcoal/30 mx-auto mb-1.5" />
            <h3 className="text-xs font-black text-charcoal">Belum Ada Dompet Terdaftar</h3>
            <p className="text-[10px] text-charcoal/40 mt-0.5 mb-3">
              Tambahkan rekening bank, cash dompet, atau e-walletmu.
            </p>
            <button
              onClick={onAddAccount}
              className="px-4 py-2 bg-[#368F7B] text-white rounded-full font-black text-[11px] shadow-xs active:scale-95 cursor-pointer"
            >
              + Tambah Dompet Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Search, Plus, ArrowRightLeft, Calendar, FilterX } from 'lucide-react';
import { categories, formatRupiah, formatDate, formatDateShort } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Transaction, TransactionType, Account } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
  onSelectTransaction: (tx: Transaction) => void;
  onAddTransaction: () => void;
}

const TYPE_TABS = [
  { id: 'all', label: 'SEMUA' },
  { id: 'expense', label: 'KELUAR' },
  { id: 'income', label: 'MASUK' },
  { id: 'transfer', label: 'TRANSFER' },
] as const;

export default function Transactions({ transactions: txs, onSelectTransaction, onAddTransaction }: TransactionsProps) {
  const { weekDays, isCurrentWeek, selectedDateStr, selectDay, goBack, goForward } = useWeekStrip();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [filterByHeaderDate, setFilterByHeaderDate] = useState(true);

  const filtered = useMemo(() => txs
    .filter(tx => {
      if (filterByHeaderDate && selectedDateStr && tx.date !== selectedDateStr) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const cat = categories.find(c => c.id === tx.categoryId);
        if (
          !tx.description.toLowerCase().includes(q) &&
          !(tx.merchant?.toLowerCase().includes(q)) &&
          !(cat?.name.toLowerCase().includes(q))
        ) return false;
      }
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [txs, search, typeFilter, filterByHeaderDate, selectedDateStr]
  );

  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="AKTIVITAS TRANSAKSI"
        gradientFromTo="from-[#5BBFAA] to-[#368F7B]"
        rightElement={
          <button
            onClick={onAddTransaction}
            className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs"
            title="Tambah Transaksi"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={(dStr) => {
          selectDay(dStr);
          setFilterByHeaderDate(true);
        }}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-48 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Selected Date Indicator */}
        <div className="flex items-center justify-between bg-[#EFFAF6] px-3.5 py-2 rounded-xl border border-[#368F7B]/15">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[#368F7B]" />
            <span className="text-[11px] font-black text-[#1C1B18]">
              {filterByHeaderDate ? `Tanggal Dipilih: ${formatDateShort(selectedDateStr)}` : 'Menampilkan Semua Tanggal'}
            </span>
          </div>
          {filterByHeaderDate ? (
            <button
              onClick={() => setFilterByHeaderDate(false)}
              className="flex items-center gap-1 text-[10px] font-black text-[#368F7B] bg-white px-2 py-0.5 rounded-full border border-[#368F7B]/20 hover:bg-[#368F7B]/10 cursor-pointer"
            >
              <FilterX size={11} /> Lihat Semua Tgl
            </button>
          ) : (
            <button
              onClick={() => setFilterByHeaderDate(true)}
              className="text-[10px] font-black text-[#368F7B] bg-white px-2 py-0.5 rounded-full border border-[#368F7B]/20 cursor-pointer"
            >
              Filter Tgl Ini
            </button>
          )}
        </div>

        {/* Hero Stats */}
        <div className="bg-[#EFFAF6] rounded-2xl p-4 border-2 border-[#368F7B]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">TOTAL CATATAN</span>
            <span className="text-[10px] font-black text-[#1C1B18] bg-white border-2 border-[#1C1B18]/10 px-3 py-0.5 rounded-full">{filtered.length} TRANSAKSI</span>
          </div>
          <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight mb-1">
            {filtered.length} <span className="text-base font-bold text-[#1C1B18]/40">catatan</span>
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs font-black text-[#368F7B]">+{formatRupiah(totalIncome)}</span>
            <span className="text-xs font-black text-[#FF6584]">-{formatRupiah(totalExpense)}</span>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex bg-[#F4F4F4] p-1 rounded-full border border-[#1C1B18]/8 gap-0.5">
          {TYPE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`flex-1 py-1.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-white text-[#1C1B18] shadow-sm border border-[#1C1B18]/10 scale-102'
                  : 'text-[#1C1B18]/40 hover:text-[#1C1B18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1C1B18]/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari merchant, catatan, atau kategori..."
            className="w-full bg-[#F8F3ED] border-2 border-[#1C1B18]/10 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-[#1C1B18] placeholder:text-[#1C1B18]/30 outline-none focus:border-[#368F7B] transition-colors"
          />
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center space-y-2">
              <p className="text-xs font-black text-[#1C1B18]/40">
                {filterByHeaderDate
                  ? `Tidak ada transaksi pada tanggal ${formatDateShort(selectedDateStr)}.`
                  : 'Tidak ada transaksi yang ditemukan.'}
              </p>
              {filterByHeaderDate && (
                <button
                  onClick={() => setFilterByHeaderDate(false)}
                  className="px-3.5 py-1.5 bg-[#EFFAF6] border border-[#368F7B]/20 rounded-full text-[10px] font-black text-[#368F7B] cursor-pointer"
                >
                  Tampilkan Semua Catatan Transaksi
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#1C1B18]/6">
              {filtered.map(tx => {
                const cat = categories.find(c => c.id === tx.categoryId) || categories[0];
                const isIncome = tx.type === 'income';
                const isTransfer = tx.type === 'transfer';
                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8F3ED] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 border border-black/5 shadow-xs"
                      style={{ backgroundColor: isTransfer ? '#7D7AFF' : cat.color }}
                    >
                      {isTransfer ? <ArrowRightLeft size={16} /> : <IconMapper name={cat.icon} size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#1C1B18] truncate">
                        {tx.merchant ? `${tx.merchant}` : tx.description}
                      </p>
                      <p className="text-[10px] text-[#1C1B18]/40 font-bold mt-0.5">
                        {isTransfer ? 'Transfer' : cat.name} · {formatDate(tx.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black ${isTransfer ? 'text-[#7D7AFF]' : isIncome ? 'text-[#368F7B]' : 'text-[#FF6584]'}`}>
                        {!isTransfer && (isIncome ? '+' : '-')}{formatRupiah(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Search, X, Receipt } from 'lucide-react';
import { getCategory, getAccount, formatRupiah } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import type { Transaction, Account } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
  onSelectTransaction: (tx: Transaction) => void;
  onAddTransaction: () => void;
}

type FilterType = 'all' | 'income' | 'expense';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Transactions({
  transactions: txs,
  accounts,
  onSelectTransaction,
}: TransactionsProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    return txs.filter(tx => {
      const matchSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        getCategory(tx.categoryId)?.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || tx.type === filter;
      return matchSearch && matchFilter;
    });
  }, [txs, search, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filtered]);

  const grouped = sorted.reduce<Record<string, Transaction[]>>((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Floating Seamless Header with Search & Segmented Filter */}
      <div className="sticky top-0 z-30 bg-[#FAF5EF]/80 backdrop-blur-xl px-3.5 sm:px-6 lg:px-10 py-2.5 border-b border-charcoal/5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-charcoal tracking-tight">Riwayat Catatan</h1>
              <span className="text-[9px] font-black text-[#FF6584] bg-[#FF6584]/15 px-2 py-0.5 rounded-full border border-[#FF6584]/20">
                {filtered.length} Catatan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input Pill */}
            <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-xs border border-charcoal/5 focus-within:ring-2 focus-within:ring-[#FF6584]/30 transition-all min-w-[140px] sm:min-w-[200px]">
              <Search size={13} className="text-charcoal/35 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari..."
                className="flex-1 text-[11px] font-bold text-charcoal placeholder:text-charcoal/30 bg-transparent border-none outline-none min-w-0"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="w-4 h-4 rounded-full bg-charcoal/10 hover:bg-charcoal/20 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X size={10} className="text-charcoal/60" />
                </button>
              )}
            </div>

            {/* Apple Segmented Toggle Capsule */}
            <div className="flex bg-white/90 backdrop-blur-sm p-0.5 rounded-full border border-charcoal/5 shadow-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-charcoal text-white shadow-xs'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                  filter === 'income'
                    ? 'bg-[#368F7B] text-white shadow-xs'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                  filter === 'expense'
                    ? 'bg-[#FF6584] text-white shadow-xs'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="px-3.5 sm:px-6 lg:px-10 py-3.5 space-y-3.5 pb-20 lg:pb-10 max-w-7xl mx-auto w-full">
        {Object.entries(grouped).map(([date, txList]) => {
          const dayIncome = txList.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const dayExpense = txList.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

          return (
            <div key={date} className="space-y-1">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-charcoal/50 uppercase tracking-wider">
                  {formatDate(date)}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-black">
                  {dayIncome > 0 && (
                    <span className="text-[#368F7B] bg-[#368F7B]/10 px-2 py-0.5 rounded-full">
                      +{formatRupiah(dayIncome)}
                    </span>
                  )}
                  {dayExpense > 0 && (
                    <span className="text-[#FF6584] bg-[#FF6584]/10 px-2 py-0.5 rounded-full">
                      -{formatRupiah(dayExpense)}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[1.3rem] overflow-hidden divide-y divide-charcoal/5 border border-charcoal/5 shadow-xs">
                {txList.map(tx => {
                  const cat = getCategory(tx.categoryId);
                  const acc = accounts.find(a => a.id === tx.accountId) || getAccount(tx.accountId);
                  const isIncome = tx.type === 'income';

                  return (
                    <div
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-[#F8F3ED]/70 transition-all duration-150 cursor-pointer active:scale-[0.99]"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${cat?.color || '#368F7B'}18` }}
                      >
                        <IconMapper name={cat?.icon || ''} size={15} color={cat?.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-charcoal truncate leading-tight">{tx.description}</p>
                        <div className="flex items-center gap-1 text-[10px] text-charcoal/40 font-bold mt-0.5">
                          <span>{cat?.name}</span>
                          <span>·</span>
                          <span className="truncate">{acc?.name}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-xs font-black leading-tight ${
                            isIncome ? 'text-[#368F7B]' : 'text-[#FF6584]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatRupiah(tx.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-[1.3rem] p-8 text-center border border-charcoal/5 shadow-xs mt-2">
            <Receipt size={24} className="text-charcoal/30 mx-auto mb-1.5" />
            <p className="text-xs font-black text-charcoal">Tidak Ada Catatan Ditemukan</p>
            <p className="text-[10px] text-charcoal/40 mt-0.5">
              {search ? 'Coba kata kunci pencarian lain' : 'Mulai catat transaksi pertamamu'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

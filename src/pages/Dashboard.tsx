import { useMemo } from 'react';
import {
  Bell,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Wallet,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Plus,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getCategory,
  formatRupiah,
  formatRupiahFull,
  formatDateShort,
} from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import FinoraLogo from '../components/ui/FinoraLogo';
import type { Transaction, Page, Account, Budget } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  userName: string;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onNavigate: (page: Page) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onAddTransaction?: () => void;
  onAddAccount?: () => void;
}

// Clean Y-Axis Formatter (Fixes decimal .004rb bug)
function formatYAxisLabel(v: number): string {
  if (v === 0) return '0';
  if (v >= 1000000) return `${Math.round(v / 1000000)}jt`;
  if (v >= 1000) return `${Math.round(v / 1000)}rb`;
  return `${v}`;
}

export default function Dashboard({
  transactions: txs,
  accounts,
  budgets,
  userName,
  unreadNotificationsCount,
  onOpenNotifications,
  onNavigate,
  onSelectTransaction,
  onAddTransaction,
  onAddAccount,
}: DashboardProps) {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const currentMonthTxs = txs.filter(t => t.date.startsWith(currentMonthPrefix));

  const totalIncome = currentMonthTxs
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = currentMonthTxs
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const savingsPct =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  const recentTxs = useMemo(() => {
    return [...txs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [txs]);

  // Compute a guaranteed 5-month timeline series for dual bar comparison
  const dynamicCashflow = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const result = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = d.toISOString().slice(0, 7);
      const monthName = monthNames[d.getMonth()];

      const monthTxs = txs.filter(t => t.date.startsWith(yearMonth));
      const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      result.push({
        month: monthName,
        income,
        expense,
      });
    }

    return result;
  }, [txs]);

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex-1 overflow-y-auto selection:bg-[#FF6584]/20">
      {/* ── Top Header ── */}
      <div className="px-3.5 sm:px-6 lg:px-10 pt-3.5 pb-2 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <FinoraLogo size={28} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-charcoal leading-tight tracking-tight">
              Ringkasan Keuangan
            </h1>
            <p className="text-[10px] text-charcoal/40 font-bold capitalize">{todayStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onAddTransaction && (
            <button
              onClick={onAddTransaction}
              className="flex items-center gap-1 bg-gradient-to-r from-[#FF6584] to-[#FFA94D] hover:opacity-95 text-white px-3 py-1.5 rounded-full text-[11px] font-black shadow-sm shadow-[#FF6584]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={13} strokeWidth={3} />
              <span>Catat</span>
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 bg-white/80 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-xs border border-charcoal/5 transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Notifikasi"
          >
            <Bell size={14} className="text-charcoal/70" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF6584] rounded-full ring-1 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* ── Main Mobile-First Compact Layout ── */}
      <div className="px-3.5 sm:px-6 lg:px-10 pt-1 pb-20 lg:pb-10 max-w-7xl mx-auto w-full space-y-3 sm:space-y-4">
        
        {/* ROW 1: Hero Balance Card (7 cols) + 3 Metric Pods (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 items-stretch">
          {/* Left: Total Balance Hero Card */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-[1.3rem] sm:rounded-[1.6rem] bg-gradient-to-br from-[#FF758C] via-[#FF6584] to-[#FF8E71] p-3.5 sm:p-5 text-white shadow-md shadow-[#FF6584]/20 overflow-hidden flex-1 flex flex-col justify-between">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-lg pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-md pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <Sparkles size={11} className="text-yellow-200" />
                    <span className="text-[10px] font-black tracking-wide text-white/95">
                      Saldo Total Dompet
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-white/80 bg-black/10 px-2 py-0.5 rounded-full">
                    {accounts.length} Akun
                  </span>
                </div>

                <div className="mt-2.5">
                  <p className="text-[10px] text-white/75 font-semibold">Total Kekayaan Bersih</p>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                    <AnimatedNumber value={totalBalance} formatter={formatRupiahFull} />
                  </div>
                </div>
              </div>

              {/* Sub Account Quick Badges */}
              <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center gap-1.5 overflow-x-auto">
                {accounts.slice(0, 3).map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => onNavigate('accounts')}
                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/10 transition-all cursor-pointer active:scale-95"
                  >
                    <IconMapper name={acc.icon} size={10} className="text-white" />
                    <span>{acc.name}</span>
                    <span className="opacity-75 font-semibold">{formatRupiah(acc.balance)}</span>
                  </button>
                ))}
                {accounts.length === 0 && (
                  <button
                    onClick={() => onNavigate('accounts')}
                    className="flex items-center gap-1 bg-white text-[#FF6584] px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Plus size={11} strokeWidth={3} />
                    <span>Tambah Akun</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: 3 Metric Pods + Quick Navigation Pills */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2">
            <div className="grid grid-cols-3 gap-1.5 flex-1">
              {/* Pod 1: Pemasukan (Mint Sage) */}
              <div className="bg-[#EBF7F2] rounded-[1.1rem] p-2.5 border border-[#368F7B]/15 shadow-xs flex flex-col justify-between">
                <div className="w-6 h-6 rounded-full bg-[#368F7B]/20 flex items-center justify-center mb-1">
                  <ArrowDownRight size={12} className="text-[#368F7B]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-[#368F7B] uppercase tracking-wider">Pemasukan</p>
                  <div className="text-[11px] sm:text-xs font-black text-charcoal tracking-tight truncate mt-0.5">
                    <AnimatedNumber value={totalIncome} formatter={formatRupiah} />
                  </div>
                </div>
              </div>

              {/* Pod 2: Pengeluaran (Pastel Rose) */}
              <div className="bg-[#FEEFEF] rounded-[1.1rem] p-2.5 border border-[#FF6584]/15 shadow-xs flex flex-col justify-between">
                <div className="w-6 h-6 rounded-full bg-[#FF6584]/20 flex items-center justify-center mb-1">
                  <ArrowUpRight size={12} className="text-[#FF6584]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-[#FF6584] uppercase tracking-wider">Pengeluaran</p>
                  <div className="text-[11px] sm:text-xs font-black text-charcoal tracking-tight truncate mt-0.5">
                    <AnimatedNumber value={totalExpense} formatter={formatRupiah} />
                  </div>
                </div>
              </div>

              {/* Pod 3: Tingkat Tabungan (Lavender Periwinkle) */}
              <div className="bg-[#F0EFFE] rounded-[1.1rem] p-2.5 border border-[#7D7AFF]/15 shadow-xs flex flex-col justify-between">
                <div className="w-6 h-6 rounded-full bg-[#7D7AFF]/20 flex items-center justify-center mb-1">
                  <TrendingUp size={12} className="text-[#7D7AFF]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-[#7D7AFF] uppercase tracking-wider">Tabungan</p>
                  <div className="text-[11px] sm:text-xs font-black text-charcoal tracking-tight mt-0.5">
                    <AnimatedNumber value={savingsPct} suffix="%" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Bar */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => onNavigate('accounts')}
                className="flex items-center justify-center gap-1 bg-white hover:bg-cream py-1.5 px-1 rounded-lg border border-charcoal/5 shadow-xs text-[10px] font-black text-charcoal active:scale-95 transition-all truncate"
              >
                <Wallet size={11} className="text-[#368F7B] shrink-0" />
                <span className="truncate">Dompet</span>
              </button>

              <button
                onClick={() => onNavigate('budget')}
                className="flex items-center justify-center gap-1 bg-white hover:bg-cream py-1.5 px-1 rounded-lg border border-charcoal/5 shadow-xs text-[10px] font-black text-charcoal active:scale-95 transition-all truncate"
              >
                <PiggyBank size={11} className="text-[#FF9F43] shrink-0" />
                <span className="truncate">Anggaran</span>
              </button>

              <button
                onClick={() => onNavigate('goals')}
                className="flex items-center justify-center gap-1 bg-white hover:bg-cream py-1.5 px-1 rounded-lg border border-charcoal/5 shadow-xs text-[10px] font-black text-charcoal active:scale-95 transition-all truncate"
              >
                <Target size={11} className="text-[#7D7AFF] shrink-0" />
                <span className="truncate">Impian</span>
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Modern 3D Rounded Dual Bar Chart + Dompet & Rekening */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4">
          {/* Left 7 cols: Modern Rounded Dual Bar Chart */}
          <div className="lg:col-span-7 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#368F7B]/15 text-[#368F7B] flex items-center justify-center">
                  <BarChart3 size={15} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-charcoal">Arus Kas Keuangan</h2>
                  <p className="text-[10px] text-charcoal/40 font-medium">Perbandingan Pemasukan & Pengeluaran</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#F8F3ED] px-2.5 py-1 rounded-full border border-charcoal/5">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#368F7B]" />
                  <span className="text-[9px] font-black text-[#368F7B]">Pemasukan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF6584]" />
                  <span className="text-[9px] font-black text-[#FF6584]">Pengeluaran</span>
                </div>
              </div>
            </div>

            <div className="mt-1">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart
                  data={dynamicCashflow}
                  margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
                  barGap={3}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C1B180C" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 9, fill: '#1C1B1870', fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 8, fill: '#1C1B1845', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatYAxisLabel}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(28, 27, 24, 0.03)' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: '#1C1B18',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      fontSize: 10,
                      fontFamily: 'Plus Jakarta Sans',
                      padding: '6px 10px',
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 700 }}
                    formatter={(val) => [formatRupiah(Number(val))]}
                  />
                  <Bar
                    dataKey="income"
                    name="Pemasukan"
                    fill="#368F7B"
                    radius={[5, 5, 2, 2]}
                    barSize={11}
                  />
                  <Bar
                    dataKey="expense"
                    name="Pengeluaran"
                    fill="#FF6584"
                    radius={[5, 5, 2, 2]}
                    barSize={11}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 5 cols: Dompet & Rekening */}
          <div className="lg:col-span-5 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs sm:text-sm font-black text-charcoal">Dompet & Rekening</h2>
                <button
                  onClick={() => onNavigate('accounts')}
                  className="text-[10px] font-black text-[#FF6584] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Kelola</span>
                  <ChevronRight size={11} />
                </button>
              </div>

              <div className="space-y-1.5">
                {accounts.slice(0, 3).map(acc => (
                  <div
                    key={acc.id}
                    onClick={() => onNavigate('accounts')}
                    className="p-2 rounded-xl bg-[#FAF5EF]/70 hover:bg-[#FAF5EF] flex items-center justify-between border border-charcoal/5 transition-all cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: acc.color }}
                      >
                        <IconMapper name={acc.icon} size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-charcoal truncate">{acc.name}</p>
                        <p className="text-[9px] text-charcoal/40 font-bold capitalize">{acc.type}</p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-charcoal shrink-0">
                      {formatRupiah(acc.balance)}
                    </p>
                  </div>
                ))}

                {accounts.length === 0 && (
                  <div className="text-center py-4 text-charcoal/40 text-xs font-bold bg-[#FAF5EF] rounded-xl border border-dashed border-charcoal/10">
                    Belum ada dompet. Tambahkan rekening pertamamu!
                  </div>
                )}
              </div>
            </div>

            {onAddAccount && (
              <button
                onClick={onAddAccount}
                className="w-full mt-2 py-2 bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal font-black text-[11px] rounded-xl border border-charcoal/5 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
              >
                <Plus size={12} strokeWidth={2.5} />
                <span>Tambah Dompet Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* ROW 3: Transaksi Terakhir (7 cols) + Target Tabungan (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4">
          {/* Left 7 cols: Transaksi Terakhir */}
          <div className="lg:col-span-7 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-charcoal">Catatan Hari Ini</h2>
                <p className="text-[10px] text-charcoal/40 font-medium">5 transaksi terbaru</p>
              </div>
              <button
                onClick={() => onNavigate('transactions')}
                className="text-[10px] font-black text-[#FF6584] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight size={11} />
              </button>
            </div>

            <div className="space-y-1.5">
              {recentTxs.map(tx => {
                const category = getCategory(tx.categoryId);
                const isIncome = tx.type === 'income';

                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="p-2 rounded-xl bg-white hover:bg-[#FAF5EF] flex items-center justify-between border border-charcoal/5 transition-all cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconMapper name={category.icon} size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-charcoal truncate">{tx.description}</p>
                        <div className="flex items-center gap-1.5 text-[9px] text-charcoal/40 font-bold">
                          <span>{category.name}</span>
                          <span>•</span>
                          <span>{formatDateShort(tx.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-black ${
                          isIncome ? 'text-[#368F7B]' : 'text-[#FF6584]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {recentTxs.length === 0 && (
                <div className="text-center py-6 text-charcoal/40 text-xs font-bold bg-[#FAF5EF] rounded-xl border border-dashed border-charcoal/10">
                  Belum ada catatan transaksi. Tekan tombol (+) untuk mencatat!
                </div>
              )}
            </div>
          </div>

          {/* Right 5 cols: Budget Summary & Advice */}
          <div className="lg:col-span-5 bg-[#FFF5EE] border border-[#FF9F43]/20 rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#FF9F43] mb-1.5">
                <Sparkles size={14} />
                <span className="text-xs font-black">Panduan Finansial Hari Ini</span>
              </div>
              <p className="text-xs font-bold text-charcoal leading-relaxed">
                "Menjaga pengeluaran tetap di bawah 50% dari total pemasukan adalah kunci utama membangun dana darurat yang kokoh."
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#FF9F43]/20 flex items-center justify-between">
              <span className="text-[10px] font-black text-charcoal/60">Strategi 50/30/20</span>
              <button
                onClick={() => onNavigate('budget')}
                className="px-2.5 py-1 bg-white text-[#FF9F43] hover:bg-[#FF9F43] hover:text-white rounded-full text-[10px] font-black transition-colors cursor-pointer border border-[#FF9F43]/30"
              >
                Cek Anggaran
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

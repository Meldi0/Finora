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
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

  // Compute dynamic chart data
  const dynamicCashflow = useMemo(() => {
    if (txs.length === 0) {
      const now = new Date();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return [
        { month: monthNames[(now.getMonth() - 2 + 12) % 12], income: 0, expense: 0 },
        { month: monthNames[(now.getMonth() - 1 + 12) % 12], income: 0, expense: 0 },
        { month: monthNames[now.getMonth()], income: 0, expense: 0 },
      ];
    }

    const monthsMap = new Map<string, { income: number; expense: number }>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    txs.forEach(tx => {
      const mKey = tx.date.slice(0, 7);
      if (!monthsMap.has(mKey)) {
        monthsMap.set(mKey, { income: 0, expense: 0 });
      }
      const entry = monthsMap.get(mKey)!;
      if (tx.type === 'income') entry.income += tx.amount;
      if (tx.type === 'expense') entry.expense += tx.amount;
    });

    const sortedKeys = Array.from(monthsMap.keys()).sort();
    return sortedKeys.slice(-6).map(key => {
      const parts = key.split('-');
      const mIdx = parseInt(parts[1], 10) - 1;
      const data = monthsMap.get(key)!;
      return {
        month: monthNames[mIdx] || key,
        income: data.income,
        expense: data.expense,
      };
    });
  }, [txs]);

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex-1 overflow-y-auto selection:bg-[#FF6584]/20">
      {/* ── Top Header (Mobile Native Compact) ── */}
      <div className="px-3.5 sm:px-6 lg:px-10 pt-3.5 pb-2 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <FinoraLogo size={28} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-charcoal leading-tight tracking-tight">
              Ruang Finansial
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
        
        {/* ROW 1: Hero Salmon Balance Card (7 cols) + 3 Metric Pods (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 items-stretch">
          {/* Left: Total Balance Hero Card (Mobile-First Ergonomic Sizing) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-[1.3rem] sm:rounded-[1.6rem] bg-gradient-to-br from-[#FF758C] via-[#FF6584] to-[#FF8E71] p-3.5 sm:p-5 text-white shadow-md shadow-[#FF6584]/20 overflow-hidden flex-1 flex flex-col justify-between">
              {/* Subtle decorative shapes */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-lg pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-md pointer-events-none" />

              <div>
                <div className="flex items-center justify-between relative mb-1">
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    <Sparkles size={10} className="text-white" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">Total Saldo</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/90 bg-black/15 px-2 py-0.5 rounded-full">
                    {accounts.length} Dompet
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black tracking-tight leading-none my-2 relative">
                  <AnimatedNumber value={totalBalance} formatter={formatRupiahFull} />
                </div>
              </div>

              {/* Account Pills Inside Hero Card */}
              <div className="flex flex-wrap items-center gap-1 mt-1.5 pt-2 border-t border-white/20 relative">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => onNavigate('accounts')}
                    className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/10 transition-all cursor-pointer active:scale-95"
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
                  <p className="text-[8px] font-black text-[#368F7B] uppercase tracking-wider">Masuk</p>
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
                  <p className="text-[8px] font-black text-[#FF6584] uppercase tracking-wider">Keluar</p>
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

        {/* ROW 2: Arus Kas Chart (7 cols) + Dompet & Rekening (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4">
          {/* Left 7 cols: Arus Kas Chart */}
          <div className="lg:col-span-7 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-charcoal">Arus Kas Keuangan</h2>
                <p className="text-[10px] text-charcoal/40 font-medium">Tren pergerakan bulanan</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F8F3ED] px-2 py-0.5 rounded-full">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#368F7B]" />
                  <span className="text-[9px] font-black text-[#368F7B]">Masuk</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6584]" />
                  <span className="text-[9px] font-black text-[#FF6584]">Keluar</span>
                </div>
              </div>
            </div>

            <div className="mt-0.5">
              <ResponsiveContainer width="100%" height={125}>
                <AreaChart
                  data={dynamicCashflow}
                  margin={{ top: 4, right: 4, left: -30, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="deskGreenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#368F7B" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#368F7B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="deskPinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6584" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#FF6584" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#24231F08" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 8, fill: '#1C1B1860', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 7, fill: '#1C1B1845', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => (v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`)}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: '#1C1B18',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      fontSize: 10,
                      fontFamily: 'Plus Jakarta Sans',
                      padding: '5px 8px',
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 700 }}
                    formatter={(val) => [formatRupiah(Number(val))]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Pemasukan"
                    stroke="#368F7B"
                    strokeWidth={1.8}
                    fill="url(#deskGreenGrad)"
                    dot={false}
                    activeDot={{ r: 3.5, fill: '#368F7B', stroke: '#fff', strokeWidth: 1.5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Pengeluaran"
                    stroke="#FF6584"
                    strokeWidth={1.8}
                    fill="url(#deskPinkGrad)"
                    dot={false}
                    activeDot={{ r: 3.5, fill: '#FF6584', stroke: '#fff', strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 5 cols: Dompet & Rekening */}
          <div className="lg:col-span-5 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-charcoal">Dompet & Rekening</h2>
                  <p className="text-[10px] text-charcoal/40 font-medium">Saldo di setiap akun</p>
                </div>
                <button
                  onClick={() => onNavigate('accounts')}
                  className="text-[10px] font-black text-[#368F7B] flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight size={11} />
                </button>
              </div>

              <div className="space-y-1.5">
                {accounts.slice(0, 3).map(acc => (
                  <div
                    key={acc.id}
                    onClick={() => onNavigate('accounts')}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F8F3ED] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: acc.color || '#368F7B' }}
                      >
                        <IconMapper name={acc.icon} size={13} color="#ffffff" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-charcoal truncate">{acc.name}</p>
                        <p className="text-[9px] text-charcoal/40 font-bold capitalize">{acc.type}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-black text-charcoal">{formatRupiah(acc.balance)}</p>
                    </div>
                  </div>
                ))}

                {accounts.length === 0 && (
                  <div className="p-3 text-center bg-[#F8F3ED]/60 rounded-lg">
                    <p className="text-[11px] text-charcoal/50 font-bold mb-1">Belum ada akun</p>
                    {onAddAccount && (
                      <button
                        onClick={onAddAccount}
                        className="text-[11px] font-black text-[#368F7B] hover:underline"
                      >
                        + Tambah Akun
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {onAddAccount && accounts.length > 0 && (
              <button
                onClick={onAddAccount}
                className="w-full mt-2 py-1.5 rounded-lg bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98"
              >
                <Plus size={12} strokeWidth={2.5} />
                <span>Tambah Rekening Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* ROW 3: Anggaran Kategori (6 cols) + Riwayat Transaksi (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4">
          {/* Left 6 cols: Anggaran Kategori */}
          <div className="lg:col-span-6 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-charcoal">Anggaran Kategori</h2>
                  <p className="text-[10px] text-charcoal/40 font-medium">Batas pengeluaran bulan ini</p>
                </div>
                <button
                  onClick={() => onNavigate('budget')}
                  className="text-[10px] font-black text-[#FF9F43] flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span>Kelola</span>
                  <ChevronRight size={11} />
                </button>
              </div>

              <div className="space-y-2">
                {budgets.slice(0, 3).map(b => {
                  const cat = getCategory(b.categoryId);
                  const pct = b.limit > 0 ? Math.min(100, Math.round((b.spent / b.limit) * 100)) : 0;
                  const isOver = b.spent > b.limit;

                  return (
                    <div key={b.categoryId} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cat?.color || '#FF6584' }}
                          />
                          <span className="font-black text-charcoal">{cat?.name || b.categoryId}</span>
                        </div>
                        <div className="font-bold text-charcoal/60 text-[10px]">
                          <span className={isOver ? 'text-[#FF6584] font-black' : 'text-charcoal font-black'}>
                            {formatRupiah(b.spent)}
                          </span>{' '}
                          / {formatRupiah(b.limit)}
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#F8F3ED] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver ? 'bg-[#FF6584]' : 'bg-[#FF9F43]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {budgets.length === 0 && (
                  <div className="p-3 text-center bg-[#F8F3ED]/60 rounded-lg">
                    <p className="text-[11px] text-charcoal/50 font-bold mb-1">Belum ada anggaran</p>
                    <button
                      onClick={() => onNavigate('budget')}
                      className="text-[11px] font-black text-[#FF9F43] hover:underline"
                    >
                      + Buat Anggaran
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('budget')}
              className="w-full mt-2.5 py-1.5 rounded-lg bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98"
            >
              <span>Detail Anggaran</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Right 6 cols: Riwayat Transaksi Terbaru */}
          <div className="lg:col-span-6 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-charcoal">Transaksi Terbaru</h2>
                  <p className="text-[10px] text-charcoal/40 font-medium">5 catatan terakhir</p>
                </div>
                <button
                  onClick={() => onNavigate('transactions')}
                  className="text-[10px] font-black text-[#FF6584] flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span>Semua</span>
                  <ChevronRight size={11} />
                </button>
              </div>

              <div className="space-y-1">
                {recentTxs.map(tx => {
                  const cat = getCategory(tx.categoryId);
                  const isIncome = tx.type === 'income';

                  return (
                    <div
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#F8F3ED] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: cat?.color || '#FF6584' }}
                        >
                          <IconMapper name={cat?.icon || 'receipt'} size={13} color="#ffffff" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-charcoal truncate">{tx.description}</p>
                          <p className="text-[9px] text-charcoal/40 font-bold">
                            {formatDateShort(tx.date)} · {cat?.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[11px] font-black ${
                            isIncome ? 'text-[#368F7B]' : 'text-[#FF6584]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatRupiah(tx.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {recentTxs.length === 0 && (
                  <div className="p-3 text-center bg-[#F8F3ED]/60 rounded-lg">
                    <Receipt size={16} className="text-charcoal/30 mx-auto mb-1" />
                    <p className="text-[11px] text-charcoal/50 font-bold">Belum ada transaksi</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('transactions')}
              className="w-full mt-2.5 py-1.5 rounded-lg bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98"
            >
              <span>Semua Riwayat</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

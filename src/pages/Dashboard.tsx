import { useState, useMemo } from 'react';
import {
  Bell, TrendingUp, ChevronRight, Sparkles,
  Wallet, PiggyBank, Target, ArrowUpRight, ArrowDownRight, Calendar, FilterX,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getCategory, formatRupiah, formatRupiahFull, formatDateShort } from '../data/mockData';
import IconMapper from '../components/ui/IconMapper';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { generateFinancialInsights } from '../utils/financialInsights';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Transaction, Page, Account, Budget, Goal, RecurringTransaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  recurring: RecurringTransaction[];
  userName: string;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onNavigate: (page: Page) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onAddTransaction?: () => void;
  onAddAccount?: () => void;
}

function getWeekChartData(txs: Transaction[], weekStart: string, selectedDateStr: string) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const FILLS = ['#FF758C', '#FF6584', '#FF6584', '#FFA94D', '#368F7B', '#FFA94D', '#FF758C'];
  const data = labels.map((day, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const expense = txs.filter(t => t.type === 'expense' && t.date === dateStr).reduce((s, t) => s + t.amount, 0);
    const isSelected = dateStr === selectedDateStr;
    return {
      day,
      expense,
      fill: isSelected ? '#1C1B18' : FILLS[i],
      dateStr,
      isSelected,
    };
  });
  const maxVal = Math.max(...data.map(d => d.expense), 1);
  return data.map(d => ({
    ...d,
    val: d.expense > 0 ? Math.round((d.expense / maxVal) * 92) + 3 : 3,
  }));
}

export default function Dashboard({
  transactions: txs, accounts, budgets, goals, recurring,
  userName, unreadNotificationsCount,
  onOpenNotifications, onNavigate, onSelectTransaction,
}: DashboardProps) {
  const { weekDays, weekStart, isCurrentWeek, selectedDateStr, selectDay, goBack, goForward } = useWeekStrip();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [viewAllTx, setViewAllTx] = useState(false);

  const totalBalance = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Transactions on the selected date (EXACT MATCH!)
  const selectedDayTxs = useMemo(() => {
    return txs.filter(t => t.date === selectedDateStr);
  }, [txs, selectedDateStr]);

  // Income & expense for selected date
  const dayIncome = useMemo(() => selectedDayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [selectedDayTxs]);
  const dayExpense = useMemo(() => selectedDayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [selectedDayTxs]);

  // Income & expense for current month
  const monthTxs = useMemo(() => txs.filter(t => t.date.startsWith(monthPrefix)), [txs, monthPrefix]);
  const totalIncomeMonth = useMemo(() => monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const totalExpenseMonth = useMemo(() => monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const savings = totalIncomeMonth - totalExpenseMonth;
  const savingsPct = totalIncomeMonth > 0 ? Math.max(0, Math.round((savings / totalIncomeMonth) * 100)) : 0;

  // Real chart calculation with selected date highlight
  const weekChartData = useMemo(() => getWeekChartData(txs, weekStart, selectedDateStr), [txs, weekStart, selectedDateStr]);

  const monthlyChartData = useMemo(() => {
    const labels = ['M1', 'M2', 'M3', 'M4'];
    const FILLS = ['#FF758C', '#FF6584', '#FFA94D', '#368F7B'];
    const data = labels.map((label, i) => {
      const ws = new Date(now.getFullYear(), now.getMonth(), 1 + i * 7);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      const expense = txs.filter(t => {
        if (t.type !== 'expense') return false;
        const d = new Date(t.date);
        return d >= ws && d <= we;
      }).reduce((s, t) => s + t.amount, 0);
      return { day: label, expense, fill: FILLS[i] };
    });
    const maxVal = Math.max(...data.map(d => d.expense), 1);
    return data.map(d => ({ ...d, val: d.expense > 0 ? Math.round((d.expense / maxVal) * 92) + 3 : 3 }));
  }, [txs, now]);

  const chartData = period === 'weekly' ? weekChartData : monthlyChartData;
  const selectedDayChartItem = weekChartData.find(d => d.dateStr === selectedDateStr);
  const selectedDayExpense = selectedDayChartItem ? selectedDayChartItem.expense : dayExpense;

  const chartLabel = period === 'weekly'
    ? `${formatDateShort(selectedDateStr)}: ${formatRupiah(selectedDayExpense)}`
    : `Bulan ini: ${formatRupiah(totalExpenseMonth)}`;

  // Display transactions list
  const displayTxs = useMemo(() => {
    if (viewAllTx) {
      return [...txs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
    }
    return [...selectedDayTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [txs, selectedDayTxs, viewAllTx]);

  const insights = useMemo(() =>
    generateFinancialInsights(txs, budgets, goals, recurring),
    [txs, budgets, goals, recurring]
  );

  const statusLabel = savingsPct >= 20 ? 'SEHAT' : savingsPct >= 0 ? 'AMAN' : 'PERHATIAN';
  const statusColor = savingsPct >= 20
    ? 'text-[#368F7B] border-[#368F7B]/30 bg-[#EFFAF6]'
    : savingsPct >= 0 ? 'text-[#1C1B18] border-[#1C1B18]/10 bg-white'
    : 'text-[#FF6584] border-[#FF6584]/30 bg-[#FFF0F3]';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      {/* Interactive Week Header Strip */}
      <WeekHeaderStrip
        title="FINORA KEUANGAN"
        gradientFromTo="from-[#FF9080] to-[#FF6584]"
        leftElement={
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center font-black text-sm border-2 border-white/30 shadow-xs">
            {userName?.[0]?.toUpperCase() ?? 'F'}
          </div>
        }
        rightElement={
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs"
            aria-label="Notifikasi"
          >
            <Bell size={15} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-[#FF6584]" />
            )}
          </button>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      {/* Main Curved Body with ample bottom padding to prevent bottom dock clipping */}
      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-48 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Selected Date Filter Badge Banner */}
        <div className="flex items-center justify-between bg-[#F8F3ED] px-3.5 py-2 rounded-xl border border-[#1C1B18]/8">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[#FF6584]" />
            <span className="text-[11px] font-black text-[#1C1B18]">
              Tanggal Dipilih: {formatDateShort(selectedDateStr)}
            </span>
          </div>
          {selectedDayTxs.length > 0 ? (
            <span className="text-[10px] font-black text-[#368F7B] bg-[#EFFAF6] px-2 py-0.5 rounded-full border border-[#368F7B]/20">
              {selectedDayTxs.length} Catatan
            </span>
          ) : (
            <span className="text-[10px] font-black text-[#1C1B18]/40 bg-white px-2 py-0.5 rounded-full border border-[#1C1B18]/10">
              Kosong
            </span>
          )}
        </div>

        {/* Hero Balance */}
        <div className="bg-[#FFF5F5] rounded-2xl p-4 border-2 border-[#FF6584]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FF6584] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">TOTAL SALDO AKTIF</span>
            </div>
            <span className={`text-[10px] font-black px-3 py-0.5 rounded-full border-2 ${statusColor}`}>{statusLabel}</span>
          </div>

          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight leading-none">
              <AnimatedNumber value={totalBalance} formatter={formatRupiahFull} />
            </h2>
            <span className="text-xs font-black text-[#FF6584] mb-1">
              {dayExpense > 0 ? `-${formatRupiah(dayExpense)} tgl ini` : dayIncome > 0 ? `+${formatRupiah(dayIncome)} tgl ini` : 'Rp 0 tgl ini'}
            </span>
          </div>

          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border-2 border-[#1C1B18]/8">
            <div
              className="h-full bg-gradient-to-r from-[#FF758C] to-[#FFA94D] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${totalIncomeMonth > 0 ? Math.min(100, Math.max(5, Math.round((savings / totalIncomeMonth) * 100) + 50)) : accounts.length > 0 ? 40 : 5}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[9px] font-black text-[#1C1B18]/30">
            <span>{accounts.length} dompet terhubung</span>
            <span>Update otomatis</span>
          </div>
        </div>

        {/* 3-Pod Grid — Dynamically Reflects Selected Date! */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#EFFAF6] rounded-2xl p-3.5 border-2 border-[#368F7B]/20 interactive-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#368F7B] uppercase">MASUK</span>
              <ArrowDownRight size={14} className="text-[#368F7B]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">
              <AnimatedNumber value={dayIncome} formatter={formatRupiah} />
            </p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Tgl {selectedDateStr.split('-')[2]}</p>
          </div>

          <div className="bg-[#FFF0F3] rounded-2xl p-3.5 border-2 border-[#FF6584]/20 interactive-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#FF6584] uppercase">KELUAR</span>
              <ArrowUpRight size={14} className="text-[#FF6584]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">
              <AnimatedNumber value={dayExpense} formatter={formatRupiah} />
            </p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Tgl {selectedDateStr.split('-')[2]}</p>
          </div>

          <div className="bg-[#F2F0FF] rounded-2xl p-3.5 border-2 border-[#7D7AFF]/20 interactive-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#7D7AFF] uppercase font-bold">BULAN INI</span>
              <TrendingUp size={14} className="text-[#7D7AFF]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">
              {formatRupiah(totalExpenseMonth)}
            </p>
            <p className="text-[9px] text-[#7D7AFF] font-black mt-1">Total Keluar</p>
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex bg-[#F4F4F4] p-1 rounded-full border border-[#1C1B18]/8">
          {(['weekly', 'monthly'] as const).map((p, i) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-black transition-all duration-200 cursor-pointer ${
                period === p ? 'bg-white text-[#1C1B18] shadow-sm border border-[#1C1B18]/10 scale-102' : 'text-[#1C1B18]/40 hover:text-[#1C1B18]'
              }`}
            >
              {['MINGGU TERPILIH', 'BULAN INI'][i]}
            </button>
          ))}
        </div>

        {/* Real Chart */}
        <div className="bg-[#FFF5F5] rounded-2xl p-4 border-2 border-[#FF6584]/10 interactive-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-[#1C1B18]/60 uppercase tracking-wider">
              {period === 'weekly' ? 'PENGELUARAN MINGGU TERPILIH' : 'PENGELUARAN BULAN INI'}
            </span>
            <span className="text-[10px] font-black text-[#FF6584] bg-white px-2.5 py-0.5 rounded-full border border-[#FF6584]/20">{chartLabel}</span>
          </div>

          {chartData.every(d => d.expense === 0) ? (
            <div className="h-[110px] flex flex-col items-center justify-center gap-2">
              <div className="flex gap-1.5 items-end">
                {[35, 50, 30, 60, 40, 25, 45].map((h, i) => (
                  <div key={i} className="w-7 rounded-full bg-[#FF6584]/10 border border-[#FF6584]/20" style={{ height: `${h}px` }} />
                ))}
              </div>
              <p className="text-[10px] font-black text-[#1C1B18]/30">Belum ada pengeluaran {period === 'weekly' ? 'minggu ini' : 'bulan ini'}</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-[28%] inset-x-0 border-b-2 border-dashed border-[#FF6584]/25 pointer-events-none z-10" />
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData} margin={{ top: 18, right: 2, left: 2, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#1C1B18', fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ borderRadius: 10, border: 'none', background: '#1C1B18', color: '#fff', fontSize: 10, padding: '4px 10px', fontFamily: 'Plus Jakarta Sans' }}
                    formatter={(_: any, __: string, props: any) => [props.payload?.expense > 0 ? formatRupiah(props.payload.expense) : 'Kosong', 'Pengeluaran']}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="val" radius={[14, 14, 14, 14]} barSize={26}>
                    {chartData.map((entry: any, i: number) => (
                      <Cell
                        key={i}
                        fill={entry.isSelected ? '#1C1B18' : entry.fill}
                        stroke="#1C1B18"
                        strokeWidth={entry.isSelected ? 2.5 : 1.5}
                        opacity={entry.expense === 0 ? 0.2 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Transactions List — Reactive to Date Filter */}
        <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C1B18]/6">
            <h3 className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">
              {viewAllTx ? 'SEMUA CATATAN TRANSAKSI' : `TRANSAKSI ${formatDateShort(selectedDateStr)}`}
            </h3>
            <button
              type="button"
              onClick={() => setViewAllTx(prev => !prev)}
              className="flex items-center gap-1 text-[10px] font-black text-[#FF6584] cursor-pointer hover:underline"
            >
              {viewAllTx ? (
                <>
                  <FilterX size={12} /> Filter Tgl
                </>
              ) : (
                <>
                  Lihat Semua <ChevronRight size={12} />
                </>
              )}
            </button>
          </div>

          <div className="divide-y divide-[#1C1B18]/5">
            {displayTxs.map(tx => {
              const cat = getCategory(tx.categoryId);
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F3ED] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs" style={{ backgroundColor: isTransfer ? '#7D7AFF' : cat.color }}>
                    <IconMapper name={cat.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#1C1B18] truncate">{tx.merchant || tx.description}</p>
                    <p className="text-[10px] text-[#1C1B18]/40 font-bold">{cat.name} · {formatDateShort(tx.date)}</p>
                  </div>
                  <span className={`text-sm font-black ${isTransfer ? 'text-[#7D7AFF]' : isIncome ? 'text-[#368F7B]' : 'text-[#FF6584]'}`}>
                    {!isTransfer && (isIncome ? '+' : '-')}{formatRupiah(tx.amount)}
                  </span>
                </div>
              );
            })}

            {displayTxs.length === 0 && (
              <div className="px-4 py-8 text-center space-y-2">
                <p className="text-xs font-black text-[#1C1B18]/40">
                  Tidak ada transaksi pada tanggal {formatDateShort(selectedDateStr)}.
                </p>
                <button
                  type="button"
                  onClick={() => setViewAllTx(true)}
                  className="px-3.5 py-1.5 bg-[#FFF5F5] border border-[#FF6584]/20 rounded-full text-[10px] font-black text-[#FF6584] cursor-pointer hover:bg-[#FFEBEB] transition-all"
                >
                  Tampilkan Semua Catatan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Dompet', icon: Wallet, page: 'accounts' as Page, bg: 'bg-[#EFFAF6]', color: '#368F7B', border: 'border-[#368F7B]/20' },
            { label: 'Anggaran', icon: PiggyBank, page: 'budget' as Page, bg: 'bg-[#FFF5ED]', color: '#FFA94D', border: 'border-[#FFA94D]/20' },
            { label: 'Impian', icon: Target, page: 'goals' as Page, bg: 'bg-[#F2F0FF]', color: '#7D7AFF', border: 'border-[#7D7AFF]/20' },
          ].map(item => (
            <button key={item.page} onClick={() => onNavigate(item.page)} className={`${item.bg} ${item.border} border-2 rounded-2xl p-3.5 flex flex-col items-center gap-2 cursor-pointer interactive-card`}>
              <item.icon size={20} style={{ color: item.color }} strokeWidth={2.5} />
              <span className="text-[10px] font-black text-[#1C1B18]">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="bg-[#FFF5F5] rounded-2xl border-2 border-[#FF6584]/10 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#FF6584]/10">
              <Sparkles size={13} className="text-[#FF6584]" />
              <span className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">ANALISIS OTOMATIS</span>
              <span className="ml-auto text-[9px] font-black text-[#1C1B18]/30 bg-white px-2 py-0.5 rounded-full border border-[#1C1B18]/8">LOKAL</span>
            </div>
            <div className="divide-y divide-[#FF6584]/8">
              {insights.slice(0, 3).map(ins => (
                <div key={ins.id} className="px-4 py-3 flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ins.type === 'positive' ? 'bg-[#368F7B]' : ins.type === 'warning' ? 'bg-[#FFA94D]' : 'bg-[#FF6584]'}`} />
                  <div>
                    <p className="text-xs font-black text-[#1C1B18]">{ins.title}</p>
                    <p className="text-[10px] text-[#1C1B18]/50 font-medium mt-0.5 leading-relaxed">{ins.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

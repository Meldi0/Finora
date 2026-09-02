import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Sparkles, ArrowDownRight, ArrowUpRight, PieChart as PieIcon, Receipt, Calendar } from 'lucide-react';
import { getCategory, formatRupiah } from '../data/mockData';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import type { Transaction } from '../types';

type Period = 'weekly' | 'monthly' | 'yearly';

interface AnalyticsProps {
  transactions: Transaction[];
}

export default function Analytics({ transactions: txs }: AnalyticsProps) {
  const [period, setPeriod] = useState<Period>('monthly');

  // 1. Filter Transactions dynamically based on active period
  const filteredTxs = useMemo(() => {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (period === 'weekly') {
      const sevenDaysAgo = new Date(todayMidnight.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txs.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= sevenDaysAgo && txDate <= todayMidnight;
      });
    }

    if (period === 'monthly') {
      const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      return txs.filter(t => t.date.startsWith(monthPrefix));
    }

    // Yearly
    const yearPrefix = now.getFullYear().toString();
    return txs.filter(t => t.date.startsWith(yearPrefix));
  }, [txs, period]);

  const totalIncome = filteredTxs
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = filteredTxs
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  // 2. Dynamic Category Spending Breakdown for current period
  const dynamicCategorySpend = useMemo(() => {
    const expenseTxs = filteredTxs.filter(t => t.type === 'expense');
    if (expenseTxs.length === 0) return [];

    const totalExp = expenseTxs.reduce((s, t) => s + t.amount, 0);
    const catMap = new Map<string, number>();

    expenseTxs.forEach(t => {
      catMap.set(t.categoryId, (catMap.get(t.categoryId) || 0) + t.amount);
    });

    const result = Array.from(catMap.entries()).map(([catId, val]) => {
      const cat = getCategory(catId);
      return {
        name: cat?.name || catId,
        value: val,
        color: cat?.color || '#368F7B',
        pct: totalExp > 0 ? Math.round((val / totalExp) * 100) : 0,
      };
    });

    return result.sort((a, b) => b.value - a.value);
  }, [filteredTxs]);

  // 3. Truly Dynamic Cashflow Bar Chart adapting to Weekly / Monthly / Yearly
  const dynamicChartData = useMemo(() => {
    const now = new Date();

    if (period === 'weekly') {
      // 7 Days breakdown (e.g. Sen, Sel, Rab, Kam, Jum, Sab, Min)
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const daysData: { label: string; income: number; expense: number; fullDate: string }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dayLabel = dayNames[d.getDay()];

        const dayTxs = txs.filter(t => t.date === dateStr);
        const inc = dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const exp = dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        daysData.push({
          label: `${dayLabel} ${d.getDate()}`,
          income: inc,
          expense: exp,
          fullDate: dateStr,
        });
      }
      return daysData;
    }

    if (period === 'monthly') {
      // 4 Weeks breakdown of current month
      const weeksData = [
        { label: 'Mgg 1 (1-7)', income: 0, expense: 0 },
        { label: 'Mgg 2 (8-14)', income: 0, expense: 0 },
        { label: 'Mgg 3 (15-21)', income: 0, expense: 0 },
        { label: 'Mgg 4 (22+)', income: 0, expense: 0 },
      ];

      const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const monthTxs = txs.filter(t => t.date.startsWith(monthPrefix));

      monthTxs.forEach(t => {
        const dayNum = parseInt(t.date.slice(8, 10), 10);
        let wIdx = 0;
        if (dayNum > 21) wIdx = 3;
        else if (dayNum > 14) wIdx = 2;
        else if (dayNum > 7) wIdx = 1;

        if (t.type === 'income') weeksData[wIdx].income += t.amount;
        if (t.type === 'expense') weeksData[wIdx].expense += t.amount;
      });

      return weeksData;
    }

    // Yearly: 12 Months (Jan - Des) of current year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const yearPrefix = now.getFullYear().toString();
    const yearTxs = txs.filter(t => t.date.startsWith(yearPrefix));

    return monthNames.map((mName, mIdx) => {
      const mStr = `${yearPrefix}-${String(mIdx + 1).padStart(2, '0')}`;
      const mTxs = yearTxs.filter(t => t.date.startsWith(mStr));
      const inc = mTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = mTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      return {
        label: mName,
        income: inc,
        expense: exp,
      };
    });
  }, [txs, period]);

  const periodLabel = period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan';
  const chartSubTitle =
    period === 'weekly'
      ? 'Perbandingan harian (7 hari terakhir)'
      : period === 'monthly'
      ? 'Perbandingan per minggu (bulan ini)'
      : 'Perbandingan 12 bulan tahun ini';

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Floating Non-Pasaran Apple Header with Working Filter */}
      <div className="sticky top-0 z-30 px-3.5 sm:px-6 lg:px-10 py-2.5 bg-[#FAF5EF]/80 backdrop-blur-xl border-b border-charcoal/5 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-charcoal tracking-tight">Analitik</h1>
              <span className="text-[9px] font-black text-[#FF9F43] bg-[#FF9F43]/15 px-2 py-0.5 rounded-full border border-[#FF9F43]/20">
                {periodLabel}
              </span>
            </div>
          </div>

          {/* Apple Dynamic Segmented Floating Pill (Interactive & Active) */}
          <div className="flex items-center p-0.5 bg-white/90 backdrop-blur-md rounded-full border border-white/60 shadow-xs">
            {(['weekly', 'monthly', 'yearly'] as Period[]).map(p => {
              const isActive = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6584] to-[#FFA94D] text-white shadow-xs scale-[1.02]'
                      : 'text-charcoal/50 hover:text-charcoal'
                  }`}
                >
                  {p === 'weekly' ? 'Minggu' : p === 'monthly' ? 'Bulan' : 'Tahun'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3.5 sm:px-6 lg:px-10 py-3.5 space-y-3.5 pb-20 lg:pb-10 max-w-7xl mx-auto w-full">
        {/* Top Row: Hero Card (7 cols) + Metric Pods & Recommendation (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 items-stretch">
          {/* Left: Summary Hero */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-[1.3rem] sm:rounded-[1.6rem] bg-gradient-to-br from-[#FF9F43] to-[#FFA94D] p-3.5 sm:p-5 relative overflow-hidden shadow-md shadow-[#FF9F43]/20 text-white flex-1 flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-lg pointer-events-none" />

              <div>
                <div className="flex items-center justify-between relative mb-1">
                  <span className="text-white/85 text-[9px] font-extrabold uppercase tracking-wider">
                    Tingkat Tabungan {periodLabel}
                  </span>
                  <span className="text-[10px] font-bold text-white bg-black/15 px-2 py-0.5 rounded-full">
                    Kinerja Finansial
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black tracking-tight leading-none my-2 relative">
                  <AnimatedNumber value={savingsRate} suffix="%" />
                </div>
              </div>

              <p className="text-white/85 text-[10px] sm:text-xs font-bold relative pt-2 border-t border-white/20">
                Disimpan dari total pemasukan periode {periodLabel.toLowerCase()} ini.
              </p>
            </div>
          </div>

          {/* Right: Dual Pods + Advice */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-[#EBF7F2] rounded-[1.1rem] p-3 border border-[#368F7B]/15 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-5 h-5 rounded-full bg-[#368F7B]/20 flex items-center justify-center">
                    <ArrowDownRight size={11} className="text-[#368F7B]" />
                  </div>
                  <p className="text-[8px] font-black text-[#368F7B] uppercase tracking-wider">Pemasukan</p>
                </div>
                <div className="text-xs sm:text-sm font-black text-charcoal truncate">
                  <AnimatedNumber value={totalIncome} formatter={formatRupiah} />
                </div>
              </div>

              <div className="bg-[#FEEFEF] rounded-[1.1rem] p-3 border border-[#FF6584]/15 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-5 h-5 rounded-full bg-[#FF6584]/20 flex items-center justify-center">
                    <ArrowUpRight size={11} className="text-[#FF6584]" />
                  </div>
                  <p className="text-[8px] font-black text-[#FF6584] uppercase tracking-wider">Pengeluaran</p>
                </div>
                <div className="text-xs sm:text-sm font-black text-charcoal truncate">
                  <AnimatedNumber value={totalExpense} formatter={formatRupiah} />
                </div>
              </div>
            </div>

            {/* Recommendation Pod */}
            <div className="bg-[#FFF5EE] border border-[#FF9F43]/20 rounded-[1.1rem] p-3 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-[10px] font-black text-charcoal">
                  <Sparkles size={12} className="text-[#FF9F43]" />
                  <span>Status Finansial</span>
                </div>
                <span className="text-[9px] font-black text-[#FF9F43] bg-white px-1.5 py-0.5 rounded-full shadow-xs">
                  {savingsRate >= 20 ? 'Sehat' : 'Perlu Dihemat'}
                </span>
              </div>
              <p className="text-[10px] text-charcoal/65 font-semibold leading-relaxed">
                {savingsRate >= 20
                  ? 'Pertahankan kedisiplinan keuanganmu, tingkat tabunganmu sangat baik!'
                  : 'Cobalah tekan pengeluaran non-primer agar tingkat tabungan mencapai 20%.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Cashflow Bar Chart (7 cols) + Category Breakdown (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4">
          {/* Left 7 cols: Bar Chart (Adapts to Active Period) */}
          <div className="lg:col-span-7 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-charcoal">Masuk vs Keluar</h2>
                <p className="text-[10px] text-charcoal/40 font-medium">{chartSubTitle}</p>
              </div>
              <div className="flex gap-1.5">
                <div className="flex items-center gap-1 bg-[#368F7B]/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#368F7B]" />
                  <span className="text-[9px] font-black text-[#368F7B]">Masuk</span>
                </div>
                <div className="flex items-center gap-1 bg-[#FF6584]/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6584]" />
                  <span className="text-[9px] font-black text-[#FF6584]">Keluar</span>
                </div>
              </div>
            </div>

            <div className="mt-1">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={dynamicChartData} margin={{ top: 8, right: 6, left: -28, bottom: 0 }} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#24231F08" vertical={false} />
                  <XAxis
                    dataKey="label"
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
                      fontSize: 10,
                      fontFamily: 'Plus Jakarta Sans',
                      padding: '5px 8px',
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 700 }}
                    formatter={(val) => [formatRupiah(Number(val))]}
                  />
                  <Bar dataKey="income" name="Pemasukan" fill="#368F7B" radius={[5, 5, 0, 0]} maxBarSize={14} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#FF6584" radius={[5, 5, 0, 0]} maxBarSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 5 cols: Spending Distribution */}
          <div className="lg:col-span-5 bg-white rounded-[1.3rem] sm:rounded-[1.6rem] p-3.5 sm:p-4 border border-charcoal/5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-charcoal">Distribusi Pengeluaran</h2>
                  <p className="text-[10px] text-charcoal/40 font-medium">Kategori pada periode {periodLabel.toLowerCase()}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#F8F3ED] flex items-center justify-center">
                  <PieIcon size={12} className="text-charcoal/60" />
                </div>
              </div>

              {dynamicCategorySpend.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width={110} height={110}>
                      <PieChart>
                        <Pie
                          data={dynamicCategorySpend}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {dynamicCategorySpend.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: 'none',
                            backgroundColor: '#1C1B18',
                            color: '#fff',
                            fontSize: 10,
                            fontFamily: 'Plus Jakarta Sans',
                          }}
                          formatter={(val) => [formatRupiah(Number(val))]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    {dynamicCategorySpend.slice(0, 4).map((cat, i) => (
                      <div key={i} className="flex items-center justify-between gap-1.5 p-1 rounded-lg hover:bg-[#F8F3ED] transition-colors">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-2 h-2 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                          <span className="text-[11px] text-charcoal font-black truncate">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-charcoal/50 font-bold">{formatRupiah(cat.value)}</span>
                          <span className="text-[9px] font-black text-charcoal bg-[#F8F3ED] px-1.5 py-0.2 rounded-full">
                            {cat.pct}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center bg-[#F8F3ED]/60 rounded-xl">
                  <Receipt size={18} className="text-charcoal/30 mx-auto mb-1" />
                  <p className="text-[10px] text-charcoal/50 font-bold">Belum ada pengeluaran periode ini</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

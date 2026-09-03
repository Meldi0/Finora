import { useState, useMemo } from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, BarChart3, Sparkles } from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { categories, formatRupiah, formatRupiahFull } from '../data/mockData';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { Transaction } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
}

function getWeeklyData(txs: Transaction[], weekStart: string) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const FILLS = ['#C4C1FF', '#7D7AFF', '#9B98EE', '#7D7AFF', '#C4C1FF', '#9B98EE', '#C4C1FF'];

  const data = labels.map((day, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const expense = txs.filter(t => t.type === 'expense' && t.date === dateStr).reduce((s, t) => s + t.amount, 0);
    return { day, expense, fill: FILLS[i] };
  });

  const maxVal = Math.max(...data.map(d => d.expense), 1);
  return data.map(d => ({ ...d, val: d.expense > 0 ? Math.round((d.expense / maxVal) * 92) + 3 : 3 }));
}

function getMonthlyData(txs: Transaction[]) {
  const now = new Date();
  const labels = ['M1', 'M2', 'M3', 'M4'];
  const FILLS = ['#C4C1FF', '#7D7AFF', '#9B98EE', '#C4C1FF'];
  const data = labels.map((label, i) => {
    const weekStart = new Date(now.getFullYear(), now.getMonth(), 1 + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const expense = txs.filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d >= weekStart && d <= weekEnd;
    }).reduce((s, t) => s + t.amount, 0);
    return { day: label, expense, fill: FILLS[i] };
  });
  const maxVal = Math.max(...data.map(d => d.expense), 1);
  return data.map(d => ({ ...d, val: d.expense > 0 ? Math.round((d.expense / maxVal) * 92) + 3 : 3 }));
}

function getLast6MonthsData(txs: Transaction[]) {
  const now = new Date();
  const FILLS = ['#C4C1FF', '#9B98EE', '#7D7AFF', '#9B98EE', '#7D7AFF', '#C4C1FF'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const expense = txs.filter(t => t.type === 'expense' && t.date.startsWith(prefix)).reduce((s, t) => s + t.amount, 0);
    return { day: monthLabels[d.getMonth()], expense, fill: FILLS[i] };
  }).map((d, _, arr) => {
    const maxVal = Math.max(...arr.map(x => x.expense), 1);
    return { ...d, val: d.expense > 0 ? Math.round((d.expense / maxVal) * 92) + 3 : 3 };
  });
}

export default function Analytics({ transactions: txs }: AnalyticsProps) {
  const { weekDays, weekStart, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxs = useMemo(() => txs.filter(t => t.date.startsWith(monthPrefix)), [txs, monthPrefix]);

  const totalIncome = useMemo(() => monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const totalExpense = useMemo(() => monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const dailyAvg = Math.round(totalExpense / Math.max(1, now.getDate()));
  const efficiency = totalIncome > 0 ? Math.min(100, Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))) : 0;

  const weeklyData = useMemo(() => getWeeklyData(txs, weekStart), [txs, weekStart]);
  const monthlyData = useMemo(() => getMonthlyData(txs), [txs]);
  const last6Data = useMemo(() => getLast6MonthsData(txs), [txs]);

  const chartData = period === 'daily' ? weeklyData : period === 'weekly' ? monthlyData : last6Data;

  const chartLabel = period === 'daily'
    ? `Avg ${formatRupiah(dailyAvg)}/hari`
    : period === 'weekly'
    ? `Total ${formatRupiah(totalExpense)} bulan ini`
    : `6 bulan terakhir`;

  const chartTitle = period === 'daily' ? 'PENGELUARAN PER HARI (' + (isCurrentWeek ? 'MINGGU INI' : 'MINGGU TERPILIH') + ')'
    : period === 'weekly' ? 'PENGELUARAN PER MINGGU (BULAN INI)'
    : 'TREN 6 BULAN TERAKHIR';

  const catBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthTxs.filter(t => t.type === 'expense').forEach(t => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId) || categories[0];
        return { name: cat.name, value: amount, fill: cat.color };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [monthTxs]);

  const totalCatExp = catBreakdown.reduce((s, c) => s + c.value, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="ANALITIK KEUANGAN"
        gradientFromTo="from-[#A8A5F5] to-[#7D7AFF]"
        rightElement={
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30">
            <BarChart3 size={15} />
          </div>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-40 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Hero — Total Pengeluaran */}
        <div className="bg-[#F2F0FF] rounded-2xl p-4 border-2 border-[#7D7AFF]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#7D7AFF] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">PENGELUARAN BULAN INI</span>
            </div>
            <span className="text-[10px] font-black text-[#1C1B18] bg-white border-2 border-[#1C1B18]/10 px-3 py-0.5 rounded-full">{now.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight leading-none">{formatRupiahFull(totalExpense)}</h2>
            <span className={`text-xs font-black mb-1 ${efficiency >= 20 ? 'text-[#368F7B]' : 'text-[#FFA94D]'}`}>
              {efficiency}% efisien
            </span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border-2 border-[#1C1B18]/8">
            <div className="h-full bg-gradient-to-r from-[#9B98EE] to-[#7D7AFF] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[9px] font-black text-[#1C1B18]/30">
            <span>dari total pemasukan {formatRupiah(totalIncome)}</span>
          </div>
        </div>

        {/* 3-Pod Real Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#EFFAF6] rounded-2xl p-3.5 border-2 border-[#368F7B]/20 interactive-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#368F7B] uppercase">MASUK</span>
              <ArrowDownRight size={14} className="text-[#368F7B]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">{formatRupiah(totalIncome)}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Bulan Ini</p>
          </div>

          <div className="bg-[#FFF0F3] rounded-2xl p-3.5 border-2 border-[#FF6584]/20 interactive-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#FF6584] uppercase">HARIAN</span>
              <ArrowUpRight size={14} className="text-[#FF6584]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1C1B18] leading-none truncate">{formatRupiah(dailyAvg)}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Rata-rata</p>
          </div>

          <div className="bg-[#F2F0FF] rounded-2xl p-3.5 border-2 border-[#7D7AFF]/20 interactive-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-[#7D7AFF] uppercase">EFISIENSI</span>
              <TrendingUp size={14} className="text-[#7D7AFF]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1C1B18] leading-none">{efficiency}%</p>
            <p className={`text-[9px] font-black mt-1 ${efficiency >= 20 ? 'text-[#368F7B]' : 'text-[#FFA94D]'}`}>
              {efficiency >= 20 ? 'Sehat' : efficiency >= 0 ? 'Cukup' : 'Perhatikan'}
            </p>
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex bg-[#F4F4F4] p-1 rounded-full border border-[#1C1B18]/8">
          {(['daily', 'weekly', 'monthly'] as const).map((p, i) => (
            <button key={p} onClick={() => setPeriod(p)} className={`flex-1 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${period === p ? 'bg-white text-[#1C1B18] shadow-sm border border-[#1C1B18]/10 scale-102' : 'text-[#1C1B18]/40 hover:text-[#1C1B18]'}`}>
              {['PER HARI', 'PER MINGGU', '6 BULAN'][i]}
            </button>
          ))}
        </div>

        {/* Real-Data Lavender Chart */}
        <div className="bg-[#F2F0FF] rounded-2xl p-4 border-2 border-[#7D7AFF]/10 interactive-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-[#1C1B18]/60 uppercase tracking-wider">{chartTitle}</span>
            <span className="text-[10px] font-black text-[#7D7AFF] bg-white px-2.5 py-0.5 rounded-full border border-[#7D7AFF]/20">{chartLabel}</span>
          </div>

          {chartData.every(d => d.expense === 0) ? (
            <div className="h-[130px] flex flex-col items-center justify-center gap-2">
              <div className="flex gap-1.5 items-end">
                {chartData.map((_, i) => (
                  <div key={i} className="w-7 bg-[#7D7AFF]/10 rounded-full border border-[#7D7AFF]/20" style={{ height: `${20 + i * 8}px` }} />
                ))}
              </div>
              <p className="text-[10px] font-black text-[#1C1B18]/30">Belum ada data untuk periode ini</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-[30%] inset-x-0 border-b-2 border-dashed border-[#7D7AFF]/30 pointer-events-none z-10" />
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={chartData} margin={{ top: 22, right: 2, left: 2, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#1C1B18', fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ borderRadius: 10, border: 'none', background: '#1C1B18', color: '#fff', fontSize: 10, padding: '4px 10px', fontFamily: 'Plus Jakarta Sans' }}
                    formatter={(_: any, __: string, props: any) => [
                      props.payload?.expense > 0 ? formatRupiah(props.payload.expense) : 'Kosong',
                      'Pengeluaran'
                    ]}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="val" radius={[14, 14, 14, 14]} barSize={28}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} stroke="#1C1B18" strokeWidth={1.5} opacity={entry.expense === 0 ? 0.2 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Breakdown — Real Data */}
        {catBreakdown.length > 0 ? (
          <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1C1B18]/6 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">KATEGORI PENGELUARAN</h3>
              <span className="text-[9px] font-black text-[#1C1B18]/40">{now.toLocaleDateString('id-ID', { month: 'long' })}</span>
            </div>
            <div className="divide-y divide-[#1C1B18]/6">
              {catBreakdown.map((cat, i) => {
                const pct = totalCatExp > 0 ? Math.round((cat.value / totalCatExp) * 100) : 0;
                return (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-[#1C1B18]">{cat.name}</span>
                        <span className="text-xs font-black text-[#1C1B18]">{formatRupiah(cat.value)}</span>
                      </div>
                      <div className="w-full h-2 bg-[#F8F3ED] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: cat.fill }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#1C1B18]/40 w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#F2F0FF] rounded-2xl border-2 border-[#7D7AFF]/10 px-4 py-8 text-center">
            <p className="text-xs font-black text-[#1C1B18]/30">Belum ada pengeluaran bulan ini untuk dianalisis.</p>
          </div>
        )}
      </main>
    </div>
  );
}

import { RefreshCw, CreditCard, TrendingUp, Sparkles } from 'lucide-react';
import { formatRupiah } from '../data/mockData';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
import type { RecurringTransaction, SubscriptionItem } from '../types';

interface RecurringProps {
  recurring: RecurringTransaction[];
  subscriptions: SubscriptionItem[];
}

const FREQ_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  monthly: { bg: 'bg-[#F2F0FF]', text: 'text-[#7D7AFF]', border: 'border-[#7D7AFF]/25', label: 'Bulanan' },
  weekly:  { bg: 'bg-[#EFFAF6]', text: 'text-[#368F7B]', border: 'border-[#368F7B]/25', label: 'Mingguan' },
  yearly:  { bg: 'bg-[#FFF5ED]', text: 'text-[#FFA94D]', border: 'border-[#FFA94D]/25', label: 'Tahunan' },
  daily:   { bg: 'bg-[#FFF0F3]', text: 'text-[#FF6584]', border: 'border-[#FF6584]/25', label: 'Harian' },
};

export default function Recurring({ recurring }: RecurringProps) {
  const { weekDays, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();
  const activeRecurring = recurring.filter(r => r.active !== false);

  const totalMonthly = activeRecurring.reduce((s, r) => {
    if (r.frequency === 'monthly') return s + r.amount;
    if (r.frequency === 'weekly') return s + r.amount * 4;
    if (r.frequency === 'yearly') return s + Math.round(r.amount / 12);
    if (r.frequency === 'daily') return s + r.amount * 30;
    return s;
  }, 0);

  const totalAnnual = totalMonthly * 12;
  const activeCount = activeRecurring.length;

  const subs = activeRecurring.filter(r => r.isSubscription);
  const regular = activeRecurring.filter(r => !r.isSubscription);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="RUTIN & LANGGANAN"
        gradientFromTo="from-[#A0A0F5] to-[#7D7AFF]"
        rightElement={
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30">
            <RefreshCw size={14} />
          </div>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-40 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Hero Cost Overview */}
        <div className="bg-[#F2F0FF] rounded-2xl p-4 border-2 border-[#7D7AFF]/15 interactive-card animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#7D7AFF] animate-pulse" />
              <span className="text-[10px] font-black text-[#1C1B18]/50 uppercase tracking-wider">TAGIHAN RUTIN AKTIF</span>
            </div>
            <span className="text-[10px] font-black text-[#1C1B18] bg-white border-2 border-[#1C1B18]/10 px-3 py-0.5 rounded-full">{activeCount} ITEM</span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl font-black text-[#1C1B18] tracking-tight leading-none">{formatRupiah(totalMonthly)}</h2>
            <span className="text-xs font-black text-[#1C1B18]/40 mb-1">per bulan</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#1C1B18]/40">Estimasi Tahunan</span>
            <span className="text-xs font-black text-[#FF6584]">{formatRupiah(totalAnnual)}/tahun</span>
          </div>
        </div>

        {/* 3-Pod Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#F2F0FF] rounded-2xl p-3.5 border-2 border-[#7D7AFF]/20 interactive-card">
            <RefreshCw size={14} className="text-[#7D7AFF] mb-2" />
            <p className="text-base font-black text-[#1C1B18] leading-none">{activeCount}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Total Aktif</p>
          </div>
          <div className="bg-[#FFF0F3] rounded-2xl p-3.5 border-2 border-[#FF6584]/20 interactive-card">
            <CreditCard size={14} className="text-[#FF6584] mb-2" />
            <p className="text-base font-black text-[#1C1B18] leading-none truncate">{formatRupiah(totalMonthly)}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Per Bulan</p>
          </div>
          <div className="bg-[#EFFAF6] rounded-2xl p-3.5 border-2 border-[#368F7B]/20 interactive-card">
            <TrendingUp size={14} className="text-[#368F7B] mb-2" />
            <p className="text-base font-black text-[#1C1B18] leading-none truncate">{formatRupiah(totalAnnual)}</p>
            <p className="text-[9px] text-[#1C1B18]/40 font-bold mt-1">Per Tahun</p>
          </div>
        </div>

        {/* Subscriptions Section */}
        {subs.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1C1B18]/6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7D7AFF]" />
              <h3 className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">LANGGANAN DIGITAL</h3>
            </div>
            <div className="divide-y divide-[#1C1B18]/6">
              {subs.map(r => {
                const style = FREQ_STYLES[r.frequency] || FREQ_STYLES.monthly;
                return (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8F3ED] transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${style.bg} ${style.border}`}>
                      <RefreshCw size={14} className={style.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#1C1B18] truncate">{r.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                          {style.label}
                        </span>
                        {r.dayOfMonth && (
                          <span className="text-[9px] text-[#1C1B18]/40 font-bold">Tgl {r.dayOfMonth}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#FF6584]">-{formatRupiah(r.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Recurring Section */}
        {regular.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1C1B18]/6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FFA94D]" />
              <h3 className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">TAGIHAN RUTIN</h3>
            </div>
            <div className="divide-y divide-[#1C1B18]/6">
              {regular.map(r => {
                const style = FREQ_STYLES[r.frequency] || FREQ_STYLES.monthly;
                return (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8F3ED] transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${style.bg} ${style.border}`}>
                      <RefreshCw size={14} className={style.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#1C1B18] truncate">{r.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                          {style.label}
                        </span>
                        {r.dayOfMonth && (
                          <span className="text-[9px] text-[#1C1B18]/40 font-bold">Tgl {r.dayOfMonth}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-black ${r.type === 'income' ? 'text-[#368F7B]' : 'text-[#FF6584]'}`}>
                        {r.type === 'income' ? '+' : '-'}{formatRupiah(r.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeRecurring.length === 0 && (
          <div className="py-12 text-center">
            <RefreshCw size={32} className="mx-auto text-[#1C1B18]/15 mb-3" />
            <p className="text-xs font-black text-[#1C1B18]/30">Belum ada tagihan rutin yang dicatat.</p>
          </div>
        )}
      </main>
    </div>
  );
}

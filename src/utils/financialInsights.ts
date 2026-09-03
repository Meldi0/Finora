import type { Transaction, Budget, Goal, RecurringTransaction, FinancialInsight } from '../types';
import { formatRupiah } from '../data/mockData';

/**
 * Deterministic, rule-based financial insights engine.
 * 100% offline, local computation without external AI dependency.
 */
export function generateFinancialInsights(
  transactions: Transaction[],
  budgets: Budget[],
  goals: Goal[],
  recurring: RecurringTransaction[]
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7);

  // Previous month string YYYY-MM
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevDate.toISOString().slice(0, 7);

  // 1. Food & Dining Spending Trend
  const currentFood = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.categoryId === 'food' && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const prevFood = transactions
    .filter(t => t.date.startsWith(prevMonthStr) && t.categoryId === 'food' && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  if (prevFood > 0 && currentFood > 0) {
    const diffPct = Math.round(((currentFood - prevFood) / prevFood) * 100);
    if (diffPct > 15) {
      insights.push({
        id: 'food-trend-warn',
        type: 'warning',
        title: 'Pengeluaran Makanan Meningkat',
        message: `Pengeluaran makanan bulan ini naik ${diffPct}% dibanding bulan lalu (${formatRupiah(currentFood)} vs ${formatRupiah(prevFood)}).`,
        actionText: 'Cek Anggaran',
        actionPage: 'budget',
      });
    } else if (diffPct < -10) {
      insights.push({
        id: 'food-trend-good',
        type: 'positive',
        title: 'Pengeluaran Makanan Lebih Hemat',
        message: `Bagus! Pengeluaran makananmu ${Math.abs(diffPct)}% lebih hemat dibanding bulan lalu.`,
      });
    }
  }

  // 2. Subscription Total Insight
  const activeSubscriptions = recurring.filter(r => r.active && r.isSubscription && r.type === 'expense');
  const monthlySubTotal = activeSubscriptions.reduce((s, r) => s + r.amount, 0);
  if (monthlySubTotal > 0) {
    insights.push({
      id: 'sub-total-info',
      type: 'info',
      title: 'Total Langganan Rutin',
      message: `Total tagihan langgananmu bulan ini adalah ${formatRupiah(monthlySubTotal)} (${formatRupiah(monthlySubTotal * 12)}/tahun).`,
      actionText: 'Lihat Langganan',
      actionPage: 'recurring',
    });
  }

  // 3. Budget Intelligence & Risk Warning
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay);

  budgets.forEach(b => {
    if (b.limit > 0) {
      const pctUsed = Math.round((b.spent / b.limit) * 100);
      const dailyRate = Math.round(b.spent / Math.max(1, currentDay));
      const projectedTotal = b.spent + dailyRate * remainingDays;

      if (projectedTotal > b.limit && pctUsed < 100) {
        const estOver = projectedTotal - b.limit;
        insights.push({
          id: `budget-risk-${b.categoryId}`,
          type: 'warning',
          title: `Risiko Melebihi Anggaran`,
          message: `Laju pengeluaran saat ini berpotensi melampaui batas anggaran sekitar ${formatRupiah(estOver)}.`,
          actionText: 'Sesuaikan Anggaran',
          actionPage: 'budget',
        });
      } else if (pctUsed >= 100) {
        insights.push({
          id: `budget-exceeded-${b.categoryId}`,
          type: 'warning',
          title: `Anggaran Terlampaui`,
          message: `Anggaran telah terpakai ${pctUsed}%. Pertimbangkan membatasi pengeluaran kategori ini.`,
          actionText: 'Detail Anggaran',
          actionPage: 'budget',
        });
      }
    }
  });

  // 4. Goal Required Monthly Saving Calculation
  goals.forEach(g => {
    if (g.currentAmount < g.targetAmount && g.deadline) {
      const deadlineDate = new Date(g.deadline);
      const diffMonths = Math.max(
        1,
        (deadlineDate.getFullYear() - now.getFullYear()) * 12 + (deadlineDate.getMonth() - now.getMonth())
      );
      const remainingAmount = g.targetAmount - g.currentAmount;
      const requiredMonthly = Math.ceil(remainingAmount / diffMonths);

      const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
      if (pct >= 50 && pct < 100) {
        insights.push({
          id: `goal-progress-${g.id}`,
          type: 'positive',
          title: `Target ${g.name} Hampir Tercapai`,
          message: `Progres impian sudah ${pct}%. Kamu butuh menabung ${formatRupiah(requiredMonthly)}/bulan hingga ${g.deadline}.`,
          actionText: 'Lihat Impian',
          actionPage: 'goals',
        });
      }
    }
  });

  // Fallback default insight if no specific triggers match
  if (insights.length === 0) {
    insights.push({
      id: 'default-healthy',
      type: 'positive',
      title: 'Arus Kas Stabil',
      message: 'Pengeluaranmu berada dalam kondisi aman. Pertahankan pola tabungan rutinmu!',
    });
  }

  return insights.slice(0, 3);
}

/**
 * Calculates end-of-month forecasted cashflow based on current balance,
 * recurring income/bills, and average daily burn rate.
 */
export function calculateCashflowForecast(
  currentBalance: number,
  transactions: Transaction[],
  recurring: RecurringTransaction[]
) {
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - currentDay;

  const currentMonthStr = now.toISOString().slice(0, 7);
  const currentMonthTxs = transactions.filter(
    t => t.date.startsWith(currentMonthStr) && t.type === 'expense'
  );

  const monthSpent = currentMonthTxs.reduce((s, t) => s + t.amount, 0);
  const dailyBurnRate = Math.round(monthSpent / Math.max(1, currentDay));

  const upcomingRecurringExpenses = recurring
    .filter(r => r.active && r.type === 'expense' && r.dayOfMonth > currentDay)
    .reduce((s, r) => s + r.amount, 0);

  const upcomingRecurringIncome = recurring
    .filter(r => r.active && r.type === 'income' && r.dayOfMonth > currentDay)
    .reduce((s, r) => s + r.amount, 0);

  const projectedDailyExpense = dailyBurnRate * remainingDays;

  const projectedEndBalance = Math.max(
    0,
    currentBalance + upcomingRecurringIncome - upcomingRecurringExpenses - projectedDailyExpense
  );

  return {
    currentBalance,
    dailyBurnRate,
    remainingDays,
    upcomingRecurringIncome,
    upcomingRecurringExpenses,
    projectedEndBalance,
  };
}

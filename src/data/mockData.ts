import type { Account, Category, Transaction, Budget, Goal, RecurringTransaction, SubscriptionItem, AssetLiability } from '../types';

export const accounts: Account[] = [
  { id: 'cash', name: 'Tunai', icon: 'cash', balance: 500000, color: '#2D6A4F', type: 'cash' },
  { id: 'bca', name: 'BCA Utama', icon: 'bca', balance: 8500000, color: '#368F7B', type: 'bank', accountNumber: '883019284' },
  { id: 'dana', name: 'DANA Wallet', icon: 'dana', balance: 750000, color: '#FF6584', type: 'e-wallet' },
  { id: 'gopay', name: 'GoPay', icon: 'gopay', balance: 500000, color: '#7D7AFF', type: 'e-wallet' },
];

export const categories: Category[] = [
  { id: 'food', name: 'Makanan', icon: 'food', type: 'expense', color: '#FF6584' },
  { id: 'transport', name: 'Transportasi', icon: 'transport', type: 'expense', color: '#FF9F43' },
  { id: 'shopping', name: 'Belanja', icon: 'shopping', type: 'expense', color: '#7D7AFF' },
  { id: 'entertainment', name: 'Hiburan', icon: 'entertainment', type: 'expense', color: '#8B5CF6' },
  { id: 'education', name: 'Pendidikan', icon: 'education', type: 'expense', color: '#368F7B' },
  { id: 'bills', name: 'Tagihan', icon: 'bills', type: 'expense', color: '#2D6A4F' },
  { id: 'health', name: 'Kesehatan', icon: 'health', type: 'expense', color: '#FF758C' },
  { id: 'subscription', name: 'Langganan', icon: 'subscription', type: 'expense', color: '#9B98EE' },
  { id: 'travel', name: 'Perjalanan', icon: 'travel', type: 'expense', color: '#FF9F43' },
  { id: 'other_expense', name: 'Lainnya', icon: 'other_expense', type: 'expense', color: '#4E8773' },
  { id: 'salary', name: 'Gaji', icon: 'salary', type: 'income', color: '#2D6A4F' },
  { id: 'freelance', name: 'Freelance', icon: 'freelance', type: 'income', color: '#368F7B' },
  { id: 'business', name: 'Bisnis', icon: 'business', type: 'income', color: '#FF9F43' },
  { id: 'investment', name: 'Investasi', icon: 'investment', type: 'income', color: '#7D7AFF' },
  { id: 'gift', name: 'Hadiah', icon: 'gift', type: 'income', color: '#FF758C' },
  { id: 'other_income', name: 'Lainnya', icon: 'other_income', type: 'income', color: '#4E8773' },
];

export const transactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 8500000, categoryId: 'salary', accountId: 'bca', merchant: 'PT Teknologi Mandiri', description: 'Gaji Bulanan September', date: '2026-09-01' },
  { id: 't2', type: 'expense', amount: 35000, categoryId: 'food', accountId: 'cash', merchant: 'Warung Nasi', description: 'Makan siang ayam bakar', date: '2026-09-02' },
  { id: 't3', type: 'expense', amount: 25000, categoryId: 'transport', accountId: 'gopay', merchant: 'Gojek', description: 'Ojek online ke kantor', date: '2026-09-02' },
  { id: 't4', type: 'income', amount: 500000, categoryId: 'freelance', accountId: 'bca', merchant: 'Klien Studio', description: 'Freelance desain UI', date: '2026-09-02' },
  { id: 't5', type: 'expense', amount: 120000, categoryId: 'entertainment', accountId: 'dana', merchant: 'Cinema XXI', description: 'Nonton bioskop akhir pekan', date: '2026-09-03' },
  { id: 't6', type: 'expense', amount: 65000, categoryId: 'subscription', accountId: 'dana', merchant: 'Netflix', description: 'Langganan Netflix HD', date: '2026-09-03' },
  { id: 't7', type: 'expense', amount: 45000, categoryId: 'food', accountId: 'cash', merchant: 'Kopi Kenangan', description: 'Es kopi susu & roti', date: '2026-09-03' },
  { id: 't8', type: 'expense', amount: 300000, categoryId: 'bills', accountId: 'bca', merchant: 'IndiHome', description: 'Tagihan internet rumah', date: '2026-09-03' },
  { id: 't9', type: 'transfer', amount: 500000, categoryId: 'bills', accountId: 'bca', fromAccountId: 'bca', toAccountId: 'gopay', merchant: 'Topup GoPay', description: 'Isi saldo GoPay dari BCA', date: '2026-09-03' },
];

export const budgets: Budget[] = [
  { categoryId: 'food', limit: 1200000, spent: 380000 },
  { categoryId: 'transport', limit: 500000, spent: 140000 },
  { categoryId: 'entertainment', limit: 400000, spent: 120000 },
  { categoryId: 'shopping', limit: 600000, spent: 250000 },
  { categoryId: 'subscription', limit: 200000, spent: 104000 },
  { categoryId: 'education', limit: 300000, spent: 150000 },
];

export const goals: Goal[] = [
  { id: 'g1', name: 'Laptop Baru', icon: 'laptop', targetAmount: 12000000, currentAmount: 7500000, deadline: '2027-06-01', color: '#2D6A4F' },
  { id: 'g2', name: 'Liburan Bali', icon: 'bali', targetAmount: 5000000, currentAmount: 1800000, deadline: '2027-01-01', color: '#FF6584' },
  { id: 'g3', name: 'Dana Darurat 6 Bln', icon: 'emergency', targetAmount: 25000000, currentAmount: 12000000, deadline: '2027-12-01', color: '#368F7B' },
];

export const recurringTransactions: RecurringTransaction[] = [
  { id: 'r1', name: 'Sewa Kos', amount: 1500000, type: 'expense', frequency: 'monthly', dayOfMonth: 1, categoryId: 'bills', accountId: 'bca', isSubscription: false, active: true },
  { id: 'r2', name: 'IndiHome Internet', amount: 300000, type: 'expense', frequency: 'monthly', dayOfMonth: 5, categoryId: 'bills', accountId: 'bca', isSubscription: true, active: true },
  { id: 'r3', name: 'Netflix Premium', amount: 65000, type: 'expense', frequency: 'monthly', dayOfMonth: 3, categoryId: 'subscription', accountId: 'dana', isSubscription: true, active: true },
  { id: 'r4', name: 'Spotify Family', amount: 39000, type: 'expense', frequency: 'monthly', dayOfMonth: 9, categoryId: 'subscription', accountId: 'dana', isSubscription: true, active: true },
  { id: 'r5', name: 'Google One 100GB', amount: 26000, type: 'expense', frequency: 'monthly', dayOfMonth: 15, categoryId: 'subscription', accountId: 'dana', isSubscription: true, active: true },
];

export const subscriptionItems: SubscriptionItem[] = [
  { id: 's1', name: 'Netflix', amount: 65000, billingCycle: 'monthly', billingDay: 3, categoryId: 'subscription', icon: 'tv' },
  { id: 's2', name: 'Spotify', amount: 39000, billingCycle: 'monthly', billingDay: 9, categoryId: 'subscription', icon: 'music' },
  { id: 's3', name: 'Google One', amount: 26000, billingCycle: 'monthly', billingDay: 15, categoryId: 'subscription', icon: 'cloud' },
];

export const assetsLiabilities: AssetLiability[] = [
  { id: 'a1', name: 'Tabungan Rekening BCA', type: 'asset', category: 'investment', amount: 8500000, notes: 'Dana cair' },
  { id: 'a2', name: 'E-Wallet (GoPay & DANA)', type: 'asset', category: 'other', amount: 1250000, notes: 'Saldo digital' },
  { id: 'a3', name: 'Logam Mulia 5gr', type: 'asset', category: 'investment', amount: 6200000, notes: 'Investasi emas' },
  { id: 'l1', name: 'Kartu Kredit (Cicilan)', type: 'liability', category: 'credit', amount: 1800000, notes: 'Sisa 3 bulan' },
];

export const getCategory = (id: string) => categories.find(c => c.id === id) || categories[0];
export const getAccount = (id: string) => accounts.find(a => a.id === id) || accounts[0];

export const formatRupiah = (amount: number): string => {
  if (amount >= 1000000) {
    const val = amount / 1000000;
    return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatRupiahFull = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatDateShort = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

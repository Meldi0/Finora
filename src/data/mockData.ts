import type { Account, Category, Transaction, Budget, Goal } from '../types';

export const accounts: Account[] = [
  { id: 'cash', name: 'Tunai', icon: 'cash', balance: 500000, color: '#F5A623' },
  { id: 'bca', name: 'BCA', icon: 'bca', balance: 2500000, color: '#3D9188' },
  { id: 'dana', name: 'DANA', icon: 'dana', balance: 750000, color: '#E95C7A' },
  { id: 'gopay', name: 'GoPay', icon: 'gopay', balance: 500000, color: '#B8B4E8' },
];

export const categories: Category[] = [
  { id: 'food', name: 'Makanan', icon: 'food', type: 'expense', color: '#E95C7A' },
  { id: 'transport', name: 'Transportasi', icon: 'transport', type: 'expense', color: '#F5A623' },
  { id: 'shopping', name: 'Belanja', icon: 'shopping', type: 'expense', color: '#B8B4E8' },
  { id: 'entertainment', name: 'Hiburan', icon: 'entertainment', type: 'expense', color: '#F6A6B8' },
  { id: 'education', name: 'Pendidikan', icon: 'education', type: 'expense', color: '#3D9188' },
  { id: 'bills', name: 'Tagihan', icon: 'bills', type: 'expense', color: '#286E68' },
  { id: 'health', name: 'Kesehatan', icon: 'health', type: 'expense', color: '#E95C7A' },
  { id: 'subscription', name: 'Langganan', icon: 'subscription', type: 'expense', color: '#B8B4E8' },
  { id: 'travel', name: 'Perjalanan', icon: 'travel', type: 'expense', color: '#F5A623' },
  { id: 'other_expense', name: 'Lainnya', icon: 'other_expense', type: 'expense', color: '#FFD8B8' },
  { id: 'salary', name: 'Gaji', icon: 'salary', type: 'income', color: '#3D9188' },
  { id: 'freelance', name: 'Freelance', icon: 'freelance', type: 'income', color: '#286E68' },
  { id: 'business', name: 'Bisnis', icon: 'business', type: 'income', color: '#F5A623' },
  { id: 'investment', name: 'Investasi', icon: 'investment', type: 'income', color: '#3D9188' },
  { id: 'gift', name: 'Hadiah', icon: 'gift', type: 'income', color: '#F6A6B8' },
  { id: 'other_income', name: 'Lainnya', icon: 'other_income', type: 'income', color: '#FFD8B8' },
];

export const transactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 8500000, categoryId: 'salary', accountId: 'bca', description: 'Gaji September', date: '2026-09-01' },
  { id: 't2', type: 'expense', amount: 35000, categoryId: 'food', accountId: 'cash', description: 'Makan siang', date: '2026-09-02' },
  { id: 't3', type: 'expense', amount: 25000, categoryId: 'transport', accountId: 'gopay', description: 'Gojek ke kantor', date: '2026-09-02' },
  { id: 't4', type: 'income', amount: 500000, categoryId: 'freelance', accountId: 'bca', description: 'Freelance desain logo', date: '2026-09-02' },
  { id: 't5', type: 'expense', amount: 120000, categoryId: 'entertainment', accountId: 'dana', description: 'Nonton bioskop', date: '2026-09-03' },
  { id: 't6', type: 'expense', amount: 65000, categoryId: 'subscription', accountId: 'dana', description: 'Netflix bulanan', date: '2026-09-03' },
  { id: 't7', type: 'expense', amount: 45000, categoryId: 'food', accountId: 'cash', description: 'Kopi dan camilan', date: '2026-09-04' },
  { id: 't8', type: 'expense', amount: 300000, categoryId: 'bills', accountId: 'bca', description: 'Tagihan internet', date: '2026-09-05' },
  { id: 't9', type: 'expense', amount: 85000, categoryId: 'food', accountId: 'gopay', description: 'GrabFood makan malam', date: '2026-09-05' },
  { id: 't10', type: 'expense', amount: 250000, categoryId: 'shopping', accountId: 'dana', description: 'Baju baru', date: '2026-09-06' },
  { id: 't11', type: 'income', amount: 750000, categoryId: 'freelance', accountId: 'bca', description: 'Freelance web development', date: '2026-09-07' },
  { id: 't12', type: 'expense', amount: 50000, categoryId: 'transport', accountId: 'gopay', description: 'Bensin motor', date: '2026-09-07' },
  { id: 't13', type: 'expense', amount: 180000, categoryId: 'health', accountId: 'bca', description: 'Vitamin dan suplemen', date: '2026-09-08' },
  { id: 't14', type: 'expense', amount: 75000, categoryId: 'food', accountId: 'cash', description: 'Makan bersama teman', date: '2026-09-08' },
  { id: 't15', type: 'expense', amount: 39000, categoryId: 'subscription', accountId: 'dana', description: 'Spotify Premium', date: '2026-09-09' },
  { id: 't16', type: 'expense', amount: 150000, categoryId: 'education', accountId: 'bca', description: 'Buku pemrograman', date: '2026-09-10' },
  { id: 't17', type: 'income', amount: 200000, categoryId: 'gift', accountId: 'cash', description: 'Hadiah ulang tahun', date: '2026-09-10' },
  { id: 't18', type: 'expense', amount: 95000, categoryId: 'food', accountId: 'gopay', description: 'Makan siang kantor', date: '2026-09-11' },
  { id: 't19', type: 'expense', amount: 35000, categoryId: 'transport', accountId: 'gopay', description: 'Ojek pulang kantor', date: '2026-09-11' },
];

export const budgets: Budget[] = [
  { categoryId: 'food', limit: 1000000, spent: 335000 },
  { categoryId: 'transport', limit: 400000, spent: 110000 },
  { categoryId: 'entertainment', limit: 300000, spent: 120000 },
  { categoryId: 'shopping', limit: 500000, spent: 250000 },
  { categoryId: 'subscription', limit: 200000, spent: 104000 },
  { categoryId: 'education', limit: 300000, spent: 150000 },
];

export const goals: Goal[] = [
  { id: 'g1', name: 'Laptop Baru', icon: 'laptop', targetAmount: 12000000, currentAmount: 7500000, deadline: '2027-06-01', color: '#3D9188' },
  { id: 'g2', name: 'Liburan Bali', icon: 'bali', targetAmount: 5000000, currentAmount: 1800000, deadline: '2027-01-01', color: '#E95C7A' },
  { id: 'g3', name: 'Dana Darurat', icon: 'emergency', targetAmount: 25000000, currentAmount: 12000000, deadline: '2027-12-01', color: '#F5A623' },
];

export const cashflowData = [
  { month: 'Apr', income: 8500000, expense: 4200000 },
  { month: 'Mei', income: 8500000, expense: 5100000 },
  { month: 'Jun', income: 9200000, expense: 3800000 },
  { month: 'Jul', income: 8500000, expense: 4600000 },
  { month: 'Agu', income: 10000000, expense: 5300000 },
  { month: 'Sep', income: 9950000, expense: 1809000 },
];

export const categorySpend = [
  { name: 'Makanan', value: 335000, color: '#E95C7A', pct: 35 },
  { name: 'Transportasi', value: 110000, color: '#F5A623', pct: 12 },
  { name: 'Belanja', value: 250000, color: '#B8B4E8', pct: 26 },
  { name: 'Hiburan', value: 120000, color: '#F6A6B8', pct: 12 },
  { name: 'Langganan', value: 104000, color: '#3D9188', pct: 11 },
  { name: 'Lainnya', value: 90000, color: '#FFD8B8', pct: 4 },
];

export const getCategory = (id: string) => categories.find(c => c.id === id);
export const getAccount = (id: string) => accounts.find(a => a.id === id);

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
  const today = new Date('2026-09-02');
  const yesterday = new Date('2026-09-01');
  if (d.toDateString() === today.toDateString()) return 'Hari Ini';
  if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
};

export const formatDateShort = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

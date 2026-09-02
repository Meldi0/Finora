import { getCategory, getAccount } from '../data/mockData';
import type { Transaction } from '../types';

export function exportTransactionsToCSV(transactions: Transaction[]) {
  const headers = ['ID', 'Tanggal', 'Jenis', 'Kategori', 'Akun', 'Nominal (Rp)', 'Deskripsi'];

  const rows = transactions.map(t => {
    const category = getCategory(t.categoryId)?.name || t.categoryId;
    const account = getAccount(t.accountId)?.name || t.accountId;
    const typeLabel = t.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const cleanDesc = `"${(t.description || '').replace(/"/g, '""')}"`;

    return [
      t.id,
      t.date,
      typeLabel,
      `"${category}"`,
      `"${account}"`,
      t.amount,
      cleanDesc,
    ].join(',');
  });

  // UTF-8 BOM for Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `finora_transaksi_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

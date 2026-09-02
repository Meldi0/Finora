import { useEffect } from 'react';
import { X, Trash2, ArrowDownRight, ArrowUpRight, Calendar, CreditCard, Tag } from 'lucide-react';
import IconMapper from './ui/IconMapper';
import { formatRupiahFull, getCategory, getAccount } from '../data/mockData';
import type { Transaction } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
  onDelete,
}: TransactionDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const category = getCategory(transaction.categoryId);
  const account = getAccount(transaction.accountId);

  const handleDelete = () => {
    onDelete(transaction.id);
    onClose();
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-t-[1.6rem] lg:rounded-[1.6rem] px-4 pt-3.5 pb-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-10 h-1 bg-charcoal/15 rounded-full mx-auto mb-2.5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-charcoal/40 uppercase tracking-wider">
            Rincian Transaksi
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} className="text-charcoal/70" />
          </button>
        </div>

        {/* Hero Amount */}
        <div
          className={`p-3.5 rounded-2xl text-center mb-3 border ${
            isIncome
              ? 'bg-[#EBF7F2] border-[#368F7B]/20 text-[#368F7B]'
              : 'bg-[#FEEFEF] border-[#FF6584]/20 text-[#FF6584]'
          }`}
        >
          <div
            className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center mb-1.5 shadow-xs ${
              isIncome ? 'bg-[#368F7B] text-white' : 'bg-[#FF6584] text-white'
            }`}
          >
            {isIncome ? <ArrowDownRight size={18} strokeWidth={2.5} /> : <ArrowUpRight size={18} strokeWidth={2.5} />}
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-0.5">
            {isIncome ? 'Pemasukan' : 'Pengeluaran'}
          </p>
          <p className="text-xl font-black tracking-tight">
            {isIncome ? '+' : '-'} {formatRupiahFull(transaction.amount)}
          </p>
        </div>

        {/* Info Rows */}
        <div className="bg-[#FAF5EF] rounded-2xl p-3 space-y-2 border border-charcoal/5 mb-3.5 text-xs">
          {/* Description */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-charcoal/5">
            <span className="text-[11px] font-bold text-charcoal/40">Deskripsi</span>
            <span className="text-xs font-black text-charcoal text-right">
              {transaction.description}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-charcoal/5">
            <span className="text-[11px] font-bold text-charcoal/40 flex items-center gap-1">
              <Tag size={11} /> Kategori
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded flex items-center justify-center"
                style={{ backgroundColor: `${category?.color || '#368F7B'}20` }}
              >
                <IconMapper name={category?.icon || ''} size={10} color={category?.color} />
              </div>
              <span className="text-xs font-black text-charcoal">
                {category?.name || 'Lainnya'}
              </span>
            </div>
          </div>

          {/* Account */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-charcoal/5">
            <span className="text-[11px] font-bold text-charcoal/40 flex items-center gap-1">
              <CreditCard size={11} /> Dompet
            </span>
            <div className="flex items-center gap-1.5">
              <IconMapper name={account?.icon || ''} size={12} color="#368F7B" />
              <span className="text-xs font-black text-charcoal">
                {account?.name || 'Dompet'}
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-charcoal/40 flex items-center gap-1">
              <Calendar size={11} /> Tanggal
            </span>
            <span className="text-xs font-black text-charcoal text-right">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="w-full py-2.5 bg-[#FF6584]/10 hover:bg-[#FF6584]/15 border border-[#FF6584]/20 rounded-xl text-[#FF6584] font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Trash2 size={14} />
          <span>Hapus Transaksi Ini</span>
        </button>
      </div>
    </div>
  );
}

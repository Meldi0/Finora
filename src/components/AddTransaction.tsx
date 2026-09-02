import { useState, useEffect } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { categories } from '../data/mockData';
import IconMapper from './ui/IconMapper';
import type { Transaction, Account } from '../types';

interface AddTransactionProps {
  accounts: Account[];
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  onAddAccount?: () => void;
}

export default function AddTransaction({
  accounts,
  onClose,
  onSave,
  onAddAccount,
}: AddTransactionProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [rawAmount, setRawAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'bca');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (accounts.length > 0 && !accounts.some(a => a.id === accountId)) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTypeChange = (t: 'income' | 'expense') => {
    setType(t);
    setCategoryId(t === 'income' ? 'salary' : 'food');
  };

  const formatDisplay = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return parseInt(digits, 10).toLocaleString('id-ID');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawAmount(digits);
  };

  const handleSave = () => {
    const amount = parseInt(rawAmount, 10);
    if (!amount || !description.trim()) return;

    const effectiveAccountId = accountId || accounts[0]?.id || 'cash';

    onSave({
      type,
      amount,
      categoryId,
      accountId: effectiveAccountId,
      description: description.trim(),
      date: date || new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  const isValid = Boolean(
    rawAmount &&
    parseInt(rawAmount, 10) > 0 &&
    description.trim() &&
    (accounts.length > 0 || accountId)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-[1.6rem] lg:rounded-[1.6rem] px-4 pt-3.5 pb-6 shadow-2xl animate-scale-in max-h-[92vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-10 h-1 bg-charcoal/15 rounded-full mx-auto mb-2.5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-charcoal">Catat Transaksi</h2>
            <p className="text-[10px] text-charcoal/40 font-semibold">Pencatatan manual instan</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} className="text-charcoal/70" />
          </button>
        </div>

        {/* Type Segmented Pill */}
        <div className="flex bg-[#FAF5EF] p-1 rounded-full mb-3 border border-charcoal/5">
          <button
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-[#FF6584] text-white shadow-xs'
                : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-[#368F7B] text-white shadow-xs'
                : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Nominal Amount Input */}
        <div className="mb-3 bg-[#FAF5EF] rounded-xl p-3 border border-charcoal/5 text-center">
          <p className="text-[10px] font-black text-charcoal/40 uppercase tracking-wider mb-1">
            Nominal {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-black text-charcoal/40">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplay(rawAmount)}
              onChange={handleAmountChange}
              placeholder="0"
              autoFocus
              className="w-full text-center text-xl sm:text-2xl font-black text-charcoal placeholder:text-charcoal/20 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Description Input */}
        <div className="mb-3">
          <p className="text-[10px] font-black text-charcoal/50 mb-1">Keterangan Catatan</p>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Contoh: Makan siang, Gaji bulanan..."
            className="w-full bg-[#FAF5EF] border border-charcoal/5 rounded-xl px-3 py-2 text-xs font-bold text-charcoal placeholder:text-charcoal/30 outline-none focus:ring-1 focus:ring-[#FF6584]/30"
          />
        </div>

        {/* Account Selector */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-black text-charcoal/50">Simpan ke Dompet</p>
            {onAddAccount && (
              <button
                type="button"
                onClick={onAddAccount}
                className="text-[10px] font-black text-[#368F7B] hover:underline flex items-center gap-0.5"
              >
                <Plus size={10} />
                <span>Tambah Baru</span>
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {accounts.map(acc => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setAccountId(acc.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black shrink-0 transition-all border cursor-pointer ${
                  accountId === acc.id
                    ? 'bg-charcoal text-white border-charcoal shadow-xs'
                    : 'bg-[#FAF5EF] text-charcoal/60 border-charcoal/5 hover:border-charcoal/20'
                }`}
              >
                <IconMapper name={acc.icon} size={11} />
                <span>{acc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="mb-3">
          <p className="text-[10px] font-black text-charcoal/50 mb-1.5">Kategori</p>
          <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredCategories.map(cat => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-xs border-charcoal ring-1 ring-charcoal'
                      : 'bg-[#FAF5EF] border-charcoal/5 hover:bg-white'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <IconMapper name={cat.icon} size={13} color="#ffffff" />
                  </div>
                  <span className="text-[9px] font-black text-charcoal truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-4">
          <p className="text-[10px] font-black text-charcoal/50 mb-1">Tanggal</p>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-[#FAF5EF] border border-charcoal/5 rounded-xl px-3 py-2 text-xs font-bold text-charcoal outline-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-2.5 rounded-full text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isValid
              ? 'bg-gradient-to-r from-[#FF6584] to-[#FFA94D] shadow-[#FF6584]/25 hover:opacity-95'
              : 'bg-charcoal/20 cursor-not-allowed shadow-none opacity-60'
          }`}
        >
          <Check size={14} strokeWidth={2.5} />
          <span>Simpan Transaksi</span>
        </button>
      </div>
    </div>
  );
}

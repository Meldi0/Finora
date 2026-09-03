import { useState, useEffect } from 'react';
import { X, Check, Plus, ArrowRightLeft } from 'lucide-react';
import { categories } from '../data/mockData';
import IconMapper from './ui/IconMapper';
import type { Transaction, TransactionType, Account } from '../types';

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
  const [type, setType] = useState<TransactionType>('expense');
  const [rawAmount, setRawAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'bca');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || 'bca');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || accounts[0]?.id || 'gopay');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const filteredCategories = categories.filter(c => c.type === (type === 'transfer' ? 'expense' : type));

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

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    if (t === 'income') setCategoryId('salary');
    else if (t === 'expense') setCategoryId('food');
    else if (t === 'transfer') setCategoryId('bills');
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

    if (type === 'transfer') {
      onSave({
        type: 'transfer',
        amount,
        categoryId: 'bills',
        accountId: fromAccountId,
        fromAccountId,
        toAccountId,
        merchant: merchant.trim() || 'Transfer Antar Rekening',
        description: description.trim(),
        date: date || new Date().toISOString().slice(0, 10),
      });
    } else {
      onSave({
        type,
        amount,
        categoryId,
        accountId: accountId || accounts[0]?.id || 'cash',
        merchant: merchant.trim() || undefined,
        description: description.trim(),
        date: date || new Date().toISOString().slice(0, 10),
      });
    }

    onClose();
  };

  const isValid = Boolean(
    rawAmount &&
    parseInt(rawAmount, 10) > 0 &&
    description.trim() &&
    (type !== 'transfer' || fromAccountId !== toAccountId)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1C1B18]/40 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl lg:rounded-2xl px-5 pt-4 pb-6 border border-[#1C1B18]/10 shadow-2xl animate-scale-in max-h-[92vh] overflow-y-auto">
        <div className="lg:hidden w-10 h-1 bg-[#1C1B18]/15 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-[#1C1B18]">Catat Transaksi</h2>
            <p className="text-[10px] text-[#1C1B18]/50 font-medium">Pencatatan keuangan lokal instan</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#1C1B18]/40 hover:text-[#1C1B18] hover:bg-[#F8F3ED] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Segmented Type Controller */}
        <div className="flex bg-[#F8F3ED] p-1 rounded-xl mb-4 border border-[#1C1B18]/05">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-[#FF6584] text-white shadow-xs'
                : 'text-[#1C1B18]/60 hover:text-[#1C1B18]'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#1C1B18]/60 hover:text-[#1C1B18]'
            }`}
          >
            Pemasukan
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('transfer')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              type === 'transfer'
                ? 'bg-[#7D7AFF] text-white shadow-xs'
                : 'text-[#1C1B18]/60 hover:text-[#1C1B18]'
            }`}
          >
            Transfer
          </button>
        </div>

        {/* Nominal Amount Input */}
        <div className="mb-3 bg-[#F8F3ED] rounded-xl p-3 border border-[#1C1B18]/05 text-center">
          <p className="text-[10px] font-bold text-[#1C1B18]/50 uppercase tracking-wider mb-1">
            Nominal {type === 'transfer' ? 'Transfer' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-bold text-[#1C1B18]/40">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplay(rawAmount)}
              onChange={handleAmountChange}
              placeholder="0"
              autoFocus
              className="w-full text-center text-2xl font-bold text-[#1C1B18] placeholder:text-[#1C1B18]/20 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Merchant & Description Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[10px] font-bold text-[#1C1B18]/60 mb-1">Nama Toko / Klien (Merchant)</label>
            <input
              type="text"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              placeholder="Contoh: GrabFood, Netflix"
              className="w-full bg-[#F8F3ED] border border-[#1C1B18]/08 rounded-lg px-3 py-2 text-xs font-semibold text-[#1C1B18] outline-none focus:border-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#1C1B18]/60 mb-1">Catatan Deskripsi</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Contoh: Makan malam bersama"
              className="w-full bg-[#F8F3ED] border border-[#1C1B18]/08 rounded-lg px-3 py-2 text-xs font-semibold text-[#1C1B18] outline-none focus:border-[#2D6A4F]"
            />
          </div>
        </div>

        {/* Transfer Selector vs Account Selector */}
        {type === 'transfer' ? (
          <div className="grid grid-cols-2 gap-2 mb-3 p-2.5 bg-[#F8F3ED]/80 rounded-xl border border-[#7D7AFF]/20">
            <div>
              <label className="block text-[10px] font-bold text-[#1C1B18]/60 mb-1">Dari Akun Asal</label>
              <select
                value={fromAccountId}
                onChange={e => setFromAccountId(e.target.value)}
                className="w-full bg-white border border-[#1C1B18]/10 rounded-lg px-2 py-1.5 text-xs font-bold text-[#1C1B18]"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#1C1B18]/60 mb-1">Ke Akun Tujuan</label>
              <select
                value={toAccountId}
                onChange={e => setToAccountId(e.target.value)}
                className="w-full bg-white border border-[#1C1B18]/10 rounded-lg px-2 py-1.5 text-xs font-bold text-[#1C1B18]"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#1C1B18]/60">Simpan ke Dompet</span>
              {onAddAccount && (
                <button
                  type="button"
                  onClick={onAddAccount}
                  className="text-[10px] font-bold text-[#368F7B] hover:underline flex items-center gap-0.5"
                >
                  <Plus size={10} />
                  <span>Tambah Akun</span>
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccountId(acc.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all border cursor-pointer ${
                    accountId === acc.id
                      ? 'bg-[#1C1B18] text-white border-[#1C1B18]'
                      : 'bg-[#F8F3ED] text-[#1C1B18]/60 border-[#1C1B18]/05 hover:border-[#1C1B18]/20'
                  }`}
                >
                  <IconMapper name={acc.icon} size={11} />
                  <span>{acc.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Grid (for expense & income) */}
        {type !== 'transfer' && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-[#1C1B18]/60 mb-1.5 block">Kategori</span>
            <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {filteredCategories.map(cat => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-xs border-[#1C1B18] ring-1 ring-[#1C1B18]'
                        : 'bg-[#F8F3ED] border-[#1C1B18]/05 hover:bg-white'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconMapper name={cat.icon} size={12} color="#ffffff" />
                    </div>
                    <span className="text-[9px] font-bold text-[#1C1B18] truncate w-full text-center">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Date Selector */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-[#1C1B18]/60 mb-1">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-[#F8F3ED] border border-[#1C1B18]/08 rounded-lg px-3 py-2 text-xs font-semibold text-[#1C1B18] outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-2.5 rounded-lg text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
            isValid
              ? 'bg-[#2D6A4F] hover:bg-[#246B5A] shadow-xs'
              : 'bg-[#1C1B18]/20 cursor-not-allowed shadow-none opacity-60'
          }`}
        >
          <Check size={15} strokeWidth={2.5} />
          <span>Simpan Transaksi</span>
        </button>
      </div>
    </div>
  );
}

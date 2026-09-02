import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { categories } from '../data/mockData';
import IconMapper from './ui/IconMapper';
import type { Budget, Category } from '../types';

interface AddBudgetModalProps {
  existingBudgets: Budget[];
  onClose: () => void;
  onSave: (budget: Budget) => void;
}

export default function AddBudgetModal({
  existingBudgets,
  onClose,
  onSave,
}: AddBudgetModalProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const availableCategories = expenseCategories.filter(
    c => !existingBudgets.some(b => b.categoryId === c.id)
  );

  const initialCat = availableCategories[0] || expenseCategories[0];
  const [categoryId, setCategoryId] = useState(initialCat?.id || 'food');
  const [rawLimit, setRawLimit] = useState('');

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formatDisplay = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return parseInt(digits, 10).toLocaleString('id-ID');
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawLimit(digits);
  };

  const handleSave = () => {
    const limit = parseInt(rawLimit, 10);
    if (!limit || limit <= 0) return;

    // Check if budget exists or is new
    const existing = existingBudgets.find(b => b.categoryId === categoryId);
    const newBudget: Budget = {
      categoryId,
      limit,
      spent: existing ? existing.spent : 0,
    };
    onSave(newBudget);
    onClose();
  };

  const isValid = (parseInt(rawLimit, 10) || 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] px-6 pt-6 pb-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-12 h-1.5 bg-charcoal/15 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-charcoal">Tambah / Atur Anggaran</h2>
            <p className="text-xs text-charcoal/40 font-medium">Tetapkan batas pengeluaran bulanan kategori</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-cream hover:bg-charcoal/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} className="text-charcoal/70" />
          </button>
        </div>

        {/* Category Picker */}
        <div className="mb-5">
          <p className="text-xs font-bold text-charcoal/45 mb-2.5">Pilih Kategori Pengeluaran</p>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {expenseCategories.map(cat => {
              const isSelected = categoryId === cat.id;
              const hasBudget = existingBudgets.some(b => b.categoryId === cat.id);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3 rounded-2xl flex items-center gap-2.5 border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-charcoal bg-charcoal text-white shadow-sm'
                      : 'border-charcoal/5 bg-cream/70 hover:bg-cream text-charcoal'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${cat.color}20` }}
                  >
                    <IconMapper
                      name={cat.icon}
                      size={14}
                      color={isSelected ? '#ffffff' : cat.color}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold truncate">{cat.name}</p>
                    {hasBudget && (
                      <span className="text-[9px] opacity-70 font-semibold block">Ada anggaran</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Limit */}
        <div className="bg-cream/80 border border-charcoal/5 rounded-2xl px-5 py-4 mb-6 focus-within:ring-2 focus-within:ring-teal/30 focus-within:bg-white transition-all">
          <p className="text-xs font-bold text-charcoal/40 mb-1">Batas Maksimal Anggaran / Bulan</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-charcoal/30">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplay(rawLimit)}
              onChange={handleLimitChange}
              placeholder="0"
              autoFocus
              className="flex-1 text-2xl font-extrabold text-charcoal bg-transparent border-none outline-none placeholder:text-charcoal/20 min-w-0"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isValid
              ? 'bg-teal shadow-teal/30 hover:bg-teal/95'
              : 'bg-charcoal/20 cursor-not-allowed shadow-none opacity-60'
          }`}
        >
          <Check size={18} strokeWidth={2.5} />
          <span>Simpan Anggaran</span>
        </button>
      </div>
    </div>
  );
}

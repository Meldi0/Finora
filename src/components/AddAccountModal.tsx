import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import IconMapper from './ui/IconMapper';
import type { Account } from '../types';

interface AddAccountModalProps {
  onClose: () => void;
  onSave: (account: Account) => void;
}

const PRESET_ICONS = ['bca', 'dana', 'gopay', 'cash', 'card', 'wallet', 'phone'];
const PRESET_COLORS = ['#3D9188', '#286E68', '#E95C7A', '#F5A623', '#B8B4E8', '#F6A6B8'];

export default function AddAccountModal({ onClose, onSave }: AddAccountModalProps) {
  const [name, setName] = useState('');
  const [rawBalance, setRawBalance] = useState('');
  const [icon, setIcon] = useState('bca');
  const [color, setColor] = useState('#3D9188');

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

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawBalance(digits);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const balance = parseInt(rawBalance, 10) || 0;
    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      name: name.trim(),
      icon,
      balance,
      color,
    };
    onSave(newAccount);
    onClose();
  };

  const isValid = Boolean(name.trim());

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
            <h2 className="text-xl font-extrabold text-charcoal">Tambah Akun Baru</h2>
            <p className="text-xs text-charcoal/40 font-medium">Hubungkan rekening atau dompet digital baru</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-cream hover:bg-charcoal/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} className="text-charcoal/70" />
          </button>
        </div>

        {/* Account Name */}
        <div className="mb-4">
          <p className="text-xs font-bold text-charcoal/45 mb-2">Nama Akun / Bank</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: Bank Mandiri, SeaBank, OVO..."
            autoFocus
            className="w-full bg-cream/80 border border-charcoal/5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-charcoal placeholder:text-charcoal/30 outline-none focus:ring-2 focus:ring-teal/30 focus:bg-white transition-all"
          />
        </div>

        {/* Initial Balance */}
        <div className="bg-cream/80 border border-charcoal/5 rounded-2xl px-5 py-4 mb-4 focus-within:ring-2 focus-within:ring-teal/30 focus-within:bg-white transition-all">
          <p className="text-xs font-bold text-charcoal/40 mb-1">Saldo Awal</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-charcoal/30">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplay(rawBalance)}
              onChange={handleBalanceChange}
              placeholder="0"
              className="flex-1 text-2xl font-extrabold text-charcoal bg-transparent border-none outline-none placeholder:text-charcoal/20 min-w-0"
            />
          </div>
        </div>

        {/* Icon Picker */}
        <div className="mb-4">
          <p className="text-xs font-bold text-charcoal/45 mb-2.5">Pilih Icon</p>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_ICONS.map(i => {
              const isSelected = icon === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-charcoal text-white shadow-md shadow-charcoal/20 scale-105'
                      : 'bg-cream text-charcoal/60 hover:bg-charcoal/8'
                  }`}
                >
                  <IconMapper name={i} size={18} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-6">
          <p className="text-xs font-bold text-charcoal/45 mb-2.5">Warna Kartu</p>
          <div className="flex gap-2.5">
            {PRESET_COLORS.map(c => {
              const isSelected = color === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform cursor-pointer flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: c, transform: isSelected ? 'scale(1.2)' : 'scale(1)' }}
                >
                  {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                </button>
              );
            })}
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
          <span>Simpan Akun</span>
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, AlertCircle } from 'lucide-react';
import IconMapper from './ui/IconMapper';
import { formatRupiah, formatRupiahFull } from '../data/mockData';
import type { Account } from '../types';

interface TransferModalProps {
  accounts: Account[];
  onClose: () => void;
  onTransfer: (fromId: string, toId: string, amount: number, notes?: string) => void;
}

export default function TransferModal({
  accounts,
  onClose,
  onTransfer,
}: TransferModalProps) {
  const [fromId, setFromId] = useState(accounts[0]?.id || 'bca');
  const [toId, setToId] = useState(accounts[1]?.id || 'dana');
  const [rawAmount, setRawAmount] = useState('');
  const [notes, setNotes] = useState('');

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const fromAcc = accounts.find(a => a.id === fromId) ?? accounts[0];
  const toAcc = accounts.find(a => a.id === toId) ?? accounts[1];

  const amount = parseInt(rawAmount, 10) || 0;
  const isInsufficient = fromAcc ? amount > fromAcc.balance : false;
  const isSameAccount = fromId === toId;
  const isValid = amount > 0 && !isInsufficient && !isSameAccount;

  const formatDisplay = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return parseInt(digits, 10).toLocaleString('id-ID');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawAmount(digits);
  };

  const handleExecute = () => {
    if (!isValid) return;
    onTransfer(fromId, toId, amount, notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] px-6 pt-6 pb-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-12 h-1.5 bg-charcoal/15 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-charcoal">Transfer Antar Akun</h2>
            <p className="text-xs text-charcoal/40 font-medium">Pindahkan saldo antar rekening atau e-wallet</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-cream hover:bg-charcoal/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} className="text-charcoal/70" />
          </button>
        </div>

        {/* Visual From -> To Card */}
        <div className="flex items-center gap-3 bg-cream/70 p-4 rounded-3xl border border-charcoal/5 mb-5">
          {/* From */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase mb-1.5">Dari Akun</p>
            <select
              value={fromId}
              onChange={e => setFromId(e.target.value)}
              className="w-full bg-white border border-charcoal/10 rounded-xl px-3 py-2 text-xs font-extrabold text-charcoal outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({formatRupiah(acc.balance)})
                </option>
              ))}
            </select>
            {fromAcc && (
              <p className="text-[10px] text-charcoal/45 font-semibold mt-1 truncate">
                Sisa: {formatRupiahFull(fromAcc.balance)}
              </p>
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-charcoal/5">
            <ArrowRight size={14} className="text-charcoal/60" />
          </div>

          {/* To */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase mb-1.5">Ke Akun</p>
            <select
              value={toId}
              onChange={e => setToId(e.target.value)}
              className="w-full bg-white border border-charcoal/10 rounded-xl px-3 py-2 text-xs font-extrabold text-charcoal outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id} disabled={acc.id === fromId}>
                  {acc.name} ({formatRupiah(acc.balance)})
                </option>
              ))}
            </select>
            {toAcc && (
              <p className="text-[10px] text-charcoal/45 font-semibold mt-1 truncate">
                Saat ini: {formatRupiahFull(toAcc.balance)}
              </p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="bg-cream/80 border border-charcoal/5 rounded-2xl px-5 py-4 mb-4 focus-within:ring-2 focus-within:ring-teal/30 focus-within:bg-white transition-all">
          <p className="text-xs font-bold text-charcoal/40 mb-1">Nominal Transfer</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-charcoal/30">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplay(rawAmount)}
              onChange={handleAmountChange}
              placeholder="0"
              autoFocus
              className="flex-1 text-3xl font-extrabold text-charcoal bg-transparent border-none outline-none placeholder:text-charcoal/20 min-w-0"
            />
          </div>
        </div>

        {/* Error message if insufficient */}
        {isInsufficient && (
          <div className="mb-4 flex items-center gap-2 text-coral text-xs font-bold bg-coral/10 p-3 rounded-xl">
            <AlertCircle size={14} className="shrink-0" />
            <span>Saldo {fromAcc?.name} tidak mencukupi (Maks {formatRupiahFull(fromAcc?.balance || 0)})</span>
          </div>
        )}

        {/* Notes */}
        <div className="mb-6">
          <p className="text-xs font-bold text-charcoal/45 mb-2">Catatan (Opsional)</p>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Contoh: Top-up saldo, pindah tabungan..."
            className="w-full bg-cream/80 border border-charcoal/5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-charcoal placeholder:text-charcoal/30 outline-none focus:ring-2 focus:ring-teal/30 focus:bg-white transition-all"
          />
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleExecute}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isValid
              ? 'bg-charcoal shadow-charcoal/20 hover:bg-charcoal/90'
              : 'bg-charcoal/20 cursor-not-allowed shadow-none opacity-60'
          }`}
        >
          <Check size={18} strokeWidth={2.5} />
          <span>Konfirmasi Transfer</span>
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { formatRupiah, formatRupiahFull } from '../data/mockData';
import type { Goal } from '../types';

interface DepositGoalModalProps {
  goal: Goal | null;
  mode: 'deposit' | 'withdraw';
  onClose: () => void;
  onConfirm: (goalId: string, amount: number) => void;
}

export default function DepositGoalModal({
  goal,
  mode,
  onClose,
  onConfirm,
}: DepositGoalModalProps) {
  const [rawAmount, setRawAmount] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!goal) return null;

  const isDeposit = mode === 'deposit';
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

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
    const parsed = parseInt(rawAmount, 10);
    if (!parsed || parsed <= 0) return;
    onConfirm(goal.id, isDeposit ? parsed : -parsed);
    onClose();
  };

  const amount = parseInt(rawAmount, 10) || 0;
  const isExceedingWithdraw = !isDeposit && amount > goal.currentAmount;
  const isValid = amount > 0 && !isExceedingWithdraw;

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
            <h2 className="text-xl font-extrabold text-charcoal">
              {isDeposit ? 'Tabung ke Tujuan' : 'Tarik Dana dari Tujuan'}
            </h2>
            <p className="text-xs text-charcoal/40 font-medium">
              Target: <span className="font-bold text-charcoal">{goal.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-cream hover:bg-charcoal/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} className="text-charcoal/70" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="bg-cream/70 rounded-2xl p-4 mb-4 border border-charcoal/5 flex justify-between items-center text-xs">
          <div>
            <p className="text-charcoal/40 font-bold uppercase text-[10px]">Terkumpul Saat Ini</p>
            <p className="font-extrabold text-charcoal text-sm mt-0.5">{formatRupiahFull(goal.currentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-charcoal/40 font-bold uppercase text-[10px]">Target Akhir</p>
            <p className="font-extrabold text-charcoal text-sm mt-0.5">{formatRupiahFull(goal.targetAmount)}</p>
          </div>
        </div>

        {/* Manual Amount Input */}
        <div className="bg-cream/80 border border-charcoal/5 rounded-2xl px-5 py-4 mb-4 focus-within:ring-2 focus-within:ring-teal/30 focus-within:bg-white transition-all">
          <p className="text-xs font-bold text-charcoal/40 mb-1">
            {isDeposit ? 'Nominal yang Ditabung' : 'Nominal yang Ditarik'}
          </p>
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

        {/* Error message for withdrawal */}
        {isExceedingWithdraw && (
          <p className="text-xs font-bold text-coral mb-4">
            Maksimal dana yang dapat ditarik adalah {formatRupiahFull(goal.currentAmount)}.
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={handleExecute}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isValid
              ? isDeposit
                ? 'bg-teal shadow-teal/30 hover:bg-teal/95'
                : 'bg-charcoal shadow-charcoal/20 hover:bg-charcoal/90'
              : 'bg-charcoal/20 cursor-not-allowed shadow-none opacity-60'
          }`}
        >
          {isDeposit ? <Plus size={18} strokeWidth={2.5} /> : <Minus size={18} strokeWidth={2.5} />}
          <span>{isDeposit ? 'Konfirmasi Tabung Uang' : 'Konfirmasi Tarik Uang'}</span>
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Wallet, Target, ArrowRight, X } from 'lucide-react';
import type { Account, Goal } from '../types';

interface OnboardingModalProps {
  onClose: () => void;
  onAddAccount: (acc: Account) => void;
  onAddGoal: (goal: Goal) => void;
}

export default function OnboardingModal({ onClose, onAddAccount, onAddGoal }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [accountName, setAccountName] = useState('BCA Utama');
  const [accountBalance, setAccountBalance] = useState('2500000');
  const [goalName, setGoalName] = useState('Dana Darurat');
  const [goalTarget, setGoalTarget] = useState('10000000');

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (accountName.trim()) {
        onAddAccount({
          id: `acc-onboard-${Date.now()}`,
          name: accountName,
          icon: 'bca',
          balance: Number(accountBalance) || 0,
          color: '#2D6A4F',
          type: 'bank',
        });
      }
      setStep(3);
    } else if (step === 3) {
      if (goalName.trim()) {
        onAddGoal({
          id: `goal-onboard-${Date.now()}`,
          name: goalName,
          icon: 'target',
          targetAmount: Number(goalTarget) || 5000000,
          currentAmount: 0,
          deadline: '2027-06-01',
          color: '#368F7B',
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B18]/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md border border-[#1C1B18]/10 shadow-xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#1C1B18]/40 hover:text-[#1C1B18] hover:bg-[#F8F3ED] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {step === 1 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center font-bold text-lg">
              F
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C1B18]">Selamat datang di Finora</h2>
              <p className="text-xs text-[#1C1B18]/60 mt-1">
                Pendamping keuangan pribadi yang tenang, sederhana, dan 100% lokal di perangkatmu.
              </p>
            </div>

            <div className="p-3 bg-[#F8F3ED] rounded-xl border border-[#1C1B18]/05 space-y-1">
              <p className="text-xs font-semibold text-[#1C1B18]">Mata Uang Utama</p>
              <p className="text-sm font-bold text-[#2D6A4F]">Rupiah Indonesia (Rp)</p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-[#1C1B18]/50 hover:text-[#1C1B18] cursor-pointer"
              >
                Lewati Setup
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg hover:bg-[#246B5A] transition-colors cursor-pointer active:scale-98"
              >
                <span>Mulai</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#368F7B]/10 text-[#368F7B] flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1B18]">Tambah Akun Pertamamu</h2>
              <p className="text-xs text-[#1C1B18]/60 mt-0.5">
                Masukkan wadah uangmu (contoh: Rekening Bank, Tunai, atau E-Wallet).
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1B18]/70 mb-1">Nama Akun</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#1C1B18]/15 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  placeholder="Contoh: BCA Utama"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1B18]/70 mb-1">Saldo Awal (Rp)</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={e => setAccountBalance(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#1C1B18]/15 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  placeholder="2500000"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#1C1B18]/50 hover:text-[#1C1B18] cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg hover:bg-[#246B5A] transition-colors cursor-pointer active:scale-98"
              >
                <span>Lanjut</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF6584]/10 text-[#FF6584] flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1B18]">Buat Target Impian</h2>
              <p className="text-xs text-[#1C1B18]/60 mt-0.5">
                Apa yang ingin kamu tabung? (contoh: Laptop Baru, Dana Darurat, Liburan).
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1B18]/70 mb-1">Nama Target</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#1C1B18]/15 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  placeholder="Contoh: Dana Darurat"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1B18]/70 mb-1">Target Nominal (Rp)</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={e => setGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#1C1B18]/15 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  placeholder="10000000"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-[#1C1B18]/50 hover:text-[#1C1B18] cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg hover:bg-[#246B5A] transition-colors cursor-pointer active:scale-98"
              >
                <span>Selesai & Masuk</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

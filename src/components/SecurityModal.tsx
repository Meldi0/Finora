import { useState, useEffect } from 'react';
import { X, Shield, Lock, Trash2, Check, AlertTriangle, KeyRound } from 'lucide-react';

interface SecurityModalProps {
  onClose: () => void;
  onResetData: () => void;
}

export default function SecurityModal({ onClose, onResetData }: SecurityModalProps) {
  const [pinEnabled, setPinEnabled] = useState(() => {
    return localStorage.getItem('finora_pin_enabled') === 'true';
  });
  const [pin, setPin] = useState(() => {
    return localStorage.getItem('finora_pin') || '';
  });
  const [inputPin, setInputPin] = useState(pin);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTogglePin = () => {
    const next = !pinEnabled;
    setPinEnabled(next);
    localStorage.setItem('finora_pin_enabled', String(next));
    if (next && !pin) {
      setIsEditingPin(true);
    }
  };

  const handleSavePin = () => {
    if (inputPin.length === 4) {
      setPin(inputPin);
      localStorage.setItem('finora_pin', inputPin);
      localStorage.setItem('finora_pin_enabled', 'true');
      setPinEnabled(true);
      setIsEditingPin(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#368F7B]/15 text-[#368F7B] flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-charcoal">Keamanan & Privasi</h2>
              <p className="text-[10px] text-charcoal/40 font-semibold">Proteksi data lokal di perangkat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} className="text-charcoal/70" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Privacy Guarantee Banner */}
          <div className="bg-[#EBF7F2] p-3 rounded-xl border border-[#368F7B]/15 flex items-start gap-2">
            <Shield size={15} className="text-[#368F7B] shrink-0 mt-0.5" />
            <div className="text-[10px] text-charcoal/75 leading-relaxed">
              <span className="font-black text-charcoal block">100% Penyimpanan Offline Lokal</span>
              Finora tidak mengirim data transaksi kamu ke server eksternal mana pun. Semua data terenkripsi di browser HP kamu.
            </div>
          </div>

          {/* PIN Lock Setting */}
          <div className="bg-[#FAF5EF] p-3 rounded-xl border border-charcoal/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-charcoal/70" />
                <div>
                  <p className="text-xs font-black text-charcoal">Kunci PIN Aplikasi</p>
                  <p className="text-[10px] text-charcoal/45 font-medium">Minta 4 digit PIN saat membuka</p>
                </div>
              </div>

              {/* iOS Toggle Switch */}
              <button
                type="button"
                onClick={handleTogglePin}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  pinEnabled ? 'bg-[#368F7B]' : 'bg-charcoal/20'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    pinEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {pinEnabled && (
              <div className="pt-2 border-t border-charcoal/5">
                {isEditingPin ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-charcoal/60">Masukkan 4 Angka PIN Baru:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        inputMode="numeric"
                        value={inputPin}
                        onChange={e => setInputPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="bg-white border border-charcoal/10 rounded-lg px-3 py-1.5 text-center text-sm font-black tracking-widest outline-none w-28 focus:ring-1 focus:ring-[#368F7B]"
                      />
                      <button
                        onClick={handleSavePin}
                        disabled={inputPin.length !== 4}
                        className="flex-1 py-1.5 bg-[#368F7B] text-white text-xs font-black rounded-lg disabled:opacity-40"
                      >
                        Simpan PIN
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-charcoal/60">
                      PIN Aktif: {pin ? '••••' : 'Belum diatur'}
                    </span>
                    <button
                      onClick={() => setIsEditingPin(true)}
                      className="text-[10px] font-black text-[#368F7B] hover:underline flex items-center gap-1"
                    >
                      <KeyRound size={11} />
                      <span>Ubah PIN</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {savedSuccess && (
              <p className="text-[10px] font-black text-[#368F7B] flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> PIN Berhasil Disimpan
              </p>
            )}
          </div>

          {/* Reset All Data Section */}
          <div className="bg-[#FEEFEF] p-3 rounded-xl border border-[#FF6584]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#FF6584]">
              <AlertTriangle size={15} />
              <span className="text-xs font-black">Reset Seluruh Data</span>
            </div>
            <p className="text-[10px] text-charcoal/70 leading-relaxed font-medium">
              Menghapus semua riwayat transaksi, rekening, dan tabungan dari memori perangkat ini.
            </p>

            {showConfirmReset ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-black text-[#FF6584]">
                  Yakin ingin menghapus semua data permanen?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-white text-charcoal text-[11px] font-bold rounded-lg border border-charcoal/10"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      onResetData();
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-[#FF6584] text-white text-[11px] font-black rounded-lg shadow-sm"
                  >
                    Ya, Hapus Semua
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-1.5 bg-white hover:bg-[#FF6584]/10 text-[#FF6584] text-xs font-black rounded-lg border border-[#FF6584]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
              >
                <Trash2 size={13} />
                <span>Bersihkan Memori Data</span>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3.5 py-2.5 bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal font-black text-xs rounded-xl transition-all cursor-pointer active:scale-98"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}

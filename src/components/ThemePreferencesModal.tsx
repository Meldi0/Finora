import { useState, useEffect } from 'react';
import { X, Moon, Sun, Check, Volume2, Sparkles, Hash } from 'lucide-react';

interface ThemePreferencesModalProps {
  onClose: () => void;
}

export default function ThemePreferencesModal({ onClose }: ThemePreferencesModalProps) {
  const [currencyFormat, setCurrencyFormat] = useState(() => {
    return localStorage.getItem('finora_currency_format') || 'full';
  });
  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem('finora_date_format') || 'indonesian';
  });
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    return localStorage.getItem('finora_haptics') !== 'false';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    localStorage.setItem('finora_currency_format', currencyFormat);
    localStorage.setItem('finora_date_format', dateFormat);
    localStorage.setItem('finora_haptics', String(hapticsEnabled));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
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
            <div className="w-8 h-8 rounded-full bg-[#7D7AFF]/15 text-[#7D7AFF] flex items-center justify-center">
              <Moon size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-charcoal">Format & Tampilan</h2>
              <p className="text-[10px] text-charcoal/40 font-semibold">Preferensi visual dan format data</p>
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
          {/* Format Nominal Rupiah */}
          <div className="bg-[#FAF5EF] p-3 rounded-xl border border-charcoal/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-charcoal">
              <Hash size={13} className="text-[#7D7AFF]" />
              <span>Gaya Penulisan Nominal</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrencyFormat('full')}
                className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                  currencyFormat === 'full'
                    ? 'bg-white border-[#7D7AFF] shadow-xs ring-1 ring-[#7D7AFF]'
                    : 'bg-white/60 border-charcoal/5 hover:bg-white'
                }`}
              >
                <p className="text-xs font-black text-charcoal">Rp 75.000</p>
                <p className="text-[9px] text-charcoal/45 font-semibold mt-0.5">Format Penuh Lengkap</p>
              </button>

              <button
                type="button"
                onClick={() => setCurrencyFormat('compact')}
                className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                  currencyFormat === 'compact'
                    ? 'bg-white border-[#7D7AFF] shadow-xs ring-1 ring-[#7D7AFF]'
                    : 'bg-white/60 border-charcoal/5 hover:bg-white'
                }`}
              >
                <p className="text-xs font-black text-charcoal">Rp 75rb / 1,2jt</p>
                <p className="text-[9px] text-charcoal/45 font-semibold mt-0.5">Format Ringkas</p>
              </button>
            </div>
          </div>

          {/* Format Tanggal */}
          <div className="bg-[#FAF5EF] p-3 rounded-xl border border-charcoal/5 space-y-2">
            <p className="text-xs font-black text-charcoal">Format Tanggal</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDateFormat('indonesian')}
                className={`flex-1 py-2 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  dateFormat === 'indonesian'
                    ? 'bg-white text-charcoal font-black border-[#7D7AFF] shadow-xs ring-1 ring-[#7D7AFF]'
                    : 'bg-white/60 text-charcoal/60 border-charcoal/5'
                }`}
              >
                2 September 2026
              </button>
              <button
                type="button"
                onClick={() => setDateFormat('numeric')}
                className={`flex-1 py-2 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  dateFormat === 'numeric'
                    ? 'bg-white text-charcoal font-black border-[#7D7AFF] shadow-xs ring-1 ring-[#7D7AFF]'
                    : 'bg-white/60 text-charcoal/60 border-charcoal/5'
                }`}
              >
                02/09/2026
              </button>
            </div>
          </div>

          {/* Haptics & Sound Toggle */}
          <div className="bg-[#FAF5EF] p-3 rounded-xl border border-charcoal/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 size={15} className="text-charcoal/70" />
              <div>
                <p className="text-xs font-black text-charcoal">Efek Sentuhan (Haptic)</p>
                <p className="text-[10px] text-charcoal/45 font-medium">Umpan balik saat menekan tombol</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                hapticsEnabled ? 'bg-[#7D7AFF]' : 'bg-charcoal/20'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Theme Palette info */}
          <div className="bg-[#F0EFFE] p-3 rounded-xl border border-[#7D7AFF]/15 flex items-start gap-2">
            <Sparkles size={14} className="text-[#7D7AFF] shrink-0 mt-0.5" />
            <p className="text-[10px] text-charcoal/75 leading-relaxed font-semibold">
              Tema Finora didesain khusus dengan palet warna organik <span className="text-[#7D7AFF] font-black">Apple Warm Canvas</span> yang ramah mata baik di siang maupun malam hari.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-3 bg-[#EBF7F2] p-2.5 rounded-xl text-[#368F7B] text-xs font-black flex items-center justify-center gap-1">
            <Check size={14} strokeWidth={3} />
            <span>Preferensi Berhasil Disimpan</span>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full mt-3.5 py-2.5 bg-gradient-to-r from-[#7D7AFF] to-[#9C88FF] text-white font-black text-xs rounded-xl shadow-md shadow-[#7D7AFF]/25 transition-all cursor-pointer active:scale-98"
        >
          Terapkan Preferensi
        </button>
      </div>
    </div>
  );
}

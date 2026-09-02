import { useState, useEffect } from 'react';
import { X, Check, User, Sparkles } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  avatarColor: string;
  plan: string;
  joinedDate: string;
}

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

const colorOptions = [
  '#FF6584',
  '#FF9F43',
  '#368F7B',
  '#7D7AFF',
  '#246B5A',
  '#FF758C',
];

export default function EditProfileModal({
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [selectedColor, setSelectedColor] = useState(profile.avatarColor || '#FF6584');

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...profile,
      name: name.trim(),
      avatarColor: selectedColor,
    });
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
      <div className="relative w-full max-w-sm bg-white rounded-t-[1.6rem] lg:rounded-[1.6rem] px-5 pt-4 pb-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-10 h-1 bg-charcoal/15 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-charcoal">Nama Panggilan</h2>
            <p className="text-[10px] text-charcoal/40 font-semibold">Ubah nama untuk ruang keuangan pribadimu</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={15} className="text-charcoal/70" />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black shadow-md shadow-[#FF6584]/20 mb-2 border-2 border-white"
            style={{ backgroundColor: selectedColor }}
          >
            {name.trim() ? name.trim()[0].toUpperCase() : 'U'}
          </div>

          {/* Color selector */}
          <div className="flex items-center gap-1.5">
            {colorOptions.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                  selectedColor === c ? 'ring-2 ring-offset-2 ring-charcoal scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                aria-label="Pilih warna avatar"
              />
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <p className="text-[11px] font-black text-charcoal/50 mb-1.5">Nama Panggilan</p>
          <div className="flex items-center gap-2 bg-[#F8F3ED] border border-charcoal/5 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#FF6584]/30 focus-within:bg-white transition-all">
            <User size={14} className="text-charcoal/40" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama kamu..."
              autoFocus
              className="flex-1 bg-transparent text-xs font-bold text-charcoal placeholder:text-charcoal/30 outline-none"
            />
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-4 bg-[#EBF7F2] p-2.5 rounded-xl border border-[#368F7B]/15 flex items-center gap-2">
          <Sparkles size={14} className="text-[#368F7B] shrink-0" />
          <p className="text-[10px] text-charcoal/70 font-bold leading-snug">
            Data tersimpan langsung di memori lokal tanpa server eksternal.
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-2.5 rounded-full text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isValid
              ? 'bg-gradient-to-r from-[#FF6584] to-[#FFA94D] shadow-[#FF6584]/25 hover:opacity-95'
              : 'bg-charcoal/20 cursor-not-allowed shadow-none opacity-60'
          }`}
        >
          <Check size={15} strokeWidth={2.5} />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </div>
  );
}

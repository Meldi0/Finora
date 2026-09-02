import { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronDown, Sparkles, BookOpen, Smartphone, ShieldCheck, Wallet } from 'lucide-react';
import FinoraLogo from './ui/FinoraLogo';

interface HelpGuideModalProps {
  onClose: () => void;
}

export default function HelpGuideModal({ onClose }: HelpGuideModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const faqs = [
    {
      q: 'Bagaimana cara mencatat transaksi baru?',
      a: 'Tekan tombol tambah (+) oranye di bilah navigasi bawah, atau tombol "Catat" di sudut kanan atas Beranda. Pilih tipe (Pengeluaran/Pemasukan), isi nominal, kategori, dan dompet yang digunakan.',
      icon: Wallet,
    },
    {
      q: 'Apakah data saya aman dan diunggah ke internet?',
      a: 'Finora 100% menggunakan penyimpanan lokal perangkat (Web Storage API). Tidak ada server eksternal yang menyimpan data atau nomor rekeningmu. Data sepenuhnya milikmu dan aman di HP kamu.',
      icon: ShieldCheck,
    },
    {
      q: 'Bagaimana cara memasang Finora sebagai aplikasi di HP?',
      a: 'Buka menu Pengaturan -> "Pasang Aplikasi di HP". Di iPhone, tekan tombol Bagikan di Safari lalu pilih "Tambahkan ke Layar Utama". Di Android, pilih menu titik tiga Chrome lalu klik "Instal Aplikasi".',
      icon: Smartphone,
    },
    {
      q: 'Bagaimana cara transfer saldo antar dompet?',
      a: 'Buka menu "Akun & Dompet" di beranda. Jika kamu memiliki minimal 2 dompet terdaftar, akan muncul kartu "Pindah Saldo Antar Akun" untuk transfer langsung tanpa mengubah total kekayaanmu.',
      icon: BookOpen,
    },
  ];

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
            <div className="w-8 h-8 rounded-full bg-[#FF9F43]/15 text-[#FF9F43] flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-charcoal">Bantuan & Panduan</h2>
              <p className="text-[10px] text-charcoal/40 font-semibold">Petunjuk lengkap penggunaan Finora</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} className="text-charcoal/70" />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Version banner */}
          <div className="bg-[#FAF5EF] p-3 rounded-xl border border-charcoal/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FinoraLogo size={22} />
              <div>
                <p className="text-xs font-black text-charcoal">Finora Personal</p>
                <p className="text-[9px] text-charcoal/45 font-bold">Versi 1.0 (Apple Edition) · Offline Mode</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-[#368F7B] bg-[#368F7B]/15 px-2 py-0.5 rounded-full">
              Aktif
            </span>
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-black text-charcoal/60 px-0.5">Pertanyaan Sering Ditanyakan (FAQ):</p>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              const Icon = faq.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-charcoal/5 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-[#FAF5EF]/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#FAF5EF] flex items-center justify-center text-charcoal/70 shrink-0">
                        <Icon size={12} />
                      </div>
                      <span className="text-xs font-black text-charcoal truncate">{faq.q}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-charcoal/40 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-charcoal' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 text-[11px] text-charcoal/75 leading-relaxed font-medium border-t border-charcoal/5 bg-[#FAF5EF]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Budgeting Tip */}
          <div className="bg-[#FFF5EE] p-3 rounded-xl border border-[#FF9F43]/20 flex items-start gap-2">
            <Sparkles size={14} className="text-[#FF9F43] shrink-0 mt-0.5" />
            <div className="text-[10px] text-charcoal/75 font-semibold leading-relaxed">
              <span className="font-black text-charcoal block">Tips Aturan Finansial 50/30/20:</span>
              Alokasikan 50% untuk kebutuhan pokok, 30% untuk gaya hidup, dan minimal 20% langsung dimasukkan ke tabungan/dana darurat!
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3.5 py-2.5 bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal font-black text-xs rounded-xl transition-all cursor-pointer active:scale-98"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  );
}

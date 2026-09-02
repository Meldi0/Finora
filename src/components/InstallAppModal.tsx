import { useState, useEffect } from 'react';
import { X, Smartphone, Share, PlusSquare, Check, Sparkles, Download } from 'lucide-react';
import FinoraLogo from './ui/FinoraLogo';

interface InstallAppModalProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstallPrompted?: () => void;
}

export default function InstallAppModal({
  onClose,
  deferredPrompt,
  onInstallPrompted,
}: InstallAppModalProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already installed as standalone
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        if (onInstallPrompted) onInstallPrompted();
        setTimeout(onClose, 2000);
      }
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
      <div className="relative w-full max-w-sm bg-white rounded-t-[1.6rem] lg:rounded-[1.6rem] px-5 pt-4 pb-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-10 h-1 bg-charcoal/15 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FinoraLogo size={24} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-charcoal">Pasang di HP</h2>
              <p className="text-[10px] text-charcoal/40 font-semibold">Jadikan aplikasi di layar utama</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} className="text-charcoal/70" />
          </button>
        </div>

        {/* Status already standalone */}
        {isStandalone ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#EBF7F2] text-[#368F7B] flex items-center justify-center mx-auto mb-2">
              <Check size={24} strokeWidth={3} />
            </div>
            <p className="text-sm font-black text-charcoal">Finora Sudah Terpasang!</p>
            <p className="text-[11px] text-charcoal/50 font-semibold mt-1">
              Aplikasi ini sedang berjalan dalam mode aplikasi mandiri (*standalone*).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Native Android/Chrome Install Prompt Button */}
            {deferredPrompt && !installedSuccess && (
              <button
                onClick={handleNativeInstall}
                className="w-full py-3 bg-gradient-to-r from-[#FF6584] to-[#FFA94D] hover:opacity-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#FF6584]/25 transition-all cursor-pointer active:scale-98"
              >
                <Download size={15} strokeWidth={2.5} />
                <span>Instal Aplikasi Sekarang (1-Klik)</span>
              </button>
            )}

            {installedSuccess && (
              <div className="bg-[#EBF7F2] border border-[#368F7B]/20 p-3 rounded-xl flex items-center gap-2 text-[#368F7B]">
                <Check size={16} strokeWidth={3} />
                <span className="text-xs font-black">Aplikasi Berhasil Dipasang ke HP!</span>
              </div>
            )}

            {/* iOS Instructions */}
            {isIOS && (
              <div className="bg-[#FAF5EF] rounded-xl p-3.5 border border-charcoal/5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-charcoal">
                  <Smartphone size={14} className="text-[#368F7B]" />
                  <span>Panduan Pasang di iPhone / iPad:</span>
                </div>
                <div className="space-y-2 text-[11px] text-charcoal/75 font-semibold">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-charcoal font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs border border-charcoal/5">
                      1
                    </span>
                    <p className="leading-tight">
                      Tekan tombol <span className="font-black text-charcoal">Bagikan / Share</span> (ikon{' '}
                      <Share size={11} className="inline mx-0.5 text-blue-500" />) di bilah bawah browser Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-charcoal font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs border border-charcoal/5">
                      2
                    </span>
                    <p className="leading-tight">
                      Gulir menu ke bawah, lalu pilih <span className="font-black text-charcoal">"Tambahkan ke Layar Utama"</span> (<PlusSquare size={11} className="inline mx-0.5" />).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-charcoal font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs border border-charcoal/5">
                      3
                    </span>
                    <p className="leading-tight">
                      Tekan <span className="font-black text-charcoal">"Tambah"</span> di kanan atas. Selesai! Finora akan muncul di Home Screen seperti aplikasi App Store.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Android / General Instructions */}
            {!isIOS && !deferredPrompt && (
              <div className="bg-[#FAF5EF] rounded-xl p-3.5 border border-charcoal/5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-charcoal">
                  <Smartphone size={14} className="text-[#FF6584]" />
                  <span>Panduan Pasang di Android:</span>
                </div>
                <div className="space-y-2 text-[11px] text-charcoal/75 font-semibold">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-charcoal font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs border border-charcoal/5">
                      1
                    </span>
                    <p className="leading-tight">
                      Buka menu browser dengan menekan titik tiga (<span className="font-black text-charcoal">⋮</span>) di pojok kanan atas Chrome.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-charcoal font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs border border-charcoal/5">
                      2
                    </span>
                    <p className="leading-tight">
                      Pilih <span className="font-black text-charcoal">"Instal Aplikasi"</span> atau <span className="font-black text-charcoal">"Tambahkan ke Layar Utama"</span>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-charcoal font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs border border-charcoal/5">
                      3
                    </span>
                    <p className="leading-tight">
                      Tekan <span className="font-black text-charcoal">"Instal"</span>. Ikon Finora akan langsung terpasang di HP dan bisa dibuka offline tanpa URL bar browser!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* App Features List */}
            <div className="bg-[#EBF7F2] p-3 rounded-xl border border-[#368F7B]/15 flex items-start gap-2">
              <Sparkles size={14} className="text-[#368F7B] shrink-0 mt-0.5" />
              <div className="text-[10px] text-charcoal/75 font-semibold leading-relaxed">
                <p className="font-black text-charcoal">Kelebihan Mode Aplikasi HP:</p>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                  <li>Layar penuh 100% tanpa address bar browser.</li>
                  <li>Bisa diakses kapan saja secara <span className="font-bold text-[#368F7B]">Offline</span> tanpa internet.</li>
                  <li>Performa mulus 60 FPS layaknya aplikasi native.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-3.5 py-2.5 bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal font-black text-xs rounded-xl transition-all cursor-pointer active:scale-98"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

import { User, Bell, Shield, Moon, Download, HelpCircle, ChevronRight, Sparkles, Smartphone } from 'lucide-react';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import type { UserProfile } from '../components/EditProfileModal';

interface ProfileProps {
  profile: UserProfile;
  txCount: number;
  accountsCount: number;
  goalsCount: number;
  onEditProfile: () => void;
  onExportData: () => void;
  onOpenNotifications: () => void;
  onOpenInstallApp?: () => void;
  onToggleTheme?: () => void;
  onOpenSecurity?: () => void;
  onOpenHelp?: () => void;
}

export default function Profile({
  profile,
  txCount,
  accountsCount,
  goalsCount,
  onEditProfile,
  onExportData,
  onOpenNotifications,
  onOpenInstallApp,
  onToggleTheme,
  onOpenSecurity,
  onOpenHelp,
}: ProfileProps) {
  const avatarLetter = profile.name.trim() ? profile.name.trim()[0].toUpperCase() : 'U';

  const menuItems = [
    {
      icon: Smartphone,
      label: 'Pasang Aplikasi di HP',
      sub: 'Jadikan aplikasi mandiri tanpa browser',
      action: onOpenInstallApp,
      color: '#FF6584',
      highlight: true,
    },
    {
      icon: User,
      label: 'Personalisasi & Nama',
      sub: 'Ubah nama panggilan & warna aksen',
      action: onEditProfile,
      color: '#FFA94D',
    },
    {
      icon: Bell,
      label: 'Notifikasi & Pengingat',
      sub: 'Atur alert pengeluaran & tagihan',
      action: onOpenNotifications,
      color: '#368F7B',
    },
    {
      icon: Shield,
      label: 'Keamanan Perangkat',
      sub: 'Proteksi data & privasi lokal',
      action: onOpenSecurity,
      color: '#7D7AFF',
    },
    {
      icon: Moon,
      label: 'Format Angka & Tema',
      sub: 'Format Rupiah dan preferensi visual',
      action: onToggleTheme,
      color: '#246B5A',
    },
    {
      icon: Download,
      label: 'Ekspor & Cadangkan Data',
      sub: 'Unduh CSV spreadsheet atau backup JSON',
      action: onExportData,
      color: '#FF758C',
    },
    {
      icon: HelpCircle,
      label: 'Bantuan & Panduan',
      sub: 'Petunjuk penggunaan fitur & FAQ',
      action: onOpenHelp,
      color: '#F4C56C',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Seamless Floating Header */}
      <div className="sticky top-0 z-30 px-3.5 sm:px-6 lg:px-10 py-2.5 bg-[#FAF5EF]/80 backdrop-blur-xl border-b border-charcoal/5 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-charcoal tracking-tight">Pengaturan</h1>
              <span className="text-[9px] font-black text-[#368F7B] bg-[#368F7B]/15 px-2 py-0.5 rounded-full border border-[#368F7B]/20">
                Preferensi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3.5 sm:px-6 lg:px-10 py-3.5 space-y-3 pb-20 lg:pb-10 max-w-7xl mx-auto w-full">
        {/* Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 items-start">
          {/* Left 5 cols: Profile Card + Stats + Quick Info */}
          <div className="lg:col-span-5 space-y-2.5">
            {/* Profile Card */}
            <div className="bg-white rounded-[1.3rem] p-3.5 flex items-center gap-3 border border-charcoal/5 shadow-xs">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white"
                style={{ backgroundColor: profile.avatarColor || '#FF6584' }}
              >
                <span className="text-white text-base font-black">{avatarLetter}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-black text-charcoal truncate">{profile.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#368F7B]" />
                  <span className="text-[11px] font-bold text-[#368F7B]">Finora Lokal</span>
                </div>
              </div>
              <button
                onClick={onEditProfile}
                className="px-3 py-1 bg-[#FAF5EF] hover:bg-charcoal/10 rounded-full text-[11px] font-black text-charcoal transition-all shrink-0 cursor-pointer active:scale-95 border border-charcoal/5"
              >
                Ubah
              </button>
            </div>

            {/* 3 Metric Pods */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#EBF7F2] rounded-[1.1rem] p-2.5 text-center border border-[#368F7B]/15 shadow-xs">
                <div className="text-base font-black text-[#368F7B]">
                  <AnimatedNumber value={txCount} />
                </div>
                <p className="text-[9px] font-black text-[#368F7B]/70 uppercase mt-0.5">Catatan</p>
              </div>
              <div className="bg-[#FEEFEF] rounded-[1.1rem] p-2.5 text-center border border-[#FF6584]/15 shadow-xs">
                <div className="text-base font-black text-[#FF6584]">
                  <AnimatedNumber value={accountsCount} />
                </div>
                <p className="text-[9px] font-black text-[#FF6584]/70 uppercase mt-0.5">Dompet</p>
              </div>
              <div className="bg-[#F0EFFE] rounded-[1.1rem] p-2.5 text-center border border-[#7D7AFF]/15 shadow-xs">
                <div className="text-base font-black text-[#7D7AFF]">
                  <AnimatedNumber value={goalsCount} />
                </div>
                <p className="text-[9px] font-black text-[#7D7AFF]/70 uppercase mt-0.5">Impian</p>
              </div>
            </div>

            {/* Smart Storage Tip */}
            <div className="bg-[#FFF5EE] border border-[#FF9F43]/20 rounded-[1.1rem] p-3 flex items-center gap-2.5 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles size={13} className="text-[#FF9F43]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-charcoal">Data Tersimpan di Perangkat</p>
                <p className="text-[10px] text-charcoal/55 font-semibold mt-0.5 leading-snug">
                  Catatan keuanganmu otomatis tersimpan di memori lokal tanpa server luar.
                </p>
              </div>
            </div>
          </div>

          {/* Right 7 cols: Settings Menu List */}
          <div className="lg:col-span-7 space-y-2">
            <div className="bg-white rounded-[1.3rem] overflow-hidden divide-y divide-charcoal/5 border border-charcoal/5 shadow-xs">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 sm:py-3 hover:bg-[#FAF5EF]/70 transition-all duration-150 text-left group cursor-pointer active:bg-[#FAF5EF]"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs"
                      style={{ backgroundColor: `${item.color}18` }}
                    >
                      <Icon size={15} style={{ color: item.color }} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-charcoal">{item.label}</p>
                        {item.highlight && (
                          <span className="text-[8px] font-black bg-[#FF6584]/15 text-[#FF6584] px-1.5 py-0.2 rounded-full uppercase">
                            App
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-charcoal/40 font-semibold truncate">{item.sub}</p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-charcoal/25 group-hover:text-charcoal/60 group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

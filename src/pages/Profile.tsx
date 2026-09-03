import { User, Bell, Shield, Moon, Download, HelpCircle, ChevronRight, Sparkles, Smartphone } from 'lucide-react';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import WeekHeaderStrip from '../components/ui/WeekHeaderStrip';
import { useWeekStrip } from '../hooks/useWeekStrip';
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
  const { weekDays, isCurrentWeek, selectDay, goBack, goForward } = useWeekStrip();
  const avatarLetter = profile.name.trim() ? profile.name.trim()[0].toUpperCase() : 'U';

  const menuItems = [
    { icon: Smartphone, label: 'Pasang Aplikasi di HP', sub: 'Jadikan aplikasi mandiri tanpa browser', action: onOpenInstallApp, color: '#FF6584', highlight: true },
    { icon: User, label: 'Personalisasi & Nama', sub: 'Ubah nama panggilan & warna aksen', action: onEditProfile, color: '#FFA94D' },
    { icon: Bell, label: 'Notifikasi & Pengingat', sub: 'Atur alert pengeluaran & tagihan', action: onOpenNotifications, color: '#368F7B' },
    { icon: Shield, label: 'Keamanan Perangkat', sub: 'Proteksi data & privasi lokal', action: onOpenSecurity, color: '#7D7AFF' },
    { icon: Moon, label: 'Format Angka & Tema', sub: 'Format Rupiah dan preferensi visual', action: onToggleTheme, color: '#246B5A' },
    { icon: Download, label: 'Ekspor & Cadangkan Data', sub: 'Unduh CSV atau backup JSON lokal', action: onExportData, color: '#FF758C' },
    { icon: HelpCircle, label: 'Bantuan & Panduan', sub: 'Petunjuk penggunaan fitur & FAQ', action: onOpenHelp, color: '#FFA94D' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F3ED]">
      <WeekHeaderStrip
        title="PROFIL & PENGATURAN"
        gradientFromTo="from-[#4A8A78] to-[#2D6A4F]"
        leftElement={
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 border-white/30 shadow-xs"
            style={{ backgroundColor: profile.avatarColor || '#FF6584' }}
          >
            {avatarLetter}
          </div>
        }
        rightElement={
          <button onClick={onOpenNotifications} className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/30 cursor-pointer active:scale-90 transition-all shadow-xs">
            <Bell size={14} />
          </button>
        }
        weekDays={weekDays}
        isCurrentWeek={isCurrentWeek}
        goBack={goBack}
        goForward={goForward}
        selectDay={selectDay}
      />

      <main className="bg-white rounded-t-[2rem] -mt-8 pt-5 px-4 pb-40 space-y-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] relative z-20">

        {/* Profile Hero Card */}
        <div className="bg-[#EFFAF6] rounded-2xl p-4 border-2 border-[#368F7B]/15 interactive-card animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-sm border-2 border-white"
              style={{ backgroundColor: profile.avatarColor || '#FF6584' }}
            >
              {avatarLetter}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-black text-[#1C1B18]">{profile.name}</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#368F7B]" />
                <span className="text-[10px] font-black text-[#368F7B]">Finora Lokal · Bergabung {profile.joinedDate}</span>
              </div>
            </div>
            <button
              onClick={onEditProfile}
              className="px-3.5 py-2 bg-white border-2 border-[#368F7B]/20 text-[#368F7B] rounded-xl text-[10px] font-black cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              Ubah
            </button>
          </div>

          {/* 3-Pod Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl p-2.5 text-center border border-[#368F7B]/10">
              <div className="text-xl font-black text-[#368F7B]">
                <AnimatedNumber value={txCount} />
              </div>
              <p className="text-[9px] font-black text-[#1C1B18]/40 uppercase mt-0.5">Catatan</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 text-center border border-[#FF6584]/10">
              <div className="text-xl font-black text-[#FF6584]">
                <AnimatedNumber value={accountsCount} />
              </div>
              <p className="text-[9px] font-black text-[#1C1B18]/40 uppercase mt-0.5">Dompet</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 text-center border border-[#7D7AFF]/10">
              <div className="text-xl font-black text-[#7D7AFF]">
                <AnimatedNumber value={goalsCount} />
              </div>
              <p className="text-[9px] font-black text-[#1C1B18]/40 uppercase mt-0.5">Impian</p>
            </div>
          </div>
        </div>

        {/* Local Data Badge */}
        <div className="bg-[#FFF5ED] border-2 border-[#FFA94D]/20 rounded-2xl p-3.5 flex items-center gap-3 interactive-card">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border-2 border-[#FFA94D]/20 shadow-xs">
            <Sparkles size={14} className="text-[#FFA94D]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[#1C1B18]">Data Tersimpan di Perangkat</p>
            <p className="text-[10px] text-[#1C1B18]/50 font-bold mt-0.5">Catatan keuanganmu otomatis tersimpan lokal tanpa server luar.</p>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl border-2 border-[#1C1B18]/8 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1C1B18]/6">
            <h3 className="text-[10px] font-black text-[#1C1B18] uppercase tracking-wider">PENGATURAN</h3>
          </div>
          <div className="divide-y divide-[#1C1B18]/6">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              if (!item.action) return null;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8F3ED] transition-all cursor-pointer text-left group active:bg-[#F0ECE8]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${item.color}18` }}
                  >
                    <Icon size={16} style={{ color: item.color }} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-[#1C1B18]">{item.label}</p>
                      {item.highlight && (
                        <span className="text-[8px] font-black bg-[#FF6584]/15 text-[#FF6584] px-1.5 py-0.5 rounded-full uppercase">APP</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#1C1B18]/40 font-bold truncate">{item.sub}</p>
                  </div>
                  <ChevronRight size={14} className="text-[#1C1B18]/20 group-hover:text-[#1C1B18]/50 transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* App Version */}
        <div className="text-center py-2">
          <p className="text-[10px] font-black text-[#1C1B18]/20">FINORA v1.0 · Local-First Personal Finance</p>
        </div>
      </main>
    </div>
  );
}

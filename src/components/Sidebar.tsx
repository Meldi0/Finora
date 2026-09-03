import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  PiggyBank,
  Target,
  RefreshCw,
  Calendar as CalendarIcon,
  Settings,
  Plus,
} from 'lucide-react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  userName?: string;
  userEmail?: string;
  onNavigate: (page: Page) => void;
  onAdd: () => void;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
  { id: 'transactions', label: 'Aktivitas', icon: Receipt },
  { id: 'accounts', label: 'Dompet & Rekening', icon: Wallet },
  { id: 'budget', label: 'Anggaran', icon: PiggyBank },
  { id: 'goals', label: 'Impian & Tabungan', icon: Target },
  { id: 'recurring', label: 'Rutin & Langganan', icon: RefreshCw },
  { id: 'calendar', label: 'Kalender Keuangan', icon: CalendarIcon },
  { id: 'analytics', label: 'Analitik', icon: BarChart3 },
];

export default function Sidebar({
  currentPage,
  userName = 'Pengguna',
  onNavigate,
  onAdd,
}: SidebarProps) {
  const avatarLetter = userName.trim() ? userName.trim()[0].toUpperCase() : 'U';

  return (
    <aside className="w-64 h-full bg-white flex flex-col border-r border-[#1C1B18]/08 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#1C1B18]/06">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white font-extrabold text-base shadow-xs">
            F
          </div>
          <div>
            <span className="font-bold text-base text-[#1C1B18] tracking-tight">FINORA</span>
            <div className="text-[9px] text-[#1C1B18]/40 font-semibold tracking-wider uppercase">
              Local Companion
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 py-3">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#2D6A4F] hover:bg-[#246B5A] text-white text-xs font-semibold rounded-lg shadow-xs active:scale-98 transition-all cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Catat Transaksi</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                  : 'text-[#1C1B18]/65 hover:bg-[#F8F3ED] hover:text-[#1C1B18]'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-[#2D6A4F]' : 'text-[#1C1B18]/50'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Settings Section */}
      <div className="p-3 border-t border-[#1C1B18]/08 space-y-1.5">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
            currentPage === 'profile'
              ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
              : 'text-[#1C1B18]/65 hover:bg-[#F8F3ED] hover:text-[#1C1B18]'
          }`}
        >
          <Settings size={16} strokeWidth={currentPage === 'profile' ? 2.5 : 2} className={currentPage === 'profile' ? 'text-[#2D6A4F]' : 'text-[#1C1B18]/50'} />
          <span>Pengaturan</span>
        </button>

        <div
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2.5 p-2 bg-[#F8F3ED] hover:bg-[#F8F3ED]/80 rounded-lg transition-colors cursor-pointer border border-[#1C1B18]/05"
        >
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">{avatarLetter}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#1C1B18] leading-tight truncate">{userName}</p>
            <p className="text-[10px] text-[#1C1B18]/40 font-medium truncate">Offline & Lokal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { LayoutDashboard, Receipt, Wallet, BarChart3, PiggyBank, Target, Settings, Plus } from 'lucide-react';
import FinoraLogo from './ui/FinoraLogo';
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
  { id: 'transactions', label: 'Transaksi', icon: Receipt },
  { id: 'accounts', label: 'Akun & Dompet', icon: Wallet },
  { id: 'analytics', label: 'Analitik', icon: BarChart3 },
  { id: 'budget', label: 'Anggaran', icon: PiggyBank },
  { id: 'goals', label: 'Tujuan Tabungan', icon: Target },
];

export default function Sidebar({
  currentPage,
  userName = 'Pengguna',
  userEmail = 'pribadi@finora.id',
  onNavigate,
  onAdd,
}: SidebarProps) {
  const avatarLetter = userName.trim() ? userName.trim()[0].toUpperCase() : 'U';

  return (
    <aside className="w-68 h-full bg-white/85 backdrop-blur-xl flex flex-col border-r border-charcoal/5 shrink-0 select-none z-20">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="transition-transform duration-200 group-hover:scale-105">
            <FinoraLogo size={42} />
          </div>
          <div>
            <span className="font-black text-xl text-charcoal tracking-tight">Finora</span>
            <div className="text-[10px] text-charcoal/40 font-bold -mt-0.5 tracking-wider">
              PERSONAL FINANCE
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="px-5 mb-4">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FF6584] to-[#FFA94D] rounded-full text-white text-xs font-black shadow-md shadow-[#FF6584]/25 hover:shadow-lg hover:shadow-[#FF6584]/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Plus size={16} strokeWidth={3} className="transition-transform duration-200 group-hover:rotate-90" />
          <span>Catat Transaksi</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-xs font-black transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'text-charcoal/50 hover:bg-[#F8F3ED] hover:text-charcoal'
              }`}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-transform duration-200 ${isActive ? 'scale-110 text-[#FF6584]' : ''}`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-charcoal/5 space-y-2">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer text-left ${
            currentPage === 'profile'
              ? 'bg-charcoal text-white shadow-sm'
              : 'text-charcoal/50 hover:bg-[#F8F3ED] hover:text-charcoal'
          }`}
        >
          <Settings size={16} strokeWidth={currentPage === 'profile' ? 2.5 : 2} />
          <span>Pengaturan Pribadi</span>
        </button>

        <div
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 px-4 py-2.5 bg-[#F8F3ED] hover:bg-cream rounded-2xl transition-all duration-200 cursor-pointer border border-charcoal/5"
        >
          <div className="w-8 h-8 bg-[#FF6584] rounded-full flex items-center justify-center shrink-0 shadow-xs">
            <span className="text-white font-black text-xs">{avatarLetter}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-charcoal leading-tight truncate">{userName}</p>
            <p className="text-[10px] text-charcoal/40 font-semibold truncate">Offline & Lokal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

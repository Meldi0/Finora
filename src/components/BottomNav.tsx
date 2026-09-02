import { memo } from 'react';
import { LayoutDashboard, Wallet, Plus, BarChart3, User } from 'lucide-react';
import type { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onAdd: () => void;
}

function BottomNav({ currentPage, onNavigate, onAdd }: BottomNavProps) {
  const tabs = [
    {
      id: 'dashboard' as Page,
      label: 'Beranda',
      icon: LayoutDashboard,
      activeBg: 'bg-[#FF6584]/15',
      activeText: 'text-[#FF6584]',
      activeBorder: 'border-[#FF6584]/20',
    },
    {
      id: 'accounts' as Page,
      label: 'Dompet',
      icon: Wallet,
      activeBg: 'bg-[#7D7AFF]/15',
      activeText: 'text-[#7D7AFF]',
      activeBorder: 'border-[#7D7AFF]/20',
    },
    {
      id: 'add' as const,
      label: 'Catat',
      icon: Plus,
      activeBg: 'bg-[#368F7B]/15',
      activeText: 'text-[#368F7B]',
      activeBorder: 'border-[#368F7B]/20',
    },
    {
      id: 'analytics' as Page,
      label: 'Analitik',
      icon: BarChart3,
      activeBg: 'bg-[#FFA94D]/15',
      activeText: 'text-[#FFA94D]',
      activeBorder: 'border-[#FFA94D]/20',
    },
    {
      id: 'profile' as Page,
      label: 'Profil',
      icon: User,
      activeBg: 'bg-[#FF758C]/15',
      activeText: 'text-[#FF758C]',
      activeBorder: 'border-[#FF758C]/20',
    },
  ];

  const isTabActive = (tabId: string) => {
    if (tabId === 'dashboard' && currentPage === 'dashboard') return true;
    if (tabId === 'accounts' && currentPage === 'accounts') return true;
    if (tabId === 'analytics' && (currentPage === 'analytics' || currentPage === 'transactions' || currentPage === 'budget' || currentPage === 'goals')) return true;
    if (tabId === 'profile' && currentPage === 'profile') return true;
    return false;
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'add') {
      onAdd();
    } else if (tabId === 'analytics') {
      onNavigate('analytics');
    } else {
      onNavigate(tabId as Page);
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none select-none flex justify-center gpu-layer">
      {/* ── Apple iOS Liquid Floating Pill Dock ── */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-2xl rounded-full p-2 shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-charcoal/8 flex items-center justify-between gap-1.5 transition-all duration-300 ease-out max-w-full">
        {tabs.map((tab) => {
          const active = isTabActive(tab.id);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-95 ${
                active
                  ? `px-3.5 py-2 rounded-full ${tab.activeBg} ${tab.activeText} border ${tab.activeBorder} shadow-xs scale-102`
                  : 'w-10 h-10 rounded-full text-charcoal/45 hover:text-charcoal hover:bg-charcoal/5'
              }`}
              aria-label={tab.label}
            >
              <Icon
                size={active ? 18 : 20}
                strokeWidth={active ? 2.6 : 2}
                className={`shrink-0 transition-transform duration-300 ${
                  active ? 'scale-105' : ''
                }`}
              />

              {active && (
                <span className="text-xs font-black tracking-tight ml-1.5 whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100 max-w-[80px]">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default memo(BottomNav);

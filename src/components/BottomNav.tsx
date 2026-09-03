import { memo } from 'react';
import { Home, Receipt, Plus, BarChart3, Menu } from 'lucide-react';
import type { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onAdd: () => void;
  onOpenMore: () => void;
}

function BottomNav({ currentPage, onNavigate, onAdd, onOpenMore }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard' as Page, label: 'Beranda', icon: Home },
    { id: 'transactions' as Page, label: 'Aktivitas', icon: Receipt },
    { id: 'add' as const, label: 'Catat', icon: Plus },
    { id: 'analytics' as Page, label: 'Analitik', icon: BarChart3 },
    { id: 'more' as const, label: 'Lainnya', icon: Menu },
  ];

  const isTabActive = (id: string) => {
    if (id === 'dashboard' && currentPage === 'dashboard') return true;
    if (id === 'transactions' && currentPage === 'transactions') return true;
    if (id === 'analytics' && currentPage === 'analytics') return true;
    if (id === 'more' && ['accounts', 'budget', 'goals', 'recurring', 'calendar', 'profile'].includes(currentPage)) return true;
    return false;
  };

  const handleClick = (id: string) => {
    if (id === 'add') onAdd();
    else if (id === 'more') onOpenMore();
    else onNavigate(id as Page);
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none select-none flex justify-center lg:hidden">
      {/* Warm Amber Pill Dock */}
      <nav className="pointer-events-auto bg-[#F4C56C] rounded-full py-2 px-3 shadow-[0_12px_40px_rgba(244,197,108,0.55)] border-2 border-[#1C1B18]/15 flex items-center justify-between gap-1 transition-all duration-300">
        {tabs.map(tab => {
          const active = isTabActive(tab.id);
          const Icon = tab.icon;
          const isAddButton = tab.id === 'add';

          if (isAddButton) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleClick(tab.id)}
                className="w-12 h-12 bg-[#1C1B18] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer border-2 border-[#F4C56C] mx-1"
                aria-label="Catat Transaksi"
              >
                <Plus size={22} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
                active
                  ? 'bg-[#1C1B18] text-white shadow-md scale-105'
                  : 'text-[#1C1B18]/65 hover:text-[#1C1B18] hover:bg-[#1C1B18]/10'
              }`}
              aria-label={tab.label}
            >
              <Icon size={20} strokeWidth={active ? 2.8 : 2} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default memo(BottomNav);

import {
  Wallet,
  PiggyBank,
  Target,
  RefreshCw,
  Calendar,
  Settings,
  X,
  CreditCard,
  Shield,
  HelpCircle,
  Download,
} from 'lucide-react';
import type { Page } from '../types';

interface MobileMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  onOpenSecurity?: () => void;
  onOpenExport?: () => void;
  onOpenHelp?: () => void;
}

export default function MobileMoreDrawer({
  isOpen,
  onClose,
  onNavigate,
  onOpenSecurity,
  onOpenExport,
  onOpenHelp,
}: MobileMoreDrawerProps) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'accounts' as Page, label: 'Dompet & Rekening', sub: 'Kelola kas & e-wallet', icon: Wallet, color: '#368F7B' },
    { id: 'budget' as Page, label: 'Anggaran Bulanan', sub: 'Batas & proyeksi pengeluaran', icon: PiggyBank, color: '#FF9F43' },
    { id: 'goals' as Page, label: 'Impian & Tabungan', sub: 'Target & hitungan bulanan', icon: Target, color: '#2D6A4F' },
    { id: 'recurring' as Page, label: 'Rutin & Langganan', sub: 'Tagihan & langganan bulanan', icon: RefreshCw, color: '#7D7AFF' },
    { id: 'calendar' as Page, label: 'Kalender Keuangan', sub: 'Jadwal transaksi harian', icon: Calendar, color: '#8B5CF6' },
    { id: 'profile' as Page, label: 'Pengaturan', sub: 'Profil, font, & cadangan data', icon: Settings, color: '#1C1B18' },
  ];

  const handleSelect = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#1C1B18]/40 backdrop-blur-xs animate-fade-in lg:hidden">
      <div className="bg-white rounded-t-2xl border-t border-[#1C1B18]/10 max-h-[85vh] overflow-y-auto p-4 space-y-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1C1B18]/08">
          <div>
            <h3 className="text-sm font-bold text-[#1C1B18]">Menu & Layanan</h3>
            <p className="text-[10px] text-[#1C1B18]/50 font-medium">Fitur keuangan lokal Finora</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#1C1B18]/40 hover:text-[#1C1B18] hover:bg-[#F8F3ED] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Core Nav Grid */}
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="p-3 bg-[#F8F3ED]/70 hover:bg-[#F8F3ED] rounded-xl border border-[#1C1B18]/05 flex flex-col justify-between text-left transition-colors cursor-pointer active:scale-98"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1B18] leading-tight">{item.label}</p>
                  <p className="text-[9px] text-[#1C1B18]/50 mt-0.5 truncate">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Utility Actions */}
        <div className="pt-2 border-t border-[#1C1B18]/08 space-y-1">
          {onOpenExport && (
            <button
              onClick={() => {
                onClose();
                onOpenExport();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1C1B18]/80 hover:bg-[#F8F3ED] rounded-lg transition-colors cursor-pointer"
            >
              <Download size={14} className="text-[#368F7B]" />
              <span>Cadangkan & Ekspor Data (CSV/JSON)</span>
            </button>
          )}

          {onOpenSecurity && (
            <button
              onClick={() => {
                onClose();
                onOpenSecurity();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1C1B18]/80 hover:bg-[#F8F3ED] rounded-lg transition-colors cursor-pointer"
            >
              <Shield size={14} className="text-[#FF6584]" />
              <span>Keamanan & Sandi PIN</span>
            </button>
          )}

          {onOpenHelp && (
            <button
              onClick={() => {
                onClose();
                onOpenHelp();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1C1B18]/80 hover:bg-[#F8F3ED] rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle size={14} className="text-[#7D7AFF]" />
              <span>Panduan Finansial 50/30/20</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

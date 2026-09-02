import React, { useEffect } from 'react';
import { X, Bell, AlertTriangle, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'bill' | 'insight' | 'success';
  read: boolean;
}

interface NotificationModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onClear: () => void;
}

export default function NotificationModal({
  notifications,
  onClose,
  onMarkAllRead,
  onClear,
}: NotificationModalProps) {
  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] px-6 pt-6 pb-8 shadow-2xl animate-scale-in max-h-[85vh] flex flex-col">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-12 h-1.5 bg-charcoal/15 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal/10 rounded-xl flex items-center justify-center">
              <Bell size={18} className="text-teal" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-charcoal">Notifikasi</h2>
              <p className="text-[11px] text-charcoal/40 font-medium">Pemberitahuan keuanganmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-cream hover:bg-charcoal/10 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={17} className="text-charcoal/70" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-charcoal/5">
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-teal hover:underline cursor-pointer"
          >
            Tandai semua dibaca
          </button>
          <button
            onClick={onClear}
            className="text-xs font-bold text-charcoal/40 hover:text-coral cursor-pointer"
          >
            Hapus semua
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.map(item => {
            const Icon =
              item.type === 'warning'
                ? AlertTriangle
                : item.type === 'bill'
                ? Calendar
                : item.type === 'insight'
                ? TrendingUp
                : CheckCircle2;

            const iconColor =
              item.type === 'warning'
                ? '#F5A623'
                : item.type === 'bill'
                ? '#E95C7A'
                : item.type === 'insight'
                ? '#3D9188'
                : '#3D9188';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-colors flex items-start gap-3 ${
                  item.read
                    ? 'bg-white border-charcoal/5 opacity-70'
                    : 'bg-cream/60 border-charcoal/10'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${iconColor}18` }}
                >
                  <Icon size={16} style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-extrabold text-charcoal">{item.title}</p>
                    <span className="text-[10px] text-charcoal/40 font-medium shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/65 font-medium mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-charcoal/30" />
              </div>
              <p className="text-sm font-bold text-charcoal">Tidak ada notifikasi baru</p>
              <p className="text-xs text-charcoal/40 mt-0.5">Semua pengingat telah bersih</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

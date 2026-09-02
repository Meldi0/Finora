import { useEffect } from 'react';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  const currentToast = toasts[0];
  if (!currentToast) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      <ToastCapsule key={currentToast.id} toast={currentToast} onDismiss={onDismiss} />
    </div>
  );
}

function ToastCapsule({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      onClick={() => onDismiss(toast.id)}
      className="pointer-events-auto cursor-pointer flex items-center gap-3 px-4 py-2 rounded-full dark-capsule shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-white/20 animate-slide-down active:scale-95 transition-all max-w-sm"
    >
      {/* Dynamic Colored Glow Circle */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
          isSuccess
            ? 'bg-[#368F7B] text-white'
            : isError
            ? 'bg-[#FF6584] text-white'
            : 'bg-[#FFA94D] text-white'
        }`}
      >
        {isSuccess ? (
          <Check size={13} strokeWidth={3} />
        ) : isError ? (
          <AlertCircle size={13} strokeWidth={3} />
        ) : (
          <Sparkles size={13} strokeWidth={3} />
        )}
      </div>

      <div className="min-w-0 pr-1">
        <p className="text-xs font-black text-white tracking-tight leading-tight truncate">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-[10px] text-white/60 font-semibold truncate leading-tight mt-0.5">
            {toast.message}
          </p>
        )}
      </div>
    </div>
  );
}

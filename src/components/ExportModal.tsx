import { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, Database, Check, AlertCircle } from 'lucide-react';
import { exportTransactionsToCSV } from '../utils/exportCsv';
import type { Transaction, Account, Budget, Goal } from '../types';

interface ExportModalProps {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  onClose: () => void;
  onRestoreData: (backup: {
    transactions: Transaction[];
    accounts: Account[];
    budgets: Budget[];
    goals: Goal[];
  }) => void;
}

export default function ExportModal({
  transactions,
  accounts,
  budgets,
  goals,
  onClose,
  onRestoreData,
}: ExportModalProps) {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      setStatusMsg({ type: 'error', text: 'Belum ada catatan transaksi untuk diekspor.' });
      return;
    }
    exportTransactionsToCSV(transactions);
    setStatusMsg({ type: 'success', text: 'File CSV riwayat berhasil diunduh!' });
  };

  const handleExportJSON = () => {
    const data = {
      finora_version: '1.0',
      exported_at: new Date().toISOString(),
      transactions,
      accounts,
      budgets,
      goals,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finora-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMsg({ type: 'success', text: 'Cadangan JSON lengkap berhasil diunduh!' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.transactions && json.accounts) {
          onRestoreData({
            transactions: json.transactions || [],
            accounts: json.accounts || [],
            budgets: json.budgets || [],
            goals: json.goals || [],
          });
          setStatusMsg({ type: 'success', text: 'Data cadangan berhasil dipulihkan!' });
          setTimeout(onClose, 1200);
        } else {
          setStatusMsg({ type: 'error', text: 'Format file cadangan tidak valid.' });
        }
      } catch {
        setStatusMsg({ type: 'error', text: 'Gagal membaca file backup JSON.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-t-[1.6rem] lg:rounded-[1.6rem] px-4 pt-3.5 pb-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="lg:hidden w-10 h-1 bg-charcoal/15 rounded-full mx-auto mb-2.5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6584]/15 text-[#FF6584] flex items-center justify-center">
              <Download size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-charcoal">Ekspor & Cadangkan</h2>
              <p className="text-[10px] text-charcoal/40 font-semibold">Unduh atau pulihkan data keuangan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#F8F3ED] hover:bg-charcoal/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} className="text-charcoal/70" />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Option 1: CSV Export */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full bg-[#FAF5EF] hover:bg-[#FAF5EF]/80 p-3 rounded-xl border border-charcoal/5 flex items-center gap-3 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="w-9 h-9 rounded-lg bg-[#368F7B]/15 text-[#368F7B] flex items-center justify-center shrink-0">
              <FileSpreadsheet size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-charcoal">Ekspor Spreadsheet CSV</p>
              <p className="text-[10px] text-charcoal/45 font-medium">Buka di Excel, Google Sheets, atau Numbers</p>
            </div>
            <Download size={15} className="text-charcoal/30 group-hover:text-charcoal transition-colors shrink-0" />
          </button>

          {/* Option 2: JSON Backup */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full bg-[#FAF5EF] hover:bg-[#FAF5EF]/80 p-3 rounded-xl border border-charcoal/5 flex items-center gap-3 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="w-9 h-9 rounded-lg bg-[#7D7AFF]/15 text-[#7D7AFF] flex items-center justify-center shrink-0">
              <Database size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-charcoal">Cadangkan Data (JSON)</p>
              <p className="text-[10px] text-charcoal/45 font-medium">Salinan lengkap akun, transaksi & impian</p>
            </div>
            <Download size={15} className="text-charcoal/30 group-hover:text-charcoal transition-colors shrink-0" />
          </button>

          {/* Option 3: Restore Data */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#FAF5EF] hover:bg-[#FAF5EF]/80 p-3 rounded-xl border border-dashed border-charcoal/15 flex items-center gap-3 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FF9F43]/15 text-[#FF9F43] flex items-center justify-center shrink-0">
              <Upload size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-charcoal">Pulihkan Cadangan (Restore)</p>
              <p className="text-[10px] text-charcoal/45 font-medium">Impor file JSON cadangan sebelumnya</p>
            </div>
            <Upload size={15} className="text-charcoal/30 group-hover:text-charcoal transition-colors shrink-0" />
          </button>

          {/* Status message */}
          {statusMsg && (
            <div
              className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-black ${
                statusMsg.type === 'success'
                  ? 'bg-[#EBF7F2] text-[#368F7B]'
                  : 'bg-[#FEEFEF] text-[#FF6584]'
              }`}
            >
              {statusMsg.type === 'success' ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} />}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3.5 py-2.5 bg-[#FAF5EF] hover:bg-charcoal/5 text-charcoal font-black text-xs rounded-xl transition-all cursor-pointer active:scale-98"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}

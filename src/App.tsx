import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import AddTransaction from './components/AddTransaction';
import AddAccountModal from './components/AddAccountModal';
import TransferModal from './components/TransferModal';
import AddBudgetModal from './components/AddBudgetModal';
import AddGoalModal from './components/AddGoalModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import EditProfileModal, { type UserProfile } from './components/EditProfileModal';
import NotificationModal, { type NotificationItem } from './components/NotificationModal';
import InstallAppModal from './components/InstallAppModal';
import SecurityModal from './components/SecurityModal';
import ThemePreferencesModal from './components/ThemePreferencesModal';
import HelpGuideModal from './components/HelpGuideModal';
import ExportModal from './components/ExportModal';
import Toast, { type ToastMessage } from './components/ui/Toast';
import PageTransition from './components/ui/PageTransition';
import SplashScreen from './components/SplashScreen';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

import { formatRupiah } from './data/mockData';
import type { Page, Transaction, Account, Budget as BudgetType, Goal } from './types';

// Helper safe local storage loader
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallApp, setShowInstallApp] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Core Finance State (Initialized purely from user's storage without dummy data)
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadLocal<Transaction[]>('finora_transactions', [])
  );
  const [accounts, setAccounts] = useState<Account[]>(() =>
    loadLocal<Account[]>('finora_accounts', [])
  );
  const [budgets, setBudgets] = useState<BudgetType[]>(() =>
    loadLocal<BudgetType[]>('finora_budgets', [])
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadLocal<Goal[]>('finora_goals', [])
  );
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadLocal<UserProfile>('finora_profile', {
      name: 'Pengguna',
      email: 'pribadi@finora.id',
      avatarColor: '#FF6584',
      plan: 'Personal',
      joinedDate: '2026',
    })
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadLocal<NotificationItem[]>('finora_notifications', [])
  );

  // Sync back to local storage
  useEffect(() => {
    try {
      localStorage.setItem('finora_transactions', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('finora_accounts', JSON.stringify(accounts));
    } catch {}
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('finora_budgets', JSON.stringify(budgets));
    } catch {}
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem('finora_goals', JSON.stringify(goals));
    } catch {}
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('finora_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('finora_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Modal visibility states
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Single Active Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts([newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 1. Transaction Handlers
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);

    // Update Account Balance
    setAccounts(prev => {
      const targetAcc = prev.find(a => a.id === newTx.accountId);
      if (!targetAcc) {
        return [
          ...prev,
          {
            id: newTx.accountId,
            name: newTx.accountId === 'bca' ? 'BCA' : newTx.accountId.toUpperCase(),
            type: 'bank',
            balance: newTx.type === 'income' ? newTx.amount : 0,
            color: '#368F7B',
            icon: 'wallet',
          },
        ];
      }
      return prev.map(acc => {
        if (acc.id === newTx.accountId) {
          const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
          return { ...acc, balance: Math.max(0, acc.balance + delta) };
        }
        return acc;
      });
    });

    // Update Budget Spent if Expense
    if (newTx.type === 'expense') {
      setBudgets(prev =>
        prev.map(b => {
          if (b.categoryId === newTx.categoryId) {
            return { ...b, spent: b.spent + newTx.amount };
          }
          return b;
        })
      );
    }

    addToast(
      'success',
      'Transaksi Berhasil Disimpan',
      `${newTx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${formatRupiah(newTx.amount)} telah dicatat.`
    );
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setTransactions(prev => prev.filter(t => t.id !== id));

    // Revert Account Balance
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === target.accountId) {
          const delta = target.type === 'income' ? -target.amount : target.amount;
          return { ...acc, balance: Math.max(0, acc.balance + delta) };
        }
        return acc;
      })
    );

    // Revert Budget Spent if Expense
    if (target.type === 'expense') {
      setBudgets(prev =>
        prev.map(b => {
          if (b.categoryId === target.categoryId) {
            return { ...b, spent: Math.max(0, b.spent - target.amount) };
          }
          return b;
        })
      );
    }

    addToast('info', 'Transaksi Dihapus', `Catatan "${target.description}" telah dihapus.`);
  };

  // 2. Account & Transfer Handlers
  const handleAddAccount = (newAccount: Account) => {
    setAccounts(prev => [...prev, newAccount]);
    addToast('success', 'Akun Baru Ditambahkan', `Rekening "${newAccount.name}" siap digunakan.`);
  };

  const handleTransferFunds = (fromId: string, toId: string, amount: number, notes?: string) => {
    const fromAcc = accounts.find(a => a.id === fromId);
    const toAcc = accounts.find(a => a.id === toId);

    if (!fromAcc || !toAcc || fromAcc.balance < amount) {
      addToast('error', 'Transfer Gagal', 'Saldo akun asal tidak mencukupi.');
      return;
    }

    // Update balances
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    // Record transfer transaction
    const today = new Date().toISOString().slice(0, 10);
    const transferTx: Transaction = {
      id: `tx-transfer-${Date.now()}`,
      date: today,
      amount,
      type: 'expense',
      categoryId: 'bills',
      accountId: fromId,
      description: notes || `Transfer ke ${toAcc.name}`,
    };
    setTransactions(prev => [transferTx, ...prev]);

    addToast(
      'success',
      'Transfer Berhasil',
      `Berhasil memindahkan ${formatRupiah(amount)} dari ${fromAcc.name} ke ${toAcc.name}.`
    );
  };

  // 3. Budget Handlers
  const handleAddOrUpdateBudget = (newBudget: BudgetType) => {
    setBudgets(prev => {
      const exists = prev.some(b => b.categoryId === newBudget.categoryId);
      if (exists) {
        return prev.map(b => (b.categoryId === newBudget.categoryId ? { ...b, limit: newBudget.limit } : b));
      }
      return [...prev, newBudget];
    });
    addToast('success', 'Anggaran Disimpan', 'Batas pengeluaran kategori telah diperbarui.');
  };

  // 4. Goal Handlers
  const handleAddGoal = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
    addToast('success', 'Tujuan Tabungan Dibuat', `Target "${newGoal.name}" telah aktif.`);
  };

  const handleUpdateGoalAmount = (id: string, delta: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextAmount = Math.max(0, Math.min(g.currentAmount + delta, g.targetAmount));
          return { ...g, currentAmount: nextAmount };
        }
        return g;
      })
    );

    if (delta > 0) {
      addToast('success', 'Tabungan Bertambah', `Berhasil menabung ${formatRupiah(delta)} ke tujuan.`);
    } else {
      addToast('info', 'Penarikan Dana', `Berhasil menarik ${formatRupiah(Math.abs(delta))} dari tujuan.`);
    }
  };

  // 5. Profile & Data Handlers
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    addToast('success', 'Profil Diperbarui', 'Nama panggilan berhasil diperbarui.');
  };

  const handleResetAllData = () => {
    setTransactions([]);
    setAccounts([]);
    setBudgets([]);
    setGoals([]);
    setNotifications([]);
    localStorage.removeItem('finora_transactions');
    localStorage.removeItem('finora_accounts');
    localStorage.removeItem('finora_budgets');
    localStorage.removeItem('finora_goals');
    localStorage.removeItem('finora_notifications');
    addToast('info', 'Data Dibersihkan', 'Seluruh catatan telah dihapus dari perangkat.');
  };

  const handleRestoreData = (backup: {
    transactions: Transaction[];
    accounts: Account[];
    budgets: BudgetType[];
    goals: Goal[];
  }) => {
    setTransactions(backup.transactions);
    setAccounts(backup.accounts);
    setBudgets(backup.budgets);
    setGoals(backup.goals);
    addToast('success', 'Data Dipulihkan', 'Seluruh catatan dari file cadangan berhasil dimuat.');
  };

  // 6. Notification Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('info', 'Notifikasi Dibaca', 'Seluruh notifikasi telah ditandai sebagai dibaca.');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    addToast('info', 'Notifikasi Dibersihkan', 'Semua notifikasi telah dihapus.');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            accounts={accounts}
            budgets={budgets}
            userName={profile.name}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenNotifications={() => setShowNotifications(true)}
            onNavigate={setPage}
            onSelectTransaction={tx => setSelectedTransaction(tx)}
            onAddTransaction={() => setShowAddTransaction(true)}
            onAddAccount={() => setShowAddAccount(true)}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            accounts={accounts}
            onSelectTransaction={tx => setSelectedTransaction(tx)}
            onAddTransaction={() => setShowAddTransaction(true)}
          />
        );
      case 'accounts':
        return (
          <Accounts
            transactions={transactions}
            accounts={accounts}
            onAddAccount={() => setShowAddAccount(true)}
            onOpenTransfer={() => setShowTransfer(true)}
          />
        );
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'budget':
        return (
          <Budget
            transactions={transactions}
            budgets={budgets}
            onAddBudget={() => setShowAddBudget(true)}
          />
        );
      case 'goals':
        return (
          <Goals
            goals={goals}
            onAddGoal={() => setShowAddGoal(true)}
            onUpdateGoal={handleUpdateGoalAmount}
          />
        );
      case 'profile':
        return (
          <Profile
            profile={profile}
            txCount={transactions.length}
            accountsCount={accounts.length}
            goalsCount={goals.length}
            onEditProfile={() => setShowEditProfile(true)}
            onExportData={() => setShowExportModal(true)}
            onOpenNotifications={() => setShowNotifications(true)}
            onOpenInstallApp={() => setShowInstallApp(true)}
            onOpenSecurity={() => setShowSecurityModal(true)}
            onToggleTheme={() => setShowThemeModal(true)}
            onOpenHelp={() => setShowHelpModal(true)}
          />
        );
      default:
        return (
          <Dashboard
            transactions={transactions}
            accounts={accounts}
            budgets={budgets}
            userName={profile.name}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenNotifications={() => setShowNotifications(true)}
            onNavigate={setPage}
            onSelectTransaction={tx => setSelectedTransaction(tx)}
            onAddTransaction={() => setShowAddTransaction(true)}
            onAddAccount={() => setShowAddAccount(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-full bg-[#F8F3ED]/70 backdrop-blur-[2px] overflow-hidden">
      {/* Animated Apple Splash Screen on Startup */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Toast Notification Container (Single Toast Active) */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={page}
          userName={profile.name}
          userEmail={profile.email}
          onNavigate={setPage}
          onAdd={() => setShowAddTransaction(true)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <PageTransition key={page} className="flex-1 flex flex-col min-h-0">
          {renderPage()}
        </PageTransition>
      </main>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
        <BottomNav currentPage={page} onNavigate={setPage} onAdd={() => setShowAddTransaction(true)} />
      </div>

      {/* ── Modals ── */}
      {/* 1. Add Transaction */}
      {showAddTransaction && (
        <AddTransaction
          accounts={accounts}
          onClose={() => setShowAddTransaction(false)}
          onSave={handleAddTransaction}
          onAddAccount={() => setShowAddAccount(true)}
        />
      )}

      {/* 2. Add Account */}
      {showAddAccount && (
        <AddAccountModal
          onClose={() => setShowAddAccount(false)}
          onSave={handleAddAccount}
        />
      )}

      {/* 3. Transfer Funds */}
      {showTransfer && (
        <TransferModal
          accounts={accounts}
          onClose={() => setShowTransfer(false)}
          onTransfer={handleTransferFunds}
        />
      )}

      {/* 4. Add/Edit Budget */}
      {showAddBudget && (
        <AddBudgetModal
          existingBudgets={budgets}
          onClose={() => setShowAddBudget(false)}
          onSave={handleAddOrUpdateBudget}
        />
      )}

      {/* 5. Add Goal */}
      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onSave={handleAddGoal}
        />
      )}

      {/* 6. Edit Profile */}
      {showEditProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSave={handleUpdateProfile}
        />
      )}

      {/* 7. Notifications */}
      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onClear={handleClearNotifications}
        />
      )}

      {/* 8. Transaction Detail & Delete */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onDelete={handleDeleteTransaction}
        />
      )}

      {/* 9. Install App to Home Screen Modal */}
      {showInstallApp && (
        <InstallAppModal
          onClose={() => setShowInstallApp(false)}
          deferredPrompt={deferredPrompt}
          onInstallPrompted={() => setDeferredPrompt(null)}
        />
      )}

      {/* 10. Security & Privacy Modal */}
      {showSecurityModal && (
        <SecurityModal
          onClose={() => setShowSecurityModal(false)}
          onResetData={handleResetAllData}
        />
      )}

      {/* 11. Theme & Number Format Modal */}
      {showThemeModal && (
        <ThemePreferencesModal
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {/* 12. Help & FAQ Guide Modal */}
      {showHelpModal && (
        <HelpGuideModal
          onClose={() => setShowHelpModal(false)}
        />
      )}

      {/* 13. Export CSV & JSON Backup / Restore Modal */}
      {showExportModal && (
        <ExportModal
          transactions={transactions}
          accounts={accounts}
          budgets={budgets}
          goals={goals}
          onClose={() => setShowExportModal(false)}
          onRestoreData={handleRestoreData}
        />
      )}
    </div>
  );
}

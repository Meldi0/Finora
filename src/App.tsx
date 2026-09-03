import { useState, useEffect, useCallback, memo } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MobileMoreDrawer from './components/MobileMoreDrawer';
import OnboardingModal from './components/OnboardingModal';
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
import Recurring from './pages/Recurring';
import MoneyCalendar from './pages/MoneyCalendar';

import {
  accounts as initialAccounts,
  transactions as initialTxs,
  budgets as initialBudgets,
  goals as initialGoals,
  recurringTransactions as initialRecurring,
  subscriptionItems as initialSubs,
  assetsLiabilities as initialAssetsLiabilities,
  formatRupiah,
} from './data/mockData';
import { loadStoredData, saveStoredData } from './utils/storageService';
import type { Page, Transaction, Account, Budget as BudgetType, Goal, RecurringTransaction, SubscriptionItem, AssetLiability } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

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

  // Core Finance State
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadStoredData<Transaction[]>('finora_transactions', initialTxs)
  );
  const [accounts, setAccounts] = useState<Account[]>(() =>
    loadStoredData<Account[]>('finora_accounts', initialAccounts)
  );
  const [budgets, setBudgets] = useState<BudgetType[]>(() =>
    loadStoredData<BudgetType[]>('finora_budgets', initialBudgets)
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadStoredData<Goal[]>('finora_goals', initialGoals)
  );
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(() =>
    loadStoredData<RecurringTransaction[]>('finora_recurring', initialRecurring)
  );
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() =>
    loadStoredData<SubscriptionItem[]>('finora_subscriptions', initialSubs)
  );
  const [assetsLiabilities, setAssetsLiabilities] = useState<AssetLiability[]>(() =>
    loadStoredData<AssetLiability[]>('finora_assets_liabilities', initialAssetsLiabilities)
  );

  const [profile, setProfile] = useState<UserProfile>(() =>
    loadStoredData<UserProfile>('finora_profile', {
      name: 'Alex',
      email: 'pribadi@finora.id',
      avatarColor: '#2D6A4F',
      plan: 'Personal',
      joinedDate: '2026',
    })
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadStoredData<NotificationItem[]>('finora_notifications', [])
  );

  // Check first launch for Onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('finora_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('finora_onboarding_seen', 'true');
    }
  }, []);

  // Asynchronous Storage Persistence
  useEffect(() => { saveStoredData('finora_transactions', transactions); }, [transactions]);
  useEffect(() => { saveStoredData('finora_accounts', accounts); }, [accounts]);
  useEffect(() => { saveStoredData('finora_budgets', budgets); }, [budgets]);
  useEffect(() => { saveStoredData('finora_goals', goals); }, [goals]);
  useEffect(() => { saveStoredData('finora_recurring', recurring); }, [recurring]);
  useEffect(() => { saveStoredData('finora_subscriptions', subscriptions); }, [subscriptions]);
  useEffect(() => { saveStoredData('finora_profile', profile); }, [profile]);
  useEffect(() => { saveStoredData('finora_notifications', notifications); }, [notifications]);

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

  // Single Active Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts([newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 1. Transaction Handlers (Supports Income, Expense, and Transfer)
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };

    setTransactions(prev => [newTx, ...prev]);

    if (newTx.type === 'transfer' && newTx.fromAccountId && newTx.toAccountId) {
      // Transfer logic: Account A -> Account B
      setAccounts(prev =>
        prev.map(acc => {
          if (acc.id === newTx.fromAccountId) {
            return { ...acc, balance: Math.max(0, acc.balance - newTx.amount) };
          }
          if (acc.id === newTx.toAccountId) {
            return { ...acc, balance: acc.balance + newTx.amount };
          }
          return acc;
        })
      );
      addToast(
        'success',
        'Transfer Berhasil',
        `Memindahkan ${formatRupiah(newTx.amount)} antar rekening.`
      );
    } else {
      // Income or Expense logic
      setAccounts(prev =>
        prev.map(acc => {
          if (acc.id === newTx.accountId) {
            const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
            return { ...acc, balance: Math.max(0, acc.balance + delta) };
          }
          return acc;
        })
      );

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
        'Transaksi Disimpan',
        `${newTx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${formatRupiah(newTx.amount)} dicatat.`
      );
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setTransactions(prev => prev.filter(t => t.id !== id));

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
    addToast('success', 'Akun Ditambahkan', `Rekening "${newAccount.name}" siap digunakan.`);
  };

  const handleTransferFunds = (fromId: string, toId: string, amount: number, notes?: string) => {
    const fromAcc = accounts.find(a => a.id === fromId);
    const toAcc = accounts.find(a => a.id === toId);

    if (!fromAcc || !toAcc || fromAcc.balance < amount) {
      addToast('error', 'Transfer Gagal', 'Saldo akun asal tidak mencukupi.');
      return;
    }

    handleAddTransaction({
      type: 'transfer',
      amount,
      categoryId: 'bills',
      accountId: fromId,
      fromAccountId: fromId,
      toAccountId: toId,
      merchant: 'Transfer Antar Rekening',
      description: notes || `Transfer dari ${fromAcc.name} ke ${toAcc.name}`,
      date: new Date().toISOString().slice(0, 10),
    });
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
    addToast('success', 'Target Impian Dibuat', `Target "${newGoal.name}" telah aktif.`);
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
      addToast('success', 'Tabungan Bertambah', `Berhasil menabung ${formatRupiah(delta)} ke target.`);
    }
  };

  // 5. Profile & Data Management
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    addToast('success', 'Profil Diperbarui', 'Informasi profil berhasil diperbarui.');
  };

  const handleResetAllData = () => {
    setTransactions([]);
    setAccounts([]);
    setBudgets([]);
    setGoals([]);
    setNotifications([]);
    localStorage.clear();
    addToast('info', 'Data Bersih', 'Seluruh catatan lokal telah dibersihkan.');
  };

  const handleRestoreData = (backup: any) => {
    if (backup.transactions) setTransactions(backup.transactions);
    if (backup.accounts) setAccounts(backup.accounts);
    if (backup.budgets) setBudgets(backup.budgets);
    if (backup.goals) setGoals(backup.goals);
    if (backup.recurring) setRecurring(backup.recurring);
    if (backup.subscriptions) setSubscriptions(backup.subscriptions);
    addToast('success', 'Data Dipulihkan', 'Seluruh data dari cadangan berhasil dimuat.');
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
            goals={goals}
            recurring={recurring}
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
      case 'recurring':
        return (
          <Recurring
            recurring={recurring}
            subscriptions={subscriptions}
          />
        );
      case 'calendar':
        return (
          <MoneyCalendar
            transactions={transactions}
            recurring={recurring}
            onSelectTransaction={tx => setSelectedTransaction(tx)}
          />
        );
      case 'analytics':
        return <Analytics transactions={transactions} />;
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
            goals={goals}
            recurring={recurring}
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
    <div className="flex h-full bg-[#F8F3ED] overflow-hidden">
      {/* Refined Editorial Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Optional Non-Intrusive Onboarding Flow */}
      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onAddAccount={handleAddAccount}
          onAddGoal={handleAddGoal}
        />
      )}

      {/* Toast System */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Desktop Editorial Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={page}
          userName={profile.name}
          userEmail={profile.email}
          onNavigate={setPage}
          onAdd={() => setShowAddTransaction(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <PageTransition key={page} className="flex-1 flex flex-col min-h-0">
          {renderPage()}
        </PageTransition>
      </main>

      {/* Mobile Bottom Navigation & Drawer */}
      <BottomNav
        currentPage={page}
        onNavigate={setPage}
        onAdd={() => setShowAddTransaction(true)}
        onOpenMore={() => setShowMobileMore(true)}
      />

      <MobileMoreDrawer
        isOpen={showMobileMore}
        onClose={() => setShowMobileMore(false)}
        onNavigate={setPage}
        onOpenSecurity={() => setShowSecurityModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Modals */}
      {showAddTransaction && (
        <AddTransaction
          accounts={accounts}
          onClose={() => setShowAddTransaction(false)}
          onSave={handleAddTransaction}
          onAddAccount={() => setShowAddAccount(true)}
        />
      )}

      {showAddAccount && (
        <AddAccountModal
          onClose={() => setShowAddAccount(false)}
          onSave={handleAddAccount}
        />
      )}

      {showTransfer && (
        <TransferModal
          accounts={accounts}
          onClose={() => setShowTransfer(false)}
          onTransfer={handleTransferFunds}
        />
      )}

      {showAddBudget && (
        <AddBudgetModal
          existingBudgets={budgets}
          onClose={() => setShowAddBudget(false)}
          onSave={handleAddOrUpdateBudget}
        />
      )}

      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onSave={handleAddGoal}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSave={handleUpdateProfile}
        />
      )}

      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onClear={() => setNotifications([])}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onDelete={handleDeleteTransaction}
        />
      )}

      {showInstallApp && (
        <InstallAppModal
          onClose={() => setShowInstallApp(false)}
          deferredPrompt={deferredPrompt}
          onInstallPrompted={() => setDeferredPrompt(null)}
        />
      )}

      {showSecurityModal && (
        <SecurityModal
          onClose={() => setShowSecurityModal(false)}
          onResetData={handleResetAllData}
        />
      )}

      {showThemeModal && (
        <ThemePreferencesModal
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {showHelpModal && (
        <HelpGuideModal
          onClose={() => setShowHelpModal(false)}
        />
      )}

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

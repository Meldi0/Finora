import type { Transaction, Account, Budget, Goal, RecurringTransaction, SubscriptionItem, AssetLiability, UserProfile } from '../types';

export interface FinoraBackupData {
  version: string;
  timestamp: string;
  profile: UserProfile;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurring: RecurringTransaction[];
  subscriptions: SubscriptionItem[];
  assetsLiabilities: AssetLiability[];
}

const STORAGE_KEYS = {
  PROFILE: 'finora_profile',
  ACCOUNTS: 'finora_accounts',
  TRANSACTIONS: 'finora_transactions',
  BUDGETS: 'finora_budgets',
  GOALS: 'finora_goals',
  RECURRING: 'finora_recurring',
  SUBSCRIPTIONS: 'finora_subscriptions',
  ASSETS_LIABILITIES: 'finora_assets_liabilities',
  LAST_BACKUP: 'finora_last_backup_time',
};

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredData(key: string, data: any): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.error('Storage save error:', err);
      }
    });
  } else {
    setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.error('Storage save error:', err);
      }
    }, 0);
  }
}

export function exportFullBackup(
  profile: UserProfile,
  accounts: Account[],
  transactions: Transaction[],
  budgets: Budget[],
  goals: Goal[],
  recurring: RecurringTransaction[],
  subscriptions: SubscriptionItem[],
  assetsLiabilities: AssetLiability[]
): string {
  const now = new Date().toISOString();
  const backup: FinoraBackupData = {
    version: '2.0.0',
    timestamp: now,
    profile,
    accounts,
    transactions,
    budgets,
    goals,
    recurring,
    subscriptions,
    assetsLiabilities,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, now);
  } catch {}

  return JSON.stringify(backup, null, 2);
}

export function getLastBackupTimestamp(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP);
  } catch {
    return null;
  }
}

export function validateAndParseBackup(jsonString: string): FinoraBackupData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.transactions) && Array.isArray(parsed.accounts)) {
      return parsed as FinoraBackupData;
    }
    return null;
  } catch {
    return null;
  }
}

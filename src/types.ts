export type Page =
  | 'dashboard'
  | 'transactions'
  | 'accounts'
  | 'budget'
  | 'goals'
  | 'recurring'
  | 'analytics'
  | 'calendar'
  | 'profile';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Account {
  id: string;
  name: string;
  icon: string;
  balance: number;
  color: string;
  type?: 'bank' | 'e-wallet' | 'cash' | 'savings' | 'investment';
  accountNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense';
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  description: string;
  merchant?: string;
  fromAccountId?: string;
  toAccountId?: string;
  date: string; // ISO format 'YYYY-MM-DD'
  notes?: string;
}

export interface Budget {
  categoryId: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO format 'YYYY-MM-DD'
  color: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'monthly' | 'weekly' | 'yearly' | 'daily';
  dayOfMonth?: number;
  nextDate?: string;
  categoryId: string;
  accountId: string;
  isSubscription?: boolean;
  active: boolean;
  isActive?: boolean; // alias for active
}

export interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'annual';
  billingDay: number;
  categoryId: string;
  icon?: string;
}

export interface AssetLiability {
  id: string;
  name: string;
  type: 'asset' | 'liability';
  category: 'property' | 'vehicle' | 'investment' | 'loan' | 'credit' | 'other' | 'bank' | 'savings';
  amount: number;
  notes?: string;
}

export interface FinancialInsight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  title: string;
  message: string;
  actionText?: string;
  actionPage?: Page;
}

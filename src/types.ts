export type Page =
  | 'dashboard'
  | 'transactions'
  | 'accounts'
  | 'analytics'
  | 'budget'
  | 'goals'
  | 'profile';

export interface Account {
  id: string;
  name: string;
  icon: string;
  balance: number;
  color: string;
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
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  categoryId: string;
  accountId: string;
  description: string;
  date: string;
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
  deadline: string;
  color: string;
}

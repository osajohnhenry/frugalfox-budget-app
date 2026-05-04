export type TransactionType = 'income' | 'expense';

export interface CategoryItem {
  name: string;
  icon: string;
}

export interface Categories {
  expense: CategoryItem[];
  income: CategoryItem[];
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  icon: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  createdAt: string;
  completed: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  categoryIcon?: string;
  note: string;
  date: string;
  budgetId?: string;
  goalId?: string;
}
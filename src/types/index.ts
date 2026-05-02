export type TransactionType = 'income' | 'expense';

export interface CategoryItem {
  name: string;
  icon: string;
}

export interface Categories {
  expense: CategoryItem[];
  income: CategoryItem[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  categoryIcon?: string;
  note: string;
  date: string;
}
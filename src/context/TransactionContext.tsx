import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Categories, TransactionType, CategoryItem } from '../types';
import { getTransactions, saveTransactions, getCategories, saveCategories } from '../storage';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  categories: Categories;
  addCategory: (type: TransactionType, category: string, icon: string) => boolean;
  balance: number;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categories>({ expense: [], income: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [transactionData, categoryData] = await Promise.all([getTransactions(), getCategories()]);
    setTransactions(transactionData);
    setCategories(categoryData);
    setLoading(false);
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const addCategory = (type: TransactionType, category: string, icon: string) => {
    const trimmed = category.trim();
    if (!trimmed || !icon) return false;
    const current = categories[type];
    const otherType = type === 'income' ? 'expense' : 'income';
    const other = categories[otherType];
    const normalized = trimmed.toLowerCase();

    if (current.some((item) => item.name.toLowerCase() === normalized)) return false;
    if (other.some((item) => item.name.toLowerCase() === normalized)) return false;

    const updated = {
      ...categories,
      [type]: [{ name: trimmed, icon }, ...current],
    };

    setCategories(updated);
    saveCategories(updated).catch((e) => console.error('Failed to save categories', e));
    return true;
  };

  const balance = transactions.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, categories, addCategory, balance, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};
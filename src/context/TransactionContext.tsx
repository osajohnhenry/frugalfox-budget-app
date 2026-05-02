import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Categories, TransactionType } from '../types';
import { getTransactions, saveTransactions, getCategories, saveCategories } from '../storage';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Omit<Transaction, 'id'>) => boolean;
  categories: Categories;
  addCategory: (type: TransactionType, category: string, icon: string) => boolean;
  editCategory: (type: TransactionType, oldName: string, newName: string, newIcon: string) => boolean;
  deleteCategory: (type: TransactionType, name: string) => boolean;
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

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const editTransaction = async (id: string, tx: Omit<Transaction, 'id'>) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    const updatedTx = { ...tx, id };
    const updated = [...transactions];
    updated[index] = updatedTx;
    setTransactions(updated);
    await saveTransactions(updated);
    return true;
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

  const editCategory = (type: TransactionType, oldName: string, newName: string, newIcon: string) => {
    const trimmed = newName.trim();
    if (!trimmed || !newIcon) return false;
    const current = categories[type];
    const index = current.findIndex((item) => item.name === oldName);
    if (index === -1) return false;

    // Check for duplicates
    const otherType = type === 'income' ? 'expense' : 'income';
    const other = categories[otherType];
    const normalized = trimmed.toLowerCase();
    if (current.some((item, i) => i !== index && item.name.toLowerCase() === normalized)) return false;
    if (other.some((item) => item.name.toLowerCase() === normalized)) return false;

    const updated = {
      ...categories,
      [type]: current.map((item, i) => i === index ? { name: trimmed, icon: newIcon } : item),
    };

    setCategories(updated);
    saveCategories(updated).catch((e) => console.error('Failed to save categories', e));
    return true;
  };

  const deleteCategory = (type: TransactionType, name: string) => {
    const current = categories[type];
    const index = current.findIndex((item) => item.name === name);
    if (index === -1) return false;

    const updated = {
      ...categories,
      [type]: current.filter((_, i) => i !== index),
    };

    setCategories(updated);
    saveCategories(updated).catch((e) => console.error('Failed to save categories', e));
    return true;
  };

  const balance = transactions.reduce((acc, curr) =>
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount,
    0
  );

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, editTransaction, categories, addCategory, editCategory, deleteCategory, balance, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Categories } from '../types';

const STORAGE_KEY = '@budget_transactions_v1';
const CATEGORIES_KEY = '@budget_categories_v1';

const defaultCategories: Categories = {
  expense: [
    { name: 'Food', icon: 'food-apple' },
    { name: 'Transport', icon: 'truck-delivery' },
    { name: 'Bills', icon: 'file-document' },
    { name: 'Shopping', icon: 'shopping' },
  ],
  income: [
    { name: 'Salary', icon: 'cash' },
    { name: 'Gift', icon: 'gift' },
    { name: 'Freelance', icon: 'briefcase' },
    { name: 'Other', icon: 'wallet' },
  ],
};

export const saveTransactions = async (transactions: Transaction[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load transactions', e);
    return [];
  }
};

export const saveCategories = async (categories: Categories) => {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

const migrateCategories = (data: any, type: 'expense' | 'income'): Categories['expense'] => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    if (typeof item === 'string') {
      return { name: item, icon: 'label' };
    }
    if (typeof item === 'object' && item !== null && typeof item.name === 'string' && typeof item.icon === 'string') {
      return { name: item.name, icon: item.icon };
    }
    return { name: String(item), icon: 'label' };
  });
};

export const getCategories = async (): Promise<Categories> => {
  try {
    const json = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (!json) return defaultCategories;
    const parsed = JSON.parse(json);
    return {
      expense: migrateCategories(parsed.expense ?? [], 'expense'),
      income: migrateCategories(parsed.income ?? [], 'income'),
    };
  } catch (e) {
    console.error('Failed to load categories', e);
    return defaultCategories;
  }
};
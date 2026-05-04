import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Categories, Budget, Goal } from '../types';

const STORAGE_KEY = '@budget_transactions_v1';
const CATEGORIES_KEY = '@budget_categories_v1';
const BUDGETS_KEY = '@budget_budgets_v1';
const GOALS_KEY = '@budget_goals_v1';

const defaultCategories: Categories = {
  expense: [],
  income: [],
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

export const getCategories = async (): Promise<Categories> => {
  try {
    const json = await AsyncStorage.getItem(CATEGORIES_KEY);
    return json ? JSON.parse(json) : defaultCategories;
  } catch (e) {
    console.error('Failed to load categories', e);
    return defaultCategories;
  }
};

export const saveBudgets = async (budgets: Budget[]) => {
  try {
    await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to save budgets', e);
  }
};

export const getBudgets = async (): Promise<Budget[]> => {
  try {
    const json = await AsyncStorage.getItem(BUDGETS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load budgets', e);
    return [];
  }
};

export const saveGoals = async (goals: Goal[]) => {
  try {
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
};

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const json = await AsyncStorage.getItem(GOALS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load goals', e);
    return [];
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(CATEGORIES_KEY);
    await AsyncStorage.removeItem(BUDGETS_KEY);
    await AsyncStorage.removeItem(GOALS_KEY);
    console.log('All data cleared successfully');
  } catch (e) {
    console.error('Failed to clear data', e);
  }
};
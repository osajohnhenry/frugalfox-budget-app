import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Categories, TransactionType, Budget, Goal } from '../types';
import { getTransactions, saveTransactions, getCategories, saveCategories, getBudgets, saveBudgets, getGoals, saveGoals } from '../storage';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Omit<Transaction, 'id'>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  categories: Categories;
  addCategory: (type: TransactionType, category: string, icon: string) => boolean;
  editCategory: (type: TransactionType, oldName: string, newName: string, newIcon: string) => boolean;
  deleteCategory: (type: TransactionType, name: string) => boolean;
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  editBudget: (id: string, budget: Omit<Budget, 'id'>) => Promise<boolean>;
  deleteBudget: (id: string) => Promise<boolean>;
  getBudgetSpending: (budgetId: string) => number;
  getBudgetTransactions: (budgetId: string, limit?: number) => Transaction[];
  updateBudgetProgress: (budgetId: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  editGoal: (id: string, goal: Omit<Goal, 'id'>) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  getGoalProgress: (goalId: string) => number;
  updateGoalProgress: (goalId: string, amount: number) => void;
  balance: number;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categories>({ expense: [], income: [] });
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [transactionData, categoryData, budgetData, goalData] = await Promise.all([getTransactions(), getCategories(), getBudgets(), getGoals()]);
    setTransactions(transactionData);
    setCategories(categoryData);
    setBudgets(budgetData);
    setGoals(goalData);
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

    // Update goal progress if income is linked to a goal
    if (tx.type === 'income' && tx.goalId) {
      updateGoalProgress(tx.goalId, tx.amount);
    }

    // Update budget progress if expense is linked to a budget
    if (tx.type === 'expense' && tx.budgetId) {
      updateBudgetProgress(tx.budgetId);
    }
  };

  const editTransaction = async (id: string, tx: Omit<Transaction, 'id'>) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    const oldTx = transactions[index];
    const updatedTx = { ...tx, id };
    const updated = [...transactions];
    updated[index] = updatedTx;
    setTransactions(updated);
    await saveTransactions(updated);

    // Update goal progress if income transaction goal linkage changed
    if (tx.type === 'income') {
      if (oldTx.goalId !== tx.goalId) {
        // Old goal was removed or changed - subtract the old amount
        if (oldTx.goalId) {
          updateGoalProgress(oldTx.goalId, -oldTx.amount);
        }
        // New goal was added - add the new amount
        if (tx.goalId) {
          updateGoalProgress(tx.goalId, tx.amount);
        }
      } else if (tx.goalId && (oldTx.amount !== tx.amount)) {
        // Same goal but amount changed - adjust by the difference
        const amountDifference = tx.amount - oldTx.amount;
        updateGoalProgress(tx.goalId, amountDifference);
      }
    }

    // Update budget progress if expense transaction budget linkage changed
    if (tx.type === 'expense') {
      if (oldTx.budgetId !== tx.budgetId) {
        // Old budget was removed or changed
        if (oldTx.budgetId) {
          updateBudgetProgress(oldTx.budgetId);
        }
        // New budget was added
        if (tx.budgetId) {
          updateBudgetProgress(tx.budgetId);
        }
      } else if (tx.budgetId && (oldTx.amount !== tx.amount)) {
        // Same budget but amount changed
        updateBudgetProgress(tx.budgetId);
      }
    }

    return true;
  };

  const deleteTransaction = async (id: string) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    const txToDelete = transactions[index];
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    await saveTransactions(updated);

    // Update goal progress if income transaction was linked to a goal
    if (txToDelete.type === 'income' && txToDelete.goalId) {
      updateGoalProgress(txToDelete.goalId, -txToDelete.amount);
    }

    // Update budget progress if expense transaction was linked to a budget
    if (txToDelete.type === 'expense' && txToDelete.budgetId) {
      updateBudgetProgress(txToDelete.budgetId);
    }

    return true;
  };

  const addCategory = (type: TransactionType, category: string, icon: string) => {
    const trimmed = category.trim();
    if (!trimmed || !icon) return false;

    const updated = {
      ...categories,
      [type]: [{ name: trimmed, icon }, ...categories[type]],
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

  const getBudgetSpending = (budgetId: string) => {
    return transactions
      .filter(t => t.budgetId === budgetId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetTransactions = (budgetId: string, limit: number = 5) => {
    return transactions
      .filter(t => t.budgetId === budgetId && t.type === 'expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    const updated = [newBudget, ...budgets];
    setBudgets(updated);
    await saveBudgets(updated);
  };

  const editBudget = async (id: string, budget: Omit<Budget, 'id'>) => {
    const index = budgets.findIndex(b => b.id === id);
    if (index === -1) return false;

    const updatedBudget = { ...budget, id };
    const updated = [...budgets];
    updated[index] = updatedBudget;
    setBudgets(updated);
    await saveBudgets(updated);
    return true;
  };

  const deleteBudget = async (id: string) => {
    const index = budgets.findIndex(b => b.id === id);
    if (index === -1) return false;

    const updated = budgets.filter((_, i) => i !== index);
    setBudgets(updated);
    await saveBudgets(updated);
    
    // Remove budgetId from transactions
    const updatedTransactions = transactions.map(t => 
      t.budgetId === id ? { ...t, budgetId: undefined } : t
    );
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
    return true;
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    await saveGoals(updated);
  };

  const editGoal = async (id: string, goal: Omit<Goal, 'id'>) => {
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) return false;

    const updatedGoal = { ...goal, id };
    const updated = [...goals];
    updated[index] = updatedGoal;
    setGoals(updated);
    await saveGoals(updated);
    return true;
  };

  const deleteGoal = async (id: string) => {
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) return false;

    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
    await saveGoals(updated);
    
    // Remove goalId from transactions
    const updatedTransactions = transactions.map(t => 
      t.goalId === id ? { ...t, goalId: undefined } : t
    );
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
    return true;
  };

  const getGoalProgress = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.currentAmount : 0;
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    const index = goals.findIndex(g => g.id === goalId);
    if (index === -1) return;

    const updated = [...goals];
    const currentAmount = updated[index].currentAmount + amount;
    updated[index] = {
      ...updated[index],
      currentAmount,
      completed: currentAmount >= updated[index].targetAmount
    };
    setGoals(updated);
    saveGoals(updated).catch(e => console.error('Failed to update goal progress', e));
  };

  const updateBudgetProgress = (budgetId: string) => {
    // Force a re-render of budgets by creating a new array reference
    // This triggers React to re-render components that depend on budget state
    setBudgets([...budgets]);
  };

  const balance = transactions.reduce((acc, curr) =>
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount,
    0
  );

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      editTransaction, 
      deleteTransaction, 
      categories, 
      addCategory, 
      editCategory, 
      deleteCategory, 
      budgets, 
      addBudget, 
      editBudget, 
      deleteBudget, 
      getBudgetSpending,
      getBudgetTransactions,
      updateBudgetProgress,
      goals, 
      addGoal, 
      editGoal, 
      deleteGoal, 
      getGoalProgress, 
      updateGoalProgress,
      balance, 
      loading 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};
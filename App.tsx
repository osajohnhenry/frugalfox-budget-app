import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionProvider } from './src/context/TransactionContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { SettingsScreen } from './src/screens/Settings';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AppearanceScreen } from './src/screens/AppearanceScreen';
import { AllTransactionsScreen } from './src/screens/AllTransactionsScreen';
import { EditTransactionScreen } from './src/screens/EditTransactionScreen';
import { AddCategoryScreen } from './src/screens/AddCategoryScreen';
import { EditCategoryScreen } from './src/screens/EditCategoryScreen';
import { ExportChartScreen } from './src/screens/ExportChartScreen';
import { AddBudgetScreen } from './src/screens/AddBudgetScreen';
import { EditBudgetScreen } from './src/screens/EditBudgetScreen';
import { AddGoalScreen } from './src/screens/AddGoalScreen';
import { EditGoalScreen } from './src/screens/EditGoalScreen';
import { AddTransactionScreen } from './src/screens/AddTransactionScreen';
import { BudgetTransactionsScreen } from './src/screens/BudgetTransactionsScreen';
import { GoalTransactionsScreen } from './src/screens/GoalTransactionsScreen';
import { BackupRestoreScreen } from './src/screens/BackupRestoreScreen';
import { TabNavigator } from './src/navigation/TabNavigator';
import { Transaction } from './src/types';
import { Budget } from './src/types';
import { Goal } from './src/types';
import SplashScreen from './src/components/SplashScreen';

type RootStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
  Profile: undefined;
  Appearance: undefined;
  BackupRestore: undefined;
  AllTransactions: { transactionType: 'income' | 'expense' };
  EditTransaction: { transaction: Transaction };
  AddTransaction: undefined;
  AddCategory: { transactionType: 'income' | 'expense' };
  EditCategory: { transactionType: 'income' | 'expense'; categoryName: string; icon: string };
  ExportChart: undefined;
  AddBudget: undefined;
  EditBudget: { budget: Budget };
  AddGoal: undefined;
  EditGoal: { goal: Goal };
  BudgetTransactions: { budgetId: string; budgetName: string };
  GoalTransactions: { goalId: string; goalName: string };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <TransactionProvider>
        <SplashScreen onFinish={handleSplashFinish} />
      </TransactionProvider>
    );
  }

  return (
    <ThemeProvider>
      <TransactionProvider>
        <NavigationContainer>
          <Stack.Navigator id="main-stack">
          <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="Appearance" component={AppearanceScreen} options={{ title: 'Appearance' }} />
          <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ title: 'Edit Transaction' }} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction', headerShown: true }} />
          <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ title: 'Add Category' }} />
          <Stack.Screen name="EditCategory" component={EditCategoryScreen} options={{ title: 'Edit Category' }} />
          <Stack.Screen name="ExportChart" component={ExportChartScreen} />
          <Stack.Screen name="AddBudget" component={AddBudgetScreen} options={{ title: 'Add Budget' }} />
          <Stack.Screen name="EditBudget" component={EditBudgetScreen} options={{ title: 'Edit Budget' }} />
          <Stack.Screen name="AddGoal" component={AddGoalScreen} options={{ title: 'Add Goal' }} />
          <Stack.Screen name="EditGoal" component={EditGoalScreen} options={{ title: 'Edit Goal' }} />
          <Stack.Screen name="BudgetTransactions" component={BudgetTransactionsScreen} />
          <Stack.Screen name="GoalTransactions" component={GoalTransactionsScreen} />
          <Stack.Screen name="BackupRestore" component={BackupRestoreScreen} options={{ title: 'Backup & Restore' }} />
        </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </ThemeProvider>
  );
}
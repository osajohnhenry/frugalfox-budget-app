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
import { TabNavigator } from './src/navigation/TabNavigator';
import { Transaction } from './src/types';
import SplashScreen from './src/components/SplashScreen';

type RootStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
  Profile: undefined;
  Appearance: undefined;
  AllTransactions: { transactionType: 'income' | 'expense' };
  EditTransaction: { transaction: Transaction };
  AddCategory: { transactionType: 'income' | 'expense' };
  EditCategory: { transactionType: 'income' | 'expense'; categoryName: string; icon: string };
  ExportChart: undefined;
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
          <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ title: 'Add Category' }} />
          <Stack.Screen name="EditCategory" component={EditCategoryScreen} options={{ title: 'Edit Category' }} />
          <Stack.Screen name="ExportChart" component={ExportChartScreen} />
        </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </ThemeProvider>
  );
}
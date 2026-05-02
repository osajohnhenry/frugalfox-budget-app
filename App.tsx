import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionProvider } from './src/context/TransactionContext';
import { SettingsScreen } from './src/screens/Settings';
import { AllTransactionsScreen } from './src/screens/AllTransactionsScreen';
import { TabNavigator } from './src/navigation/TabNavigator';

type RootStackParamList = { MainTabs: undefined; Settings: undefined; AllTransactions: { transactionType: 'income' | 'expense' } };
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
}
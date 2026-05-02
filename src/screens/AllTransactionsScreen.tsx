import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { Transaction } from '../types';
import { homeStyles as styles } from '../styles/screenStyles';

const currencySymbol = '₱';

const TransactionItem: React.FC<{ item: Transaction; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.txItem} onPress={onPress}>
    <View>
      <Text style={styles.txCategory}>{item.category}</Text>
      <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
    <Text style={[styles.txAmount, item.type === 'income' ? styles.income : styles.expense]}>
      {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
    </Text>
  </TouchableOpacity>
);

export const AllTransactionsScreen: React.FC<any> = ({ route, navigation }) => {
  const { transactionType } = route.params;
  const { transactions, loading, editTransaction, categories } = useTransactions();

  const filtered = transactions
    .filter((tx) => tx.type === transactionType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: transactionType === 'income' ? 'All Income' : 'All Expenses',
      headerStyle: { backgroundColor: '#4a90e2' },
      headerTintColor: '#fff',
      headerTitleStyle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
      headerBackTitleVisible: false,
      headerBackTitleStyle: { color: '#fff' },
    });
  }, [navigation, transactionType]);

  if (loading) return <ActivityIndicator size="large" style={styles.loadingContainer} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} onPress={() => {}} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No {transactionType === 'income' ? 'income' : 'expenses'} transactions yet.
          </Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

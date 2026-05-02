import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { Transaction } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { homeStyles as styles } from '../styles/screenStyles';

const currencySymbol = '₱';

const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
  const iconName = item.categoryIcon || (item.type === 'income' ? 'cash-plus' : 'cash-minus');
  return (
    <View style={styles.txItem}>
      <View style={styles.txCategoryRow}>
        <MaterialCommunityIcons name={iconName} size={22} color={item.type === 'income' ? '#2ecc71' : '#e74c3c'} style={styles.txIcon} />
        <View>
          <Text style={styles.txCategory}>{item.category}</Text>
          <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={[styles.txAmount, item.type === 'income' ? styles.income : styles.expense]}>
        {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
      </Text>
    </View>
  );
};

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { transactions, balance, loading } = useTransactions();
  const incomeTotal = transactions.reduce((sum, tx) => tx.type === 'income' ? sum + tx.amount : sum, 0);
  const expenseTotal = transactions.reduce((sum, tx) => tx.type === 'expense' ? sum + tx.amount : sum, 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) return <ActivityIndicator size="large" style={styles.loadingContainer} />;

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>{currencySymbol}{balance.toFixed(2)}</Text>
        <View style={styles.totalsRow}>
            <View style={[styles.totalsBadge, styles.expenseBadge]}>
            <View style={styles.totalsBadgeHeader}>
              <MaterialCommunityIcons name="arrow-down-bold" size={16} color="#fff" style={styles.totalsBadgeIcon} />
              <Text style={styles.totalsLabel}>Expenses</Text>
            </View>
            <Text style={styles.totalsValue}>-{currencySymbol}{expenseTotal.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsBadge, styles.incomeBadge]}>
            <View style={styles.totalsBadgeHeader}>
              <MaterialCommunityIcons name="arrow-up-bold" size={16} color="#fff" style={styles.totalsBadgeIcon} />
              <Text style={styles.totalsLabel}>Income</Text>
            </View>
            <Text style={styles.totalsValue}>+{currencySymbol}{incomeTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet. Tap + to add one!</Text>}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};


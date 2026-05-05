import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import { homeStyles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';

const currencySymbol = '₱';

const TransactionItem: React.FC<{ item: Transaction; onPress: () => void }> = ({ item, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[homeStyles.txItem, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={homeStyles.txItemContent}>
        <View>
          <Text style={commonStyles.unicodeIcon}>{getUnicodeIcon(item.categoryIcon || 'help-circle')}</Text>
          <Text style={[homeStyles.txCategory, { color: colors.text }]}>{item.category}</Text>
          <Text style={[homeStyles.txDate, { color: colors.textSecondary }]}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <Text style={[homeStyles.txAmount, item.type === 'income' ? homeStyles.income : homeStyles.expense]}>
          {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
        </Text>
      </View>
      <MaterialCommunityIcons name="pencil" size={16} color={colors.textSecondary} style={homeStyles.editIcon} />
    </TouchableOpacity>
  );
};

export const AllTransactionsScreen: React.FC<any> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { transactionType } = route.params;
  const { transactions, loading, editTransaction, categories } = useTransactions();

  const filtered = transactions
    .filter((tx) => tx.type === transactionType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: transactionType === 'income' ? 'All Income' : 'All Expenses',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackTitleVisible: false,
      headerBackTitleStyle: { color: colors.headerText },
    });
  }, [navigation, transactionType, colors]);

  if (loading) return <ActivityIndicator size="large" style={homeStyles.loadingContainer} />;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionItem 
          item={item} 
          onPress={() => navigation.navigate('EditTransaction', { transaction: item })}
        />
      )}
      ListEmptyComponent={
        <Text style={[homeStyles.emptyText, { color: colors.textSecondary }]}>
          No {transactionType === 'income' ? 'income' : 'expenses'} transactions yet.
        </Text>
      }
      contentContainerStyle={homeStyles.list}
    />
  );
};

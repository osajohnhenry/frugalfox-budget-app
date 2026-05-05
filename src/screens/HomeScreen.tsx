import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
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
      <View>
        <Text style={[homeStyles.txCategory, commonStyles.unicodeIcon]}>{getUnicodeIcon(item.categoryIcon || 'help-circle')}</Text>
        <Text style={[homeStyles.txCategory, { color: colors.text }]}>{item.category}</Text>
        <Text style={[homeStyles.txDate, { color: colors.textSecondary }]}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={[homeStyles.txAmount, item.type === 'income' ? homeStyles.income : homeStyles.expense]}>
        {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { transactions, balance, loading } = useTransactions();
  const incomeTotal = transactions.reduce((sum, tx) => tx.type === 'income' ? sum + tx.amount : sum, 0);
  const expenseTotal = transactions.reduce((sum, tx) => tx.type === 'expense' ? sum + tx.amount : sum, 0);

  // Group and sort transactions
  const expenseTransactions = transactions
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const incomeTransactions = transactions
    .filter((tx) => tx.type === 'income')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const expensesToShow = expenseTransactions.slice(0, 3);
  const incomeToShow = incomeTransactions.slice(0, 3);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={homeStyles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) return <ActivityIndicator size="large" style={homeStyles.loadingContainer} />;

  const hasNoTransactions = expenseTransactions.length === 0 && incomeTransactions.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[homeStyles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={[homeStyles.balanceCard, { backgroundColor: isDarkMode ? colors.card : '#c7c7ff' }]}>
        <Text style={[homeStyles.balanceLabel, { color: colors.textSecondary }]}>Total Balance</Text>
        <Text style={[homeStyles.balanceValue, { color: colors.text }]}>{currencySymbol}{balance.toFixed(2)}</Text>
        <View style={homeStyles.totalsRow}>
          <View style={[homeStyles.totalsBadge, homeStyles.expenseBadge]}>
            <Text style={[homeStyles.totalsLabel, { color: isDarkMode ? colors.text : '#fff' }]}>Expenses</Text>
            <Text style={[homeStyles.totalsValue, { color: isDarkMode ? colors.text : '#fff' }]}>-{currencySymbol}{expenseTotal.toFixed(2)}</Text>
          </View>
          <View style={[homeStyles.totalsBadge, homeStyles.incomeBadge]}>
            <Text style={[homeStyles.totalsLabel, { color: isDarkMode ? colors.text : '#fff' }]}>Income</Text>
            <Text style={[homeStyles.totalsValue, { color: isDarkMode ? colors.text : '#fff' }]}>+{currencySymbol}{incomeTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {hasNoTransactions ? (
        <View style={homeStyles.list}>
          <Text style={[homeStyles.emptyText, { color: colors.textSecondary }]}>No transactions yet. Tap + to add one!</Text>
        </View>
      ) : (
        <View style={homeStyles.list}>
          {/* Expenses Section */}
          {expenseTransactions.length > 0 && (
            <View style={homeStyles.transactionSection}>
              <View style={homeStyles.sectionHeader}>
                <Text style={[homeStyles.sectionTitle, { color: colors.text }]}>Expenses</Text>
                {expenseTransactions.length > 5 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: 'expense' })}>
                    <Text style={[homeStyles.viewAllLink, { color: colors.primary }]}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {expensesToShow.map((item) => (
                <TransactionItem key={item.id} item={item} onPress={() => navigation.navigate('EditTransaction', { transaction: item })} />
              ))}
            </View>
          )}

          {/* Income Section */}
          {incomeTransactions.length > 0 && (
            <View style={homeStyles.transactionSection}>
              <View style={homeStyles.sectionHeader}>
                <Text style={[homeStyles.sectionTitle, { color: colors.text }]}>Income</Text>
                {incomeTransactions.length > 5 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: 'income' })}>
                    <Text style={[homeStyles.viewAllLink, { color: colors.primary }]}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {incomeToShow.map((item) => (
                <TransactionItem key={item.id} item={item} onPress={() => navigation.navigate('EditTransaction', { transaction: item })} />
              ))}
            </View>
          )}
        </View>
      )}
      </ScrollView>

      <TouchableOpacity style={[homeStyles.addButton, commonStyles.fab, { 
        backgroundColor: colors.primary
      }]} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={[homeStyles.addButtonText, { fontSize: 24, marginBottom: 0 }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};


import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import { homeStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';


const currencySymbol = '₱';

const TransactionItem: React.FC<{ item: Transaction; onPress: () => void }> = ({ item, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.txItem, { backgroundColor: colors.card }]} onPress={onPress}>
      <View>
        <Text style={[styles.txCategory, commonStyles.unicodeIcon]}>{getUnicodeIcon(item.categoryIcon || 'help-circle')}</Text>
        <Text style={[styles.txCategory, { color: colors.text }]}>{item.category}</Text>
        <Text style={[styles.txDate, { color: colors.textSecondary }]}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.txAmount, item.type === 'income' ? styles.income : styles.expense]}>
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
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) return <ActivityIndicator size="large" style={styles.loadingContainer} />;

  const hasNoTransactions = expenseTransactions.length === 0 && incomeTransactions.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={[styles.balanceCard, { backgroundColor: isDarkMode ? colors.card : '#c7c7ff' }]}>
        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Total Balance</Text>
        <Text style={[styles.balanceValue, { color: colors.text }]}>{currencySymbol}{balance.toFixed(2)}</Text>
        <View style={styles.totalsRow}>
          <View style={[styles.totalsBadge, styles.expenseBadge]}>
            <Text style={[styles.totalsLabel, { color: isDarkMode ? colors.text : '#fff' }]}>Expenses</Text>
            <Text style={[styles.totalsValue, { color: isDarkMode ? colors.text : '#fff' }]}>-{currencySymbol}{expenseTotal.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsBadge, styles.incomeBadge]}>
            <Text style={[styles.totalsLabel, { color: isDarkMode ? colors.text : '#fff' }]}>Income</Text>
            <Text style={[styles.totalsValue, { color: isDarkMode ? colors.text : '#fff' }]}>+{currencySymbol}{incomeTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {hasNoTransactions ? (
        <View style={styles.list}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet. Tap + to add one!</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {/* Expenses Section */}
          {expenseTransactions.length > 0 && (
            <View style={styles.transactionSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Expenses</Text>
                {expenseTransactions.length > 5 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: 'expense' })}>
                    <Text style={[styles.viewAllLink, { color: colors.primary }]}>View All</Text>
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
            <View style={styles.transactionSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Income</Text>
                {incomeTransactions.length > 5 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: 'income' })}>
                    <Text style={[styles.viewAllLink, { color: colors.primary }]}>View All</Text>
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

      <TouchableOpacity style={[styles.addButton, { 
        width: 56, 
        height: 56, 
        borderRadius: 28, 
        padding: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 8,
        shadowColor: colors.border,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        backgroundColor: colors.primary
      }]} onPress={() => navigation.navigate('Add')}>
        <Text style={[styles.addButtonText, { fontSize: 24, marginBottom: 0 }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};


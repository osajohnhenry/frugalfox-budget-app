import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
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
        <Text style={commonStyles.unicodeIcon}>{getUnicodeIcon(item.categoryIcon || 'help-circle')}</Text>
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

  // Create data for FlatList
  const listData = [];
  
  // Add header data
  listData.push({ type: 'header', balance, expenseTotal, incomeTotal });
  
  // Add expenses section header
  if (expenseTransactions.length > 0) {
    listData.push({ 
      type: 'section_header', 
      title: 'Expenses', 
      transactionType: 'expense',
      count: expenseTransactions.length 
    });
    
    // Add expense transactions
    expensesToShow.forEach(item => {
      listData.push({ type: 'transaction', data: item });
    });
  }
  
  // Add income section header
  if (incomeTransactions.length > 0) {
    listData.push({ 
      type: 'section_header', 
      title: 'Income', 
      transactionType: 'income',
      count: incomeTransactions.length 
    });
    
    // Add income transactions
    incomeToShow.forEach(item => {
      listData.push({ type: 'transaction', data: item });
    });
  }

  const renderListItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={[homeStyles.balanceCard, { backgroundColor: isDarkMode ? colors.card : '#c7c7ff' }]} key="balance-card">
          <Text style={[homeStyles.balanceLabel, { color: colors.textSecondary }]}>Total Balance</Text>
          <Text style={[homeStyles.balanceValue, { color: colors.text }]}>{currencySymbol}{item.balance.toFixed(2)}</Text>
          <View style={homeStyles.totalsRow}>
            <View style={[homeStyles.totalsBadge, homeStyles.expenseBadge]}>
              <Text style={[homeStyles.totalsLabel, { color: isDarkMode ? colors.text : '#fff' }]}>Expenses</Text>
              <Text style={[homeStyles.totalsValue, { color: isDarkMode ? colors.text : '#fff' }]}>-{currencySymbol}{item.expenseTotal.toFixed(2)}</Text>
            </View>
            <View style={[homeStyles.totalsBadge, homeStyles.incomeBadge]}>
              <Text style={[homeStyles.totalsLabel, { color: isDarkMode ? colors.text : '#fff' }]}>Income</Text>
              <Text style={[homeStyles.totalsValue, { color: isDarkMode ? colors.text : '#fff' }]}>+{currencySymbol}{item.incomeTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      );
    }
    
    if (item.type === 'section_header') {
      return (
        <View style={homeStyles.transactionSection} key="section-header">
          <View style={homeStyles.sectionHeader}>
            <Text style={[homeStyles.sectionTitle, { color: colors.text }]}>{item.title}</Text>
            {item.count > 5 && (
              <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: item.transactionType })}>
                <Text style={[homeStyles.viewAllLink, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
    
    if (item.type === 'transaction') {
      return (
        <TransactionItem 
          key={item.data.id} 
          item={item.data} 
          onPress={() => navigation.navigate('EditTransaction', { transaction: item.data })} 
        />
      );
    }
    
    return null;
  };

  const listHeader = () => {
    if (hasNoTransactions) {
      return (
        <View style={homeStyles.list} key="empty-list">
          <Text style={[homeStyles.emptyText, { color: colors.textSecondary }]}>No transactions yet. Tap + to add one!</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        style={[homeStyles.container, { backgroundColor: colors.background }]}
        data={listData}
        renderItem={renderListItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={[homeStyles.addButton, commonStyles.fab, { 
        backgroundColor: colors.primary
      }]} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={[homeStyles.addButtonText, { fontSize: 24, marginBottom: 0 }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};


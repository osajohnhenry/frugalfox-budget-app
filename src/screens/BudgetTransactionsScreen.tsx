import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import { getUnicodeIcon } from '../utils/icons';
import { commonStyles, budgetScreenStyles } from '../styles/screenStyles';

export const BudgetTransactionsScreen: React.FC<any> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { getBudgetTransactions } = useTransactions();
  const { budgetId, budgetName } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: budgetName || 'Budget Transactions',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerRight: () => (
        <TouchableOpacity 
          style={budgetScreenStyles.headerButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, budgetName]);

  const budgetTransactions = getBudgetTransactions(budgetId);

  const renderTransaction = (transaction: Transaction) => (
    <View key={transaction.id} style={[commonStyles.card, { backgroundColor: colors.card }]}>
      <View style={commonStyles.rowBetween}>
        <View style={commonStyles.rowCenter}>
          <Text style={[commonStyles.unicodeIcon, { color: colors.textSecondary }]}>
            {getUnicodeIcon(transaction.categoryIcon || 'help-circle')}
          </Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text }]}>
              {transaction.category}
            </Text>
            <Text style={[commonStyles.textSmall, { color: colors.textSecondary }]}>
              {new Date(transaction.date).toLocaleDateString()} • {transaction.note || 'No note'}
            </Text>
          </View>
        </View>
        <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: '#e74c3c' }]}>
          -₱{transaction.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[budgetScreenStyles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={budgetTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTransaction(item)}
        ListEmptyComponent={
          <View style={budgetScreenStyles.emptyState}>
            <MaterialCommunityIcons name="receipt" size={64} color={colors.textSecondary} />
            <Text style={[budgetScreenStyles.emptyStateText, { color: colors.textSecondary }]}>
              No transactions yet
            </Text>
            <Text style={[budgetScreenStyles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Transactions linked to this budget will appear here
            </Text>
          </View>
        }
        ListHeaderComponent={
          budgetTransactions.length > 0 ? (
            <View style={{ marginBottom: 16, padding: 16 }}>
              <Text style={[commonStyles.textSmall, { color: colors.textSecondary }]}>
                {budgetTransactions.length} transaction{budgetTransactions.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

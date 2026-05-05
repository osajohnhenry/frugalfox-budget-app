import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import { getUnicodeIcon } from '../utils/icons';
import { commonStyles, budgetScreenStyles } from '../styles/screenStyles';

export const GoalTransactionsScreen: React.FC<any> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { transactions } = useTransactions();
  const { goalId, goalName } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: goalName || 'Goal Transactions',
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
  }, [navigation, colors, goalName]);

  const getGoalTransactions = (goalId: string) => {
    return transactions
      .filter(t => t.goalId === goalId && t.type === 'income')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const goalTransactions = getGoalTransactions(goalId);

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
        <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: '#2ecc71' }]}>
          +₱{transaction.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const totalAmount = goalTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={[budgetScreenStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {goalTransactions.length === 0 ? (
          <View style={budgetScreenStyles.emptyState}>
            <MaterialCommunityIcons name="trending-up" size={64} color={colors.textSecondary} />
            <Text style={[budgetScreenStyles.emptyStateText, { color: colors.textSecondary }]}>
              No income transactions yet
            </Text>
            <Text style={[budgetScreenStyles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Income transactions linked to this goal will appear here
            </Text>
          </View>
        ) : (
          <>
            <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
              <Text style={[commonStyles.textMedium, { color: colors.textSecondary }]}>
                Total Contributions
              </Text>
              <Text style={[commonStyles.textLarge, commonStyles.semiBold, { color: '#2ecc71' }]}>
                +₱{totalAmount.toFixed(2)}
              </Text>
              <Text style={[commonStyles.textSmall, { color: colors.textSecondary, marginTop: 4 }]}>
                {goalTransactions.length} transaction{goalTransactions.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {goalTransactions.map(renderTransaction)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

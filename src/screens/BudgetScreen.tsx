import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Budget, Transaction } from '../types';
import { getUnicodeIcon } from '../utils/icons';
import { commonStyles, budgetScreenStyles } from '../styles/screenStyles';

export const BudgetScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { budgets, editBudget, deleteBudget, getBudgetSpending, getBudgetTransactions } = useTransactions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={budgetScreenStyles.headerButton}
          onPress={() => navigation.getParent()?.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleDelete = (budget: Budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete "${budget.name}"? This will also remove the budget association from any transactions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudget(budget.id);
              Alert.alert('Success', 'Budget deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete budget. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderBudgetCard = (budget: Budget) => {
    const spending = getBudgetSpending(budget.id);
    const remaining = budget.amount - spending;
    const percentage = budget.amount > 0 ? (spending / budget.amount) * 100 : 0;
    const isOverBudget = remaining < 0;
    const recentTransactions = getBudgetTransactions(budget.id, 3);

    return (
      <View key={budget.id} style={[commonStyles.card, { backgroundColor: colors.card }]}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.rowCenter}>
            <Text style={[budgetScreenStyles.budgetIcon, { color: colors.primary }]}>{getUnicodeIcon(budget.icon)}</Text>
            <View>
              <Text style={[budgetScreenStyles.budgetName, { color: colors.text }]}>{budget.name}</Text>
              <Text style={[budgetScreenStyles.budgetAmount, { color: colors.textSecondary }]}>
                Budget: ₱{budget.amount.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={commonStyles.column}>
            <TouchableOpacity onPress={() => navigation.navigate('EditBudget', { budget })} style={budgetScreenStyles.actionButton}>
              <MaterialCommunityIcons name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(budget)} style={budgetScreenStyles.actionButton}>
              <MaterialCommunityIcons name="delete" size={18} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={budgetScreenStyles.spendingContainer}>
          <View style={commonStyles.rowBetween}>
            <Text style={[budgetScreenStyles.spendingLabel, { color: colors.textSecondary }]}>Spent:</Text>
            <Text style={[budgetScreenStyles.spendingAmount, { color: isOverBudget ? '#e74c3c' : colors.text }]}>
              ₱{spending.toFixed(2)}
            </Text>
          </View>
          <View style={commonStyles.rowBetween}>
            <Text style={[budgetScreenStyles.spendingLabel, { color: colors.textSecondary }]}>Remaining:</Text>
            <Text style={[budgetScreenStyles.remainingAmount, { color: isOverBudget ? '#e74c3c' : '#2ecc71' }]}>
              ₱{Math.abs(remaining).toFixed(2)}
              {isOverBudget && ' over'}
            </Text>
          </View>
        </View>

        <View style={budgetScreenStyles.progressBar}>
          <View 
            style={[
              budgetScreenStyles.progressFill,
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOverBudget ? '#e74c3c' : percentage > 80 ? '#f39c12' : '#2ecc71'
              }
            ]} 
          />
        </View>
        <Text style={[budgetScreenStyles.percentageText, { color: colors.textSecondary }]}>
          {percentage.toFixed(1)}% used
        </Text>

        {/* Recent Transactions Section */}
        {recentTransactions.length > 0 && (
          <View style={budgetScreenStyles.recentTransactions}>
            <Text style={[budgetScreenStyles.spendingLabel, { color: colors.textSecondary, marginBottom: 8 }]}>
              Recent Transactions
            </Text>
            {recentTransactions.map((transaction: Transaction) => (
              <View key={transaction.id} style={budgetScreenStyles.recentTransactionItem}>
                <Text style={[commonStyles.unicodeIconSmall, { color: colors.textSecondary }]}>
                  {getUnicodeIcon(transaction.categoryIcon || 'help-circle')}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[budgetScreenStyles.transactionText, { color: colors.text }]}>
                    {transaction.category}
                  </Text>
                  <Text style={[budgetScreenStyles.transactionAmount, { color: colors.textSecondary }]}>
                    -₱{transaction.amount.toFixed(2)}
                  </Text>
                </View>
                <Text style={[budgetScreenStyles.transactionDate, { color: colors.textSecondary }]}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[budgetScreenStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {budgets.length === 0 ? (
          <View style={budgetScreenStyles.emptyState}>
            <MaterialCommunityIcons name="piggy-bank" size={64} color={colors.textSecondary} />
            <Text style={[budgetScreenStyles.emptyStateText, { color: colors.textSecondary }]}>
              No budgets yet
            </Text>
            <Text style={[budgetScreenStyles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Create your first budget to start tracking your spending
            </Text>
            <TouchableOpacity
              style={[budgetScreenStyles.addBudgetButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddBudget')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={budgetScreenStyles.addBudgetButtonText}>Create Your First Budget</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[budgetScreenStyles.addBudgetButton, { backgroundColor: colors.primary, marginBottom: 16 }]}
              onPress={() => navigation.navigate('AddBudget')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={budgetScreenStyles.addBudgetButtonText}>Add New Budget</Text>
            </TouchableOpacity>
            {budgets.map(renderBudgetCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
};


import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Budget } from '../types';
import { getUnicodeIcon } from '../utils/icons';
import { commonStyles } from '../styles/screenStyles';

export const BudgetScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { budgets, editBudget, deleteBudget, getBudgetSpending } = useTransactions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 }}
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

    return (
      <View key={budget.id} style={[commonStyles.card, { backgroundColor: colors.card }]}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.rowCenter}>
            <Text style={styles.budgetIcon}>{getUnicodeIcon(budget.icon)}</Text>
            <View>
              <Text style={[styles.budgetName, { color: colors.text }]}>{budget.name}</Text>
              <Text style={[styles.budgetAmount, { color: colors.textSecondary }]}>
                Budget: ₱{budget.amount.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={commonStyles.column}>
            <TouchableOpacity onPress={() => navigation.navigate('EditBudget', { budget })} style={styles.actionButton}>
              <MaterialCommunityIcons name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(budget)} style={styles.actionButton}>
              <MaterialCommunityIcons name="delete" size={18} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spendingContainer}>
          <View style={commonStyles.rowBetween}>
            <Text style={[styles.spendingLabel, { color: colors.textSecondary }]}>Spent:</Text>
            <Text style={[styles.spendingAmount, { color: isOverBudget ? '#e74c3c' : colors.text }]}>
              ₱{spending.toFixed(2)}
            </Text>
          </View>
          <View style={commonStyles.rowBetween}>
            <Text style={[styles.spendingLabel, { color: colors.textSecondary }]}>Remaining:</Text>
            <Text style={[styles.remainingAmount, { color: isOverBudget ? '#e74c3c' : '#2ecc71' }]}>
              ₱{Math.abs(remaining).toFixed(2)}
              {isOverBudget && ' over'}
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOverBudget ? '#e74c3c' : percentage > 80 ? '#f39c12' : '#2ecc71'
              }
            ]} 
          />
        </View>
        <Text style={[styles.percentageText, { color: colors.textSecondary }]}>
          {percentage.toFixed(1)}% used
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="piggy-bank" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No budgets yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Create your first budget to start tracking your spending
            </Text>
            <TouchableOpacity
              style={[styles.addBudgetButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddBudget')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addBudgetButtonText}>Create Your First Budget</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.addBudgetButton, { backgroundColor: colors.primary, marginBottom: 16 }]}
              onPress={() => navigation.navigate('AddBudget')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addBudgetButtonText}>Add New Budget</Text>
            </TouchableOpacity>
            {budgets.map(renderBudgetCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  budgetIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  budgetAmount: {
    fontSize: 14,
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  spendingContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  spendingLabel: {
    fontSize: 12,
  },
  spendingAmount: {
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  remainingAmount: {
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%' as const,
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center' as const,
  },
  addBudgetButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addBudgetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};

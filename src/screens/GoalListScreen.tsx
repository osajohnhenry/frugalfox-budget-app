import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { commonStyles, goalListStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';
import { budgetGoalStyles as budgetGoalStyles } from '../styles/screenStyles';

export const GoalListScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { goals, deleteGoal, transactions } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={goalListStyles.headerButton}
          onPress={() => navigation.getParent()?.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteGoal = (goalId: string, goalName: string) => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goalName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goalId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getGoalTransactions = (goalId: string) => {
    return transactions.filter(t => t.goalId === goalId && t.type === 'income');
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const renderGoalItem = (goal: any) => {
    const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
    const goalTransactions = getGoalTransactions(goal.id);
    const isCompleted = goal.completed || progressPercentage >= 100;

    return (
      <View
        key={goal.id}
        style={[
          commonStyles.card,
          {
            backgroundColor: colors.card,
            marginBottom: 12,
            opacity: isCompleted ? 0.7 : 1
          }
        ]}
      >
        <View style={goalListStyles.goalInfo}>
          <View style={[
            goalListStyles.goalIconContainer,
            {
              backgroundColor: isCompleted ? '#2ecc71' : colors.primary,
            }
          ]}>
            <Text style={goalListStyles.goalIconText}>
              {getUnicodeIcon(goal.icon)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[
              commonStyles.textMedium,
              commonStyles.semiBold,
              { color: colors.text, marginBottom: 4 }
            ]}>
              {goal.name}
              {isCompleted && (
                <Text style={[goalListStyles.completedBadge, { color: '#2ecc71' }]}>
                  ✓ COMPLETED
                </Text>
              )}
            </Text>
            <Text style={[commonStyles.textSmall, { color: colors.textSecondary }]}>
              {goalTransactions.length} income transaction{goalTransactions.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={goalListStyles.goalActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditGoal', { goal })}
              style={goalListStyles.actionButton}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteGoal(goal.id, goal.name)}
              style={goalListStyles.actionButton}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={goalListStyles.progressContainer}>
          <View style={goalListStyles.progressRow}>
            <Text style={[commonStyles.textSmall, { color: colors.text }]}>
              Progress: ₱{goal.currentAmount.toFixed(2)} / ₱{goal.targetAmount.toFixed(2)}
            </Text>
            <Text style={[
              commonStyles.textSmall,
              commonStyles.semiBold,
              { color: isCompleted ? '#2ecc71' : colors.primary }
            ]}>
              {progressPercentage.toFixed(1)}%
            </Text>
          </View>
          <View style={[
            goalListStyles.progressBar,
            { backgroundColor: colors.border }
          ]}>
            <View style={[
              goalListStyles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: isCompleted ? '#2ecc71' : colors.primary,
              }
            ]} />
          </View>
        </View>

        {/* Recent Transactions */}
        {goalTransactions.length > 0 && (
          <View style={[
            goalListStyles.recentTransactions,
            {
              borderTopColor: colors.border,
            }
          ]}>
            <View style={commonStyles.rowBetween}>
              <Text style={[
                commonStyles.textSmall,
                commonStyles.semiBold,
                { color: colors.text }
              ]}>
                Recent Income
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('GoalTransactions', { goalId: goal.id, goalName: goal.name })}
                style={{ padding: 4 }}
              >
                <Text style={[{ color: colors.primary, fontSize: 12, fontWeight: '500' }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            {goalTransactions.slice(0, 1).map((transaction) => (
              <View key={transaction.id} style={goalListStyles.recentTransactionItem}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#2ecc71" style={goalListStyles.transactionIcon} />
                <Text style={[
                  commonStyles.textSmall,
                  { color: colors.text, flex: 1 }
                ]}>
                  {transaction.category}
                </Text>
                <Text style={[
                  commonStyles.textSmall,
                  commonStyles.semiBold,
                  { color: '#2ecc71' }
                ]}>
                  +₱{transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[goalListStyles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={goalListStyles.header}>
        <Text style={[budgetGoalStyles.title, { color: colors.text }]}>
          Your Goals
        </Text>
        <Text style={[commonStyles.textMedium, { color: colors.textSecondary }]}>
          Track your savings goals and progress
        </Text>
      </View>

      {/* Goals List */}
      {goals.length > 0 ? (
        <>
          <TouchableOpacity
            style={[goalListStyles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddGoal')}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" style={goalListStyles.addButtonText} />
            <Text style={goalListStyles.addButtonText}>Add New Goal</Text>
          </TouchableOpacity>
          {goals.map(renderGoalItem)}
        </>
      ) : (
        <View style={[
          commonStyles.card,
          goalListStyles.emptyState,
          {
            backgroundColor: colors.card,
          }
        ]}>
          <MaterialCommunityIcons name="target" size={48} color={colors.textSecondary} style={goalListStyles.emptyIcon} />
          <Text style={[
            commonStyles.textMedium,
            commonStyles.semiBold,
            goalListStyles.emptyTitle,
            { color: colors.text }
          ]}>
            No Goals Yet
          </Text>
          <Text style={[
            commonStyles.textSmall,
            goalListStyles.emptyText,
            { color: colors.textSecondary }
          ]}>
            Create your first goal to start tracking your savings progress. Link income transactions to goals to see them grow!
          </Text>
          <TouchableOpacity
            style={[goalListStyles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddGoal')}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#fff" style={goalListStyles.createButtonText} />
            <Text style={goalListStyles.createButtonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};


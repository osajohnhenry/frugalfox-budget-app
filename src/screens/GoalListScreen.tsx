import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';

export const GoalListScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { goals, deleteGoal, transactions } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: isCompleted ? '#2ecc71' : colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16
          }}>
            <Text style={{ fontSize: 24, color: '#fff' }}>
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
                <Text style={{ color: '#2ecc71', fontSize: 12, marginLeft: 8 }}>
                  ✓ COMPLETED
                </Text>
              )}
            </Text>
            <Text style={[commonStyles.textSmall, { color: colors.textSecondary }]}>
              {goalTransactions.length} income transaction{goalTransactions.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditGoal', { goal })}
              style={{ padding: 8 }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteGoal(goal.id, goal.name)}
              style={{ padding: 8 }}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{ marginBottom: 8 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8
          }}>
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
          <View style={{
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <View style={{
              height: '100%',
              width: `${progressPercentage}%`,
              backgroundColor: isCompleted ? '#2ecc71' : colors.primary,
              borderRadius: 4
            }} />
          </View>
        </View>

        {/* Recent Transactions */}
        {goalTransactions.length > 0 && (
          <View style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 12,
            marginTop: 8
          }}>
            <Text style={[
              commonStyles.textSmall,
              commonStyles.semiBold,
              { color: colors.text, marginBottom: 8 }
            ]}>
              Recent Income
            </Text>
            {goalTransactions.slice(0, 3).map((transaction) => (
              <View key={transaction.id} style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6
              }}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#2ecc71" style={{ marginRight: 8 }} />
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
            {goalTransactions.length > 3 && (
              <Text style={[
                commonStyles.textSmall,
                { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }
              ]}>
                +{goalTransactions.length - 3} more...
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[commonStyles.textLarge, commonStyles.semiBold, { color: colors.text }]}>
          Your Goals
        </Text>
        <Text style={[commonStyles.textMedium, { color: colors.textSecondary }]}>
          Track your savings goals
        </Text>
      </View>

      {/* Goals List */}
      {goals.length > 0 ? (
        <>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
              marginBottom: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }}
            onPress={() => navigation.navigate('AddGoal')}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add New Goal</Text>
          </TouchableOpacity>
          {goals.map(renderGoalItem)}
        </>
      ) : (
        <View style={[
          commonStyles.card,
          {
            backgroundColor: colors.card,
            alignItems: 'center',
            paddingVertical: 40
          }
        ]}>
          <MaterialCommunityIcons name="target" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
          <Text style={[
            commonStyles.textMedium,
            commonStyles.semiBold,
            { color: colors.text, marginBottom: 8 }
          ]}>
            No Goals Yet
          </Text>
          <Text style={[
            commonStyles.textSmall,
            { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32 }
          ]}>
            Create your first goal to start tracking your savings progress. Link income transactions to goals to see them grow!
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 20
            }}
            onPress={() => navigation.navigate('AddGoal')}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = {
  headerButton: {
    padding: 8,
  },
  header: {
    marginBottom: 24,
  },
};

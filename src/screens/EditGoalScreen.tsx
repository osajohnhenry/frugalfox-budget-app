import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Goal } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addTransactionStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';

type Props = NativeStackScreenProps<any, 'EditGoal'>;

export const EditGoalScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const goal = route.params.goal as Goal;
  const { editGoal, deleteGoal } = useTransactions();
  const [name, setName] = useState(goal.name);
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount.toString());
  const [icon, setIcon] = useState(goal.icon);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const availableIcons = [
    'target', 'piggy-bank', 'cash', 'wallet', 'bank', 'home', 'car', 'airplane', 
    'gift', 'shopping', 'phone', 'laptop', 'book', 'music', 'gamepad', 'food',
    'heart', 'star', 'trophy', 'diamond', 'crown', 'medal', 'umbrella', 'camera'
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Goal',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
      headerRight: () => (
        <TouchableOpacity 
          style={{ padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 }}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="trash-can" size={20} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(targetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Invalid Name', 'Please enter a goal name.');
      return;
    }

    setIsSaving(true);
    const success = await editGoal(goal.id, {
      name: name.trim(),
      targetAmount: parsedAmount,
      currentAmount: goal.currentAmount,
      icon,
      createdAt: goal.createdAt,
      completed: goal.completed,
    });
    setIsSaving(false);

    if (success) {
      Alert.alert('Success', 'Goal updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const success = await deleteGoal(goal.id);
            setIsDeleting(false);
            if (success) {
              Alert.alert('Success', 'Goal deleted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
            }
          }
        },
      ]
    );
  };

  const getProgressPercentage = () => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 70 }}
      >
      {/* Goal Summary Card */}
      <View style={[commonStyles.card, commonStyles.marginLarge, { 
        backgroundColor: goal.completed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)',
        borderLeftWidth: 4,
        borderLeftColor: goal.completed ? '#2ecc71' : colors.primary
      }]}>
        <View style={commonStyles.rowBetween}>
          <View style={{ flex: 1 }}>
            <View style={commonStyles.rowCenter}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: goal.completed ? '#2ecc71' : colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Text style={{ fontSize: 20, color: '#fff' }}>
                  {getUnicodeIcon(icon)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: goal.completed ? '#2ecc71' : colors.primary,
                  marginBottom: 4
                }}>
                  {goal.name}
                  {goal.completed && (
                    <Text style={{ color: '#2ecc71', fontSize: 12, marginLeft: 8 }}>
                      ✓ COMPLETED
                    </Text>
                  )}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                  Created: {new Date(goal.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View style={{ marginTop: 12 }}>
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
                  { color: goal.completed ? '#2ecc71' : colors.primary }
                ]}>
                  {getProgressPercentage().toFixed(1)}%
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
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: goal.completed ? '#2ecc71' : colors.primary,
                  borderRadius: 4
                }} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Form Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card }, commonStyles.marginLarge]}>
        <View style={commonStyles.rowCenter}>
          <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[commonStyles.textLarge, commonStyles.semiBold, { color: colors.text }]}>
            Edit Goal
          </Text>
        </View>

        {/* Goal Name Input */}
        <View style={{ marginTop: 16 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 8 }]}>
            Goal Name
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1.5,
              borderRadius: 12,
              fontSize: 16,
              color: colors.text
            }]}
            placeholder="Enter goal name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            selectionColor={colors.primary}
          />
        </View>

        {/* Target Amount Input */}
        <View style={{ marginTop: 16 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 8 }]}>
            Target Amount
          </Text>
          <View style={[styles.amountContainer, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1.5,
            borderRadius: 12
          }]}>
            <Text style={[styles.currencySymbol, { color: colors.primary, fontSize: 20, fontWeight: 'bold' }]}>₱</Text>
            <TextInput
              style={[styles.amountInput, { flex: 1, fontSize: 18, fontWeight: '500', color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
              selectionColor={colors.primary}
            />
          </View>
        </View>

        {/* Icon Selection */}
        <View style={{ marginTop: 16 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 8 }]}>
            Icon
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -4 }}
          >
            {availableIcons.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                style={[
                  {
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                    borderRadius: 8,
                    backgroundColor: icon === iconName ? colors.primary : colors.card,
                    borderColor: icon === iconName ? colors.primary : colors.border,
                    borderWidth: 2
                  }
                ]}
                onPress={() => setIcon(iconName)}
              >
                <Text style={[
                  { fontSize: 24 },
                  { color: icon === iconName ? '#fff' : colors.text }
                ]}>
                  {getUnicodeIcon(iconName)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, margin: 16, marginTop: -20, marginBottom: 32, padding: 20 }]}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            style={{
              backgroundColor: isSaving ? '#95a5a6' : colors.primary, 
              paddingVertical: 16, 
              paddingHorizontal: 24, 
              borderRadius: 12, 
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              shadowColor: colors.border,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }} 
            onPress={handleSave}
            disabled={isSaving || isDeleting}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{
              backgroundColor: colors.border,
              paddingVertical: 16, 
              paddingHorizontal: 24, 
              borderRadius: 12, 
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.border
            }} 
            onPress={() => navigation.goBack()}
            disabled={isSaving || isDeleting}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

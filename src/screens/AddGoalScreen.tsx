import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { commonStyles, budgetGoalStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';

const GOAL_ICONS = [
  'target', 'trophy', 'star', 'heart', 'home', 'car', 'plane', 'gift',
  'school', 'briefcase', 'bank', 'piggy-bank', 'treasure-chest', 'diamond',
  'rocket', 'emoticon-happy', 'party-popper', 'medal', 'crown', 'flag'
];

export const AddGoalScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addGoal } = useTransactions();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [isSaving, setIsSaving] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Goal',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
      headerRight: () => (
        <TouchableOpacity 
          style={budgetGoalStyles.headerButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
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

    const goalName = name.trim();
    if (!goalName) {
      Alert.alert('Missing Name', 'Please enter a goal name.');
      return;
    }

    setIsSaving(true);
    try {
      await addGoal({
        name: goalName,
        targetAmount: parsedAmount,
        currentAmount: 0,
        icon: selectedIcon,
        createdAt: new Date().toISOString(),
        completed: false,
      });
      Alert.alert('Success', 'Goal created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderIconGrid = () => (
    <View style={styles.iconGrid}>
      {GOAL_ICONS.map((icon) => (
        <TouchableOpacity
          key={icon}
          style={[
            styles.iconItem,
            { 
              backgroundColor: selectedIcon === icon ? colors.primary : colors.card,
              borderColor: selectedIcon === icon ? colors.primary : colors.border
            }
          ]}
          onPress={() => setSelectedIcon(icon)}
        >
          <Text style={styles.iconItemText}>{getUnicodeIcon(icon)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colors.background }}
      >
        {/* Single Card Container */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, padding: 20 }]}>
          {/* Goal Name Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
              Goal Name
            </Text>
            <TextInput
              style={[
                budgetGoalStyles.inputField,
                {
                  backgroundColor: colors.card,
                  borderColor: nameFocused ? colors.primary : colors.border,
                  color: colors.text
                }
              ]}
              placeholder="Enter goal name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              selectionColor={colors.primary}
            />
          </View>

          {/* Target Amount Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
              Target Amount
            </Text>
            <View style={[
              budgetGoalStyles.amountContainer,
              {
                backgroundColor: colors.card,
                borderColor: amountFocused ? colors.primary : colors.border,
              }
            ]}>
              <Text style={[budgetGoalStyles.currencySymbol, { color: colors.primary }]}>₱</Text>
              <TextInput
                style={[budgetGoalStyles.amountInput, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                selectionColor={colors.primary}
              />
            </View>
          </View>

          {/* Icon Selection */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 16 }]}>
              Select Icon
            </Text>
            <View style={budgetGoalStyles.selectedIconContainer}>
              <Text style={budgetGoalStyles.selectedIconText}>{getUnicodeIcon(selectedIcon)}</Text>
              <Text style={[budgetGoalStyles.selectedIconLabel, { color: colors.text }]}>
                {selectedIcon.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
            {renderIconGrid()}
          </View>

          {/* Info Card */}
          <View style={[budgetGoalStyles.infoCard, { backgroundColor: 'rgba(46, 204, 113, 0.1)', marginBottom: 24 }]}>
            <MaterialCommunityIcons name="information" size={20} color="#2ecc71" style={budgetGoalStyles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[budgetGoalStyles.infoTitle, { color: '#2ecc71' }]}>
                How Goals Work
              </Text>
              <Text style={[budgetGoalStyles.infoText, { color: '#27ae60' }]}>
                Link income transactions to this goal to track progress. Your goal will be marked as completed when the total linked income reaches your target amount.
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              budgetGoalStyles.saveButton,
              {
                backgroundColor: isSaving ? colors.textSecondary : colors.primary,
              }
            ]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <MaterialCommunityIcons name="loading" size={20} color="#fff" style={budgetGoalStyles.saveButtonText} />
                <Text style={budgetGoalStyles.saveButtonText}>Creating...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" style={budgetGoalStyles.saveButtonText} />
                <Text style={budgetGoalStyles.saveButtonText}>Create Goal</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  iconGrid: budgetGoalStyles.iconGrid,
  iconItem: budgetGoalStyles.iconItem,
  iconItemText: budgetGoalStyles.iconItemText,
};

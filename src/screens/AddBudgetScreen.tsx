import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { commonStyles, budgetGoalStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';

const BUDGET_ICONS = [
  'food-apple', 'truck-delivery', 'shopping', 'cash', 'gift', 'briefcase',
  'wallet', 'account-group', 'heart-pulse', 'school', 'cake', 'cart',
  'car', 'home', 'phone', 'laptop', 'book', 'music', 'movie', 'gamepad',
  'piggy-bank', 'safe', 'treasure-chest', 'hand-coin'
];

export const AddBudgetScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addBudget } = useTransactions();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('piggy-bank');
  const [isSaving, setIsSaving] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Budget',
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
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    const budgetName = name.trim();
    if (!budgetName) {
      Alert.alert('Missing Name', 'Please enter a budget name.');
      return;
    }

    setIsSaving(true);
    try {
      await addBudget({
        name: budgetName,
        amount: parsedAmount,
        icon: selectedIcon,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Budget created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderIconGrid = () => (
    <View style={styles.iconGrid}>
      {BUDGET_ICONS.map((icon) => (
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
        {/* Budget Name Input */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Budget Name
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
            placeholder="Enter budget name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            selectionColor={colors.primary}
          />
        </View>

        {/* Budget Amount Input */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Budget Amount
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
              value={amount}
              onChangeText={setAmount}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              selectionColor={colors.primary}
            />
          </View>
        </View>

        {/* Icon Selection */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
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

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            budgetGoalStyles.saveButton,
            {
              backgroundColor: isSaving ? '#95a5a6' : colors.primary,
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
              <Text style={budgetGoalStyles.saveButtonText}>Create Budget</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  iconGrid: budgetGoalStyles.iconGrid,
  iconItem: budgetGoalStyles.iconItem,
  iconItemText: budgetGoalStyles.iconItemText,
};

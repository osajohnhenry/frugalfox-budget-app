import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addTransactionStyles as styles, commonStyles, budgetGoalStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';
import { DatePicker } from '../components/DatePicker';


export const AddTransactionScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Transaction',
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
  const { addTransaction, categories, budgets, goals } = useTransactions();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  
  useEffect(() => {
    // Reset category, budget, and goal when type changes
    setCategory('');
    setBudgetId('');
    setGoalId('');
  }, [type]);


  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    const categoryName = category.trim();
    const categoryItem = categories[type].find((item) => item.name === categoryName);
    if (!categoryName || !categoryItem) {
      Alert.alert('Missing Category', 'Please select a valid category for the selected transaction type.');
      return;
    }

    setIsSaving(true);
    try {
      await addTransaction({
        amount: parsedAmount,
        type,
        category: categoryName,
        categoryIcon: categoryItem.icon,
        note: note.trim(),
        date: selectedDate.toISOString(),
        budgetId: budgetId || undefined,
        goalId: goalId || undefined,
      });
      Alert.alert('Success', 'Transaction added successfully!', [
        { text: 'OK', onPress: () => {
          setAmount('');
          setCategory('');
          setNote('');
          setBudgetId('');
          setGoalId('');
          setSelectedDate(new Date());
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
          {/* Type Toggle */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 12 }]}>Transaction Type</Text>
            <View style={{ flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 4 }}>
            <TouchableOpacity 
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: type === 'expense' ? '#e74c3c' : 'transparent',
                alignItems: 'center'
              }} 
              onPress={() => { setType('expense'); setDropdownOpen(false); }}
            >
              <MaterialCommunityIcons 
                name="trending-down" 
                size={20} 
                color={type === 'expense' ? '#fff' : colors.textSecondary} 
                style={{ marginRight: 8 }}
              />
              <Text style={{ 
                color: type === 'expense' ? '#fff' : colors.textSecondary, 
                fontWeight: '600',
                fontSize: 16
              }}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: type === 'income' ? '#2ecc71' : 'transparent',
                alignItems: 'center'
              }} 
              onPress={() => { setType('income'); setDropdownOpen(false); }}
            >
              <MaterialCommunityIcons 
                name="trending-up" 
                size={20} 
                color={type === 'income' ? '#fff' : colors.textSecondary} 
                style={{ marginRight: 8 }}
              />
              <Text style={{ 
                color: type === 'income' ? '#fff' : colors.textSecondary, 
                fontWeight: '600',
                fontSize: 16
              }}>
                Income
              </Text>
            </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker */}
          <View style={{ marginBottom: 20 }}>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              label="Date"
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>Amount</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderColor: amountFocused ? colors.primary : colors.border,
              borderWidth: 1.5,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 4
            }}>
              <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold', marginRight: 8 }}>₱</Text>
              <TextInput
                style={{ flex: 1, fontSize: 18, fontWeight: '500', color: colors.text }}
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

          {/* Category Dropdown */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>Category</Text>
            <TouchableOpacity 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: colors.card,
                borderColor: dropdownOpen ? colors.primary : colors.border,
                borderWidth: 1.5,
                borderRadius: 12
              }} 
              onPress={() => setDropdownOpen((prev) => !prev)}
            >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {category && (
                <Text style={[commonStyles.unicodeIconLarge, { marginRight: 8, color: type === 'income' ? '#2ecc71' : '#e74c3c' }]}>
                  {getUnicodeIcon(categories[type].find(c => c.name === category)?.icon || 'help-circle')}
                </Text>
              )}
              <Text style={{ color: category ? colors.text : colors.textSecondary, fontSize: 16, fontWeight: '500' }}>
                {category || 'Choose a category'}
              </Text>
            </View>
            <MaterialCommunityIcons 
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.primary} 
            />
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={{ 
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                marginTop: 4,
                backgroundColor: colors.card
              }}>
                {categories[type].length > 0 ? (
                  categories[type].map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      onPress={() => {
                        setCategory(item.name);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text style={[commonStyles.unicodeIconLarge, { marginRight: 12, color: type === 'income' ? '#2ecc71' : '#e74c3c' }]}>
                        {getUnicodeIcon(item.icon)}
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.text }}>{item.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ padding: 16, color: colors.textSecondary, textAlign: 'center' }}>
                    No categories found for {type}. Add categories in the Categories screen.
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Budget Dropdown (only for expenses) */}
          {type === 'expense' && (
            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>Budget (optional)</Text>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: colors.card,
                  borderColor: budgetDropdownOpen ? colors.primary : colors.border,
                  borderWidth: 1.5,
                  borderRadius: 12
                }} 
                onPress={() => setBudgetDropdownOpen((prev) => !prev)}
              >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {budgetId && (
                  <Text style={[commonStyles.unicodeIconLarge, { marginRight: 8, color: colors.primary }]}>
                    {getUnicodeIcon(budgets.find(b => b.id === budgetId)?.icon || 'piggy-bank')}
                  </Text>
                )}
                <Text style={{ color: budgetId ? colors.text : colors.textSecondary, fontSize: 16, fontWeight: '500' }}>
                  {budgetId ? budgets.find(b => b.id === budgetId)?.name || 'Select budget' : 'Choose a budget (optional)'}
                </Text>
              </View>
              <MaterialCommunityIcons 
                name={budgetDropdownOpen ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
            {budgetDropdownOpen && (
              <View style={{ 
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                marginTop: 4,
                backgroundColor: colors.card
              }}>
                <TouchableOpacity
                  key="no-budget"
                  style={{ 
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}
                  onPress={() => {
                    setBudgetId('');
                    setBudgetDropdownOpen(false);
                  }}
                >
                  <MaterialCommunityIcons name="minus-circle-outline" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 16, color: colors.textSecondary }}>No budget</Text>
                </TouchableOpacity>
                {budgets.length > 0 ? (
                  budgets.map((budget) => (
                    <TouchableOpacity
                      key={budget.id}
                      style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      onPress={() => {
                        setBudgetId(budget.id);
                        setBudgetDropdownOpen(false);
                      }}
                    >
                      <Text style={[commonStyles.unicodeIconLarge, { marginRight: 12, color: colors.primary }]}>
                        {getUnicodeIcon(budget.icon)}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, color: colors.text }}>{budget.name}</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          Budget: ₱{budget.amount.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ padding: 16, color: colors.textSecondary, textAlign: 'center' }}>
                    No budgets found. Create budgets in the Budgets screen.
                  </Text>
                )}
              </View>
            )}
            </View>
          )}

          {/* Goal Dropdown (only for income) */}
          {type === 'income' && (
            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>Goal (optional)</Text>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: colors.card,
                  borderColor: goalDropdownOpen ? colors.primary : colors.border,
                  borderWidth: 1.5,
                  borderRadius: 12
                }} 
                onPress={() => setGoalDropdownOpen((prev) => !prev)}
              >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {goalId && (
                  <Text style={[commonStyles.unicodeIconLarge, { marginRight: 8, color: '#2ecc71' }]}>
                    {getUnicodeIcon(goals.find(g => g.id === goalId)?.icon || 'target')}
                  </Text>
                )}
                <Text style={{ color: goalId ? colors.text : colors.textSecondary, fontSize: 16, fontWeight: '500' }}>
                  {goalId ? goals.find(g => g.id === goalId)?.name || 'Select goal' : 'Choose a goal (optional)'}
                </Text>
              </View>
              <MaterialCommunityIcons 
                name={goalDropdownOpen ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
            {goalDropdownOpen && (
              <View style={{ 
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                marginTop: 4,
                backgroundColor: colors.card
              }}>
                <TouchableOpacity
                  key="no-goal"
                  style={{ 
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}
                  onPress={() => {
                    setGoalId('');
                    setGoalDropdownOpen(false);
                  }}
                >
                  <MaterialCommunityIcons name="minus-circle-outline" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 16, color: colors.textSecondary }}>No goal</Text>
                </TouchableOpacity>
                {goals.length > 0 ? (
                  goals.map((goal) => (
                    <TouchableOpacity
                      key={goal.id}
                      style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      onPress={() => {
                        setGoalId(goal.id);
                        setGoalDropdownOpen(false);
                      }}
                    >
                      <Text style={[commonStyles.unicodeIconLarge, { marginRight: 12, color: '#2ecc71' }]}>
                        {getUnicodeIcon(goal.icon)}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, color: colors.text }}>{goal.name}</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          Target: ₱{goal.targetAmount.toFixed(2)} | Progress: ₱{goal.currentAmount.toFixed(2)}
                        </Text>
                      </View>
                      {goal.completed && (
                        <MaterialCommunityIcons name="check-circle" size={16} color="#2ecc71" />
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ padding: 16, color: colors.textSecondary, textAlign: 'center' }}>
                    No goals found. Create goals in the Goals screen.
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

          {/* Note Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>Note (optional)</Text>
            <TextInput
              style={{
                backgroundColor: colors.card,
                borderColor: noteFocused ? colors.primary : colors.border,
                borderWidth: 1.5,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.text
              }}
              placeholder="Add a note..."
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={setNote}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
              selectionColor={colors.primary}
              multiline
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={{
              backgroundColor: isSaving ? colors.textSecondary : colors.primary, 
              paddingVertical: 16, 
              paddingHorizontal: 24, 
              borderRadius: 12, 
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <MaterialCommunityIcons name="loading" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Saving...</Text>
              </>
            ) : (
              <>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


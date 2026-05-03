import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addTransactionStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';


export const AddTransactionScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addTransaction, categories } = useTransactions();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={20} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  useEffect(() => {
    // Reset category when type changes
    setCategory('');
  }, [type]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

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
      });
      Alert.alert('Success', 'Transaction added successfully!', [
        { text: 'OK', onPress: () => {
          setAmount('');
          setCategory('');
          setNote('');
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
        {/* Enhanced Type Toggle Card */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
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

        {/* Enhanced Date Picker */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Date
          </Text>
          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1.5,
              borderRadius: 12
            }} 
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text, fontWeight: '500', fontSize: 16 }}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onValueChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Enhanced Amount Input */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Amount
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderColor: colors.border,
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

        {/* Enhanced Category Dropdown */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Category
          </Text>
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

        {/* Enhanced Note Input */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Note (optional)
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
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

        {/* Enhanced Manage Categories Button */}
        <TouchableOpacity 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#4a90e2',
            borderRadius: 8,
            backgroundColor: 'rgba(74, 144, 226, 0.05)'
          }} 
          onPress={() => navigation.navigate('Categories')}
        >
          <MaterialCommunityIcons name="cog" size={18} color="#4a90e2" style={{ marginRight: 8 }} />
          <Text style={{ color: '#4a90e2', fontSize: 14, fontWeight: '600' }}>Manage Categories</Text>
        </TouchableOpacity>

        {/* Enhanced Save Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: isSaving ? '#95a5a6' : '#4a90e2', 
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
              <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add Transaction</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


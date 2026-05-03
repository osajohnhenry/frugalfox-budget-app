import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addTransactionStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';


type Props = NativeStackScreenProps<any, 'EditTransaction'>;

export const EditTransactionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const transaction = route.params.transaction as Transaction;
  const { editTransaction, deleteTransaction, categories } = useTransactions();
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [note, setNote] = useState(transaction.note);
  const [date, setDate] = useState(new Date(transaction.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Transaction',
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    const categoryItem = categories[type].find((item) => item.name === category);
    if (!categoryItem) {
      Alert.alert('Invalid Category', 'Please select a valid category.');
      return;
    }

    setIsSaving(true);
    const success = await editTransaction(transaction.id, {
      amount: parsedAmount,
      type,
      category,
      categoryIcon: categoryItem.icon,
      note: note.trim(),
      date: date.toISOString(),
    });
    setIsSaving(false);

    if (success) {
      Alert.alert('Success', 'Transaction updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', 'Failed to update transaction. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete this ${type} transaction of ₱${amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const success = await deleteTransaction(transaction.id);
            setIsDeleting(false);
            if (success) {
              Alert.alert('Success', 'Transaction deleted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'Failed to delete transaction. Please try again.');
            }
          }
        },
      ]
    );
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
      {/* Enhanced Transaction Summary Card */}
      <View style={[commonStyles.card, commonStyles.marginLarge, { 
        backgroundColor: type === 'income' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
        borderLeftWidth: 4,
        borderLeftColor: type === 'income' ? '#2ecc71' : '#e74c3c'
      }]}>
        <View style={commonStyles.rowBetween}>
          <View style={{ flex: 1 }}>
            <View style={commonStyles.rowCenter}>
              <MaterialCommunityIcons 
                name={type === 'income' ? 'trending-up' : 'trending-down'} 
                size={24} 
                color={type === 'income' ? '#2ecc71' : '#e74c3c'} 
                style={{ marginRight: 8 }}
              />
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                color: type === 'income' ? '#2ecc71' : '#e74c3c',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                {type === 'income' ? 'Income' : 'Expense'}
              </Text>
            </View>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: type === 'income' ? '#2ecc71' : '#e74c3c',
              marginTop: 8
            }}>
              ₱{parseFloat(amount || '0').toFixed(2)}
            </Text>
            <View style={commonStyles.rowCenter}>
              <Text style={{ 
                fontSize: 18, 
                marginRight: 8,
                color: colors.textSecondary
              }}>
                {getUnicodeIcon((categories[type].find(c => c.name === category)?.icon || 'help-circle'))}
              </Text>
              <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                {category}
              </Text>
            </View>
            {note && (
              <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, fontStyle: 'italic' }}>
                "{note}"
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Enhanced Form Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card }, commonStyles.marginLarge]}>
        <View style={commonStyles.rowCenter}>
          <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[commonStyles.textLarge, commonStyles.semiBold, { color: colors.text }]}>
            Edit Transaction
          </Text>
        </View>

        {/* Date Picker */}
        <View style={{ marginTop: 0 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 4 }]}>
            Date
          </Text>
          <TouchableOpacity 
            style={[styles.datePicker, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1.5
            }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} style={styles.dateIcon} />
            <Text style={[styles.dateText, { color: colors.text, fontWeight: '500' }]}>
              {date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onValueChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Amount Input */}
        <View style={{ marginTop: 0 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 4 }]}>
            Amount
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
              value={amount}
              onChangeText={setAmount}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              selectionColor={colors.primary}
            />
          </View>
        </View>

        {/* Category Dropdown */}
        <View style={{ marginTop: 0 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 4 }]}>
            Category
          </Text>
          <TouchableOpacity 
            style={[styles.dropdown, { 
              backgroundColor: colors.card,
              borderColor: dropdownOpen ? colors.primary : colors.border,
              borderWidth: 1.5,
              borderRadius: 12
            }]} 
            onPress={() => setDropdownOpen((prev) => !prev)}
          >
            <View style={commonStyles.rowCenter}>
              {category && (
                <Text style={[commonStyles.unicodeIconLarge, { marginRight: 8, color: type === 'income' ? '#2ecc71' : '#e74c3c' }]}>
                  {getUnicodeIcon(categories[type].find(c => c.name === category)?.icon || 'help-circle')}
                </Text>
              )}
              <Text style={[styles.dropdownText, !category && styles.placeholderText, { flex: 1, color: category ? colors.text : colors.textSecondary }]}>
                {category || 'Choose a category'}
              </Text>
              <MaterialCommunityIcons 
                name={dropdownOpen ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={[styles.dropdownList, { 
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              marginTop: 4,
              backgroundColor: colors.card
            }]}>
              {categories[type].length > 0 ? (
                categories[type].map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={[styles.dropdownItem, { 
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border
                    }]}
                    onPress={() => {
                      setCategory(item.name);
                      setDropdownOpen(false);
                    }}
                  >
                    <View style={commonStyles.rowCenter}>
                      <Text style={[commonStyles.unicodeIconLarge, { marginRight: 12, color: type === 'income' ? '#2ecc71' : '#e74c3c' }]}>
                        {getUnicodeIcon(item.icon)}
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.text }}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={[styles.emptyCategoryText, { color: colors.textSecondary }]}>No categories found for {type}. Add categories in the Categories screen.</Text>
              )}
            </View>
          )}
        </View>

        {/* Note Input */}
        <View style={{ marginTop: 0 }}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 4 }]}>
            Note (optional)
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1.5,
              borderRadius: 12,
              fontSize: 16,
              minHeight: 80,
              color: colors.text
            }]}
            placeholder="Add a note..."
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            onFocus={() => setNoteFocused(true)}
            onBlur={() => setNoteFocused(false)}
            selectionColor={colors.primary}
          />
        </View>
      </View>

      {/* Enhanced Buttons Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, margin: 16, marginTop: -20, marginBottom: 32, padding: 20 }]}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            style={{
              backgroundColor: isSaving ? '#95a5a6' : '#2ecc71', 
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

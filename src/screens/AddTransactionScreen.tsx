import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addTransactionStyles as styles } from '../styles/screenStyles';


export const AddTransactionScreen: React.FC<any> = ({ navigation }) => {
  const { addTransaction, categories } = useTransactions();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const selected = categories[type].find((item) => item.name === category);
    if (!selected) {
      setCategory(categories[type][0]?.name ?? '');
    }
  }, [type, categories]);

  const handleSave = () => {
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

    addTransaction({
      amount: parsedAmount,
      type,
      category: categoryName,
      categoryIcon: categoryItem.icon,
      note: note.trim(),
    });
    setAmount('');
    setCategory('');
    setNote('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.typeToggle}>
          <TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.activeType]} onPress={() => { setType('expense'); setDropdownOpen(false); }}>
            <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.activeType]} onPress={() => { setType('income'); setDropdownOpen(false); }}>
            <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>Income</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Amount (e.g., 50.00)" keyboardType="numeric" value={amount} onChangeText={setAmount} />

        <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen((prev) => !prev)}>
          <Text style={styles.dropdownText}>{category || `Select ${type === 'expense' ? 'Expense' : 'Income'} category`}</Text>
          <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {categories[type].length > 0 ? (
              categories[type].map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCategory(item.name);
                    setDropdownOpen(false);
                  }}
                >
                  <View style={styles.dropdownItemRow}>
                    <MaterialCommunityIcons name={item.icon} size={18} color="#555" style={styles.dropdownItemIcon} />
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyCategoryText}>No categories found for {type}. Add categories in the Categories screen.</Text>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.manageButtonText}>Manage Categories</Text>
        </TouchableOpacity>

        <TextInput style={[styles.input, styles.textArea]} placeholder="Note (optional)" value={note} onChangeText={setNote} multiline />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


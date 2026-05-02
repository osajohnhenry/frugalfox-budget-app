import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { TransactionType } from '../types';
import { categoriesStyles as styles } from '../styles/screenStyles';

const iconOptions = [
  'food-apple',
  'truck-delivery',
  'shopping',
  'cash',
  'gift',
  'briefcase',
  'wallet',
  'account-group',
  'heart-pulse',
  'school',
  'cake',
  'cart',
];

export const CategoriesScreen: React.FC<any> = ({ navigation }) => {
  const { categories, addCategory } = useTransactions();
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleAddCategory = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }

    const success = addCategory(type, trimmed, selectedIcon);
    if (!success) {
      Alert.alert(
        'Duplicate Category',
        `The category "${trimmed}" already exists for ${type === 'expense' ? 'expense' : 'income'} or conflicts with the other type.`
      );
      return;
    }

    setCategoryName('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose Type</Text>
      <View style={styles.typeToggle}>
        <TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.activeType]} onPress={() => setType('expense')}>
          <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.activeType]} onPress={() => setType('income')}>
          <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>Income</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={`New ${type === 'expense' ? 'Expense' : 'Income'} Category`}
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <Text style={styles.sectionTitle}>Choose Icon</Text>
      <View style={styles.iconGrid}>
        {iconOptions.map((icon) => (
          <TouchableOpacity
            key={icon}
            style={[styles.iconOption, selectedIcon === icon && styles.iconOptionSelected]}
            onPress={() => setSelectedIcon(icon)}
          >
            <MaterialCommunityIcons name={icon} size={24} color={selectedIcon === icon ? '#fff' : '#555'} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={() => { handleAddCategory(); setCategoryName(''); }}>
        <Text style={styles.addBtnText}>Add Category</Text>
      </TouchableOpacity>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Expense Categories</Text>
        {categories.expense.length ? (
          categories.expense.map((item) => (
            <View key={item.name} style={styles.categoryItemRow}>
              <MaterialCommunityIcons name={item.icon} size={20} color="#4a90e2" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No expense categories yet.</Text>
        )}
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Income Categories</Text>
        {categories.income.length ? (
          categories.income.map((item) => (
            <View key={item.name} style={styles.categoryItemRow}>
              <MaterialCommunityIcons name={item.icon} size={20} color="#2ecc71" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No income categories yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};



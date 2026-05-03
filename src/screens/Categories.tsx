import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { TransactionType } from '../types';
import { categoriesStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';


export const CategoriesScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { categories, deleteCategory } = useTransactions();
  const [type, setType] = useState<TransactionType>('expense');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const openAddModal = () => {
    navigation.navigate('AddCategory', { transactionType: type });
  };

  const openEditModal = (category: { name: string; icon: string }) => {
    navigation.navigate('EditCategory', { 
      transactionType: type, 
      categoryName: category.name,
      icon: category.icon
    });
  };

  const handleDeleteCategory = (item: { name: string; icon: string }) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          const success = deleteCategory(type, item.name);
          if (success) {
            Alert.alert('Success', 'Category deleted successfully!');
          } else {
            Alert.alert('Error', 'Failed to delete category.');
          }
        }},
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, paddingBottom: 80 }]}>
      <Text style={[styles.title, { color: colors.text }]}>Manage Categories</Text>
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
            onPress={() => setType('expense')}
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
            onPress={() => setType('income')}
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

      <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={openAddModal}>
        <Text style={styles.addBtnText}>Add Category</Text>
      </TouchableOpacity>

      <View style={[styles.listSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{type === 'expense' ? 'Expense Categories' : 'Income Categories'}</Text>
        {categories[type].length ? (
          categories[type].map((item) => (
            <View key={item.name} style={[styles.categoryItemRow, { backgroundColor: colors.card }]}>
              <Text style={[commonStyles.unicodeIconLarge, type === 'expense' ? commonStyles.expenseColor : commonStyles.incomeColor]}>{getUnicodeIcon(item.icon)}</Text>
              <Text style={[styles.categoryText, { color: colors.text }]}>{item.name}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
                <MaterialCommunityIcons 
                  name="pencil" 
                  size={18} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteCategory(item)}>
                <MaterialCommunityIcons name="delete" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No {type} categories yet.</Text>
        )}
      </View>
    </ScrollView>

    <TouchableOpacity style={[commonStyles.fab, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('Add')}>
      <Text style={commonStyles.fabText}>+</Text>
    </TouchableOpacity>
    </View>
  );
};



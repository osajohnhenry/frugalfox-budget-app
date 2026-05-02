import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
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
  'car',
  'home',
  'phone',
  'laptop',
  'book',
  'music',
  'movie',
  'gamepad-variant',
  'airplane',
  'bus',
  'train',
  'taxi',
  'gas-station',
  'hospital',
  'pharmacy',
  'bank',
  'store',
  'coffee',
  'pizza',
  'hamburger',
  'ice-cream',
  'beer',
  'wine',
  'cigarette',
  'camera',
  'headphones',
  'watch',
  'shoe-heel',
  'tshirt-crew',
  'umbrella',
  'key',
  'lock',
  'lightbulb',
  'water',
  'fire',
  'leaf',
  'flower',
  'tree',
  'paw',
];

export const CategoriesScreen: React.FC<any> = ({ navigation }) => {
  const { categories, addCategory, editCategory, deleteCategory } = useTransactions();
  const [type, setType] = useState<TransactionType>('expense');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ name: string; icon: string } | null>(null);
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

  const openAddModal = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setCategoryName('');
    setSelectedIcon(iconOptions[0]);
    setModalVisible(true);
  };

  const openEditModal = (category: { name: string; icon: string }) => {
    setIsEditing(true);
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setModalVisible(true);
  };

  const handleSaveCategory = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }
    if (!selectedIcon) {
      Alert.alert('Missing Icon', 'Please select an icon.');
      return;
    }

    let success = false;
    if (isEditing && editingCategory) {
      success = editCategory(type, editingCategory.name, trimmed, selectedIcon);
    } else {
      success = addCategory(type, trimmed, selectedIcon);
    }

    if (!success) {
      Alert.alert(
        'Error',
        isEditing ? 'Failed to edit category. It may conflict with existing ones.' : 'Failed to add category. It may already exist.'
      );
      return;
    }

    Alert.alert('Success', isEditing ? 'Category edited successfully!' : 'Category added successfully!');
    setModalVisible(false);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>
      <View style={styles.typeToggle}>
        <TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.activeType]} onPress={() => setType('expense')}>
          <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.activeType]} onPress={() => setType('income')}>
          <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>Income</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={styles.addBtnText}>Add Category</Text>
      </TouchableOpacity>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Expense Categories</Text>
        {categories.expense.length ? (
          categories.expense.map((item) => (
            <View key={item.name} style={styles.categoryItemRow}>
              <MaterialCommunityIcons name={item.icon as any} size={20} color="#4a90e2" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
                <MaterialCommunityIcons name="pencil" size={18} color="#4a90e2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteCategory(item)}>
                <MaterialCommunityIcons name="delete" size={18} color="#e74c3c" />
              </TouchableOpacity>
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
              <MaterialCommunityIcons name={item.icon as any} size={20} color="#2ecc71" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
                <MaterialCommunityIcons name="pencil" size={18} color="#2ecc71" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteCategory(item)}>
                <MaterialCommunityIcons name="delete" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No income categories yet.</Text>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Category' : 'Add Category'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <Text style={styles.sectionTitle}>Choose Icon</Text>
            <ScrollView style={styles.iconScroll}>
              <View style={styles.iconGrid}>
                {iconOptions.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, selectedIcon === icon && styles.iconOptionSelected]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <MaterialCommunityIcons name={icon as any} size={24} color={selectedIcon === icon ? '#fff' : '#555'} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCategory}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};



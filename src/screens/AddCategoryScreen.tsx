import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { categoriesStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';
import { iconOptions } from '../utils/iconOptions';

type Props = NativeStackScreenProps<any, 'AddCategory'>;

export const AddCategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { addCategory } = useTransactions();
  const transactionType = route.params.transactionType as 'income' | 'expense';
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Category',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
    });
  }, [navigation, colors]);

  const handleSave = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }

    const success = addCategory(transactionType, trimmed, selectedIcon);
    if (!success) {
      Alert.alert('Error', 'Failed to add category. It may already exist.');
      return;
    }

    Alert.alert('Success', 'Category added successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Add Category</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="Category Name"
        placeholderTextColor={colors.textSecondary}
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Icon</Text>
      <ScrollView style={[styles.iconScroll, { backgroundColor: colors.background }]}>
        <View style={[styles.iconGrid, { backgroundColor: colors.card }]}>
          {iconOptions.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[styles.iconOption, selectedIcon === icon && styles.iconOptionSelected]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Text style={[commonStyles.unicodeIconLarge, { color: colors.text }]}>{getUnicodeIcon(icon)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.modalButtons, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.border }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={[styles.saveBtnText, { color: '#fff' }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

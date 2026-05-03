import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { categoriesStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';
import { iconOptions } from '../utils/iconOptions';

type Props = NativeStackScreenProps<any, 'EditCategory'>;

export const EditCategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { editCategory } = useTransactions();
  const { transactionType, categoryName } = route.params;
  const [name, setName] = useState(categoryName);
  const [selectedIcon, setSelectedIcon] = useState(route.params.icon);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Category',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
    });
  }, [navigation, colors]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }

    const success = editCategory(transactionType, categoryName, trimmed, selectedIcon);
    if (!success) {
      Alert.alert('Error', 'Failed to edit category.');
      return;
    }

    Alert.alert('Success', 'Category edited successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Edit Category</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="Category Name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
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

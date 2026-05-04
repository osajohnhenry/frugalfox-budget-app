import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';

const GOAL_ICONS = [
  'target', 'trophy', 'star', 'heart', 'home', 'car', 'plane', 'gift',
  'school', 'briefcase', 'bank', 'piggy-bank', 'treasure-chest', 'diamond',
  'rocket', 'emoticon-happy', 'party-popper', 'medal', 'crown', 'flag'
];

export const AddGoalScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addGoal } = useTransactions();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [isSaving, setIsSaving] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Goal',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
      headerRight: () => (
        <TouchableOpacity 
          style={{ padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 }}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(targetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    const goalName = name.trim();
    if (!goalName) {
      Alert.alert('Missing Name', 'Please enter a goal name.');
      return;
    }

    setIsSaving(true);
    try {
      await addGoal({
        name: goalName,
        targetAmount: parsedAmount,
        currentAmount: 0,
        icon: selectedIcon,
        createdAt: new Date().toISOString(),
        completed: false,
      });
      Alert.alert('Success', 'Goal created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderIconGrid = () => (
    <View style={styles.iconGrid}>
      {GOAL_ICONS.map((icon) => (
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
        {/* Goal Name Input */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Goal Name
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.card,
              borderColor: nameFocused ? colors.primary : colors.border,
              borderWidth: 1.5,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.text
            }}
            placeholder="Enter goal name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            selectionColor={colors.primary}
          />
        </View>

        {/* Target Amount Input */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16, marginTop: -30 }]}>
          <Text style={[commonStyles.textMedium, commonStyles.semiBold, { color: colors.text, marginBottom: 6 }]}>
            Target Amount
          </Text>
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
              value={targetAmount}
              onChangeText={setTargetAmount}
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
          <View style={styles.selectedIconContainer}>
            <Text style={styles.selectedIconText}>{getUnicodeIcon(selectedIcon)}</Text>
            <Text style={[styles.selectedIconLabel, { color: colors.text }]}>
              {selectedIcon.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
          {renderIconGrid()}
        </View>

        {/* Info Card */}
        <View style={[commonStyles.card, { backgroundColor: 'rgba(46, 204, 113, 0.1)', marginBottom: 16, marginTop: -30 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="information" size={20} color="#2ecc71" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#2ecc71', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                How Goals Work
              </Text>
              <Text style={{ color: '#27ae60', fontSize: 12, lineHeight: 16 }}>
                Link income transactions to this goal to track progress. Your goal will be marked as completed when the total linked income reaches your target amount.
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: isSaving ? '#95a5a6' : colors.primary, 
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
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Creating...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Create Goal</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  headerButton: {
    padding: 8,
  },
  iconGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
  },
  iconItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    margin: 8,
    borderWidth: 2,
  },
  iconItemText: {
    fontSize: 24,
  },
  selectedIconContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedIconText: {
    fontSize: 32,
    marginRight: 12,
  },
  selectedIconLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
};

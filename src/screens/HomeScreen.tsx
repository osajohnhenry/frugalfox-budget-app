import React, { useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions } from '../context/TransactionContext';
import { Transaction } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { homeStyles as styles } from '../styles/screenStyles';

const currencySymbol = '₱';

const TransactionItem: React.FC<{ item: Transaction; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.txItem} onPress={onPress}>
    <View>
      <Text style={styles.txCategory}>{item.category}</Text>
      <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
    <Text style={[styles.txAmount, item.type === 'income' ? styles.income : styles.expense]}>
      {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
    </Text>
  </TouchableOpacity>
);

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { transactions, balance, loading, editTransaction, categories } = useTransactions();
  const incomeTotal = transactions.reduce((sum, tx) => tx.type === 'income' ? sum + tx.amount : sum, 0);
  const expenseTotal = transactions.reduce((sum, tx) => tx.type === 'expense' ? sum + tx.amount : sum, 0);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editType, setEditType] = useState<'income' | 'expense'>('expense');
  const [editCategory, setEditCategory] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Group and sort transactions
  const expenseTransactions = transactions
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const incomeTransactions = transactions
    .filter((tx) => tx.type === 'income')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const expensesToShow = expenseTransactions.slice(0, 5);
  const incomeToShow = incomeTransactions.slice(0, 5);

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditType(transaction.type);
    setEditCategory(transaction.category);
    setEditNote(transaction.note);
    setEditDate(new Date(transaction.date));
    setEditModalVisible(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditDate(selectedDate);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    const parsedAmount = parseFloat(editAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    const categoryItem = categories[editType].find((item) => item.name === editCategory);
    if (!categoryItem) {
      Alert.alert('Invalid Category', 'Please select a valid category.');
      return;
    }

    const success = await editTransaction(editingTransaction.id, {
      amount: parsedAmount,
      type: editType,
      category: editCategory,
      categoryIcon: categoryItem.icon,
      note: editNote.trim(),
      date: editDate.toISOString(),
    });

    if (success) {
      Alert.alert('Success', 'Transaction updated successfully!');
      setEditModalVisible(false);
      setEditingTransaction(null);
    } else {
      Alert.alert('Error', 'Failed to update transaction.');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) return <ActivityIndicator size="large" style={styles.loadingContainer} />;

  const hasNoTransactions = expenseTransactions.length === 0 && incomeTransactions.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>{currencySymbol}{balance.toFixed(2)}</Text>
        <View style={styles.totalsRow}>
          <View style={[styles.totalsBadge, styles.expenseBadge]}>
            <Text style={styles.totalsLabel}>Expenses</Text>
            <Text style={styles.totalsValue}>-{currencySymbol}{expenseTotal.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsBadge, styles.incomeBadge]}>
            <Text style={styles.totalsLabel}>Income</Text>
            <Text style={styles.totalsValue}>+{currencySymbol}{incomeTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {hasNoTransactions ? (
        <View style={styles.list}>
          <Text style={styles.emptyText}>No transactions yet. Tap + to add one!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={true}>
          {/* Expenses Section */}
          {expenseTransactions.length > 0 && (
            <View style={styles.transactionSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Expenses</Text>
                {expenseTransactions.length > 5 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: 'expense' })}>
                    <Text style={styles.viewAllLink}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {expensesToShow.map((item) => (
                <TransactionItem key={item.id} item={item} onPress={() => openEditModal(item)} />
              ))}
            </View>
          )}

          {/* Income Section */}
          {incomeTransactions.length > 0 && (
            <View style={styles.transactionSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Income</Text>
                {incomeTransactions.length > 5 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactionType: 'income' })}>
                    <Text style={styles.viewAllLink}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {incomeToShow.map((item) => (
                <TransactionItem key={item.id} item={item} onPress={() => openEditModal(item)} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* Edit Transaction Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Transaction</Text>

            <View style={styles.typeToggle}>
              <TouchableOpacity style={[styles.typeBtn, editType === 'expense' && styles.activeType]} onPress={() => { setEditType('expense'); setDropdownOpen(false); }}>
                <Text style={[styles.typeText, editType === 'expense' && styles.activeTypeText]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, editType === 'income' && styles.activeType]} onPress={() => { setEditType('income'); setDropdownOpen(false); }}>
                <Text style={[styles.typeText, editType === 'income' && styles.activeTypeText]}>Income</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
              <MaterialCommunityIcons name="calendar" size={20} color="#555" style={styles.dateIcon} />
              <Text style={styles.dateText}>{editDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>₱</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={editAmount}
                onChangeText={setEditAmount}
              />
            </View>

            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen((prev) => !prev)}>
              <Text style={[styles.dropdownText, !editCategory && styles.placeholderText]}>
                {editCategory || 'Choose a category'}
              </Text>
              <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={styles.dropdownList}>
                {categories[editType].length > 0 ? (
                  categories[editType].map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setEditCategory(item.name);
                        setDropdownOpen(false);
                      }}
                    >
                      <View style={styles.dropdownItemRow}>
                        <MaterialCommunityIcons name={item.icon as any} size={18} color="#555" style={styles.dropdownItemIcon} />
                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyCategoryText}>No categories found for {editType}. Add categories in the Categories screen.</Text>
                )}
              </View>
            )}

            <TextInput style={[styles.input, styles.textArea]} placeholder="Note (optional)" value={editNote} onChangeText={setEditNote} multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


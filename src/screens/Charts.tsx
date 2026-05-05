import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { DonutChart } from '../components/DonutChart';
import { ClusteredBarChart } from '../components/ClusteredBarChart';
import { chartsStyles as styles, commonStyles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';


interface CategoryTotal {
  name: string;
  total: number;
  icon: string;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export const ChartsScreen: React.FC<any> = ({ navigation }) => {
  const { colors } = useTheme();
  const { transactions, categories } = useTransactions();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('ExportChart')}>
            <MaterialCommunityIcons name="file-pdf-box" size={22} color={colors.headerText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
            <MaterialCommunityIcons name="cog" size={22} color={colors.headerText} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === selectedYear && txDate.getMonth() === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  const categoryTotals = useMemo(() => {
    const totals: { [key: string]: CategoryTotal } = {};

    filteredTransactions.forEach((tx) => {
      if (!totals[tx.category]) {
        const category = categories[tx.type].find((c) => c.name === tx.category);
        totals[tx.category] = {
          name: tx.category,
          total: 0,
          icon: category?.icon || 'help-circle',
          color: '',
        };
      }
      totals[tx.category].total += tx.amount;
    });

    return Object.values(totals);
  }, [filteredTransactions, categories]);

  const expensesData = useMemo(() => {
    const data = categoryTotals.filter((cat) =>
      filteredTransactions.some((tx) => tx.category === cat.name && tx.type === 'expense')
    );

    data.forEach((item, index) => {
      item.color = COLORS[index % COLORS.length];
    });

    return data;
  }, [categoryTotals, filteredTransactions]);

  const incomeData = useMemo(() => {
    const data = categoryTotals.filter((cat) =>
      filteredTransactions.some((tx) => tx.category === cat.name && tx.type === 'income')
    );

    data.forEach((item, index) => {
      item.color = COLORS[index % COLORS.length];
    });

    return data;
  }, [categoryTotals, filteredTransactions]);

  const expenseTotal = useMemo(() => expensesData.reduce((sum, cat) => sum + cat.total, 0), [expensesData]);
  const incomeTotal = useMemo(() => incomeData.reduce((sum, cat) => sum + cat.total, 0), [incomeData]);

  // Monthly data for clustered bar chart
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get all 12 months of the current year
    return Array.from({ length: 12 }, (_, index) => {
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === currentYear && txDate.getMonth() === index;
      });
      
      const expenses = monthTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      const income = monthTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      return {
        month: months[index],
        expense: expenses,
        income: income
      };
    });
  }, [transactions]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthName = new Date(selectedYear, selectedMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>

        {/* Date Range Filter */}
        <View style={[styles.dateFilterContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={handlePrevMonth} style={[styles.dateButton, { backgroundColor: colors.border }]}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: colors.text }]}>{monthName}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={[styles.dateButton, { backgroundColor: colors.border }]}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

      {/* Expenses Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={[styles.cardHeader, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons name="shopping" size={24} color="#e74c3c" />
          <Text style={[styles.cardTitle, { color: '#e74c3c' }]}>Expenses</Text>
          <Text style={[styles.cardTotal, { color: colors.text }]}>₱{expenseTotal.toFixed(2)}</Text>
        </View>

        {expensesData.length > 0 ? (
          <View>
            {/* Donut Chart with Legend */}
            <View style={styles.chartWithLegend}>
              <DonutChart data={expensesData} size={180} innerRadius={50} outerRadius={80} />
              <View style={styles.legendContainer}>
                {expensesData.map((category, index) => {
                  const percentage = expenseTotal > 0 ? (category.total / expenseTotal * 100) : 0;
                  return (
                    <View key={category.name} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                      <Text style={[styles.legendText, { color: colors.text }]}>{percentage.toFixed(1)}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Category List */}
            <View style={styles.categoryList}>
              {expensesData.map((category, index) => (
                <View key={category.name} style={styles.categoryRow}>
                  <View style={styles.categoryRowLeft}>
                    <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                    <Text style={[commonStyles.unicodeIcon, { color: colors.textSecondary }]}>
                      {getUnicodeIcon(category.icon)}
                    </Text>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                  </View>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>₱{category.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expenses this month</Text>
        )}
      </View>

      {/* Income Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={[styles.cardHeader, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons name="cash-multiple" size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Income</Text>
          <Text style={[styles.cardTotal, { color: colors.text }]}>₱{incomeTotal.toFixed(2)}</Text>
        </View>

        {incomeData.length > 0 ? (
          <View>
            {/* Donut Chart with Legend */}
            <View style={styles.chartWithLegend}>
              <DonutChart data={incomeData} size={180} innerRadius={50} outerRadius={80} />
              <View style={styles.legendContainer}>
                {incomeData.map((category, index) => {
                  const percentage = incomeTotal > 0 ? (category.total / incomeTotal * 100) : 0;
                  return (
                    <View key={category.name} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                      <Text style={[styles.legendText, { color: colors.text }]}>{percentage.toFixed(1)}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Category List */}
            <View style={styles.categoryList}>
              {incomeData.map((category, index) => (
                <View key={category.name} style={styles.categoryRow}>
                  <View style={styles.categoryRowLeft}>
                    <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                    <Text style={[commonStyles.unicodeIcon, { color: colors.textSecondary }]}>
                      {getUnicodeIcon(category.icon)}
                    </Text>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                  </View>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>₱{category.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No income this month</Text>
        )}
      </View>

        {/* Monthly Comparison Chart */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.cardHeader, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <MaterialCommunityIcons name="chart-bar" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>Monthly Comparison</Text>
            <Text style={[styles.cardTotal, { color: colors.text }]}>{new Date().getFullYear()}</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            <ClusteredBarChart data={monthlyData} width={850} height={220} showLegend={false} />
          </ScrollView>
          
          {/* Static Legend */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#e74c3c', marginRight: 4 }} />
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Expenses</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#2ecc71', marginRight: 4 }} />
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Income</Text>
            </View>
          </View>
        </View>
    </ScrollView>

    <TouchableOpacity style={{
      width: 56, 
      height: 56, 
      borderRadius: 28, 
      backgroundColor: colors.primary,
      padding: 0, 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      bottom: 20,
      right: 20,
      elevation: 8,
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4
    }} onPress={() => navigation.navigate('AddTransaction')}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 0 }}>+</Text>
    </TouchableOpacity>
    </View>
  );
};

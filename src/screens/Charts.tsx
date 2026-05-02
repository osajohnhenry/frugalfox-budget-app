import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { DonutChart } from '../components/DonutChart';
import { chartsStyles as styles } from '../styles/screenStyles';

interface CategoryTotal {
  name: string;
  total: number;
  icon: string;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export const ChartsScreen: React.FC<any> = ({ navigation }) => {
  const { transactions, categories } = useTransactions();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.getParent()?.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={22} color="#fff" />
        </TouchableOpacity>
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
          icon: category?.icon || 'tag',
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      {/* Date Range Filter */}
      <View style={styles.dateFilterContainer}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.dateButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{monthName}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.dateButton}>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#4a90e2" />
        </TouchableOpacity>
      </View>

      {/* Expenses Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shopping" size={24} color="#e74c3c" />
          <Text style={[styles.cardTitle, { color: '#e74c3c' }]}>Expenses</Text>
          <Text style={styles.cardTotal}>₱{expenseTotal.toFixed(2)}</Text>
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
                      <Text style={styles.legendText}>{percentage.toFixed(1)}%</Text>
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
                    <MaterialCommunityIcons name={category.icon as any} size={18} color="#555" style={styles.categoryIcon} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>₱{category.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>No expenses this month</Text>
        )}
      </View>

      {/* Income Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="cash-multiple" size={24} color="#2ecc71" />
          <Text style={[styles.cardTitle, { color: '#2ecc71' }]}>Income</Text>
          <Text style={styles.cardTotal}>₱{incomeTotal.toFixed(2)}</Text>
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
                      <Text style={styles.legendText}>{percentage.toFixed(1)}%</Text>
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
                    <MaterialCommunityIcons name={category.icon as any} size={18} color="#555" style={styles.categoryIcon} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>₱{category.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>No income this month</Text>
        )}
      </View>
    </ScrollView>
  );
};

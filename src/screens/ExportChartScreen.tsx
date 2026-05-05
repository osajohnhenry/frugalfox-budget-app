import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { chartsStyles as styles } from '../styles/screenStyles';
import { getUnicodeIcon } from '../utils/icons';
import { DatePicker } from '../components/DatePicker';

export const ExportChartScreen: React.FC<any> = ({ navigation }) => {
  const { transactions, categories } = useTransactions();
  const { colors, isDarkMode } = useTheme();
  const [exportType, setExportType] = useState<'single' | 'range'>('single');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customPickerDate, setCustomPickerDate] = useState(new Date());
  const [customPickerMode, setCustomPickerMode] = useState<'start' | 'end'>('start');
  const [isExporting, setIsExporting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Export Charts',
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackTitleVisible: false,
    });
  }, [navigation]);


  const handleStartDateChange = (selectedDate: Date) => {
    setStartDate(selectedDate);
    if (selectedDate > endDate) {
      setEndDate(selectedDate);
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    setEndDate(selectedDate);
  };

  const handleMonthYearChange = () => {
    setShowMonthYearPicker(false);
    // Set the date to the first day of the selected month
    const newDate = new Date(tempYear, tempMonth, 1);
    setStartDate(newDate);
    if (newDate > endDate) {
      setEndDate(new Date(tempYear, tempMonth + 1, 0));
    }
  };

  const openMonthYearPicker = () => {
    setTempYear(startDate.getFullYear());
    setTempMonth(startDate.getMonth());
    setShowMonthYearPicker(true);
  };

  const getFilteredTransactions = (from: Date, to: Date, isSingleMonth: boolean) => {
    let fromStart, toEnd;
    
    if (isSingleMonth) {
      // For single month, filter only that month
      fromStart = new Date(from.getFullYear(), from.getMonth(), 1);
      toEnd = new Date(from.getFullYear(), from.getMonth() + 1, 0, 23, 59, 59, 999); // End of the last day
    } else {
      // For range, include from first day of start month to last day of end month
      fromStart = new Date(from.getFullYear(), from.getMonth(), 1);
      toEnd = new Date(to.getFullYear(), to.getMonth() + 1, 0, 23, 59, 59, 999); // End of the last day
    }
    
    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= fromStart && txDate <= toEnd;
    });
    
    return filtered;
  };

  const generateChartData = (from: Date, to: Date, isSingleMonth: boolean) => {
    const filtered = getFilteredTransactions(from, to, isSingleMonth);
    
    const expenseData: { [key: string]: number } = {};
    const incomeData: { [key: string]: number } = {};

    filtered.forEach((tx) => {
      const data = tx.type === 'expense' ? expenseData : incomeData;
      data[tx.category] = (data[tx.category] || 0) + tx.amount;
    });

    // Generate monthly data for comparison chart
    const monthlyData = generateMonthlyData(filtered, from, to);

    return { expenseData, incomeData, filtered, monthlyData };
  };

  const generateMonthlyData = (filtered: any[], startDate: Date, endDate: Date) => {
    const currentYear = new Date().getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Determine the month range
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    const monthlyData: { month: string; expense: number; income: number }[] = [];
    
    // Generate data for each month in the range
    if (startYear === endYear) {
      // Same year
      for (let i = startMonth; i <= endMonth; i++) {
        const monthTransactions = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === i && txDate.getFullYear() === startYear;
        });
        
        const expenses = monthTransactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        const income = monthTransactions
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        monthlyData.push({
          month: months[i],
          expense: expenses,
          income: income
        });
      }
    } else {
      // Multiple years (handle year transition)
      for (let i = startMonth; i < 12; i++) {
        const monthTransactions = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === i && txDate.getFullYear() === startYear;
        });
        
        const expenses = monthTransactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        const income = monthTransactions
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        monthlyData.push({
          month: months[i],
          expense: expenses,
          income: income
        });
      }
      
      for (let i = 0; i <= endMonth; i++) {
        const monthTransactions = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === i && txDate.getFullYear() === endYear;
        });
        
        const expenses = monthTransactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        const income = monthTransactions
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        monthlyData.push({
          month: months[i],
          expense: expenses,
          income: income
        });
      }
    }
    
    return monthlyData;
  };

  const generatePieSVG = (data: { [key: string]: number }, size: number = 200) => {
    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="80" fill="none" stroke="#e0e0e0" stroke-width="30"/>
      </svg>`;
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = 80;
    const innerRadius = 50;

    let currentAngle = 0;
    let paths = '';

    Object.entries(data).forEach(([category, amount], index) => {
      const sliceAngle = (amount / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const polarToCartesian = (angleInDegrees: number, radius: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
          x: centerX + radius * Math.cos(angleInRadians),
          y: centerY + radius * Math.sin(angleInRadians),
        };
      };

      // Handle 360-degree case (full circle) by drawing two 180-degree arcs
      if (sliceAngle >= 360) {
        const midAngle = startAngle + 180;
        const outerStart = polarToCartesian(startAngle, outerRadius);
        const outerMid = polarToCartesian(midAngle, outerRadius);
        const outerEnd = polarToCartesian(endAngle, outerRadius);
        const innerStart = polarToCartesian(startAngle, innerRadius);
        const innerMid = polarToCartesian(midAngle, innerRadius);
        const innerEnd = polarToCartesian(endAngle, innerRadius);
        
        const pathData1 = `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 0 0 ${outerMid.x} ${outerMid.y} A ${outerRadius} ${outerRadius} 0 0 0 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 0 1 ${innerMid.x} ${innerMid.y} A ${innerRadius} ${innerRadius} 0 0 1 ${innerStart.x} ${innerStart.y} Z`;
        
        paths += `<path d="${pathData1}" fill="${COLORS[index % COLORS.length]}"/>`;
      } else {
        const outerStart = polarToCartesian(endAngle, outerRadius);
        const outerEnd = polarToCartesian(startAngle, outerRadius);
        const innerStart = polarToCartesian(endAngle, innerRadius);
        const innerEnd = polarToCartesian(startAngle, innerRadius);

        const largeArcFlag = sliceAngle <= 180 ? 0 : 1;

        const pathData = `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y} Z`;
        
        paths += `<path d="${pathData}" fill="${COLORS[index % COLORS.length]}"/>`;
      }
    });

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;
  };

  const generateClusteredBarSVG = (data: { month: string; expense: number; income: number }[], width: number = 600, height: number = 300) => {
    if (data.length === 0) {
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#666" font-size="14">No data available</text>
      </svg>`;
    }

    const maxValue = Math.max(...data.map(d => Math.max(d.expense, d.income)));
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = 25;
    const barSpacing = 4;
    const groupWidth = barWidth * 2 + barSpacing * 3;
    
    let svgContent = '';

    // Grid lines
    [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
      const y = padding + (1 - ratio) * chartHeight;
      svgContent += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
    });

    // Y-axis labels
    [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
      const value = maxValue * ratio;
      const y = padding + (1 - ratio) * chartHeight;
      const formattedValue = value >= 1000 ? `₱${(value / 1000).toFixed(1)}k` : `₱${value.toFixed(0)}`;
      svgContent += `<text x="${padding - 5}" y="${y + 4}" text-anchor="end" fill="#666" font-size="10">${formattedValue}</text>`;
    });

    // Bars
    data.forEach((item, index) => {
      const x = padding + index * groupWidth + barSpacing;
      const expenseHeight = (item.expense / maxValue) * chartHeight;
      const incomeHeight = (item.income / maxValue) * chartHeight;
      
      // Expense bar
      svgContent += `<rect x="${x}" y="${padding + chartHeight - expenseHeight}" width="${barWidth}" height="${expenseHeight}" fill="#e74c3c" rx="2"/>`;
      
      // Income bar
      svgContent += `<rect x="${x + barWidth + barSpacing}" y="${padding + chartHeight - incomeHeight}" width="${barWidth}" height="${incomeHeight}" fill="#2ecc71" rx="2"/>`;
      
      // Month label
      svgContent += `<text x="${x + barWidth + barSpacing/2}" y="${height - 25}" text-anchor="middle" fill="#666" font-size="10">${item.month.slice(0, 3)}</text>`;
    });

    // Axes
    svgContent += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;
    svgContent += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  };

  const handleExport = async () => {
    if (exportType === 'range' && startDate > endDate) {
      Alert.alert('Invalid Date Range', 'Start date must be before end date.');
      return;
    }

    setIsExporting(true);
    try {
      const { expenseData, incomeData, filtered, monthlyData } = generateChartData(startDate, endDate, exportType === 'single');
      const totalExpense = Object.values(expenseData).reduce((a, b) => a + b, 0);
      const totalIncome = Object.values(incomeData).reduce((a, b) => a + b, 0);
      const balance = totalIncome - totalExpense;

      const dateRangeText = exportType === 'single'
        ? `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
        : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

      const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

      // Helper function to get category icon as Unicode
      const getCategoryIconUnicode = (categoryName: string, type: string) => {
        const categoryArray = type === 'expense' ? categories.expense : categories.income;
        const category = categoryArray.find(cat => cat.name === categoryName);
        const iconName = category ? category.icon : 'help-circle';
        
        return getUnicodeIcon(iconName);
      };

      const expenseRows = Object.entries(expenseData)
        .map(([category, amount], index) => {
          const percentage = totalExpense > 0 ? (amount / totalExpense * 100).toFixed(1) : '0.0';
          const color = COLORS[index % COLORS.length];
          const icon = getCategoryIconUnicode(category, 'expense');
          return `<tr><td><div style="display: flex; align-items: center;"><div style="width: 12px; height: 12px; background-color: ${color}; margin-right: 8px; border-radius: 2px;"></div><span style="margin-right: 8px;">${icon}</span>${category}</div></td><td>₱${amount.toFixed(2)}</td><td>${percentage}%</td></tr>`;
        })
        .join('');

      const incomeRows = Object.entries(incomeData)
        .map(([category, amount], index) => {
          const percentage = totalIncome > 0 ? (amount / totalIncome * 100).toFixed(1) : '0.0';
          const color = COLORS[index % COLORS.length];
          const icon = getCategoryIconUnicode(category, 'income');
          return `<tr><td><div style="display: flex; align-items: center;"><div style="width: 12px; height: 12px; background-color: ${color}; margin-right: 8px; border-radius: 2px;"></div><span style="margin-right: 8px;">${icon}</span>${category}</div></td><td>₱${amount.toFixed(2)}</td><td>${percentage}%</td></tr>`;
        })
        .join('');

      const expenseChartSVG = generatePieSVG(expenseData);
      const incomeChartSVG = generatePieSVG(incomeData);
      const monthlyChartSVG = generateClusteredBarSVG(monthlyData);

      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #4a90e2; text-align: center; }
              h2 { color: #333; margin-top: 20px; border-bottom: 2px solid #4a90e2; padding-bottom: 10px; }
              .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .summary-item { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
              .summary-item strong { color: #4a90e2; }
              .chart-section { margin: 30px 0; page-break-inside: avoid; }
              .chart-container { display: flex; justify-content: center; margin: 20px 0; }
              .chart-container svg { max-width: 100%; height: auto; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th { background-color: #4a90e2; color: white; padding: 10px; text-align: left; }
              td { padding: 10px; border-bottom: 1px solid #ddd; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .date-range { text-align: center; color: #666; margin: 10px 0; font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>Budget Report</h1>
            <p class="date-range">Period: ${dateRangeText}</p>
            
            <div class="summary">
              <div class="summary-item">
                <strong>Total Income:</strong>
                <span style="color: #2ecc71;">+₱${totalIncome.toFixed(2)}</span>
              </div>
              <div class="summary-item">
                <strong>Total Expense:</strong>
                <span style="color: #e74c3c;">-₱${totalExpense.toFixed(2)}</span>
              </div>
              <div class="summary-item">
                <strong>Net Balance:</strong>
                <span style="color: ${balance >= 0 ? '#2ecc71' : '#e74c3c'};">${balance >= 0 ? '+' : ''}₱${balance.toFixed(2)}</span>
              </div>
              <div class="summary-item">
                <strong>Transactions:</strong>
                <span>${filtered.length}</span>
              </div>
            </div>

            <div class="chart-section">
              <h2>Expenses Chart</h2>
              ${Object.keys(expenseData).length > 0 
                ? `<div class="chart-container">${expenseChartSVG}</div>`
                : '<p>No expenses recorded.</p>'}
              <h3>Expenses Breakdown</h3>
              ${expenseRows ? `<table><tr><th>Category</th><th>Amount</th><th>Percentage</th></tr>${expenseRows}</table>` : '<p>No expenses recorded.</p>'}
            </div>

            <div class="chart-section">
              <h2>Income Chart</h2>
              ${Object.keys(incomeData).length > 0 
                ? `<div class="chart-container">${incomeChartSVG}</div>`
                : '<p>No income recorded.</p>'}
              <h3>Income Breakdown</h3>
              ${incomeRows ? `<table><tr><th>Category</th><th>Amount</th><th>Percentage</th></tr>${incomeRows}</table>` : '<p>No income recorded.</p>'}
            </div>

            <div class="chart-section">
              <h2>Monthly Comparison</h2>
              ${monthlyData.length > 0 
                ? `<div class="chart-container">${monthlyChartSVG}</div>`
                : '<p>No monthly data available.</p>'}
              <div style="display: flex; justify-content: center; margin-top: 20px;">
                <div style="display: flex; align-items: center; margin-right: 20px;">
                  <div style="width: 12px; height: 12px; background-color: #e74c3c; margin-right: 4px;"></div>
                  <span style="font-size: 12px; color: #666;">Expenses</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <div style="width: 12px; height: 12px; background-color: #2ecc71; margin-right: 4px;"></div>
                  <span style="font-size: 12px; color: #666;">Income</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      const originalUri = uri;
      const fileName = 'budget-report.pdf';
      
      try {
        // Get the directory of the original file
        const originalDir = originalUri.substring(0, originalUri.lastIndexOf('/'));
        const newUri = `${originalDir}/${fileName}`;
        
        // Move the file to the new location with the custom name
        await FileSystem.moveAsync({
          from: originalUri,
          to: newUri
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(newUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Budget Report PDF',
          });
        } else {
          Alert.alert('Success', `PDF saved as ${fileName}`);
        }
      } catch (error) {
        // If renaming fails, share the original file
        console.log('File renaming failed, sharing original file:', error);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(originalUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Budget Report PDF',
          });
        } else {
          Alert.alert('Success', 'PDF generated successfully!');
        }
      }
    } catch (error) {
      Alert.alert('Export Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Main Content */}
      <View style={{ paddingHorizontal: 16 }}>

      {/* Export Type Cards */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 15 }}>Choose Export Option</Text>
        
        <TouchableOpacity 
          onPress={() => setExportType('single')}
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: exportType === 'single' ? colors.primary : colors.border,
            backgroundColor: exportType === 'single' ? (colors.primary + '10') : colors.card,
            marginBottom: 12
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <MaterialCommunityIcons 
              name={exportType === 'single' ? 'check-circle' : 'circle-outline'} 
              size={24} 
              color={exportType === 'single' ? colors.primary : colors.textSecondary}
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>Single Month</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>Export data for one specific month</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setExportType('range')}
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: exportType === 'range' ? colors.primary : colors.border,
            backgroundColor: exportType === 'range' ? (colors.primary + '10') : colors.card
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <MaterialCommunityIcons 
              name={exportType === 'range' ? 'check-circle' : 'circle-outline'} 
              size={24} 
              color={exportType === 'range' ? colors.primary : colors.textSecondary}
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>Date Range</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>Export data for multiple months</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Date Selection */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 15 }}>
          {exportType === 'single' ? 'Select Month' : 'Select Date Range'}
        </Text>

        {exportType === 'single' && (
          <TouchableOpacity 
            style={{
              padding: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              flexDirection: 'row',
              alignItems: 'center'
            }} 
            onPress={openMonthYearPicker}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                Month
              </Text>
              <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
                {startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        )}

        {/* Custom Month/Year Picker Modal */}
        <Modal
          visible={showMonthYearPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMonthYearPicker(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20, textAlign: 'center', color: colors.text }}>Select Month</Text>
              
              {/* Month Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 10 }}>Month</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={{
                        width: '23%',
                        padding: 10,
                        marginBottom: 8,
                        backgroundColor: tempMonth === index ? colors.primary : colors.border,
                        borderRadius: 8,
                        alignItems: 'center'
                      }}
                      onPress={() => setTempMonth(index)}
                    >
                      <Text style={{ color: tempMonth === index ? colors.headerText : colors.text, fontSize: 12, fontWeight: '500' }}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Year Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 10 }}>Year</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{ padding: 10, backgroundColor: colors.border, borderRadius: 8, marginRight: 20 }}
                    onPress={() => setTempYear(tempYear - 1)}
                  >
                    <MaterialCommunityIcons name="chevron-left" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 16, fontWeight: '600', minWidth: 80, textAlign: 'center', color: colors.text }}>
                    {tempYear}
                  </Text>
                  <TouchableOpacity
                    style={{ padding: 10, backgroundColor: colors.border, borderRadius: 8, marginLeft: 20 }}
                    onPress={() => setTempYear(tempYear + 1)}
                  >
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{ flex: 1, padding: 12, backgroundColor: colors.border, borderRadius: 8, alignItems: 'center' }}
                  onPress={() => setShowMonthYearPicker(false)}
                >
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, padding: 12, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center' }}
                  onPress={handleMonthYearChange}
                >
                  <Text style={{ color: colors.headerText, fontSize: 16, fontWeight: '500' }}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {exportType === 'range' && (
          <DatePicker
            value={startDate}
            onChange={handleStartDateChange}
            label="Start Date"
            style={{ marginBottom: 12 }}
          />
        )}

        {exportType === 'range' && (
          <>
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              label="End Date"
            />
          </>
        )}
      </View>

      {/* Export Button */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 16,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30,
          opacity: isExporting ? 0.6 : 1
        }}
        onPress={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <ActivityIndicator color={colors.headerText} style={{ marginRight: 10 }} />
            <Text style={{ color: colors.headerText, fontSize: 16, fontWeight: '600' }}>Generating PDF...</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="file-pdf-box" size={22} color={colors.headerText} style={{ marginRight: 10 }} />
            <Text style={{ color: colors.headerText, fontSize: 16, fontWeight: '600' }}>Export to PDF</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Info Section */}
      <View style={{ 
        backgroundColor: (colors.primary + '10'), 
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        padding: 16, 
        borderRadius: 8,
        marginBottom: 20
      }}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>What's Included</Text>
        </View>
        <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
          {'• Summary with total income, expense, and balance\n'}
          {'• Visual donut charts for expense categories\n'}
          {'• Visual donut charts for income categories\n'}
          {'• Monthly comparison chart with income vs expenses\n'}
          {'• Detailed breakdown tables\n'}
          {'• Transaction count and date range'}
        </Text>
      </View>
    </View>
  </ScrollView>
  );
};

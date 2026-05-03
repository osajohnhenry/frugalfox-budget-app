import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

interface MonthlyData {
  month: string;
  expense: number;
  income: number;
}

interface ClusteredBarChartProps {
  data: MonthlyData[];
  width?: number;
  height?: number;
  barWidth?: number;
  barSpacing?: number;
  showLegend?: boolean;
}

export const ClusteredBarChart: React.FC<ClusteredBarChartProps> = ({ 
  data, 
  width = 350, 
  height = 200, 
  barWidth = 25, 
  barSpacing = 4,
  showLegend = true
}) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return { maxValue: 0, scaledData: [] };
    
    const maxValue = Math.max(...data.map(d => Math.max(d.expense, d.income)));
    const padding = 40;
    const chartHeight = height - padding * 2;
    
    // Calculate total width needed for all bars with proper spacing
    const groupWidth = barWidth * 2 + barSpacing * 3; // barWidth*2 + spacing between bars + margins
    const totalWidth = groupWidth * data.length + padding * 2;
    
    const scaledData = data.map((item, index) => {
      const x = padding + index * groupWidth + barSpacing;
      const expenseHeight = (item.expense / maxValue) * chartHeight;
      const incomeHeight = (item.income / maxValue) * chartHeight;
      
      return {
        ...item,
        x,
        expenseHeight,
        incomeHeight,
        expenseY: height - padding - expenseHeight,
        incomeY: height - padding - incomeHeight,
        expenseX: x,
        incomeX: x + barWidth + barSpacing,
      };
    });
    
    return { maxValue, scaledData, totalWidth };
  }, [data, width, height, barWidth, barSpacing]);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `₱${(value / 1000).toFixed(1)}k`;
    }
    return `₱${value.toFixed(0)}`;
  };

  if (data.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height, width }}>
        <Text style={{ color: '#666', fontSize: 14 }}>No data available</Text>
      </View>
    );
  }

  const svgWidth = Math.max(width, chartData.totalWidth);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={svgWidth} height={height}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = 40 + (1 - ratio) * (height - 80);
            return (
              <Line
                key={ratio}
                x1={40}
                y1={y}
                x2={svgWidth - 40}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
            );
          })}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = chartData.maxValue * ratio;
            const y = 40 + (1 - ratio) * (height - 80);
            return (
              <SvgText
                key={ratio}
                x={35}
                y={y + 4}
                fontSize={10}
                fill="#666"
                textAnchor="end"
              >
                {formatCurrency(value)}
              </SvgText>
            );
          })}
          
          {/* Bars */}
          {chartData.scaledData.map((item, index) => (
            <View key={index}>
              {/* Expense bar */}
              <Rect
                x={item.expenseX}
                y={item.expenseY}
                width={barWidth}
                height={item.expenseHeight}
                fill="#e74c3c"
                rx={2}
              />
              
              {/* Income bar */}
              <Rect
                x={item.incomeX}
                y={item.incomeY}
                width={barWidth}
                height={item.incomeHeight}
                fill="#2ecc71"
                rx={2}
              />
              
              {/* Month label */}
              <SvgText
                x={item.expenseX + barWidth + barSpacing / 2}
                y={height - 25}
                fontSize={10}
                fill="#666"
                textAnchor="middle"
              >
                {item.month.slice(0, 3)}
              </SvgText>
            </View>
          ))}
          
          {/* Axes */}
          <Line
            x1={40}
            y1={height - 40}
            x2={svgWidth - 40}
            y2={height - 40}
            stroke="#333"
            strokeWidth={2}
          />
          <Line
            x1={40}
            y1={40}
            x2={40}
            y2={height - 40}
            stroke="#333"
            strokeWidth={2}
          />
        </Svg>
      
      {/* Legend */}
      {showLegend && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
            <View style={{ width: 12, height: 12, backgroundColor: '#e74c3c', marginRight: 4 }} />
            <Text style={{ fontSize: 12, color: '#666' }}>Expenses</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, backgroundColor: '#2ecc71', marginRight: 4 }} />
            <Text style={{ fontSize: 12, color: '#666' }}>Income</Text>
          </View>
        </View>
      )}
    </View>
  );
};

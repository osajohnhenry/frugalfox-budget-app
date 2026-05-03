import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface DonutChartProps {
  data: Array<{ name: string; total: number; color: string }>;
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeDonutSlice = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const sliceAngle = endAngle - startAngle;
  
  // Handle 360-degree case (full circle) by drawing two 180-degree arcs
  if (sliceAngle >= 360) {
    const midAngle = startAngle + 180;
    const outerStart = polarToCartesian(x, y, outerRadius, startAngle);
    const outerMid = polarToCartesian(x, y, outerRadius, midAngle);
    const outerEnd = polarToCartesian(x, y, outerRadius, endAngle);
    const innerStart = polarToCartesian(x, y, innerRadius, startAngle);
    const innerMid = polarToCartesian(x, y, innerRadius, midAngle);
    const innerEnd = polarToCartesian(x, y, innerRadius, endAngle);
    
    const d = [
      'M', outerStart.x, outerStart.y,
      'A', outerRadius, outerRadius, 0, 0, 0, outerMid.x, outerMid.y,
      'A', outerRadius, outerRadius, 0, 0, 0, outerEnd.x, outerEnd.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, 0, 1, innerMid.x, innerMid.y,
      'A', innerRadius, innerRadius, 0, 0, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
    
    return d;
  }
  
  const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
  const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);
  const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
  const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
  
  const largeArcFlag = sliceAngle <= 180 ? '0' : '1';
  
  const d = [
    'M', outerStart.x, outerStart.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    'L', innerEnd.x, innerEnd.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
    'Z'
  ].join(' ');
  
  return d;
};

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 200, innerRadius = 60, outerRadius = 90 }) => {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.total, 0), [data]);

  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.map((item) => {
      const sliceAngle = (item.total / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;
      return { ...item, startAngle, endAngle };
    });
  }, [data, total]);

  if (total === 0) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={size / 2} cy={size / 2} r={outerRadius} fill="none" stroke="#e0e0e0" strokeWidth="30" />
        </Svg>
      </View>
    );
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, index) => (
          <Path
            key={index}
            d={describeDonutSlice(size / 2, size / 2, innerRadius, outerRadius, slice.startAngle, slice.endAngle)}
            fill={slice.color}
          />
        ))}
      </Svg>
    </View>
  );
};

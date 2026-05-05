import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  style?: any;
  disabled?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  style,
  disabled = false,
  maximumDate = new Date(),
  minimumDate,
}) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = React.useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleDateDismiss = () => {
    setShowPicker(false);
  };

  const openPicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <View style={style}>
      {label && (
        <Text style={{ 
          fontSize: 14, 
          fontWeight: '600', 
          color: colors.text, 
          marginBottom: 4 
        }}>
          {label}
        </Text>
      )}
      <TouchableOpacity 
        style={{
          padding: 14,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: disabled ? colors.border : colors.card,
          flexDirection: 'row',
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1
        }} 
        onPress={openPicker}
        disabled={disabled}
      >
        <MaterialCommunityIcons 
          name="calendar" 
          size={20} 
          color={disabled ? colors.textSecondary : colors.primary} 
          style={{ marginRight: 10 }} 
        />
        <Text style={{ 
          flex: 1, 
          fontSize: 16, 
          color: disabled ? colors.textSecondary : colors.text, 
          fontWeight: '500' 
        }}>
          {value.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onValueChange={handleDateChange}
          onDismiss={handleDateDismiss}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

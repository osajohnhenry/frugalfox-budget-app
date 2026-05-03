import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonStyles } from '../styles/screenStyles';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'Appearance'>;

export const AppearanceScreen: React.FC<Props> = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode, colors, themeColor, setThemeColor } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const predefinedColors = [
    '#4a90e2', // Default blue
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c', // Teal
    '#34495e', // Dark blue
    '#e67e22', // Dark orange
    '#95a5a6', // Gray
    '#3498db', // Light blue
  ];

  const handleColorSelect = (color: string) => {
    setThemeColor(color);
    setShowColorPicker(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Appearance',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
    });
  }, [navigation, colors]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
          Appearance
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          Customize how the app looks and feels
        </Text>
      </View>

      {/* Theme Settings */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Theme
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="theme-light-dark" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDarkMode ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}
          onPress={() => setShowColorPicker(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="palette" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Theme Color</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: themeColor, marginRight: 8 }} />
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Display Settings */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Display
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="view-compact" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Compact View</Text>
          </View>
          <Switch
            value={compactView}
            onValueChange={setCompactView}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={compactView ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="format-text" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Font Size</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginRight: 8 }}>Medium</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="currency-usd" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Currency Symbol</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginRight: 8 }}>₱</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Behavior Settings */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Behavior
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="bell" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notifications ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="cloud-upload" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: colors.text }}>Auto Backup</Text>
          </View>
          <Switch
            value={autoBackup}
            onValueChange={setAutoBackup}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={autoBackup ? '#fff' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Reset Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#e74c3c', marginBottom: 16 }}>
          Reset
        </Text>
        
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          onPress={() => Alert.alert('Reset Appearance', 'Are you sure you want to reset all appearance settings to default?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => {
              // Reset other settings but keep dark mode as is
              setNotifications(true);
              setAutoBackup(false);
              setCompactView(false);
              setThemeColor('#4a90e2'); // Reset to default theme color
              Alert.alert('Reset Complete', 'All appearance settings have been reset to default.');
            }}
          ])}
        >
          <MaterialCommunityIcons name="restore" size={20} color="#e74c3c" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: '#e74c3c', flex: 1 }}>Reset to Default</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            width: '90%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Choose Theme Color
            </Text>
            
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              {predefinedColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: color,
                    margin: 8,
                    borderWidth: themeColor === color ? 3 : 1,
                    borderColor: themeColor === color ? colors.text : colors.border,
                  }}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.border,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={{
                fontSize: 16,
                color: colors.text,
                fontWeight: '600',
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

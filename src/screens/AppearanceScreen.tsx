import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonStyles, appearanceStyles } from '../styles/screenStyles';
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
    <ScrollView style={[appearanceStyles.container, { backgroundColor: colors.background }]}>
      <View style={appearanceStyles.header}>
        <Text style={[appearanceStyles.title, { color: colors.text }]}>
          Appearance
        </Text>
        <Text style={[appearanceStyles.subtitle, { color: colors.textSecondary }]}>
          Customize how the app looks and feels
        </Text>
      </View>

      {/* Theme Settings */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={[appearanceStyles.sectionTitle, { color: colors.text }]}>
          Theme
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="theme-light-dark" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDarkMode ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[appearanceStyles.settingRow, { elevation: 0, shadowOpacity: 0 }]}
          onPress={() => setShowColorPicker(true)}
          activeOpacity={0.7}
        >
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="palette" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Theme Color</Text>
          </View>
          <View style={appearanceStyles.settingRight}>
            <View style={[appearanceStyles.colorPreview, { backgroundColor: themeColor }]} />
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={appearanceStyles.chevronIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Display Settings */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={[appearanceStyles.sectionTitle, { color: colors.text }]}>
          Display
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="view-compact" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Compact View</Text>
          </View>
          <Switch
            value={compactView}
            onValueChange={setCompactView}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={compactView ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="format-text" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Font Size</Text>
          </View>
          <View style={appearanceStyles.settingRight}>
            <Text style={[appearanceStyles.subtitle, { color: colors.textSecondary, marginRight: 8 }]}>Medium</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={appearanceStyles.chevronIcon} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="currency-usd" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Currency Symbol</Text>
          </View>
          <View style={appearanceStyles.settingRight}>
            <Text style={[appearanceStyles.subtitle, { color: colors.textSecondary, marginRight: 8 }]}>₱</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={appearanceStyles.chevronIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Behavior Settings */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={[appearanceStyles.sectionTitle, { color: colors.text }]}>
          Behavior
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="bell" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notifications ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <View style={appearanceStyles.settingLeft}>
            <MaterialCommunityIcons name="cloud-upload" size={20} color={colors.primary} style={appearanceStyles.settingIcon} />
            <Text style={[appearanceStyles.settingText, { color: colors.text }]}>Auto Backup</Text>
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
        <Text style={[appearanceStyles.sectionTitle, { color: '#e74c3c' }]}>
          Reset
        </Text>
        
        <TouchableOpacity 
          style={appearanceStyles.settingRow}
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
          <MaterialCommunityIcons name="restore" size={20} color="#e74c3c" style={appearanceStyles.settingIcon} />
          <Text style={[appearanceStyles.settingText, { color: '#e74c3c', flex: 1 }]}>Reset to Default</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#e74c3c" style={appearanceStyles.chevronIcon} />
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <View style={appearanceStyles.modalOverlay}>
          <View style={[appearanceStyles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[
              appearanceStyles.modalTitle,
              { color: colors.text }
            ]}>
              Choose Theme Color
            </Text>
            
            <View style={appearanceStyles.colorGrid}>
              {predefinedColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    appearanceStyles.colorOption,
                    {
                      backgroundColor: color,
                      borderWidth: themeColor === color ? 3 : 1,
                      borderColor: themeColor === color ? colors.text : colors.border,
                    }
                  ]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
            
            <TouchableOpacity
              style={[
                appearanceStyles.cancelButton,
                { backgroundColor: colors.border }
              ]}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={[
                appearanceStyles.cancelButtonText,
                { color: colors.text }
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

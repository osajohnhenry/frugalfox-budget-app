import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Animated } from 'react-native';
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
  
  // Animation values
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;

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
    hideColorPicker();
  };

  const showColorPickerWithAnimation = () => {
    setShowColorPicker(true);
    // Start animations after a small delay to ensure modal is rendered
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 50);
  };

  const hideColorPicker = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 300,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowColorPicker(false);
    });
  };

  useEffect(() => {
    if (showColorPicker) {
      showColorPickerWithAnimation();
    }
  }, [showColorPicker]);

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            onPress={showColorPickerWithAnimation}
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
      </ScrollView>
      
      {/* Color Picker Modal - Outside ScrollView */}
      {showColorPicker && (
        <Animated.View 
          style={[
            appearanceStyles.modalOverlay, 
            { opacity: overlayAnimation }
          ]}
        >
          <Animated.View 
            style={[
              appearanceStyles.modalContent, 
              { 
                backgroundColor: colors.card,
                transform: [{ translateY: slideAnimation }]
              }
            ]}
          >
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
              onPress={hideColorPicker}
            >
              <Text style={[
                appearanceStyles.cancelButtonText,
                { color: colors.text }
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

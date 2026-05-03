import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    card: string;
    border: string;
    primary: string;
    header: string;
    headerText: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('#4a90e2');

  // Load theme preferences from storage
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('darkMode');
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
        const savedThemeColor = await AsyncStorage.getItem('themeColor');
        if (savedThemeColor !== null) {
          setThemeColor(savedThemeColor);
        }
      } catch (error) {
        console.log('Error loading theme preferences:', error);
      }
    };
    loadThemePreferences();
  }, []);

  // Save dark mode preference to storage
  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  // Set theme color
  const setThemeColorWithStorage = async (color: string) => {
    setThemeColor(color);
    try {
      await AsyncStorage.setItem('themeColor', color);
    } catch (error) {
      console.log('Error saving theme color:', error);
    }
  };

  const colors = {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#333333',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    border: isDarkMode ? '#333333' : '#e0e0e0',
    primary: themeColor,
    header: themeColor,
    headerText: '#ffffff',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, themeColor, setThemeColor: setThemeColorWithStorage, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

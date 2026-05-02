import React from 'react';
import { View, Text } from 'react-native';
import { settingsStyles as styles } from '../styles/screenStyles';

export const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>Configure your app preferences and appearance here.</Text>
    </View>
  );
};



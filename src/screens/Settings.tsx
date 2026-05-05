import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { settingsStyles as styles, commonStyles, settingsScreenStyles } from '../styles/screenStyles';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Settings',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
    });
  }, [navigation, colors]);
  return (
    <ScrollView style={[settingsScreenStyles.container, { backgroundColor: colors.background }]}>
      <View style={settingsScreenStyles.header}>
        <Text style={[settingsScreenStyles.title, { color: colors.text }]}>
          Settings
        </Text>
        <Text style={[settingsScreenStyles.subtitle, { color: colors.textSecondary }]}>
          Configure your app preferences and appearance here.
        </Text>
      </View>

      {/* Account Section */}
      <View style={[commonStyles.card, settingsScreenStyles.section, { backgroundColor: colors.card }]}>
        <Text style={[settingsScreenStyles.sectionTitle, { color: colors.text }]}>
          Account
        </Text>
        
        <TouchableOpacity 
          style={settingsScreenStyles.settingRow}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialCommunityIcons name="account" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Profile</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>
      </View>

      {/* Appearance Section */}
      <View style={[commonStyles.card, settingsScreenStyles.section, { backgroundColor: colors.card }]}>
        <Text style={[settingsScreenStyles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        
        <TouchableOpacity 
          style={settingsScreenStyles.settingRow}
          onPress={() => navigation.navigate('Appearance')}
        >
          <MaterialCommunityIcons name="palette" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Appearance</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={[commonStyles.card, settingsScreenStyles.section, { backgroundColor: colors.card }]}>
        <Text style={[settingsScreenStyles.sectionTitle, { color: colors.text }]}>
          Preferences
        </Text>
        
        <TouchableOpacity style={settingsScreenStyles.settingRow}>
          <MaterialCommunityIcons name="bell" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Notifications</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={settingsScreenStyles.settingRow}>
          <MaterialCommunityIcons name="currency-usd" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Currency</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={settingsScreenStyles.settingRow}>
          <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Backup & Restore</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={[commonStyles.card, settingsScreenStyles.section, { backgroundColor: colors.card }]}>
        <Text style={[settingsScreenStyles.sectionTitle, { color: colors.text }]}>
          Support
        </Text>
        
        <TouchableOpacity style={settingsScreenStyles.settingRow}>
          <MaterialCommunityIcons name="help-circle" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Help & Support</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={settingsScreenStyles.settingRow}>
          <MaterialCommunityIcons name="information" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>About</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={settingsScreenStyles.settingRow}>
          <MaterialCommunityIcons name="file-document" size={20} color={colors.primary} style={settingsScreenStyles.settingIcon} />
          <Text style={[settingsScreenStyles.settingText, { color: colors.text }]}>Terms & Privacy</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={settingsScreenStyles.chevronIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
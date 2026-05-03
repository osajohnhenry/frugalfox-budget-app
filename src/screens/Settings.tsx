import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { settingsStyles as styles, commonStyles } from '../styles/screenStyles';
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
          Settings
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          Configure your app preferences and appearance here.
        </Text>
      </View>

      {/* Account Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Account
        </Text>
        
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialCommunityIcons name="account" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Profile</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Appearance Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Appearance
        </Text>
        
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          onPress={() => navigation.navigate('Appearance')}
        >
          <MaterialCommunityIcons name="palette" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Appearance</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Preferences
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <MaterialCommunityIcons name="bell" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Notifications</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <MaterialCommunityIcons name="currency-usd" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Currency</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Backup & Restore</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
          Support
        </Text>
        
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <MaterialCommunityIcons name="help-circle" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Help & Support</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <MaterialCommunityIcons name="information" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>About</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <MaterialCommunityIcons name="file-document" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>Terms & Privacy</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
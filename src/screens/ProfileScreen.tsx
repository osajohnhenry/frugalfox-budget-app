import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonStyles, profileStyles } from '../styles/screenStyles';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Profile',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
    });
  }, [navigation, colors]);
  const [userName, setUserName] = useState('User');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleNameEdit = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  const handlePickImage = () => {
    Alert.alert(
      'Profile Picture',
      'Profile picture feature coming soon! You\'ll be able to select an image from your device.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={[profileStyles.container, { backgroundColor: colors.background }]}>
      <View style={profileStyles.header}>
        <Text style={[profileStyles.title, { color: colors.text }]}>
          Profile
        </Text>
        <Text style={[profileStyles.subtitle, { color: colors.textSecondary }]}>
          Set your name and profile picture
        </Text>
      </View>

      {/* User Info Card */}
      <View style={[commonStyles.card, profileStyles.profileCard, { backgroundColor: colors.card }]}>
        <View style={profileStyles.avatarContainer}>
          <TouchableOpacity 
            style={[profileStyles.avatarButton, { backgroundColor: colors.primary }]}
            onPress={handlePickImage}
          >
            <MaterialCommunityIcons name="account" size={30} color="#fff" style={profileStyles.avatarIcon} />
          </TouchableOpacity>
          <View style={profileStyles.profileInfo}>
            {isEditingName ? (
              <View style={profileStyles.nameEditContainer}>
                <TextInput
                  style={[
                    profileStyles.nameInput,
                    {
                      color: colors.text,
                      borderBottomColor: colors.primary,
                    }
                  ]}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  onSubmitEditing={handleNameSave}
                />
                <TouchableOpacity onPress={handleNameSave} style={profileStyles.saveButton}>
                  <MaterialCommunityIcons name="check" size={20} color="#2ecc71" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNameCancel} style={profileStyles.cancelButton}>
                  <MaterialCommunityIcons name="close" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={profileStyles.nameDisplayContainer}>
                <Text style={[profileStyles.nameText, { color: colors.text }]}>
                  {userName}
                </Text>
                <TouchableOpacity onPress={handleNameEdit}>
                  <MaterialCommunityIcons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            <Text style={[profileStyles.avatarHint, { color: colors.textSecondary }]}>
              Tap avatar to change profile picture
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

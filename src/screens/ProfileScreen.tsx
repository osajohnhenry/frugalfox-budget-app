import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonStyles } from '../styles/screenStyles';
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
          Profile
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          Set your name and profile picture
        </Text>
      </View>

      {/* User Info Card */}
      <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity 
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16
            }}
            onPress={handlePickImage}
          >
            <MaterialCommunityIcons name="account" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            {isEditingName ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    marginRight: 8
                  }}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  onSubmitEditing={handleNameSave}
                />
                <TouchableOpacity onPress={handleNameSave} style={{ marginRight: 8 }}>
                  <MaterialCommunityIcons name="check" size={20} color="#2ecc71" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNameCancel}>
                  <MaterialCommunityIcons name="close" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, flex: 1 }}>
                  {userName}
                </Text>
                <TouchableOpacity onPress={handleNameEdit}>
                  <MaterialCommunityIcons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              Tap avatar to change profile picture
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

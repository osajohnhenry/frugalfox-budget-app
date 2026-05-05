import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import * as DocumentPicker from 'expo-document-picker';
import { saveTransactions, saveCategories, saveBudgets, saveGoals, clearAllData } from '../storage';

type Props = NativeStackScreenProps<any, 'BackupRestore'>;

interface BackupOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const { height } = Dimensions.get('window');

export const BackupRestoreScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { transactions, categories, budgets, goals, setTransactions, setCategories, setBudgets, setGoals } = useTransactions();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);

  const backupOptions: BackupOption[] = [
    {
      id: 'all',
      title: 'All data',
      description: 'Backup everything including transactions, categories, budgets, goals, and theme',
      icon: 'database'
    },
    {
      id: 'transactions',
      title: 'Transactions and Categories',
      description: 'Backup all transactions and custom categories',
      icon: 'swap-horizontal'
    },
    {
      id: 'budget',
      title: 'Budget',
      description: 'Backup all budget configurations',
      icon: 'piggy-bank'
    },
    {
      id: 'goals',
      title: 'Goals',
      description: 'Backup all savings goals',
      icon: 'target'
    },
    {
      id: 'theme',
      title: 'Theme',
      description: 'Backup your theme preferences',
      icon: 'palette'
    }
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Backup & Restore',
      headerStyle: { backgroundColor: colors.header },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
      headerBackVisible: true,
    });
  }, [navigation, colors]);

  const showBackupOptions = () => {
    setShowBackupModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hideBackupModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowBackupModal(false);
      setSelectedOptions([]);
    });
  };

  const toggleOption = (optionId: string) => {
    if (optionId === 'all') {
      if (selectedOptions.includes('all')) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(['all']);
      }
    } else {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(prev => prev.filter(id => id !== optionId && id !== 'all'));
      } else {
        setSelectedOptions(prev => [...prev.filter(id => id !== 'all'), optionId]);
      }
    }
  };

  const performBackup = async () => {
    try {
      const backupData: any = {};
      
      if (selectedOptions.includes('all') || selectedOptions.includes('transactions')) {
        backupData.transactions = transactions;
        backupData.categories = categories;
      }
      
      if (selectedOptions.includes('all') || selectedOptions.includes('budget')) {
        backupData.budgets = budgets;
      }
      
      if (selectedOptions.includes('all') || selectedOptions.includes('goals')) {
        backupData.goals = goals;
      }
      
      if (selectedOptions.includes('all') || selectedOptions.includes('theme')) {
        backupData.theme = {
          isDarkMode: false, // We'll need to access this from theme context properly
          primaryColor: colors.primary,
          backgroundColor: colors.background,
          cardColor: colors.card,
          textColor: colors.text,
        };
      }

      backupData.backupVersion = '1.0';
      backupData.timestamp = new Date().toISOString();
      backupData.appVersion = '1.0.0';

      const fileName = `frugalfox_backup_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Share your backup file',
        });
      } else {
        Alert.alert('Success', `Backup saved to ${fileUri}`);
      }
      
      hideBackupModal();
      Alert.alert('Success', 'Backup completed successfully!');
    } catch (error) {
      console.error('Backup error:', error);
      Alert.alert('Error', 'Failed to create backup. Please try again.');
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        try {
          const fileContent = await FileSystem.readAsStringAsync(file.uri);
          const backupData = JSON.parse(fileContent);
          
          // Validate backup structure
          if (!backupData.backupVersion) {
            throw new Error('Invalid backup file format');
          }
          
          // Restore data based on what's available in the backup
          if (backupData.transactions || backupData.categories) {
            // Restore transactions and categories
            if (backupData.transactions) {
              await saveTransactions(backupData.transactions);
              setTransactions(backupData.transactions);
            }
            if (backupData.categories) {
              await saveCategories(backupData.categories);
              setCategories(backupData.categories);
            }
            console.log('Transactions and categories restored');
          }
          
          if (backupData.budgets) {
            // Restore budgets
            await saveBudgets(backupData.budgets);
            setBudgets(backupData.budgets);
            console.log('Budgets restored');
          }
          
          if (backupData.goals) {
            // Restore goals
            await saveGoals(backupData.goals);
            setGoals(backupData.goals);
            console.log('Goals restored');
          }
          
          if (backupData.theme) {
            // Restore theme - this would need to be implemented with theme context
            console.log('Theme restore would be implemented here');
            Alert.alert('Info', 'Theme preferences detected in backup. Theme restore would be implemented here.');
          }
          
          Alert.alert(
            'Success', 
            'Backup restored successfully! The app needs to reload to show the restored data.',
            [
              { text: 'OK', onPress: () => {
                // Force app reload by clearing navigation and going to main
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                });
              }}
            ]
          );
        } catch (parseError) {
          console.error('Parse error:', parseError);
          Alert.alert('Error', 'Failed to parse backup file. Please check the file format.');
        }
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore backup. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <ScrollView style={[{ backgroundColor: colors.background, flex: 1 }]}>
      <View style={{ padding: 20 }}>
        <View style={{ marginBottom: 30 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
            Backup & Restore
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
            Protect your data by creating backups or restore from a previous backup
          </Text>
        </View>

        <View style={{ 
          backgroundColor: colors.card, 
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 20 
        }}>
          <TouchableOpacity
            onPress={showBackupOptions}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 15,
              paddingHorizontal: 5,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
                <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                  Backup Data
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 2 }}>
                  Create a backup of your data
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ 
          backgroundColor: colors.card, 
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 20 
        }}>
          <TouchableOpacity
            onPress={handleRestore}
            disabled={isRestoring}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 15,
              paddingHorizontal: 5,
              opacity: isRestoring ? 0.6 : 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
                <MaterialCommunityIcons name="restore" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                  Restore Data
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 2 }}>
                  Restore from a backup file
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
        }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Tips
          </Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <MaterialCommunityIcons name="information" size={16} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1 }}>
                Regular backups help prevent data loss
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <MaterialCommunityIcons name="information" size={16} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1 }}>
                Store backup files in a safe location
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <MaterialCommunityIcons name="information" size={16} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1 }}>
                Restore will overwrite existing data
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Modal
        visible={showBackupModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideBackupModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <Animated.View style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: height * 0.8,
            transform: [{ translateY: slideAnim }],
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border || '#e0e0e0',
            }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
                Select Data to Backup
              </Text>
              <TouchableOpacity onPress={hideBackupModal}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ padding: 20 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {backupOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => toggleOption(option.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 15,
                    marginBottom: 10,
                    backgroundColor: selectedOptions.includes(option.id) 
                      ? colors.primary + '20' 
                      : 'transparent',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedOptions.includes(option.id) 
                      ? colors.primary 
                      : colors.border || '#e0e0e0',
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedOptions.includes(option.id) 
                      ? colors.primary 
                      : colors.textSecondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    {selectedOptions.includes(option.id) && (
                      <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: colors.primary,
                      }} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons 
                        name={option.icon} 
                        size={20} 
                        color={colors.primary} 
                        style={{ marginRight: 10 }} 
                      />
                      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                        {option.title}
                      </Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}>
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: colors.border || '#e0e0e0',
            }}>
              <TouchableOpacity
                onPress={performBackup}
                disabled={selectedOptions.length === 0}
                style={{
                  backgroundColor: selectedOptions.length > 0 ? colors.primary : colors.textSecondary,
                  paddingVertical: 15,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Backup Selected Data
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

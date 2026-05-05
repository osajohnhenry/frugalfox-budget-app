import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoriesScreen } from '../screens/Categories';
import { ChartsScreen } from '../screens/Charts';
import { BudgetScreen } from '../screens/BudgetScreen';
import { GoalListScreen } from '../screens/GoalListScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const CustomHeader = ({ title, showBackButton = false, navigation }: { title: string; showBackButton?: boolean; navigation?: any }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {showBackButton && navigation && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ marginRight: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
      )}
      <Text style={{ color: colors.headerText, fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
    </View>
  );
};

export const TabNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Categories') {
            iconName = 'tag';
          } else if (route.name === 'Charts') {
            iconName = 'chart-donut';
          } else if (route.name === 'Budgets') {
            iconName = 'piggy-bank';
          } else if (route.name === 'Goals') {
            iconName = 'target';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card },
        headerShown: false,
      })}
    >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        headerShown: true, 
        headerTitle: () => <CustomHeader title="FrugalFox" />,
        headerStyle: { backgroundColor: colors.header }, 
        headerTintColor: colors.headerText
      }} 
    />
        <Tab.Screen 
      name="Categories" 
      component={CategoriesScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Categories" />,
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText
      }}
    />
    <Tab.Screen 
      name="Charts" 
      component={ChartsScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Charts" />,
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText
      }}
    />
    <Tab.Screen 
      name="Budgets" 
      component={BudgetScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Budgets" />,
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText
      }}
    />
    <Tab.Screen 
      name="Goals" 
      component={GoalListScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Goals" />,
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText
      }}
    />
  </Tab.Navigator>
  );
};

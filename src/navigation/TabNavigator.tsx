import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { CategoriesScreen } from '../screens/Categories';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Add') {
          iconName = 'plus';
        } else if (route.name === 'Categories') {
          iconName = 'tag';
        }

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4a90e2',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        headerShown: true, 
        title: 'Jheno Tracker',
        headerStyle: { backgroundColor: '#4a90e2' }, 
        headerTintColor: '#fff', 
        headerTitleStyle: { fontWeight: 'bold' } 
      }} 
    />
    <Tab.Screen 
      name="Add"
      component={AddTransactionScreen}
      options={{
        headerShown: true,
        title: 'Add Transaction',
        headerStyle: { backgroundColor: '#4a90e2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Tab.Screen 
      name="Categories" 
      component={CategoriesScreen}
      options={{
        headerShown: true,
        title: 'Manage Categories',
        headerStyle: { backgroundColor: '#4a90e2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Tab.Navigator>
);

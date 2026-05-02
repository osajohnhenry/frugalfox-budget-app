import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { CategoriesScreen } from '../screens/Categories';
import { ChartsScreen } from '../screens/Charts';

const Tab = createBottomTabNavigator();

const CustomHeader = ({ title }: { title: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image source={require('../../assets/frugalfox.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
  </View>
);

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
        } else if (route.name === 'Charts') {
          iconName = 'chart-donut';
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
        headerTitle: () => <CustomHeader title="FrugalFox" />,
        headerStyle: { backgroundColor: '#4a90e2' }, 
        headerTintColor: '#fff'
      }} 
    />
    <Tab.Screen 
      name="Add"
      component={AddTransactionScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Add Transaction" />,
        headerStyle: { backgroundColor: '#4a90e2' },
        headerTintColor: '#fff'
      }}
    />
    <Tab.Screen 
      name="Categories" 
      component={CategoriesScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Manage Categories" />,
        headerStyle: { backgroundColor: '#4a90e2' },
        headerTintColor: '#fff'
      }}
    />
    <Tab.Screen 
      name="Charts" 
      component={ChartsScreen}
      options={{
        headerShown: true,
        headerTitle: () => <CustomHeader title="Analytics" />,
        headerStyle: { backgroundColor: '#4a90e2' },
        headerTintColor: '#fff'
      }}
    />
  </Tab.Navigator>
);

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import WardrobeScreen from '../screens/WardrobeScreen';
import {useTheme} from 'react-native-paper';
import SettingsScreen from '../screens/settings/SettingsScreen';
import MyLooksScreen from '../screens/MyLooksScreen';

const Tab = createBottomTabNavigator();

// Placeholder components for other tabs
const MyLooks = () => null;
const Settings = () => null;

const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -8,
        },
      }}>
      <Tab.Screen
        name="AI Tools"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="auto-fix" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Looks"
        component={MyLooksScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="dots-grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="hanger" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 
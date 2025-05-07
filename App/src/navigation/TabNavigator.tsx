import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import useNavigationStore from '../store/useNavigationStore';

import HomeScreen from '../screens/HomeScreen';
import WardrobeScreen from '../screens/Wardrobe/WardrobeScreen';
import GenerateOutfitsScreen from '../screens/generateOutfits/GenerateOutfitsScreen';


const MainTab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  const theme = useTheme();
  const setActiveNavigator = useNavigationStore((state) => state.setActiveNavigator);

  return (
    <MainTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#843CA7', // Selected icon color
        tabBarInactiveTintColor: 'gray', // Default inactive icon color
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // White background for tab bar
          paddingBottom: 20, // Increased padding to align icons correctly
          height: 65, // Increased height
          borderTopWidth: 0, // Remove default border for cleaner look
          shadowColor: '#000', // Shadow settings for iOS
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -5 },
          shadowRadius: 4,
          elevation: 5, // Shadow for Android
        },
        tabBarLabelStyle: {
          fontSize: 12, // Slightly larger for better visibility
          marginTop: -8,
        },
      }}
    >
      <MainTab.Screen
        name="Wardrobe"
        component={WardrobeScreen} // Placeholder
        options={{
          title: 'Wardrobe',
          tabBarIcon: ({ color, size }) => <Icon name="wardrobe" size={size} color={color} />,
        }}
      />
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <MainTab.Screen
        name="AI Tools"
        component={GenerateOutfitsScreen} // Placeholder
        options={{
          title: 'AI Tools',
          tabBarIcon: ({ color, size }) => <Icon name="robot" size={size} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            setActiveNavigator('AiTools');
          },
        }}
      />
    </MainTab.Navigator>
  );
};

export default MainTabNavigator;

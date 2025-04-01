import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import useNavigationStore from '../store/useNavigationStore';
import CuratedPicksScreen from '../screens/MarketPlace/CuratedPicksScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/MarketPlace/ExploreScreen';

const MarketPlace = createBottomTabNavigator();

const MarketPlaceNavigator: React.FC = () => {
  const theme = useTheme();
  const setActiveNavigator = useNavigationStore((state) => state.setActiveNavigator);

  return (
    <View style={{ flex: 1 }}>
      <MarketPlace.Navigator
        initialRouteName="CuratedPicks"
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
        {/* Back Button */}
        <MarketPlace.Screen
          name="Home"
          component={CuratedPicksScreen} // Placeholder; screen component is not used
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Icon name="arrow-left" size={size} color={color} />,
          } as BottomTabNavigationOptions}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setActiveNavigator('Main');
            },
          }}
        />

        {/* Other AI Tools Tabs */}
        <MarketPlace.Screen
          name="CuratedPicks"
          component={CuratedPicksScreen}
          options={{
            title: 'Curated Picks',
            tabBarIcon: ({ color, size }) => <Icon name="auto-fix" size={size} color={color} />,
          } as BottomTabNavigationOptions}
        />
        <MarketPlace.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => <Icon name="star-outline" size={size} color={color} />,
          } as BottomTabNavigationOptions}
        />
      </MarketPlace.Navigator>

      {/* Custom Separator (Placed between Back and other tabs) */}
      <View style={styles.separator} />
    </View>
  );
};

export default MarketPlaceNavigator;

const styles = StyleSheet.create({
  separator: {
    position: 'absolute',
    bottom: 15, // Adjust to match tab bar height
    left: '25%', // Place between Back button and first AI tool tab
    width: 2, // Width of the separator
    height: '5%', // Match tab height proportionally
    backgroundColor: '#D3D3D3', // Light gray for subtle separation
    opacity: 0.7, // Slight transparency for a soft look
  },
});

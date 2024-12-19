import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import OutfitCheckScreen from '../screens/OutfitCheckScreen';
import GenerateOutfitsScreen from '../screens/GenerateOutfitsScreen';
import OccasionSelectScreen from '../screens/OccasionSelectScreen';
import SelectClothingItem from '../screens/SelectClothingItem';
import AIRecommendationScreen from '../screens/AIRecommendationScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="OutfitCheck" component={OutfitCheckScreen} />
      <Stack.Screen name="GenerateOutfits" component={GenerateOutfitsScreen} />
      <Stack.Screen name="OccasionSelect" component={OccasionSelectScreen} />
      <Stack.Screen name="SelectClothingItem" component={SelectClothingItem} />
      <Stack.Screen name="AIRecommendation" component={AIRecommendationScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator; 
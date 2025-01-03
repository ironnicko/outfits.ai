import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import OutfitCheckScreen from '../screens/OutfitCheckScreen';
import GenerateOutfitsScreen from '../screens/generateOutfits/GenerateOutfitsScreen';
import OccasionSelectScreen from '../screens/generateOutfits/OccasionSelectScreen';
import SelectClothingItem from '../screens/generateOutfits/SelectClothingItem';
import AIRecommendationScreen from '../screens/AIRecommendationScreen';
import OutfitPreviewScreen from '../screens/OutfitPreviewScreen';
import ShowOutfitScreen from '../screens/ShowOutfitScreen';
import { RootStackParamList } from '../types/types';
import ProtectedRoute from '../components/ProtectedRoute';
import MyLooksScreen from '../screens/MyLooksScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const withProtectedRoute = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="MainTabs">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={withProtectedRoute(TabNavigator)} />
      <Stack.Screen name="OutfitCheck" component={withProtectedRoute(OutfitCheckScreen)} />
      <Stack.Screen name="GenerateOutfits" component={withProtectedRoute(GenerateOutfitsScreen)} />
      <Stack.Screen name="OccasionSelect" component={withProtectedRoute(OccasionSelectScreen)} />
      <Stack.Screen name="SelectClothingItem" component={withProtectedRoute(SelectClothingItem)} />
      <Stack.Screen name="AIRecommendation" component={withProtectedRoute(AIRecommendationScreen)} />
      <Stack.Screen name="OutfitPreview" component={withProtectedRoute(OutfitPreviewScreen)} />
      <Stack.Screen name="ShowOutfits" component={withProtectedRoute(ShowOutfitScreen)} />
      <Stack.Screen name="MyLooks" component={withProtectedRoute(MyLooksScreen)} />
    </Stack.Navigator>
  );
};

export default RootNavigator; 
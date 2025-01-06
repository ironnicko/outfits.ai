import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import OutfitCheckScreen from '../screens/OutfitCheckScreen';
import GenerateOutfitsScreen from '../screens/generateOutfits/GenerateOutfitsScreen';
import OccasionSelectScreen from '../screens/generateOutfits/OccasionSelectScreen';
import SelectClothingItem from '../screens/generateOutfits/SelectClothingItem';
import MixAndMatchScreen from '../screens/MixAndMatchScreen';
import OutfitPreviewScreen from '../screens/OutfitPreviewScreen';
import { RootStackParamList } from '../types/types';
import ProtectedRoute from '../components/ProtectedRoute';
import MyLooksScreen from '../screens/MyLooksScreen';
import ClothingDetailScreen from '../screens/ClothingDetailScreen';
import OutfitCheckResultScreen from '../screens/OutfitCheckResultScreen';
import MixAndMatchResultScreen from '../screens/MixAndMatchResultScreen';

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
      <Stack.Screen name="MixAndMatch" component={withProtectedRoute(MixAndMatchScreen)} />
      <Stack.Screen name="OutfitPreviewScreen" component={withProtectedRoute(OutfitPreviewScreen)} />
      <Stack.Screen name="MyLooks" component={withProtectedRoute(MyLooksScreen)} />
      <Stack.Screen name="ClothingDetail" component={withProtectedRoute(ClothingDetailScreen)} />
      <Stack.Screen name="OutfitCheckResult" component={withProtectedRoute(OutfitCheckResultScreen)} />
      <Stack.Screen name="MixAndMatchResult" component={withProtectedRoute(MixAndMatchResultScreen)} />


    </Stack.Navigator>
  );
};

export default RootNavigator; 
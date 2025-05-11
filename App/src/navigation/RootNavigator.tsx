import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-url-polyfill/auto';
import { RootStackParamList } from '../types/types';
import MyLooksScreen from '../screens/Wardrobe/MyLooksScreen';
import { supabase } from '../store/supabase';
import { clearTokenLocal, clearUsernameLocal } from '../utils/auth';
import { useAuthStore } from '../store/authStore';
import { useClothingStore } from '../store/clothingStore';
import { useOutfitStore } from '../store/outfitStore';
import { Session } from '@supabase/supabase-js';
import { LoadingScreen } from '../components/LoadingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import MainNavigator from './mainNavigator';
import newUserOnboarding from '../screens/Onboarding/newUserOnboarding';
import InstructionsScreen from '../screens/ColorTheory/InstructionScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import { api } from "../utils/api";
import ClothingDetailScreen from '../screens/ClothingDetailScreen';
import WishlistScreen from '../screens/MarketPlace/WishlistScreen';
import ArticleDetailView from '../screens/MarketPlace/ArticleDetailView';
import CartScreen from '../screens/MarketPlace/CartScreen';
import OutfitCheckScreen from '../screens/outfitCheck/OutfitCheckScreen';
import GenerateOutfitsScreen from '../screens/generateOutfits/GenerateOutfitsScreen';
import OccasionSelectScreen from '../screens/generateOutfits/OccasionSelectScreen';
import MixAndMatchScreen from '../screens/mixAndMatch/MixAndMatchScreen';
import OutfitPreviewScreen from '../screens/generateOutfits/OutfitPreviewScreen';
import OutfitCheckResultScreen from '../screens/outfitCheck/OutfitCheckResultScreen';
import MixAndMatchResultScreen from '../screens/mixAndMatch/MixAndMatchResultScreen';
import SelectClothingItem from '../screens/generateOutfits/SelectClothingItem';


const Stack = createNativeStackNavigator<RootStackParamList>();


const RootNavigator = () => {
  const { token, isOnboardingComplete, setToken, setAllData, setUsername, clearToken, clearUsername } = useAuthStore();
  const { clear: clearClothes } = useClothingStore();
  const { clear: clearOutfits } = useOutfitStore();
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await handleSignIn(session);
        }
        
      } catch (error) {
        console.error('Initial session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth State Change Event:', event);

        switch (event) {
          case 'SIGNED_IN':
            await handleSignIn(session);
            break;
          case 'SIGNED_OUT':
            handleSignOut();
            break;
          case 'TOKEN_REFRESHED':
            await handleSignIn(session);
            break;
        }
      }
    );

    checkInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (session: Session | null) => {
    if (session?.access_token) {
      try {
        const token = session.access_token;
  
        const response = await api.get(`/api/v1/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.result) {
          const userData = response.data.result;
          setUsername(userData.username);
          setAllData(userData)
          useAuthStore.setState({ isOnboardingComplete: userData.is_on_boarding_completed });
        }
        setToken(token);
      } catch (error) {
        console.error("Sign in error:", error);
        handleSignOut();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await Promise.allSettled([clearUsernameLocal(), clearTokenLocal()]);
      clearUsername();
      clearToken();
      clearClothes();
      clearOutfits();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    initialRouteName={
      isAuthenticated
        ? isOnboardingComplete
          ? "MainTabs"
          : "newUserOnboarding"
        : "WelcomeScreen"
    }>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : 
      isOnboardingComplete ? 
      (
        <>
          <Stack.Screen name="MainTabs" component={MainNavigator} />
          <Stack.Screen name="MyLooks" component={MyLooksScreen} />
          <Stack.Screen name="Profile" component={SettingsScreen} />
          <Stack.Screen name="ClothingDetail" component={ClothingDetailScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen name="ArticleDetail" component={ArticleDetailView} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="OutfitCheck" component={OutfitCheckScreen} />
            <Stack.Screen name="GenerateOutfits" component={GenerateOutfitsScreen} />
            <Stack.Screen name="OccasionSelect" component={OccasionSelectScreen} />
            <Stack.Screen name="SelectClothingItem" component={SelectClothingItem} />
            <Stack.Screen name="MixAndMatch" component={MixAndMatchScreen} />
            <Stack.Screen name="OutfitPreviewScreen" component={OutfitPreviewScreen} />
            <Stack.Screen name="OutfitCheckResult" component={OutfitCheckResultScreen} />
            <Stack.Screen name="MixAndMatchResult" component={MixAndMatchResultScreen} />
        </>
      ) 
      : (
        <>
          <Stack.Screen name="newUserOnboarding" component={newUserOnboarding} />
          <Stack.Screen name="InstructionsScreen" component={InstructionsScreen} />
        </>
      )
      }
    </Stack.Navigator>
  );
};

export default RootNavigator;

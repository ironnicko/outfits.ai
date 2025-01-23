import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-url-polyfill/auto';

import TabNavigator from './TabNavigator';
import OutfitCheckScreen from '../screens/outfitCheck/OutfitCheckScreen';
import { RootStackParamList } from '../types/types';
import ClothingDetailScreen from '../screens/ClothingDetailScreen';
import GenerateOutfitsScreen from '../screens/generateOutfits/GenerateOutfitsScreen';
import OccasionSelectScreen from '../screens/generateOutfits/OccasionSelectScreen';
import SelectClothingItem from '../screens/generateOutfits/SelectClothingItem';
import MixAndMatchResultScreen from '../screens/mixAndMatch/MixAndMatchResultScreen';
import MixAndMatchScreen from '../screens/mixAndMatch/MixAndMatchScreen';
import MyLooksScreen from '../screens/MyLooksScreen';
import OutfitCheckResultScreen from '../screens/outfitCheck/OutfitCheckResultScreen';
import OutfitPreviewScreen from '../screens/OutfitPreviewScreen';
import { supabase } from '../store/supabase';
import { clearTokenLocal, clearUsernameLocal } from '../utils/auth';
import { useAuthStore } from '../store/authStore';
import { useClothingStore } from '../store/clothingStore';
import { useOutfitStore } from '../store/outfitStore';
import { api } from '../utils/api';
import { Session } from '@supabase/supabase-js';
import { LoadingScreen } from '../components/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Zustand store actions
  const {
    clearToken,
    clearUsername,
    setToken,
    setUsername,
  } = useAuthStore();

  const { clear: clearClothes } = useClothingStore();
  const { clear: clearOutfits } = useOutfitStore();

  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await handleSignIn(session);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Initial session check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
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
            setIsAuthenticated(false);
            await handleSignIn(session);
            setIsAuthenticated(true);
            break;
        }
      }
    );

    // Check initial session
    checkInitialSession();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (session: Session | null) => {
    if (session?.access_token) {
      try {
        // Set token in store
        setToken(session.access_token);

        const user = session.user
        // Set username in store
        if (user.identities != null){
          setUsername(user.identities[0].identity_data?.username || user.email);
        }
        // Update authentication state
        setIsAuthenticated(true);
        console.log("Signed In Successfully!")
      } catch (error) {
        console.error('Sign in error:', error);
        // Handle sign in failure
        handleSignOut();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear local storage
      await Promise.all([
        clearUsernameLocal(),
        clearTokenLocal()
      ]);

      // Clear store states
      clearUsername();
      clearToken();
      clearClothes();
      clearOutfits();

      // Update authentication state
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isAuthenticated ? "MainTabs" : "Onboarding"}
      >
        {!isAuthenticated ? (
          <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          </>

        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="OutfitCheck" component={OutfitCheckScreen} />
            <Stack.Screen name="GenerateOutfits" component={GenerateOutfitsScreen} />
            <Stack.Screen name="OccasionSelect" component={OccasionSelectScreen} />
            <Stack.Screen name="SelectClothingItem" component={SelectClothingItem} />
            <Stack.Screen name="MixAndMatch" component={MixAndMatchScreen} />
            <Stack.Screen name="OutfitPreviewScreen" component={OutfitPreviewScreen} />
            <Stack.Screen name="MyLooks" component={MyLooksScreen} />
            <Stack.Screen name="ClothingDetail" component={ClothingDetailScreen} />
            <Stack.Screen name="OutfitCheckResult" component={OutfitCheckResultScreen} />
            <Stack.Screen name="MixAndMatchResult" component={MixAndMatchResultScreen} />
          </>
        )}
      </Stack.Navigator>

  );
};

export default RootNavigator;
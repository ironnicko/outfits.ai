import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Image, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import { useClothingStore } from '../store/clothingStore';
import { AuthState, useAuthStore } from '../store/authStore';
import { supabase } from '../store/supabase';
import { NavigationProp } from '../types/types';
import Checklist from '../components/home/Checklist';
import Carousel from '../components/home/CarouselList';
import ColorAnalysisReport from '../components/home/ColorAnalysisReport';
import CuratedPicks from '../components/home/CuratedPicks';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Fetch clothing items on mount
  const setClothes = useClothingStore((state) => state.fetch);
  const token = useAuthStore((state: AuthState) => state.token);

  const fetchClothes = async () => {
    const session = await supabase.auth.getSession();
    const session_token = session.data.session?.access_token || '';
    setClothes(token || session_token);
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const carouselData = [
    {
      title: "Create Now",
      subtitle: "Create unique outfits from your closet",
      image: require("../assets/create-outfit-home.png"),
    },
    {
      title: "Enhance Your Closet",
      subtitle: "Buy what fits your wardrobe",
      image: require("../assets/assest2-home.png"),
    },
  ];

  return (
    <SafeScreen>
      <View style={styles.headerContainer}>
          <Text style={styles.logoText}>Outfits.ai</Text>
          <Pressable
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account-circle" size={32} color={'#843CA7'} />
          </Pressable>
        </View>
        {/* ✅ Hide vertical scroll indicator */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <Checklist />
          <Carousel data={carouselData} />
          <ColorAnalysisReport />
          <CuratedPicks />
        </ScrollView>
    </SafeScreen>
  );
}  

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 16,
  },
  // HEADER
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop:10,
  },
  logoText: {
    color: '#843CA7',
    fontWeight: 'bold',
    fontSize: 24,
  },
  profileButton: {
    padding: 4,
  },
});
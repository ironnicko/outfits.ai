import React, { useEffect } from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Card, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import { useClothingStore } from '../store/clothingStore';
import { AuthState, useAuthStore } from '../store/authStore';
import { supabase } from '../store/supabase';
import { NavigationProp } from '../types/types';




const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)



const FeatureCard = ({title, subtitle, icon, onPress} : any) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, {width: CARD_WIDTH}]}
      mode="elevated"
      onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={32} color={theme.colors.primary} />
        </View>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {subtitle}
        </Text>
      </Card.Content>
    </Card>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const setClothes = useClothingStore((state) => state.fetch)
  
  const token = useAuthStore((state: AuthState) => state.token);
  const fetchClothes = async () => {
    const session = (await supabase.auth.getSession())
    const session_token = session.data.session?.access_token || ""

    setClothes(token || session_token);
  };

  useEffect(() => {
      fetchClothes()
  }, [])
  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text variant="headlineMedium" style={styles.logoText}>
            Outfits.AI
          </Text>
        </View>
        <View style={styles.grid}>
        <FeatureCard
            title="Create Outfits"
            subtitle="Let our AI generate outfits for you"
            icon="auto-fix"
            onPress={() => navigation.navigate('GenerateOutfits')}
            />
          <FeatureCard
            title="Mix & Match"
            subtitle="Upload a picture for outfit advice"
            icon="camera"
            onPress={() => navigation.navigate('MixAndMatch')}
          />
          <FeatureCard
            title="Outfit Check"
            subtitle="Get feedback on your outfit"
            icon="star-outline"
            onPress={() => navigation.navigate('OutfitCheck')}
          />
          <FeatureCard
            title="Color Therapy"
            subtitle="Discover your perfect color palette"
            icon="palette"
            onPress={() => console.log('Color Therapy')}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 24,
  },
  logoText: {
    color: '#4A6741',
    fontWeight: 'bold',
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    backgroundColor: 'white',
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
    height: 180, // Fixed height for consistent card sizes
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});

export default HomeScreen; 
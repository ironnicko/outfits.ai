import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import { useClothingStore } from '../store/clothingStore';
import { AuthState, useAuthStore } from '../store/authStore';
import { supabase } from '../store/supabase';
import { NavigationProp } from '../types/types';

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

  const theme = useTheme();

  return (
    <SafeScreen style={styles.screenContainer}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>Outfits.ai</Text>
        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="account-circle" size={32} color={theme.colors.primary} />
        </Pressable>
      </View>

      {/* PROMOTIONAL BANNER */}
      <View style={styles.bannerContainer}>
        <Pressable style={styles.bannerBox}>
          <Text style={styles.bannerText}>Promotional Banner</Text>
        </Pressable>
      </View>

      {/* BODY SECTION */}
      <View style={styles.bodyContainer}>
        {/* Row with Create Outfit on the left, Check Outfit + Mix & Match on the right */}
        <View style={styles.row}>
          {/* CREATE OUTFIT (Left) */}
          <Pressable
            style={styles.createOutfitBox}
            onPress={() => navigation.navigate('GenerateOutfits')}
          >
            <Text style={styles.boxTitle}>Create Outfit</Text>
            <Image
              source={require('../assets/outfitgenerator.png')} // Replace with actual image path
              style={styles.CreatOutfitImage}
            />
          </Pressable>

          {/* Right Column: Check Outfit (top), Mix & Match (bottom) */}
          <View style={styles.rightColumn}>
            <Pressable
              style={styles.checkOutfitBox}
              onPress={() => navigation.navigate('OutfitCheck')}
            >
              <Text style={styles.boxTitle}>Check Outfit</Text>
              <Image
                source={require('../assets/outfitCheck.png')} // Replace with actual image path
                style={styles.CheckOutfitImage}
              />
            </Pressable>

            <Pressable
              style={styles.mixMatchBox}
              onPress={() => navigation.navigate('MixAndMatch')}
            >
              <Text style={styles.boxTitle}>Mix & Match</Text>
              <Image
                source={require('../assets/MnM.png')} // Replace with actual image path
                style={styles.MixandMatchImage}
              />
            </Pressable>
          </View>
        </View>

        {/* COLOUR ANALYSIS (Full Width at Bottom) */}
        <Pressable
          style={styles.colourAnalysisBox}
          onPress={() => navigation.navigate('ColorTherapyLanding')}
        >
          <Text style={styles.boxTitle}>Colour Analysis</Text>
          <Image
            source={require('../assets/colorAnalysis.png')} // Replace with actual image path
            style={styles.ColourAnalysisImage}
          />
        </Pressable>
      </View>
    </SafeScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // HEADER
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  logoText: {
    color: '#843CA7',
    fontWeight: 'bold',
    fontSize: 24,
  },
  profileButton: {
    padding: 4,
  },

  // BANNER
  bannerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  bannerBox: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  bannerText: {
    fontSize: 18,
    color: '#333',
  },

  // BODY
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  // LEFT BOX: CREATE OUTFIT
  createOutfitBox: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 255,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Allow cropping
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  // RIGHT COLUMN
  rightColumn: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  checkOutfitBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 125,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  mixMatchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  // FULL-WIDTH: COLOUR ANALYSIS
  colourAnalysisBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,

  },

  // TEXT INSIDE BOXES
  boxTitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    position: 'absolute',
    top: 7,
    left: 15,
  },

  // IMAGE STYLING
  CreatOutfitImage: {
    position: 'absolute',
    bottom: 5,
    right: 3,
    width: 125, // Adjust based on need
    height: 100, // Adjust based on need
    resizeMode: 'contain',
  },
  CheckOutfitImage: {
    position: 'absolute',
    bottom: -1,
    right: -3,
    width: 90, // Adjust based on need
    height:85, // Adjust based on need
    resizeMode: 'contain',
  },
  MixandMatchImage: {
    position: 'absolute',
    bottom: -1,
    right: -3,
    width: 90, // Adjust based on need
    height:85, // Adjust based on need
    resizeMode: 'contain',
  },
  ColourAnalysisImage: {
    position: 'absolute',
    bottom: -3,
    right: -5,
    width: 100, // Adjust based on need
    height:100, // Adjust based on need
    resizeMode: 'contain',
  },
});

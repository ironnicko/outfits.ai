import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Platform, 
  ActionSheetIOS, 
  Image, 
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { Asset, CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AuthState } from '../../store/authStore';
import { useAuthStore } from '../../store/authStore';
import { useClothingStore } from '../../store/clothingStore';
import { MixMatchItems, NavigationProp } from '../../types/types';
import { api } from '../../utils/api';
import { LoadingScreen } from '../../components/LoadingScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const MixAndMatchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const setClothes = useClothingStore((state) => state.fetch);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state: AuthState) => state.token);

  const fetchClothes = async () => {
    setClothes(token || "");
    setLoading(false);
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Picture', 'Select Picture(s)'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openGallery();
          }
        },
      );
    } else {
      // For Android, you could use a modal or directly show the options
      openGallery();
    }
  };

  const handleUpload = async (file: Asset) => {
    const formData = new FormData();
    const image = {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg'
    };
    formData.append('file', image);
    setLoading(true);

    try {
      const res = await api.post<MixMatchItems>(
        '/api/v1/outfit/mixandmatch',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'multipart/form-data',
          },
        }
      );
      if (res.status !== 200) {
        throw Error(res.statusText);
      }
      navigation.navigate("MixAndMatchResult", { data: res.data, imageURI: file.uri || "" });
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const openGallery = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 1,
      quality: 1,
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        await handleUpload(response.assets[0]);
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  const openCamera = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: true
    };

    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        await handleUpload(response.assets[0]);
      }
    } catch (error) {
      console.log('Error using camera: ', error);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* Header with back button */}
        {/* <View style={styles.header}>
          <IconButton 
            icon="chevron-left" 
            size={30} 
            iconColor="#843CA7" 
            onPress={() => navigation.goBack()} 
          />
          <Text style={styles.headerTitle}>Mix & Match</Text>
          <View style={{ width: 40 }} />
        </View> */}

        {/* Main Content */}
        {loading ? <LoadingScreen /> : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.title}>
                Smart Shopping Assistant
              </Text>
              <Text style={styles.subtitle}>
                Let AI help you make better wardrobe decisions
              </Text>
              <Image 
                source={require('../../assets/create-outfit-home.png')} 
                style={styles.heroImage} 
                resizeMode="contain"
              />
            </View>

            {/* How It Works Section */}
            <View style={styles.howItWorksContainer}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              
              <View style={styles.stepContainer}>
                <View style={styles.stepIconContainer}>
                  <Icon name="camera" size={28} color="#fff" />
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Take a Photo</Text>
                  <Text style={styles.stepDesc}>Capture or upload an image of clothing you're considering</Text>
                </View>
              </View>
              
              <View style={styles.stepContainer}>
                <View style={[styles.stepIconContainer, { backgroundColor: '#9C55B8' }]}>
                  <Icon name="tshirt-crew" size={28} color="#fff" />
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>AI Analysis</Text>
                  <Text style={styles.stepDesc}>Our AI analyzes compatibility with your existing wardrobe</Text>
                </View>
              </View>
              
              <View style={styles.stepContainer}>
                <View style={[styles.stepIconContainer, { backgroundColor: '#B568D2' }]}>
                  <Icon name="check-circle" size={28} color="#fff" />
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Get Results</Text>
                  <Text style={styles.stepDesc}>See compatibility score and outfit suggestions</Text>
                </View>
              </View>
            </View>

            {/* Upload Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Ready to try it out?</Text>
              
              <View style={styles.uploadOptions}>
                <TouchableOpacity 
                  style={styles.uploadOption}
                  onPress={openCamera}
                >
                  <View style={styles.uploadIconContainer}>
                    <Icon name="camera" size={32} color="#843CA7" />
                  </View>
                  <Text style={styles.uploadOptionText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.uploadOption}
                  onPress={openGallery}
                >
                  <View style={styles.uploadIconContainer}>
                    <Icon name="image" size={32} color="#843CA7" />
                  </View>
                  <Text style={styles.uploadOptionText}>From Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Testimonial/Tip Section */}
            <View style={styles.tipContainer}>
              <View style={styles.tipIconContainer}>
                <Icon name="lightbulb" size={24} color="#843CA7" />
              </View>
              <Text style={styles.tipText}>
                Tip: Take photos in good lighting for the most accurate results!
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#843CA7',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  heroImage: {
    width: width * 0.6,
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // How It Works Section
  howItWorksContainer: {
    backgroundColor: '#F0E9FF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#843CA7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: '#555',
  },
  // Upload Section
  uploadSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  uploadOption: {
    width: '48%',
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(132, 60, 167, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadOptionText: {
    color: '#843CA7',
    fontSize: 14,
    fontWeight: '500',
  },
  // Tip Section
  tipContainer: {
    backgroundColor: 'rgba(132, 60, 167, 0.08)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  tipIconContainer: {
    marginRight: 12,
  },
  tipText: {
    color: '#555',
    fontSize: 14,
    flex: 1,
  },
});

export default MixAndMatchScreen;
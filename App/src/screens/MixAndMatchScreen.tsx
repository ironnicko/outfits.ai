import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Image, Pressable, Platform, ActionSheetIOS} from 'react-native';
import {Text, Button, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../components/SafeScreen';
import {useNavigation} from '@react-navigation/native';
import {Asset, CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { api } from '../utils/api';
import { AuthState } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';
import { useAuthStore } from '../store/authStore';
import { useClothingStore } from '../store/clothingStore';

const MixAndMatchScreen = () => {

  const navigation = useNavigation();

  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const setClothes = useClothingStore((state) => state.fetch)
  
  const [token, setToken] = useState(useAuthStore((state: AuthState) => state.token));
  const fetchClothes = async () => {
    const getToken = await getTokenLocal();
    setToken(getToken || token)
    setClothes(getToken || "");

  };

  useEffect(() => {
    fetchClothes()
  }, [])

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
      setShowImagePickerModal(true);
    }
  };

const handleUpload = async (file: Asset) => {
    const formData = new FormData();
    const image = {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg'
    }
    formData.append('file', image);

    try {
      const res = await api.post(
        'api/v1/outfit/outfitcheck',
        formData,
        {
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload successful', res.data);
      navigation.navigate('MixAndMatchResult', { 
        result: res.data,
        imageUri: file.uri 
      });
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
    }
}

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
    const options:CameraOptions = {
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
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          <Text style={styles.title}>
            Unsure about your next purchase?
          </Text>

          <Text style={styles.subtitle}>
            Upload a photo, and our AI will:
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureItem}>
              -Analyze your wardrobe
            </Text>
            <Text style={styles.featureItem}>
              -Let you know if it's a good buy
            </Text>
            <Text style={styles.featureItem}>
              -Suggest matching pieces
            </Text>
          </View>

          <Button
            mode="contained"
            style={styles.uploadButton}
            contentStyle={styles.uploadButtonContent}
            onPress={handleImagePicker}>
            Upload now
          </Button>

          {/* Example Card */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Example</Text>
            <View style={styles.recommendationContainer}>
              {/* <Image
                source={require('../assets/example-pants.jpg')}
                style={styles.exampleImage}
                resizeMode="cover"
              /> */}
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Recommended</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4].map(star => (
                    <Icon key={star} name="star" size={24} color="#FFD700" />
                  ))}
                  <Icon name="star-outline" size={24} color="#FFD700" />
                </View>
                <Text style={styles.recommendationText}>
                  You don't have beige colored pants like this in your current wardrobe,
                  it will provide variety and can be easily paired with various items you already own.
                </Text>
              </View>
            </View>

            <Text style={styles.matchTitle}>Items that would match well</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.matchingItems}
            >
              {/* Add matching items here */}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECE6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    height: 32,
    width: 120,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 32,
  },
  featureItem: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#4A6741',
    borderRadius: 32,
    marginBottom: 32,
  },
  uploadButtonContent: {
    paddingVertical: 8,
    height: 56,
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  recommendationContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  exampleImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  matchingItems: {
    height: 120,
  },
});

export default MixAndMatchScreen; 
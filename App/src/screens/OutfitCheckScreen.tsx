import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Platform, ActionSheetIOS, Pressable} from 'react-native';
import {Text, IconButton, Button, Portal, Modal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import { api } from '../utils/api';
import { AuthState, useAuthStore } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';
import { useClothingStore } from '../store/clothingStore';

// Need to dynamically start loading when outfit is uploaded

// Need to provide space for a scrollable view with the suggestions from GPT.

const OutfitCheckScreen = () => {
  const navigation = useNavigation();

  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const setClothes = useClothingStore((state) => state.fetch)
  
  const [token, setToken] = useState(useAuthStore((state: AuthState) => state.token));
  const fetchClothes = async () => {
    const getToken = token || (await getTokenLocal());
    if (!token) {
      setToken(getToken || "")
    }

    setClothes(getToken|| "");
  };

  useEffect(() => {
    const asyncCall = async () => {
      await fetchClothes()
    }
    asyncCall()
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
        'api/v1/clothing/outfitcheck',
        formData,
        {
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload successful', res.data);
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
        {/* Header with back button */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Outfit Check
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            Snap a photo to see what the{'\n'}AI thinks of your outfit!
          </Text>

          {/* Example Images Section */}
          <View style={styles.examplesContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/example-w.png')}
                style={styles.exampleImage}
              />
              <View style={styles.wrongIndicator}>
                <Icon name="close" size={24} color="white" />
              </View>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/example-r.png')}
                style={styles.exampleImage}
              />
              <View style={styles.correctIndicator}>
                <Icon name="check" size={24} color="white" />
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text variant="titleMedium" style={styles.tipText}>
              1. Clothes should not be obstructed by anything
            </Text>
            <Text variant="titleMedium" style={styles.tipText}>
              2. Take a clear photo with good lighting
            </Text>
          </View>

          {/* Upload Button */}
          <Button
            mode="contained"
            style={styles.uploadButton}
            contentStyle={styles.uploadButtonContent}
            onPress={handleImagePicker}>
            Upload outfit
          </Button>
        </View>
      </View>

      {Platform.OS === 'android' && (
        <Portal>
          <Modal
            visible={showImagePickerModal}
            onDismiss={() => setShowImagePickerModal(false)}
            contentContainerStyle={styles.modalContainer}>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                openCamera();
                setShowImagePickerModal(false);
              }}>
              <Icon name="camera" size={24} color="#4A6741" />
              <Text style={styles.modalOptionText}>Take Picture</Text>
            </Pressable>
            
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                openGallery();
                setShowImagePickerModal(false);
              }}>
              <Icon name="image-multiple" size={24} color="#4A6741" />
              <Text style={styles.modalOptionText}>Select Picture</Text>
            </Pressable>
            
            <Pressable
              style={[styles.modalOption, styles.cancelOption]}
              onPress={() => setShowImagePickerModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Modal>
        </Portal>
      )}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#4A6741',
    fontWeight: 'bold',
    marginRight: 48, // To offset the back button and center the title
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#4A6741',
    marginVertical: 32,
    lineHeight: 32,
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 48,
    gap: 16,
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  exampleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  wrongIndicator: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#DC3545',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctIndicator: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#4A6741',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsContainer: {
    width: '100%',
    gap: 16,
  },
  tipText: {
    color: '#4A6741',
  },
  uploadButton: {
    margin: 16,
    borderRadius: 32,
    backgroundColor: '#4A6741',
  },
  uploadButtonContent: {
    paddingVertical: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#4A6741',
  },
  cancelOption: {
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
});

export default OutfitCheckScreen; 
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Platform, ActionSheetIOS } from 'react-native';
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
        {/* Header */}
        <View style={styles.header}>
          {navigation.canGoBack() && (
              <IconButton icon="chevron-left" size={24} onPress={() => navigation.goBack()} />
            )}
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
            <Text style={styles.featureItem}>- Analyze your wardrobe</Text>
            <Text style={styles.featureItem}>- Let you know if it's a good buy</Text>
            <Text style={styles.featureItem}>- Suggest matching pieces</Text>
          </View>

          {loading ? <LoadingScreen /> : (
            <Button
              mode="contained"
              style={styles.uploadButton}
              contentStyle={styles.uploadButtonContent}
              onPress={handleImagePicker}
            >
              Upload Now
            </Button>
          )}
        </ScrollView>
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
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#843CA7',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureList: {
    marginBottom: 32,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#843CA7',
    borderRadius: 32,
    marginBottom: 32,
  },
  uploadButtonContent: {
    paddingVertical: 10,
    height: 56,
  },
});

export default MixAndMatchScreen;

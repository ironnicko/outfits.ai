import React, { useState } from 'react';
import { 
  View, Text, Image, StyleSheet, Pressable, Platform, ActionSheetIOS, Modal 
} from 'react-native';
import { launchCamera, launchImageLibrary, ImageLibraryOptions,CameraOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from "../../utils/api";
import { Asset } from "react-native-image-picker";
import { AuthState, useAuthStore } from "../../store/authStore";
import { NavigationProp } from '../../types/types';
import { useNavigation } from '@react-navigation/native';




const InstructionScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state: AuthState) => state.token);
  

  const openCamera = async () => {
    const options: CameraOptions = {
      mediaType: "photo",
      includeBase64: false,
      saveToPhotos: true,
      cameraType: "front",
    };
  
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log("User cancelled camera");
      } else if (response.errorCode) {
        console.log("Camera Error: ", response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        await handleSumbit(response.assets[0]);
      }
    } catch (error) {
      console.log("Error using camera: ", error);
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
          await handleSumbit(response.assets[0]);
        }
      } catch (error) {
        console.log('Error picking image: ', error);
      }
    }
;
  const handleSumbit = async (file: Asset) => {
    const formData = new FormData();
    const image = {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg'
    };
    formData.append('file', image);
    setLoading(true);

    try {
      const res = await api.post(
        '/api/v1/outfit/colortherapy',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'multipart/form-data',
          },
        }
      );
      // if (res.status !== 200) {
      //   throw Error(res.statusText);
      // }
      console.log(res.data)
      navigation.navigate("ColorAnalysisResult", { data: res.data});
    } catch (error: any) {
      console.error('Upload error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  

  // Handle button click based on platform
  const handleScanFacePress = () => {
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

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </Pressable>

      {/* Title and Description */}
      <Text style={styles.title}>Take a selfie</Text>
      <Text style={styles.description}>
        ⚠ Please follow the instructions - especially regarding lighting - to ensure the analysis is as accurate as possible.
      </Text>

      {/* Instructions */}
      <Image source={require('../../assets/colouranalysis-image1.png')} style={styles.image} />
      <Text style={styles.instruction}>Clean off your phone camera lens</Text>

      <Image source={require('../../assets/colouranalysis-image2.png')} style={styles.image} />
      <Text style={styles.instruction}>
        Find a spot with natural light but not in direct sunlight. Now face the window.
      </Text>

      <Image source={require('../../assets/colouranalysis-image3.png')} style={styles.image} />
      <Text style={styles.instruction}>
        Take off your glasses. Keep your face relaxed, without smiling or squinting.
      </Text>

      {/* Scan Button */}
      <Pressable style={styles.button} onPress={handleScanFacePress}>
        <Text style={styles.buttonText}>SCAN YOUR FACE</Text>
      </Pressable>

      {/* Android Modal for Camera/Gallery Selection */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalOption} onPress={() => { openCamera(); setModalVisible(false); }}>
              <Icon name="camera" size={24} color="#843CA7" />
              <Text style={styles.modalText}>Take a Selfie</Text>
            </Pressable>

            <Pressable style={styles.modalOption} onPress={() => { openGallery(); setModalVisible(false); }}>
              <Icon name="image" size={24} color="#843CA7" />
              <Text style={styles.modalText}>Select from Gallery</Text>
            </Pressable>

            <Pressable style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InstructionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  image: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#843CA7',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 32, // Rounded button
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '90%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalText: {
    fontSize: 16,
    color: '#843CA7',
    marginLeft: 10,
  },
  modalCancel: {
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
});

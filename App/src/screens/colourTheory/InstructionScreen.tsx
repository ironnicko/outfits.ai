import React, { useState } from 'react';
import { 
  View, Text, Image, StyleSheet, Pressable, Platform, ActionSheetIOS, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InstructionScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openFrontCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        saveToPhotos: false,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          setSelectedImage(imageUri);
          navigation.navigate("ColorTheory", { imageUri }); // Pass imageUri directly
        }
      }
    );
  };
  
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          setSelectedImage(imageUri);
          navigation.navigate("ColorTheory", { imageUri }); // Pass imageUri directly
        }
      }
    );
  };
  

  // Handle button click based on platform
  const handleScanFacePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take a Selfie', 'Select from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openFrontCamera();
          else if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      setModalVisible(true); // Open modal for Android
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
            <Pressable style={styles.modalOption} onPress={() => { openFrontCamera(); setModalVisible(false); }}>
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

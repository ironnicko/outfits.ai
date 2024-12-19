import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Image, Pressable, Platform, ActionSheetIOS} from 'react-native';
import {Text, Button, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../components/SafeScreen';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const AIRecommendationScreen = () => {
  const navigation = useNavigation();
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const handleCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      // Handle the captured image
      console.log(result.assets[0]);
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      // Handle the selected image
      console.log(result.assets[0]);
    }
  };

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Picture', 'Select Picture(s)'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            handleCamera();
          } else if (buttonIndex === 2) {
            handleGallery();
          }
        },
      );
    } else {
      setShowImagePickerModal(true);
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

export default AIRecommendationScreen; 
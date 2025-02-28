import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import { NavigationProp } from '../types/types';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentStep] = useState(1);

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((step) => (
          <View
            key={step}
            style={[
              styles.progressBar,
              {
                backgroundColor: step <= currentStep ? '#843CA7' : '#E0E0E0', // Updated accent color
                width: (width - 48) / 5 - 4,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        {renderProgressBar()}

        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            AI analyzes and catalogs your clothes
          </Text>

          <View style={styles.imageContainer}>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <View style={styles.colorDot} />
                <Text style={styles.tagText}>Brown</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Corduroy Collar</Text>
              </View>
              <View style={styles.tag}>
                <View style={styles.colorDot} />
                <Text style={styles.tagText}>Dark Green</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Zipper closure</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Loose-fitting</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.getStartedText}>Get started</Text>
          </Pressable>

          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>I already have an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Updated background color
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  progressBar: {
    height: 6, // Increased thickness
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32, // Adjusted for better readability
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 48,
    color: '#333', // Slightly darker text for better contrast
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  tag: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#843CA7', // Updated accent color
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 16,
  },
  getStartedButton: {
    backgroundColor: '#843CA7', // Updated accent color
    padding: 16,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    padding: 16,
    borderRadius: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#843CA7', // Updated accent color
  },
  loginText: {
    color: '#843CA7', // Updated accent color
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelfieAnalysisScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Title & Description */}
      <Text style={styles.title}>It’s time to unlock your style formula!</Text>
      <Text style={styles.description}>
        With a selfie, we will analyze your facial features and complexion to determine your 
        color type and style type that are the key to your style formula.
      </Text>
      <Text style={styles.subDescription}>
        We already know your body type – it will indicate what will fit the figure.
      </Text>

      {/* Illustration */}
      <Image 
        source={require('../../assets/selfie.png')} // Replace with actual file path
        style={styles.image}
      />

      {/* Continue Button */}
      <Pressable 
        style={styles.button}           
        onPress={() => navigation.navigate('InstructionsScreen')}
      >
        <Text style={styles.buttonText}>CONTINUE</Text>
      </Pressable>
    </View>
  );
};

export default SelfieAnalysisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',  // Updated background color
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 8,
  },
  subDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#843CA7',  // Updated to accent color
    paddingVertical: 16,
    borderRadius: 32,  // More rounded button
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

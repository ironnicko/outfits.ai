import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../../components/SafeScreen';
import { NavigationProp } from '../../types/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  
  // Welcome screen content for each page
  const pages = [
    {
      title: "Welcome to Your Digital Wardrobe",
      description: "Organize, discover, and create amazing outfits with the power of AI",
      icon: "hanger",
    },
    {
      title: "AI-Powered Outfit Suggestions",
      description: "Get personalized outfit recommendations based on your style, weather, and occasions",
      icon: "tshirt-crew",
    },
    {
      title: "Color Analysis",
      description: "Discover which colors work best for your skin tone and personal style",
      icon: "palette",
    },
    {
      title: "Smart Shopping",
      description: "Find new pieces that complement your existing wardrobe",
      icon: "shopping",
    }
  ];

  // Auto-switch pages
  useEffect(() => {
    const interval = setInterval(() => {
      fadeOut(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
        fadeIn();
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  const fadeOut = (onComplete: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(onComplete);
  };
  
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePageChange = (index: number) => {
    fadeOut(() => {
      setCurrentPage(index);
      fadeIn();
    });
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <Pressable 
            key={index}
            onPress={() => handlePageChange(index)}
          >
            <View 
              style={[
                styles.dot, 
                { backgroundColor: currentPage === index ? '#843CA7' : '#E0E0E0' }
              ]} 
            />
          </Pressable>
        ))}
      </View>
    );
  };

  const currentPageData = pages[currentPage];

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Animated.View style={[styles.pageContainer, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Icon name={currentPageData.icon} size={120} color="#843CA7" />
          </View>
          <Text style={styles.title}>{currentPageData.title}</Text>
          <Text style={styles.description}>{currentPageData.description}</Text>
        </Animated.View>

        {renderDots()}

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
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
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(132, 60, 167, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  buttonContainer: {
    gap: 16,
    marginTop: 'auto',
  },
  getStartedButton: {
    backgroundColor: '#843CA7',
    padding: 16,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
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
    borderColor: '#843CA7',
  },
  loginText: {
    color: '#843CA7',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
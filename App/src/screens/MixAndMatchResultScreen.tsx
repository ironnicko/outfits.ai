import React from 'react';
import { StyleSheet, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import SafeScreen from '../components/SafeScreen';

type RouteProps = RouteProp<RootStackParamList, 'MixAndMatchResult'>;

interface SimilarItem {
  id: string;
  imageUrl: string;
  url?: string;
}

interface MixAndMatchResponse {
  rating: number;
  imageUrl: string;
  recommendation: string;
  similarItems: SimilarItem[];
  explanation: string;
}

const MixAndMatchResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { result, imageUri } = route.params;

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#4A6741" />
        </TouchableOpacity>

        <Image 
          source={{ uri: imageUri }}
          style={styles.itemImage} 
          resizeMode="contain"
        />

        {renderStars(result.rating)}

        <Text style={styles.title}>Purchase recommendation</Text>

        <View style={styles.recommendationContainer}>
          <Icon 
            name={result.rating >= 3 ? "thumb-up" : "thumb-down"} 
            size={48} 
            color="#000" 
          />
          <Text style={styles.whyText}>Why?</Text>
        </View>

        <Text style={styles.explanation}>
          {result.explanation}
        </Text>

        {result.similarItems?.map((item, index) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.similarItemLink}
            onPress={() => item.url && navigation.navigate('ClothingDetail', { item })}
          >
            <Text style={styles.linkText}>this item</Text>
            {index < result.similarItems.length - 1 && 
              <Text style={styles.linkText}>, </Text>
            }
            {index === result.similarItems.length - 2 && 
              <Text style={styles.linkText}>and </Text>
            }
          </TouchableOpacity>
        ))}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  itemImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginTop: 48,
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  recommendationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  whyText: {
    fontSize: 20,
    marginTop: 8,
  },
  explanation: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  similarItemLink: {
    flexDirection: 'row',
  },
  linkText: {
    color: '#4A6741',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default MixAndMatchResultScreen; 
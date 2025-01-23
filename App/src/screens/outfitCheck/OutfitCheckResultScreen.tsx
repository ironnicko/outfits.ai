import React from 'react';
import { StyleSheet, View, Image, Pressable, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import SafeScreen from '../../components/SafeScreen';

type RouteProps = RouteProp<RootStackParamList, 'OutfitCheckResult'>;

const OutfitCheckResultScreen = () => {
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
            color="#4A6741"
          />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name="chevron-left" 
            size={24} 
            color="#000" 
            onPress={() => navigation.goBack()} 
          />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Image 
            source={{ uri: imageUri }} 
            style={styles.outfitImage} 
            resizeMode="contain"
          />

          {renderStars(result.Score)}

          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackSection}>
              <Icon name="check-circle" size={24} color="#4A6741" />
              <Text style={styles.feedbackTitle}>Doing Well</Text>
              <Text style={styles.feedbackText}>{result.DoingWell}</Text>
            </View>

            <View style={styles.feedbackSection}>
              <Icon name="alert-circle" size={24} color="#FFA500" />
              <Text style={styles.feedbackTitle}>Could Be Improved</Text>
              <Text style={styles.feedbackText}>{result.NotDoingWell}</Text>
            </View>

            <View style={styles.feedbackSection}>
              <Icon name="lightbulb" size={24} color="#4A6741" />
              <Text style={styles.feedbackTitle}>Suggestions</Text>
              <Text style={styles.feedbackText}>{result.Improvements}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.uploadButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Upload another picture</Text>
          </Pressable>
        </View>
      </View>
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
    justifyContent: 'space-between',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  outfitImage: {
    width: '100%',
    height: 400,
    marginBottom: 24,
    borderRadius: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  feedbackContainer: {
    gap: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  feedbackSection: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  feedbackText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  uploadButton: {
    backgroundColor: '#4A6741',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OutfitCheckResultScreen; 
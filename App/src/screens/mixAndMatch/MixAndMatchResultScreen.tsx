import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList, 
  ScrollView,
  StatusBar,
  Animated
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, RootStackParamList } from '../../types/types';
import SafeScreen from '../../components/SafeScreen';
import { Clothes } from '../../store/clothingStore';
import ClothingCard from '../../components/ClothingCard';

type RouteProps = RouteProp<RootStackParamList, 'MixAndMatchResult'>;

const MixAndMatchResultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { data, imageURI } = route.params;
  const screenWidth = Dimensions.get('window').width;
  const padding = 16;
  const gap = 20;
  const numColumns = 2;
  const cardWidth = (screenWidth - (padding * 5) - (gap * (numColumns - 1))) / numColumns;

  const isGoodMatch = data.rating > 3;

  const renderItem = ({ item } : {item : Clothes}) => (
    <View style={[styles.gridItem, { width: cardWidth }]}>
      <ClothingCard
        imageUrl={item.url || ""}
        onPress={() => {
          navigation.navigate('ClothingDetail', { item });
        }}
        onLongPress={() => {}}
      />
    </View>
  );

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={32}
            color={isGoodMatch ? "#843CA7" : "#8E8E8E"}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="chevron-left" 
          size={30} 
          iconColor="#843CA7"
          style={styles.backButton}
          onPress={() => navigation.goBack()} 
        />
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={{ width: 48 }} /> 
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Result Overview Section - Includes Image and Rating */}
        <View style={styles.resultOverviewContainer}>
          <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: imageURI }}
                style={styles.itemImage} 
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            {renderStars(data.rating)}
            <Text style={[
              styles.ratingText, 
              { color: isGoodMatch ? "#4CAF50" : "#D32F2F" }
            ]}>
              {isGoodMatch ? "Great Match!" : "Not a Good Match"}
            </Text>
          </View>
        </View>

        {/* Recommendation Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Icon 
              name={isGoodMatch ? "check-circle" : "alert-circle"} 
              size={28} 
              color={isGoodMatch ? "#4CAF50" : "#D32F2F"} 
            />
            <Text style={styles.recommendationTitle}>Purchase Recommendation</Text>
          </View>
          
          <View style={[
            styles.recommendationBadge, 
            { backgroundColor: isGoodMatch ? "#E8F5E9" : "#FFEBEE" }
          ]}>
            <Icon 
              name={isGoodMatch ? "thumb-up" : "thumb-down"} 
              size={24} 
              color={isGoodMatch ? "#4CAF50" : "#D32F2F"} 
            />
            <Text style={[
              styles.recommendationBadgeText,
              { color: isGoodMatch ? "#2E7D32" : "#C62828" }
            ]}>
              {isGoodMatch ? "Go For It!" : "Consider Other Options"}
            </Text>
          </View>
          
          <Text style={styles.explanationHeading}>Why?</Text>
          <Text style={styles.explanation}>
            {data.explanation}
          </Text>
        </View>

        {/* Compatible Items Section */}
        <View style={styles.compatibleSection}>
          <Text style={styles.sectionTitle}>Goes Well With</Text>
          <Text style={styles.sectionSubtitle}>
            {isGoodMatch 
              ? "This item complements these pieces in your wardrobe:" 
              : "If you still want to buy it, it would only go with these pieces:"}
          </Text>
          
          {data.clothes.length > 0 ? (
            <FlatList
              data={data.clothes}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()} 
              contentContainerStyle={styles.grid} 
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          ) : (
            <View style={styles.noItemsContainer}>
              <Icon name="alert" size={32} color="#843CA7" />
              <Text style={styles.noItemsText}>
                This doesn't match with any items in your wardrobe.
              </Text>
            </View>
          )}
        </View>
        
        {/* Bottom Button */}
        <TouchableOpacity 
          style={styles.bottomButton}
          onPress={() => navigation.navigate('MixAndMatch')}
        >
          <Text style={styles.bottomButtonText}>Analyze Another Item</Text>
        </TouchableOpacity>
        
        {/* Bottom Padding */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#843CA7',
  },
  backButton: {
    marginLeft: -8,
  },
  
  // Result Overview Section
  resultOverviewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 16,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  itemImage: {
    width: 250,
    height: 250,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Recommendation Card
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#843CA7',
    marginLeft: 12,
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  recommendationBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  explanationHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  
  // Compatible Items Section
  compatibleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    paddingVertical: 8,
  },
  gridItem: {
    marginRight: 12,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  noItemsContainer: {
    backgroundColor: 'rgba(132, 60, 167, 0.08)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noItemsText: {
    color: '#843CA7',
    marginLeft: 12,
    flex: 1,
  },
  
  // Alternative Suggestion
  alternativeContainer: {
    backgroundColor: '#F0E9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#843CA7',
    marginBottom: 12,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  alternativeButtonText: {
    color: '#843CA7',
    fontWeight: '500',
    marginRight: 8,
  },
  
  // Bottom Button
  bottomButton: {
    backgroundColor: '#843CA7',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MixAndMatchResultScreen;
import React from 'react';
import { StyleSheet, View, Image, Dimensions, FlatList, ScrollView } from 'react-native';
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
            color="#843CA7"
          />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton 
            icon="chevron-left" 
            size={24} 
            iconColor="#843CA7"
            onPress={() => navigation.goBack()} 
          />
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageURI }}
            style={styles.itemImage} 
            resizeMode="contain"
          />
        </View>

        {renderStars(data.rating)}

        <Text style={styles.title}>Purchase Recommendation</Text>

        <View style={styles.recommendationContainer}>
          <Icon 
            name={data.rating > 3 ? "thumb-up" : "thumb-down"} 
            size={48} 
            color={data.rating > 3 ? "#4CAF50" : "#D32F2F"} 
          />
          <Text style={styles.whyText}>Why?</Text>
        </View>

        <Text style={styles.title}>Goes Along With:</Text>
        <FlatList
          data={data.clothes}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()} 
          contentContainerStyle={styles.grid} 
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />

        <Text style={styles.explanation}>
          {data.explanation}
        </Text>
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
    paddingBottom: 8,
  },

  // Outfit Image with Shadow and Rounded Borders
  imageContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,

    // Shadow effect
    elevation: 5, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  itemImage: {
    width: 300,
    height: 300, 
    borderRadius: 16,
    alignSelf: 'center',
  },

  // Star Ratings
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },

  // Recommendation Section
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#843CA7',
    marginBottom: 16,
    textAlign: 'center',
  },
  recommendationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  whyText: {
    fontSize: 18,
    marginTop: 8,
    color: '#333',
  },

  // Explanation Text
  explanation: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },

  // Grid for Clothes
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

    // Shadow effect for grid items
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default MixAndMatchResultScreen;

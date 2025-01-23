import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
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
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#4A6741" />
        </TouchableOpacity>

        <Image 
          source={{ uri: imageURI }}
          style={styles.itemImage} 
          resizeMode="contain"
        />

        {renderStars(data.rating)}

        <Text style={styles.title}>Purchase recommendation</Text>

        <View style={styles.recommendationContainer}>
          <Icon 
            name={data.rating > 3 ? "thumb-up" : "thumb-down"} 
            size={48} 
            color="#000" 
          />
          <Text style={styles.whyText}>Why?</Text>
        </View>

        <Text style={styles.title}>Goes along with :</Text>
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
    backgroundColor: '#fff',
    padding: 16,
    // alignItems: 'center',
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
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MixAndMatchResultScreen; 
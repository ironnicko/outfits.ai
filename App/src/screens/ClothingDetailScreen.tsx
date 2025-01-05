import React from 'react';
import { StyleSheet, View, Image, ScrollView, Pressable } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import SafeScreen from '../components/SafeScreen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';


type RouteProps = RouteProp<RootStackParamList, 'ClothingDetail'>;

const ClothingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { item } = route.params;
  console.log(item.Tags)
  const renderTags = () => {
    const defaultTags = (item.Tags || []).map((tag) => tag.tag);
    defaultTags.push(item.color || "");
    defaultTags.push(item.type || "");
   
    
    return (
      <View style={styles.tagsContainer}>
        {defaultTags.map((tag, index) => (
          <Pressable key={index} style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </Pressable>
        ))}
      </View>
    );
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
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => console.log('Edit mode')}
          />
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.url || '' }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {`${item.color || 'White'} ${item.type || 'clothing item'}`}
          </Text>
          {renderTags()}
        </ScrollView>
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
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  descriptionContainer: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
  },
});

export default ClothingDetailScreen; 
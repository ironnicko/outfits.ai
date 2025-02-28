import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SafeScreen from '../../components/SafeScreen';
import type { RootStackParamList } from '../../types/types';
import { useClothingStore, Clothes } from '../../store/clothingStore';
import { SelectedClothing } from './GenerateOutfitsScreen';

type RouteProps = RouteProp<RootStackParamList, 'SelectClothingItem'>;

const SelectClothingItem = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { type, onSelect } = route.params;
  const clothes = useClothingStore<Clothes[]>((state) => state.clothes);
  const [selectedItem, setSelectedItem] = useState<SelectedClothing>();

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / numColumns; // 48 = padding and gaps

  const renderItemFunc = (item: SelectedClothing) => {
    return (
      <Pressable
        style={[
          styles.itemContainer,
          { width: itemWidth },
          selectedItem === (item.ID || '') && styles.selectedItemContainer,
        ]}
        onPress={() => {
          setSelectedItem(item);
          onSelect(item);
          navigation.goBack();
        }}>
        <Image source={{ uri: item.url || " " }} style={styles.itemImage} />
        {selectedItem === (item.ID || '') && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.title}>
            Select from my wardrobe
          </Text>
        </View>

        <FlatList
          data={clothes.filter((item) => item.type === type)}
          renderItem={({ item }) => renderItemFunc(item)}
          keyExtractor={(item: Clothes) => item.ID || " "}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Updated Background
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,

  },
  title: {
    color: '#843CA7', // Accent Color
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
  },

  /* GRID CONTAINER */
  gridContainer: {
    padding: 16,
    gap: 8,
  },

  /* CLOTHING ITEM */
  itemContainer: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5, // Shadow for Android
  },

  selectedItemContainer: {
    borderWidth: 2,
    borderColor: '#843CA7', // Accent color border when selected
  },

  /* IMAGE STYLING */
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },

  /* CHECKMARK */
  checkmark: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#843CA7',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SelectClothingItem;

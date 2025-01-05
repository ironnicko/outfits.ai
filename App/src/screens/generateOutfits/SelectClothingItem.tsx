import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import SafeScreen from '../../components/SafeScreen';
import type {RootStackParamList} from '../../types/types';
import { useClothingStore, Clothes } from '../../store/clothingStore';
import { SelectedClothing } from './GenerateOutfitsScreen';

type RouteProps = RouteProp<RootStackParamList, 'SelectClothingItem'>;


const SelectClothingItem = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const {type, onSelect} = route.params;
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
        {width: itemWidth},
        selectedItem === (item.ID || '') && styles.selectedItemContainer,
      ]}
      onPress={() => {
        setSelectedItem(item);
        onSelect(item);
        navigation.goBack();
      }}>
      <Image source={{uri: item.url || " "}} style={styles.itemImage} />
      {selectedItem === (item.ID || '') && (
        <View style={styles.checkmark}>
        </View>
      )}
    </Pressable>
  )};

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
          data={clothes.filter(item => item.type === type)}
          renderItem={({item} ) => renderItemFunc(item)}
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: {
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  gridContainer: {
    padding: 16,
    gap: 8,
  },
  itemContainer: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    margin: 4,
  },
  selectedItemContainer: {
    borderWidth: 2,
    borderColor: '#4A6741',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  checkmark: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#4A6741',
    borderRadius: 12,
    padding: 4,
  },
});

export default SelectClothingItem; 
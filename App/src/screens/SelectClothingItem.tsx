import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {Text, IconButton, Icon} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import type {RootStackParamList} from '../navigation/types';

type RouteProps = RouteProp<RootStackParamList, 'SelectClothingItem'>;

// Temporary mock data - will be replaced with DB data
const mockClothingItems = [
  {
    id: '1',
    imageUrl: 'https://example.com/item1.jpg',
    type: 'top',
    name: 'Grey Sweater',
  },
  // Add more mock items
];

const SelectClothingItem = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const {type, title, onSelect} = route.params;
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / numColumns; // 48 = padding and gaps

  const renderItem = ({item}) => (
    <Pressable
      style={[
        styles.itemContainer,
        {width: itemWidth},
        selectedItem === item.id && styles.selectedItemContainer,
      ]}
      onPress={() => {
        setSelectedItem(item.id);
        onSelect(item.id);
        navigation.goBack();
      }}>
      <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
      {selectedItem === item.id && (
        <View style={styles.checkmark}>
          <Icon name="check" size={24} color="#fff" />
        </View>
      )}
    </Pressable>
  );

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
          data={mockClothingItems.filter(item => item.type === type)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
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
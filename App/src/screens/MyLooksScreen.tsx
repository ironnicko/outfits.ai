import React from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import SafeScreen from '../components/SafeScreen';
import { useOutfitStore } from '../store/outfitStore';
import OutfitPreview from '../components/OutfitPreview';
import { useNavigation } from '@react-navigation/native';

const MyLooksScreen = () => {
  const navigation = useNavigation();
  const outfits = useOutfitStore(state => state.outfits);

  const renderOutfit = ({ item }) => (
    <Pressable 
      style={styles.outfitCard}
      onPress={() => navigation.navigate('OutfitPreview', {
        selectedItems: item.items,
        occasion: item.occasion
      })}>
      <OutfitPreview items={item.items} occasion={item.occasion} />
      <Text style={styles.occasionText}>{item.occasion || 'No occasion'}</Text>
      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </Pressable>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.title}>My Looks</Text>
        {outfits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text>No saved outfits yet</Text>
          </View>
        ) : (
          <FlatList
            data={outfits}
            renderItem={renderOutfit}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    color: '#4A6741',
  },
  outfitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  occasionText: {
    fontSize: 16,
    color: '#4A6741',
    padding: 16,
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default MyLooksScreen; 
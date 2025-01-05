import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SelectedClothing } from '../screens/generateOutfits/GenerateOutfitsScreen';

interface OutfitPreviewProps {
  items: SelectedClothing[];
  occasion?: string;
}


const OutfitPreview = ({ items, occasion }: OutfitPreviewProps) => {
  console.log(items)
  const getItemPosition = (type: string) => {
    switch (type) {
      case 'hat':
        return styles.hatPosition;
      case 'top':
        return styles.topPosition;
      case 'bottom':
        return styles.bottomPosition;
      case 'shoe':
        return styles.shoePosition;
      default:
        return {};
    }
  };
  return (
    <View style={styles.container}>
      {/* {occasion && (
        <Text style={styles.occasionText}>{occasion}</Text>
      )} */}
      <View style={styles.outfitContainer}>
        {(items || []).map((item: SelectedClothing, index: number) => {

          return (
          <View
            key={index}
            style={[styles.itemContainer, getItemPosition(( item.type) || "")]}>
            {(item.url) ? (
              <Image
                source={{ uri: ( item.url)}}
                style={styles.itemImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        )})}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  occasionText: {
    fontSize: 18,
    color: '#4A6741',
    marginBottom: 16,
  },
  outfitContainer: {
    width: '100%',
    height: 600,
    position: 'relative',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  itemContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  hatPosition: {
    top: '5%',
    left: '50%',
    transform: [{ translateX: -90 }],
  },
  topPosition: {
    top: '22%',
    left: '50%',
    transform: [{ translateX: -90 }],
  },
  bottomPosition: {
    top: '48%',
    left: '50%',
    transform: [{ translateX: -90 }],
  },
  shoePosition: {
    bottom: '5%',
    left: '50%',
    transform: [{ translateX: -90 }],
  },
});

export default OutfitPreview; 
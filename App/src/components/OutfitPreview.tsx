import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SavedOutfit } from '../store/outfitStore';
import { Clothes } from '../store/clothingStore';


interface OutfitPreviewProps {
  // Multiple Outfits or Single Outfit
  items: SavedOutfit | Clothes[];
  occasion?: string;
}

function isSavedOutfit(item: SavedOutfit | Clothes[]): item is SavedOutfit {
  return (
  (item as SavedOutfit).OutfitHat !== undefined ||
  (item as SavedOutfit).OutfitTop !== undefined|| 
  (item as SavedOutfit).Outfitbottom !== undefined ||
  (item as SavedOutfit).OutfitShoe !== undefined
  );
}

// Only for single outfit or list of SelectedClothing

const OutfitPreview = ({ items, occasion }: OutfitPreviewProps) => {
  var finalItems: Clothes[] = []


  if (isSavedOutfit(items)){
    if (items.OutfitHat?.url  != ''){
      finalItems.push(items.OutfitHat || {type : "hat"})
    }
    if (items.OutfitShoe?.url  != ''){
      finalItems.push(items.OutfitShoe || {type : "shoe"})
    }
    if (items.OutfitTop?.url  != ''){
      finalItems.push(items.OutfitTop || {type : "top"})
    }
    if (items.Outfitbottom?.url  != ''){
      finalItems.push(items.Outfitbottom || {type : "bottom"})
    }
  } else {
    finalItems = items
  }
  console.log(finalItems)
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
        {(finalItems).map((item: Clothes, index: number) => {

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
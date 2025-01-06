import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OutfitPreview from '../components/OutfitPreview';
import SafeScreen from '../components/SafeScreen';
import { SavedOutfit, useOutfitStore } from '../store/outfitStore';
import { RootStackParamList } from '../types/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SelectedClothing } from './generateOutfits/GenerateOutfitsScreen';
import { Clothes } from '../store/clothingStore';

type RouteProps = RouteProp<RootStackParamList, 'OutfitPreviewScreen'>;

const OutfitPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>()
//   this is for when we are selecting a particular article and want to generate/ or want to select items and just show outfit
  var {occasion, outfits } = route.params;   
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('window').width;
  const addOutfit = useOutfitStore(state => state.addOutfit);

  const handleSaveToLooks = () => {
    console.log(outfits, occasion)
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / width);
    setActiveIndex(index);
  };

  const renderCarouselIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {outfits.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === activeIndex && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
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
          <IconButton
            icon="information"
            size={24}
            onPress={() => console.log('Show info')}
          />
        </View>

        <View style={styles.previewContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {outfits.map((item, index) => (
              <View key={index} style={[styles.slide, { width }]}>
                <OutfitPreview items={item} occasion={occasion} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.actionButtons}>
            <Pressable style={styles.ratingButton}>
                <Icon name="thumb-up-outline" size={24} color="#000" />
            </Pressable>
            <Pressable style={styles.ratingButton}>
                <Icon name="thumb-down-outline" size={24} color="#000" />
            </Pressable>
          </View>
          {renderCarouselIndicators()}
        </View>

        <View style={styles.bottomButtons}>
          <Pressable style={styles.saveButton} onPress={() => {}}>
            <Icon name="dots-horizontal" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save to Looks</Text>
          </Pressable>
          <Pressable style={styles.exportButton} onPress={() => {}}>
            <Text style={styles.exportButtonText}>Export</Text>
            <Icon name="export-variant" size={20} color="#000" />
          </Pressable>
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  ratingButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A6741',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#4A6741',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  slide: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OutfitPreviewScreen; 
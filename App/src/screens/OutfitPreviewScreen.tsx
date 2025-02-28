import React, { useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OutfitPreview from '../components/OutfitPreview';
import SafeScreen from '../components/SafeScreen';
import { RootStackParamList } from '../types/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { convertClothes, convertSavedOutfitUpload, isSavedOutfit, SavedOutfit, useOutfitStore } from '../store/outfitStore';
import { AuthState, useAuthStore } from '../store/authStore';
import { api } from '../utils/api';

type RouteProps = RouteProp<RootStackParamList, 'OutfitPreviewScreen'>;

const OutfitPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  var { occasion, outfits, saveToLooks } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('window').width;
  const setOutfits = useOutfitStore((state) => state.fetch);
  const token = useAuthStore((state: AuthState) => state.token);
  const [save, setSave] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const maintainOutfitSaved = useRef<Set<number>>(new Set<number>());

  const handleSaveAll = async () => {
    const upload = outfits.map(async (_, index) => {
      handleSave(index);
    });
    await Promise.all(upload);

    setSave(true);
    console.log('Uploaded Successfully!');
  };

  const handleSave = async (index: number) => {
    const outfit = outfits[index];
    const finalItem: SavedOutfit = !isSavedOutfit(outfit)
      ? convertClothes(outfit)
      : convertSavedOutfitUpload(outfit);
    finalItem.occasion = occasion;
    try {
      const res = await api.post('api/v1/outfit', finalItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status == 202) {
        await setOutfits(token || '');
        maintainOutfitSaved.current.add(index);
        setRefresh(!refresh);
      } else {
        throw Error("Upload wasn't successful");
      }
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
    }
  };

  const checkSaved = () => {
    return maintainOutfitSaved.current.has(activeIndex);
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
          <View key={index} style={[styles.indicator, index === activeIndex && styles.indicatorActive]} />
        ))}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="chevron-left" size={24} onPress={() => navigation.goBack()} />
          <IconButton
            icon="information"
            size={24}
            iconColor="#843CA7" // Accent Color Applied
            onPress={() =>
              console.log(isSavedOutfit(outfits[activeIndex]) ? outfits[activeIndex].description : '')
            }
          />
        </View>

        <View style={styles.previewContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            {outfits.map((item, index) => (
              <View key={index} style={[styles.slide, { width }]}>
                <OutfitPreview items={item} occasion={occasion} />
              </View>
            ))}
          </ScrollView>
          {outfits.length > 1 ? renderCarouselIndicators() : <></>}
        </View>
      </View>

      <View style={styles.bottomButtons}>
        {saveToLooks ? (
          <>
            <Pressable
              style={styles.saveButton}
              onPress={handleSaveAll}
              disabled={maintainOutfitSaved.current.size === outfits.length || save}>
              <Icon name="dots-horizontal" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {maintainOutfitSaved.current.size === outfits.length || save ? 'Saved' : 'Save All'}
              </Text>
            </Pressable>
            <Pressable
              style={styles.exportButton}
              onPress={() => handleSave(activeIndex)}
              disabled={checkSaved() || save}>
              <Text style={styles.exportButtonText}>
                {checkSaved() || save ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Updated Background
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 4, // Shadow Effect Added
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#843CA7', // Accent Color
    padding: 16,
    borderRadius: 32, // Large Rounded Buttons
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
    borderRadius: 32, // Large Rounded Buttons
    borderWidth: 1.5,
    borderColor: '#843CA7', // Accent Color for Border
    gap: 8,
  },
  exportButtonText: {
    color: '#843CA7', // Accent Color for Text
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
    backgroundColor: '#843CA7', // Accent Color for Active Indicator
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

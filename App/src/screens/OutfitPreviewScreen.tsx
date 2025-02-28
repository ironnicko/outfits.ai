import React, { useRef, useState } from 'react';
import { 
  StyleSheet, View, Pressable, Dimensions, ScrollView, Modal, TouchableWithoutFeedback 
} from 'react-native';
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

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  
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
            icon="information-outline"
            size={24}
            iconColor="#843CA7"
            onPress={() => {
              const description = isSavedOutfit(outfits[activeIndex]) 
                ? outfits[activeIndex].description 
                : "No description available";
              setModalText(description);
              setModalVisible(true);
            }}
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

      {/* Description Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalText}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    elevation: 4,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#843CA7',
    padding: 16,
    borderRadius: 32,
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
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#843CA7',
    gap: 8,
  },
  exportButtonText: {
    color: '#843CA7',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    maxWidth: '80%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default OutfitPreviewScreen;

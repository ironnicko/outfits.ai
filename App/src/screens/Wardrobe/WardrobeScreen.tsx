import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  ActionSheetIOS,
  Platform,
  Dimensions,
  RefreshControl,
  FlatList,
  Alert,
  Modal, // <--- Use RN's built-in Modal for Android image picker
  Text as RNText,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper'; // Remove if you don't use react-native-paper
import SafeScreen from '../../components/SafeScreen';
import ClothingCard from '../../components/ClothingCard';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { api } from '../../utils/api';
import { AuthState, useAuthStore } from '../../store/authStore';
import { Clothes, useClothingStore } from '../../store/clothingStore';
import { useNavigation } from '@react-navigation/native';
import { LoadingScreen } from '../../components/LoadingScreen';
import { NavigationProp } from '../../types/types';
import MyLooksScreen from './MyLooksScreen';

const WardrobeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [activeTab, setActiveTab] = useState<'Pieces' | 'Outfits'>('Pieces');

  // For multi-select filters
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterColor, setFilterColor] = useState<string[]>([]);

  // For dropdown states
  const [dropdownVisible, setDropdownVisible] = useState<'type' | 'color' | null>(null);

  // For loading & refreshing
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const check = useRef(true);

  // For image picker on Android
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // Clothing store
  const fetchClothes = useClothingStore((state) => state.fetch);
  const clothes = useClothingStore((state) => state.clothes);
  const token = useAuthStore((state: AuthState) => state.token);

  // On mount
  useEffect(() => {
    loadClothes();
    if (check.current) {
      const checkInterval = setInterval(async () => {
        const getClothes = await fetchClothes(token || '');
        console.log('Checking clothes...');
        if (getClothes.every((c) => !!c.url)) {
          check.current = false;
          clearInterval(checkInterval);
        }
      }, 2500);
      return () => clearInterval(checkInterval);
    }
  }, [refresh]);

  const loadClothes = async () => {
    await fetchClothes(token || '');
    setLoading(false);
  };

  // Unique type & color
  const uniqueTypes = useMemo(
    () => [...new Set(clothes.map((item) => item.type))].filter(Boolean) as string[],
    [clothes]
  );
  const uniqueColors = useMemo(
    () => [...new Set(clothes.map((item) => item.color))].filter(Boolean) as string[],
    [clothes]
  );

  // Upload handlers
  const handleUpload = async (file: Asset) => {
    const formData = new FormData();
    const image = {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg',
    };
    formData.append('file', image);
    try {
      await api.post('/api/v1/clothing', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err: any) {
      console.error('Upload error:', err.message);
    }
  };

  const handleCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 1 });
    if (result.assets && result.assets[0]) {
      setLoading(true);
      check.current = true;
      await handleUpload(result.assets[0]);
      setLoading(false);
      setRefresh(!refresh);
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 5, quality: 1 });
    if (result.assets) {
      setLoading(true);
      check.current = true;
      const uploads = result.assets.map((f) => handleUpload(f));
      await Promise.allSettled(uploads);
      setLoading(false);
      setRefresh(!refresh);
    }
  };

  // iOS action sheet
  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Picture', 'Select Picture(s)'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleCamera();
          else if (buttonIndex === 2) handleGallery();
        }
      );
    } else {
      setShowImagePickerModal(true);
    }
  };

  // Deletion
  const handleDeleteItem = (itemId: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await api.delete(`/api/v1/clothing/${itemId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setRefresh(!refresh);
          } catch (error) {
            console.error('Delete error:', error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // Toggle multi-select filters
  const toggleFilter = (category: 'type' | 'color', value: string) => {
    if (category === 'type') {
      setFilterType((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setFilterColor((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  // Filter clothes
  const filteredClothes = useMemo(() => {
    return clothes.filter((item) => {
      const matchesType = filterType.length === 0 || filterType.includes(item.type);
      const matchesColor = filterColor.length === 0 || filterColor.includes(item.color);
      return matchesType && matchesColor;
    });
  }, [clothes, filterType, filterColor]);

  // Render
  const screenWidth = Dimensions.get('window').width;
  const padding = 16;
  const gap = 8;
  const numColumns = 2;
  const cardWidth = (screenWidth - padding * 2 - gap * (numColumns - 1)) / numColumns;
  const clothingCount = clothes.length;

  const renderItem = ({ item }: { item: Clothes }) => (
    <View style={[styles.gridItem, { width: cardWidth }]}>
      {!item.url ? (
        <LoadingScreen />
      ) : (
        <ClothingCard
          imageUrl={item.url || ''}
          onPress={() => navigation.navigate('ClothingDetail', { item })}
          onLongPress={() => handleDeleteItem(item.ID || '')}
        />
      )}
    </View>
  );

  return (
    <SafeScreen>
      {/* Tabs */}
      <View style={styles.topBarContainer}>
        <Pressable
          style={[styles.topBarItem, activeTab === 'Pieces' && styles.topBarItemActive]}
          onPress={() => setActiveTab('Pieces')}
        >
          <RNText style={[styles.topBarText, activeTab === 'Pieces' && styles.topBarTextActive]}>
            Pieces
          </RNText>
        </Pressable>
        <Pressable
          style={[styles.topBarItem, activeTab === 'Outfits' && styles.topBarItemActive]}
          onPress={() => setActiveTab('Outfits')}
        >
          <RNText style={[styles.topBarText, activeTab === 'Outfits' && styles.topBarTextActive]}>
            Fits
          </RNText>
        </Pressable>
      </View>

      {activeTab === 'Pieces' && (
        <View style={styles.container}>
          {/* Filter Row */}
          <View style={styles.filterRow}>
            {/* Type Filter */}
            <View style={styles.dropdownContainer}>
              <Pressable
                style={styles.filterButton}
                onPress={() => setDropdownVisible(dropdownVisible === 'type' ? null : 'type')}
              >
                <RNText style={styles.filterButtonText}>
                  {filterType.length > 0 ? filterType.join(', ') : 'Type'}
                </RNText>
              </Pressable>
              {dropdownVisible === 'type' && (
                <View style={styles.dropdownList}>
                  {uniqueTypes.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownItem,
                        filterType.includes(option) && styles.selectedDropdownItem,
                      ]}
                      onPress={() => toggleFilter('type', option)}
                    >
                      <RNText style={styles.dropdownItemText}>{option}</RNText>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Color Filter */}
            <View style={styles.dropdownContainer}>
              <Pressable
                style={styles.filterButton}
                onPress={() => setDropdownVisible(dropdownVisible === 'color' ? null : 'color')}
              >
                <RNText style={styles.filterButtonText}>
                  {filterColor.length > 0 ? filterColor.join(', ') : 'Color'}
                </RNText>
              </Pressable>
              {dropdownVisible === 'color' && (
                <View style={styles.dropdownList}>
                  {uniqueColors.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownItem,
                        filterColor.includes(option) && styles.selectedDropdownItem,
                      ]}
                      onPress={() => toggleFilter('color', option)}
                    >
                      <RNText style={styles.dropdownItemText}>{option}</RNText>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Clothing Grid */}
          {loading ? (
            <LoadingScreen />
          ) : (
            <FlatList
              data={filteredClothes}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.grid}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={() => setRefresh(!refresh)} />
              }
              numColumns={2}
              ListHeaderComponent={
                clothingCount < 10 ? (
                  <View style={styles.addPieceContainer}>
                    <Pressable style={styles.addPieceCard} onPress={handleImagePicker}>
                      <RNText style={styles.addPieceText}>+ Add Piece</RNText>
                      <RNText style={styles.addPieceSubText}>
                        {clothingCount}/10 Free pieces
                      </RNText>
                    </Pressable>
                    <Pressable style={styles.upgradeButton}>
                      <RNText style={styles.upgradeButtonText}>Upgrade</RNText>
                    </Pressable>
                  </View>
                ) : null
              }
            />
          )}

          {/* Floating Action Button (camera) */}
          <FAB
            icon="camera"
            style={styles.fab}
            color="#fff"
            size="medium"
            onPress={handleImagePicker}
            customSize={56}
            disabled={loading}
          />

          {/* Android Image Picker as a RN Modal (if needed) */}
          <Modal
            visible={showImagePickerModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowImagePickerModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    handleCamera();
                    setShowImagePickerModal(false);
                  }}
                >
                  <Icon name="camera" size={24} color="#843CA7" />
                  <RNText style={styles.modalOptionText}>Take Picture</RNText>
                </Pressable>

                <Pressable
                  style={styles.modalOption}
                  onPress={async () => {
                    await handleGallery();
                    setShowImagePickerModal(false);
                  }}
                >
                  <Icon name="image-multiple" size={24} color="#843CA7" />
                  <RNText style={styles.modalOptionText}>Select Picture(s)</RNText>
                </Pressable>

                <Pressable
                  style={[styles.modalOption, styles.cancelOption]}
                  onPress={() => setShowImagePickerModal(false)}
                >
                  <RNText style={styles.cancelText}>Cancel</RNText>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {activeTab === 'Outfits' && (
        <View style={styles.container}>
          <MyLooksScreen />
        </View>
      )}
    </SafeScreen>
  );
};

export default WardrobeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  topBarItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  topBarItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#843CA7',
  },
  topBarText: {
    fontSize: 16,
    color: '#666',
  },
  topBarTextActive: {
    color: '#843CA7',
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownContainer: {
    position: 'relative',
    width: '40%',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#843CA7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  dropdownList: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 200,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDropdownItem: {
    backgroundColor: '#EDE7F6',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  gridItem: {
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addPieceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
  },
  addPieceCard: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#843CA7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addPieceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#843CA7',
    marginBottom: 4,
  },
  addPieceSubText: {
    fontSize: 12,
    color: '#843CA7',
  },
  upgradeButton: {
    backgroundColor: '#843CA7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#843CA7',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#843CA7',
  },
  cancelOption: {
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
});
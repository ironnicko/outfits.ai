import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable, ActionSheetIOS, Platform, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Searchbar, FAB, Portal, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../components/SafeScreen';
import ClothingCard from '../components/ClothingCard';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { api } from '../utils/api';
import { AuthState, useAuthStore } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';
import { useClothingStore } from '../store/clothingStore';

type Category = {
  Icon: string;
  Label: string;
  ID: string;
};


const categories: Category[] = [
  { ID: 'all', Icon: 'hanger', Label: 'All' },
  { ID: 'top', Icon: 'tshirt-crew', Label: 'Tops' },
  { ID: 'bottom', Icon: 'lingerie', Label: 'Bottoms' },
  { ID: 'shoe', Icon: 'shoe-formal', Label: 'Shoes' },
  { ID: 'bags', Icon: 'briefcase', Label: 'Bags' },
  { ID: 'accessories', Icon: 'hat-fedora', Label: 'Accessories' },
];

const WardrobeScreen = () => {


  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const clothes = useClothingStore((state) => state.clothes);
  const setClothes = useClothingStore((state) => state.fetch)
  const [token, setToken] = useState(useAuthStore((state: AuthState) => state.token));


  const fetchClothes = async () => {
    if (!token) {
      const getToken = await getTokenLocal();
      setToken(getToken || '')
    }

    setClothes(token || "");
    setLoading(false);
  };

  useEffect(() => {
    fetchClothes()
  }, [refresh])
  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.ID] = (category.ID != 'all' ? clothes.filter(item => item.Type === category.ID).length : clothes.length);
      return acc;
    }, {} as Record<string, number>);
  }, [clothes]);


  const totalItems = useMemo(() => {
    return clothes.length;
  }, [clothes]);


  const filteredClothes = useMemo(() => {
    return clothes.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.Type === selectedCategory;
      const matchesSearch = (item.Type || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && (searchQuery === '' || matchesSearch);
    });
  }, [selectedCategory, searchQuery, clothes]);

  const handleImagePicker = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Picture', 'Select Picture(s)'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            handleCamera();
          } else if (buttonIndex === 2) {
            handleGallery();
          }
        },
      );
    } else {

      setShowImagePickerModal(true);
    }
  };

  const handleUpload = async (file: Asset) => {
    const formData = new FormData();
    const image = {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg'
    }
    formData.append('file', image);

    try {
      const res = await api.post(
        '/api/v1/clothing/add-clothing',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload successful', res.data);
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
    }
  }

  const handleCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {

      console.log(result.assets[0]);
      setLoading(true)
      await handleUpload(result.assets[0])
      setLoading(false)
      setRefresh(!refresh)
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0,
      quality: 1,
    });

    if (result.assets) {
      setLoading(true)
      console.log(result.assets)
      for (const file of result.assets){
        await handleUpload(file)
      }
      setLoading(false)
      setRefresh(!refresh)
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const padding = 16;
  const gap = 8;
  const numColumns = 2;
  const cardWidth = (screenWidth - (padding * 2) - (gap * (numColumns - 1))) / numColumns;

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="hanger" size={24} color="#4A6741" />
            <Text variant="headlineMedium" style={styles.title}>
              My Wardrobe
            </Text>
          </View>
          <Icon name="chevron-down" size={24} color="#4A6741" />
        </View>

        {/* Categories */}
        <View style={styles.statsContainer}>
          <Text style={styles.totalCount}>{totalItems}</Text>
          <Text style={styles.totalLabel}>Total</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            >
            {categories.map((category) => (
              <Pressable
                key={category.ID}
                onPress={() => setSelectedCategory(category.ID)}
                style={[
                  styles.categoryBubble,
                  selectedCategory === category.ID && styles.activeCategory,
                ]}>
                <Icon

                  name={category.Icon}
                  size={24}
                  color={selectedCategory === category.ID ? '#4A6741' : '#666'}
                />
                <Text style={[
                  styles.categoryCount,
                  selectedCategory === category.ID && styles.activeCategoryText,
                ]}>
                  {categoryCounts[category.ID]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={(query: string) => {
              setSearchQuery(query);
            }}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="#4A6741"
          />
          <Pressable style={styles.filterButton}>
            <Icon name="star-outline" size={24} color="#4A6741" />
          </Pressable>
        </View>

        {/* Clothing Grid */}

        {/* Added Tags under Clothing Card */}

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="4A6741" />
            </View>
              ): (
          <ScrollView
            style={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => setRefresh(!refresh)}/>}
          >
            <View style={styles.grid}>
              {filteredClothes.map((item) => (
                <View
                  key={item.ID}
                  style={[styles.gridItem, { width: cardWidth }]}
                >
                  <ClothingCard
                    imageUrl={item.URL || ""}
                    onPress={() => {
                      // Need to create a card view
                      console.log('Clothing item pressed:', item.ID);
                    }}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )
        }

        <FAB
          icon="camera"
          style={styles.fab}
          color="#fff"
          size="medium"
          onPress={handleImagePicker}
          customSize={56}
          disabled={loading}
        />

        {Platform.OS === 'android' && (
          <Portal>
            <Modal
              visible={showImagePickerModal}
              onDismiss={() => setShowImagePickerModal(false)}
              contentContainerStyle={styles.modalContainer}>
              <Pressable
                style={styles.modalOption}
                onPress={() => {
                  handleCamera();
                  setShowImagePickerModal(false);
                }}>
                <Icon name="camera" size={24} color="#4A6741" />
                <Text style={styles.modalOptionText}>Take Picture</Text>
              </Pressable>

              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await handleGallery();
                  setShowImagePickerModal(false);
                }}>
                <Icon name="image-multiple" size={24} color="#4A6741" />
                <Text style={styles.modalOptionText}>Select Picture(s)</Text>
              </Pressable>

              <Pressable
                style={[styles.modalOption, styles.cancelOption]}
                onPress={() => setShowImagePickerModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </Modal>
          </Portal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#4A6741',
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  totalCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A6741',
  },
  totalLabel: {
    fontSize: 16,
    color: '#4A6741',
    marginBottom: 12,
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8ECE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeCategory: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A6741',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoContainer: {
    backgroundColor: '#F5F5F5',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoTitle: {
    color: '#4A6741',
    marginBottom: 8,
  },
  demoSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButton: {
    backgroundColor: '#4A6741',
    borderRadius: 24,
  },
  gridContainer: {
    flex: 1,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center'
  },
  activeCategoryText: {
    color: '#4A6741',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4A6741',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#4A6741',
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

export default WardrobeScreen; 
import React, {useState, useCallback, useMemo} from 'react';
import {StyleSheet, View, ScrollView, Pressable, ActionSheetIOS, Platform, Dimensions} from 'react-native';
import {Text, Searchbar, FAB, Portal, Modal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../components/SafeScreen';
import ClothingCard from '../components/ClothingCard';
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { api } from '../utils/api';
import { AuthState, useAuthStore } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';

type Category = {
  icon: string;
  label: string;
  id: string;
};

// Mock clothing data
const mockClothes = [
  { id: '1', type: 'upper', imageUrl: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F8b%2Fc9%2F8bc9d85f7c4fdb40c7a0abfb865ed50a175bfae4.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/fullscreen]' },
  { id: '2', type: 'upper', imageUrl: 'https://cdn2.iconfinder.com/data/icons/arrows-part-1/32/tiny-arrow-left-2-1024.png' },
  { id: '3', type: 'lower', imageUrl: 'https://example.com/pants1.jpg' },
  { id: '4', type: 'shoes', imageUrl: 'https://example.com/shoes1.jpg' },
  // Add more items as needed
];

const categories: Category[] = [
  {id: 'upper', icon: 'tshirt-crew', label: 'Tops'},
  {id: 'lower', icon: 'lingerie', label: 'Bottoms'},
  {id: 'shoes', icon: 'shoe-formal', label: 'Shoes'},
  {id: 'bags', icon: 'briefcase', label: 'Bags'},
  {id: 'accessories', icon: 'hat-fedora', label: 'Accessories'},
];

const WardrobeScreen = () => {
  const [file, setFile] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const token = useAuthStore((state: AuthState) => state.token) || getTokenLocal();
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Calculate category counts dynamically
  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = mockClothes.filter(item => item.type === category.id).length;
      return acc;
    }, {} as Record<string, number>);
  }, [mockClothes]);

  // Calculate total items from all clothes, not just filtered ones
  const totalItems = useMemo(() => {
    return mockClothes.length; // Direct count of all items
  }, [mockClothes]);

  // Filter clothes based on category and search query
  const filteredClothes = useMemo(() => {
    return mockClothes.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
      const matchesSearch = item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && (searchQuery === '' || matchesSearch);
    });
  }, [selectedCategory, searchQuery, mockClothes]);

  const handleImagePicker = () => {
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
      // For Android, you might want to use a custom modal or bottom sheet
      setShowImagePickerModal(true);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg'
    });
    formData.append('type', "full");
  
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
      // Handle the captured image
      console.log(result.assets[0]);
      setFile(result.assets[0]);
      handleUpload()
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0, // 0 means unlimited
      quality: 1,
    });

    if (result.assets) {
      // Handle the selected images
      console.log(result.assets[0]);
      setFile(result.assets[0]);
      handleUpload()
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
            style={styles.categoriesScroll}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={[
                  styles.categoryBubble,
                  selectedCategory === category.id && styles.activeCategory,
                ]}>
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.id ? '#4A6741' : '#666'}
                />
                <Text style={[
                  styles.categoryCount,
                  selectedCategory === category.id && styles.activeCategoryText,
                ]}>
                  {categoryCounts[category.id]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="#4A6741"
          />
          <Pressable style={styles.filterButton}>
            <Icon name="star-outline" size={24} color="#4A6741" />
          </Pressable>
        </View>

        {/* Demo Notice */}
        {/* <View style={styles.demoContainer}>
          <Text variant="titleLarge" style={styles.demoTitle}>
            This is a demo wardrobe
          </Text>
          <Text variant="bodyLarge" style={styles.demoSubtitle}>
            Would you like to start uploading your own items?
          </Text>
          <Button
            mode="contained"
            style={styles.demoButton}
            onPress={() => console.log('Deactivate Demo')}>
            Deactivate Demo
          </Button>
        </View> */}

        {/* Clothing Grid */}
        <ScrollView 
          style={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {filteredClothes.map((item) => (
              <View 
                key={item.id} 
                style={[styles.gridItem, { width: cardWidth }]}
              >
                <ClothingCard
                  imageUrl={item.imageUrl}
                  onPress={() => console.log('Clothing item pressed:', item.id)}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <FAB
          icon="camera"
          style={styles.fab}
          color="#fff"
          size="medium"
          onPress={handleImagePicker}
          customSize={56}
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
                onPress={() => {
                  handleGallery();
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
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, IconButton } from 'react-native-paper';
import { Clothes, Tag, useClothingStore } from '../../store/clothingStore';
import { api } from '../../utils/api';
import { AuthState, useAuthStore } from '../../store/authStore';
import { NavigationProp } from '../../types/types';


export interface SelectedClothing extends Clothes{
  Icon?: string;
  Size?: number;
}


const GenerateOutfitsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const token = useAuthStore((state: AuthState) => state.token)
  const [selectedItems, setSelectedItems] = useState<SelectedClothing[]>([
    // Initialize with default selected items
    { type: 'top' },
    { type: 'bottom' },
    { type: 'shoe' }
  ]);
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Select Occasion');
  const setClothes = useClothingStore((state) => state.fetch)
  const fetchClothes = async () => {
    setClothes(token || "");
    setLoading(false)
  };


  useEffect(() => {
      fetchClothes()
  }, [])
  const clothingItems: SelectedClothing[] = [
    { type: 'hat', Icon: 'hat-fedora', Size: 48 },
    { type: 'top', Icon: 'tshirt-crew', Size: 64 },
    { type: 'bottom', Icon: '../../assets/pants.svg', Size: 64 },
    { type: 'shoe', Icon: 'shoe-formal', Size: 48 },
  ];

  const handleClothingItemPress = (type: string) => {
    if (selectedItems.find((item: SelectedClothing) => item.type === type)) {
      navigation.navigate('SelectClothingItem', {
        type : type,
        onSelect: (clothing: SelectedClothing) => {
          setSelectedItems((prev: SelectedClothing[]) =>
            prev.map((item: SelectedClothing) =>
              item.type === type ? clothing : item,
            ),
          );
        },
      });
    } else {
      toggleItem(type);
    }
  };


  const toggleItem = (type: string) => {
    setSelectedItems((prev: SelectedClothing[]) =>
      prev.find(item => item.type === type)
        ? prev.filter(item => item.type !== type)
        : [...prev, { type }],
    );
  };

  // Check if any selected items have an itemId (meaning an article was selected)
  const hasAnySelectedArticle = selectedItems.some(item => item.ID);
  
  // Check if any selected items don't have an ID (meaning we can generate outfits)
  const hasUnselectedArticles = selectedItems.some(item => !item.ID);

  // Check if an occasion is selected (not the default text)
  const isOccasionSelected = selectedOccasion !== 'Select Occasion';

  const renderClothingItem = (item: SelectedClothing) => {
    const selectedItem = selectedItems.find(si => si.type === item.type);
    const isSelected = !!selectedItem;
    const hasWardrobe = !!selectedItem;
    const hasURL = !!selectedItem?.url;
  
    return (
      <Pressable
        key={item.type}
        onPress={() => handleClothingItemPress(item.type || "")}
        onLongPress={() => toggleItem(item.type || "")}
        style={[
          styles.clothingItem,
          isSelected && styles.selectedItem,
          hasWardrobe && styles.wardrobeItem,
        ]}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : hasURL ? (
          <View style={styles.selectedItemContent}>
            <Image source={{ uri: selectedItem.url || " " }} style={styles.selectedItemImage} />
            <View style={styles.checkmark}>
              <Icon name="check" size={16} color="#fff" />
            </View>
          </View>
        ) : item.type === "bottom" ? (
          <Image
            source={require("../../assets/pants.png")} // Load pants as normal image
            style={{ width: item.Size, height: item.Size, tintColor: isSelected ? "#fff" : "#843CA7" }}
          />
        ) : (
          <Icon name={item.Icon || ""} size={item.Size} color={isSelected ? "#fff" : "#843CA7"} />
        )}
      </Pressable>
    );
  };

  const handleGenerateOutfit = async () => {
    setLoading(true)

    if (selectedItems.length) {
      const pairWithArticles: {ID?: string, Tags: Tag[]} [] = [];
      const pairingArticles : string[] = [];
      for(let item of selectedItems){
        // Find out what clothing article needs to be queried
        if (item.Tags == undefined){
          pairingArticles.push(item.type || " ")
        } else {
          pairWithArticles.push({ID : item.ID, Tags: item.Tags })
        }
      }
      try {
        const res = await api.post(
          '/api/v1/outfit/generate-outfits',
          {
            articles : pairingArticles,
            occasion: selectedOccasion,
            pairWithArticles: pairWithArticles
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-type': 'application/json',
            },
          }
        );
        if (res.status != 200){
          throw Error(res.statusText)
        }
        const outfits = res.data
        // TODO: Add carousel in OutfitPreview and pass outfits as 'outfits'

        navigation.navigate('OutfitPreviewScreen', {
          saveToLooks: true,
          outfits: outfits,
          occasion: selectedOccasion,
        });
      } catch (error: any) {
          console.error('Upload error:', error.response?.data || error.message);
      } finally{
        setLoading(false);
      }
    }
  };

  const handleShowOutfit = () => {
    if (hasAnySelectedArticle) {
      navigation.navigate('OutfitPreviewScreen', {saveToLooks: true, occasion: selectedOccasion, outfits: [selectedItems]});
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>          
          <Text style={styles.headerText}>Long press to remove clothing items</Text>
        </View>

        <View style={styles.clothingContainer}>{clothingItems.map(renderClothingItem)}</View>

        <Pressable
          style={styles.occasionButton}
          disabled={loading}
          onPress={() =>
            navigation.navigate('OccasionSelect', {
              onSelect: (occasion: string) => setSelectedOccasion(occasion),
            })
          }
        >
          <Text variant="titleLarge" style={styles.occasionText}>
            {selectedOccasion}
          </Text>
          <Icon name="calendar" size={24} color="#843CA7" />
        </Pressable>

        <View style={styles.buttonContainer}>
          {hasAnySelectedArticle && (
            <Button
              mode="contained"
              style={[styles.button]}
              contentStyle={styles.buttonContent}
              disabled={loading}
              labelStyle={styles.buttonLabel}
              onPress={handleShowOutfit}>
              Show Outfit
              <Icon name="eye" size={24} color="#fff" style={styles.buttonIcon} />
            </Button>
          )}
          
          {hasUnselectedArticles && (
            <Button
              mode="contained"
              style={[
                styles.button,
                !isOccasionSelected && styles.buttonDisabled,
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={[
                styles.buttonLabel,
                !isOccasionSelected && styles.buttonLabelDisabled,
              ]}
              disabled={!isOccasionSelected || loading}
              onPress={async() => await handleGenerateOutfit()}>
              Generate Outfit
              <Icon 
                name="auto-fix" 
                size={24} 
                color={isOccasionSelected ? "#fff" : "rgba(255, 255, 255, 0.5)"} 
                style={styles.buttonIcon} 
              />
            </Button>
          )}
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignContent:'center'
  },
  headerText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'center',
  },
  clothingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  clothingItem: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E9D3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#843CA7',
  },
  wardrobeItem: {
    backgroundColor: '#843CA7',
  },
  occasionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  occasionText: {
    color: '#843CA7',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: '#843CA7',
    minHeight: 70,
  },
  buttonContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  buttonIcon: {
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabelDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  checkmark: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: '#843CA7',
    borderRadius: 8,
    padding: 4,
  },
  selectedItemContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  selectedItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    resizeMode: 'cover',
  },
});

export default GenerateOutfitsScreen;

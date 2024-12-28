import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Pressable, PermissionsAndroid, Platform, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../components/SafeScreen';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {Text, Button, IconButton} from 'react-native-paper';
import { Clothes } from '../store/clothingStore';



const GenerateOutfitsScreen = () => {


  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState<Clothes[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Select Occasion');
  const [weather, setWeather] = useState<string>('');

  const clothingItems = [
    {Type: 'hat', Icon: 'hat-fedora', Size: 48},
    {Type: 'upper', Icon: 'tshirt-crew', Size: 64},
    {Type: 'lower', Icon: 'lingerie', Size: 64}, // replace with some svg
    {Type: 'shoes', Icon: 'shoe-formal', Size: 48},
  ];

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        getLocation();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const fetchWeather = async (lat: number, lon: number) => {
    // try {
    //   const response = await fetch(
    //     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`,
    //   );
    //   const data = await response.json();
    //   setWeather(data.weather[0].main);
    // } catch (error) {
    //   console.error('Weather fetch error:', error);
    // }
    console.log('tried fetching weather, fix the api');
  };

  const handleClothingItemPress = (type: ClothingType) => {
    if (selectedItems.find(item => item.Type === type)) {
      navigation.navigate('SelectClothingItem', {
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1) + 's',
        onSelect: (ID: string) => {
          setSelectedItems(prev =>
            prev.map(item =>
              item.Type === type ? {...item, ID} : item,
            ),
          );
        },
      });
    } else {
      toggleItem(type);
    }
  };

  const toggleItem = (Type: ClothingType) => {
    setSelectedItems(prev =>
      prev.find(item => item.Type === Type)
        ? prev.filter(item => item.Type !== Type)
        : [...prev, {Type}],
    );
  };

  // Check if any selected items have an itemId (meaning an article was selected)
  const hasAnySelectedArticle = selectedItems.some(item => item.ID);
  
  // Check if any selected items don't have an ID (meaning we can generate outfits)
  const hasUnselectedArticles = selectedItems.some(item => !item.ID);

  // Check if an occasion is selected (not the default text)
  const isOccasionSelected = selectedOccasion !== 'Select Occasion';

  const renderClothingItem = (item: Clothes) => {
    const selectedItem = selectedItems.find(si => si.Type === item.Type);
    const isSelected = !!selectedItem;
    const hasWardrobe = !!selectedItem?.ID;

    return (
      <Pressable
        key={item.Type}
        onPress={() => handleClothingItemPress(item.Type)}
        onLongPress={() => toggleItem(item.Type)}
        style={[
          styles.clothingItem,
          isSelected && styles.selectedItem,
          hasWardrobe && styles.wardrobeItem,
        ]}>
        {hasWardrobe ? (
          <View style={styles.selectedItemContent}>
            <Image 
              // source={{ uri: selectedItem?.ID.URL }}
              style={styles.selectedItemImage}
            />
            <View style={styles.checkmark}>
              <Icon name="check" size={16} color="#fff" />
            </View>
          </View>
        ) : (
          <Icon
            name={item.Icon}
            size={item.Size}
            color={isSelected ? '#fff' : '#4A6741'}
          />
        )}
      </Pressable>
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
          <Text style={styles.headerText}>Long press to remove clothing items</Text>
        </View>

        {weather && (
          <Text style={styles.weatherText}>
            Current Weather: {weather}
          </Text>
        )}

        <View style={styles.clothingContainer}>
          {clothingItems.map(renderClothingItem)}
        </View>

        <Pressable 
          style={styles.occasionButton}
          onPress={() => navigation.navigate('OccasionSelect', {
            onSelect: (occasion: string) => setSelectedOccasion(occasion)
          })}>
          <Text variant="titleLarge" style={styles.occasionText}>
            {selectedOccasion}
          </Text>
          <Icon name="calendar" size={24} color="#4A6741" />
        </Pressable>

        <View style={styles.buttonContainer}>
          {hasAnySelectedArticle && (
            <Button
              mode="contained"
              style={[styles.button]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => console.log('Show outfit')}>
              Show Outfit
              <Icon name="eye" Size={24} color="#fff" style={styles.buttonIcon} />
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
              disabled={!isOccasionSelected}
              onPress={() => console.log('Generate outfits')}>
              Generate Outfits
              <Icon 
                name="auto-fix" 
                Size={24} 
                color={isOccasionSelected ? "#fff" : "#rgba(255, 255, 255, 0.5)"} 
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerText: {
    color: '#666',
    fontSize: 16,
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
    backgroundColor: '#E8ECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#4A6741',
  },
  occasionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  occasionText: {
    color: '#4A6741',
  },
  generateButton: {
    margin: 16,
    marginBottom: 32,
    borderRadius: 32,
    backgroundColor: '#4A6741',
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  weatherText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4A6741',
    marginTop: 16,
  },
  wardrobeItem: {
    backgroundColor: '#4A6741',
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
  checkmark: {
    position: 'absolute',
    right: 4,
    upper: 4,
    backgroundColor: '#4A6741',
    borderRadius: 8,
    padding: 4,
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
    backgroundColor: '#4A6741',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: -10,
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  buttonDisabled: {
    backgroundColor: '#4A6741',
    opacity: 0.5,
  },
  buttonLabelDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default GenerateOutfitsScreen; 
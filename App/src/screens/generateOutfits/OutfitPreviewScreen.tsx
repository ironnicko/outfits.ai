import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, View, Pressable, Dimensions, ScrollView, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import OutfitPreview from '../../components/OutfitPreview';
import SafeScreen from '../../components/SafeScreen';
import { RootStackParamList } from '../../types/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { convertClothes, convertSavedOutfitUpload, isSavedOutfit, SavedOutfit, useOutfitStore } from '../../store/outfitStore';
import { AuthState, useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { Animated, Easing } from 'react-native';
import Replicate from 'replicate';
import Config from "react-native-config";

// Configure Replicate client
// const REPLICATE_API_TOKEN = '';
const replicate = new Replicate({
  auth: Config.REPLICATE_API_TOKEN,
});
type RouteProps = RouteProp<RootStackParamList, 'OutfitPreviewScreen'>;
const OutfitPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  var { occasion, outfits, saveToLooks } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('window').width;
  const setOutfits = useOutfitStore((state) => state.fetch);
  const token = useAuthStore((state: AuthState) => state.token);
  const all_user_data = useAuthStore((state: AuthState) => state.all_data);
  const [save, setSave] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const maintainOutfitSaved = useRef<Set<number>>(new Set<number>());
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  
  // Try-on states
  const [showTryOn, setShowTryOn] = useState<{ [index: number]: boolean }>({});
  const [tryOnImages, setTryOnImages] = useState<{ [index: number]: string }>({});
  const [isLoadingTryOn, setIsLoadingTryOn] = useState<{ [index: number]: boolean }>({});
  const [progressAnims, setProgressAnims] = useState<{ [key: number]: Animated.Value }>({});
  const [fadeAnims, setFadeAnims] = useState<{ [key: number]: Animated.Value }>({});
  const [messageIndices, setMessageIndices] = useState<{ [key: number]: number }>({});
  const [showingTryOnPreview, setShowingTryOnPreview] = useState<{ [index: number]: boolean }>({});
  const [tryOnSteps, setTryOnSteps] = useState<{ [index: number]: string }>({});
  
  const messages = [
    "Analyzing outfit colors…",
    "Matching style preferences…",
    "Preparing virtual model…",
    "Finalizing your look!"
  ];
  
  const handleSave = async (index: number) => {
    const outfit = outfits[index];
    const finalItem: SavedOutfit = !isSavedOutfit(outfit)
      ? convertClothes(outfit)
      : convertSavedOutfitUpload(outfit);
    finalItem.occasion = occasion;
    finalItem.try_on_image = tryOnImages[index];
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
  
  // Function to request virtual try-on using Replicate
  const requestVirtualTryOn = async (garmentUrl: string, modelUrl: string, description: string = "", category: string = "upper_body") => {
    try {
      // Setup input for the Replicate model
      const input = {
        garm_img: garmentUrl,
        human_img: modelUrl,
        garment_des: description || "clothing item",
        category: category, // Add category parameter
        steps: 30,
        seed: 42,
        crop: false
      };
      
      // Call the Replicate API
      const prediction = await replicate.predictions.create({
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985", // IDM-VTON model
        input
      });
      
      // Poll for the result
      let result = null;
      let retries = 0;
      const maxRetries = 30; // 30 retries with 2-second intervals = max 60 seconds wait
      
      while (retries < maxRetries) {
        const latest = await replicate.predictions.get(prediction.id);
        
        if (latest.status === "succeeded") {
          result = latest.output;
          break;
        } else if (latest.status === "failed" || latest.status === "canceled") {
          throw new Error(`Try-on failed with status: ${latest.status}`);
        }
        
        // Wait for 2 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      }
      
      if (!result) {
        throw new Error("Try-on timed out");
      }
      
      return result; // This will be the URL to the generated image
    } catch (error) {
      console.error("Virtual Try-On failed:", error);
      throw error;
    }
  };
  
  // Function to start virtual try-on process
  const startVirtualTryOn = async (index: number) => {
    if (isLoadingTryOn[index]) return;
    
    // Set loading state
    setIsLoadingTryOn(prev => ({ ...prev, [index]: true }));
    setTryOnSteps(prev => ({ ...prev, [index]: "Starting try-on process..." }));
    
    const outfit = outfits[index];
    
    // Extract top and bottom garment items
    let topItem = null;
    let bottomItem = null;
    let dressItem = null;
    
    if (Array.isArray(outfit)) {
      topItem = outfit.find(i => i.type?.toLowerCase() === "top");
      bottomItem = outfit.find(i => i.type?.toLowerCase() === "bottom");
      dressItem = outfit.find(i => i.type?.toLowerCase() === "dress");
    } else {
      topItem = outfit.OutfitTop;
      bottomItem = outfit.OutfitBottom;
      dressItem = outfit.OutfitDress;
    }
    
    if (!topItem && !bottomItem && !dressItem) {
      console.error("No garments found in outfit");
      setIsLoadingTryOn(prev => ({ ...prev, [index]: false }));
      setTryOnSteps(prev => ({ ...prev, [index]: "Error: No garments found in this outfit" }));
      return;
    }
    
    // Initialize animation
    const newProgressAnim = new Animated.Value(0);
    const newFadeAnim = new Animated.Value(1);
    
    setProgressAnims(prev => ({ ...prev, [index]: newProgressAnim }));
    setFadeAnims(prev => ({ ...prev, [index]: newFadeAnim }));
    setMessageIndices(prev => ({ ...prev, [index]: 0 }));
    
    // Calculate number of items to determine duration
    const itemCount = (topItem ? 1 : 0) + (bottomItem ? 1 : 0) + (dressItem ? 1 : 0);
    const duration = itemCount > 1 ? 120000 : 60000; // 120 seconds for multiple items, 60 for single item
    
    // Start progress animation
    Animated.timing(newProgressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
    
    // Begin fading animated message cycle
    const localFadeAnim = newFadeAnim;
    let step = 0;
    const messageInterval = itemCount > 1 ? 20000 : 15000; // Longer interval for multiple items
    
    const showNextMessage = () => {
      if (step >= messages.length) return;
      
      Animated.sequence([
        Animated.timing(localFadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(localFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMessageIndices(prev => ({ ...prev, [index]: step }));
        step += 1;
        setTimeout(showNextMessage, messageInterval);
      });
    };
    showNextMessage();
    
    // Base model image URL
    const baseModelImageUrl = all_user_data.body_image;
    console.log(all_user_data.body_image)
    
    try {
      let finalImage = baseModelImageUrl;
      
      // Process dress if available (takes precedence as a complete outfit)
      if (dressItem) {
        const dressUrl = dressItem.url;
        const dressDescription = dressItem.description || "dress";
        
        setTryOnSteps(prev => ({ ...prev, [index]: "Processing dress..." }));
        
        // Request try-on for dress with dresses category
        const dressResult = await requestVirtualTryOn(dressUrl, finalImage, dressDescription, "dresses");
        finalImage = dressResult;

        console.log(finalImage)
        
        // Show the result immediately
        setTryOnImages(prev => ({ ...prev, [index]: finalImage }));
        setShowTryOn(prev => ({ ...prev, [index]: true }));
        setShowingTryOnPreview(prev => ({ ...prev, [index]: true }));
      } 
      // If no dress, process top and bottom separately
      else {
        // Process top first if available
        if (topItem) {
          const topUrl = topItem.url;
          const topDescription = topItem.description || "top garment";
          
          setTryOnSteps(prev => ({ ...prev, [index]: "Processing top garment..." }));
          
          // Request try-on for top with upper_body category
          const topResult = await requestVirtualTryOn(topUrl, finalImage, topDescription, "upper_body");
          finalImage = topResult; // Update the image to use for bottom
          
          // If only top, show the result immediately
          if (!bottomItem) {
            setTryOnImages(prev => ({ ...prev, [index]: finalImage }));
            setShowTryOn(prev => ({ ...prev, [index]: true }));
            setShowingTryOnPreview(prev => ({ ...prev, [index]: true }));
          }
        }
        
        // Process bottom if available
        if (bottomItem) {
          const bottomUrl = bottomItem.url;
          const bottomDescription = bottomItem.description || "bottom garment";
          
          setTryOnSteps(prev => ({ ...prev, [index]: topItem ? "Processing bottom garment..." : "Processing garment..." }));
          
          // Request try-on for bottom using the result from top (or base model if no top)
          // Use lower_body category for bottoms
          const bottomResult = await requestVirtualTryOn(bottomUrl, finalImage, bottomDescription, "lower_body");
          finalImage = bottomResult;
        }
        console.log(finalImage)

        // Show the final result
        setTryOnImages(prev => ({ ...prev, [index]: finalImage }));
        setShowTryOn(prev => ({ ...prev, [index]: true }));
        setShowingTryOnPreview(prev => ({ ...prev, [index]: true }));
      }
      
      setTryOnSteps(prev => ({ ...prev, [index]: "Try-on completed successfully!" }));
    } catch (error: any) {
      console.error("Virtual Try-On process failed:", error);
      setTryOnSteps(prev => ({ ...prev, [index]: `Error: ${error.message || "Try-on failed"}` }));
    } finally {
      // End loading state
      setIsLoadingTryOn(prev => ({ ...prev, [index]: false }));
    }
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
              {outfits.map((item, index) => {
              const isTryOnDone = !isLoadingTryOn[index] && showTryOn[index] && tryOnImages[index];
              return (
                <View key={index} style={[styles.slide, { width }]}>
                  {showTryOn[index] && tryOnImages[index] && showingTryOnPreview[index] ? (
                    <Image source={{ uri: tryOnImages[index] }} style={styles.tryonImage} resizeMode="contain" />
                  ) : (
                    <OutfitPreview items={item} occasion={occasion} />
                  )}
                  
                  {/* Progress bar and status */}
                  {isLoadingTryOn[index] && progressAnims[index] && fadeAnims[index] && (
                    <View style={styles.loaderContainer}>
                      <Animated.View style={{ opacity: fadeAnims[index], marginBottom: 8 }}>
                        <Text style={styles.loaderText}>
                          {messages[messageIndices[index] || 0]}
                        </Text>
                      </Animated.View>
                      <Text style={styles.stepText}>{tryOnSteps[index]}</Text>
                      <View style={styles.progressBarBackground}>
                        <Animated.View
                          style={[
                            styles.progressBarFill,
                            {
                              width: progressAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                              }),
                            },
                          ]}
                        />
                      </View>
                    </View>
                  )}
                  
                  {/* Small Preview after try-on */}
                  {isTryOnDone && (
                    <Pressable
                      style={styles.previewMini}
                      onPress={() =>
                        setShowingTryOnPreview(prev => ({ ...prev, [index]: !prev[index] }))
                      }
                    >
                      {showingTryOnPreview[index] ? (
                        <OutfitPreview items={item} occasion={occasion} />
                      ) : (
                        <Image source={{ uri: tryOnImages[index] }} style={styles.miniTryonImage} resizeMode="contain" />
                      )}
                    </Pressable>                  
                  )}
                </View>
              );
            })}
          </ScrollView>
          {outfits.length > 1 ? renderCarouselIndicators() : <></>}
        </View>
      </View>
      <View style={styles.bottomButtons}>
        {saveToLooks ? (
          <>
            <Pressable
              style={[
                styles.tryonButton,
                isLoadingTryOn[activeIndex] && { opacity: 0.5 },
              ]}
              disabled={isLoadingTryOn[activeIndex]}
              onPress={() => startVirtualTryOn(activeIndex)}
            >
              <Text style={styles.tryonText}>Virtual Try-On</Text>
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
    paddingBottom: 10,
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
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
  },  
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#843CA7',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tryonButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#843CA7',
    padding: 16,
    borderRadius: 32,
    gap: 8,
  },
  tryonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tryonImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  previewMini: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 120,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    elevation: 5,
    shadowRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  miniTryonImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  miniOutfitWrapper: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 0.48 }],
    justifyContent: 'center',
    alignItems: 'center',
    left:-5,
    bottom:15,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },  
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#843CA7',
    borderRadius: 8,
  },
  loaderText: {
    fontSize: 14,
    color: '#843CA7',
    fontWeight: '500',
    opacity: 0.9,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  }
});
export default OutfitPreviewScreen;
import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, View, Pressable, Dimensions, ScrollView, Modal, TouchableWithoutFeedback,Image } from 'react-native';
import CircularProgress from '../../components/CircularProgressBar';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OutfitPreview from '../../components/OutfitPreview';
import SafeScreen from '../../components/SafeScreen';
import { RootStackParamList } from '../../types/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { convertClothes, convertSavedOutfitUpload, isSavedOutfit, SavedOutfit, useOutfitStore } from '../../store/outfitStore';
import { AuthState, useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { Animated, Easing } from 'react-native';



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
  

  //tryon
  const [showTryOn, setShowTryOn] = useState<{ [index: number]: boolean }>({});
  const [tryOnImages, setTryOnImages] = useState<{ [index: number]: string }>({});
  const [timers, setTimers] = useState<{ [index: number]: number }>({});
  const [activeTimers, setActiveTimers] = useState<{ [index: number]: boolean }>({});
  const [isLoadingTryOn, setIsLoadingTryOn] = useState(true);
  const [countdown, setCountdown] = useState(60); // 60 seconds initially
  const [progressAnims, setProgressAnims] = useState<{ [key: number]: Animated.Value }>({});
  const [fadeAnims, setFadeAnims] = useState<{ [key: number]: Animated.Value }>({});
  const [messageIndices, setMessageIndices] = useState<{ [key: number]: number }>({});
    const messages = [
    "Analyzing outfit colors…",
    "Matching style preferences…",
    "Preparing virtual model…",
    "Finalizing your look!"
  ];

  useEffect(() => {
    if (isLoadingTryOn && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
  
      return () => clearInterval(timer);
    } else {
      setIsLoadingTryOn(false); // stop loading when countdown ends
    }
  }, [countdown, isLoadingTryOn]);
  
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

  const requestVirtualTryOn = async (payload: any): Promise<string | null> => {
    try {
      const res = await fetch('https://0mksma7zq2syj7-5000.proxy.runpod.net/inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          scale: 2.0,
          sample: 4,
          step: 20,
          seed: -1,
          gpu_id: 0
        }),
      });
  
      if (!res.ok) throw new Error('Try-on failed');
  
      const data = await res.json();
      return data?.image || null; // expecting base64 string here
    } catch (err) {
      console.error('Try-on error:', err);
      return null;
    }
  };

  const startVirtualTryOn = async (index: number) => {
    if (activeTimers[index]) return;
  
    const outfit = outfits[index];
  
    // Extract top and bottom
    const top = Array.isArray(outfit)
      ? outfit.find((i) => i.type?.toLowerCase() === "top")
      : outfit.OutfitTop;
  
    const bottom = Array.isArray(outfit)
      ? outfit.find((i) => i.type?.toLowerCase() === "bottom")
      : outfit.OutfitBottom;
  
    // Set dynamic duration
    const duration = top && bottom ? 120000 : 60000; // in ms
    const durationInSeconds = duration / 1000;
  
    // Mark as loading
    setActiveTimers((prev) => ({ ...prev, [index]: true }));
    setTimers((prev) => ({ ...prev, [index]: durationInSeconds }));
  
    // Initialize Animated values and message index
    const newProgressAnim = new Animated.Value(0);
    const newFadeAnim = new Animated.Value(1);
  
    setProgressAnims((prev) => ({ ...prev, [index]: newProgressAnim }));
    setFadeAnims((prev) => ({ ...prev, [index]: newFadeAnim }));
    setMessageIndices((prev) => ({ ...prev, [index]: 0 }));
  
    // Start progress animation
    Animated.timing(newProgressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  
    // Begin fading animated message cycle
    const localFadeAnim = newFadeAnim;
    let step = 0;
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
        setMessageIndices((prev) => ({ ...prev, [index]: step }));
        step += 1;
        setTimeout(showNextMessage, duration / messages.length); // divide message time
      });
    };
    showNextMessage();
  
    const modelImageUrl =
      "https://photos.peopleimages.com/picture/202304/2797874-a-fashion-portrait-and-woman-with-hands-in-pocket-with-happy-confidence.-full-body-beauty-and-weekend-style-lifestyle-model-standing-in-studio-with-casual-smile-on-face-isolated-on-a-png-background-fit_400_400.jpg";
  
    try {
      // TOP ONLY
      if (top && !bottom) {
        const result = await requestVirtualTryOn({
          cloth_type: "top",
          model_image_url: modelImageUrl,
          cloth_image_url: top.url,
        });
  
        if (result) {
          setTryOnImages((prev) => ({
            ...prev,
            [index]: `data:image/png;base64,${result}`,
          }));
          setShowTryOn((prev) => ({ ...prev, [index]: true }));
          setTimers((prev) => ({ ...prev, [index]: 0 })); // ⬅️ End timer early
        }
      }
  
      // BOTTOM ONLY
      else if (!top && bottom) {
        const result = await requestVirtualTryOn({
          cloth_type: "bottoms",
          model_image_url: modelImageUrl,
          cloth_image_url: bottom.url,
        });
  
        if (result) {
          setTryOnImages((prev) => ({
            ...prev,
            [index]: `data:image/png;base64,${result}`,
          }));
          setShowTryOn((prev) => ({ ...prev, [index]: true }));
          setTimers((prev) => ({ ...prev, [index]: 0 })); // ⬅️ End timer early
        }
      }
  
      // TOP + BOTTOM
      else if (top && bottom) {
        const topResult = await requestVirtualTryOn({
          cloth_type: "top",
          model_image_url: modelImageUrl,
          cloth_image_url: top.url,
        });
  
        if (!topResult) throw new Error("Top try-on failed");
  
        const bottomResult = await requestVirtualTryOn({
          cloth_type: "bottoms",
          model_image_base64: topResult,
          cloth_image_url: bottom.url,
        });
  
        if (bottomResult) {
          setTryOnImages((prev) => ({
            ...prev,
            [index]: `data:image/png;base64,${bottomResult}`,
          }));
          setShowTryOn((prev) => ({ ...prev, [index]: true }));
          setTimers((prev) => ({ ...prev, [index]: 0 })); // ⬅️ End timer early
        }
      }
    } catch (err) {
      console.error("Virtual Try-On failed:", err);
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
              const isTryOnDone = timers[index] === 0 && tryOnImages[index];
              return (
                <View key={index} style={[styles.slide, { width }]}>
                  {showTryOn[index] && isTryOnDone ? (
                    <View style={{ flex: 1, width: '100%', height: '100%' }}>
                      <Image
                        source={{ uri: tryOnImages[index] }}
                        style={styles.tryonImage}
                        resizeMode="contain"
                      />

                    </View>
                  ) : (
                    <OutfitPreview items={item} occasion={occasion} />
                  )}

                  {/* progress bar */}
                  {progressAnims[index] && fadeAnims[index] && (
                    <View style={styles.loaderContainer}>
                      <Animated.View style={{ opacity: fadeAnims[index], marginBottom: 8 }}>
                        <Text style={styles.loaderText}>
                          {messages[messageIndices[index] || 0]}
                        </Text>
                      </Animated.View>
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
                        setShowTryOn(prev => ({ ...prev, [index]: !prev[index] }))
                      }
                    >
                      {showTryOn[index] ? (
                        // Mini shows Outfit when Try-On is active
                        <View style={styles.miniOutfitWrapper}>
                          <OutfitPreview items={item} occasion={occasion} />
                        </View>
                      ) : (
                        // Mini shows Try-On when Outfit is active
                        <Image
                          source={{ uri: tryOnImages[index] }}
                          style={styles.miniTryonImage}
                          resizeMode="contain"
                        />
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
                activeTimers[activeIndex] && { opacity: 0.5 },
              ]}
              disabled={activeTimers[activeIndex]}
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
  loadingBarWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: 'center',
  },
  
  loadingBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
  },
  
  loadingProgress: {
    height: '100%',
    backgroundColor: '#843CA7',
    borderRadius: 10,
  },
  
  countdownText: {
    fontSize: 13,
    color: '#843CA7',
    fontWeight: '500',
  },
  timerBox: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  circularContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    padding: 6,
    elevation: 4,
  },
  
  circularText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#843CA7',
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
  extraItemBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  
  extraItemImage: {
    width: '90%',
    height: '90%',
    borderRadius: 8,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 10, // ⬅️ keeps it above the buttons (adjust as needed)
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
        
});

export default OutfitPreviewScreen;

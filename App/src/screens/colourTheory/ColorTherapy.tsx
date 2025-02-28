import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import SafeScreen from "../../components/SafeScreen";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const ColorTheoryScreen: React.FC = () => {
  const route = useRoute();
  const { imageUri } = route.params || {}; // Get image URI from previous screen

  // Selected Category
  const [selectedCategory, setSelectedCategory] = useState<"eye" | "hair" | "skin" | null>(null);

  // Animated values for height and movement
  const eyeHeight = useSharedValue(80);
  const hairHeight = useSharedValue(80);
  const skinHeight = useSharedValue(80);

  const eyeTranslateY = useSharedValue(0);
  const hairTranslateY = useSharedValue(0);
  const skinTranslateY = useSharedValue(0);

  // Function to handle taps and log coordinates
  const handleTap = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    console.log(`Tapped at X: ${locationX}, Y: ${locationY}`);
    
    // TODO: Call API here using locationX and locationY
  };

  // Function to select a category and animate its movement
  const selectCategory = (category: "eye" | "hair" | "skin") => {
    setSelectedCategory(category);

    // Reset all animations
    eyeHeight.value = withSpring(80);
    hairHeight.value = withSpring(80);
    skinHeight.value = withSpring(80);

    eyeTranslateY.value = withSpring(0);
    hairTranslateY.value = withSpring(0);
    skinTranslateY.value = withSpring(0);

    // Increase height & move selected box up
    if (category === "eye") {
      eyeHeight.value = withSpring(100);
      eyeTranslateY.value = withSpring(-10);
    }
    if (category === "hair") {
      hairHeight.value = withSpring(100);
      hairTranslateY.value = withSpring(-10);
    }
    if (category === "skin") {
      skinHeight.value = withSpring(100);
      skinTranslateY.value = withSpring(-10);
    }
  };

  // If no image is available, show a placeholder message
  if (!imageUri) {
    return (
      <SafeScreen>
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image Selected</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
<>    
{/* Image Display with Tap Capture */}
      <View style={styles.imageContainer}>
        <TouchableOpacity activeOpacity={1} onPress={handleTap} style={styles.touchableArea}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      </View>

      {/* Color Selection Boxes (Overlay at Bottom, Touching Each Other) */}
      <View style={styles.colorContainer}>
        <Animated.View style={[styles.colorBox, { backgroundColor: "#AABBCC", height: eyeHeight, transform: [{ translateY: eyeTranslateY }] }]}>
          <TouchableOpacity style={styles.fullTouchable} onPress={() => selectCategory("eye")}>
            <Text style={styles.colorText}>Eye</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.colorBox, { backgroundColor: "#DDBBAA", height: hairHeight, transform: [{ translateY: hairTranslateY }] }]}>
          <TouchableOpacity style={styles.fullTouchable} onPress={() => selectCategory("hair")}>
            <Text style={styles.colorText}>Hair</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.colorBox, { backgroundColor: "#FFCBA4", height: skinHeight, transform: [{ translateY: skinTranslateY }] }]}>
          <TouchableOpacity style={styles.fullTouchable} onPress={() => selectCategory("skin")}>
            <Text style={styles.colorText}>Skin</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
</>  );
};

export default ColorTheoryScreen;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  touchableArea: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  colorContainer: {
    position: "absolute",
    bottom: -20, // Start at bottom
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorBox: {
    flex: 1, // Make them equal in width
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fullTouchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  colorText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 18,
    color: "#666",
  },
});

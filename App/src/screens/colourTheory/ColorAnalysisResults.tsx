import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import SafeScreen from "../../components/SafeScreen";


const ColorAnalysisResultScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { data } = route.params || {};

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No Data Available</Text>
      </View>
    );
  }

  // Extract the first object from the array
  const analysisResult = data[0];

  return (
    <SafeScreen>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <IconButton icon="chevron-left" size={28} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Your Color Analysis Result</Text>
      </View>

      {/* Seasonal Color Type */}
      <View style={[styles.card, { backgroundColor: getSeasonalColor(analysisResult.seasonal_color_type) }]}>
        <Text style={styles.seasonText}>{analysisResult.seasonal_color_type}</Text>
        <Text style={styles.seasonDesc}>{getSeasonDescription(analysisResult.seasonal_color_type)}</Text>
      </View>

      {/* Expanded Details About Seasonal Color Type */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>What does this mean?</Text>
        <Text style={styles.sectionText}>{getSeasonMeaning(analysisResult.seasonal_color_type)}</Text>
      </View>

      {/* User's Detected Features */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>🌟 <Text style={styles.bold}>Skin Tone:</Text> {analysisResult.skin_tone}</Text>
        <Text style={styles.detailText}>✨ <Text style={styles.bold}>Undertone:</Text> {analysisResult.undertone}</Text>
        <Text style={styles.detailText}>💇 <Text style={styles.bold}>Hair Color:</Text> {analysisResult.hair_color}</Text>
        <Text style={styles.detailText}>👀 <Text style={styles.bold}>Eye Color:</Text> {analysisResult.eye_color}</Text>
      </View>

      {/* Style Recommendations */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>How to Style Yourself?</Text>
        <Text style={styles.sectionText}>{getStyleTips(analysisResult.seasonal_color_type)}</Text>
      </View>

      {/* Clothing Color Palette Preview */}
      <View style={styles.paletteContainer}>
        <Text style={styles.paletteTitle}>Your Best Colors:</Text>
        <FlatList
          data={analysisResult.clothing_color_palette}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.colorBox, { backgroundColor: item.hex }]}>
              <Text style={styles.colorName}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      {/* Button to Full Color Palette Screen */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("ColorPaletteScreen", { colors: analysisResult.clothing_color_palette })}
      >
        <Text style={styles.buttonText}>View Full Color Palette</Text>
      </Pressable>
    </ScrollView>
    </SafeScreen>
  );
};

export default ColorAnalysisResultScreen;

// Function to return background color based on the season
const getSeasonalColor = (season: string) => {
  switch (season) {
    case "Spring": return "#FFDAB9";
    case "Summer": return "#87CEEB";
    case "Autumn": return "#FF8C00";
    case "Winter": return "#4682B4";
    default: return "#DDD";
  }
};

// Function to return a longer season description
const getSeasonDescription = (season: string) => {
  const descriptions: Record<string, string> = {
    Spring: "Bright and warm colors suit you best.",
    Summer: "Cool, soft, and muted tones enhance your features.",
    Autumn: "Rich, earthy, and warm colors are ideal for you.",
    Winter: "Deep, bold, and contrasting shades complement your complexion."
  };
  return descriptions[season] || "No description available.";
};

// Function to explain the meaning of each season
const getSeasonMeaning = (season: string) => {
  const meanings: Record<string, string> = {
    Spring: "You look best in bright, warm, and clear colors. Your best shades include peach, coral, bright yellow, and warm greens.",
    Summer: "You have a cool undertone and look best in soft, cool, and pastel colors. Shades like lavender, baby blue, and soft pink are great for you.",
    Autumn: "Your warm and earthy undertones make you shine in rich, golden, and deep colors. Think mustard, olive green, burnt orange, and deep reds.",
    Winter: "Your striking contrast means you shine in bold and cool shades like deep blues, emerald green, icy pink, and crisp white."
  };
  return meanings[season] || "Your seasonal colors will bring out the best in you.";
};

// Function to provide styling tips
const getStyleTips = (season: string) => {
  const tips: Record<string, string> = {
    Spring: "Opt for light fabrics, floral prints, and golden accessories. Avoid heavy dark colors as they can overpower your features.",
    Summer: "Wear breezy pastel outfits with silver or rose gold accessories. Avoid earthy and too-dark tones that can make you look washed out.",
    Autumn: "Layer your outfits with deep, warm tones. Choose bronze or copper jewelry and avoid bright neon colors that clash with your warmth.",
    Winter: "Contrast is key! Pair deep, bold colors with crisp whites or blacks. Silver and platinum accessories work best for your features."
  };
  return tips[season] || "Follow the colors that enhance your natural features.";
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1, // Centers the title while keeping chevron left aligned
  },
  card: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  seasonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  seasonDesc: {
    fontSize: 14,
    textAlign: "center",
    color: "#FFF",
    marginTop: 8,
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  paletteContainer: {
    marginBottom: 20,
  },
  colorBox: {
    width: 100,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  colorName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  button: {
    backgroundColor: "#843CA7",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

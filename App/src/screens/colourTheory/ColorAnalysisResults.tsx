import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const ColorAnalysisResultScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { data } = route.params || {};

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No Data Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Your Color Analysis Result</Text>

      {/* Seasonal Color Type */}
      <View style={[styles.card, { backgroundColor: getSeasonalColor(data.seasonal_color_type) }]}>
        <Text style={styles.seasonText}>{data.seasonal_color_type}</Text>
        <Text style={styles.seasonDesc}>{getSeasonDescription(data.seasonal_color_type)}</Text>
      </View>

      {/* User's Detected Features */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>🌟 **Skin Tone:** {data.skin_tone}</Text>
        <Text style={styles.detailText}>✨ **Undertone:** {data.undertone}</Text>
        <Text style={styles.detailText}>💇 **Hair Color:** {data.hair_color}</Text>
        <Text style={styles.detailText}>👀 **Eye Color:** {data.eye_color}</Text>
      </View>

      {/* Button to Color Palette Screen */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("ColorPaletteScreen", { colors: data.clothing_color_palette })}
      >
        <Text style={styles.buttonText}>View Your Color Palette</Text>
      </Pressable>
    </View>
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

// Function to return season description
const getSeasonDescription = (season: string) => {
  const descriptions: Record<string, string> = {
    Spring: "Bright and warm colors suit you best.",
    Summer: "Cool, soft, and muted tones enhance your features.",
    Autumn: "Rich, earthy, and warm colors are ideal for you.",
    Winter: "Deep, bold, and contrasting shades complement your complexion."
  };
  return descriptions[season] || "No description available.";
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
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
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
  },
});

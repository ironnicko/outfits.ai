import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useColorAnalysisStore } from "../../store/ColorAnalysisStore"; // Zustand Store
const { width } = Dimensions.get("window");

const dummyData = [
  {
    seasonal_color_type: "Spring",
    skin_tone: "Light",
    undertone: "Warm",
  },
];

const ColorAnalysisReport = () => {
  const colorAnalysisResults =
    useColorAnalysisStore((state) => state.colorAnalysisResults) || dummyData; // ✅ Use dummy data if store is empty

  if (!colorAnalysisResults || !Array.isArray(colorAnalysisResults)) {
    return (
      <>
        {console.log(colorAnalysisResults)}
        <Text style={styles.errorText}>No color analysis data available.</Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Report</Text>
      <View style={styles.card}>
        {colorAnalysisResults.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <Image
              source={require("../../assets/life-ring.png")} // ✅ Placeholder icon
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              {/* ✅ Larger Seasonal Color Type */}
              <Text style={styles.label}>Seasonal Color Type</Text>
              <Text style={styles.seasonalText}>{result.seasonal_color_type}</Text>

              {/* ✅ Skin Tone and Undertone Side by Side */}
              <View style={styles.rowContainer}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Skin Tone</Text>
                  <Text style={styles.resultText}>{result.skin_tone}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Undertone</Text>
                  <Text style={styles.resultText}>{result.undertone}</Text>
                </View>
              </View>
              
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#843CA7",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#F0E9FF",
    borderRadius: 16,
    padding: 20,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    width: 40, // ✅ Smaller size
    height: 40,
    marginRight: 12,
    tintColor: "#4B0082",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  seasonalText: {
    fontSize: 18, // ✅ Larger size for seasonal type
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: "row", // ✅ Ensures Skin Tone and Undertone are side by side
    justifyContent: "space-between",
    marginTop: 8,
  },
  rowItem: {
    flex: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B0082",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});

export default ColorAnalysisReport;

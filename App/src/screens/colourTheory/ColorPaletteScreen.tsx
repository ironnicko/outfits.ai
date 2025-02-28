import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const ColorPaletteScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = route.params || {};

  if (!colors || colors.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No Colors Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Personalized Color Palette</Text>

      {/* Color Palette List */}
      <FlatList
        data={colors}
        keyExtractor={(item) => item.hex}
        renderItem={({ item }) => (
          <View style={[styles.colorBox, { backgroundColor: item.hex }]}>
            <Text style={styles.colorName}>{item.name}</Text>
            <Text style={styles.colorHex}>{item.hex}</Text>
          </View>
        )}
      />

      {/* Back Button */}
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
};

export default ColorPaletteScreen;

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
  colorBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  colorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  colorHex: {
    fontSize: 14,
    color: "#FFF",
  },
  button: {
    backgroundColor: "#843CA7",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
    marginTop: 20,
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

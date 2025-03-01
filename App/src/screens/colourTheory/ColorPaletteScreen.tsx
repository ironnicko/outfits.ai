import React, { useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, Modal, Pressable, Dimensions 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import SafeScreen from "../../components/SafeScreen";
import { useColorAnalysisStore } from "../../store/colorAnalysisStore";

const ColorPaletteScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = route.params || {};

  // State for modal
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);

  if (!colors || colors.length === 0) {
    return (
      <SafeScreen>
        <View style={styles.container}>
          <Text style={styles.errorText}>No Colors Available</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <IconButton icon="chevron-left" size={28} onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Your Personalized Color Palette</Text>
        </View>

        {/* Color Palette Grid */}
        <FlatList
          data={colors}
          keyExtractor={(item) => item.hex}
          numColumns={2} // Display in a grid format
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.colorBox, { backgroundColor: item.hex }]}
              onPress={() => setSelectedColor(item)}
            >
              <Text style={styles.colorName}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Full-Screen Color Modal */}
      <Modal visible={!!selectedColor} animationType="fade" transparent={false}>
        <View style={[styles.fullScreenColor, { backgroundColor: selectedColor?.hex }]}>
          <Text style={styles.fullScreenText}>{selectedColor?.name}</Text>
          <Text style={styles.fullScreenText}>{selectedColor?.hex}</Text>

          {/* Close Button */}
          <IconButton
            icon="close"
            size={30}
            iconColor="#FFF"
            style={styles.closeButton}
            onPress={() => setSelectedColor(null)}
          />
        </View>
      </Modal>
    </SafeScreen>
  );
};

export default ColorPaletteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 10,
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
    flex: 1, // Keeps title centered while back button is left-aligned
  },
  row: {
    justifyContent: "space-between",
  },
  colorBox: {
    flex: 1,
    margin: 8,
    aspectRatio: 1, // Makes square boxes
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  colorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
  },

  // Full-Screen Modal
  fullScreenColor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});

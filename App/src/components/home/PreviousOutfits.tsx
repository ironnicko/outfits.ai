import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useOutfitStore } from "../../store/outfitStore"; // adjust path if needed
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/types";

const { width } = Dimensions.get("window");

const PreviousOutfits = () => {
  const navigation = useNavigation<NavigationProp>();
  const outfits = useOutfitStore((state) => state.savedOutfits); // assumes savedOutfits is the key

  if (!outfits || outfits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No previous outfits yet. Start creating your first look!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Previous Outfits</Text>
      <FlatList
        data={outfits}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.imageContainer}
            onPress={() =>
              navigation.navigate("OutfitPreviewScreen", {
                outfits: [item],
                saveToLooks: false,
                occasion: item.occasion || "Previous Outfit",
              })
            }
          >
            <Image
              source={{ uri: item.generatedImage }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#843CA7",
    marginBottom: 10,
  },
  imageContainer: {
    width: width * 0.4,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#A3A3A3",
    fontSize: 15,
    fontStyle: "italic",
  },
});

export default PreviousOutfits;

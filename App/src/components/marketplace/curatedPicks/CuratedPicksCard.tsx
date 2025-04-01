import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Outfit } from "../../../store/curatedPicksStore";

interface CuratedPicksCardProps {
  outfit: Outfit;
}

const CuratedPicksCard: React.FC<CuratedPicksCardProps> = ({ outfit }) => {
  if (!outfit || outfit.items.length === 0) return null;

  const primaryItem = outfit.items[0];
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: outfit.generatedImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{primaryItem.title}</Text>
        <Text style={styles.price}>
          {primaryItem.currency} {primaryItem.price}
        </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 3 / 4, // ✅ Maintains proper aspect ratio
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#843CA7",
  },
  price: {
    fontSize: 16,
    color: "#666",
  },
});

export default CuratedPicksCard;

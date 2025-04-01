import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface CarouselItemProps {
  item: { title: string; subtitle: string; image: any };
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* Content Wrapper to prevent spillover */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.88,
    height: 140, // ✅ Slightly increased height for better proportion
    backgroundColor: "#F0E9FF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // ✅ For Android shadow
    marginHorizontal: 8,
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row", // ✅ Ensures text & image are side by side
    alignItems: "center",
  },
  textContainer: {
    flex: 1, // ✅ Ensures text takes available space
  },
  imageContainer: {
    flex: 1, // ✅ Image takes up 50% of the available space
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#843CA7",
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  image: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
});

export default CarouselItem;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/types";

const { width } = Dimensions.get("window");

const curatedPicks = [
  require("../../assets/curatedPicksPlaceholder.png"),
  require("../../assets/curatedPicksPlaceholder.png"),
  require("../../assets/curatedPicksPlaceholder.png"),
];

const CuratedPicks = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Text style={styles.title}>Check Out Curated Picks for You ›</Text>
      </Pressable>

      {/* Horizontal Scroll List */}
      <FlatList
        data={curatedPicks}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
          </View>
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
    width: width * 0.3, // ✅ 30% of screen width
    height: 200, // ✅ Fixed height
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default CuratedPicks;

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
import { useCuratedPicksStore } from "../../store/curatedPicksStore";
import useNavigationStore from '../../store/useNavigationStore';

const { width } = Dimensions.get("window");

const CuratedPicks = () => {
  const navigation = useNavigation<NavigationProp>();
  const curatedPicks = useCuratedPicksStore((state) => state.curatedPicks);
  const setActiveNavigator = useNavigationStore((state) => state.setActiveNavigator);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setActiveNavigator("Market")}>
        <Text style={styles.title}>Check Out Curated Picks for You ›</Text>
      </Pressable>

      {curatedPicks.length > 0 ? (
        <FlatList
          data={curatedPicks}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.generatedImage }} style={styles.image} />
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>
            You’ve seen all curated picks for today.
          </Text>
          <Text style={styles.emptyMessage}>Come back tomorrow for more!</Text>
        </View>
      )}
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
    width: width * 0.3,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyMessageContainer: {
    backgroundColor: "#F3E5F5",
    padding: 20,
    borderRadius: 12,
  },
  emptyMessage: {
    color: "#843CA7",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default CuratedPicks;

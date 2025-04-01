import React from "react";
import { View, StyleSheet, Text } from "react-native";
import CuratedPicksStack from "../../components/marketplace/curatedPicks/CuratedPicksStack";
import SafeScreen from "../../components/SafeScreen";
import { useCuratedPicksStore } from "../../store/curatedPicksStore";
import { useWishlistStore } from "../../store/WishlistStore";
import { useCartStore } from "../../store/cartStore";
import MarketplaceHeader from "../../components/marketplace/MarketplaceHeader";

const CuratedPicksScreen: React.FC = () => {
  const { curatedPicks, removeCuratedPick } = useCuratedPicksStore();
  const { addToWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  return (
    <SafeScreen>
      <MarketplaceHeader title="Curated Picks" />
      <View style={styles.container}>
        {curatedPicks.length === 0 ? (
          <Text style={styles.emptyText}>
            You’ve seen all your curated picks for the day.{"\n"}Come back tomorrow to see more ✨
          </Text>
        ) : (
          <CuratedPicksStack
            data={curatedPicks}
            onSwipeLeft={(outfit) => removeCuratedPick(outfit.id)}
            onSwipeRight={(outfit) => {
              outfit.items.forEach((item) => addToWishlist(item));
              removeCuratedPick(outfit.id);
            }}
            onSwipeUp={(outfit) => {
              outfit.items.forEach((item) => addToCart(item));
              removeCuratedPick(outfit.id);
            }}
          />
        )}
      </View>
    </SafeScreen>
  );
};

export default CuratedPicksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

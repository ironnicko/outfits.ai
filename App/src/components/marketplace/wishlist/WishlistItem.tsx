import React from "react";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { Product } from "../../../types/types";
import { useWishlistStore } from "../../../store/WishlistStore";
import { useCartStore } from "../../../store/cartStore";

interface Props {
  item: Product;
}

const WishlistItemCard: React.FC<Props> = ({ item }) => {
  const {
    isEditing,
    selectedItems,
    toggleSelectItem,
    toggleEditing,
  } = useWishlistStore();
  const { addToCart } = useCartStore();
  const navigation = useNavigation();

  const isSelected = selectedItems.includes(item.id);
  const hasDiscount = !!item.discountPercentage;
  const discountedPrice = hasDiscount
    ? Math.round(item.price * (1 - item.discountPercentage! / 100))
    : item.price;

  const longPressGesture = Gesture.LongPress().onStart(() => {
    if (!isEditing) {
      runOnJS(toggleEditing)();
    }
    runOnJS(toggleSelectItem)(item.id);
  });

  return (
    <GestureDetector gesture={longPressGesture}>
      <Pressable
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => {
          if (isEditing) {
            toggleSelectItem(item.id);
          } else {
            navigation.navigate("ArticleDetail", {
              product: item,
              similarWardrobe: item.similarFromWardrobe || [],
              similarGeneral: item.similarInMarketplace || [],
            });
          }
        }}
      >
        <Image
          source={{
            uri: item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300",
          }}
          style={styles.image}
        />

        {isEditing && (
          <View style={styles.selectIndicator}>
            <Icon
              name={isSelected ? "check-circle" : "circle-outline"}
              size={24}
              color="#843CA7"
            />
          </View>
        )}

        <Text style={styles.itemName} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {item.currency} {discountedPrice}
          </Text>
          {hasDiscount && (
            <Text style={styles.oldPrice}>
              {item.currency} {item.price}
            </Text>
          )}
        </View>
        {hasDiscount && (
          <Text style={styles.discount}>{item.discountPercentage}% OFF</Text>
        )}

        {/* ✅ Add to Cart Button */}
        <Pressable
          style={styles.cartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </Pressable>
      </Pressable>
    </GestureDetector>
  );
};

export default WishlistItemCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  selectedCard: {
    backgroundColor: "#FDE6EB",
    borderColor: "#FF4081",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderRadius: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 4,
    color: "#333",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#843CA7",
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#888",
    marginLeft: 6,
  },
  discount: {
    fontSize: 12,
    color: "red",
    marginTop: 2,
  },
  selectIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  cartButton: {
    marginTop: 10,
    backgroundColor: "#843CA7",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  cartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

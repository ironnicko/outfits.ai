import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Product } from "../../../types/types";
import { useNavigation } from "@react-navigation/native";

interface ProductCardProps {
  item: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const navigation = useNavigation();

  const hasDiscount = !!item.discountPercentage;
  const discountedPrice = hasDiscount
    ? Math.round(item.price * (1 - item.discountPercentage! / 100))
    : item.price;

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("ArticleDetail", {
          product: item,
          similarWardrobe: item.similarFromWardrobe || [],
          similarGeneral: item.similarInMarketplace || [],
        })
      }
    >
      <Image
        source={{
          uri:
            item.images.length > 0
              ? item.images[0]
              : "https://via.placeholder.com/300",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.brand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {item.currency} {discountedPrice}
          </Text>
          {hasDiscount && (
            <>
              <Text style={styles.originalPrice}>
                {item.currency} {item.price}
              </Text>
              <Text style={styles.discount}>
                {item.discountPercentage}% OFF
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    marginTop: 8,
  },
  brand: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#843CA7",
  },
  title: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#888",
    marginLeft: 6,
  },
  discount: {
    fontSize: 12,
    color: "red",
    marginLeft: 6,
  },
});

export default ProductCard;

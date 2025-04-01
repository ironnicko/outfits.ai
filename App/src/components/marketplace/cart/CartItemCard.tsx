import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Product } from "../../../types/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

interface Props {
  item: Product;
  size?: string;
  quantity?: number;
  onRemove?: () => void;
}

const CartItemCard: React.FC<Props> = ({
  item,
  size = "M",
  quantity = 1,
  onRemove,
}) => {
  const navigation = useNavigation();
  const discountedPrice = item.discountPercentage
    ? Math.round(item.price * (1 - item.discountPercentage / 100))
    : item.price;

  return (
    <TouchableOpacity onPress={() =>
      navigation.navigate("ArticleDetail", {
        product: item,
        similarWardrobe: item.similarFromWardrobe || [],
        similarGeneral: item.similarInMarketplace || [],
      })
    }>
      <View style={styles.container}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Size:</Text>
            <Text style={styles.value}>{size}</Text>
            <Text style={[styles.label, { marginLeft: 16 }]}>Qty:</Text>
            <Text style={styles.value}>{quantity}</Text>
            <Text style={styles.stock}>3 left</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.price}>₹{discountedPrice}</Text>
            {item.discountPercentage && (
              <Text style={styles.originalPrice}>₹{item.price}</Text>
            )}
          </View>
          <Text style={styles.saving}>You save ₹{item.price - discountedPrice}</Text>
          <Text style={styles.delivery}>Delivery by {item.deliveryTime}</Text>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
            <Icon name="delete-outline" size={20} color="#333" />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CartItemCard;


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  stock: {
    fontSize: 12,
    color: "red",
    marginLeft: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  saving: {
    fontSize: 12,
    color: "green",
  },
  delivery: {
    fontSize: 12,
    marginTop: 4,
    color: "#555",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  removeText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
  },
});
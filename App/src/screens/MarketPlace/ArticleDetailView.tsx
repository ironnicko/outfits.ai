import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/WishlistStore";
import { Product } from "../../types/types";
import SafeScreen from "../../components/SafeScreen";

const { width } = Dimensions.get("window");

const ArticleDetailView: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, similarWardrobe = [], similarGeneral = [] } = route.params as {
    product: Product;
    similarWardrobe: Product[];
    similarGeneral: Product[];
  };

  const [selectedColor, setSelectedColor] = useState(product.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || "");
  const { addToCart } = useCartStore();
  const { addToWishlist, wishlist } = useWishlistStore();

  const [liked, setLiked] = useState(wishlist.some((p) => p.id === product.id));

  const handleLike = () => {
    if (!liked) addToWishlist(product);
    setLiked(!liked);
  };

  const discountedPrice = product.discountPercentage
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : product.price;

  return (
    <SafeScreen>
    
      {/* Custom Back Button */}
      

      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#843CA7" />
      </TouchableOpacity>

        <View style={{ width: 24 }} />
        <TouchableOpacity onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Carousel */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {product.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.productInfo}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>
          ₹{discountedPrice}
          {product.discountPercentage && (
            <Text style={styles.originalPrice}> ₹{product.price}</Text>
          )}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Color</Text>
      <View style={styles.colorContainer}>
        {product.availableColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorCircle,
              {
                backgroundColor: color,
                borderWidth: selectedColor === color ? 2 : 0,
              },
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      {product.availableSizes?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizeContainer}>
            {product.availableSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBox,
                  selectedSize === size && styles.selectedSizeBox,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={styles.sizeText}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Product Details</Text>
      <Text style={styles.detailText}>{product.description}</Text>
      <Text style={styles.detailText}>• Brand: {product.brand}</Text>
      <Text style={styles.detailText}>• Category: {product.category}</Text>
      <Text style={styles.detailText}>• Material: {product.material}</Text>
      <Text style={styles.detailText}>• Fit: {product.fit}</Text>
      <Text style={styles.detailText}>• Style: {product.style}</Text>
      {product.occasion && <Text style={styles.detailText}>• Occasion: {product.occasion}</Text>}
      {product.features?.map((feature, index) => (
        <Text key={index} style={styles.detailText}>• {feature}</Text>
      ))}

      <Text style={styles.sectionTitle}>Similar Clothes from Your Wardrobe</Text>
      <FlatList
        horizontal
        data={similarWardrobe}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Similar Clothes in General</Text>
      <FlatList
        horizontal
        data={similarGeneral}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        )}
      />
    </ScrollView>

      <TouchableOpacity style={styles.addToCart} onPress={() => addToCart(product)}>
        <Text style={styles.addToCartText}>Add to Bag</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  image: {
    width: width,
    height: 400,
    resizeMode: "cover",
  },
  productInfo: {
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#843CA7",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  originalPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 16,
  },
  colorContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderColor: "#843CA7",
  },
  sizeContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sizeBox: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
  },
  selectedSizeBox: {
    backgroundColor: "#843CA7",
  },
  sizeText: {
    fontSize: 16,
    color: "black",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
    marginVertical: 2,
  },
  card: {
    width: 120,
    marginHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
  },
  cardImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  addToCart: {
    backgroundColor: "#843CA7",
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default ArticleDetailView;

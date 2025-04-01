import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { useCartStore } from "../../store/cartStore";
import CartItemCard from "../../components/marketplace/cart/CartItemCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const CartScreen: React.FC = () => {
  const { cart, removeFromCart } = useCartStore();
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const orderAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const orderSavings = cart.reduce(
    (sum, item) =>
      item.discountPercentage
        ? sum + item.price * (item.discountPercentage / 100)
        : sum,
    0
  );
  const deliveryFee = 0;
  const platformFee = 19;
  const total = orderAmount - orderSavings + platformFee + deliveryFee;

  const scrollToPaymentDetails = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Bag ({cart.length} product{cart.length !== 1 ? "s" : ""})
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Wishlist")}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Address */}
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={18} color="#843CA7" />
              <Text style={styles.addressText}>
                <Text style={{ fontWeight: "bold" }}>Avya</Text> | FF21 - Lit, Kumarapalli, Thubarahalli, 560066
              </Text>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Cart Items */}
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CartItemCard
                  item={item}
                  onRemove={() => removeFromCart(item.id)}
                />
              )}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />

            {/* Order Payment Details */}
            <View style={styles.paymentDetails}>
              <Text style={styles.sectionTitle}>Order Payment Details</Text>
              <Text>Order Amount: ₹{orderAmount.toFixed(2)}</Text>
              <Text>Order Saving: - ₹{orderSavings.toFixed(2)}</Text>
              <Text>Delivery Fee: Free</Text>
              <Text>Platform Fee: ₹{platformFee.toFixed(2)}</Text>
              <Text style={styles.total}>Order Total: ₹{total.toFixed(2)}</Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={scrollToPaymentDetails}
            >
              <Text style={styles.proceedText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeScreen>
  );
};

export default CartScreen;



const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    color: "#333",
  },
  changeText: {
    color: "#843CA7",
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  paymentDetails: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#843CA7",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 26,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  proceedButton: {
    backgroundColor: "#843CA7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  proceedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  
});

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/types";

interface MarketplaceHeaderProps {
  title: string;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => navigation.navigate("Wishlist")}>
          <Icon name="heart-outline" size={28} color={"#843CA7"} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Cart")}>
          <Icon name="cart-outline" size={28} color={"#843CA7"} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#843CA7",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 16,
  },
});

export default MarketplaceHeader;

import React from "react";
import { FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";
import { Product } from "../../../types/types";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => <ProductCard item={item} />}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default ProductGrid;

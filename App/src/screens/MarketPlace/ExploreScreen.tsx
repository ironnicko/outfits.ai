import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SafeScreen from "../../components/SafeScreen";
import MarketplaceHeader from "../../components/marketplace/MarketplaceHeader";
import SearchBar from "../../components/marketplace/explore/SearchBar";
import CategoryFilter from "../../components/marketplace/explore/CategoryFilter";
import ProductGrid from "../../components/marketplace/explore/ProductGrid";
import { useExploreStore } from "../../store/exploreStore"; // Import Zustand store

const categories = ["All", "Jackets", "T-Shirts", "Shoes", "Accessories"];

const ExploreScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch products from Zustand store
  const { products } = useExploreStore();

  // Filter products based on category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <SafeScreen>
      <MarketplaceHeader title="Explore" />
      <SearchBar placeholder="Search for products" />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProductGrid products={filteredProducts} />
    </SafeScreen>
  );
};

export default ExploreScreen;

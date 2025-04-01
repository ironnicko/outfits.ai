import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.category,
            selectedCategory === item && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(item)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === item && styles.selectedText,
            ]}
          >
            {item}
          </Text>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  category: {
    height: 36,                  // 👈 Fixed height
    paddingHorizontal: 14,
    justifyContent: "center",   // 👈 Center text vertically
    backgroundColor: "#F5F5F5",
    borderRadius: 18,           // Half of height for pill shape
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#843CA7",
  },
  categoryText: {
    fontSize: 13,
    color: "#666",
  },
  selectedText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});


export default CategoryFilter;

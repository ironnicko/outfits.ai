import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useClothingStore } from "../../store/clothingStore";
import { useOutfitStore } from "../../store/outfitStore";

interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

const Checklist: React.FC = () => {
  const clothes = useClothingStore((state) => state.clothes);
  const outfits = useOutfitStore((state) => state.outfits);

  const checklistItems: ChecklistItem[] = [
    {
      id: "add_articles",
      label: "Add at least 3 articles",
      isCompleted: clothes.length >= 3,
    },
    {
      id: "create_outfits",
      label: "Create 2 or more outfits",
      isCompleted: outfits.length >= 2,
    },
  ];

  const filteredItems = checklistItems.filter((item) => !item.isCompleted);

  if (filteredItems.length === 0) return null;

  return (
    <View style={styles.container}>
      {filteredItems.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.circle} />
          <Text style={styles.text}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9F9D9",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2E7D32",
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "600",
  },
});

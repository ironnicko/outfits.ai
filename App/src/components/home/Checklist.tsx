import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface ChecklistItem {
  id: string;
  label: string;
  completedCount: number;
  totalCount: number;
  completed: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onToggleItem }) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <Pressable key={item.id} onPress={() => onToggleItem(item.id)} style={styles.itemContainer}>
          <View style={[styles.circle, item.completed && styles.completedCircle]} />
          <Text style={[styles.text, item.completed && styles.completedText]}>
            {item.label}
          </Text>
          <Text style={styles.progress}>
            {item.completedCount}/{item.totalCount}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12, // Space between items
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9F9D9", // ✅ Neon Green Background
    borderRadius: 32, // ✅ Rounded Corners
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2E7D32", // ✅ Green Circle Border
  },
  completedCircle: {
    backgroundColor: "#2E7D32",
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#2E7D32", // ✅ Green Text
    fontWeight: "600",
  },
  completedText: {
    color: "#A3A3A3",
  },
  progress: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A3A3A3", // ✅ Gray Progress Count
  },
});

export default Checklist;

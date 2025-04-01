import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="magnify" size={24} color={"#AAA"} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
});

export default SearchBar;

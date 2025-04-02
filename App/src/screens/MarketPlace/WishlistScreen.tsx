import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import SafeScreen from "../../components/SafeScreen";
import { useWishlistStore } from "../../store/WishlistStore";
import WishlistItemCard from "../../components/marketplace/wishlist/WishlistItem";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const WishlistScreen = () => {
  const navigation = useNavigation();
  const {
    wishlist,
    selectedItems,
    isEditing,
    toggleEditing,
    removeSelectedItems,
    resetSelection,
  } = useWishlistStore();

  return (
    <SafeScreen>
      <GestureHandlerRootView>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>{isEditing ? "Items Selected" : "Wishlist"}</Text>
        <View style={styles.headerIcons}>
          {isEditing ? (
            <>
              <Pressable
                onPress={() =>
                  Alert.alert("Feature Coming Soon", "Sharing is in development!")
                }
              >
                <Icon name="share-variant" size={24} color="#843CA7" />
              </Pressable>
              <Pressable
                onPress={() =>
                  Alert.alert("Remove Items", "Are you sure?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Remove",
                      onPress: removeSelectedItems,
                      style: "destructive",
                    },
                  ])
                }
              >
                <Icon name="delete-outline" size={24} color="red" />
              </Pressable>
              <Pressable onPress={resetSelection}>
                <Icon name="close" size={24} color="gray" />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={toggleEditing}>
              <Icon name="pencil" size={24} color="#843CA7" />
            </Pressable>
          )}
        </View>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WishlistItemCard item={item} />}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
      </GestureHandlerRootView>
    </SafeScreen>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#843CA7",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  list: {
    padding: 10,
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

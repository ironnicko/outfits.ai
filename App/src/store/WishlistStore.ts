import { create } from "zustand";
import { Product } from "../types/types"; // Import the common Product interface

interface WishlistState {
  wishlist: Product[];
  selectedItems: string[];
  isEditing: boolean;
  
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: string) => void;
  toggleEditing: () => void;
  toggleSelectItem: (id: string) => void;
  removeSelectedItems: () => void;
  resetSelection: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  selectedItems: [],
  isEditing: false,

  addToWishlist: (item) =>
    set((state) => {
      if (!state.wishlist.find((p) => p.id === item.id)) {
        return { wishlist: [...state.wishlist, item] };
      }
      return state;
    }),

  removeFromWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    })),

  toggleEditing: () =>
    set((state) => ({ isEditing: !state.isEditing, selectedItems: [] })),

  toggleSelectItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(id)
        ? state.selectedItems.filter((itemId) => itemId !== id)
        : [...state.selectedItems, id],
    })),

  removeSelectedItems: () =>
    set((state) => ({
      wishlist: state.wishlist.filter(
        (item) => !state.selectedItems.includes(item.id)
      ),
      selectedItems: [],
      isEditing: false,
    })),

  resetSelection: () => set({ selectedItems: [], isEditing: false }),
}));

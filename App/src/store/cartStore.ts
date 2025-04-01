import { create } from "zustand";
import { Product } from "../types/types"; // Import the common Product interface

interface CartState {
  cart: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),

  // Add a remove from cart function
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));

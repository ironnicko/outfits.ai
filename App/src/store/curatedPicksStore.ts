import { create } from "zustand";
import { Product } from "../types/types";

export interface Outfit {
  id: string;
  items: Product[];
  generatedImage: string;
}

interface CuratedPicksState {
  curatedPicks: Outfit[];
  addCuratedPick: (outfit: Outfit) => void;
  removeCuratedPick: (id: string) => void;
  clearCuratedPicks: () => void;
}

const dummyProducts: Product[] = [
  {
    id: "top-1",
    title: "Classic White T-Shirt",
    description: "A timeless white tee made from premium cotton.",
    brand: "Uniqlo",
    category: "T-Shirts",
    price: 799,
    currency: "INR",
    discountPercentage: 10,
    images: ["https://m.media-amazon.com/images/I/91w-N60wCRL._AC_UY1100_.jpg"],
    availableColors: ["#FFFFFF"],
    availableSizes: ["S", "M", "L"],
    material: "Cotton",
    fit: "Regular",
    style: "Casual",
    rating: 4.2,
    totalReviews: 135,
    seller: "Uniqlo Official",
    deliveryTime: "2-4 days",
    returnPolicy: "10-day return",
  },
  {
    id: "bottom-1",
    title: "Slim Fit Jeans",
    description: "Denim jeans with a sleek slim fit design.",
    brand: "Levi's",
    category: "Bottoms",
    price: 2499,
    currency: "INR",
    discountPercentage: 20,
    images: ["https://www.crossjeans.com/cdn/shop/files/E_198_083_cross_jeans_null_1_1445x.jpg?v=1712167790"],
    availableColors: ["#000080"],
    availableSizes: ["30", "32", "34"],
    material: "Denim",
    fit: "Slim",
    style: "Casual",
    rating: 4.5,
    totalReviews: 220,
    seller: "Levi's India",
    deliveryTime: "3-5 days",
    returnPolicy: "15-day return",
  },
  {
    id: "shoes-1",
    title: "White Sneakers",
    description: "Minimal white sneakers perfect for everyday use.",
    brand: "Nike",
    category: "Shoes",
    price: 3999,
    currency: "INR",
    discountPercentage: 15,
    images: ["https://cdn.luxe.digital/media/20220421155533/best-white-sneakers-men-luxe-digital-1200x600.jpg"],
    availableColors: ["#FFFFFF"],
    availableSizes: ["7", "8", "9", "10"],
    material: "Synthetic",
    fit: "Regular",
    style: "Casual",
    rating: 4.7,
    totalReviews: 340,
    seller: "Nike India",
    deliveryTime: "2-3 days",
    returnPolicy: "7-day return",
  },
];

export const useCuratedPicksStore = create<CuratedPicksState>((set) => ({
  curatedPicks: [
    {
      id: "outfit-001",
      items: dummyProducts,
      generatedImage: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?cs=srgb&dl=pexels-frendsmans-1926769.jpg&fm=jpg",
    },
  ],
  addCuratedPick: (outfit) =>
    set((state) => ({ curatedPicks: [...state.curatedPicks, outfit] })),
  removeCuratedPick: (id) =>
    set((state) => ({
      curatedPicks: state.curatedPicks.filter((outfit) => outfit.id !== id),
    })),
  clearCuratedPicks: () => set({ curatedPicks: [] }),
}));

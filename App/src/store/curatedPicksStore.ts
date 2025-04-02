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

  // 🆕 NEW ITEMS
  {
    id: "hat-1",
    title: "Bucket Hat",
    description: "Trendy black bucket hat for summer style.",
    brand: "Zara",
    category: "Accessories",
    price: 599,
    currency: "INR",
    discountPercentage: 5,
    images: ["https://static.zara.net/photos///2022/V/0/1/p/8057/350/800/2/w/850/8057350800_6_1_1.jpg?ts=1652170739634"],
    availableColors: ["#000000"],
    availableSizes: ["Free"],
    material: "Cotton Blend",
    fit: "One Size",
    style: "Streetwear",
    rating: 4.3,
    totalReviews: 80,
    seller: "Zara India",
    deliveryTime: "3-6 days",
    returnPolicy: "7-day return",
  },
  {
    id: "top-4",
    title: "Beige Hoodie",
    description: "Soft beige hoodie for cozy vibes.",
    brand: "H&M",
    category: "Sweatshirts",
    price: 1799,
    currency: "INR",
    discountPercentage: 12,
    images: ["https://lp2.hm.com/hmgoepprod?set=source[/a7/fd/a7fd12c73c18cd5dc0fc6a558720e26a81692f4e.jpg],origin[dam],category[men_sweatshirts],type[LOOKBOOK],res[y],hmver[1]&call=url[file:/product/fullscreen]"],
    availableColors: ["#F5F5DC"],
    availableSizes: ["S", "M", "L"],
    material: "Fleece",
    fit: "Oversized",
    style: "Casual",
    rating: 4.6,
    totalReviews: 210,
    seller: "H&M India",
    deliveryTime: "2-3 days",
    returnPolicy: "10-day return",
  },
  {
    id: "shoes-4",
    title: "Chunky Black Boots",
    description: "Heavy-duty black boots with chunky soles.",
    brand: "Dr. Martens",
    category: "Shoes",
    price: 7999,
    currency: "INR",
    discountPercentage: 10,
    images: ["https://cdn11.bigcommerce.com/s-jtn9l9v/product_images/uploaded_images/drmartens-1460-boots-1.jpg"],
    availableColors: ["#000000"],
    availableSizes: ["6", "7", "8", "9"],
    material: "Leather",
    fit: "Regular",
    style: "Grunge",
    rating: 4.8,
    totalReviews: 390,
    seller: "Dr. Martens",
    deliveryTime: "5-7 days",
    returnPolicy: "15-day return",
  },
];

export const useCuratedPicksStore = create<CuratedPicksState>((set) => ({
  curatedPicks: [
    {
      id: "outfit-001",
      items: dummyProducts,
      generatedImage: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?cs=srgb&dl=pexels-frendsmans-1926769.jpg&fm=jpg",
    },
    {
      id: "outfit-004",
      items: [
        dummyProducts.find(p => p.id === "top-4")!,
        dummyProducts.find(p => p.id === "bottom-1")!,
        dummyProducts.find(p => p.id === "shoes-4")!,
      ],
      generatedImage: "https://images.pexels.com/photos/1632781/pexels-photo-1632781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
      id: "outfit-005",
      items: [
        dummyProducts.find(p => p.id === "top-1")!,
        dummyProducts.find(p => p.id === "bottom-1")!,
        dummyProducts.find(p => p.id === "shoes-1")!,
        dummyProducts.find(p => p.id === "hat-1")!,
      ],
      generatedImage: "https://images.pexels.com/photos/1852389/pexels-photo-1852389.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
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

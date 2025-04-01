import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SelectedClothing } from "../../src_old/screens/generateOutfits/GenerateOutfitsScreen";
import { Clothes } from '../store/clothingStore';
import { SavedOutfit } from "../store/outfitStore";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface Product {
  id: string; // Unique identifier
  title: string;
  description: string; // Long-form product details
  brand: string;
  category: string; // e.g. "Shirt", "Shoes", "Accessories"

  // Pricing
  price: number;
  currency: string; // "INR", "USD", etc.
  discountPercentage?: number; // Optional discount

  // Images & Media
  images: string[]; // Array of image URLs
  videos?: string[]; // Optional array of video URLs

  // Variants
  availableColors: string[]; // Hex codes or color names
  availableSizes?: string[]; // Optional: ["S", "M", "L", "XL"]
  stock?: Record<string, number>; // Optional: Size-wise stock levels (if applicable)

  // Product Details
  material: string;
  fit: string; // Slim, Regular, Oversized
  style: string; // Casual, Formal, Ethnic, etc.
  occasion?: string; // Optional field (Party, Office, etc.)
  features?: string[]; // Additional highlights

  // Ratings & Reviews
  rating: number; // Average rating (out of 5)
  totalReviews: number;
  customerFeedback?: { [key: string]: number }; // Word cloud (e.g. { "Good Fit": 25, "Soft Fabric": 12 })

  // Seller Information
  seller: string;
  deliveryTime: string; // "2-5 days"
  returnPolicy: string; // "10-day return"

  // Similar Products
  similarFromWardrobe?: Product[];
  similarInMarketplace?: Product[];
}



export type RootStackParamList = {
  WelcomeScreen: undefined;

  newUserOnboarding: undefined;

  Home: undefined;
  OutfitPreview: {
    occasion?: string;

    outfits: SavedOutfit | Clothes[];
  };
  OutfitPreviewScreen: {
    occasion?: string;
    saveToLooks: boolean;
    outfits: SavedOutfit[] | Clothes[][];
  };
  MyLooks: undefined;
  Login: undefined;
  Signup: undefined
  MainTabs: undefined;
  OutfitCheck: undefined;
  GenerateOutfits: undefined;
  Onboarding: undefined;
  Notifications: undefined;
  Tutorials: undefined;
  Support: undefined;
  About: undefined;
  SelectClothingItem: { type: string; onSelect: (clothing: SelectedClothing) => void };
  OccasionSelect: { onSelect: (occasion: string) => void }
  MixAndMatch: undefined;
  Profile: undefined;
  ColorTheory: { imageUri: string };  
  InstructionsScreen: undefined;
  MixAndMatchResult:
  {
    data: MixMatchItems
    imageURI: string
  };
  ClothingDetail: {
    item: Clothes;
  };
  OutfitCheckResult: {
    result: {
      DoingWell: string;
      Improvements: string;
      NotDoingWell: string;
      Score: number;
    };
    imageUri: string | undefined;
  };
  ColorTherapyLanding: undefined;
  ColorAnalysisResult: {
    result: {
      color: string;
      explanation: string;
      imageUri: string;
    };
  };
  ColorPaletteScreen: {
    colors: string[];
  };
  Explore: undefined;
  Wishlist: undefined;
  ArticleDetail: {
      product: Product;
      similarWardrobe: Product[];
      similarGeneral: Product[];
    };
  MarketPlace: undefined;
  Cart: undefined;
};

export type MixMatchItems = {
  clothes: Clothes[],
  rating: number,
  explanation: string,

}
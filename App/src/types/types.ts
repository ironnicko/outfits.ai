import { SelectedClothing } from "../screens/generateOutfits/GenerateOutfitsScreen";
import { Clothes } from '../store/clothingStore';
import { SavedOutfit } from "../store/outfitStore";

export type RootStackParamList = {
  Home: undefined;
  OutfitPreview: {
    occasion?: string;
    outfits: SavedOutfit | Clothes[];
  };
  OutfitPreviewScreen: {
    occasion?: string;
    outfits: SavedOutfit[] | Clothes[][];
  };
  MyLooks: undefined;
  Login: undefined;
  MainTabs: undefined;
  OutfitCheck: undefined;
  GenerateOutfits: undefined;
  Notifications: undefined;
  Tutorials: undefined;
  Support: undefined;
  About: undefined;
  SelectClothingItem: { type: string; onSelect: (clothing: SelectedClothing) => void };
  OccasionSelect: { onSelect: (occasion: string) => void }
  MixAndMatch: undefined;
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
    imageUri: string;
  };
  MixAndMatchResult: {
    result: {
      rating: number;
      recommendation: string;
      similarItems: {
        id: string;
        imageUrl: string;
        url?: string;
      }[];
      explanation: string;
    };
    imageUri: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  MyLooks: undefined;
  Wardrobe: undefined;
  Settings: undefined;
}; 
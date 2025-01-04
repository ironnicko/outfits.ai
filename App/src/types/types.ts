import { SelectedClothing } from "../screens/generateOutfits/GenerateOutfitsScreen";
import { Clothes } from '../store/clothingStore';

export type RootStackParamList = {
  Home: undefined;
  OutfitPreview: {
    selectedItems?: SelectedClothing[];
    occasion?: string;
    outfits?: any;
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
};

export type MainTabParamList = {
  Home: undefined;
  MyLooks: undefined;
  Wardrobe: undefined;
  Settings: undefined;
}; 
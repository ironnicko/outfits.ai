import { SelectedClothing } from "../screens/generateOutfits/GenerateOutfitsScreen";

export type RootStackParamList = {
  Home: undefined;
  OutfitPreview: {
    selectedItems: SelectedClothing[];
    occasion?: string;
  };
  ShowOutfits: { selectedItems: SelectedClothing[]; }
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
  AIRecommendation: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MyLooks: undefined;
  Wardrobe: undefined;
  Settings: undefined;
}; 